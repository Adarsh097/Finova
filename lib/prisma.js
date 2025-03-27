import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production'){
    globalThis.prisma = db;
}

//! globalThis.prisma: This is global variable, ensures that the Prisma client instance 
//! is reused across hot reloads during the development phase. Without this,
//! each time your application reloads, a new instance of Prisma client
//! would be created, potentially leading to connection issues.
