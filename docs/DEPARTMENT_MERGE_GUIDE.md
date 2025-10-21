# 部门合并处理指南

## 一、业务场景

### 1.1 常见的部门合并场景

**场景一：同级部门合并**
```
技术一部 (001001) + 技术二部 (001002) → 技术部 (001001)
- 两个同级部门合并为一个
- 保留其中一个部门编码
- 另一个部门撤销
```

**场景二：部门降级（吸收合并）**
```
技术部 (001001)
  ├─ 前端组 (001001001)
  └─ 后端组 (001001002)
  
合并后：
技术部 (001001) [吸收了子部门的职能]
- 子部门撤销
- 人员并入父部门
```

**场景三：跨层级合并**
```
技术部 (001001) + 产品部 (002001) → 研发中心 (003001)
- 不同部门合并成新部门
- 原部门都撤销
- 创建新的部门
```

**场景四：部门拆分后重组**
```
原大部门 (001)
  ├─ 业务A (001001)
  ├─ 业务B (001002)
  └─ 业务C (001003)
  
重组为：
新部门1 (002) ← 业务A + 业务B
新部门2 (003) ← 业务C
```

## 二、核心原则

### 2.1 历史数据不变原则 ⭐⭐⭐

**最重要**：合并前各部门创建的历史记录，其部门信息**不应该改变**。

**原因**：
1. ✅ **审计追溯**：保留历史上真实的组织架构
2. ✅ **统计准确**：历史业绩仍归属原部门
3. ✅ **责任明确**：历史数据的权责不因合并而改变
4. ✅ **避免大规模数据迁移**：不需要更新数百万条记录

**示例**：
```typescript
// 技术一部有 1000 条历史记录
// 技术二部有 800 条历史记录

// 合并后：
// ✅ 这 1800 条记录的部门信息保持不变
// ✅ 新创建的记录使用合并后的部门（技术部）
// ❌ 不要批量更新这 1800 条记录的部门
```

### 2.2 人员平滑迁移原则

部门合并后，人员应该自动迁移到新部门，过程对用户透明：
- 原部门成员自动成为新部门成员
- 保留原有的角色和权限级别
- 主部门标识正确迁移

### 2.3 权限继承原则

合并后的部门应该继承原部门的权限范围：
- 新部门成员可以访问所有原部门的历史数据
- 通过"部门别名"或"历史部门映射"实现

### 2.4 可追溯原则

部门合并需要完整记录：
- 哪些部门合并了
- 合并到哪个部门
- 合并时间和原因
- 操作人

## 三、数据库设计

### 3.1 Department 表扩展

```prisma
model Department {
  id               String    @id @default(cuid())
  organizationId   String    @map("organization_id")
  name             String
  code             String
  parentId         String?   @map("parent_id")
  level            Int
  path             String
  
  // 合并相关字段（新增）
  status           String    @default("active")  // active/merged/archived
  mergedIntoId     String?   @map("merged_into_id")  // 合并到哪个部门
  mergedAt         DateTime? @map("merged_at")       // 合并时间
  mergedBy         String?   @map("merged_by")       // 操作人
  mergedReason     String?   @map("merged_reason")   // 合并原因
  
  // 历史编码映射（用于权限查询）
  historicalCodes  String?   @map("historical_codes")  // JSON: ["001001", "001002"]
  
  createdTime      DateTime  @default(now()) @map("created_time")
  deletedTime      DateTime? @map("deleted_time")
  
  organization     Organization @relation(fields: [organizationId], references: [id])
  parent           Department?  @relation("DepartmentHierarchy", fields: [parentId], references: [id])
  children         Department[] @relation("DepartmentHierarchy")
  mergedInto       Department?  @relation("DepartmentMerge", fields: [mergedIntoId], references: [id])
  mergedFrom       Department[] @relation("DepartmentMerge")
  
  @@index([status])
  @@index([mergedIntoId])
  @@map("department")
}
```

### 3.2 部门合并历史表

```prisma
model DepartmentMergeHistory {
  id               String   @id @default(cuid())
  organizationId   String   @map("organization_id")
  
  // 合并信息
  mergeType        String   @map("merge_type")      // merge/absorb/split/reorganize
  sourceDeptIds    String   @map("source_dept_ids") // JSON: ["dept1", "dept2"]
  targetDeptId     String   @map("target_dept_id")
  
  // 详细信息
  sourceDeptCodes  String   @map("source_dept_codes") // JSON: ["001001", "001002"]
  targetDeptCode   String   @map("target_dept_code")  // "001001"
  
  // 影响统计
  affectedUsers    Int      @map("affected_users")    // 影响的用户数
  affectedRecords  Int?     @map("affected_records")  // 影响的记录数（可选）
  
  // 审计信息
  mergedAt         DateTime @default(now()) @map("merged_at")
  mergedBy         String   @map("merged_by")
  reason           String?
  approvedBy       String?  @map("approved_by")
  
  organization     Organization @relation(fields: [organizationId], references: [id])
  
  @@index([organizationId])
  @@index([targetDeptId])
  @@map("department_merge_history")
}
```

## 四、实现方案

### 4.1 同级部门合并

```typescript
// apps/nestjs-backend/src/features/department/department.service.ts

interface MergeDepartmentsDto {
  organizationId: string;
  sourceDeptIds: string[];    // 要合并的部门ID列表
  targetDeptId: string;        // 合并到的目标部门ID
  reason?: string;
  operatorId: string;
}

@Injectable()
export class DepartmentService {
  
  async mergeDepartments(dto: MergeDepartmentsDto) {
    const { organizationId, sourceDeptIds, targetDeptId, reason, operatorId } = dto;
    
    // 1. 验证
    await this.validateMerge(organizationId, sourceDeptIds, targetDeptId);
    
    // 2. 在事务中执行合并
    return await this.prismaService.$transaction(async (tx) => {
      
      // 2.1 获取源部门和目标部门信息
      const sourceDepts = await tx.department.findMany({
        where: { id: { in: sourceDeptIds } },
        include: {
          users: { where: { leaveTime: null } },  // 当前成员
          children: true,  // 子部门
        },
      });
      
      const targetDept = await tx.department.findUnique({
        where: { id: targetDeptId },
      });
      
      // 2.2 收集所有源部门的编码（用于历史数据查询）
      const sourceCodesAll = sourceDepts.map(d => d.code);
      const existingHistoricalCodes = targetDept.historicalCodes 
        ? JSON.parse(targetDept.historicalCodes) 
        : [];
      const allHistoricalCodes = [...existingHistoricalCodes, ...sourceCodesAll];
      
      // 2.3 更新目标部门，添加历史编码映射
      await tx.department.update({
        where: { id: targetDeptId },
        data: {
          historicalCodes: JSON.stringify(allHistoricalCodes),
        },
      });
      
      // 2.4 迁移人员
      let totalAffectedUsers = 0;
      for (const sourceDept of sourceDepts) {
        const users = sourceDept.users;
        totalAffectedUsers += users.length;
        
        for (const userOrg of users) {
          await this.migrateUserToNewDepartment(
            tx,
            userOrg.userId,
            sourceDept.id,
            targetDeptId,
            operatorId,
            '部门合并自动迁移'
          );
        }
      }
      
      // 2.5 处理子部门（移动到目标部门下）
      for (const sourceDept of sourceDepts) {
        if (sourceDept.children.length > 0) {
          await tx.department.updateMany({
            where: { parentId: sourceDept.id },
            data: {
              parentId: targetDeptId,
              // 需要重新计算 path 和 level
            },
          });
        }
      }
      
      // 2.6 标记源部门为已合并
      const now = new Date();
      await tx.department.updateMany({
        where: { id: { in: sourceDeptIds } },
        data: {
          status: 'merged',
          mergedIntoId: targetDeptId,
          mergedAt: now,
          mergedBy: operatorId,
          mergedReason: reason,
        },
      });
      
      // 2.7 记录合并历史
      await tx.departmentMergeHistory.create({
        data: {
          organizationId,
          mergeType: 'merge',
          sourceDeptIds: JSON.stringify(sourceDeptIds),
          targetDeptId,
          sourceDeptCodes: JSON.stringify(sourceCodesAll),
          targetDeptCode: targetDept.code,
          affectedUsers: totalAffectedUsers,
          mergedBy: operatorId,
          reason,
        },
      });
      
      // 2.8 清除相关缓存
      await this.clearDepartmentCaches(organizationId, [...sourceDeptIds, targetDeptId]);
      
      // 2.9 发送通知
      await this.notifyDepartmentMerge(sourceDeptIds, targetDeptId, totalAffectedUsers);
      
      return {
        success: true,
        targetDepartment: targetDept,
        affectedUsers: totalAffectedUsers,
        mergedDepartments: sourceDepts.length,
      };
    });
  }
  
  // 验证合并的合法性
  private async validateMerge(
    orgId: string, 
    sourceIds: string[], 
    targetId: string
  ) {
    // 1. 源部门不能包含目标部门
    if (sourceIds.includes(targetId)) {
      throw new BadRequestException('不能将部门合并到自己');
    }
    
    // 2. 所有部门必须属于同一组织
    const depts = await this.prismaService.department.findMany({
      where: { id: { in: [...sourceIds, targetId] } },
    });
    
    if (depts.some(d => d.organizationId !== orgId)) {
      throw new BadRequestException('只能合并同一组织的部门');
    }
    
    // 3. 源部门必须是活跃状态
    const activeSources = depts.filter(d => 
      sourceIds.includes(d.id) && d.status === 'active'
    );
    
    if (activeSources.length !== sourceIds.length) {
      throw new BadRequestException('存在已合并或已归档的部门');
    }
    
    // 4. 目标部门必须是活跃状态
    const target = depts.find(d => d.id === targetId);
    if (target?.status !== 'active') {
      throw new BadRequestException('目标部门必须是活跃状态');
    }
    
    // 5. 不能将父部门合并到子部门
    for (const sourceId of sourceIds) {
      const source = depts.find(d => d.id === sourceId);
      if (source && target.path.includes(source.code)) {
        throw new BadRequestException('不能将父部门合并到子部门');
      }
    }
  }
  
  // 迁移用户到新部门
  private async migrateUserToNewDepartment(
    tx: any,
    userId: string,
    fromDeptId: string,
    toDeptId: string,
    operatorId: string,
    reason: string
  ) {
    const now = new Date();
    
    // 1. 获取用户在原部门的关系
    const oldRelation = await tx.userOrganization.findFirst({
      where: {
        userId,
        departmentId: fromDeptId,
        leaveTime: null,
      },
    });
    
    if (!oldRelation) return;
    
    // 2. 标记旧关系为离开
    await tx.userOrganization.update({
      where: { id: oldRelation.id },
      data: {
        leaveTime: now,
        updatedBy: operatorId,
        reason,
      },
    });
    
    // 3. 检查新部门是否已有关系
    const newRelation = await tx.userOrganization.findFirst({
      where: {
        userId,
        departmentId: toDeptId,
        leaveTime: null,
      },
    });
    
    if (!newRelation) {
      // 3.1 创建新关系（保持相同的 isPrimary 状态）
      await tx.userOrganization.create({
        data: {
          userId,
          organizationId: oldRelation.organizationId,
          departmentId: toDeptId,
          isPrimary: oldRelation.isPrimary,
          isAdmin: oldRelation.isAdmin,
          role: oldRelation.role,
          joinTime: now,
          createdBy: operatorId,
          reason,
        },
      });
    } else if (oldRelation.isPrimary && !newRelation.isPrimary) {
      // 3.2 如果原来是主部门，需要更新新关系为主部门
      await tx.userOrganization.update({
        where: { id: newRelation.id },
        data: {
          isPrimary: true,
          updatedBy: operatorId,
        },
      });
    }
    
    // 4. 记录用户部门变更历史
    await tx.userDepartmentHistory.create({
      data: {
        userId,
        organizationId: oldRelation.organizationId,
        fromDepartmentId: fromDeptId,
        toDepartmentId: toDeptId,
        changeType: 'merge_migration',
        isPrimaryChange: oldRelation.isPrimary,
        changedBy: operatorId,
        reason,
      },
    });
  }
}
```

### 4.2 吸收合并（部门降级）

```typescript
interface AbsorbDepartmentsDto {
  organizationId: string;
  parentDeptId: string;       // 父部门ID（要吸收子部门的部门）
  childDeptIds: string[];     // 要被吸收的子部门ID列表
  reason?: string;
  operatorId: string;
}

async absorbChildDepartments(dto: AbsorbDepartmentsDto) {
  const { organizationId, parentDeptId, childDeptIds, reason, operatorId } = dto;
  
  // 验证：所有子部门的 parentId 必须是 parentDeptId
  const children = await this.prismaService.department.findMany({
    where: { id: { in: childDeptIds } },
  });
  
  if (children.some(c => c.parentId !== parentDeptId)) {
    throw new BadRequestException('只能吸收直接子部门');
  }
  
  // 使用合并逻辑，目标是父部门
  return await this.mergeDepartments({
    organizationId,
    sourceDeptIds: childDeptIds,
    targetDeptId: parentDeptId,
    reason: reason || '部门职能合并',
    operatorId,
  });
}
```

### 4.3 创建新部门并合并

```typescript
interface MergeIntoNewDepartmentDto {
  organizationId: string;
  sourceDeptIds: string[];
  newDepartment: {
    name: string;
    parentId?: string;
    description?: string;
  };
  reason?: string;
  operatorId: string;
}

async mergeIntoNewDepartment(dto: MergeIntoNewDepartmentDto) {
  const { organizationId, sourceDeptIds, newDepartment, reason, operatorId } = dto;
  
  return await this.prismaService.$transaction(async (tx) => {
    // 1. 创建新部门
    const targetDept = await tx.department.create({
      data: {
        organizationId,
        name: newDepartment.name,
        code: await this.generateDepartmentCode(newDepartment.parentId),
        parentId: newDepartment.parentId,
        level: await this.calculateLevel(newDepartment.parentId),
        path: await this.calculatePath(newDepartment.parentId),
        description: newDepartment.description,
        status: 'active',
      },
    });
    
    // 2. 合并源部门到新部门
    return await this.mergeDepartments({
      organizationId,
      sourceDeptIds,
      targetDeptId: targetDept.id,
      reason: reason || '重组为新部门',
      operatorId,
    });
  });
}
```

## 五、权限和数据访问

### 5.1 历史数据访问（关键）⭐

合并后，目标部门的成员应该能够访问原部门的历史数据。

**实现方式：通过历史编码映射**

```typescript
// 获取部门及其历史编码
async getDepartmentWithHistoricalCodes(deptId: string): Promise<string[]> {
  const dept = await this.prismaService.department.findUnique({
    where: { id: deptId },
    select: {
      code: true,
      historicalCodes: true,
    },
  });
  
  const codes = [dept.code];
  
  // 添加历史编码
  if (dept.historicalCodes) {
    const historical = JSON.parse(dept.historicalCodes);
    codes.push(...historical);
  }
  
  return codes;
}

// 查询记录时包含历史部门
async getRecordsForUser(userId: string, includeHistorical = true) {
  // 1. 获取用户当前的部门
  const userDepts = await this.getUserCurrentDepartments(userId);
  
  // 2. 收集所有编码（包括历史编码）
  let allCodes: string[] = [];
  for (const userDept of userDepts) {
    const codes = includeHistorical
      ? await this.getDepartmentWithHistoricalCodes(userDept.departmentId)
      : [userDept.department.code];
    allCodes.push(...codes);
  }
  
  // 去重
  allCodes = [...new Set(allCodes)];
  
  // 3. 构建查询
  const conditions = allCodes.map(code => 
    `json_extract(__created_by_department, '$.code') = '${code}'`
  );
  
  const sql = `
    SELECT * FROM table_xxx
    WHERE (${conditions.join(' OR ')})
      AND __deleted_time IS NULL
  `;
  
  return await this.db.$queryRawUnsafe(sql);
}
```

**示例**：
```typescript
// 技术一部 (001001) 有 1000 条历史记录
// 技术二部 (001002) 有 800 条历史记录
// 合并到技术部 (001001)

// 合并后：
Department {
  id: "dept_001",
  code: "001001",
  historicalCodes: JSON.stringify(["001002"]),  // 记录合并来源
}

// 查询时：
// 张三是技术部成员
const codes = await getDepartmentWithHistoricalCodes("dept_001");
// 返回: ["001001", "001002"]

// SQL:
SELECT * FROM records
WHERE (
  json_extract(__created_by_department, '$.code') = '001001'  -- 当前编码
  OR json_extract(__created_by_department, '$.code') = '001002'  -- 历史编码
)

// 结果：张三可以看到 1800 条记录（1000 + 800）
```

### 5.2 权限继承

```typescript
// 合并后的权限计算
interface DepartmentPermissions {
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  scope: {
    currentDepartment: boolean;    // 当前部门数据
    historicalDepartments: boolean; // 历史合并部门数据
    childDepartments: boolean;     // 子部门数据
  };
}

async getDepartmentPermissions(
  userId: string, 
  deptId: string
): Promise<DepartmentPermissions> {
  const userOrg = await this.prismaService.userOrganization.findFirst({
    where: {
      userId,
      departmentId: deptId,
      leaveTime: null,
    },
  });
  
  return {
    canRead: true,
    canCreate: true,
    canUpdate: userOrg?.isAdmin ?? false,
    canDelete: userOrg?.isAdmin ?? false,
    scope: {
      currentDepartment: true,
      historicalDepartments: true,  // 默认可以访问历史合并部门
      childDepartments: userOrg?.isAdmin ?? false,
    },
  };
}
```

## 六、查询优化

### 6.1 历史编码查询优化

```typescript
// 方案一：使用 JSON 数组查询（PostgreSQL）
async getRecordsByDepartmentCodes(codes: string[]) {
  // 假设 __created_by_department 是 JSONB 类型
  const sql = `
    SELECT * FROM table_xxx
    WHERE (__created_by_department->>'code') = ANY($1)
      AND __deleted_time IS NULL
  `;
  
  return await this.prismaService.$queryRawUnsafe(sql, codes);
}

// 方案二：使用虚拟列 + 索引
// 创建虚拟列
ALTER TABLE table_xxx 
ADD COLUMN __dept_code TEXT 
GENERATED ALWAYS AS ((__created_by_department->>'code')) STORED;

CREATE INDEX idx_dept_code ON table_xxx(__dept_code);

// 查询
SELECT * FROM table_xxx
WHERE __dept_code IN ('001001', '001002', '001003')
  AND __deleted_time IS NULL;
```

### 6.2 缓存策略

```typescript
class DepartmentMergeCache {
  // 缓存部门的历史编码映射
  async getCachedHistoricalCodes(deptId: string): Promise<string[]> {
    const cacheKey = `dept:${deptId}:historical_codes`;
    
    // 1. 尝试从缓存读取
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // 2. 从数据库查询
    const codes = await this.getDepartmentWithHistoricalCodes(deptId);
    
    // 3. 缓存（24小时）
    await this.redis.setex(cacheKey, 86400, JSON.stringify(codes));
    
    return codes;
  }
  
  // 部门合并后清除缓存
  async invalidateOnMerge(deptIds: string[]) {
    const keys = deptIds.map(id => `dept:${id}:historical_codes`);
    await this.redis.del(...keys);
  }
}
```

## 七、API 接口设计

### 7.1 部门合并相关接口

```typescript
// 合并部门（同级合并）
POST /api/organization/{orgId}/department/merge
{
  sourceDeptIds: string[];    // 要合并的部门
  targetDeptId: string;       // 合并到的部门
  reason?: string;
}

// 吸收子部门
POST /api/organization/{orgId}/department/{deptId}/absorb
{
  childDeptIds: string[];
  reason?: string;
}

// 合并到新部门
POST /api/organization/{orgId}/department/merge-into-new
{
  sourceDeptIds: string[];
  newDepartment: {
    name: string;
    parentId?: string;
    description?: string;
  };
  reason?: string;
}

// 获取部门合并历史
GET /api/organization/{orgId}/department/{deptId}/merge-history

// 获取所有合并历史
GET /api/organization/{orgId}/department-merge-history
Query: {
  startDate?: string;
  endDate?: string;
  deptId?: string;  // 过滤特定部门
}

// 撤销合并（谨慎使用）
POST /api/organization/{orgId}/department/merge/{mergeId}/undo
{
  reason: string;
}
```

## 八、UI/UX 设计

### 8.1 部门合并向导

```typescript
<DepartmentMergeWizard>
  {/* 步骤1：选择要合并的部门 */}
  <Step1>
    <Title>选择要合并的部门</Title>
    <DepartmentTreeSelector
      multiple
      onChange={setSourceDepts}
      excludeStatuses={['merged', 'archived']}
    />
    <SelectedList>
      {sourceDepts.map(dept => (
        <DepartmentCard key={dept.id}>
          <Name>{dept.name} ({dept.code})</Name>
          <Stats>
            <Stat>成员: {dept.memberCount}人</Stat>
            <Stat>数据: {dept.recordCount}条</Stat>
          </Stat>
        </DepartmentCard>
      ))}
    </SelectedList>
  </Step1>
  
  {/* 步骤2：选择目标部门或创建新部门 */}
  <Step2>
    <Title>合并方式</Title>
    <RadioGroup value={mergeMode} onChange={setMergeMode}>
      <Radio value="existing">合并到现有部门</Radio>
      <Radio value="new">创建新部门</Radio>
    </RadioGroup>
    
    {mergeMode === 'existing' && (
      <DepartmentSelector
        value={targetDept}
        onChange={setTargetDept}
        excludeIds={sourceDepts.map(d => d.id)}
      />
    )}
    
    {mergeMode === 'new' && (
      <NewDepartmentForm>
        <Input label="部门名称" required />
        <DepartmentSelector label="上级部门" />
        <Textarea label="描述" />
      </NewDepartmentForm>
    )}
  </Step2>
  
  {/* 步骤3：确认影响范围 */}
  <Step3>
    <Title>影响评估</Title>
    <ImpactSummary>
      <SummaryItem>
        <Icon>👥</Icon>
        <Label>受影响人员</Label>
        <Value>{totalUsers}人</Value>
      </SummaryItem>
      <SummaryItem>
        <Icon>📊</Icon>
        <Label>历史记录</Label>
        <Value>{totalRecords}条（保持不变）</Value>
      </SummaryItem>
      <SummaryItem>
        <Icon>🗂️</Icon>
        <Label>子部门</Label>
        <Value>{totalChildren}个（将移至目标部门）</Value>
      </SummaryItem>
    </ImpactSummary>
    
    <WarningBox>
      <Icon>⚠️</Icon>
      <Message>
        <strong>注意：</strong>
        <ul>
          <li>合并后，源部门将被标记为"已合并"状态</li>
          <li>所有成员将自动迁移到目标部门</li>
          <li>历史数据的部门信息保持不变</li>
          <li>目标部门成员可以访问所有源部门的历史数据</li>
        </ul>
      </Message>
    </WarningBox>
    
    <ReasonInput>
      <Label>合并原因</Label>
      <Textarea 
        placeholder="请说明合并原因..."
        required
      />
    </ReasonInput>
  </Step3>
  
  {/* 步骤4：执行合并 */}
  <Step4>
    <ProgressBar value={progress} />
    <StatusMessage>{currentStatus}</StatusMessage>
    
    {completed && (
      <SuccessMessage>
        ✅ 部门合并完成！
        <Details>
          <p>合并到: {targetDept.name}</p>
          <p>迁移人员: {affectedUsers}人</p>
          <p>处理时间: {duration}秒</p>
        </Details>
        <Actions>
          <Button onClick={viewDepartment}>查看部门</Button>
          <Button onClick={close}>关闭</Button>
        </Actions>
      </SuccessMessage>
    )}
  </Step4>
</DepartmentMergeWizard>
```

### 8.2 合并历史视图

```typescript
<DepartmentMergeHistory>
  <Timeline>
    <TimelineItem>
      <Date>2024-06-01 14:30</Date>
      <Event>
        <Icon>🔀</Icon>
        <Title>部门合并</Title>
        <Description>
          技术一部、技术二部 → 技术部
        </Description>
        <Details>
          <Detail>源部门: 技术一部 (001001), 技术二部 (001002)</Detail>
          <Detail>目标部门: 技术部 (001001)</Detail>
          <Detail>受影响人员: 45人</Detail>
          <Detail>操作人: HR Admin</Detail>
          <Detail>原因: 组织架构优化</Detail>
        </Details>
      </Event>
      <Actions>
        <Button size="sm">查看详情</Button>
      </Actions>
    </TimelineItem>
  </Timeline>
</DepartmentMergeHistory>
```

## 九、注意事项

### 9.1 合并前检查

```typescript
// 合并前的完整性检查
async validateBeforeMerge(sourceIds: string[], targetId: string) {
  const checks = [];
  
  // 1. 检查部门是否存在循环依赖
  const hasCircularDependency = await this.checkCircularDependency(sourceIds, targetId);
  if (hasCircularDependency) {
    checks.push('存在循环依赖，无法合并');
  }
  
  // 2. 检查是否有活跃的审批流程
  const hasActiveWorkflows = await this.checkActiveWorkflows(sourceIds);
  if (hasActiveWorkflows) {
    checks.push('存在进行中的审批流程，建议完成后再合并');
  }
  
  // 3. 检查是否有定时任务
  const hasScheduledTasks = await this.checkScheduledTasks(sourceIds);
  if (hasScheduledTasks) {
    checks.push('存在定时任务，需要手动迁移或取消');
  }
  
  // 4. 检查数据量（如果太大，建议异步处理）
  const totalRecords = await this.countDepartmentRecords(sourceIds);
  if (totalRecords > 100000) {
    checks.push(`数据量较大（${totalRecords}条），建议选择非高峰期执行`);
  }
  
  return checks;
}
```

### 9.2 大规模合并的异步处理

```typescript
// 如果影响的人员或数据很多，使用队列异步处理
async queueDepartmentMerge(dto: MergeDepartmentsDto) {
  // 1. 创建合并任务
  const job = await this.prismaService.departmentMergeJob.create({
    data: {
      organizationId: dto.organizationId,
      sourceDeptIds: JSON.stringify(dto.sourceDeptIds),
      targetDeptId: dto.targetDeptId,
      status: 'pending',
      createdBy: dto.operatorId,
    },
  });
  
  // 2. 加入队列
  await this.queue.add('department-merge', {
    jobId: job.id,
    ...dto,
  });
  
  return {
    jobId: job.id,
    status: 'queued',
    message: '合并任务已加入队列，将在后台执行',
  };
}

// 队列处理器
@Processor('department-merge')
class DepartmentMergeProcessor {
  @Process()
  async processMerge(job: Job) {
    const { jobId, ...dto } = job.data;
    
    try {
      // 更新任务状态
      await this.updateJobStatus(jobId, 'processing');
      
      // 执行合并
      const result = await this.departmentService.mergeDepartments(dto);
      
      // 更新任务状态
      await this.updateJobStatus(jobId, 'completed', result);
      
      // 发送通知
      await this.notifyCompletion(dto.operatorId, result);
      
    } catch (error) {
      await this.updateJobStatus(jobId, 'failed', { error: error.message });
      await this.notifyFailure(dto.operatorId, error);
    }
  }
}
```

### 9.3 撤销合并（谨慎使用）

```typescript
// 撤销合并（仅在特定条件下允许）
async undoDepartmentMerge(mergeHistoryId: string, operatorId: string) {
  const mergeHistory = await this.prismaService.departmentMergeHistory.findUnique({
    where: { id: mergeHistoryId },
  });
  
  if (!mergeHistory) {
    throw new NotFoundException('合并记录不存在');
  }
  
  // 检查是否可以撤销
  const hoursSinceMerge = (Date.now() - mergeHistory.mergedAt.getTime()) / (1000 * 60 * 60);
  if (hoursSinceMerge > 24) {
    throw new BadRequestException('合并超过24小时，无法自动撤销，请手动处理');
  }
  
  // 检查是否有新数据
  const hasNewData = await this.checkNewDataAfterMerge(mergeHistory);
  if (hasNewData) {
    throw new BadRequestException('合并后已有新数据产生，无法自动撤销');
  }
  
  // 执行撤销（反向操作）
  // ... 复杂的回滚逻辑
}
```

## 十、完整示例

### 示例：技术部门重组

**背景**：
```
现有结构：
- 技术一部 (001001) - 30人，2000条数据
- 技术二部 (001002) - 25人，1500条数据
- 技术三部 (001003) - 20人，1200条数据

目标：合并为统一的技术部
```

**执行流程**：

```typescript
// 1. 创建新的技术部（或使用现有的）
const techDept = await createDepartment({
  name: '技术部',
  code: '001001',  // 保留原技术一部的编码
  parentId: 'headquarters',
});

// 2. 执行合并
const result = await mergeDepartments({
  organizationId: 'org123',
  sourceDeptIds: ['dept_001002', 'dept_001003'],  // 技术二部、三部
  targetDeptId: techDept.id,  // 合并到技术部
  reason: '技术部门整合，提高协作效率',
  operatorId: 'admin',
});

// 3. 结果
console.log(result);
/*
{
  success: true,
  targetDepartment: {
    id: 'dept_001001',
    name: '技术部',
    code: '001001',
    historicalCodes: '["001002", "001003"]',  // 记录历史编码
  },
  affectedUsers: 45,  // 25 + 20
  mergedDepartments: 2,
}
*/
```

**合并后的数据访问**：

```typescript
// 张三原来在技术二部，现在自动迁移到技术部
// 查询张三能看到的数据：

const records = await getRecordsForUser('zhangsan');

// SQL:
SELECT * FROM records
WHERE (
  json_extract(__created_by_department, '$.code') = '001001'  -- 技术一部数据（2000条）
  OR json_extract(__created_by_department, '$.code') = '001002'  -- 技术二部数据（1500条）
  OR json_extract(__created_by_department, '$.code') = '001003'  -- 技术三部数据（1200条）
)
AND __deleted_time IS NULL

// 张三现在可以看到 4700 条数据（2000 + 1500 + 1200）
```

**部门状态**：

```sql
-- 合并后的 department 表
| id        | name     | code   | status  | mergedIntoId | historicalCodes      |
|-----------|----------|--------|---------|--------------|----------------------|
| dept_001  | 技术部   | 001001 | active  | NULL         | ["001002","001003"]  |
| dept_002  | 技术二部 | 001002 | merged  | dept_001     | NULL                 |
| dept_003  | 技术三部 | 001003 | merged  | dept_001     | NULL                 |
```

## 十一、总结

### 核心要点

1. **历史数据不变** ⭐⭐⭐
   - 合并前的记录保持原部门信息
   - 通过 `historicalCodes` 映射实现历史数据访问

2. **软标记机制**
   - 使用 `status = 'merged'` 标记已合并部门
   - 保留完整的部门记录，不物理删除

3. **权限继承**
   - 目标部门成员自动获得访问原部门数据的权限
   - 通过历史编码查询实现

4. **人员平滑迁移**
   - 自动迁移所有成员
   - 保持原有的角色和权限级别

5. **完整的审计**
   - 专门的合并历史表
   - 记录影响范围和操作详情

6. **性能优化**
   - 缓存历史编码映射
   - 虚拟列 + 索引加速查询
   - 大规模合并使用异步队列

这个方案确保了部门合并的平滑过渡，既保留了历史数据的完整性，又实现了组织架构的灵活调整！


