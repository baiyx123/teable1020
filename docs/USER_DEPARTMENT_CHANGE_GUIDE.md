# 用户更换部门处理指南

## 一、业务场景

### 1.1 常见的部门变更场景

**场景一：调岗（主部门变更）**
```
张三：技术部 → 市场部
- 原主部门：技术部 (001001)
- 新主部门：市场部 (001002)
```

**场景二：晋升（部门和职位变更）**
```
李四：研发组员工 → 技术部经理
- 原主部门：研发一组 (001001001)
- 新主部门：技术部 (001001)
- 权限提升：普通员工 → 部门经理
```

**场景三：兼职变更（增加/删除兼职部门）**
```
王五：技术部（主） + 市场部（兼） → 技术部（主） + 产品部（兼）
- 主部门不变
- 兼职部门从市场部改为产品部
```

**场景四：离职（移除所有部门）**
```
赵六：离开公司
- 需要保留历史数据
- 移除所有部门关联
- 但不删除用户账号
```

## 二、核心原则

### 2.1 历史数据不变原则 ⭐⭐⭐

**最重要的原则**：用户更换部门后，其历史创建的记录的部门信息**不应该改变**。

**原因**：
1. ✅ **审计追溯**：需要知道记录创建时的实际部门归属
2. ✅ **统计准确**：部门业绩统计应基于创建时的部门
3. ✅ **权责明确**：历史数据的权责关系不应因人员变动而改变
4. ✅ **数据一致性**：避免批量更新大量历史数据

**示例**：
```typescript
// 张三在技术部时创建了100条记录
// 这100条记录的 __created_by_department 都是 "技术部 (001001)"

// 张三调到市场部后
// ❌ 错误做法：批量更新这100条记录的部门为市场部
// ✅ 正确做法：保持这100条记录的部门仍为技术部
// ✅ 新创建的记录：使用市场部
```

### 2.2 权限立即生效原则

用户的部门变更后，权限应该立即生效：
- 新部门的数据立即可见
- 旧部门的数据访问权限按规则处理
- 缓存需要及时失效

### 2.3 可追溯原则

所有部门变更需要记录日志，包括：
- 何时变更
- 谁操作的变更
- 从哪个部门到哪个部门
- 变更原因

## 三、数据库设计

### 3.1 UserOrganization 表设计

```prisma
model UserOrganization {
  id             String    @id @default(cuid())
  userId         String    @map("user_id")
  organizationId String    @map("organization_id")
  departmentId   String    @map("department_id")
  
  // 核心字段
  isPrimary      Boolean   @default(false) @map("is_primary")
  isAdmin        Boolean   @default(false) @map("is_admin")
  role           String?
  
  // 时间字段（重要！）
  joinTime       DateTime  @default(now()) @map("join_time")      // 加入时间
  leaveTime      DateTime? @map("leave_time")                     // 离开时间
  
  // 审计字段
  createdBy      String?   @map("created_by")                     // 谁添加的
  updatedBy      String?   @map("updated_by")                     // 谁修改的
  reason         String?                                          // 变更原因
  
  user           User         @relation(fields: [userId], references: [id])
  organization   Organization @relation(fields: [organizationId], references: [id])
  department     Department   @relation(fields: [departmentId], references: [id])
  
  @@unique([userId, organizationId, departmentId])
  @@index([userId])
  @@index([userId, leaveTime])  // 查询当前部门
  @@map("user_organization")
}
```

### 3.2 部门变更历史表（可选）

如果需要详细的变更历史，可以创建专门的历史表：

```prisma
model UserDepartmentHistory {
  id             String   @id @default(cuid())
  userId         String   @map("user_id")
  organizationId String   @map("organization_id")
  
  // 变更信息
  fromDepartmentId String?  @map("from_department_id")  // 原部门（可为空，新员工入职）
  toDepartmentId   String?  @map("to_department_id")    // 新部门（可为空，离职）
  changeType       String   @map("change_type")         // 变更类型：transfer/promote/demote/leave/join
  
  // 主部门标识
  isPrimaryChange  Boolean  @map("is_primary_change")   // 是否为主部门变更
  
  // 审计信息
  changedAt        DateTime @default(now()) @map("changed_at")
  changedBy        String   @map("changed_by")          // 操作人
  reason           String?                              // 变更原因
  approvedBy       String?  @map("approved_by")         // 审批人
  
  user             User         @relation(fields: [userId], references: [id])
  organization     Organization @relation(fields: [organizationId], references: [id])
  
  @@index([userId])
  @@index([userId, changedAt])
  @@map("user_department_history")
}
```

## 四、实现方案

### 4.1 更换主部门

```typescript
// apps/nestjs-backend/src/features/department/department.service.ts

interface ChangePrimaryDepartmentDto {
  userId: string;
  organizationId: string;
  fromDepartmentId: string;
  toDepartmentId: string;
  reason?: string;
  operatorId: string;  // 操作人（HR或管理员）
}

@Injectable()
export class DepartmentService {
  
  async changePrimaryDepartment(dto: ChangePrimaryDepartmentDto) {
    const { userId, organizationId, fromDepartmentId, toDepartmentId, reason, operatorId } = dto;
    
    // 1. 验证：用户当前的主部门是否正确
    const currentPrimary = await this.prismaService.userOrganization.findFirst({
      where: {
        userId,
        organizationId,
        departmentId: fromDepartmentId,
        isPrimary: true,
        leaveTime: null,
      },
    });
    
    if (!currentPrimary) {
      throw new BadRequestException('用户当前主部门不匹配');
    }
    
    // 2. 验证：新部门是否存在
    const newDept = await this.prismaService.department.findUnique({
      where: { id: toDepartmentId },
    });
    
    if (!newDept) {
      throw new NotFoundException('目标部门不存在');
    }
    
    // 3. 在事务中执行变更
    return await this.prismaService.$transaction(async (tx) => {
      const now = new Date();
      
      // 3.1 将原主部门标记为离开（但保留记录）
      await tx.userOrganization.update({
        where: { id: currentPrimary.id },
        data: {
          isPrimary: false,    // 不再是主部门
          leaveTime: now,       // 记录离开时间
          updatedBy: operatorId,
        },
      });
      
      // 3.2 检查用户是否已经在新部门（可能之前就是兼职）
      const existingRelation = await tx.userOrganization.findFirst({
        where: {
          userId,
          organizationId,
          departmentId: toDepartmentId,
          leaveTime: null,
        },
      });
      
      if (existingRelation) {
        // 3.2.1 已存在关联，将其设为主部门
        await tx.userOrganization.update({
          where: { id: existingRelation.id },
          data: {
            isPrimary: true,
            updatedBy: operatorId,
          },
        });
      } else {
        // 3.2.2 不存在关联，创建新的
        await tx.userOrganization.create({
          data: {
            userId,
            organizationId,
            departmentId: toDepartmentId,
            isPrimary: true,
            joinTime: now,
            createdBy: operatorId,
            reason,
          },
        });
      }
      
      // 3.3 记录变更历史
      await tx.userDepartmentHistory.create({
        data: {
          userId,
          organizationId,
          fromDepartmentId,
          toDepartmentId,
          changeType: 'transfer',
          isPrimaryChange: true,
          changedBy: operatorId,
          reason,
        },
      });
      
      // 3.4 清除缓存
      await this.clearUserDepartmentCache(userId);
      
      // 3.5 发送通知
      await this.notificationService.notifyDepartmentChange(userId, fromDepartmentId, toDepartmentId);
      
      return {
        success: true,
        message: '主部门变更成功',
      };
    });
  }
  
  // 清除用户部门缓存
  private async clearUserDepartmentCache(userId: string) {
    await this.redis.del(`user:${userId}:departments`);
    await this.redis.del(`user:${userId}:primary_dept`);
  }
}
```

### 4.2 添加兼职部门

```typescript
interface AddSecondaryDepartmentDto {
  userId: string;
  organizationId: string;
  departmentId: string;
  role?: string;
  workload?: number;  // 工作量占比
  operatorId: string;
}

async addSecondaryDepartment(dto: AddSecondaryDepartmentDto) {
  const { userId, organizationId, departmentId, role, workload, operatorId } = dto;
  
  // 1. 验证：用户是否已经在该部门
  const existing = await this.prismaService.userOrganization.findFirst({
    where: {
      userId,
      organizationId,
      departmentId,
      leaveTime: null,
    },
  });
  
  if (existing) {
    throw new BadRequestException('用户已经在该部门');
  }
  
  // 2. 添加兼职部门
  const result = await this.prismaService.userOrganization.create({
    data: {
      userId,
      organizationId,
      departmentId,
      isPrimary: false,  // 兼职部门
      role,
      workload,
      joinTime: new Date(),
      createdBy: operatorId,
    },
  });
  
  // 3. 清除缓存
  await this.clearUserDepartmentCache(userId);
  
  return result;
}
```

### 4.3 移除兼职部门

```typescript
interface RemoveSecondaryDepartmentDto {
  userId: string;
  organizationId: string;
  departmentId: string;
  operatorId: string;
  reason?: string;
}

async removeSecondaryDepartment(dto: RemoveSecondaryDepartmentDto) {
  const { userId, organizationId, departmentId, operatorId, reason } = dto;
  
  // 1. 验证：确保不是主部门
  const relation = await this.prismaService.userOrganization.findFirst({
    where: {
      userId,
      organizationId,
      departmentId,
      leaveTime: null,
    },
  });
  
  if (!relation) {
    throw new NotFoundException('用户不在该部门');
  }
  
  if (relation.isPrimary) {
    throw new BadRequestException('不能移除主部门，请先更换主部门');
  }
  
  // 2. 标记为离开（软删除）
  await this.prismaService.userOrganization.update({
    where: { id: relation.id },
    data: {
      leaveTime: new Date(),
      updatedBy: operatorId,
      reason,
    },
  });
  
  // 3. 清除缓存
  await this.clearUserDepartmentCache(userId);
  
  return { success: true };
}
```

### 4.4 用户离职

```typescript
interface UserLeaveDto {
  userId: string;
  organizationId: string;
  leaveDate?: Date;
  operatorId: string;
  reason?: string;
}

async userLeave(dto: UserLeaveDto) {
  const { userId, organizationId, leaveDate, operatorId, reason } = dto;
  
  return await this.prismaService.$transaction(async (tx) => {
    const now = leaveDate || new Date();
    
    // 1. 将用户在该组织的所有部门关系标记为离开
    await tx.userOrganization.updateMany({
      where: {
        userId,
        organizationId,
        leaveTime: null,
      },
      data: {
        leaveTime: now,
        updatedBy: operatorId,
        reason: reason || '离职',
      },
    });
    
    // 2. 记录变更历史
    const userDepts = await tx.userOrganization.findMany({
      where: { userId, organizationId },
      include: { department: true },
    });
    
    for (const dept of userDepts) {
      await tx.userDepartmentHistory.create({
        data: {
          userId,
          organizationId,
          fromDepartmentId: dept.departmentId,
          toDepartmentId: null,
          changeType: 'leave',
          isPrimaryChange: dept.isPrimary,
          changedBy: operatorId,
          reason,
        },
      });
    }
    
    // 3. 清除缓存
    await this.clearUserDepartmentCache(userId);
    
    // 4. 发送通知
    await this.notificationService.notifyUserLeave(userId, organizationId);
    
    return { success: true };
  });
}
```

## 五、查询逻辑调整

### 5.1 获取用户当前部门

```typescript
// 查询用户当前的所有部门（排除已离开的）
async getUserCurrentDepartments(userId: string, organizationId: string) {
  return await this.prismaService.userOrganization.findMany({
    where: {
      userId,
      organizationId,
      leaveTime: null,  // 关键：只查询未离开的
    },
    include: {
      department: {
        select: {
          id: true,
          name: true,
          code: true,
          path: true,
        },
      },
    },
    orderBy: [
      { isPrimary: 'desc' },  // 主部门排在前面
      { joinTime: 'asc' },
    ],
  });
}

// 获取用户的主部门
async getUserPrimaryDepartment(userId: string, organizationId: string) {
  return await this.prismaService.userOrganization.findFirst({
    where: {
      userId,
      organizationId,
      isPrimary: true,
      leaveTime: null,  // 关键：确保是当前的主部门
    },
    include: {
      department: true,
    },
  });
}
```

### 5.2 记录查询（考虑历史部门）

用户更换部门后，如何查询记录？

**策略一：只看当前部门的数据（推荐）**
```typescript
async getRecordsForUser(userId: string) {
  // 只获取用户当前的部门
  const currentDepts = await this.getUserCurrentDepartments(userId);
  const deptCodes = currentDepts.map(d => d.department.code);
  
  // 查询这些部门的数据
  const conditions = deptCodes.map(code => 
    `json_extract(__created_by_department, '$.code') = '${code}'`
  );
  
  const sql = `
    SELECT * FROM table_xxx
    WHERE (${conditions.join(' OR ')})
      AND __deleted_time IS NULL
  `;
  
  return await db.$queryRawUnsafe(sql);
}
```

**策略二：可以看历史部门的数据**
```typescript
async getRecordsForUser(userId: string, includeHistorical = false) {
  let departments;
  
  if (includeHistorical) {
    // 获取用户历史上所有待过的部门
    departments = await this.prismaService.userOrganization.findMany({
      where: { userId },
      include: { department: { select: { code: true } } },
    });
  } else {
    // 只获取当前部门
    departments = await this.getUserCurrentDepartments(userId);
  }
  
  const deptCodes = departments.map(d => d.department.code);
  
  // 构建查询...
}
```

**推荐策略一**，原因：
- ✅ 符合权限最小化原则
- ✅ 避免离职员工仍能访问旧部门数据
- ✅ 清晰的权限边界

## 六、历史记录查询

### 6.1 查询用户的部门变更历史

```typescript
// 获取用户的部门变更历史
async getUserDepartmentHistory(userId: string, organizationId: string) {
  const history = await this.prismaService.userDepartmentHistory.findMany({
    where: {
      userId,
      organizationId,
    },
    include: {
      fromDepartment: {
        select: { name: true, code: true },
      },
      toDepartment: {
        select: { name: true, code: true },
      },
    },
    orderBy: { changedAt: 'desc' },
  });
  
  return history;
}

// 示例返回结果
[
  {
    changedAt: '2024-01-15',
    changeType: 'transfer',
    fromDepartment: { name: '技术部', code: '001001' },
    toDepartment: { name: '市场部', code: '001002' },
    reason: '业务调整',
    changedBy: 'hr_admin',
  },
  {
    changedAt: '2023-06-01',
    changeType: 'join',
    fromDepartment: null,
    toDepartment: { name: '技术部', code: '001001' },
    reason: '新员工入职',
    changedBy: 'hr_admin',
  }
]
```

### 6.2 查询部门的人员变动历史

```typescript
// 获取部门的人员变动历史
async getDepartmentMemberHistory(departmentId: string, startDate?: Date, endDate?: Date) {
  const history = await this.prismaService.userDepartmentHistory.findMany({
    where: {
      OR: [
        { fromDepartmentId: departmentId },
        { toDepartmentId: departmentId },
      ],
      changedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { changedAt: 'desc' },
  });
  
  return history;
}
```

## 七、权限和缓存处理

### 7.1 缓存失效

部门变更时必须清除相关缓存：

```typescript
class DepartmentCacheManager {
  
  async invalidateOnDepartmentChange(userId: string) {
    const keys = [
      `user:${userId}:departments`,          // 用户部门列表
      `user:${userId}:primary_dept`,        // 主部门
      `user:${userId}:dept_permissions`,    // 部门权限
      `user:${userId}:accessible_records`,  // 可访问记录列表
    ];
    
    await Promise.all(keys.map(key => this.redis.del(key)));
    
    // 发送缓存失效事件（如果是分布式系统）
    await this.eventBus.publish('user.department.changed', { userId });
  }
}
```

### 7.2 实时权限检查

```typescript
// 访问记录时检查权限
async canAccessRecord(userId: string, recordId: string): Promise<boolean> {
  // 1. 获取记录的创建部门
  const record = await this.getRecord(recordId);
  const recordDeptCode = JSON.parse(record.__created_by_department).code;
  
  // 2. 获取用户当前的部门（注意：不包含已离开的）
  const userDepts = await this.getUserCurrentDepartments(userId);
  const userDeptCodes = userDepts.map(d => d.department.code);
  
  // 3. 检查记录的部门是否在用户当前部门列表中
  return userDeptCodes.includes(recordDeptCode);
}
```

## 八、API 接口设计

### 8.1 部门变更相关接口

```typescript
// 更换主部门
POST /api/organization/{orgId}/user/{userId}/change-primary-department
{
  fromDepartmentId: string;
  toDepartmentId: string;
  reason?: string;
}

// 添加兼职部门
POST /api/organization/{orgId}/user/{userId}/department
{
  departmentId: string;
  role?: string;
  workload?: number;
}

// 移除兼职部门
DELETE /api/organization/{orgId}/user/{userId}/department/{deptId}
Query: {
  reason?: string;
}

// 用户离职
POST /api/organization/{orgId}/user/{userId}/leave
{
  leaveDate?: string;
  reason?: string;
}

// 获取用户部门变更历史
GET /api/organization/{orgId}/user/{userId}/department-history

// 获取部门人员变动历史
GET /api/organization/{orgId}/department/{deptId}/member-history
Query: {
  startDate?: string;
  endDate?: string;
}
```

## 九、UI/UX 设计

### 9.1 部门变更界面

```typescript
<UserDepartmentManagement>
  {/* 当前部门信息 */}
  <CurrentDepartments>
    <PrimaryDepartment>
      <Badge variant="primary">主部门</Badge>
      <DepartmentName>技术部 (001001)</DepartmentName>
      <JoinDate>加入时间: 2023-06-01</JoinDate>
      <Actions>
        <Button onClick={handleChangePrimary}>更换主部门</Button>
      </Actions>
    </PrimaryDepartment>
    
    <SecondaryDepartments>
      <Department>
        <Badge>兼职</Badge>
        <DepartmentName>市场部 (001002)</DepartmentName>
        <JoinDate>加入时间: 2024-01-15</JoinDate>
        <Actions>
          <Button onClick={handleRemove}>移除</Button>
        </Actions>
      </Department>
    </SecondaryDepartments>
    
    <AddButton onClick={handleAddSecondary}>添加兼职部门</AddButton>
  </CurrentDepartments>
  
  {/* 变更历史 */}
  <DepartmentHistory>
    <Timeline>
      <TimelineItem>
        <Date>2024-01-15</Date>
        <Action>从 技术部 调至 市场部</Action>
        <Reason>业务调整</Reason>
        <Operator>HR Admin</Operator>
      </TimelineItem>
      <TimelineItem>
        <Date>2023-06-01</Date>
        <Action>入职，加入 技术部</Action>
        <Operator>HR Admin</Operator>
      </TimelineItem>
    </Timeline>
  </DepartmentHistory>
</UserDepartmentManagement>
```

### 9.2 更换主部门对话框

```typescript
<ChangePrimaryDepartmentDialog>
  <Form>
    <FormField label="当前主部门">
      <Input value="技术部 (001001)" disabled />
    </FormField>
    
    <FormField label="新主部门" required>
      <DepartmentSelector 
        value={newDepartment}
        onChange={setNewDepartment}
        excludeIds={[currentDepartmentId]}
      />
    </FormField>
    
    <FormField label="变更原因">
      <Select>
        <Option value="transfer">调岗</Option>
        <Option value="promote">晋升</Option>
        <Option value="demote">降职</Option>
        <Option value="other">其他</Option>
      </Select>
    </FormField>
    
    <FormField label="详细说明">
      <Textarea placeholder="请输入变更说明..." />
    </FormField>
    
    <Alert variant="warning">
      ⚠️ 注意：更换主部门后
      - 新创建的记录将归属新部门
      - 历史记录的部门归属不变
      - 权限将立即生效
    </Alert>
    
    <Actions>
      <Button variant="secondary" onClick={onCancel}>取消</Button>
      <Button variant="primary" onClick={handleSubmit}>确认变更</Button>
    </Actions>
  </Form>
</ChangePrimaryDepartmentDialog>
```

## 十、注意事项

### 10.1 数据一致性

1. ✅ **使用事务**：部门变更操作必须在事务中完成
2. ✅ **软删除**：使用 `leaveTime` 标记离开，而不是直接删除记录
3. ✅ **历史记录**：保留完整的部门变更历史
4. ✅ **审计日志**：记录操作人、操作时间、变更原因

### 10.2 权限控制

1. ✅ **谁能操作**：通常只有 HR 或部门主管有权限变更员工部门
2. ✅ **审批流程**：重要的部门变更可能需要审批
3. ✅ **自助服务**：员工可以查看自己的部门历史，但不能修改

### 10.3 性能考虑

1. ✅ **索引优化**：在 `leaveTime` 字段上建立索引
2. ✅ **缓存清理**：及时清理相关缓存
3. ✅ **异步通知**：部门变更通知可以异步发送

### 10.4 历史数据处理

```typescript
// ❌ 错误：批量更新历史记录的部门
await db.records.updateMany({
  where: { __created_by: userId },
  data: { __created_by_department: newDepartment },
});

// ✅ 正确：保持历史记录不变，只影响新记录
// 创建新记录时自动使用新的主部门
```

## 十一、完整示例

### 示例：张三的部门变更过程

**初始状态（2023-06-01）**
```
张三入职，主部门：技术部 (001001)
```

**第一次调整（2024-01-15）**
```
- 操作：添加兼职部门
- 新增：市场部 (001002) 兼职
- 结果：
  - 主部门：技术部 (001001)
  - 兼职部门：市场部 (001002)
```

**第二次调整（2024-06-01）**
```
- 操作：更换主部门
- 从：技术部 (001001) → 市场部 (001002)
- 结果：
  - 主部门：市场部 (001002)
  - 兼职部门：技术部 (001001) [原主部门自动变为兼职]
```

**数据库状态**：
```sql
-- user_organization 表
| id | userId | deptId  | isPrimary | joinTime   | leaveTime |
|----|--------|---------|-----------|------------|-----------|
| 1  | 张三   | 001001  | false     | 2023-06-01 | NULL      | -- 现在是兼职
| 2  | 张三   | 001002  | true      | 2024-01-15 | NULL      | -- 现在是主部门

-- user_department_history 表
| id | userId | fromDept | toDept  | changeType | changedAt  |
|----|--------|----------|---------|------------|------------|
| 1  | 张三   | NULL     | 001001  | join       | 2023-06-01 |
| 2  | 张三   | NULL     | 001002  | join       | 2024-01-15 |
| 3  | 张三   | 001001   | 001002  | transfer   | 2024-06-01 |
```

**记录的部门归属**：
```typescript
// 2023年创建的100条记录：仍然是技术部 (001001)
// 2024年1-5月创建的50条记录：仍然是技术部 (001001)
// 2024年6月后创建的记录：市场部 (001002)

// 查询张三能看到的数据：
// 技术部 (001001) 的数据 + 市场部 (001002) 的数据
```

## 十二、总结

### 核心要点

1. **历史数据不变** ⭐⭐⭐
   - 用户更换部门后，历史记录的部门信息不应改变
   - 只有新创建的记录使用新部门

2. **软删除机制**
   - 使用 `leaveTime` 标记离开部门
   - 保留完整的历史关系

3. **权限立即生效**
   - 查询时只看 `leaveTime IS NULL` 的部门
   - 及时清除缓存

4. **完整的审计追踪**
   - 记录所有变更历史
   - 包含操作人、时间、原因

5. **灵活的兼职机制**
   - 原主部门可以自动变为兼职部门
   - 支持多个兼职部门

这种设计既保证了数据的准确性和可追溯性，又提供了灵活的部门管理能力。

