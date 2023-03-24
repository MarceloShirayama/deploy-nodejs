import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";

const app = fastify();

const prisma = new PrismaClient();

app.get("/users", async () => {
  const users = await prisma.user.findMany();

  return { users };
});

app.post("/users", async (req, reply) => {
  const createSchema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  const { name, email } = createSchema.parse(req.body);

  await prisma.user.create({
    data: { name, email },
  });

  return reply.code(201).send();
});

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => console.info("Http server running."));
