import { checkPermission } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  let hasPermission = await checkPermission(req.headers.token,"Permission",req.method);
  if(!hasPermission){
    res.status(403).send({ error: 'No permission!' });
    return;
  }

  if(req.method === 'GET'){
    let permissions = await prismaClient.permission.findMany();
    res.status(200).send(permissions);
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    try{
      let permission = await prismaClient.permission.create({
        data: req.body
      });
      res.status(200).send(permission);
    }
    catch{
      res.status(400).send({ error: 'Permission exists!' });
    }
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
