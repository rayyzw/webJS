import { checkPermission } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  if(req.method!=="GET"){
    let hasPermission = await checkPermission(req.headers.token,"HtmlPage",req.method);
    if(!hasPermission){
      res.status(403).send({ error: 'No permission!' });
      return;
    }
  }
  
  if(req.method === 'GET'){
    let { id } = req.query;
    let htmlPage = await prismaClient.htmlPage.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        category: true,
      },
    });
    res.status(200).send(htmlPage);
  }
  else if(req.method === 'PUT'){
    let { id } = req.query;
    req.body.category = undefined;
    let htmlPage = await prismaClient.htmlPage.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.status(200).send(htmlPage);
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    res.status(400).send({ error: 'POST requests not allowed!' });
  }
  else if(req.method === 'DELETE'){
    let { id } = req.query;
    await prismaClient.htmlPage.delete({
      where: {
        id: parseInt(id),
      }
    });
    res.status(200).send({"message":"Deleted!"});
  }
}
