<template>

  <div id="hello" class="row">

    <h1 style="text-align: center">EL CONFIGURATORE</h1>

    <div class="container">

      <div class="row">
        <Leinwand :images="images" v-on:removeImage="onRemoveImage" v-on:selectImage="onSelectImage"/>

        <div id="elementsOfChoice" class="four columns">
          <Bildauswahl :categories="categories" v-on:selection="onAddImage"/>
        </div>

      </div>

      <div class="row">

        <div id="allButtons" class="eight columns">
          <button id="addButton" class="fontButton">&nbsp;</button>
          <button id="deleteButton" class="imageButton" @click="triggerRemoveImage">&nbsp;</button>
          <button id="resetButton" class="imageButton" @click="reset">&nbsp;</button>
          <button id="pdfButton" class="fontButton" @click="createPDF">Download</button>

        </div>

      </div>

    </div>

  </div>


</template>


<script>
import "../../static/normalize.css";
import "../../static/skeleton.css";

import Vue from "vue";
import imagesCategorised from "../imagesCategories";

import Leinwand from "./Leinwand";
import Bildauswahl from "./Bildauswahl";

import html2canvas from "html2canvas";
import jspdf from "jspdf";

export default {
  name: "Konfigurator",
  components: {
    Leinwand,
    Bildauswahl
  },

  data() {
    this.transformingFactorX = 0.3;
    this.transformingFactorY = 0.5;
    return {
      images: [],
      categories: imagesCategorised,
      currentSelection: null
    };
  },

  methods: {
    onAddImage(image) {
      this.images.push(image);
    },
    onRemoveImage(index) {
      this.removeImage(index);
    },
    onSelectImage(index) {
      this.currentSelection = index;
      console.log("selected image", this.currentSelection);
    },

    calculateCoordinates(canvas, image) {
      var naturalImageWidth = image.naturalWidth;
      var naturalImageHeight = image.naturalHeight;
      var newImageHeight = 0;
      var newImageWidth = 0;
      if (naturalImageWidth > naturalImageHeight) {
        newImageHeight = canvas.clientHeight * this.transformingFactorX;
        newImageWidth = newImageHeight / naturalImageHeight * naturalImageWidth;
      } else {
        newImageHeight = canvas.clientHeight * this.transformingFactorY;
        newImageWidth = newImageHeight / naturalImageHeight * naturalImageWidth;
      }

      var x = canvas.offsetLeft + (canvas.clientWidth - newImageWidth) / 2;
      var y = canvas.offsetTop + (canvas.clientHeight - newImageHeight) / 2;

      return {
        x: x,
        y: y,
        width: newImageWidth,
        height: newImageHeight
      };
    },

    reset() {
      this.images = [];
    },

    removeImage(index) {
      // einfach nur this.images[index] = null funktioniert nicht, wegen: https://vuejs.org/v2/guide/list.html#Caveats
      Vue.set(this.images, index, null);
    },

    triggerRemoveImage() {
      if (this.currentSelection !== null) {
        this.removeImage(this.currentSelection);
      }
    },

    createPDF() {
      var canvas = document.getElementById("canvas");
      canvas.style.border = "none";
      //var clone = div.cloneNode(true); // true means clone all childNodes and all event handlers

      html2canvas(canvas, {
        scale: 2,
        onrendered: function(canvas) {
          var doc = new jspdf();
          //doc.internal.scaleFactor = 1.33; tut das was?
          doc.addImage(
            canvas.toDataURL("image/png"),
            "JPEG",
            10,
            14.5,
            190,
            268
          );
          doc.save("output.pdf");
        }
      });
      canvas.style.border = "1px solid black";
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
}

.element:hover {
  opacity: 0.85;
}

.elementMarked {
  opacity: 0.5;
  /*background: rgba(41, 56, 80, .5);*/
}

.elementRemoved {
  opacity: 0.5;
}

.elementNotRemoved {
  opacity: 1;
}

button {
  background-color: rgba(41, 56, 80, 1);
  padding: 0px;
  width: 23%;
  color: white;
  background-size: 20%;
  background-repeat: no-repeat;
  background-position: center;
}

button:hover {
  /*color: white; */
}

button:focus {
  color: white;
}

#addButton {
  background-image: url("/static/hinzufuegen-button.png");
}

#resetButton {
  background-image: url("/static/reset-button.png");
}

#deleteButton {
  background-image: url("/static/delete-button.png");
}

.resize-drag {
  position: absolute;
}

.resize-drag:hover {
  opacity: 0.5;
  border: black dashed 0.5px;
}

#categories {
  margin-left: 0px;
  margin-top: 5px;
  width: 230px;
}

#category {
  width: 100%;
}

#allButtons {
  margin-top: 5px;
  width: 230px;
}

/* 240 x 320 (mobile) */
.container {
  margin-left: auto;
  margin-right: auto;
}

#canvas {
  border: 0.5px solid black;
  width: 230px;
  height: 324px;
}

#test {
  width: 1000px;
  height: 1000px;
  position: absolute;
}

#elementsOfChoice {
  padding: 5px;
  border: 0.5px solid black;
  width: 230px;
  height: 90px;
  margin-top: 3px;
  margin-left: 0px;
  overflow-x: scroll;
  white-space: nowrap;
}

.element {
  height: 60px;
  margin-top: 9px;
  margin-right: 5px;
}

#logo {
  width: 130px;
  position: absolute;
  top: 530px;
  left: 250px;
}

.buttons {
  width: 230px;
}

#logo {
  width: 70px;
  position: absolute;
  top: 300px;
  left: 160px;
}

/* 320 x 480 (mobile)*/
@media (min-width: 320px) {
  .container {
    margin-left: auto;
    margin-right: auto;
  }

  #canvas {
    width: 315px;
    height: 444px;
  }

  #elementsOfChoice {
    width: 315px;
    height: 117px;
    padding: 6px;
    margin-top: 5px;
    margin-left: 0px;
    overflow-x: scroll;
    white-space: nowrap;
  }

  .element {
    height: 85px;
    margin-top: 8px;
    margin-right: 6px;
  }

  .buttons {
    width: 315px;
  }

  #logo {
    width: 100px;
    position: absolute;
    top: 410px;
    left: 190px;
  }

  #categories {
    width: 315px;
  }

  #allButtons {
    width: 315px;
  }
}

/* 480 x 640 (small tablet) UNTEREINANDER*/
@media (min-width: 480px) {
  .container {
    margin-left: auto;
    margin-right: auto;
  }

  #canvas {
    width: 430px;
    height: 606px;
  }

  #elementsOfChoice {
    width: 430px;
    height: 120px;
    padding: 6px;
    margin-top: 8px;
    margin-left: 0px;
    overflow-x: scroll;
    white-space: nowrap;
  }

  .element {
    height: 90px;
    margin-top: 9px;
    margin-right: 7px;
  }

  .buttons {
    width: 430px;
  }

  #logo {
    width: 120px;
    position: absolute;
    top: 560px;
    left: 280px;
  }

  #categories {
    width: 430px;
  }

  #allButtons {
    width: 430px;
  }
}

/* 768 x 1024 (tablet - portrait) NEBENEINANDER*/
@media (min-width: 768px) {
  .container {
    margin-left: auto;
    margin-right: auto;
  }

  #canvas {
    width: 405px;
    height: 571px;
  }

  #elementsOfChoice {
    padding: 0px;
    width: 170px;
    height: 571px;
    overflow-y: scroll;
    margin-top: 0px;
    margin-left: 10px;
  }

  .element {
    height: auto;
    width: 120px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }

  #logo {
    width: 130px;
    position: absolute;
    top: 524px;
    left: 240px;
  }

  .buttons {
    width: 405px;
  }

  #logo {
    width: 130px;
    position: absolute;
    top: 520px;
    left: 235px;
  }

  #categories {
    width: 170px;
    margin-left: 10px;
  }

  #allButtons {
    width: 405px;
  }
}

/* 1024 x 768 (tablet - landscape)

  Faktor 1,41 754
  */
@media (min-width: 1024px) {
  .container {
    margin-left: auto;
    margin-right: auto;
  }

  #canvas {
    width: 502px;
    height: 707px;
  }

  #elementsOfChoice {
    width: 200px;
    height: 707px;
    margin-left: 10px;
    overflow-y: scroll;
  }

  .element {
    width: 130px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }

  .buttons {
    width: 502px;
  }

  #logo {
    width: 130px;
    position: absolute;
    top: 650px;
    left: 330px;
  }

  #categories {
    width: 200px;
    margin-left: 10px;
  }

  #allButtons {
    width: 502px;
  }
}

/* Larger than Desktop HD */
@media (min-width: 1200px) {
  .container {
    margin-left: auto;
    margin-right: auto;
  }

  #canvas {
    width: 599px;
    height: 844px;
  }

  #elementsOfChoice {
    width: 210px;
    height: 844px;
    margin-left: 15px;
    overflow-y: scroll;
  }

  .element {
    width: 140px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }

  .buttons {
    width: 599px;
  }

  #logo {
    width: 140px;
    position: absolute;
    top: 785px;
    left: 410px;
  }

  #categories {
    width: 210px;
    margin-left: 15px;
  }

  #allButtons {
    width: 599px;
  }
}
</style>

