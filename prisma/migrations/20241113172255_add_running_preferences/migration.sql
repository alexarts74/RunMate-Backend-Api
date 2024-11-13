-- Première étape : Ajouter updatedAt avec une valeur par défaut
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Ensuite, créer la table RunningPreferences
CREATE TABLE "RunningPreferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pace" TEXT NOT NULL,
    "distance" INTEGER NOT NULL,
    "availability" TEXT[] NOT NULL,
    "level" TEXT NOT NULL,
    "preferredGender" TEXT,
    "ageRange" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RunningPreferences_pkey" PRIMARY KEY ("id")
);

-- Créer les contraintes
CREATE UNIQUE INDEX "RunningPreferences_userId_key" ON "RunningPreferences"("userId");

ALTER TABLE "RunningPreferences" ADD CONSTRAINT "RunningPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Optionnel : Enlever la valeur par défaut de updatedAt après la migration
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;
