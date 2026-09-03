"use server";
// "use server" en haut du fichier => TOUT ce qui est exporté ici est une
// Server Action : une fonction qui s'exécute sur le serveur, mais qu'on peut
// appeler depuis le navigateur comme une fonction normale.
//
// Sous le capot, Next remplace le corps de la fonction, dans le bundle envoyé au
// navigateur, par une simple référence. L'appel devient une requête POST vers le
// serveur. Le code ci-dessous n'est JAMAIS envoyé au client.
//
// Contrainte : dans un fichier "use server", tous les exports doivent être des
// fonctions `async` (d'où le fichier séparé data.ts pour le tableau).

import { revalidatePath } from "next/cache";
import { ajouterEnBase } from "./data";

// --- Action n°1 : appelée depuis un bouton (page client) -------------------
// Elle retourne une valeur, qu'on récupère côté client comme une promesse.
export async function direBonjour(nom: string) {
  // Visible dans le TERMINAL uniquement : la preuve que ça tourne sur le serveur.
  console.log("[SERVEUR] direBonjour() appelée avec :", nom);

  // Petite pause artificielle pour bien voir l'état "chargement..." côté client.
  await new Promise((resolve) => setTimeout(resolve, 500));

  return `Bonjour ${nom} ! Réponse du serveur à ${new Date().toLocaleTimeString("fr-FR")}`;
}

// --- Action n°2 : appelée depuis un <form> (page serveur) ------------------
// Quand on la passe à <form action={...}>, React lui donne le FormData.
export async function ajouterMessage(formData: FormData) {
  const texte = String(formData.get("texte") ?? "").trim();
  console.log("[SERVEUR] ajouterMessage() reçoit :", texte);

  // Une action est joignable par POST direct, sans passer par ton UI :
  // on valide donc toujours les entrées ici, pas seulement dans le formulaire.
  if (!texte) return;

  ajouterEnBase(texte);

  // Dit à Next : "les données de /serveur ont changé, refais le rendu".
  // La nouvelle UI revient dans la même réponse que l'action, sans rechargement.
  revalidatePath("/serveur");
}
