/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@nestjs/common';
import type { FieldKeyType } from '@teable/core';
import { FieldType } from '@teable/core';
import { PrismaService } from '@teable/db-main-prisma';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ClsService } from 'nestjs-cls';
import type { IClsStore } from '../../types/cls';
import { createFieldInstanceByRaw } from '../field/model/factory';

@Injectable()
export class SystemFieldService {
  constructor(
    private readonly cls: ClsService<IClsStore>,
    private readonly prismaService: PrismaService,
    @InjectModel('CUSTOM_KNEX') private readonly knex: Knex
  ) {}

  private async updateSystemField(
    dbTableName: string,
    recordIds: string[],
    userId: string,
    timeStr: string
  ) {
    if (!recordIds.length) return;

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
      departmentInfo = JSON.stringify({
        id: user.primaryDepartmentId,
        name: user.primaryDepartmentName,
        code: user.primaryDepartmentCode,
      });
    }

    const nativeQuery = this.knex(dbTableName)
      .update({
        __last_modified_time: timeStr,
        __last_modified_by: userId,
        __last_modified_by_department: departmentInfo,
      })
      .whereIn('__id', recordIds)
      .toQuery();

    await this.prismaService.txClient().$executeRawUnsafe(nativeQuery);
  }

  async getModifiedSystemOpsMap(
    tableId: string,
    fieldKeyType: FieldKeyType,
    records: {
      fields: Record<string, unknown>;
      id: string;
    }[]
  ): Promise<
    {
      fields: Record<string, unknown>;
      id: string;
    }[]
  > {
    const user = this.cls.get('user');
    const timeStr = this.cls.get('tx.timeStr') ?? new Date().toISOString();

    const { dbTableName } = await this.prismaService.txClient().tableMeta.findUniqueOrThrow({
      where: { id: tableId },
      select: { dbTableName: true },
    });

    await this.updateSystemField(
      dbTableName,
      records.map((r) => r.id),
      user.id,
      timeStr
    );

    const fieldsRaw = await this.prismaService.txClient().field.findMany({
      where: {
        tableId,
        deletedTime: null,
        type: {
          in: [
            FieldType.LastModifiedTime,
            FieldType.LastModifiedBy,
            FieldType.LastModifiedByDepartment,
          ],
        },
      },
    });

    if (!fieldsRaw.length) return records;

    // 获取用户的主部门信息（用于 LastModifiedByDepartment 字段）
    const userDept = await this.prismaService.txClient().user.findUnique({
      where: { id: user.id },
      select: {
        primaryDepartmentId: true,
        primaryDepartmentName: true,
        primaryDepartmentCode: true,
      },
    });

    let deptCellValue = null;
    if (userDept?.primaryDepartmentId) {
      deptCellValue = {
        id: userDept.primaryDepartmentId,
        name: userDept.primaryDepartmentName,
        code: userDept.primaryDepartmentCode,
      };
    }

    const systemRecordFields = fieldsRaw.reduce<{ [fieldId: string]: unknown }>((pre, fieldRaw) => {
      const field = createFieldInstanceByRaw(fieldRaw);
      const { type } = field;
      if (type === FieldType.LastModifiedTime) {
        pre[field[fieldKeyType]] = timeStr;
      }

      if (type === FieldType.LastModifiedBy) {
        pre[field[fieldKeyType]] = field.convertDBValue2CellValue({
          id: user.id,
          title: user.name,
          email: user.email,
        });
      }

      if (type === FieldType.LastModifiedByDepartment) {
        pre[field[fieldKeyType]] = deptCellValue;
      }
      return pre;
    }, {});

    return records.map((record) => {
      return {
        ...record,
        fields: {
          ...record.fields,
          ...systemRecordFields,
        },
      };
    });
  }
}
