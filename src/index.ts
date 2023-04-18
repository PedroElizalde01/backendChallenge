import { UserRouter } from './routes/user.routes';
import { MailRouter } from './routes/mail.routes';
import { AdminRouter } from './routes/admin.routes';
import express from 'express';

const app = express()
app.use(express.json())

app.use('/user', UserRouter)
app.use('/mail', MailRouter)
app.use('/admin', AdminRouter)
  

// const server = app.listen(3000, () =>
//   console.log(`Server ready at: http://localhost:3000`),
// )

export default app;

// export function closeServer() {
//   server.close();
// }