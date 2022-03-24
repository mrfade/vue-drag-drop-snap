<template>
  <div class="wrapper">
    <vue-drag-drop-snap>
      TEST
    </vue-drag-drop-snap>
  </div>
</template>

<script>
import VueDragDropSnap from '../../../src/DragDropSnap.vue'

export default {
  name: 'App',
  components: {
    VueDragDropSnap
  }
};
</script>

<style>
.wrapper {
  width: 100%;
  height: 400px;
  position: relative;
  border: 1px solid #000;
  border-radius: .5em;
}
</style>