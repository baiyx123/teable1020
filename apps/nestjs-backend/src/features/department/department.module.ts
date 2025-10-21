import { Module } from '@nestjs/common';
import { DbProvider } from '../../db-provider/db.provider';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [],
  controllers: [DepartmentController],
  providers: [DepartmentService, DbProvider],
  exports: [DepartmentService],
})
export class DepartmentModule {}

