<template>
  <div id="canvas" class="eight columns">
    <img v-for="(value, key, index) in images" :key="index"
         :src="value.src" :width="value.width" :height="value.height" class="resize-drag"
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
