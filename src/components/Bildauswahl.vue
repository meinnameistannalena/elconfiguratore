<template>

  <div>
    <select v-model="selected" id="category" v-on:change="changeCategory(categories, clickedAdd)">
      <option v-for="(value, key, index) in categories" :value="key">
        {{ key }}
      </option>
    </select>
    <ul>
      <li v-for="(image, key, index) in categories[selected]" >
        <img :key="image.src" :id="image.src" :src="image.src" :class="image.marked ? 'selectable elementMarked' : 'selectable'" @dblclick="emitImageSelection" @click="emitImageMarked">
      </li>
    </ul>
  </div>

</template>

<script>
import imagesCategorised from "../imagesCategories";

export default {
  name: "Bildauswahl",
  props: ["categories", "clickedAdd", "imageToAddExists"],
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
    emitImageMarked(event) {
      this.$emit("imageMarked");
    },
    changeCategory(categories, clickedAdd) {
      var selection = categories[this.selected];
      for (var i in selection) {
        for (var add in clickedAdd) {
          var id = this.clickedAdd[add].id;
          if (selection[i].src == id) {
            selection[i].marked = true;
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.elementMarked {
  opacity: 0.5;
}

select {
  width: 100%;
}
ul {
  list-style: none;
  padding: 0;
}
.selectable {
  max-width: 60%;
  /*height: 60px;*/
  margin-top: 9px;
  margin-right: 5px;
}

.selectable:hover {
  opacity: 0.85;
}

/* 320 x 480 (mobile)*/
@media (min-width: 320px) {
  .selectable {
    height: 85px;
    margin-top: 8px;
    margin-right: 6px;
  }
}

/* 480 x 640 (small tablet) UNTEREINANDER*/
@media (min-width: 480px) {
  .selectable {
    height: 90px;
    margin-top: 9px;
    margin-right: 7px;
  }
}

/* 768 x 1024 (tablet - portrait) NEBENEINANDER*/
@media (min-width: 768px) {
  .selectable {
    height: auto;
    width: 120px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }
}

/* 1024 x 768 (tablet - landscape) */
@media (min-width: 1024px) {
  .selectable {
    width: 130px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }
}

/* Larger than Desktop HD */
@media (min-width: 1200px) {
  .selectable {
    width: 140px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }
}
</style>
