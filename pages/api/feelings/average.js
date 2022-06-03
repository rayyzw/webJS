import { checkPermission, enableCors } from '/components/Middleware';
import prismaClient from '/components/PrismaClient';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await enableCors(req, res);

  let hasPermission = await checkPermission(req.headers.token,"Feeling",req.method);
  if(!hasPermission){
    res.status(403).send({ error: 'No permission!' });
    return;
  }
  
  if(req.method === 'GET'){
    let decoded = jwt.verify(req.headers.token,process.env.SECRET);
    const user = await prismaClient.user.findFirst({
      where: {
        id: decoded.id,
        email: decoded.email,
      }
    });
    let { startDate, endDate } = req.query;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let feelings = await prismaClient.feeling.findMany({
      where: {
        userId: parseInt(user.id),
        createdAt: {
          gte: startDate
        },
        createdAt: {
          lt: endDate
        },
      }
    });
    let feeling = {
      startDate:startDate,
      endDate:endDate,
      purpose:0,
      thinking:0,
      energy:0,
      environment:0,
      physical:0,
      moving:0
    };    
    feelings.map((f)=>{
      feeling.purpose = feeling.purpose + f.purpose;
      feeling.thinking = feeling.thinking + f.thinking;
      feeling.energy = feeling.energy + f.energy;
      feeling.environment = feeling.environment + f.environment;
      feeling.physical = feeling.physical + f.physical;
      feeling.moving = feeling.moving + f.moving;
    });
    if(feelings.length>0){
      feeling.purpose = feeling.purpose/feelings.length;
      feeling.thinking = feeling.thinking/feelings.length;
      feeling.energy = feeling.energy/feelings.length;
      feeling.environment = feeling.environment/feelings.length;
      feeling.physical = feeling.physical/feelings.length;
      feeling.moving = feeling.moving/feelings.length;
    }
    res.status(200).send(feeling);
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    res.status(400).send({ error: 'POST requests not allowed!' });
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
