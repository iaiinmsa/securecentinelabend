/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('departments')
export class DepartmentController {
    constructor(private departmentService: DepartmentService) {}

    @Get()
    async findAll() {
      return this.departmentService.getAllDepartments();
    }

    @Post()
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
          required: ['name'],
        },
        description: 'Crea un nuevo departamento',
      })
    async create(@Body() data: { name: string }) {
      return this.departmentService.createDepartment(data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un departamento por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del departamento' })
    async delete(@Param('id') id: string) {
      return this.departmentService.deleteDepartment(Number(id));
    }


}
