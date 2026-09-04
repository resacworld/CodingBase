export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await new Promise((r) => setTimeout(r, 2000)) // ton délai
  return { name: `Produit numéro ${id}` }
})