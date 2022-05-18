import { checkPermission } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  let hasPermission = await checkPermission(req.headers.token,"JsonData",req.method);
  if(!hasPermission){
    res.status(403).send({ error: 'No permission!' });
    return;
  }
  
  if(req.method === 'GET'){
    let { id } = req.query;
    let jsonData = await prismaClient.jsonData.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        jsonSchema: true,
      },
    });
    res.status(200).send(jsonData);
  }
  else if(req.method === 'PUT'){
    let { id } = req.query;
    req.body.jsonSchema = undefined;
    let jsonData = await prismaClient.jsonData.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.status(200).send(jsonData);
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    res.status(400).send({ error: 'POST requests not allowed!' });
  }
  else if(req.method === 'DELETE'){
    let { id } = req.query;
    await prismaClient.jsonData.delete({
      where: {
        id: parseInt(id),
      }
    });
    res.status(200).send({"message":"Deleted!"});
  }
}
