/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    async getAllUsers() {
      return this.prisma.user.findMany(
        {
            include: {
              department: true, // Incluye el departamento relacionado
            },
          }
      );
    }

    async createUser(data: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        try {
            return await this.prisma.user.create({
              data: {
                ...data,
                password: hashedPassword,
              },
            });
          } catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
              throw new ConflictException('El email ya está registrado');
            }
            throw error;
          }
      }



      async changePassword(email: string, newPassword: string) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.prisma.user.update({
          where: { email },
          data: { password: hashedPassword },
        });
      }


      async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
          where: { email },
          include: {
            user_roles: { // Incluye la tabla intermedia user_roles
              include: {
                role: true, // Dentro de user_roles, incluye la información del rol
              },
            },
            department: true, // Mantén esto si también quieres el departamento
          },
        });
        if (!user) return { success: false, message: 'Usuario no encontrado' };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { success: false, message: 'Contraseña incorrecta' };

        // Aquí puedes generar y retornar un JWT si lo deseas
        return { success: true, user };
      }

 }
