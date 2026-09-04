"use client";
// Cette directive DOIT être la toute première ligne du fichier.
// Elle marque la "frontière client" : ce composant (et tous ceux qu'il importe)
// est envoyé au navigateur sous forme de JavaScript et s'y exécute.

import { useState, useEffect } from "react";
import { BoutonBonjour } from "@/components/BoutonBonjour";

export default function PageClient() {
  // useState / useEffect ne sont possibles QUE dans un Client Component.
  const [compteur, setCompteur] = useState(0);
  const [largeur, setLargeur] = useState<number | null>(null);

  useEffect(() => {
    // `window` n'existe pas sur le serveur : ce code ne tourne que dans le navigateur.
    console.log("[CLIENT] Je m'exécute dans le navigateur");

    const mesurer = () => setLargeur(window.innerWidth);
    mesurer();

    // Un useEffect sert à se brancher sur un système extérieur à React
    // (ici l'événement resize du navigateur)...
    window.addEventListener("resize", mesurer);
    // ...et la fonction retournée sert à se débrancher quand on quitte la page.
    return () => window.removeEventListener("resize", mesurer);
  }, []);

  return (
    <main className="space-y-3">
      <h1 className="text-2xl font-bold">Page client</h1>

      <button
        onClick={() => setCompteur(compteur + 1)}
        className="rounded border px-3 py-1"
      >
        Clics : {compteur}
      </button>

      <p>
        Largeur de ta fenêtre :{" "}
        {largeur === null ? "(pas encore mesurée)" : `${largeur}px`}
      </p>

      <p className="text-sm text-gray-500">
        Ouvre la console du navigateur (F12) : le log &laquo; [CLIENT] &raquo;
        s&apos;y trouve. Le compteur se met à jour sans aucun aller-retour
        serveur.
      </p>

      <hr />

      {/* Ici au contraire, le bouton déclenche une vraie requête au serveur.
          Ce composant est déjà client, donc rien de spécial à faire. */}
      <section className="space-y-2">
        <h2 className="font-semibold">Appel d&apos;une Server Action</h2>
        <BoutonBonjour nom="visiteur de la page client" />
        <p className="text-sm text-gray-500">
          Le log &laquo; [SERVEUR] direBonjour() &raquo; sort dans le terminal,
          pas dans le navigateur : la fonction n&apos;a jamais quitté le serveur.
        </p>
      </section>
    </main>
  );
}
