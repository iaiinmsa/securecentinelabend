/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UserRolesController } from './user_roles.controller';
import { UserRolesService } from './user_roles.service';

@Module({
    imports: [],
    controllers: [ UserRolesController],
    providers: [ UserRolesService],
})
export class User_rolesModule { }
