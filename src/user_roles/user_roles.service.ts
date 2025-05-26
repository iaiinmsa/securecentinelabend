import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRolesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { user_id: number; role_id: number }) {
    return this.prisma.user_roles.create({ data });
  }

  async findAll() {
    return this.prisma.user_roles.findMany({
      include: { user: true, role: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.user_roles.findUnique({
      where: { id },
      include: { user: true, role: true },
    });
  }

  async remove(id: number) {
    return this.prisma.user_roles.delete({ where: { id } });
  }
}