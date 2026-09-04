<script setup lang="ts">
const { data } = await useFetch('/api/hello', { lazy: true, server: false })
// const { data } = await useAsyncData('accueil', () => {
//   // ce code tourne côté serveur au SSR
//   return Promise.resolve({ message: "Directement au SSR", time: new Date().toISOString() })
// })
</script>

<template>
  <div>
    <!-- <h1>Accueil</h1> -->
    <p>{{ data?.message }}</p>
    <p>Rendu à : {{ new Date().toISOString() }}</p>
    <!-- <NuxtLink to="/about">Aller à about</NuxtLink> -->

    <h1>Accueil</h1>
    <p>Ce titre s'affiche immédiatement.</p>
    <NuxtLink to="/about">Aller à about</NuxtLink>

    <Suspense>
      <!-- contenu principal (le composant async) -->
      <SlowData />

      <!-- fallback affiché pendant le chargement -->
      <template #fallback>
        <p>Chargement des données…</p>
      </template>
    </Suspense>
  </div>
</template>