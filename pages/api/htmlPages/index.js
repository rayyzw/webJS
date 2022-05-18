import { checkPermission, enableCors } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  await enableCors(req, res);

  if(req.method!=="GET"){
    let hasPermission = await checkPermission(req.headers.token,"HtmlPage",req.method);
    if(!hasPermission){
      res.status(403).send({ error: 'No permission!' });
      return;
    }
  }

  if(req.method === 'GET'){
    let { categoryId } = req.query;
    if(categoryId){
      let htmlPages = await prismaClient.htmlPage.findMany({
        where: { 
          categoryId: parseInt(categoryId)
        }
      });
      res.status(200).send(htmlPages);
    }
    else{
      let htmlPages = await prismaClient.htmlPage.findMany();
      res.status(200).send(htmlPages);
    }
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    let htmlPage = await prismaClient.htmlPage.create({
      data: req.body
    });
    res.status(200).send(htmlPage);
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
