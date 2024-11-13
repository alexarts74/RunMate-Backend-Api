import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const {
      email,
      password: rawPassword,
      name,
      lastName,
      age,
      gender,
      location,
    } = req.body;

    // Validation des données
    if (!email || !rawPassword || !name || !lastName || !age || !gender || !location) {
      return res.status(400).json({
        error: "Tous les champs sont requis"
      });
    }

    // Vérification si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Cet email est déjà utilisé"
      });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        lastName,
        age: typeof age === 'string' ? parseInt(age) : age,
        gender,
        location,
      }
    });

    // Retourne l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return res.status(500).json({
      error: "Erreur lors de la création du compte"
    });
  }
}
