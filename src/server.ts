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
  const result = z
    .object({
      name: z.string({ invalid_type_error: "Name must be a string" }),
      email: z.string().email({ message: "Invalid email" }),
    })
    .safeParse(req.body);

  if (!result.success) {
    return reply.code(400).send(result.error.message);
  }
  const { name, email } = result.data;

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
