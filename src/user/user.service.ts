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


      async findGerentesByDepartmentId(departmentIdParam: number) { // Cambiado el nombre del parámetro
        return this.prisma.user.findMany({ // Cambiado a findMany por si hay varios gerentes
          where: {
            departmentId: departmentIdParam, // Usar el departmentId numérico
            gerenteTitular: true,
          },
          select: {
            // Incluye aquí todos los campos del modelo 'user' que SÍ quieres devolver
            id: true,
            name: true,
            useremail: true,
            lastname: true,
            active: true,
            departmentId: true, // Puedes mantener el ID del departamento si lo necesitas
            photo: true,
            gerenteTitular: true,
            // Para incluir la relación 'department' completa, también la especificas aquí
            department: true,
            // Si también quisieras los roles (como en el login), los añadirías aquí:
            // user_roles: {
            //   select: {
            //     role: true, // O selecciona campos específicos del rol
            //   }
            // }
          },
        });
      }
    
    

 }
