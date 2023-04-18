import { BaseEntity } from "./base.entity";

export class Mail extends BaseEntity{
    id!: string;
    from!: string;
    to!: string;
    subject!: string;
    body!: string;
    date!: Date;
}


// model Mail {
//     id        String    @id @default(uuid())
//     fromId    String
//     from      User      @relation("fromMails", fields: [fromId], references: [id])
//     to        String
//     subject   String
//     body      String
//     createdAt DateTime  @default(now())
//     updatedAt DateTime  @default(now()) @updatedAt
//     deleteAt  DateTime?
//   }
  