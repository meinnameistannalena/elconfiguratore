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
  height: 35px;
  width: 100%;
}

#category {
  width: 100%;
  margin-bottom: 0.5rem;
}

#imageColumn {
  background-color: white;
  padding: 0;
  border: 1px solid #ccc;
  list-style: none;
  overflow: scroll;
  margin: 0px;
}

#imageColumn img {
  max-width: 70%;
  margin-bottom: 0.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.elementMarked {
  opacity: 0.3;
  transform: scale(1.15);
}

/* 320 x 480 (mobile)*/
@media (min-width: 320px) {
}

/* 480 x 640 (small tablet) UNTEREINANDER*/
@media (min-width: 480px) {
}

/* 768 x 1024 (tablet - portrait) NEBENEINANDER*/
@media (min-width: 768px) {
}

/* 1024 x 768 (tablet - landscape) */
@media (min-width: 1024px) {
  #imageColumn img {
    margin-bottom: 1.5rem;
  }
}

/* Larger than Desktop HD */
@media (min-width: 1200px) {
}
</style>
