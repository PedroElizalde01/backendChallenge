import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/entities/user.entity';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { NotFoundError, UnauthorizedError } from '../error/errors';
import { LoginFormDTO, LoginResponseDto } from '../models/dto/login.dto';
import { RegisterFormDTO, RegisterResponseDTO } from '../models/dto/register.dto';
import { EditFormDTO, EditResponseDTO } from '../models/dto/edit.dto';

export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async registerUser(registerForm: RegisterFormDTO): Promise<RegisterResponseDTO> {
        registerForm.password = await hashPassword(registerForm.password)
        return await this.userRepository.registerUser(registerForm)
    }

    async loginUser(loginForm: LoginFormDTO): Promise<LoginResponseDto> {
        const userByEmail = await this.userRepository.userByEmail(loginForm.email)
        if(!userByEmail) throw new NotFoundError("User not found")
        const verifiedPassword = await comparePassword(userByEmail.password, loginForm.password)
        if(!verifiedPassword) throw new UnauthorizedError("Incorrect password")
        return await generateToken({id: userByEmail.id, role: userByEmail.role})
    }

    async getMe(id: string): Promise<User> {
        const user = await this.userRepository.userById(id)
        if(!user) throw new NotFoundError("User not found")
        return user
    }

    async editMe(id:string, editForm: EditFormDTO) : Promise<EditResponseDTO>{
        editForm.password = await hashPassword(editForm.password)
        const newUser = await this.userRepository.editUser({id: id, name: editForm.name, password: editForm.password})
        return await {id: newUser.id, name: newUser.name, password : newUser.password}
    }
}
