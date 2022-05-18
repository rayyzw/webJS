import { checkPermission, enableCors } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  await enableCors(req, res);

  if(req.method!=="GET"){
    let hasPermission = await checkPermission(req.headers.token,"Category",req.method);
    if(!hasPermission){
      res.status(403).send({ error: 'No permission!' });
      return;
    }
  }

  if(req.method === 'GET'){
    let { type } = req.query;
    if(type){
      let categories = await prismaClient.category.findMany({
        where: { 
          type: type
        }
      });
      res.status(200).send(categories);
    }
    else{
      let categories = await prismaClient.category.findMany();
      res.status(200).send(categories);
    }
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    let category = await prismaClient.category.create({
      data: req.body
    });
    res.status(200).send(category);
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
