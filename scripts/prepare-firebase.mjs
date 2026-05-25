import { copyFileSync } from "node:fs";

copyFileSync("prisma/schema.postgresql.prisma", "prisma/schema.prisma");
console.log("Using PostgreSQL schema for Firebase build.");
