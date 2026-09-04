// Pas de "use client" en haut du fichier
// => c'est un SERVER COMPONENT (le comportement par défaut dans le dossier app/)
// Le code ci-dessous s'exécute UNIQUEMENT sur le serveur (Node), jamais dans le navigateur.

import { BoutonBonjour } from "@/components/BoutonBonjour";
import { ajouterMessage } from "../actions";
import { lireMessages } from "../data";

export default function PageServeur() {
  // Ce console.log s'affiche dans ton TERMINAL (là où tourne `bun dev`),
  // et PAS dans la console du navigateur (F12).
  console.log("[SERVEUR] Je m'exécute côté serveur");

  // Calculé sur le serveur au moment du rendu, puis envoyé au navigateur en HTML.
  const heureServeur = new Date().toLocaleTimeString("fr-FR");

  // Lecture directe de la "base" : pas de fetch, pas d'API, on est déjà
  // sur le serveur. C'est tout l'intérêt d'un Server Component.
  const messages = lireMessages();

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Page serveur</h1>

      <p>Heure calculée sur le serveur : {heureServeur}</p>

      {/* --- Requête serveur n°1 : via un <form> ---------------------------
          On passe l'action directement à `action`. Aucun onClick, aucun
          useState : ça fonctionne même si le JavaScript est désactivé. */}
      <section className="space-y-2">
        <h2 className="font-semibold">Ajouter un message (via un formulaire)</h2>

        <form action={ajouterMessage} className="flex gap-2">
          <input
            type="text"
            name="texte" // <- ce name devient la clé dans le FormData
            placeholder="Ton message"
            className="rounded border px-2 py-1"
          />
          <button type="submit" className="rounded border px-3 py-1">
            Envoyer
          </button>
        </form>

        <ul className="list-disc pl-5">
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </section>

      {/* --- Requête serveur n°2 : via un composant client ------------------
          Un Server Component PEUT contenir un Client Component.
          L'inverse n'est pas vrai. */}
      <section className="space-y-2">
        <h2 className="font-semibold">Le même bouton que sur la page client</h2>
        <BoutonBonjour nom="visiteur de la page serveur" />
      </section>

      <p className="text-sm text-gray-500">
        Le formulaire ci-dessus n&apos;envoie aucun JavaScript au navigateur :
        c&apos;est le serveur qui reçoit le POST, modifie les données, puis
        renvoie la page re-rendue dans la même réponse.
      </p>
    </main>
  );
}
