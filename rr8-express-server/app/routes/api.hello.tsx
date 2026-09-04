export async function loader() {
  return Response.json({ message: "JSON pur, comme /api/hello en Nuxt" });
}