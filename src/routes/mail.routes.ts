import express from 'express';
import { BadRequestError } from '../error/errors'
import { MailRepository } from '../repositories/mail.repository';
import { UserRepository } from '../repositories/user.repository';
import { MailService } from '../service/mail.service';
import { UserService } from '../service/user.service';
import { authenticateToken } from '../utils/jwt';

const router = express.Router();

const mailService: MailService = new MailService(new MailRepository, new UserRepository)
const userService: UserService = new UserService(new UserRepository)

//sendMail
router.post('/send',authenticateToken, async(req:any, res) => {
    try {
        if(!req.body.to || !req.body.subject || !req.body.body)
            throw new BadRequestError('Missing parameters')
        const user =  await userService.getMe(req.user.id)
        console.log(user.email)
        res.status(201).json(await mailService.sendMail({fromId: req.user.id,fromEmail:user.email, to: req.body.to, subject: req.body.subject, body: req.body.body}))
    }
    catch(e) {
        res.status(e.statusCode || 500).json({message: e.message})
    }
});

//getMailsReceived
router.get('/received',authenticateToken, async(req:any, res) => {
    try {
        res.status(200).json(await mailService.getMailsReceived(req.user.id))
    }
    catch(e) {
        res.status(e.statusCode || 500).json({message: e.message})
    }
});

//getMailsSent
router.get('/sent',authenticateToken, async(req:any, res) => {
    try {
        res.status(200).json(await mailService.getMailsSent(req.user.id))
    }
    catch(e) {
        res.status(e.statusCode || 500).json({message: e.message})
    }
});

export { router as MailRouter }