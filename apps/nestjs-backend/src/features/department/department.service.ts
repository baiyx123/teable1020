import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { Department } from '@teable/db-main-prisma';
import { PrismaService } from '@teable/db-main-prisma';

export interface ICreateDepartmentRo {
  name: string;
  code: string;
  parentId?: string;
  description?: string;
}

export interface IUpdateDepartmentRo {
  name?: string;
  description?: string;
}

export interface IDepartmentVo {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  path?: string;
  level: number;
  description?: string;
  status: string;
  createdTime: Date;
  lastModifiedTime?: Date;
  children?: IDepartmentVo[];
}

@Injectable()
export class DepartmentService {
  constructor(private readonly prismaService: PrismaService) {}

  // 获取所有部门
  async list(query?: { status?: string }): Promise<Department[]> {
    return await this.prismaService.txClient().department.findMany({
      where: {
        status: query?.status || 'active',
      },
      orderBy: [{ level: 'asc' }, { code: 'asc' }],
    });
  }

  // 获取部门树
  async getTree(): Promise<IDepartmentVo[]> {
    const allDepts = await this.list();
    return this.buildTree(allDepts);
  }

  // 构建树形结构
  private buildTree(
    depts: Department[],
    parentId: string | null = null
  ): IDepartmentVo[] {
    return depts
      .filter((d) => d.parentId === parentId)
      .map((dept) => ({
        id: dept.id,
        name: dept.name,
        code: dept.code,
        parentId: dept.parentId || undefined,
        path: dept.path || undefined,
        level: dept.level,
        description: dept.description || undefined,
        status: dept.status,
        createdTime: dept.createdTime,
        lastModifiedTime: dept.lastModifiedTime || undefined,
        children: this.buildTree(depts, dept.id),
      }));
  }

  // 创建部门
  async create(data: ICreateDepartmentRo, userId: string): Promise<Department> {
    let level = 1;
    let path = `/${data.code}/`;

    if (data.parentId) {
      const parent = await this.prismaService.txClient().department.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new NotFoundException('父部门不存在');
      }

      if (parent.status !== 'active') {
        throw new BadRequestException('父部门状态异常，无法添加子部门');
      }

      level = parent.level + 1;
      path = `${parent.path}${data.code}/`;
    }

    // 检查编码是否已存在
    const existing = await this.prismaService.txClient().department.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new BadRequestException(`部门编码 ${data.code} 已存在`);
    }

    return await this.prismaService.txClient().department.create({
      data: {
        name: data.name,
        code: data.code,
        parentId: data.parentId,
        level,
        path,
        description: data.description,
        status: 'active',
        createdBy: userId,
      },
    });
  }

  // 获取单个部门
  async get(id: string): Promise<Department> {
    const dept = await this.prismaService.txClient().department.findUnique({
      where: { id },
    });

    if (!dept) {
      throw new NotFoundException('部门不存在');
    }

    return dept;
  }

  // 更新部门
  async update(id: string, data: IUpdateDepartmentRo, userId: string): Promise<Department> {
    const dept = await this.get(id);

    if (dept.status !== 'active') {
      throw new BadRequestException('只能更新活跃状态的部门');
    }

    return await this.prismaService.txClient().department.update({
      where: { id },
      data: {
        ...data,
        lastModifiedBy: userId,
      },
    });
  }

  // 删除部门（软删除）
  async delete(id: string, userId: string): Promise<Department> {
    const dept = await this.get(id);

    // 检查是否有子部门
    const children = await this.prismaService.txClient().department.findMany({
      where: { parentId: id, status: 'active' },
    });

    if (children.length > 0) {
      throw new BadRequestException('该部门有子部门，无法删除');
    }

    // 检查是否有用户关联
    const userCount = await this.prismaService.txClient().user.count({
      where: { primaryDepartmentId: id },
    });

    if (userCount > 0) {
      throw new BadRequestException('该部门有关联用户，无法删除');
    }

    return await this.prismaService.txClient().department.update({
      where: { id },
      data: {
        status: 'inactive',
        lastModifiedBy: userId,
      },
    });
  }

  // 生成部门编码（辅助方法）
  async generateCode(parentId?: string): Promise<string> {
    if (!parentId) {
      // 生成一级部门编码
      const maxDept = await this.prismaService.txClient().department.findFirst({
        where: { parentId: null },
        orderBy: { code: 'desc' },
        select: { code: true },
      });

      if (!maxDept) {
        return '001';
      }

      const nextNum = parseInt(maxDept.code) + 1;
      return String(nextNum).padStart(3, '0');
    }

    // 生成子部门编码
    const parent = await this.get(parentId);
    const maxChild = await this.prismaService.txClient().department.findFirst({
      where: { parentId },
      orderBy: { code: 'desc' },
      select: { code: true },
    });

    if (!maxChild) {
      return `${parent.code}001`;
    }

    const parentCode = parent.code;
    const childSuffix = maxChild.code.slice(parentCode.length);
    const nextNum = parseInt(childSuffix) + 1;

    return parentCode + String(nextNum).padStart(3, '0');
  }
}

