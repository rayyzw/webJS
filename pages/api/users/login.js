import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prismaClient from '/components/PrismaClient';
import { enableCors } from '/components/Middleware';


export default async function handler(req, res) {
  await enableCors(req, res);

  if(req.method === 'GET'){
    res.status(400).send({ error: 'GET requests not allowed!' });
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    const { email, password } = req.body;
    const user = await prismaClient.user.findFirst({
      where: {
        email: email
      }
    });
    if(user){
      if(bcrypt.compareSync(password, user.password)){
        user.password = undefined;
        let token = jwt.sign({id:user.id,email:user.email}, process.env.SECRET, { expiresIn: '7d' });
        res.status(200).send({...user,token:token});
      }
      else{
        res.status(400).send({"password":"Incorrect Password!"});
      }
    }
    else{
      res.status(400).send({"email":"Incorrect Email!"});
    }
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
