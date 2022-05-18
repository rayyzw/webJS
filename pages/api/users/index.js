import { checkPermission } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  let hasPermission = await checkPermission(req.headers.token,"User",req.method);
  if(!hasPermission){
    res.status(403).send({ error: 'No permission!' });
    return;
  }

  if(req.method === 'GET'){
    let users = await prismaClient.user.findMany();
    res.status(200).send(users);
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    let roles = [];
    if(req.body.roles){
      req.body.roles.map((r)=>{
        roles.push({id:r.id});
      });
      req.body.roles = {connect: roles};
    }
    else{
      req.body.roles = undefined;
    }    
    req.body.disconnectRoles = undefined;
    let user = await prismaClient.user.create({
      data: req.body
    });
    res.status(200).send(user);
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
