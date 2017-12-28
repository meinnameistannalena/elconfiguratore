<template>

  <div>
    <select v-model="selected" id="category" v-on:change="changeCategory">
      <option v-for="(value, key, index) in categories" :value="key">
        {{ key }}
      </option>
    </select>
    <ul id="imageColumn" :style="{height: height}">
      <li v-for="(image, key, index) in categories[selected]">
        <img :key="image.src" :id="image.src" :src="image.src"
             :class="image.marked ? 'selectable elementMarked' : 'selectable'"
             @dblclick="emitImageSelection" @click="emitImageMarked(image, $event)">
      </li>
    </ul>
  </div>

</template>

<script>
  import imagesCategorised from "../imagesCategories";
  import _ from "lodash";

  export default {
    name: "Bildauswahl",
    props: ["categories", "height"],
    data: () => {
      return {
        selected: "Galaxy",
        dropdown: []
      };
    },
    methods: {
      emitImageSelection(event) {
        this.$emit("selection", event);
      },
      emitImageMarked(image, event) {
        this.resetMarking();
        image.marked = true;
        this.$emit("imageMarked", image, event.target);
      },
      resetMarking() {
        _.forEach(imagesCategorised, category => {
          _.forEach(category, image => {
            image.marked = false;
          });
        });
      },
      changeCategory() {
        this.resetMarking();
      }
    }
  };
</script>

<style scoped>
  select {
    width: 100%;
  }

  #category {
    width: 100%;
    margin-bottom: 0;
  }

  #imageColumn {
    padding: 0;
    border: 1px solid #ccc;
    list-style: none;
    overflow: scroll;
  }

  img {
    max-width: 100%;
    margin-bottom: 0.5rem;
  }

</style>
