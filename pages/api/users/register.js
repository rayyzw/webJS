import bcrypt from 'bcryptjs';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
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
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 8);
    const allUsers = await prismaClient.user.findMany();
    const existUsers = await prismaClient.user.findMany({
      where: { email: email} 
    });
  
    if (existUsers.length === 0){
      const user = await prismaClient.user.create({
        data: {
          name: name,
          email: email,
          password: hashed,
          isAdmin: (allUsers.length===0)
        }
      });
      res.status(200).send(user);
    }
    else{
      res.status(400).send({"email":"Email exists!"});
    }
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
