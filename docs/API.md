---
sidebarDepth: 2
---

# API

## Properties

#### `parentWidth: Number` `default: 0`

Parent width of the element.

---

#### `parentHeight: Number` `default: 0`

Parent width of the element.

---

#### `parentSelector: String` `default: ''`

Defines parent element for modal. Used to calculate the parent's width and height. If `parentWidth` and `parentHeight` are not defined, the parent's width and height will be calculated by `parentSelector`. If none of them is defined, the parent's width and height is calculated from the parent in DOM.

---

#### `startingPosition: String` `default: null` `values: 'TR', 'TL', 'BL', 'BR'`

The starting position of the element.

---

#### `autoSnap: Boolean` `default: true`

If `true`, the element will snap to the calculated position ('TR', 'TL', 'BL', 'BR'), otherwise it will be positioned at the dropped position.

---

#### `snapOptions: Object`

Default:

```js
{
  'top-left': {
    left: 10,
    top: 10
  },
  'top-right': {
    right: 10,
    top: 10
  },
  'bottom-left': {
    left: 10,
    bottom: 10
  },
  'bottom-right': {
    right: 10,
    bottom: 10
  }
}
```

The options for snapping.
The `top`, `right`, `bottom`, `left` properties are the distance from the edge of the element to the edge of the parent.

---

#### `noStyle: Boolean` `default: false`

No style will be applied to the element.

---

#### `noAnimation: Boolean` `default: false`

No animation will be applied to the element.

---

## Methods

You can access the component's methods by using refs:

```html
<vue-drag-drop-snap ref="dds">
  TEST
</vue-drag-drop-snap>
```

you can access the component's methods by using the `this.$refs.dds` and call the following methods:

#### `changePosition(position)` `values: 'TR', 'TL', 'BR', 'BL'`

Change the position of the component.
