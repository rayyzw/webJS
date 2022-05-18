import bcrypt from 'bcryptjs';
import prismaClient from '/components/PrismaClient';
import { SMTPClient } from 'emailjs';

export default async function handler(req, res) {
  if(req.method === 'GET'){
    const { email } = req.query;
    if(email){
      const user = await prismaClient.user.findFirst({
        where: { email: email} 
      });

      if (user){  
        await prismaClient.userToken.deleteMany({
          where: { userId: user.id} 
        });

        await prismaClient.userToken.deleteMany({
          where: { 
            createdAt: {
              lt: new Date(new Date().getTime() - (60 * 60 * 1000))
            },
          } 
        });
    
        const userToken = await prismaClient.userToken.create({
          data: {"token":Math.random().toString(36).slice(2),"userId":user.id,}
        });
  
        const client = new SMTPClient({
          user: "mailer@linkpoint.ca",
          password: "LPT17@bo#ru%",
          host: "webmail.linkpoint.ca",
          port: 587,
          tls: true,
        });
  
        await client.sendAsync(
          {
            text: req.headers.referer + "?token=" + userToken.token,
            from: "mailer@linkpoint.ca",
            to: email,
            subject: "Reset Password",
          }
        )
        res.status(200).send(userToken);
        return;
      }
      else{
        res.status(404).send({"email":"User not found!"});
        return;
      }
    }
    res.status(400).send({"email":"Email is required!"});
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    const { userToken, password } = req.body;

    const emailToken = await prismaClient.userToken.findFirst({
      where: { 
        token: userToken,
        createdAt: {
          gte: new Date(new Date().getTime() - (60 * 60 * 1000))
        },
      } 
    });
  
    if (emailToken){
      const user = await prismaClient.user.findFirst({
        where: { id: emailToken.userId} 
      });
      if(user){
        const hashed = await bcrypt.hash(password, 8);
        await prismaClient.user.update({
          where: { id: user.id },
          data: {"password":hashed}
        });
        await prismaClient.userToken.deleteMany({
          where: { 
            id: emailToken.id,
          } 
        });
        res.status(200).send({"password":"Password changed!"});
      }
      else{
        res.status(400).send({"token":"Token expired!"});
      }
    }
    else{
      res.status(400).send({"token":"Token expired!"});
    }
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
