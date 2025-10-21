import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { IClsStore } from '../../types/cls';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import type { ICreateDepartmentRo, IUpdateDepartmentRo } from './department.service';
import { DepartmentService } from './department.service';

@Controller('api/department')
@UseGuards(AuthGuard)
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly cls: ClsService<IClsStore>
  ) {}

  @Get()
  async list(@Query('status') status?: string) {
    return await this.departmentService.list({ status });
  }

  @Get('tree')
  async getTree() {
    return await this.departmentService.getTree();
  }

  @Get('generate-code')
  async generateCode(@Query('parentId') parentId?: string) {
    return {
      code: await this.departmentService.generateCode(parentId),
    };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.departmentService.get(id);
  }

  @Post()
  @Permissions('base|create')  // 暂时使用 base 权限，后续可以添加专门的 department 权限
  async create(@Body() body: ICreateDepartmentRo) {
    const userId = this.cls.get('user.id');
    return await this.departmentService.create(body, userId);
  }

  @Patch(':id')
  @Permissions('base|update')
  async update(@Param('id') id: string, @Body() body: IUpdateDepartmentRo) {
    const userId = this.cls.get('user.id');
    return await this.departmentService.update(id, body, userId);
  }

  @Delete(':id')
  @Permissions('base|delete')
  async delete(@Param('id') id: string) {
    const userId = this.cls.get('user.id');
    return await this.departmentService.delete(id, userId);
  }
}

