//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
  name: 'drag-drop-snap',
  props: {
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    parentSelector: {
      type: String,
      default: ''
    },
    parentWidth: {
      type: Number,
      default: 0
    },
    parentHeight: {
      type: Number,
      default: 0
    },
    startingPosition: {
      type: String,
      default: null
    },
    autoSnap: {
      type: Boolean,
      default: true
    },
    snapOptions: {
      type: Object,
      default: function default$1 () {
        return {
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
      }
    },
    noStyle: {
      type: Boolean,
      default: false
    },
    noAnimation: {
      type: Boolean,
      default: false
    },
  },
  data: function () { return ({
    shiftY: null,
    shiftX: null,
    left: 0,
    top: 0,
    elem: null,
    isIos: false,
    parent: {
      width: 0,
      height: 0
    },
    parentElem: null,
    isDragging: false,
    onLeft: false,
    onTop: false,
    currentPosition: '',
    events: []
  }); },
  watch: {
    width: function width (newWidth, oldWidth) {
      if (newWidth < oldWidth) { return }
      if (this.left === 0) { return }

      this.calculateParent();

      if (newWidth > this.parent.width - this.left) {
        var newLeft = this.parent.width - newWidth;
        this.left = newLeft < 0 ? 0 : newLeft;
        this.elem.style.left = (this.left) + "px";
      }
    },

    height: function height (newHeight, oldHeight) {
      if (newHeight < oldHeight) { return }
      if (this.top === 0) { return }

      this.calculateParent();

      if (newHeight > this.parent.height - this.top) {
        var newTop = this.parent.height - this.height;
        this.top = newTop;
        this.elem.style.top = (this.top) + "px";
      }
    }
  },
  destroyed: function destroyed () {
    window.removeEventListener('resize', this.update);
  },
  mounted: function mounted () {
    this.isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    this.elem = this.$el;

    this.parentElem = (this.parentSelector && document.body.querySelector(this.parentSelector)) || this.elem.parentNode;

    this.calculateArea();

    if (this.startingPosition) {
      this.currentPosition = this.startingPosition;
      this.update();
    }

    window.addEventListener('resize', this.update);
  },
  methods: {
    iosMove: function iosMove (e) {
      if (this.isIos) { this.elementMove(e); }
    },

    elementMove: function elementMove (e) {
      if (this.events.slice(-1)[0] !== 'dragging') {
        this.$emit('dragging');
        this.events.push('dragging');
      }
      
      e.preventDefault();
      if (!e.pageX)
        { document.body.style.overflow = 'hidden'; }

      var x = e.pageX || e.changedTouches[0].pageX;
      var y = e.pageY || e.changedTouches[0].pageY;
      var newLeft = x - this.shiftX;
      var newTop = y - this.shiftY;
      var newRight = x - this.shiftX + this.elem.offsetWidth;
      var newBottom = y - this.shiftY + this.elem.offsetHeight;
      if (newLeft < 0)
        { newLeft = 0; }
      else if (newRight > this.parent.width)
        { newLeft = this.parent.width - this.elem.offsetWidth; }
      else
        { newLeft = x - this.shiftX; }

      if (newTop < 0)
        { newTop = 0; }
      else if (newBottom > this.parent.height)
        { newTop = this.parent.height - this.elem.offsetHeight; }
      else
        { newTop = y - this.shiftY; }

      this.elem.style.left = newLeft + "px";
      this.left = newLeft;
      this.elem.style.top = newTop + "px";
      this.top = newTop;
    },

    hang: function hang (e) {
      this.events = [];
      this.events.push('activated');
      this.$emit('activated');

      this.isDragging = true;
      this.calculateParent();

      this.shiftX = e.pageX
        ? e.pageX - this.elem.offsetLeft
        : e.changedTouches[0].pageX - this.elem.offsetLeft;
      this.shiftY = e.pageY
        ? e.pageY - this.elem.offsetTop
        : e.changedTouches[0].pageY - this.elem.offsetTop;

      if (e.pageX) {
        if (this.isIos) {
          this.parentElem.addEventListener('touchmove', this.elementMove);
        } else {
          this.parentElem.addEventListener('mousemove', this.elementMove);
          this.parentElem.addEventListener('mouseleave', this.drop);
        }
      } else {
        this.parentElem.addEventListener('touchmove', this.elementMove);
      }
    },

    drop: function drop () {
      this.$emit('dropped');

      this.isDragging = false;
      document.body.style.overflow = null;
      this.parentElem.removeEventListener('mousemove', this.elementMove, false);
      this.parentElem.removeEventListener('touchmove', this.elementMove, false);
      this.parentElem.onmouseup = null;
      this.parentElem.ontouchend = null;

      if (this.autoSnap) {
        this.calculateArea();

        // Top - Left
        if (this.onLeft && this.onTop)
          { if (this.getSnapOption('top-left')) { this.autoSnapMoveTL(); }
          else if (this.getSnapOption('top-right')) { this.autoSnapMoveTR(); }
          else if (this.getSnapOption('bottom-left')) { this.autoSnapMoveBL(); }
          else { this.autoSnapMoveTL(); } }

        // Top - Right
        else if (!this.onLeft && this.onTop)
          { if (this.getSnapOption('top-right')) { this.autoSnapMoveTR(); }
          else if (this.getSnapOption('top-left')) { this.autoSnapMoveTL(); }
          else if (this.getSnapOption('bottom-right')) { this.autoSnapMoveBR(); }
          else { this.autoSnapMoveTL(); } }

        // Bottom - Left
        else if (this.onLeft && !this.onTop)
          { if (this.getSnapOption('bottom-left')) { this.autoSnapMoveBL(); }
          else if (this.getSnapOption('bottom-right')) { this.autoSnapMoveBR(); }
          else if (this.getSnapOption('top-left')) { this.autoSnapMoveTL(); }
          else { this.autoSnapMoveTL(); } }

        // Bottom - Right
        else if (!this.onLeft && !this.onTop)
          { if (this.getSnapOption('bottom-right')) { this.autoSnapMoveBR(); }
          else if (this.getSnapOption('bottom-left')) { this.autoSnapMoveBL(); }
          else if (this.getSnapOption('top-right')) { this.autoSnapMoveTR(); }
          else { this.autoSnapMoveTL(); } }
      }
    },

    getSnapOption: function getSnapOption(option) {
      if (!this.snapOptions[option])
        { return false }

      return {
        top: this.snapOptions[option] && this.snapOptions[option].top,
        left: this.snapOptions[option] && this.snapOptions[option].left,
        bottom: this.snapOptions[option] && this.snapOptions[option].bottom,
        right: this.snapOptions[option] && this.snapOptions[option].right
      }
    },

    autoSnapMoveTL: function autoSnapMoveTL () {
      var left = this.getSnapOption('top-left').left || 0;
      var top = this.getSnapOption('top-left').top || 0;

      this.moveLeft(left);
      this.moveTop(top);
    },

    autoSnapMoveTR: function autoSnapMoveTR () {
      var right = this.getSnapOption('top-right').right || 0;
      var top = this.getSnapOption('top-right').top || 0;

      this.moveLeft(this.parent.width - this.elem.offsetWidth - right);
      this.moveTop(top);
    },

    autoSnapMoveBL: function autoSnapMoveBL () {
      var left = this.getSnapOption('bottom-left').left || 0;
      var bottom = this.getSnapOption('bottom-left').bottom || 0;

      var r = this.parent.height - this.elem.offsetHeight - bottom;

      this.moveLeft(left);
      this.moveTop(r);
    },

    autoSnapMoveBR: function autoSnapMoveBR () {
      var right = this.getSnapOption('bottom-right').right || 0;
      var bottom = this.getSnapOption('bottom-right').bottom || 0;

      var l = this.parent.width - this.elem.offsetWidth - right;
      var r = this.parent.height - this.elem.offsetHeight - bottom;

      this.moveLeft(l);
      this.moveTop(r);
    },

    moveLeft: function moveLeft (left) {
      this.left = left;
      this.elem.style.left = left + "px";
    },

    moveTop: function moveTop (top) {
      this.top = top;
      this.elem.style.top = top + "px";
    },

    calculateParent: function calculateParent () {
      this.parent.width = this.parentWidth || (this.parentSelector && document.body.querySelector(this.parentSelector) &&document.body.querySelector(this.parentSelector).offsetWidth) || this.elem.parentNode.offsetWidth;
      this.parent.height = this.parentHeight || (this.parentSelector && document.body.querySelector(this.parentSelector) &&document.body.querySelector(this.parentSelector).offsetHeight) || this.elem.parentNode.offsetHeight;
    },

    calculateArea: function calculateArea () {
      this.onLeft = this.left + this.elem.offsetWidth / 2 < this.parent.width / 2;
      this.onTop = this.top + this.elem.offsetHeight / 2 < this.parent.height / 2;

      if (this.onLeft && this.onTop)
        { this.currentPosition = 'TL'; }
      else if (!this.onLeft && this.onTop)
        { this.currentPosition = 'TR'; }
      else if (this.onLeft && !this.onTop)
        { this.currentPosition = 'BL'; }
      else if (!this.onLeft && !this.onTop)
        { this.currentPosition = 'BR'; }
    },

    changePosition: function changePosition (position) {
      var positions = ['TL', 'TR', 'BL', 'BR'];
      this.currentPosition = positions.includes(position) ? position : 'TL';
      this.update();
    },

    update: function update () {
      this.calculateParent();
      if (this.currentPosition)
        { this['autoSnapMove' + this.currentPosition](); }
    }
  }
};

/* script */
            var __vue_script__ = script;
            
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "drag-drop-snap",
      class: {
        dragging: _vm.isDragging,
        dropped: !_vm.isDragging,
        "with-style": !_vm.noStyle,
        "with-animation": !_vm.noAnimation
      },
      on: {
        touchstart: function($event) {
          $event.stopPropagation();
          return _vm.hang.apply(null, arguments)
        },
        touchend: function($event) {
          $event.stopPropagation();
          return _vm.drop.apply(null, arguments)
        },
        mousedown: function($event) {
          $event.stopPropagation();
          return _vm.hang.apply(null, arguments)
        },
        mouseup: function($event) {
          $event.stopPropagation();
          return _vm.drop.apply(null, arguments)
        },
        touchmove: function($event) {
          $event.stopPropagation();
          return _vm.iosMove.apply(null, arguments)
        }
      }
    },
    [_vm._t("default")],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-4efc33f3_0", { source: "\n.drag-drop-snap[data-v-4efc33f3] {\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  z-index: 9;\r\n  cursor: move;\n}\n.drag-drop-snap.with-style[data-v-4efc33f3] {\r\n  width: 8em;\r\n  height: 4.5em;\r\n  background: #ccc;\r\n  border-radius: 2em;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n}\n.drag-drop-snap.active[data-v-4efc33f3] {\r\n  visibility: visible;\n}\n.drag-drop-snap.dropped.with-animation[data-v-4efc33f3] {\r\n  transition: left 500ms, top 500ms;\r\n  transition-timing-function: cubic-bezier(0.35, 1.16, 0.63, 1.17), cubic-bezier(0.35, 1.16, 0.63, 1.17);\n}\r\n", map: {"version":3,"sources":["C:\\Users\\Enes\\Desktop\\çalışmalar\\vue-drag-drop-snap/C:\\Users\\Enes\\Desktop\\çalışmalar\\vue-drag-drop-snap\\src\\DragDropSnap.vue"],"names":[],"mappings":";AA0VA;EACA,mBAAA;EACA,OAAA;EACA,SAAA;EACA,WAAA;EACA,aAAA;CACA;AAEA;EACA,WAAA;EACA,cAAA;EACA,iBAAA;EACA,mBAAA;EACA,cAAA;EACA,wBAAA;EACA,oBAAA;EACA,yEAAA;CACA;AAEA;EACA,oBAAA;CACA;AAEA;EACA,kCAAA;EACA,uGAAA;CACA","file":"DragDropSnap.vue","sourcesContent":["<template>\r\n  <div\r\n    :class=\"{ dragging: isDragging, dropped: !isDragging, 'with-style': !noStyle, 'with-animation': !noAnimation }\"\r\n    class=\"drag-drop-snap\"\r\n    @touchstart.stop=\"hang\"\r\n    @touchend.stop=\"drop\"\r\n    @mousedown.stop=\"hang\"\r\n    @mouseup.stop=\"drop\"\r\n    @touchmove.stop=\"iosMove\"\r\n  >\r\n    <slot></slot>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  name: 'drag-drop-snap',\r\n  props: {\r\n    width: {\r\n      type: Number,\r\n      default: 0\r\n    },\r\n    height: {\r\n      type: Number,\r\n      default: 0\r\n    },\r\n    parentSelector: {\r\n      type: String,\r\n      default: ''\r\n    },\r\n    parentWidth: {\r\n      type: Number,\r\n      default: 0\r\n    },\r\n    parentHeight: {\r\n      type: Number,\r\n      default: 0\r\n    },\r\n    startingPosition: {\r\n      type: String,\r\n      default: null\r\n    },\r\n    autoSnap: {\r\n      type: Boolean,\r\n      default: true\r\n    },\r\n    snapOptions: {\r\n      type: Object,\r\n      default () {\r\n        return {\r\n          'top-left': {\r\n            left: 10,\r\n            top: 10\r\n          },\r\n          'top-right': {\r\n            right: 10,\r\n            top: 10\r\n          },\r\n          'bottom-left': {\r\n            left: 10,\r\n            bottom: 10\r\n          },\r\n          'bottom-right': {\r\n            right: 10,\r\n            bottom: 10\r\n          }\r\n        }\r\n      }\r\n    },\r\n    noStyle: {\r\n      type: Boolean,\r\n      default: false\r\n    },\r\n    noAnimation: {\r\n      type: Boolean,\r\n      default: false\r\n    },\r\n  },\r\n  data: () => ({\r\n    shiftY: null,\r\n    shiftX: null,\r\n    left: 0,\r\n    top: 0,\r\n    elem: null,\r\n    isIos: false,\r\n    parent: {\r\n      width: 0,\r\n      height: 0\r\n    },\r\n    parentElem: null,\r\n    isDragging: false,\r\n    onLeft: false,\r\n    onTop: false,\r\n    currentPosition: '',\r\n    events: []\r\n  }),\r\n  watch: {\r\n    width (newWidth, oldWidth) {\r\n      if (newWidth < oldWidth) return\r\n      if (this.left === 0) return\r\n\r\n      this.calculateParent()\r\n\r\n      if (newWidth > this.parent.width - this.left) {\r\n        const newLeft = this.parent.width - newWidth\r\n        this.left = newLeft < 0 ? 0 : newLeft\r\n        this.elem.style.left = `${this.left}px`\r\n      }\r\n    },\r\n\r\n    height (newHeight, oldHeight) {\r\n      if (newHeight < oldHeight) return\r\n      if (this.top === 0) return\r\n\r\n      this.calculateParent()\r\n\r\n      if (newHeight > this.parent.height - this.top) {\r\n        const newTop = this.parent.height - this.height\r\n        this.top = newTop\r\n        this.elem.style.top = `${this.top}px`\r\n      }\r\n    }\r\n  },\r\n  destroyed () {\r\n    window.removeEventListener('resize', this.update)\r\n  },\r\n  mounted () {\r\n    this.isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream\r\n    this.elem = this.$el\r\n\r\n    this.parentElem = (this.parentSelector && document.body.querySelector(this.parentSelector)) || this.elem.parentNode\r\n\r\n    this.calculateArea()\r\n\r\n    if (this.startingPosition) {\r\n      this.currentPosition = this.startingPosition\r\n      this.update()\r\n    }\r\n\r\n    window.addEventListener('resize', this.update)\r\n  },\r\n  methods: {\r\n    iosMove (e) {\r\n      if (this.isIos) this.elementMove(e)\r\n    },\r\n\r\n    elementMove (e) {\r\n      if (this.events.slice(-1)[0] !== 'dragging') {\r\n        this.$emit('dragging')\r\n        this.events.push('dragging')\r\n      }\r\n      \r\n      e.preventDefault()\r\n      if (!e.pageX)\r\n        document.body.style.overflow = 'hidden'\r\n\r\n      const x = e.pageX || e.changedTouches[0].pageX\r\n      const y = e.pageY || e.changedTouches[0].pageY\r\n      let newLeft = x - this.shiftX\r\n      let newTop = y - this.shiftY\r\n      const newRight = x - this.shiftX + this.elem.offsetWidth\r\n      const newBottom = y - this.shiftY + this.elem.offsetHeight\r\n      if (newLeft < 0)\r\n        newLeft = 0\r\n      else if (newRight > this.parent.width)\r\n        newLeft = this.parent.width - this.elem.offsetWidth\r\n      else\r\n        newLeft = x - this.shiftX\r\n\r\n      if (newTop < 0)\r\n        newTop = 0\r\n      else if (newBottom > this.parent.height)\r\n        newTop = this.parent.height - this.elem.offsetHeight\r\n      else\r\n        newTop = y - this.shiftY\r\n\r\n      this.elem.style.left = `${newLeft}px`\r\n      this.left = newLeft\r\n      this.elem.style.top = `${newTop}px`\r\n      this.top = newTop\r\n    },\r\n\r\n    hang (e) {\r\n      this.events = []\r\n      this.events.push('activated')\r\n      this.$emit('activated')\r\n\r\n      this.isDragging = true\r\n      this.calculateParent()\r\n\r\n      this.shiftX = e.pageX\r\n        ? e.pageX - this.elem.offsetLeft\r\n        : e.changedTouches[0].pageX - this.elem.offsetLeft\r\n      this.shiftY = e.pageY\r\n        ? e.pageY - this.elem.offsetTop\r\n        : e.changedTouches[0].pageY - this.elem.offsetTop\r\n\r\n      if (e.pageX) {\r\n        if (this.isIos) {\r\n          this.parentElem.addEventListener('touchmove', this.elementMove)\r\n        } else {\r\n          this.parentElem.addEventListener('mousemove', this.elementMove)\r\n          this.parentElem.addEventListener('mouseleave', this.drop)\r\n        }\r\n      } else {\r\n        this.parentElem.addEventListener('touchmove', this.elementMove)\r\n      }\r\n    },\r\n\r\n    drop () {\r\n      this.$emit('dropped')\r\n\r\n      this.isDragging = false\r\n      document.body.style.overflow = null\r\n      this.parentElem.removeEventListener('mousemove', this.elementMove, false)\r\n      this.parentElem.removeEventListener('touchmove', this.elementMove, false)\r\n      this.parentElem.onmouseup = null\r\n      this.parentElem.ontouchend = null\r\n\r\n      if (this.autoSnap) {\r\n        this.calculateArea()\r\n\r\n        // Top - Left\r\n        if (this.onLeft && this.onTop)\r\n          if (this.getSnapOption('top-left')) this.autoSnapMoveTL()\r\n          else if (this.getSnapOption('top-right')) this.autoSnapMoveTR()\r\n          else if (this.getSnapOption('bottom-left')) this.autoSnapMoveBL()\r\n          else this.autoSnapMoveTL()\r\n\r\n        // Top - Right\r\n        else if (!this.onLeft && this.onTop)\r\n          if (this.getSnapOption('top-right')) this.autoSnapMoveTR()\r\n          else if (this.getSnapOption('top-left')) this.autoSnapMoveTL()\r\n          else if (this.getSnapOption('bottom-right')) this.autoSnapMoveBR()\r\n          else this.autoSnapMoveTL()\r\n\r\n        // Bottom - Left\r\n        else if (this.onLeft && !this.onTop)\r\n          if (this.getSnapOption('bottom-left')) this.autoSnapMoveBL()\r\n          else if (this.getSnapOption('bottom-right')) this.autoSnapMoveBR()\r\n          else if (this.getSnapOption('top-left')) this.autoSnapMoveTL()\r\n          else this.autoSnapMoveTL()\r\n\r\n        // Bottom - Right\r\n        else if (!this.onLeft && !this.onTop)\r\n          if (this.getSnapOption('bottom-right')) this.autoSnapMoveBR()\r\n          else if (this.getSnapOption('bottom-left')) this.autoSnapMoveBL()\r\n          else if (this.getSnapOption('top-right')) this.autoSnapMoveTR()\r\n          else this.autoSnapMoveTL()\r\n      }\r\n    },\r\n\r\n    getSnapOption(option) {\r\n      if (!this.snapOptions[option])\r\n        return false\r\n\r\n      return {\r\n        top: this.snapOptions[option] && this.snapOptions[option].top,\r\n        left: this.snapOptions[option] && this.snapOptions[option].left,\r\n        bottom: this.snapOptions[option] && this.snapOptions[option].bottom,\r\n        right: this.snapOptions[option] && this.snapOptions[option].right\r\n      }\r\n    },\r\n\r\n    autoSnapMoveTL () {\r\n      const left = this.getSnapOption('top-left').left || 0\r\n      const top = this.getSnapOption('top-left').top || 0\r\n\r\n      this.moveLeft(left)\r\n      this.moveTop(top)\r\n    },\r\n\r\n    autoSnapMoveTR () {\r\n      const right = this.getSnapOption('top-right').right || 0\r\n      const top = this.getSnapOption('top-right').top || 0\r\n\r\n      this.moveLeft(this.parent.width - this.elem.offsetWidth - right)\r\n      this.moveTop(top)\r\n    },\r\n\r\n    autoSnapMoveBL () {\r\n      const left = this.getSnapOption('bottom-left').left || 0\r\n      const bottom = this.getSnapOption('bottom-left').bottom || 0\r\n\r\n      const r = this.parent.height - this.elem.offsetHeight - bottom\r\n\r\n      this.moveLeft(left)\r\n      this.moveTop(r)\r\n    },\r\n\r\n    autoSnapMoveBR () {\r\n      const right = this.getSnapOption('bottom-right').right || 0\r\n      const bottom = this.getSnapOption('bottom-right').bottom || 0\r\n\r\n      const l = this.parent.width - this.elem.offsetWidth - right\r\n      const r = this.parent.height - this.elem.offsetHeight - bottom\r\n\r\n      this.moveLeft(l)\r\n      this.moveTop(r)\r\n    },\r\n\r\n    moveLeft (left) {\r\n      this.left = left\r\n      this.elem.style.left = `${left}px`\r\n    },\r\n\r\n    moveTop (top) {\r\n      this.top = top\r\n      this.elem.style.top = `${top}px`\r\n    },\r\n\r\n    calculateParent () {\r\n      this.parent.width = this.parentWidth || (this.parentSelector && document.body.querySelector(this.parentSelector) &&document.body.querySelector(this.parentSelector).offsetWidth) || this.elem.parentNode.offsetWidth\r\n      this.parent.height = this.parentHeight || (this.parentSelector && document.body.querySelector(this.parentSelector) &&document.body.querySelector(this.parentSelector).offsetHeight) || this.elem.parentNode.offsetHeight\r\n    },\r\n\r\n    calculateArea () {\r\n      this.onLeft = this.left + this.elem.offsetWidth / 2 < this.parent.width / 2\r\n      this.onTop = this.top + this.elem.offsetHeight / 2 < this.parent.height / 2\r\n\r\n      if (this.onLeft && this.onTop)\r\n        this.currentPosition = 'TL'\r\n      else if (!this.onLeft && this.onTop)\r\n        this.currentPosition = 'TR'\r\n      else if (this.onLeft && !this.onTop)\r\n        this.currentPosition = 'BL'\r\n      else if (!this.onLeft && !this.onTop)\r\n        this.currentPosition = 'BR'\r\n    },\r\n\r\n    changePosition (position) {\r\n      const positions = ['TL', 'TR', 'BL', 'BR']\r\n      this.currentPosition = positions.includes(position) ? position : 'TL'\r\n      this.update()\r\n    },\r\n\r\n    update () {\r\n      this.calculateParent()\r\n      if (this.currentPosition)\r\n        this['autoSnapMove' + this.currentPosition]()\r\n    }\r\n  }\r\n}\r\n</script>\r\n\r\n<style scoped>\r\n.drag-drop-snap {\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  z-index: 9;\r\n  cursor: move;\r\n}\r\n\r\n.drag-drop-snap.with-style {\r\n  width: 8em;\r\n  height: 4.5em;\r\n  background: #ccc;\r\n  border-radius: 2em;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\r\n}\r\n\r\n.drag-drop-snap.active {\r\n  visibility: visible;\r\n}\r\n\r\n.drag-drop-snap.dropped.with-animation {\r\n  transition: left 500ms, top 500ms;\r\n  transition-timing-function: cubic-bezier(0.35, 1.16, 0.63, 1.17), cubic-bezier(0.35, 1.16, 0.63, 1.17);\r\n}\r\n</style>\r\n"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-4efc33f3";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "C:\\Users\\Enes\\Desktop\\çalışmalar\\vue-drag-drop-snap\\src\\DragDropSnap.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) { component.functional = true; }
    }

    component._scopeId = scope;

    {
      var hook;
      if (style) {
        hook = function(context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook !== undefined) {
        if (component.functional) {
          // register for functional component in vue file
          var originalRender = component.render;
          component.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context)
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = component.beforeCreate;
          component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }
    }

    return component
  }
  /* style inject */
  function __vue_create_injector__() {
    var head = document.head || document.getElementsByTagName('head')[0];
    var styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
    var isOldIE =
      typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

    return function addStyle(id, css) {
      if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

      if (!style.ids.includes(id)) {
        var code = css.source;
        var index = style.ids.length;

        style.ids.push(id);

        if (isOldIE) {
          style.element = style.element || document.querySelector('style[data-group=' + group + ']');
        }

        if (!style.element) {
          var el = style.element = document.createElement('style');
          el.type = 'text/css';

          if (css.media) { el.setAttribute('media', css.media); }
          if (isOldIE) {
            el.setAttribute('data-group', group);
            el.setAttribute('data-next-index', '0');
          }

          head.appendChild(el);
        }

        if (isOldIE) {
          index = parseInt(style.element.getAttribute('data-next-index'));
          style.element.setAttribute('data-next-index', index + 1);
        }

        if (style.element.styleSheet) {
          style.parts.push(code);
          style.element.styleSheet.cssText = style.parts
            .filter(Boolean)
            .join('\n');
        } else {
          var textNode = document.createTextNode(code);
          var nodes = style.element.childNodes;
          if (nodes[index]) { style.element.removeChild(nodes[index]); }
          if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
          else { style.element.appendChild(textNode); }
        }
      }
    }
  }
  /* style inject SSR */
  

  
  var component = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    __vue_create_injector__,
    undefined
  );

// Import vue component

// install function executed by Vue.use()
function install(Vue) {
  if (install.installed) { return }
  install.installed = true;
  Vue.component('DragDropSnap', component);
}

// Create module definition for Vue.use()
var plugin = {
  install: install,
};

// To auto-install when vue is found
/* global window global */
var GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default component;
