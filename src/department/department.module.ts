/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';

@Module({
    imports: [],
    controllers: [DepartmentController ],
    providers: [DepartmentService],
})
export class DepartmentModule {}
