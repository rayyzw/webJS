import { checkPermission, enableCors } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {  
  await enableCors(req, res);
  let hasPermission = await checkPermission(req.headers.token,"User",req.method);
  if(!hasPermission){
    res.status(403).send({ error: 'No permission!' });
    return;
  }

  if(req.method === 'GET'){
    let { id } = req.query;
    let user = await prismaClient.user.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        roles: true,
      },
    });
    res.status(200).send(user);
  }
  else if(req.method === 'PUT'){
    let { id } = req.query;
    let roles = [];
    if(req.body.roles){
      req.body.roles.map((r)=>{
        roles.push({id:r.id});
      });
    }

    let disconnectRoles = [];
    if(req.body.disconnectRoles){
      req.body.disconnectRoles.map((r)=>{
        disconnectRoles.push({id:r.id});
      });
    }

    if(req.body.roles || req.body.disconnectRoles){
      req.body.roles = {connect: roles, disconnect: disconnectRoles};
    }
    else{
      req.body.roles = undefined;
    }      
    req.body.disconnectRoles = undefined;

    req.body.id = undefined;
    let user = await prismaClient.user.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.status(200).send(user);
  }
  else if(req.method === 'PATCH'){
    let { id } = req.query;
    if(req.body.ssoId){
      let user = await prismaClient.user.update({
        where: { id: parseInt(id) },
        data: {"ssoId":req.body.ssoId}
      });
      res.status(200).send(user);
      return;
    }
    if(req.body.pushToken){
      let user = await prismaClient.user.update({
        where: { id: parseInt(id) },
        data: {"pushToken":req.body.pushToken}
      });
      res.status(200).send(user);
      return;
    }
    res.status(400).send({ error: 'Nothing changed!' });
  }
  else if(req.method === 'POST'){
    res.status(400).send({ error: 'POST requests not allowed!' });
  }
  else if(req.method === 'DELETE'){
    let { id } = req.query;
    await prismaClient.user.delete({
      where: {
        id: parseInt(id),
      }
    });
    res.status(200).send({"message":"Deleted!"});
  }
}
