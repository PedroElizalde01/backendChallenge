import { prismaErrorHandler } from '../error/prismaErrorHandler';
import { PrismaClient } from '@prisma/client'
import { MailFormDTO, MailResponseDTO } from 'models/dto/mail.dto';

const prisma = new PrismaClient()

export class MailRepository{

    async sendMail (mailForm:MailFormDTO): Promise<MailFormDTO> {
        let mail;
        try {
            mail = await prisma.mail.create({
                data: {
                    fromId: mailForm.fromId,
                    to: mailForm.to,
                    subject: mailForm.subject,
                    body: mailForm.body,
                },
            });
        } catch (e) {
            prismaErrorHandler(e);
        }
        return mail;
    }

    async getReceived (email: string): Promise<MailResponseDTO[]>{
        return await prisma.mail.findMany({
            where: {
                deleteAt: null,
                to: email,
            },
            select: {
                id: true,
                from: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    }
                },
                to: true,
                subject: true,
                body: true,
            },
        });
    }

    async getSent (userId: string): Promise<MailResponseDTO[]>{
        return await prisma.mail.findMany({
            where: {
                deleteAt: null,
                fromId: userId,
            },
            select: {
                id: true,
                from: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    }   
                },
                to: true,
                subject: true,
                body: true,
            },
        });
    }


    async getQuantitySentToday( id: string ): Promise<number>{
        const today = new Date()
        today.setHours(0,0,0,0);
        const mailsSentToday = await prisma.mail.count({
            where: {
                fromId: id,
                createdAt: {
                    gte: today
                }
            }
        })
        return mailsSentToday;
    }
}   