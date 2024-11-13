import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base de données
  await prisma.runningPreferences.deleteMany();
  await prisma.user.deleteMany();

  // Créer des utilisateurs avec leurs préférences
  const users = [
    {
      email: "alice@example.com",
      password: await bcrypt.hash("password123", 10),
      name: "Alice",
      lastName: "Martin",
      age: 28,
      gender: "female",
      location: "Paris",
      runningPreferences: {
        create: {
          pace: "5:30",
          distance: 10,
          availability: ["MONDAY", "WEDNESDAY", "FRIDAY"],
          level: "INTERMEDIATE",
          preferredGender: "ANY",
          ageRange: { min: 25, max: 35 },
        },
      },
    },
    {
      email: "bob@example.com",
      password: await bcrypt.hash("password123", 10),
      name: "Bob",
      lastName: "Dupont",
      age: 32,
      gender: "male",
      location: "Paris",
      runningPreferences: {
        create: {
          pace: "5:00",
          distance: 15,
          availability: ["TUESDAY", "THURSDAY", "SATURDAY"],
          level: "ADVANCED",
          preferredGender: "ANY",
          ageRange: { min: 25, max: 40 },
        },
      },
    },
    {
      email: "claire@example.com",
      password: await bcrypt.hash("password123", 10),
      name: "Claire",
      lastName: "Dubois",
      age: 25,
      gender: "female",
      location: "Lyon",
      runningPreferences: {
        create: {
          pace: "6:00",
          distance: 5,
          availability: ["MONDAY", "WEDNESDAY", "FRIDAY"],
          level: "BEGINNER",
          preferredGender: "FEMALE",
          ageRange: { min: 20, max: 30 },
        },
      },
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
      include: {
        runningPreferences: true,
      },
    });
  }

  console.log("Base de données initialisée avec les données de test !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
