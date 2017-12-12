<template>
  <div>
    <select v-model="selected" id="category">
      <option v-for="(value, key, index) in categories" :value="key">
        {{ key }}
      </option>
    </select>
    <ul>
      <li v-for="(image, key, index) in categories[selected]">
        <img :key="index" :src="image.src" class="selectable" @dblclick="emitImageSelection(image)">
      </li>
    </ul>
  </div>

</template>

<script>
  export default {
    name: "Bildauswahl",
    props: ["categories"],
    data: () => {
      return {
        selected: "Galaxy",
      }
    },
    methods: {
      emitImageSelection(image) {
        this.$emit("selection", image);
      }
    }
  }
</script>

<style scoped>
  select {
    width: 100%;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  .selectable {
    max-width: 100%;
  }
</style>
