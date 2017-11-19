<template>
  <div class="hello">

    <canvas id="rainbow-pixel-canvas"></canvas>
    <button @click="methode1()">Add 1</button>

    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>

import interact from "interact.js";

console.log(interact);

export default {
  name: 'Konfigurator',
  data () {
    return {
      msg: 'Konfigurator'
    }
  },
  methods: {
    methode1 () {
      var canvas = document.getElementById("rainbow-pixel-canvas");
      var ctx = canvas.getContext("2d");
      ctx.font = "30px Arial";
      ctx.fillText("Hello World",10,50);
      alert("hallo");
    }
  },
  created() {
var pixelSize = 16;

interact('.rainbow-pixel-canvas')
  .snap({
    // snap to the corners of a grid
    mode: 'grid',
    // specify the grid dimensions
    grid: { x: pixelSize, y: pixelSize }
  })
  .origin('self')
  .draggable({
    max: Infinity,
    maxPerElement: Infinity
  })
  // draw colored squares on move
  .on('dragmove', function (event) {
    var context = event.target.getContext('2d'),
        // calculate the angle of the drag direction
        dragAngle = 180 * Math.atan2(event.dx, event.dy) / Math.PI;

    // set color based on drag angle and speed
    context.fillStyle = 'hsl(' + dragAngle + ', 86%, '
                        + (30 + Math.min(event.speed / 1000, 1) * 50) + '%)';

    // draw squares
    context.fillRect(event.pageX - pixelSize / 2, event.pageY - pixelSize / 2,
                     pixelSize, pixelSize);
  })
  // clear the canvas on doubletap
  .on('doubletap', function (event) {
    var context = event.target.getContext('2d');

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  });

  function resizeCanvases () {
    [].forEach.call(document.querySelectorAll('.rainbow-pixel-canvas'), function (canvas) {
      canvas.width = document.body.clientWidth;
      canvas.height = window.innerHeight * 0.7;
    });
  }

  // interact.js can also add DOM event listeners
  interact(document).on('DOMContentLoaded', resizeCanvases);
  interact(window).on('resize', resizeCanvases);

interact.maxInteractions(Infinity);

  }

}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#rainbow-pixel-canvas {
  border: solid 2px gray;
  width: 80%;
  -ms-touch-action: none;
      touch-action: none;
}
</style>
