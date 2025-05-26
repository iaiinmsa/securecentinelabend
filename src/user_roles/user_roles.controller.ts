import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserRolesService } from './user_roles.service';
import { ApiTags, ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';

@ApiTags('user_roles')
@Controller('user_roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'number' },
        role_id: { type: 'number' },
      },
      required: ['user_id', 'role_id'],
    },
    description: 'Asignar un rol a un usuario',
  })
  async create(@Body() data: { user_id: number; role_id: number }) {
    return this.userRolesService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las asignaciones de roles a usuarios' })
  async findAll() {
    return this.userRolesService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Obtener una asignación por ID' })
  async findOne(@Param('id') id: string) {
    return this.userRolesService.findOne(Number(id));
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Eliminar una asignación de rol a usuario' })
  async remove(@Param('id') id: string) {
    return this.userRolesService.remove(Number(id));
  }
}