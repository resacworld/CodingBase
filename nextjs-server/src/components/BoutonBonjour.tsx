"use client";
// Composant client réutilisable : c'est lui qui déclenche la Server Action.
// On peut le poser aussi bien dans une page client que dans une page serveur.

import { useState, useTransition } from "react";
// L'alias "@/" pointe sur src/ (voir tsconfig.json), or app/ est à la racine :
// on importe donc l'action en chemin relatif.
import { direBonjour } from "../../app/actions";

export function BoutonBonjour({ nom }: { nom: string }) {
  const [reponse, setReponse] = useState<string | null>(null);

  // useTransition donne `enAttente` : vrai pendant l'aller-retour réseau.
  // C'est la façon conventionnelle d'appeler une action hors d'un <form>.
  const [enAttente, demarrerTransition] = useTransition();

  function envoyer() {
    demarrerTransition(async () => {
      // Ça ressemble à un appel de fonction, mais c'est une requête POST
      // vers le serveur. Regarde l'onglet Réseau du navigateur (F12).
      const resultat = await direBonjour(nom);
      setReponse(resultat);
    });
  }

  return (
    <div className="space-y-2">
      <button
        onClick={envoyer}
        disabled={enAttente}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        {enAttente ? "Chargement..." : "Appeler le serveur"}
      </button>

      {reponse && <p className="text-green-700">{reponse}</p>}
    </div>
  );
}
