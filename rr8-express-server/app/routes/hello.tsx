import { Suspense } from "react";
import type { Route } from "./+types/hello";
import { Await } from "react-router";

// Le loader tourne côté serveur au SSR (et à la navigation client)
export async function loader() {
  // PAS de await → la promesse est streamée
  const slow = new Promise<{ message: string }>((resolve) =>
    setTimeout(() => resolve({ message: "Donnée lente streamée" }), 2000)
  );
  return { slow };
}

export default function Hello({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Hello</h1>
      <p>Ce titre s'affiche immédiatement.</p>

      <Suspense fallback={<p>Chargement…</p>}>
        <Await resolve={loaderData.slow}>
          {(data) => <p>{data.message}</p>}
        </Await>
      </Suspense>
    </div>
  );
}