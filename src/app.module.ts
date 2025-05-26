import { User_rolesModule } from './user_roles/user_roles.module';
import { RoleModule } from './role/role.module';

import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { DepartmentModule } from './department/department.module';
import { DepartmentController } from './department/department.controller';
import { DepartmentService } from './department/department.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    User_rolesModule,
    RoleModule,
    DepartmentModule,
    UserModule,
    User_rolesModule,
    RoleModule,
    PrismaModule,


  ],
  // controllers: [



  //     UserService, AppService],
})
export class AppModule { }


// filepath: src/app.module.ts
// ...existing code...



