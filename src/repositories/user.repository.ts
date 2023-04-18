import { User, UserRole } from '../models/entities/user.entity';
import { prismaErrorHandler } from '../error/prismaErrorHandler';
import { PrismaClient } from '@prisma/client'
import { RegisterFormDTO, RegisterResponseDTO } from '../models/dto/register.dto';

const prisma = new PrismaClient()

export class UserRepository {
    
    async registerUser (registerForm:RegisterFormDTO): Promise<RegisterResponseDTO> {
        let user;
        try {
            user = await prisma.user.create({
                data: {
                    email:registerForm.email,
                    name:registerForm.name,
                    password:registerForm.password,
                    role:UserRole.USER,
                },
            });
        } catch (e) {
            prismaErrorHandler(e);
        }
        return user;
    }

    //get user by email
    async userByEmail (email: string): Promise<User> {
        let user;
        try {
            user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });
        } catch (e) {
            console.log(e);
        }
        return user;
    }

    //get user by id
    async userById (fromId: string): Promise<User> {
        let user;
        try {
            user = await prisma.user.findUnique({
                where: {
                    id:fromId,
                }
            });
        } catch (e) {
            console.log(e);
        }
        return user;
    }

    //edit user
    async editUser({id, name, password}: {id: string, name: string, password: string}): Promise<User> {
        let user;
        try {
            user = await prisma.user.update({
                where: {
                    id,
                },
                data: {
                    name,
                    password,
                },
            });
        } catch (e) {
            console.log(e);
        }
        return user;
    }
}