# 基于 Teable 构建 IAM 系统

## 一、概念与优势

### 1.1 为什么用 Teable 构建 IAM？

**"吃自己的狗粮"（Dogfooding）的典型案例**

使用 Teable 来构建 IAM 系统有以下优势：

1. ✅ **快速原型验证**：无需写代码，快速搭建 IAM 原型
2. ✅ **可视化管理**：用 Teable 的界面直接管理用户、部门、角色
3. ✅ **灵活扩展**：充分利用 Teable 的字段、视图、过滤、关联等功能
4. ✅ **最佳实践展示**：成为 Teable 的典型应用案例
5. ✅ **降低开发成本**：复用 Teable 的能力，专注业务逻辑
6. ✅ **API 现成**：Teable 的 API 直接变成 IAM API

### 1.2 架构设计

```
┌──────────────────────────────────────────────────────────┐
│                    IAM Base (Teable)                      │
│                                                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐   │
│  │用户表   │  │部门表   │  │角色表   │  │权限表    │   │
│  │Users    │  │Depts    │  │Roles    │  │Perms     │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬─────┘   │
│       │            │            │            │          │
│       └────────────┴────────────┴────────────┘          │
│                    │                                     │
│         ┌──────────┴──────────┐                        │
│         │                     │                        │
│  ┌──────▼──────┐      ┌──────▼──────┐                │
│  │用户部门关联  │      │用户角色关联  │                │
│  │UserDepts    │      │UserRoles    │                │
│  └─────────────┘      └─────────────┘                │
└──────────────────────────────────────────────────────────┘
                         ↓
              ┌──────────────────────┐
              │   Teable OpenAPI     │
              └──────────────────────┘
                         ↓
              ┌──────────────────────┐
              │   IAM Service        │
              │  (封装层/SDK)         │
              └──────────────────────┘
                         ↓
              ┌──────────────────────┐
              │   业务系统           │
              │  (其他 Teable Base)  │
              └──────────────────────┘
```

## 二、Base 设计（核心）

### 2.1 创建 IAM Base

在 Teable 中创建一个专门的 Base，命名为 "IAM System"。

### 2.2 表结构设计

#### 表 1: 组织表 (Organizations)

| 字段名 | 字段类型 | 说明 | 配置 |
|--------|---------|------|------|
| ID | Auto Number | 自动编号 | 主键 |
| 名称 | Single Line Text | 组织名称 | 必填 |
| 编码 | Single Line Text | 组织编码 (如 ORG001) | 必填、唯一 |
| Logo | Attachment | 组织 Logo | |
| 域名 | Single Line Text | 独立域名 | |
| 状态 | Single Select | active/inactive | 必填 |
| 配置 | Long Text | JSON 配置 | |
| 创建时间 | Created Time | 创建时间 | 自动 |
| 更新时间 | Last Modified Time | 更新时间 | 自动 |
| 部门 | Link | 关联到 Departments | 一对多 |
| 用户 | Link | 关联到 UserOrganizations | 一对多 |

#### 表 2: 部门表 (Departments)

| 字段名 | 字段类型 | 说明 | 配置 |
|--------|---------|------|------|
| ID | Auto Number | 自动编号 | 主键 |
| 组织 | Link | 关联到 Organizations | 必填 |
| 部门名称 | Single Line Text | 部门名称 | 必填 |
| 部门编码 | Single Line Text | 层级编码 (001, 001001) | 必填 |
| 父部门 | Link | 关联到 Departments (自关联) | |
| 层级 | Number | 层级深度 (1, 2, 3...) | |
| 路径 | Single Line Text | 路径 (/001/001001/) | |
| 路径名称 | Single Line Text | 名称路径 | |
| 状态 | Single Select | active/merged/archived | 必填 |
| 合并到 | Link | 关联到 Departments | |
| 合并时间 | Date | 合并日期时间 | |
| 历史编码 | Long Text | JSON 数组 | |
| 负责人 | Link | 关联到 Users | |
| 描述 | Long Text | 部门描述 | |
| 创建时间 | Created Time | | 自动 |
| 更新时间 | Last Modified Time | | 自动 |
| 子部门 | Link | 关联到 Departments | 一对多 |
| 成员 | Link | 关联到 UserOrganizations | 一对多 |

**视图建议**：
- 默认视图：树形展示（按层级排序）
- 活跃部门：过滤 status = 'active'
- 已合并部门：过滤 status = 'merged'
- 按组织分类：分组视图

#### 表 3: 用户表 (Users)

| 字段名 | 字段类型 | 说明 | 配置 |
|--------|---------|------|------|
| ID | Auto Number | 自动编号 | 主键 |
| 用户名 | Single Line Text | 登录用户名 | 必填、唯一 |
| 邮箱 | Email | 邮箱地址 | 必填、唯一 |
| 手机号 | Phone Number | 手机号码 | 唯一 |
| 姓名 | Single Line Text | 真实姓名 | 必填 |
| 头像 | Attachment | 用户头像 | |
| 状态 | Single Select | active/inactive/locked | 必填 |
| 最后登录 | Date | 最后登录时间 | |
| 创建时间 | Created Time | | 自动 |
| 更新时间 | Last Modified Time | | 自动 |
| 组织关联 | Link | 关联到 UserOrganizations | 一对多 |
| 角色关联 | Link | 关联到 UserRoles | 一对多 |

#### 表 4: 用户组织部门关联表 (UserOrganizations)

| 字段名 | 字段类型 | 说明 | 配置 |
|--------|---------|------|------|
| ID | Auto Number | 自动编号 | 主键 |
| 用户 | Link | 关联到 Users | 必填 |
| 组织 | Link | 关联到 Organizations | 必填 |
| 部门 | Link | 关联到 Departments | 必填 |
| 是主部门 | Checkbox | 是否为主部门 | |
| 是管理员 | Checkbox | 是否为部门管理员 | |
| 角色 | Single Line Text | 在该部门的角色 | |
| 职位 | Single Line Text | 职位名称 | |
| 工作量 | Number | 工作量占比 (%) | |
| 加入时间 | Date | 加入日期时间 | 必填 |
| 离开时间 | Date | 离开日期时间 | |
| 创建时间 | Created Time | | 自动 |
| 更新时间 | Last Modified Time | | 自动 |

**视图建议**：
- 当前成员：过滤 离开时间 = null
- 主部门关系：过滤 是主部门 = true
- 按部门分组：分组视图
- 按用户分组：分组视图

#### 表 5: 角色表 (Roles)

| 字段名 | 字段类型 | 说明 | 配置 |
|--------|---------|------|------|
| ID | Auto Number | 自动编号 | 主键 |
| 组织 | Link | 关联到 Organizations (可选) | |
| 角色名称 | Single Line Text | 角色名称 | 必填 |
| 角色编码 | Single Line Text | 角色编码 (role_admin) | 必填 |
| 类型 | Single Select | system/custom/department | 必填 |
| 描述 | Long Text | 角色描述 | |
| 是内置 | Checkbox | 是否为系统内置角色 | |
| 创建时间 | Created Time | | 自动 |
| 更新时间 | Last Modified Time | | 自动 |
| 权限关联 | Link | 关联到 RolePermissions | 一对多 |
| 用户关联 | Link | 关联到 UserRoles | 一对多 |

**预置角色**：
- 超级管理员 (super_admin)
- 组织管理员 (org_admin)
- 部门管理员 (dept_admin)
- 普通成员 (member)
- 只读用户 (viewer)

#### 表 6: 权限表 (Permissions)

| 字段名 | 字段类型 | 说明 | 配置 |
|--------|---------|------|------|
| ID | Auto Number | 自动编号 | 主键 |
| 资源 | Single Line Text | 资源类型 (user, department) | 必填 |
| 动作 | Single Line Text | 操作 (create, read, update) | 必填 |
| 范围 | Single Select | own/department/org/all | 必填 |
| 条件 | Long Text | JSON 条件表达式 | |
| 描述 | Single Line Text | 权限描述 | |
| 创建时间 | Created Time | | 自动 |
| 角色关联 | Link | 关联到 RolePermissions | 一对多 |

**权限示例**：
```
资源: record, 动作: read, 范围: department
资源: user, 动作: update, 范围: own
资源: department, 动作: manage, 范围: department
```

#### 表 7: 角色权限关联表 (RolePermissions)

| 字段名 | 字段类型 | 说明 | 配置 |
|--------|---------|------|------|
| ID | Auto Number | 自动编号 | 主键 |
| 角色 | Link | 关联到 Roles | 必填 |
| 权限 | Link | 关联到 Permissions | 必填 |
| 创建时间 | Created Time | | 自动 |

#### 表 8: 用户角色关联表 (UserRoles)

| 字段名 | 字段类型 | 说明 | 配置 |
|--------|---------|------|------|
| ID | Auto Number | 自动编号 | 主键 |
| 用户 | Link | 关联到 Users | 必填 |
| 角色 | Link | 关联到 Roles | 必填 |
| 范围类型 | Single Select | department/organization/global | |
| 范围ID | Single Line Text | 对应的部门或组织ID | |
| 授予时间 | Date | 授予日期时间 | 必填 |
| 授予人 | Link | 关联到 Users | |
| 过期时间 | Date | 过期日期时间 | |
| 创建时间 | Created Time | | 自动 |

#### 表 9: 部门变更历史 (DepartmentHistory)

| 字段名 | 字段类型 | 说明 | 配置 |
|--------|---------|------|------|
| ID | Auto Number | 自动编号 | 主键 |
| 用户 | Link | 关联到 Users | 必填 |
| 组织 | Link | 关联到 Organizations | 必填 |
| 原部门 | Link | 关联到 Departments | |
| 新部门 | Link | 关联到 Departments | |
| 变更类型 | Single Select | transfer/promote/merge/leave | 必填 |
| 是否主部门 | Checkbox | 是否为主部门变更 | |
| 变更时间 | Date | 变更日期时间 | 必填 |
| 操作人 | Link | 关联到 Users | 必填 |
| 原因 | Long Text | 变更原因 | |
| 创建时间 | Created Time | | 自动 |

#### 表 10: 审计日志 (AuditLogs)

| 字段名 | 字段类型 | 说明 | 配置 |
|--------|---------|------|------|
| ID | Auto Number | 自动编号 | 主键 |
| 组织 | Link | 关联到 Organizations | |
| 用户 | Link | 关联到 Users | |
| 动作 | Single Line Text | 操作动作 | 必填 |
| 资源 | Single Line Text | 资源类型 | 必填 |
| 资源ID | Single Line Text | 资源ID | |
| 变更前 | Long Text | JSON 数据 | |
| 变更后 | Long Text | JSON 数据 | |
| IP地址 | Single Line Text | 操作IP | |
| 设备信息 | Long Text | User Agent | |
| 创建时间 | Created Time | | 自动 |

**视图建议**：
- 按用户查看：过滤特定用户
- 按时间范围：日期过滤
- 按动作类型：分组视图
- 最近操作：按创建时间降序

## 三、Teable API 封装

### 3.1 创建 IAM SDK

```typescript
// iam-teable-sdk/src/IAMTeableClient.ts

import { TeableClient } from '@teable/sdk';

export class IAMTeableClient {
  private teable: TeableClient;
  private baseId: string;  // IAM Base ID
  
  private tables = {
    organizations: 'tbl_orgs',
    departments: 'tbl_depts',
    users: 'tbl_users',
    userOrganizations: 'tbl_user_orgs',
    roles: 'tbl_roles',
    permissions: 'tbl_perms',
    rolePermissions: 'tbl_role_perms',
    userRoles: 'tbl_user_roles',
    departmentHistory: 'tbl_dept_history',
    auditLogs: 'tbl_audit_logs',
  };
  
  constructor(config: {
    apiUrl: string;
    apiKey: string;
    iamBaseId: string;
  }) {
    this.teable = new TeableClient({
      apiUrl: config.apiUrl,
      apiKey: config.apiKey,
    });
    this.baseId = config.iamBaseId;
  }
  
  // ========== 用户管理 ==========
  
  async getUser(userId: string) {
    return await this.teable.record.get(this.baseId, this.tables.users, userId);
  }
  
  async createUser(data: {
    username: string;
    email: string;
    name: string;
    organizationId: string;
    departmentId: string;
    isPrimary?: boolean;
  }) {
    // 1. 创建用户
    const user = await this.teable.record.create(this.baseId, this.tables.users, {
      username: data.username,
      email: data.email,
      name: data.name,
      status: 'active',
    });
    
    // 2. 创建用户-部门关联
    await this.teable.record.create(this.baseId, this.tables.userOrganizations, {
      userId: user.id,
      organizationId: data.organizationId,
      departmentId: data.departmentId,
      isPrimary: data.isPrimary ?? true,
      joinTime: new Date().toISOString(),
    });
    
    // 3. 记录审计日志
    await this.logAudit({
      action: 'user:create',
      resource: 'user',
      resourceId: user.id,
      userId: user.id,
    });
    
    return user;
  }
  
  async getUserDepartments(userId: string) {
    // 查询用户的所有部门关联（未离开的）
    const filter = {
      conjunction: 'and',
      filterSet: [
        { fieldId: 'userId', operator: 'is', value: userId },
        { fieldId: 'leaveTime', operator: 'isEmpty' },
      ],
    };
    
    const userOrgs = await this.teable.record.list(
      this.baseId,
      this.tables.userOrganizations,
      { filter }
    );
    
    // 获取部门详情
    const deptIds = userOrgs.records.map(r => r.fields.departmentId);
    const depts = await Promise.all(
      deptIds.map(id => this.getDepartment(id))
    );
    
    return depts;
  }
  
  async getUserPrimaryDepartment(userId: string) {
    const filter = {
      conjunction: 'and',
      filterSet: [
        { fieldId: 'userId', operator: 'is', value: userId },
        { fieldId: 'isPrimary', operator: 'is', value: true },
        { fieldId: 'leaveTime', operator: 'isEmpty' },
      ],
    };
    
    const userOrgs = await this.teable.record.list(
      this.baseId,
      this.tables.userOrganizations,
      { filter, take: 1 }
    );
    
    if (userOrgs.records.length === 0) {
      throw new Error('用户没有主部门');
    }
    
    const deptId = userOrgs.records[0].fields.departmentId;
    return await this.getDepartment(deptId);
  }
  
  async getUserAccessibleDepartmentCodes(userId: string): Promise<string[]> {
    const depts = await this.getUserDepartments(userId);
    const codes = depts.map(d => d.fields.code);
    
    // 获取历史编码（如果部门是合并来的）
    const allCodes: string[] = [];
    for (const dept of depts) {
      allCodes.push(dept.fields.code);
      
      if (dept.fields.historicalCodes) {
        const historical = JSON.parse(dept.fields.historicalCodes);
        allCodes.push(...historical);
      }
    }
    
    return [...new Set(allCodes)];  // 去重
  }
  
  // ========== 部门管理 ==========
  
  async getDepartment(deptId: string) {
    return await this.teable.record.get(this.baseId, this.tables.departments, deptId);
  }
  
  async createDepartment(data: {
    organizationId: string;
    name: string;
    parentId?: string;
  }) {
    // 生成编码
    const code = await this.generateDepartmentCode(data.organizationId, data.parentId);
    
    // 计算层级和路径
    const level = await this.calculateLevel(data.parentId);
    const path = await this.calculatePath(data.parentId, code);
    
    const dept = await this.teable.record.create(this.baseId, this.tables.departments, {
      organizationId: data.organizationId,
      name: data.name,
      code,
      parentId: data.parentId,
      level,
      path,
      status: 'active',
    });
    
    await this.logAudit({
      action: 'department:create',
      resource: 'department',
      resourceId: dept.id,
    });
    
    return dept;
  }
  
  async mergeDepartments(data: {
    sourceDeptIds: string[];
    targetDeptId: string;
    reason?: string;
    operatorId: string;
  }) {
    // 1. 获取源部门和目标部门
    const sourceDepts = await Promise.all(
      data.sourceDeptIds.map(id => this.getDepartment(id))
    );
    const targetDept = await this.getDepartment(data.targetDeptId);
    
    // 2. 收集历史编码
    const sourceCodesAll = sourceDepts.map(d => d.fields.code);
    const existingHistorical = targetDept.fields.historicalCodes 
      ? JSON.parse(targetDept.fields.historicalCodes)
      : [];
    const allHistoricalCodes = [...existingHistorical, ...sourceCodesAll];
    
    // 3. 更新目标部门
    await this.teable.record.update(
      this.baseId,
      this.tables.departments,
      data.targetDeptId,
      { historicalCodes: JSON.stringify(allHistoricalCodes) }
    );
    
    // 4. 迁移人员
    for (const sourceDept of sourceDepts) {
      await this.migrateDepartmentMembers(
        sourceDept.id,
        data.targetDeptId,
        data.operatorId
      );
      
      // 5. 标记源部门为已合并
      await this.teable.record.update(
        this.baseId,
        this.tables.departments,
        sourceDept.id,
        {
          status: 'merged',
          mergedIntoId: data.targetDeptId,
          mergedAt: new Date().toISOString(),
        }
      );
    }
    
    // 6. 记录审计日志
    await this.logAudit({
      action: 'department:merge',
      resource: 'department',
      resourceId: data.targetDeptId,
      metadata: {
        sourceDepts: data.sourceDeptIds,
        reason: data.reason,
      },
    });
    
    return {
      success: true,
      targetDepartment: targetDept,
    };
  }
  
  private async migrateDepartmentMembers(
    fromDeptId: string,
    toDeptId: string,
    operatorId: string
  ) {
    // 查询原部门的所有成员
    const filter = {
      conjunction: 'and',
      filterSet: [
        { fieldId: 'departmentId', operator: 'is', value: fromDeptId },
        { fieldId: 'leaveTime', operator: 'isEmpty' },
      ],
    };
    
    const members = await this.teable.record.list(
      this.baseId,
      this.tables.userOrganizations,
      { filter }
    );
    
    const now = new Date().toISOString();
    
    for (const member of members.records) {
      // 1. 标记旧关系为离开
      await this.teable.record.update(
        this.baseId,
        this.tables.userOrganizations,
        member.id,
        {
          leaveTime: now,
          reason: '部门合并自动迁移',
        }
      );
      
      // 2. 创建新关系
      await this.teable.record.create(
        this.baseId,
        this.tables.userOrganizations,
        {
          userId: member.fields.userId,
          organizationId: member.fields.organizationId,
          departmentId: toDeptId,
          isPrimary: member.fields.isPrimary,
          isAdmin: member.fields.isAdmin,
          role: member.fields.role,
          joinTime: now,
          reason: '部门合并自动迁移',
        }
      );
      
      // 3. 记录变更历史
      await this.teable.record.create(
        this.baseId,
        this.tables.departmentHistory,
        {
          userId: member.fields.userId,
          organizationId: member.fields.organizationId,
          fromDepartmentId: fromDeptId,
          toDepartmentId: toDeptId,
          changeType: 'merge_migration',
          isPrimaryChange: member.fields.isPrimary,
          changeTime: now,
          operatorId,
          reason: '部门合并',
        }
      );
    }
  }
  
  // ========== 权限检查 ==========
  
  async checkPermission(data: {
    userId: string;
    resource: string;
    action: string;
    scope?: string;
  }): Promise<boolean> {
    // 1. 获取用户的角色
    const filter = {
      conjunction: 'and',
      filterSet: [
        { fieldId: 'userId', operator: 'is', value: data.userId },
      ],
    };
    
    const userRoles = await this.teable.record.list(
      this.baseId,
      this.tables.userRoles,
      { filter }
    );
    
    if (userRoles.records.length === 0) {
      return false;  // 没有角色，无权限
    }
    
    // 2. 检查角色的权限
    for (const userRole of userRoles.records) {
      const roleId = userRole.fields.roleId;
      
      // 查询角色权限
      const rolePermFilter = {
        fieldId: 'roleId',
        operator: 'is',
        value: roleId,
      };
      
      const rolePerms = await this.teable.record.list(
        this.baseId,
        this.tables.rolePermissions,
        { filter: rolePermFilter }
      );
      
      // 检查权限
      for (const rolePerm of rolePerms.records) {
        const permId = rolePerm.fields.permissionId;
        const perm = await this.teable.record.get(
          this.baseId,
          this.tables.permissions,
          permId
        );
        
        if (
          perm.fields.resource === data.resource &&
          perm.fields.action === data.action &&
          (!data.scope || perm.fields.scope === data.scope)
        ) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // ========== 审计日志 ==========
  
  async logAudit(data: {
    action: string;
    resource: string;
    resourceId?: string;
    userId?: string;
    organizationId?: string;
    metadata?: any;
  }) {
    return await this.teable.record.create(this.baseId, this.tables.auditLogs, {
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      userId: data.userId,
      organizationId: data.organizationId,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      ipAddress: null,  // 需要从请求上下文获取
      deviceInfo: null,
    });
  }
  
  async queryAuditLogs(query: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const filterSet = [];
    
    if (query.userId) {
      filterSet.push({ fieldId: 'userId', operator: 'is', value: query.userId });
    }
    if (query.action) {
      filterSet.push({ fieldId: 'action', operator: 'is', value: query.action });
    }
    if (query.resource) {
      filterSet.push({ fieldId: 'resource', operator: 'is', value: query.resource });
    }
    if (query.startDate) {
      filterSet.push({ fieldId: 'createdTime', operator: 'isAfter', value: query.startDate });
    }
    if (query.endDate) {
      filterSet.push({ fieldId: 'createdTime', operator: 'isBefore', value: query.endDate });
    }
    
    const filter = {
      conjunction: 'and',
      filterSet,
    };
    
    return await this.teable.record.list(
      this.baseId,
      this.tables.auditLogs,
      { filter, orderBy: [{ field: 'createdTime', order: 'desc' }] }
    );
  }
  
  // ========== 辅助方法 ==========
  
  private async generateDepartmentCode(
    organizationId: string,
    parentId?: string
  ): Promise<string> {
    // 简化版本，实际应该更复杂
    const timestamp = Date.now().toString().slice(-6);
    return parentId ? `${parentId}_${timestamp}` : timestamp;
  }
  
  private async calculateLevel(parentId?: string): Promise<number> {
    if (!parentId) return 1;
    
    const parent = await this.getDepartment(parentId);
    return (parent.fields.level as number) + 1;
  }
  
  private async calculatePath(parentId: string | undefined, code: string): Promise<string> {
    if (!parentId) return `/${code}/`;
    
    const parent = await this.getDepartment(parentId);
    return `${parent.fields.path}${code}/`;
  }
}
```

### 3.2 使用示例

```typescript
// 初始化
const iam = new IAMTeableClient({
  apiUrl: 'https://teable.example.com',
  apiKey: 'your-api-key',
  iamBaseId: 'bseXXXXXX',  // IAM Base 的 ID
});

// 创建用户
const user = await iam.createUser({
  username: 'john',
  email: 'john@example.com',
  name: 'John Doe',
  organizationId: 'org_001',
  departmentId: 'dept_001',
  isPrimary: true,
});

// 获取用户可访问的部门编码
const codes = await iam.getUserAccessibleDepartmentCodes(user.id);

// 在业务系统中使用（过滤记录）
const businessBase = 'bseYYYYYY';
const projectTable = 'tblProjects';

const filter = {
  conjunction: 'or',
  filterSet: codes.map(code => ({
    fieldId: 'createdByDepartmentCode',
    operator: 'is',
    value: code,
  })),
};

const records = await teable.record.list(businessBase, projectTable, { filter });
```

## 四、优势与限制

### 4.1 优势

1. ✅ **快速实现**：无需写数据库 Schema，直接在 Teable 中创建表
2. ✅ **可视化管理**：用 Teable 的界面直接管理所有 IAM 数据
3. ✅ **灵活扩展**：需要新字段？直接在表中添加
4. ✅ **开箱即用的功能**：
   - 视图、过滤、排序
   - 导入导出
   - 权限控制（Teable 自身的）
   - 审计日志
5. ✅ **API 现成**：Teable 的 API 直接使用
6. ✅ **降低成本**：不需要独立的数据库和后端服务

### 4.2 限制

1. ⚠️ **性能**：大量用户和权限检查时，可能有性能瓶颈
2. ⚠️ **复杂查询**：某些复杂的权限计算可能需要多次 API 调用
3. ⚠️ **事务支持**：Teable 的批量操作不一定是事务性的
4. ⚠️ **缓存**：需要在 SDK 层实现缓存机制

### 4.3 适用场景

**适合**：
- 🎯 快速原型验证
- 🎯 中小规模系统（<1000 用户）
- 🎯 内部管理系统
- 🎯 展示 Teable 能力的 Demo

**不太适合**：
- ❌ 高性能要求（>10万用户）
- ❌ 复杂的实时权限计算
- ❌ 需要强事务保证的场景

## 五、迁移路径

### 5.1 混合方案

可以先用 Teable 快速搭建，后期根据需要迁移：

```
阶段 1: Teable 实现（原型和 MVP）
  ↓
阶段 2: 混合模式（热数据用独立数据库，冷数据在 Teable）
  ↓
阶段 3: 完全独立（性能优化，独立部署）
```

### 5.2 数据迁移

```typescript
// 从 Teable 导出到独立数据库
async function migrateFromTeableToPostgres() {
  const iam = new IAMTeableClient({...});
  
  // 1. 导出所有用户
  const users = await iam.teable.record.list(baseId, 'tbl_users', {
    take: 10000,
  });
  
  // 2. 插入到 PostgreSQL
  for (const user of users.records) {
    await postgres.user.create({
      id: user.id,
      username: user.fields.username,
      email: user.fields.email,
      // ...
    });
  }
  
  // 3. 导出部门、角色、权限...
}
```

## 六、总结

### 6.1 这是一个绝妙的想法！

使用 Teable 构建 IAM 系统：
1. ✨ 展示了 Teable 的强大能力
2. ✨ "吃自己的狗粮"，发现和改进产品
3. ✨ 快速实现，降低开发成本
4. ✨ 成为最佳实践案例
5. ✨ 可以逐步演进到独立系统

### 6.2 推荐方案

**立即可行**：
```
1. 创建 IAM Base（在 Teable 中）
2. 设计表结构（按本文档）
3. 开发 SDK 封装层
4. 集成到现有 Teable
5. 作为 Demo 展示
```

**长期规划**：
```
1. 收集反馈和性能数据
2. 优化 SDK 和缓存策略
3. 根据需要决定是否独立部署
4. 开源 IAM SDK，让社区使用
```

这样既能快速验证想法，又保留了未来扩展的空间！💪


