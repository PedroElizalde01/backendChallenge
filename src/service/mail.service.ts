import { MailRepository } from '../repositories/mail.repository'
import { UserRepository } from '../repositories/user.repository'
import { UnauthorizedError} from '../error/errors';
import { MailFormDTO, MailResponseDTO } from '../models/dto/mail.dto';
import { transporter } from '../utils/nodemailer';
import { mailgun } from '../utils/mailgun';

export class MailService{
    constructor(
        private readonly mailRepository: MailRepository,
        private readonly userRepository: UserRepository
    ) {}

    async sendMail(mailForm:MailFormDTO) : Promise<MailFormDTO>{
        const mailsSentToday = await this.mailRepository.getQuantitySentToday(mailForm.fromId)
        if(mailsSentToday >= 1000) throw new UnauthorizedError("You have reached the limit of mails sent today")
        const returnedMailForm = await this.mailRepository.sendMail(mailForm)
        try {
            await this.nodemailerSend(mailForm)
        } catch {
            await this.mailgunSend(mailForm)
        }
        return returnedMailForm
    }

    async getMailsReceived(id:string): Promise<MailResponseDTO[]>{
        const user = await this.userRepository.userById(id)
        return await this.mailRepository.getReceived(user.email)
    }

    async getMailsSent(id:string): Promise<MailResponseDTO[]>{
        return await this.mailRepository.getSent(id)
    }

    async nodemailerSend(mailForm:MailFormDTO){
        await transporter.sendMail({
            to: mailForm.to,
            subject: 'From: ' + mailForm.fromEmail + ' | Subject: ' + mailForm.subject,
            text: mailForm.body
        })
    }

    async mailgunSend(mailForm:MailFormDTO){
        await mailgun().messages()
        .send({
            from:mailForm.fromEmail,
            to:mailForm.to,
            subject:mailForm.subject,
            text:mailForm.body
        })
    }
}
