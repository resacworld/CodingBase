<script setup lang="ts">
// Le await ici rend le composant "asynchrone"
const { data } = await useFetch('/api/hello', {
  key: `hello-${Date.now()}`,
})

</script>

<template>
  <div>
    <p>{{ data?.message }}</p>
    <p>Reçu à : {{ data?.time }}</p>
  </div>
</template>