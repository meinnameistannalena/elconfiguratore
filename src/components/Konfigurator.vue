<template>

  <div id="hello" class="row">

    <h1 style="text-align: center">EL CONFIGURATORE</h1>

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
  .icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
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
    background-image: url("/static/hinzufuegen-button.png");
  }

  #resetButton {
    background-image: url("/static/reset-button.png");
  }

  #deleteButton {
    background-image: url("/static/delete-button.png");
  }

  #categories {
    margin-left: 0px;
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

