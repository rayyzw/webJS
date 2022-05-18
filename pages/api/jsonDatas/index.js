import { checkPermission } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  let hasPermission = await checkPermission(req.headers.token,"JsonData",req.method);
  if(!hasPermission){
    res.status(403).send({ error: 'No permission!' });
    return;
  }

  if(req.method === 'GET'){
    let { jsonSchemaId } = req.query;
    if(jsonSchemaId){
      let jsonDatas = await prismaClient.jsonData.findMany({
        where: { jsonSchemaId: parseInt(jsonSchemaId)} 
      });
      res.status(200).send(jsonDatas);
    }
    else{
      let jsonDatas = await prismaClient.jsonData.findMany();
      res.status(200).send(jsonDatas);
    }
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    let jsonData = await prismaClient.jsonData.create({
      data: req.body
    });
    res.status(200).send(jsonData);
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
