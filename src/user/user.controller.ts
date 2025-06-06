/*
https://docs.nestjs.com/controllers#controllers
*/

import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes , ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Patch, Query } from '@nestjs/common';




@Controller('users')
export class UserController {

    constructor( private readonly  usersService: UserService) { } // Constructor for UserController

    @Get()
    async findAll() {
      return this.usersService.getAllUsers();
    }


    @Post()
    @UseInterceptors(FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          active: { type: 'boolean' },
          departmentId: { type: 'number' },
          useremail: { type: 'string' },
          lastname: { type: 'string' },
          photo: { type: 'string', format: 'binary' },
        },
      },
    })
    async create(
      @Body() createUserDto: CreateUserDto,
      @UploadedFile() file: Express.Multer.File,
    ) {
      const photoPath = file ? `/uploads/${file.filename}` : undefined;

      let activeValue: boolean | undefined = createUserDto.active;
      if (typeof createUserDto.active === 'string') {
        activeValue = createUserDto.active === 'true';
      }

      let departmentIdValue: number | undefined = createUserDto.departmentId as any;
      if (typeof createUserDto.departmentId === 'string') {
        departmentIdValue = parseInt(createUserDto.departmentId, 10);
      }

      // Prepara el objeto para Prisma
      const userData: any = {
        ...createUserDto,
        photo: photoPath,
        active: activeValue,
      };
      // Si hay departmentId, agrega la relación
      if (departmentIdValue) {
        userData.department = { connect: { id: departmentIdValue } };
        delete userData.departmentId;
      }

      return this.usersService.createUser(userData);
 
    }


    // ...resto del código...
    
    @Patch('change-password')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          newPassword: { type: 'string' },
        },
        required: ['newPassword'],
      },
      description: 'Cambia la contraseña del usuario',
    })
    async changePassword(
      @Query('email') email: string,
      @Body('newPassword') newPassword: string,
    ) {
      return this.usersService.changePassword(email, newPassword);
    }


// ...resto del código...
@Post('login')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
    required: ['email', 'password'],
  },
  description: 'Login de usuario',
})
async login(
  @Body('email') email: string,
  @Body('password') password: string,
) {
  return this.usersService.login(email, password);
}




@Get('gerente/departamento/:departmentId') // Cambiado :departmend a :departmentId
@ApiOperation({ summary: 'Buscar un usuario gerente por su ID de departamento' }) // Descripción actualizada
@ApiParam({
    name: 'departmentId', // Nombre del parámetro actualizado
    type: Number,
    description: 'El ID del departamento del gerente a buscar', // Descripción actualizada
    example: 1,
})
@ApiResponse({ status: 200, description: 'Usuario(s) gerente(s) encontrado(s).' })
@ApiResponse({ status: 404, description: 'No se encontraron gerentes para el departamento especificado.' })
async findGerentesByDepartmentId(@Param('departmentId') departmentId: string) { // Cambiado departmend a departmentId y tipo a string para parsear
    const id = parseInt(departmentId, 10);
    if (isNaN(id)) {
        throw new BadRequestException('El ID del departamento debe ser un número.'); // Importa BadRequestException
    }
    const gerentes = await this.usersService.findGerentesByDepartmentId(id); // Método del servicio actualizado
    if (!gerentes || gerentes.length === 0) {
      throw new NotFoundException(
        `No se encontraron gerentes para el departamento con ID '${id}' y gerenteTitular activo.`,
      );
    }
    return gerentes;
}

}




