import type { Route } from "./+types/product.$id";

export async function loader({ params }: Route.LoaderArgs) {
  await new Promise((r) => setTimeout(r, 2000));
  return { name: `Produit numéro ${params.id}` };
}

export default function Product({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}