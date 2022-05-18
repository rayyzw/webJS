import { PrismaClient } from '@prisma/client';
let prismaClient;

if (!global.prismaClient) {
  global.prismaClient = new PrismaClient();
}
prismaClient = global.prismaClient;

export default prismaClient;