<template>
  <div class="aspect-wrapper">
    <div class="aspect-ratio-7-to-10"></div>
    <div id="canvas" class="aspect-content">
      <img v-for="(value, index) in images" v-if="value !== null" :key="index"
           :src="value.url" :id="value.id" :width="value.width" :height="value.height"
           v-bind:style="{ left: value.left + 'px', top: value.top + 'px' }" class="resize-drag"
           @dblclick="removeImage(index)"
      >
    </div>
  </div>
</template>

<script>
  import interact from "interact.js";

  export default {
    name: "Leinwand",
    props: ["images", "message"],

    data: () => {
      return {
        clickedRemove: [],
        imageCounter: 0
      };
    },

    created() {
      // target elements with the "draggable" class
      interact(".resize-drag")
        .draggable({
          // enable inertial throwing
          inertia: true,
          // keep the element within the area of it's parent
          restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: {top: 0, left: 0, bottom: 1, right: 1}
          },
          // enable autoScroll
          autoScroll: true,

          // call this function on every dragmove event
          onmove: dragMoveListener,
          // call this function on every dragend event
          onend: function (event) {
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
          edges: {left: true, right: true, bottom: true, top: true}
        })
        .on("resizemove", function (event) {
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
        .on("tap", this.selectImage.bind(this));

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
    },
    methods: {
      removeImage(index) {
        this.$emit("removeImage", index);
      },

      selectImage(event) {
        if (event.target.classList.contains("elementRemoved")) {
          event.target.className = event.target.className.replace(
            "elementRemoved",
            ""
          );
          this.$emit("selectImage", event.target.id, false);
        } else {
          event.target.className += " elementRemoved";
          this.$emit("selectImage", event.target.id, true);
        }
      }
    }
  };
</script>

<style scoped>
  /**
  Das mit dem Seitenverhältnis habe ich mir von hier abgeschaut: https://stackoverflow.com/questions/1495407/maintain-the-aspect-ratio-of-a-div-with-css
   */
  .aspect-wrapper {
    position: relative;
    width: 100%;
  }

  .aspect-ratio-7-to-10 {
    padding-bottom: 140%;
  }

  .aspect-content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  #canvas {
    border: 1px solid #ccc;
    background-color: white;
  }

  img {
    position: absolute;
  }

  .resize-drag {
    position: absolute;
  }

  .resize-drag:hover {
    opacity: 0.5;
    border: black dashed 0.5px;
  }

  .elementRemoved{
    border: red solid 5px;
}

</style>
