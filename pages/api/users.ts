import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  switch (req.method) {
    case "GET":
      return getUserProfile(req, res, session);
    case "PUT":
      return updateUser(req, res, session);
    case "DELETE":
      return deleteUser(req, res, session);
    default:
      res.status(405).json({ error: "Méthode non autorisée" });
  }
}

async function getUserProfile(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { objectives: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { name, lastName, age, gender, location } = req.body;

    // Validation des données
    if (!name || !lastName || !age || !gender || !location) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        lastName,
        age: typeof age === "string" ? parseInt(age) : age,
        gender,
        location,
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
}

async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    // Supprimer d'abord les objectifs liés à l'utilisateur
    await prisma.objective.deleteMany({
      where: { userId: session.user.id },
    });

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    // Détruire la session
    res.setHeader("Set-Cookie", [
      "next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]);

    return res.status(200).json({
      message: "Compte et données associées supprimés avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la suppression du compte" });
  }
}
