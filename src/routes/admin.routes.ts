import express from "express";
import { AdminRepository } from "../repositories/admin.repository";
import { AdminService } from "../service/admin.service";
import { authenticateAdmin } from "../utils/jwt";

const router = express.Router();

const adminService: AdminService = new AdminService(new AdminRepository)

router.put('/register', authenticateAdmin, async(req, res) => {
    try{
        res.status(200).json(await adminService.registerAdminService(req.body.email))
    } catch(e){ 
        res.status(e.statusCode || 500).json({message: e.message})
    }
})

//stats
router.get('/stats', authenticateAdmin, async (req, res) => {
    try{
        res.status(200).json(await adminService.getStats())
    }catch(e){
        res.status(e.statusCode || 500).json({message: e.message})
    }
})

//get all users
router.get('/all', authenticateAdmin, async (req, res) =>{//add parameters
    res.status(200).json(await adminService.getAllUsers())
});

//logical delete user
router.put('/delete', authenticateAdmin, async (req, res) => {
    try{
        res.status(200).json(await adminService.deleteUserService(req.body.email))
    }catch(e){
        res.status(e.statusCode || 500).json({message: e.message})
    }
})

export {router as AdminRouter}