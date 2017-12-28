<template>

  <div class="konfigurator">
    <div class="grid-container">
      <div>
        <div id="allButtons">
          <button id="addButton" class="buttonSmall" @click="addMarkedImage">
            <img src="../../static/plus.svg">
          </button>
          <button id="deleteButton" class="buttonSmall" @click="triggerRemoveImage">
            <img src="../../static/bin.svg">
          </button>
          <button id="resetButton" class="buttonSmall" @click="reset">
            <img src="../../static/spinner.svg">
          </button>
          <button id="pdfButton" class="buttonBig" @click="createPDF">
            Download
          </button>
        </div>
        <Leinwand ref="leinwand" :images="images" v-on:removeImage="onRemoveImage" v-on:selectImage="onSelectImage"/>
      </div>

      <div id="elementsOfChoice">
        <Bildauswahl ref="bildauswahl" :height="canvasHeight" :categories="categories" v-on:selection="addMarkedImage"
                     v-on:imageMarked="mark"/>
      </div>
    </div>
  </div>
</template>


<script>
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
        imageToAddExists: false,
        canvasHeight: null
      };
    },
    mounted() {
      /**
       * nachdem die Komponente das erste Mal gerendert wurde, setCanvasHeight aufraufen und
       * bei Event aufsetzen, so dass setCanvasHeight auch bei Änderung der Fenstergröße erneut aufgerufen wird
       */
      this.setCanvasHeight();
      window.addEventListener("resize", () => {
        this.setCanvasHeight();
      }, true);
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
      setCanvasHeight() {
        this.canvasHeight = this.$refs.leinwand.$el.clientHeight + "px";
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
          onrendered: function (canvas) {
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
  .konfigurator {
    width: 62vw;
    position: relative;
    margin: 0 auto;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 73% 25%;
    grid-column-gap: 2%;
  }

  button {
    background-color: rgba(41, 56, 80, 1);
    color: white;
    padding: 0.25rem;
  }

  button:hover {
    background-color: black;
  }

  button:focus {
    color: white;
  }

  button > img {
    height: 1rem;
  }

  #allButtons {
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .buttonSmall {
    width: 20%;
  }

  .buttonBig {
    width: 40%;
  }


</style>

