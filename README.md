# vue-drag-drop-snap

A dependency-free Vue component, that allows you to drag and drop elements and snap them to specified positions. Inspired by [vue-drag-it-dude](https://github.com/Esvalirion/vue-drag-it-dude)

[![npm](https://img.shields.io/npm/v/vue-drag-drop-snap.svg)](https://www.npmjs.com/package/vue-drag-drop-snap)
[![npm](https://img.shields.io/npm/dm/vue-drag-drop-snap.svg)](https://www.npmjs.com/package/vue-drag-drop-snap)
[![npm](https://img.shields.io/npm/dt/vue-drag-drop-snap.svg)](https://www.npmjs.com/package/vue-drag-drop-snap)

## Install

```bash
npm install vue-drag-drop-snap

or

yarn add vue-drag-drop-snap
```

## Usage

```js
import VueDragDropSnap from 'vue-drag-drop-snap'

export default {
  components: {
    VueDragDropSnap
  }
};
```

```html
<div class="wrapper">
  <vue-drag-drop-snap
    starting-position="BR"
    :snap-options="{
      'top-left': {
        left: 40,
        top: 40
      },
      'top-right': {
        right: 20,
        top: 20
      },
      'bottom-left': {
        left: 50,
        bottom: 50
      },
      'bottom-right': {
        right: 50,
        bottom: 50
      }
    }"
  >
    <img src="https://picsum.photos/300/200">
  </vue-drag-drop-snap>
</div>

<style>
.wrapper {
  position: relative;
}
</style>
```

> Note: Don't forget to add `position: relative;` to the parent (`.wrapper`) element.

## Docs

See the full api docs and examples here: [https://mrfade.github.io/vue-drag-drop-snap/](https://mrfade.github.io/vue-drag-drop-snap/)

## License

[MIT license](LICENSE)
