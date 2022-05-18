import { checkPermission } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  let hasPermission = await checkPermission(req.headers.token,"Permission",req.method);
  if(!hasPermission){
    res.status(403).send({ error: 'No permission!' });
    return;
  }
  
  if(req.method === 'GET'){
    let { id } = req.query;
    let permission = await prismaClient.permission.findFirst({
      where: {
        id: parseInt(id),
      }
    });
    res.status(200).send(permission);
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    res.status(400).send({ error: 'POST requests not allowed!' });
  }
  else if(req.method === 'DELETE'){
    let { id } = req.query;
    await prismaClient.permission.delete({
      where: {
        id: parseInt(id),
      }
    });
    res.status(200).send({"message":"Deleted!"});
  }
}
