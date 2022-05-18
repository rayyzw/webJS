
import Cors from 'cors';
import jwt from 'jsonwebtoken';
import prismaClient from '/components/PrismaClient';

export function enableCors(req, res) {
    const cors = Cors({
      methods: ['HEAD', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    });
    return new Promise((resolve, reject) => {
        cors(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }    
            return resolve(result);
        });
    });
};

export async function checkPermission(token, model, method) {
    let hasPermission = false;
      try{
        let decoded = jwt.verify(token,process.env.SECRET);
        const user = await prismaClient.user.findFirst({
          where: {
            id: decoded.id,
            email: decoded.email,
          },
          include: {
            roles: true,
          },
        });
        if(user){
          if(user.isAdmin){
            hasPermission = true;
          }
          else{
            await Promise.all(
              user.roles.map(async (r)=>{
                let role = await prismaClient.role.findFirst({
                  where: {
                    id: parseInt(r.id),
                  },
                  include: {
                    permissions: true,
                  },
                });
                if(role.permissions.some((p)=>(p.model===model && p.method===method))){
                  hasPermission = true;
                }
              })
            );          
          }
        }
      }
      catch{
      }
      return hasPermission;
  };
