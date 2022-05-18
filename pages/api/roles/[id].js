import { checkPermission } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';

export default async function handler(req, res) {
  let hasPermission = await checkPermission(req.headers.token,"Role",req.method);
  if(!hasPermission){
    res.status(403).send({ error: 'No permission!' });
    return;
  }

  if(req.method === 'GET'){
    let { id } = req.query;
    let role = await prismaClient.role.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        permissions: true,
      },
    });
    res.status(200).send(role);
  }
  else if(req.method === 'PUT'){
    let { id } = req.query;
    let permissions = [];
    if(req.body.permissions){
      req.body.permissions.map((p)=>{
        permissions.push({id:p.id});
      });
    }
    let disconnectPermissions = [];
    req.body.disconnectPermissions.map((p)=>{
      disconnectPermissions.push({id:p.id});
    });
    req.body.permissions = {connect: permissions, disconnect: disconnectPermissions};
    req.body.id = undefined;
    req.body.disconnectPermissions = undefined;
    let role = await prismaClient.role.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.status(200).send(role);
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    res.status(400).send({ error: 'POST requests not allowed!' });
  }
  else if(req.method === 'DELETE'){
    let { id } = req.query;
    await prismaClient.role.delete({
      where: {
        id: parseInt(id),
      }
    });
    res.status(200).send({"message":"Deleted!"});
  }
}
