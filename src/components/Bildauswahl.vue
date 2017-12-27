<template>

  <div>
    <select v-model="selected" id="category" v-on:change="changeCategory">
      <option v-for="(value, key, index) in categories" :value="key">
        {{ key }}
      </option>
    </select>
    <div id="divForBorder">
    <div id="scroll">
      <ul id="imageColumn">
      <li v-for="(image, key, index) in categories[selected]">
        <img style="white-space: nowrap;" :key="image.src" :id="image.src" :src="image.src"
             :class="image.marked ? 'selectable elementMarked' : 'selectable'"
             @dblclick="emitImageSelection" @click="emitImageMarked(image, $event)">
      </li>
    </ul>
    </div>
      </div>
  </div>
  
</template>

<script>
import imagesCategorised from "../imagesCategories";
import _ from "lodash";

export default {
  name: "Bildauswahl",
  props: ["categories"],
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
.elementMarked {
  opacity: 0.5;
}

select {
  width: 100%;
}

#divForBorder {
  border: 1px solid black;
}

#scroll {
  overflow: auto;
}

.selectable {
  max-height: 50px;
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 8px;
}

.selectable:hover {
  opacity: 0.85;
}

#category {
  width: 227px;
  margin-bottom: 0px;
  margin-top: 5px;
}

#imageColumn {
  width: 227px;
  height: 70px;
  margin-top: 3px;
  margin-bottom: 0px;
  
}

#imageColumn li {
  display: table-cell;
  text-align: center;
}

#imageColumn ul {
  width: 227px;
  list-style: none;
  padding: 0;
}

/* 320 x 480 (mobile)*/
@media (min-width: 320px) {
  #imageColumn {
    width: 320px;
    height: 80px;
    margin-top: 5px;
    background-color: white;
  }

  #category {
    width: 320px;
  }

  .selectable {
    max-height: 60px;
    margin-left: 4px;
    margin-right: 4px;
    margin-top: 8px;
  }
}

/* 480 x 640 (small tablet) UNTEREINANDER*/
@media (min-width: 480px) {
  .selectable {
    max-height: 70px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 6px;
  }

  #category {
    width: 430px;
  }

  #imageColumn {
    width: 430px;
    height: 90px;
    margin-top: 8px;
  }
}

/* 768 x 1024 (tablet - portrait) NEBENEINANDER*/
@media (min-width: 768px) {
  .selectable {
    max-width: 150px;
    max-height: 110px;
    margin-top: 5px;
  }

  #imageColumn {
    padding: 0px;
    width: 170px;
    height: 528px;
    overflow-y: scroll;
    margin-top: 0px;
  }

  #category {
    width: 170px;
    height: 40px;
    margin-top: 0px;
  }

  #imageColumn li {
    display: block;
    text-align: center;
  }
}

/* 1024 x 768 (tablet - landscape) */
@media (min-width: 1024px) {
   .selectable {
   max-width: 170px;
    max-height: 130px;
    margin-top: 5px;
  }

  #imageColumn {
    width: 200px;
    height: 665px;
    overflow-y: scroll;
  }

  #category {
    width: 200px;
  }
}

/* Larger than Desktop HD */
@media (min-width: 1200px) {
   .selectable {
    max-width: 190px;
    max-height: 150px;
    margin-top: 5px;
  }

  #imageColumn {
    width: 210px;
    height: 802px;
    overflow-y: scroll;
  }
  #category {
    width: 210px;
  }
}
</style>
