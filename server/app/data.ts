// Faux "base de données" : un simple tableau en mémoire.
// Il vit dans le processus Node du serveur, donc il est partagé entre toutes
// les pages et tous les visiteurs, et il est remis à zéro à chaque redémarrage.
// (En vrai projet, ce serait Postgres, SQLite, une API externe, etc.)

const messages: string[] = ["Premier message (écrit en dur)"];

export function lireMessages() {
  return messages;
}

export function ajouterEnBase(texte: string) {
  messages.push(texte);
}
