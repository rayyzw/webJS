import { checkPermission } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  let hasPermission = await checkPermission(req.headers.token,"Role",req.method);
  if(!hasPermission){
    res.status(403).send({ error: 'No permission!' });
    return;
  }

  if(req.method === 'GET'){
    let roles = await prismaClient.role.findMany({
      include: {
        permissions: true,
      },
    });
    res.status(200).send(roles);
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    let permissions = [];
    if(req.body.permissions){
      req.body.permissions.map((p)=>{
        permissions.push({id:p.id});
      });
    }
    req.body.permissions = {connect: permissions};
    req.body.disconnectPermissions = undefined;
    let role = await prismaClient.role.create({
      data: req.body
    });
    res.status(200).send(role);
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
