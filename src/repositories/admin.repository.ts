import { PrismaClient } from '@prisma/client'
import { UserDTO } from '../models/dto/user.dto';
import { StatsResponseDto } from '../models/dto/stats-response.dto';
import { UserRole } from '../models/entities/user.entity';
import { RegisterResponseDTO } from '../models/dto/register.dto';
import { prismaErrorHandler } from '../error/prismaErrorHandler';

const prisma = new PrismaClient();

export class AdminRepository{

    async registerAdmin (email:string): Promise<RegisterResponseDTO> {
        let user;
        try {
            user = await prisma.user.update({
                where:{
                    email,
                },
                data: {
                    role:UserRole.ADMIN,
                },
            });
        } catch (e) {
            prismaErrorHandler(e);
        }
        return user;
    }

    //stats
    async getStatsUser(): Promise<StatsResponseDto[]> {
        const today = new Date();
        today.setHours(0,0,0,0);

        const users = await prisma.user.findMany({
            where: {
                mails: {
                    some: {
                        createdAt: {
                            gte: today
                        }
                    }
                }
            },
            select: {
                name: true,
                email:true,
                mails: {
                    where: {
                        createdAt: {
                            gte: today
                        },
                    },
                    select: {
                        id: true,
                    },
                },
            },
        })
        return users.map(user => {
            return {
                name: user.name,
                email: user.email,
                mailsSentToday: user.mails.length,
            }
        })        
    }

    //get all users
    async getAllUsers(): Promise<UserDTO[]>{
        return await prisma.user.findMany({
            where: {
                deleteAt: null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
    }   
    

    //logic delete user
    async deleteUser(email:string): Promise<UserDTO>{
        let user;
        try {
            user = await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    deleteAt: new Date(),
                },
            });
        } catch (e) {
            console.log(e);
        }
        return user;
    }
}
