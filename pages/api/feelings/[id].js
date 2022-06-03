import { checkPermission, enableCors } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  await enableCors(req, res);
  
  let hasPermission = await checkPermission(req.headers.token,"Feeling",req.method);
  if(!hasPermission){
    res.status(403).send({ error: 'No permission!' });
    return;
  }
  
  if(req.method === 'GET'){
    let { id } = req.query;
    let feeling = await prismaClient.feeling.findFirst({
      where: {
        id: parseInt(id),
      }
    });
    res.status(200).send(feeling);
  }
  else if(req.method === 'PUT'){
    let { id } = req.query;
    let feeling = await prismaClient.feeling.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.status(200).send(feeling);
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    res.status(400).send({ error: 'POST requests not allowed!' });
  }
  else if(req.method === 'DELETE'){
    let { id } = req.query;
    await prismaClient.feeling.delete({
      where: {
        id: parseInt(id),
      }
    });
    res.status(200).send({"message":"Deleted!"});
  }
}
