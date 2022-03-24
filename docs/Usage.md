# Usage

## Registering the component

You can register the component in your application by adding the following code to the `main.js` file:

```js
import VueDragDropSnap from 'vue-drag-drop-snap'

Vue.component('vue-drag-drop-snap', VueDragDropSnap)
```

or you can use the component directly in your template:

```js
import VueDragDropSnap from 'vue-drag-drop-snap'

export default {
  name: 'App',
  components: {
    VueDragDropSnap
  }
}
```

## Basic usage

<basic-usage />

```html
<template>
  <div class="wrapper">
    <vue-drag-drop-snap>
      TEST
    </vue-drag-drop-snap>
  </div>
</template>

<script>
import VueDragDropSnap from 'vue-drag-drop-snap'

export default {
  name: 'App',
  components: {
    VueDragDropSnap
  }
};
</script>

<style>
.wrapper {
  width: 800px;
  height: 450px;
  position: relative;
}
</style>
```

::: warning Note
  Don't forget to add `position: relative;` to the parent element.
:::
