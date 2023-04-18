import { BadRequestError } from "./errors";

export const prismaErrorHandler = (error: any) => {

    if (error.code === 'P2002') {
        if (error.meta.target.includes('email')) {
            throw new BadRequestError('Email already in use');
        }
    }
}