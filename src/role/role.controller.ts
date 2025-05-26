import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags, ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['name'],
    },
    description: 'Crear un nuevo rol',
  })
  async create(@Body() data: { name: string; description?: string }) {
    return this.roleService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los roles' })
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  async findOne(@Param('id') id: string) {
    return this.roleService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
    description: 'Actualizar un rol',
  })
  async update(@Param('id') id: string, @Body() data: { name?: string; description?: string }) {
    return this.roleService.update(Number(id), data);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Eliminar un rol' })
  async remove(@Param('id') id: string) {
    return this.roleService.remove(Number(id));
  }
}