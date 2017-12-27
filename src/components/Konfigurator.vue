<template>

  <div id="hello" class="row">

    <div class="container">

      <div class="row">
        <Leinwand :images="images" v-on:removeImage="onRemoveImage" v-on:selectImage="onSelectImage"/>

        <div id="elementsOfChoice" class="four columns">
          <Bildauswahl :categories="categories" v-on:selection="addMarkedImage"
                       v-on:imageMarked="mark"/>
        </div>
    

      </div>

      <div class="row">
        <div id="allButtons" class="eight columns">
          <button id="addButton" class="buttonSmall" @click="addMarkedImage">&nbsp;</button>
          <button id="deleteButton" class="buttonSmall" @click="triggerRemoveImage">&nbsp;</button>
          <button id="resetButton" class="buttonSmall" @click="reset">&nbsp;</button>
          <button id="pdfButton" class="buttonBig" @click="createPDF">Download</button>
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
    this.clickedToRemove = [];

    this.transformingFactorX = 0.3;
    this.transformingFactorY = 0.5;

    this.imageCounter = 0;

    this.imageToAddExists = false;

    return {
      images: [],
      categories: imagesCategorised,
      currentSelection: null,
      markedImage: {},
      imageToAddExists: false
    };
  },

  methods: {
    addMarkedImage() {
      const src = this.markedImage.imageObject.src;
      const canvas = document.getElementById("canvas");
      const coordinates = this.calculateCoordinates(
        canvas,
        this.markedImage.imageElement.width,
        this.markedImage.imageElement.height
      );
      this.images.push({
        id: this.markedImage.imageElement.id,
        url: src,
        width: coordinates.width,
        height: coordinates.height,
        left: coordinates.x,
        top: coordinates.y
      });

      this.resetMarking();
    },

    resetMarking() {
      _.forEach(imagesCategorised, category => {
        _.forEach(category, image => {
          image.marked = false;
        });
      });
    },

    onRemoveImage(index) {
      this.removeImage(index);
    },

    onSelectImage(id, isSelected) {
      if (isSelected) {
        this.currentSelection = id;
        this.clickedToRemove.push(id);
        //console.log("selected image", id);
      } else {
        const index = this.clickedToRemove.indexOf(id);
        if (index > -1) {
          this.clickedToRemove.splice(index, 1);
        }
        event.target.className = event.target.className.replace(
          "elementRemoved",
          ""
        );
      }
    },

    calculateCoordinates(canvas, naturalImageWidth, naturalImageHeight) {
      let newImageHeight = 0;
      let newImageWidth = 0;
      if (naturalImageWidth > naturalImageHeight) {
        newImageWidth = canvas.clientWidth * this.transformingFactorX;
        newImageHeight = newImageWidth / naturalImageWidth * naturalImageHeight;
      } else {
        newImageHeight = canvas.clientHeight * this.transformingFactorY;
        newImageWidth = newImageHeight / naturalImageHeight * naturalImageWidth;
      }

      const x = canvas.offsetLeft + (canvas.clientWidth - newImageWidth) / 2;
      const y = canvas.offsetTop + (canvas.clientHeight - newImageHeight) / 2;
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

    removeImage(idToDelete) {
      // einfach nur this.images[index] = null funktioniert nicht, wegen: https://vuejs.org/v2/guide/list.html#Caveats
      for (const i in this.images) {
        if (this.images[i] != null) {
          if (this.images[i].id === idToDelete) {
            const index = this.images.indexOf(this.images[i]);
            Vue.set(this.images, index, null);
          }
        }
      }
    },

    triggerRemoveImage() {
      for (const i in this.clickedToRemove) {
        this.removeImage(this.clickedToRemove[i]);
      }
      this.clickedToRemove = [];
    },

    createPDF() {
      const canvas = document.getElementById("canvas");
      const images = canvas.childNodes;
      for (const i in images) {
        if (images[i] instanceof HTMLImageElement) {
          images[i].className = "resize-drag";
        }
      }

      canvas.style.border = "none";

      html2canvas(canvas, {
        scale: 5,
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
    },
    mark(imageObject, imageElement) {
      this.markedImage = {
        imageObject: imageObject,
        imageElement: imageElement
      };
    }
  }
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

.buttonSmall, .buttonBig {
  background-color: rgba(41, 56, 80, 1);
  padding: 0px;
  color: white;
  background-size: 40%;
  background-repeat: no-repeat;
  background-position: center;
  font-size: 11px;
}

button:hover {
  background-color: black;
  /*color: black; */
}

button:focus {
  color: white;
}

#allButtons {
  display: flex;
  justify-content: center;
  margin-top: 5px;
  width: 230px;
}

.buttonSmall {
  width: 20%;
}

.buttonBig {
  width: 40%;
}

#addButton {
  background-image: url("../../static/plus.svg");
}

#resetButton {
  background-image: url("../../static/spinner.svg");
}

#deleteButton {
  background-image: url("../../static/bin.svg");
}

/* 240 x 320 (mobile) */
.container {
  margin-left: auto;
  margin-right: auto;
}

#elementsOfChoice {
  margin-left: 0px;
  width: 227px;
}

#logo {
  width: 130px;
  position: absolute;
  top: 530px;
  left: 250px;
}

.buttons {
  width: 227px;
}



/* 320 x 480 (mobile)*/
@media (min-width: 320px) {
  .container {
    margin-left: auto;
    margin-right: auto;
  }

  .buttons {
    width: 320px;
  }

  #allButtons {
    width: 320px;
  }

  #elementsOfChoice {
  width: 320px;
}

.buttonSmall, .buttonBig {
  background-size: 30%;
  font-size: 11px;
}
}

/* 480 x 640 (small tablet) UNTEREINANDER*/
@media (min-width: 480px) {
  .container {
    margin-left: auto;
    margin-right: auto;
  }

  .buttons {
    width: 430px;
  }

  #allButtons {
    width: 430px;
  }

   #elementsOfChoice {
    width: 430px;
  }
  .buttonSmall, .buttonBig {
  background-size: 23%;
  font-size: 13px;
}
}

/* 768 x 1024 (tablet - portrait) NEBENEINANDER*/
@media (min-width: 768px) {
  .container {
    margin-left: auto;
    margin-right: auto;
  }

  .buttons {
    width: 585px;
  }

  #allButtons {
    width: 585px;
  }

  #elementsOfChoice{
    width: 170px;
    margin-left: 10px;
  }
    .buttonSmall, .buttonBig {
    background-size: 18%;
    font-size: 14px;
  }
}

/* 1024 x 768 (tablet - landscape)    */
@media (min-width: 1024px) {
  .container {
    margin-left: auto;
    margin-right: auto;
  }

  .buttons {
    width: 712px;
  }

  #allButtons {
    width: 712px;
  }
  #elementsOfChoice{
    width: 200px;
    margin-left: 10px;
  }
  .buttonSmall, .buttonBig {
    background-size: 15%;
    font-size: 14px;
  }
}

/* Larger than Desktop HD */
@media (min-width: 1200px) {
  .container {
    margin-left: auto;
    margin-right: auto;
  }

  .buttons {
    width: 819px;
  }

  #allButtons {
    width: 819px;
  }

   #elementsOfChoice{
    width: 210px;
  }
   .buttonSmall, .buttonBig {
    background-size: 13%;
    font-size: 14px;
  }

}
</style>

