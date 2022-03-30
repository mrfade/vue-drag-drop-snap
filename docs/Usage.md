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

```vue
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

## Advanced usage

<advanced-usage />

```vue
<template>
  <div class="wrapper">
    <vue-drag-drop-snap
      class="dds"
      parent-selector=".wrapper"
      starting-position="BL"
      :snap-options="{
        'top-left': false,
        'top-right': {
          right: 20,
          top: 20
        },
        'bottom-left': {
          left: 50,
          bottom: 50
        },
        'bottom-right': false
      }"
      no-style
      no-animation
      @activated="onActivated"
      @dragging="onDragging"
      @dropped="onDropped"
    >
      <img src="https://picsum.photos/300/200">
    </vue-drag-drop-snap>
  </div>
</template>

<script>
import VueDragDropSnap from 'vue-drag-drop-snap'

export default {
  name: 'App',
  components: {
    VueDragDropSnap
  },
  methods: {
    onActivated () {
      console.log('activated')
    },
    onDragging () {
      console.log('dragging')
    },
    onDropped () {
      console.log('dropped')
    }
  }
};
</script>

<style>
.wrapper {
  width: 100%;
  height: 500px;
  position: relative;
  border: 1px solid #000;
  border-radius: .5em;
}

.dds {
  width: 300px;
  height: 200px;
  box-sizing: border-box;
  border-radius: 10px;
}

.dds.dragging {
  border: 5px solid #f00;
}

/* custom animation */
.dds.dropped {
  transition: left 300ms, top 300ms;
  transition-timing-function: ease;
}

img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
</style>
```

::: tip Tip
  You can apply your own transition to `.dropped` class.
:::
