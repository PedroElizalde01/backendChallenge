import { BaseEntity } from "./base.entity";

export class User extends BaseEntity{
    id!: string 
    email!: string; 
    name!: string; 
    password!: string; 
    role?: UserRole | null; 
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}    