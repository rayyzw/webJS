import jwt from 'jsonwebtoken';
import prismaClient from '/components/PrismaClient';
import { enableCors } from '/components/Middleware';

export default async function handler(req, res) {
  await enableCors(req, res);
  
  if(req.method === 'GET'){
    try{
      let decoded = jwt.verify(req.headers.token,process.env.SECRET);
      const user = await prismaClient.user.findFirst({
        where: {
          id: decoded.id,
          email: decoded.email,
        },
        include: {
          roles: true,
        },
      });
      user.password = undefined;
      user.token = req.headers.token;
      let roles = await Promise.all(user.roles.map(async (r)=>{
        let role = await prismaClient.role.findFirst({
          where: {
            id: parseInt(r.id),
          },
          include: {
            permissions: true,
          },
        });
        return role;
      }));
      user.roles = roles;
      res.status(200).send(user);
    }
    catch{
      res.status(400).send({"user":"User not Found!"});
    }
  }
  else if(req.method === 'PUT'){
    try{
      let decoded = jwt.verify(req.headers.token,process.env.SECRET);
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
      req.body.token = undefined;
      const user = await prismaClient.user.update({
        where: { id: decoded.id },
        data: req.body
      });
      res.status(200).send(user);
    }
    catch{
      res.status(400).send({"user":"User not Found!"});
    }
  }
  else if(req.method === 'PATCH'){
    try{
      let decoded = jwt.verify(req.headers.token,process.env.SECRET);
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
      req.body.token = undefined;
      const user = await prismaClient.user.update({
        where: { id: decoded.id },
        data: req.body
      });
      res.status(200).send(user);
    }
    catch{
      res.status(400).send({"user":"User not Found!"});
    }
  }
  else if(req.method === 'POST'){
    res.status(400).send({ error: 'POST requests not allowed!' });
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
