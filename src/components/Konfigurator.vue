<template>

  <div id="hello" class="row">
    <link rel="stylesheet" href="/static/stylesheet.css">
    <link rel="stylesheet" href="/static/skeleton.css">
     <link rel="stylesheet" href="/static/normalize.css">

    <h1 style="text-align: center">EL CONFIGURATORE</h1>
    <div class="container">

        <div class="row">
          <div id="canvas" class="eight columns">
             <img :style="backgroundStyle" v-for="(value, key, index) in images" :key="index" :id="value.id" :src="value.url" :width="value.wixdth" :height="value.height" class="resize-drag" @dblclick="removeImageByDoubleClick()">
           <!-- <img id="logo" src="/static/fingerfuchsLogo.png" alt="Selfhtml"> -->
          </div>


          <div id="elementsOfChoice" class="four columns" >
            
            <img v-for="(value, key, index) in this.dropdown" :key="index" :id="value.id" :src="value.url" class="element" @dblclick="addImageToCanvas()" @click="mark()">
          </div>

      </div>

       <div class="row">

          <div id="allButtons" class="eight columns">
            <button id="addButton" class="fontButton" @click="addAll()">Hinzufügen</button>
            <button id="deleteButton" class="imageButton" @click="deleteImages()">Löschen</button>
            <button id="resetButton" class="imageButton" @click="reset()">Reset</button>
             <button id="pdfButton" class="fontButton" @click="createPDF()">Download</button>

          </div>


          <div id="categories" class="four columns" >
              <select v-on:change="changeCategory()" v-model="selected" id="category">
            <option v-for="category in categoryList">
              {{ category }}
            </option>
          </select>
          </div>
      
      </div>
      
    </div>

  </div>
       
      
</template>

 

<script>
import interact from "interact.js";
import jquery from "jquery";
import skeleton from "npm-skeleton";
import html2canvas from "html2canvas";
import jspdf from "jspdf";

export default {
  name: "Konfigurator",

  data() {
    this.clickedAdd = [];
    this.clickedRemove = [];
    this.imageCounter = 0;
    this.dropdown = [];

    this.categoryList = ["Galaxy", "Kaffee", "Sonstiges"];

    this.categories = {
      Galaxy: ["galaxy01.png", "galaxy02.png", "galaxy03.png", "galaxy04.png"],
      Sonstiges: ["fingerfuchs.png", "love.jpg"],
      Kaffee: ["kaff.png", "toGoCup.svg"]
    };

    return {
      msg: "Konfigurator",
      images: [],

      selected: "Galaxy",
      pic_url:
        "http://coolwildlife.com/wp-content/uploads/galleries/post-3004/Fox%20Picture%20003.jpg",
      leftPos: "0px",
      topPos: "0px",
      classObject: {
        active: true,
        "text-danger": false
      }
    };
  },

  computed: {
    backgroundStyle: function() {
      return {
        left: this.leftPos + "px",
        top: this.topPos + "px"
      };
    }
  },

  methods: {
    changeCategory() {
      this.dropdown = [];
      var newImages = this.categories[this.selected];
      for (var m in newImages) {
        this.dropdown.push({
          id: newImages[m],
          url: "/static/" + newImages[m]
        });
      }
    },
    mark() {
      if (event.target.classList.contains("elementMarked")) {
        var index = this.clickedAdd.indexOf(event.target.id);
        if (index > -1) {
          this.clickedAdd.splice(index, 1);
        }
        event.target.className = "element";
      } else {
        event.target.className += " elementMarked";
        this.clickedAdd.push(event.target.id);
      }
    },

    markDeleted() {
      if (event.target.classList.contains("elementRemoved")) {
        var index = this.clickedRemove.indexOf(event.target.id);
        if (index > -1) {
          this.clickedRemove.splice(index, 1);
        }
        event.target.className = event.target.className.replace(
          "elementRemoved",
          ""
        );
      } else {
        event.target.className += " elementRemoved";
        this.clickedRemove.push(event.target.id);
      }
    },

    addImageToCanvas() {
      var canvas = document.getElementById("canvas");
      var img = event.target;
      var coordinates = this.calculateCoordinates(canvas, img, 0.3);
      this.leftPos = coordinates.x;
      this.topPos = coordinates.y;

      var imageId = this.imageCounter++;

      this.images.push({
        id: imageId,
        url: event.target.src,
        width: coordinates.width,
        height: coordinates.height
      });
    },

    addAll() {
      for (var image in this.clickedAdd) {
        var src = "/static/" + this.clickedAdd[image];
        var canvas = document.getElementById("canvas");
        var img = document.createElement("img");
        var coordinates = this.calculateCoordinates(canvas, img, 0.3);

        this.left = coordinates[0];
        this.top = coordinates[1];

        this.images.push({
          id: this.imageCounter++,
          url: src,
          width: coordinates[2],
          height: coordinates[3]
        });

        // alert(document.getElementById(this.clickedAdd[image]).className);
        //document.getElementById(this.clickedAdd[image]).className="element";
      }

      this.clickedAdd = [];
    },

    calculateCoordinates(canvas, image, transformFactor) {
      var newImageHeight = canvas.clientHeight * transformFactor; // 256
      var newImageWidth = newImageHeight / image.naturalHeight * image.naturalWidth; // 195
      var x = canvas.offsetLeft + (canvas.clientWidth - newImageWidth) / 2; //90
      var y = canvas.offsetTop + (canvas.clientHeight - newImageHeight) / 2; //140
      return {
        x: x,
        y: y,
        width: newImageWidth,
        height: newImageHeight
      }
    },

    reset() {
      var canvas = document.getElementById("canvas");
      while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
      }
      this.imageCounter = 0;
    },

    removeImage(canvas, imageType) {
      if (imageType == 0) {
        if (this.canvasImages.length > 0) {
          var child = document.getElementById(this.canvasImages[0]);
          canvas.removeChild(child);
          this.canvasImages.pop();
        }
      } else {
        if (this.canvasBackground.length > 0) {
          var child = document.getElementById(this.canvasBackground[0]);
          canvas.removeChild(child);
          this.canvasBackground.pop();
        }
      }
    },

    deleteImages() {
      for (var t in this.clickedRemove) {
        for (var i = 0; i < this.images.length; i++) {
          if (this.images[i].id == this.clickedRemove[t]) {
            this.images.splice(i, 1);
          }
        }
      }
      this.clickedRemove = [];
    },

    removeImageByDoubleClick() {
      for (var i = 0; i < this.images.length; i++) {
        if (this.images[i].id == event.target.id) {
          this.images.splice(i, 1);
        }
      }
      this.clickedRemove = [];
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
  created() {
    var defaultCategory = this.categories["Galaxy"];
    for (var m in defaultCategory) {
      this.dropdown.push({
        id: defaultCategory[m],
        url: "/static/" + defaultCategory[m]
      });
    }

    // target elements with the "draggable" class
    interact(".resize-drag")
      .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function(event) {
          var textEl = event.target.querySelector("p");

          textEl &&
            (textEl.textContent =
              "moved a distance of " +
              (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) +
              "px");
        }
      })
      .resizable({
        preserveAspectRatio: true,
        edges: { left: true, right: true, bottom: true, top: true }
      })
      .on("resizemove", function(event) {
        var target = event.target,
          x = parseFloat(target.getAttribute("data-x")) || 0,
          y = parseFloat(target.getAttribute("data-y")) || 0;

        // update the element's style
        target.style.width = event.rect.width + "px";
        target.style.height = event.rect.height + "px";

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
          "translate(" + x + "px," + y + "px)";

        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
        target.textContent =
          Math.round(event.rect.width) + "×" + Math.round(event.rect.height);
      })
      .on("tap", this.markDeleted.bind(this));
    //.on('dbltap', this.removeI.bind(this));

    function dragMoveListener(event) {
      var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
        y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

      // translate the element
      target.style.webkitTransform = target.style.transform =
        "translate(" + x + "px, " + y + "px)";

      // update the posiion attributes
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    }

    // this is used later in the resizing and gesture demos
    window.dragMoveListener = dragMoveListener;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.element:hover {
  opacity: 0.85;
}

.elementMarked {
  opacity: 0.5;
  /*background: rgba(41, 56, 80, .5);*/
}

.elementRemoved {
  opacity: 0.85;
}

.elementNotRemoved {
  opacity: 1;
}

button {
  background-color: rgba(41, 56, 80, 1);
  /*margin-left: auto;
  margin-right: auto; */
  /* color: white; */
  padding: 0px;
  /*font-size: 10px;*/
  width: 23%;
  color: white;
  background-size: 40%;
  background-repeat: no-repeat;
  background-position: center;
}

/* #addButton {
  background-image: url("/static/hinzufuegen-button.png");
}

#resetButton {
  background-image: url("/static/reset-button.png");
}

#deleteButton {
  background-image: url("/static/delete-button.png");
} */

.resize-drag {
  position: absolute;
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
  margin-top: 9px;
  width: 60px;
  display: inline-block;
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
    margin-top: 6px;
    width: 90px;
    display: inline-block;
    margin-right: 10px;
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
    margin-top: 7px;
    width: 90px;
    display: inline-block;
    margin-right: 10px;
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

