# 部门字段 MVP 实现指南

> 基于现有文档的简化实现方案，循序渐进地添加部门功能

## 一、实现目标

### 1.1 核心功能

1. ✅ **User 表添加主部门字段**：每个用户有一个主部门
2. ✅ **创建 Department 表**：简单的部门表
3. ✅ **CreatedByDepartment 字段类型**：记录创建时自动填充创建人的主部门
4. ✅ **Department 字段类型**：普通部门选择字段，可手动选择
5. ✅ **按部门过滤查询**：视图和过滤器支持部门查询

### 1.2 实现效果

```
用户张三的主部门：技术部 (001001)

创建记录时：
- __created_by_department 自动填充为：技术部 (001001)
- 可以手动选择其他部门字段（如"负责部门"）

查询时：
- 可以按创建部门过滤
- 可以按负责部门过滤
```

## 二、数据库改造

### 2.1 修改 User 表

在现有的 `users` 表中添加主部门字段：

```sql
-- PostgreSQL
ALTER TABLE users 
ADD COLUMN primary_department_id VARCHAR,
ADD COLUMN primary_department_name VARCHAR,
ADD COLUMN primary_department_code VARCHAR;

-- SQLite
ALTER TABLE users ADD COLUMN primary_department_id TEXT;
ALTER TABLE users ADD COLUMN primary_department_name TEXT;
ALTER TABLE users ADD COLUMN primary_department_code TEXT;
```

```prisma
// packages/db-main-prisma/prisma/template.prisma

model User {
  id                     String    @id @default(cuid())
  name                   String
  email                  String    @unique
  // ... 其他现有字段 ...
  
  // 新增：主部门信息（简化版本）
  primaryDepartmentId    String?   @map("primary_department_id")
  primaryDepartmentName  String?   @map("primary_department_name")
  primaryDepartmentCode  String?   @map("primary_department_code")
  
  // ... 其他字段 ...
  @@map("users")
}
```

### 2.2 创建 Department 表

创建一个简单的部门表：

```prisma
// packages/db-main-prisma/prisma/template.prisma

model Department {
  id          String    @id @default(cuid())
  name        String                            // 部门名称
  code        String    @unique                 // 部门编码（如：001001）
  parentId    String?   @map("parent_id")      // 父部门ID
  path        String?                           // 路径（如：/001/001001/）
  level       Int       @default(1)             // 层级
  description String?                           // 描述
  status      String    @default("active")      // 状态：active/inactive
  
  createdTime      DateTime  @default(now()) @map("created_time")
  lastModifiedTime DateTime? @updatedAt @map("last_modified_time")
  
  @@index([status])
  @@index([parentId])
  @@map("department")
}
```

### 2.3 迁移脚本

```typescript
// packages/db-main-prisma/prisma/migrations/xxx_add_department/migration.sql

-- 创建部门表
CREATE TABLE "department" (
  "id" VARCHAR PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "code" VARCHAR UNIQUE NOT NULL,
  "parent_id" VARCHAR,
  "path" VARCHAR,
  "level" INTEGER DEFAULT 1,
  "description" VARCHAR,
  "status" VARCHAR DEFAULT 'active',
  "created_time" TIMESTAMP DEFAULT NOW(),
  "last_modified_time" TIMESTAMP
);

CREATE INDEX "idx_department_status" ON "department"("status");
CREATE INDEX "idx_department_parent_id" ON "department"("parent_id");

-- 修改用户表
ALTER TABLE "users" ADD COLUMN "primary_department_id" VARCHAR;
ALTER TABLE "users" ADD COLUMN "primary_department_name" VARCHAR;
ALTER TABLE "users" ADD COLUMN "primary_department_code" VARCHAR;

-- 插入默认部门（可选）
INSERT INTO "department" ("id", "name", "code", "level", "path") VALUES
  ('dept_default', '默认部门', '001', 1, '/001/');
```

## 三、字段类型实现

### 3.1 添加字段类型枚举

```typescript
// packages/core/src/models/field/constant.ts

export enum FieldType {
  // ... 现有类型 ...
  CreatedBy = 'createdBy',
  LastModifiedBy = 'lastModifiedBy',
  
  // 新增部门字段类型
  Department = 'department',                           // 普通部门字段（可选择）
  CreatedByDepartment = 'createdByDepartment',        // 创建人部门（自动）
  LastModifiedByDepartment = 'lastModifiedByDepartment', // 最后修改人部门（自动）
}
```

### 3.2 实现 Department 字段类型（普通选择字段）

```typescript
// packages/core/src/models/field/derivate/department.field.ts

import { z } from 'zod';
import { CellValueType, DbFieldType, FieldType } from '../constant';
import { FieldCore } from '../field';

// 部门字段选项
export const departmentFieldOptionsSchema = z.object({
  // 可以为空
}).optional();

export type IDepartmentFieldOptions = z.infer<typeof departmentFieldOptionsSchema>;

// 部门字段值
export interface IDepartmentCellValue {
  id: string;       // 部门ID
  name: string;     // 部门名称
  code: string;     // 部门编码
}

export class DepartmentFieldCore extends FieldCore {
  type = FieldType.Department as const;
  
  cellValueType = CellValueType.String;
  
  dbFieldType = DbFieldType.Json;  // 存储为 JSON
  
  options?: IDepartmentFieldOptions;
  
  isComputed = false;  // 可以手动编辑
  
  // 转换为字符串显示
  item2String(value?: unknown): string {
    if (!value) return '';
    const dept = value as IDepartmentCellValue;
    return `${dept.name} (${dept.code})`;
  }
  
  cellValue2String(value?: unknown): string {
    return this.item2String(value);
  }
  
  // 从字符串转换（用于导入）
  convertStringToCellValue(str: string): unknown {
    if (!str) return null;
    // 简单实现：只支持部门ID
    return { id: str };
  }
  
  repair(value: unknown): unknown {
    if (!value) return null;
    
    // 验证格式
    if (typeof value === 'object' && value !== null) {
      const dept = value as any;
      if (dept.id && dept.name && dept.code) {
        return {
          id: dept.id,
          name: dept.name,
          code: dept.code,
        };
      }
    }
    
    return null;
  }
  
  validateOptions() {
    return departmentFieldOptionsSchema.safeParse(this.options);
  }
  
  validateCellValue(value: unknown) {
    if (value === null || value === undefined) {
      return { success: true, data: null };
    }
    
    const schema = z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
    });
    
    return schema.safeParse(value);
  }
  
  eq(value: unknown, other: unknown): boolean {
    if (!value || !other) return value === other;
    const v1 = value as IDepartmentCellValue;
    const v2 = other as IDepartmentCellValue;
    return v1.id === v2.id;
  }
}
```

### 3.3 实现 CreatedByDepartment 字段类型（自动字段）

```typescript
// packages/core/src/models/field/derivate/created-by-department.field.ts

import { z } from 'zod';
import { CellValueType, DbFieldType, FieldType } from '../constant';
import { FieldCore } from '../field';

export const createdByDepartmentFieldOptionsSchema = z.object({}).optional();

export type ICreatedByDepartmentFieldOptions = z.infer<
  typeof createdByDepartmentFieldOptionsSchema
>;

export interface ICreatedByDepartmentCellValue {
  id: string;
  name: string;
  code: string;
  path?: string;  // 可选的路径信息
}

export class CreatedByDepartmentFieldCore extends FieldCore {
  type = FieldType.CreatedByDepartment as const;
  
  cellValueType = CellValueType.String;
  
  dbFieldType = DbFieldType.Json;
  
  isComputed = true;  // 计算字段，自动填充，不可手动编辑
  
  options?: ICreatedByDepartmentFieldOptions;
  
  item2String(value?: unknown): string {
    if (!value) return '';
    const dept = value as ICreatedByDepartmentCellValue;
    return `${dept.name} (${dept.code})`;
  }
  
  cellValue2String(value?: unknown): string {
    return this.item2String(value);
  }
  
  convertStringToCellValue(str: string): unknown {
    return null;  // 计算字段不支持从字符串转换
  }
  
  repair(value: unknown): unknown {
    return null;  // 计算字段不支持修复
  }
  
  validateOptions() {
    return createdByDepartmentFieldOptionsSchema.safeParse(this.options);
  }
  
  validateCellValue(value: unknown) {
    return { success: true, data: value };
  }
  
  eq(value: unknown, other: unknown): boolean {
    if (!value || !other) return value === other;
    const v1 = value as ICreatedByDepartmentCellValue;
    const v2 = other as ICreatedByDepartmentCellValue;
    return v1.id === v2.id;
  }
}
```

### 3.4 注册字段类型

```typescript
// packages/core/src/models/field/derivate/index.ts

export * from './department.field';
export * from './created-by-department.field';
```

```typescript
// packages/sdk/src/model/field/factory.ts

import { DepartmentField } from './department.field';
import { CreatedByDepartmentField } from './created-by-department.field';

export function createFieldInstance(field: IFieldVo, doc?: Doc<IFieldVo>) {
  const instance = (() => {
    switch (field.type) {
      // ... 现有类型 ...
      
      case FieldType.Department:
        return plainToInstance(DepartmentField, field);
      case FieldType.CreatedByDepartment:
        return plainToInstance(CreatedByDepartmentField, field);
        
      default:
        assertNever(field.type);
    }
  })();
  
  // ... 其余代码 ...
}
```

### 3.5 后端 DTO 实现

```typescript
// apps/nestjs-backend/src/features/field/model/field-dto/department-field.dto.ts

import { Injectable } from '@nestjs/common';
import { DepartmentFieldCore, IDepartmentCellValue } from '@teable/core';
import { FieldBase } from './field-base';

@Injectable()
export class DepartmentFieldDto extends DepartmentFieldCore implements FieldBase {
  constructor(
    // 可以注入其他服务，如 DepartmentService
  ) {
    super();
  }
  
  // 可以添加验证逻辑
  async validateCellValue(value: unknown) {
    if (!value) return { success: true, data: null };
    
    const result = super.validateCellValue(value);
    if (!result.success) return result;
    
    // 可选：验证部门是否存在
    // const dept = await this.departmentService.getDepartment(value.id);
    // if (!dept) return { success: false, error: '部门不存在' };
    
    return result;
  }
}
```

```typescript
// apps/nestjs-backend/src/features/field/model/field-dto/created-by-department-field.dto.ts

import { Injectable } from '@nestjs/common';
import { CreatedByDepartmentFieldCore } from '@teable/core';
import { FieldBase } from './field-base';

@Injectable()
export class CreatedByDepartmentFieldDto 
  extends CreatedByDepartmentFieldCore 
  implements FieldBase {
  
  // 这是计算字段，值由系统自动填充
}
```

### 3.6 更新 Factory

```typescript
// apps/nestjs-backend/src/features/field/model/factory.ts

import { DepartmentFieldDto } from './field-dto/department-field.dto';
import { CreatedByDepartmentFieldDto } from './field-dto/created-by-department-field.dto';

export function createFieldInstanceByVo(field: IFieldVo) {
  switch (field.type) {
    // ... 现有类型 ...
    
    case FieldType.Department:
      return plainToInstance(DepartmentFieldDto, field);
    case FieldType.CreatedByDepartment:
      return plainToInstance(CreatedByDepartmentFieldDto, field);
      
    default:
      assertNever(field.type);
  }
}
```

## 四、记录创建时自动填充部门

### 4.1 修改 RecordService

```typescript
// apps/nestjs-backend/src/features/record/record.service.ts

@Injectable()
export class RecordService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
  ) {}
  
  async createRecord(
    tableId: string,
    fields: Record<string, unknown>
  ): Promise<IRecord> {
    // 获取当前用户
    const userId = this.cls.get('user.id');
    
    // 获取用户的主部门信息
    const user = await this.prismaService.txClient().user.findUnique({
      where: { id: userId },
      select: {
        primaryDepartmentId: true,
        primaryDepartmentName: true,
        primaryDepartmentCode: true,
      },
    });
    
    // 构建部门信息
    let departmentInfo = null;
    if (user?.primaryDepartmentId) {
      departmentInfo = {
        id: user.primaryDepartmentId,
        name: user.primaryDepartmentName,
        code: user.primaryDepartmentCode,
      };
    }
    
    // 创建记录
    const record = {
      __id: generateRecordId(),
      __created_by: userId,
      __created_by_department: departmentInfo ? JSON.stringify(departmentInfo) : null,
      __created_time: new Date(),
      __last_modified_by: userId,
      __last_modified_by_department: departmentInfo ? JSON.stringify(departmentInfo) : null,
      __last_modified_time: new Date(),
      __version: 1,
      ...convertFieldsToDbFormat(fields),
    };
    
    // 插入数据库
    await this.dbProvider.insert(tableId, record);
    
    return record;
  }
  
  async updateRecord(
    tableId: string,
    recordId: string,
    fields: Record<string, unknown>
  ): Promise<IRecord> {
    const userId = this.cls.get('user.id');
    
    // 获取用户的主部门
    const user = await this.prismaService.txClient().user.findUnique({
      where: { id: userId },
      select: {
        primaryDepartmentId: true,
        primaryDepartmentName: true,
        primaryDepartmentCode: true,
      },
    });
    
    let departmentInfo = null;
    if (user?.primaryDepartmentId) {
      departmentInfo = {
        id: user.primaryDepartmentId,
        name: user.primaryDepartmentName,
        code: user.primaryDepartmentCode,
      };
    }
    
    const updates = {
      __last_modified_by: userId,
      __last_modified_by_department: departmentInfo ? JSON.stringify(departmentInfo) : null,
      __last_modified_time: new Date(),
      ...convertFieldsToDbFormat(fields),
    };
    
    await this.dbProvider.update(tableId, recordId, updates);
    
    return await this.getRecord(tableId, recordId);
  }
}
```

### 4.2 系统字段定义

在创建表时，确保添加部门相关的系统字段：

```typescript
// apps/nestjs-backend/src/features/table/table.service.ts

const SYSTEM_FIELDS = [
  '__id',
  '__created_by',
  '__created_by_department',      // 新增
  '__last_modified_by',
  '__last_modified_by_department', // 新增
  '__created_time',
  '__last_modified_time',
  '__auto_number',
  '__version',
];

// 在创建表时添加字段
async createTable(baseId: string, tableName: string) {
  const dbTableName = `table_${generateTableId()}`;
  
  const sql = `
    CREATE TABLE ${dbTableName} (
      __id VARCHAR PRIMARY KEY,
      __created_by VARCHAR,
      __created_by_department TEXT,       -- JSON 格式
      __last_modified_by VARCHAR,
      __last_modified_by_department TEXT, -- JSON 格式
      __created_time TIMESTAMP,
      __last_modified_time TIMESTAMP,
      __auto_number INTEGER,
      __version INTEGER
    )
  `;
  
  await this.prismaService.$executeRawUnsafe(sql);
}
```

## 五、部门管理 API

### 5.1 创建 DepartmentService

```typescript
// apps/nestjs-backend/src/features/department/department.service.ts

@Injectable()
export class DepartmentService {
  constructor(private readonly prismaService: PrismaService) {}
  
  // 获取所有部门
  async list(query?: { status?: string }) {
    return await this.prismaService.department.findMany({
      where: {
        status: query?.status || 'active',
      },
      orderBy: [
        { level: 'asc' },
        { code: 'asc' },
      ],
    });
  }
  
  // 获取部门树
  async getTree() {
    const allDepts = await this.list();
    return this.buildTree(allDepts);
  }
  
  private buildTree(depts: any[], parentId: string | null = null): any[] {
    return depts
      .filter(d => d.parentId === parentId)
      .map(dept => ({
        ...dept,
        children: this.buildTree(depts, dept.id),
      }));
  }
  
  // 创建部门
  async create(data: {
    name: string;
    code: string;
    parentId?: string;
    description?: string;
  }) {
    let level = 1;
    let path = `/${data.code}/`;
    
    if (data.parentId) {
      const parent = await this.prismaService.department.findUnique({
        where: { id: data.parentId },
      });
      
      if (parent) {
        level = parent.level + 1;
        path = `${parent.path}${data.code}/`;
      }
    }
    
    return await this.prismaService.department.create({
      data: {
        name: data.name,
        code: data.code,
        parentId: data.parentId,
        level,
        path,
        description: data.description,
        status: 'active',
      },
    });
  }
  
  // 获取单个部门
  async get(id: string) {
    return await this.prismaService.department.findUnique({
      where: { id },
    });
  }
  
  // 更新部门
  async update(id: string, data: Partial<{ name: string; description: string }>) {
    return await this.prismaService.department.update({
      where: { id },
      data,
    });
  }
  
  // 删除部门（软删除）
  async delete(id: string) {
    return await this.prismaService.department.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}
```

### 5.2 创建 DepartmentController

```typescript
// apps/nestjs-backend/src/features/department/department.controller.ts

@Controller('api/department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
  
  @Get()
  async list(@Query('status') status?: string) {
    return await this.departmentService.list({ status });
  }
  
  @Get('tree')
  async getTree() {
    return await this.departmentService.getTree();
  }
  
  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.departmentService.get(id);
  }
  
  @Post()
  async create(@Body() body: {
    name: string;
    code: string;
    parentId?: string;
    description?: string;
  }) {
    return await this.departmentService.create(body);
  }
  
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string }
  ) {
    return await this.departmentService.update(id, body);
  }
  
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.departmentService.delete(id);
  }
}
```

### 5.3 用户主部门管理

```typescript
// apps/nestjs-backend/src/features/user/user.service.ts

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  
  // 设置用户主部门
  async setPrimaryDepartment(userId: string, departmentId: string) {
    const dept = await this.prismaService.department.findUnique({
      where: { id: departmentId },
    });
    
    if (!dept) {
      throw new NotFoundException('部门不存在');
    }
    
    return await this.prismaService.user.update({
      where: { id: userId },
      data: {
        primaryDepartmentId: dept.id,
        primaryDepartmentName: dept.name,
        primaryDepartmentCode: dept.code,
      },
    });
  }
  
  // 获取用户主部门
  async getPrimaryDepartment(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        primaryDepartmentId: true,
        primaryDepartmentName: true,
        primaryDepartmentCode: true,
      },
    });
    
    if (!user?.primaryDepartmentId) {
      return null;
    }
    
    return {
      id: user.primaryDepartmentId,
      name: user.primaryDepartmentName,
      code: user.primaryDepartmentCode,
    };
  }
}
```

## 六、前端实现

### 6.1 部门选择组件

```typescript
// apps/nextjs-app/src/components/DepartmentSelector.tsx

import React, { useEffect, useState } from 'react';
import { Select } from '@teable/ui-lib';

interface Department {
  id: string;
  name: string;
  code: string;
  level: number;
}

export function DepartmentSelector({
  value,
  onChange,
  placeholder = '选择部门',
}: {
  value?: string;
  onChange?: (value: string, dept: Department) => void;
  placeholder?: string;
}) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadDepartments();
  }, []);
  
  const loadDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/department');
      const data = await response.json();
      setDepartments(data);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    if (dept && onChange) {
      onChange(deptId, dept);
    }
  };
  
  return (
    <Select
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      loading={loading}
    >
      {departments.map(dept => (
        <Select.Option key={dept.id} value={dept.id}>
          {'　'.repeat(dept.level - 1)}{dept.name} ({dept.code})
        </Select.Option>
      ))}
    </Select>
  );
}
```

### 6.2 部门字段编辑器

```typescript
// packages/sdk/src/components/editor/department-editor/DepartmentEditor.tsx

import React from 'react';
import { DepartmentSelector } from './DepartmentSelector';
import type { IDepartmentCellValue } from '@teable/core';

export function DepartmentEditor({
  value,
  onChange,
}: {
  value?: IDepartmentCellValue;
  onChange?: (value: IDepartmentCellValue | null) => void;
}) {
  const handleChange = (deptId: string, dept: any) => {
    onChange?.({
      id: dept.id,
      name: dept.name,
      code: dept.code,
    });
  };
  
  const handleClear = () => {
    onChange?.(null);
  };
  
  return (
    <div className="department-editor">
      <DepartmentSelector
        value={value?.id}
        onChange={handleChange}
      />
      {value && (
        <button onClick={handleClear}>清除</button>
      )}
    </div>
  );
}
```

### 6.3 部门字段显示

```typescript
// packages/sdk/src/components/cell-value/department-show/DepartmentShow.tsx

import React from 'react';
import type { IDepartmentCellValue } from '@teable/core';

export function DepartmentShow({ value }: { value?: IDepartmentCellValue }) {
  if (!value) return <span className="text-gray-400">-</span>;
  
  return (
    <div className="flex items-center gap-2">
      <span className="department-icon">🏢</span>
      <span className="department-name">{value.name}</span>
      <span className="department-code text-gray-500">({value.code})</span>
    </div>
  );
}
```

## 七、查询和过滤

### 7.1 按部门过滤记录

```typescript
// apps/nestjs-backend/src/features/record/record.service.ts

async getRecordsByDepartment(
  tableId: string,
  departmentCode: string,
  fieldName: string = '__created_by_department'
): Promise<IRecord[]> {
  const dbTableName = `table_${tableId}`;
  
  const sql = `
    SELECT * FROM ${dbTableName}
    WHERE json_extract(${fieldName}, '$.code') = ?
      AND __deleted_time IS NULL
    ORDER BY __created_time DESC
  `;
  
  return await this.prismaService.$queryRawUnsafe(sql, departmentCode);
}

// 支持多个部门查询
async getRecordsByDepartments(
  tableId: string,
  departmentCodes: string[],
  fieldName: string = '__created_by_department'
): Promise<IRecord[]> {
  const dbTableName = `table_${tableId}`;
  
  const conditions = departmentCodes.map(code => 
    `json_extract(${fieldName}, '$.code') = '${code}'`
  ).join(' OR ');
  
  const sql = `
    SELECT * FROM ${dbTableName}
    WHERE (${conditions})
      AND __deleted_time IS NULL
    ORDER BY __created_time DESC
  `;
  
  return await this.prismaService.$queryRawUnsafe(sql);
}
```

### 7.2 视图过滤器支持

在视图的过滤器中添加部门过滤：

```typescript
// packages/core/src/models/view/filter/filter.ts

export interface IDepartmentFilter {
  fieldId: string;  // 部门字段ID（如 created_by_department）
  operator: 'is' | 'isNot' | 'isAnyOf';  // 操作符
  value: string | string[];  // 部门ID 或 部门ID数组
}

// 在过滤器中使用
const filter = {
  conjunction: 'and',
  filterSet: [
    {
      fieldId: 'created_by_department',
      operator: 'is',
      value: 'dept_001',  // 技术部
    },
  ],
};
```

## 八、测试数据

### 8.1 初始化部门数据

```sql
-- 插入示例部门
INSERT INTO department (id, name, code, level, path, status) VALUES
('dept_001', '总部', '001', 1, '/001/', 'active'),
('dept_002', '技术部', '001001', 2, '/001/001001/', 'active'),
('dept_003', '市场部', '001002', 2, '/001/001002/', 'active'),
('dept_004', '前端组', '001001001', 3, '/001/001001/001001001/', 'active'),
('dept_005', '后端组', '001001002', 3, '/001/001001/001001002/', 'active');
```

### 8.2 设置用户主部门

```sql
-- 为用户设置主部门
UPDATE users 
SET 
  primary_department_id = 'dept_002',
  primary_department_name = '技术部',
  primary_department_code = '001001'
WHERE id = 'user_zhangsan';
```

## 九、使用示例

### 9.1 创建记录

```typescript
// 用户张三（主部门：技术部 001001）创建一条记录
const record = await createRecord(tableId, {
  title: '新项目',
  description: '这是一个新项目',
  // department 字段可以手动选择
  responsible_department: {
    id: 'dept_003',
    name: '市场部',
    code: '001002',
  },
});

// 自动填充的字段：
// __created_by_department: { id: 'dept_002', name: '技术部', code: '001001' }
```

### 9.2 查询记录

```typescript
// 查询技术部创建的所有记录
const records = await getRecordsByDepartment(tableId, '001001');

// 查询多个部门的记录
const records = await getRecordsByDepartments(
  tableId,
  ['001001', '001002']  // 技术部和市场部
);
```

### 9.3 视图过滤

```typescript
// 创建一个视图，只显示技术部创建的记录
const view = await createView(tableId, {
  name: '技术部视图',
  filter: {
    conjunction: 'and',
    filterSet: [
      {
        fieldId: 'created_by_department',
        operator: 'is',
        value: 'dept_002',  // 技术部
      },
    ],
  },
});
```

## 十、后续扩展

### 10.1 Phase 2: 多部门归属

- 用户可以属于多个部门
- 创建 UserDepartment 关联表
- 主部门 + 兼职部门机制

### 10.2 Phase 3: 部门合并

- 部门合并功能
- 历史编码映射
- 数据访问权限继承

### 10.3 Phase 4: 高级权限

- 基于部门的数据权限控制
- 只能看本部门及子部门的数据
- 部门管理员权限

## 十一、总结

这个 MVP 方案实现了：

✅ **简单清晰**：每个用户一个主部门，容易理解  
✅ **自动填充**：创建记录时自动记录创建人的部门  
✅ **可选择**：支持手动选择部门字段  
✅ **可查询**：支持按部门过滤和查询  
✅ **易扩展**：后续可以逐步扩展功能

从这个基础开始，可以逐步添加更复杂的功能！

