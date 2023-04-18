import express from 'express';
import { BadRequestError } from '../error/errors'
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../service/user.service';
import { checkEmail } from '../utils/regex';
import { authenticateToken } from '../utils/jwt';

const router = express.Router();

const userService: UserService = new UserService(new UserRepository)

router.post('/register', async(req, res) => {
    try {
        if(!req.body.email || !req.body.name || !req.body.password ) throw new BadRequestError("Missing fields")
        
        if(!checkEmail(req.body.email)) throw new BadRequestError("Invalid email")

        res.status(201).json(await userService.registerUser(req.body))
    }
    catch(e) {
        res.status(e.statusCode || 500).json({message: e.message})
    }    
});

router.post('/login', async(req, res)=> {
    try {
        if(!req.body.email || !req.body.password) throw new BadRequestError("Missing fields")
        
        res.status(200).json(await userService.loginUser({ email:req.body.email, password:req.body.password }))

    } catch(e) {
        res.status(e.statusCode || 500).json({message: e.message})
    }
})

router.get('/me', authenticateToken, async (req:any, res) => {
    try{
        res.status(200).json(await userService.getMe(req.user.id))
    }catch(e){
        res.status(e.statusCode || 500).json({message: e.message})
    }
})

router.put('/edit', authenticateToken, async (req:any, res) => {
    try{
        res.status(200).json(await userService.editMe(req.user.id, {name: req.body.name, password: req.body.password}))
    }catch(e){
        res.status(e.statusCode || 500).json({message: e.message})
    }
})

export { router as UserRouter }