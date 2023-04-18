import { LoginResponseDto } from "../models/dto/login.dto";
import { UserRole } from "../models/entities/user.entity";
import { UnauthenticatedError, UnauthorizedError } from "../error/errors";

const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET

export const generateToken = async ({id,role}:{id:string, role:UserRole}) : Promise<LoginResponseDto> => {
    return jwt.sign({id,role}, process.env.JWT_SECRET , {expiresIn:"1h"} )
}

export const decodeToken = async (token:string)=>{
    return jwt.decode(token)
}

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthenticatedError("No authorization header provided");

    const token = authHeader.split(" ")[1];
    if (!token) throw new UnauthenticatedError("No token provided");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        throw new UnauthenticatedError("Invalid token");
    }
}

export const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthenticatedError("No authorization header provided");

    const token = authHeader.split(" ")[1];
    if (!token) throw new UnauthenticatedError("No token provided");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        if (decoded.role !== UserRole.ADMIN) throw new UnauthorizedError("You are not an admin");
        next();
    } catch (err) {
        throw new UnauthenticatedError("Invalid token");
    }
}