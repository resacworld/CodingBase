# rust-test

Le même projet de todos que `express-react-ssr` et `express-vue-ssr`, écrit en Rust avec [Axum](https://github.com/tokio-rs/axum).

## Lancer

```sh
cargo run --release   # http://localhost:3002 (variable PORT pour changer)
cargo test
```

La première compilation prend une à deux minutes, les suivantes sont bien plus courtes.
Sans `--release`, le binaire n'est pas optimisé : le calcul de nombres premiers est alors nettement plus lent.

## Ce que le projet montre

| Dans l'app | Dans le code | Ce que Rust apporte |
| --- | --- | --- |
| Rendu serveur de la page | `page` et la macro `html!` | HTML vérifié à la compilation, valeurs échappées automatiquement |
| API JSON | `add_todo`, `Todo` | Une entrée mal formée est rejetée avant d'atteindre le handler |
| Ajouts en direct entre onglets | `events` (SSE + canal `broadcast`) | Des milliers de connexions ouvertes pour très peu de mémoire |
| Comparaison 1 cœur / tous les cœurs | `src/primes.rs` | Le parallélisme tient à un seul mot : `into_par_iter` |
| Déploiement | `include_str!` | Un seul exécutable, CSS et JS inclus, sans runtime à installer |

Le binaire compilé se trouve dans `target/release/`. Il remplace `node_modules` et Node.

## Équivalences avec Node

| Rust | Node / TypeScript |
| --- | --- |
| `cargo` et `Cargo.toml` | `pnpm` et `package.json` |
| crate | package npm |
| Axum | Express |
| Tokio | la boucle d'événements de Node, mais sur plusieurs threads |
| `serde` | `JSON.parse` et `zod` |
| `Result<T, E>` | `throw`, sauf que le compilateur oblige à traiter l'erreur |
| `Arc<RwLock<...>>` | n'existe pas en Node : donnée partagée entre threads, protégée par un verrou |

Sans ce verrou, le code ne compile pas : Rust refuse les accès concurrents non protégés à une même donnée.
