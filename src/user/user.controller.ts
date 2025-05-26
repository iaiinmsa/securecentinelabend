/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
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


}




