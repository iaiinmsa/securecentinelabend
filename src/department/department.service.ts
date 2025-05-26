/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartmentService { 

    constructor(private prisma: PrismaService) {}

    async getAllDepartments() {
      return this.prisma.department.findMany();
    }


    async createDepartment(data: { name: string }) {
        return this.prisma.department.create({ data });
      }
      
      async deleteDepartment(id: number) {
        return this.prisma.department.delete({ where: { id } });
      }
      
}
