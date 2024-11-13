import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  // Détruire la session
  res.setHeader("Set-Cookie", [
    "next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ]);

  return res.status(200).json({ message: "Déconnexion réussie" });
}
