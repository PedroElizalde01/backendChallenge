export interface MailFormDTO{
    fromId:string,
    fromEmail:string,
    to:string,
    subject:string,
    body:string,
}

export interface MailResponseDTO{
    id:string,
    from:{
        id:string,
        email:string,
        name:string,
    },
    to: string,
    subject: string,
    body: string,
}