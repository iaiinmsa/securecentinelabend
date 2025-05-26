import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8, { message: 'El password debe tener al menos 8 caracteres' })
    password: string;
    active?: boolean;
    departmentId?: number;
    useremail: string;
    lastname: string;
    photo?: string;
}
