<template>
  <div id="canvas" class="eight columns">
    <img v-for="(value, key, index) in images" :key="index" :id="value.id"
         :src="value.url" :width="value.width" :height="value.height" class="resize-drag"
         >
  </div>
</template>

<script>
  export default {
    name: "Leinwand",
    props: ["images"],
  }
</script>

<style scoped>

</style>
