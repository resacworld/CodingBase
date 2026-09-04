<script setup lang="ts">
const route = useRoute()
const { data } = await useFetch(`/api/product/${route.params.id}`, {
  // la clé inclut l'id → chaque produit a son propre cache
  key: `product-${route.params.id}`,
  lazy: true, // on ne charge les données que si le composant est rendu
  server: false, // on ne charge les données que côté client
})
</script>

<template>
  <div>
    <h1>Produit {{ route.params.id }}</h1>
    <p>{{ data?.name }}</p>
  </div>
</template>