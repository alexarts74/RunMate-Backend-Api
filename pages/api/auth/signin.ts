import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { encode } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Créer le token de session
    const token = await encode({
      token: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        age: user.age,
        gender: user.gender,
        location: user.location,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    });

    // Définir le cookie de session
    res.setHeader(
      "Set-Cookie",
      `next-auth.session-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
        30 * 24 * 60 * 60
      }`
    );

    // Retourner les informations de l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Connexion réussie",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return res.status(500).json({ error: "Erreur lors de la connexion" });
  }
}
