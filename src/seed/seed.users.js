import "dotenv/config";
import mongoose from "mongoose";

import userDAO from "../dao/users.dao.js";
import { createHash } from "../utils/hash.js";

const USERS = [
  {
    first_name: "Ana",
    last_name: "Gomez",
    email: "user@example.com",
    password: "123456",
    role: "user",
  },
  {
    first_name: "Carlos",
    last_name: "Lopez",
    email: "organizer@example.com",
    password: "123456",
    role: "organizer",
  },
  {
    first_name: "Diego",
    last_name: "Perez",
    email: "organizer2@example.com",
    password: "123456",
    role: "organizer",
  },
  {
    first_name: "Elena",
    last_name: "Diaz",
    email: "admin@example.com",
    password: "123456",
    role: "admin",
  },
];

async function seedUsers() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB conectado");

  for (const user of USERS) {
    const existing = await userDAO.getByEmail(user.email);

    if (existing) {
      console.log(`SKIP — ${user.email} (ya existe, role=${existing.role})`);
      continue;
    }

    const hashedPassword = await createHash(user.password);

    await userDAO.create({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      provider: "local",
      providerId: null,
    });

    console.log(`OK — ${user.email} creado con role=${user.role}`);
  }

  console.log("\nCredenciales de login:");
  console.log("user        -> user@example.com / 123456");
  console.log("organizer   -> organizer@example.com / 123456");
  console.log("organizer2  -> organizer2@example.com / 123456");
  console.log("admin       -> admin@example.com / 123456");

  await mongoose.disconnect();
}

seedUsers().catch((error) => {
  console.error("Error en seed:", error);
  process.exit(1);
});
