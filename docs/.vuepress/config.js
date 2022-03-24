const sidebar = require('./sidebar')

module.exports = {
  base: '/vue-drag-drop-snap/',
  title: 'Vue Drag-Drop-Snap',
  description: 'Vue.js drag-drop-snap component',
  themeConfig: {
    displayAllHeaders: false,

    sidebar,
    nav: [
      { text: 'Github', link: 'https://github.com/mrfade/vue-drag-drop-snap' }
    ]
  }
}
