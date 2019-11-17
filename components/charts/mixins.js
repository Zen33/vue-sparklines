export default {
  computed: {
    zIndex () {
      const domNodes = document.getElementsByTagName('*')

      let maxZIndex = null
      const len = domNodes.length

      for (let i = 0; i < len; i++) {
        const zIndex = parseInt(getComputedStyle(domNodes[i], null).getPropertyValue('z-index'), 10)

        if (maxZIndex === null && typeof zIndex === 'number' && !isNaN(zIndex)) {
          maxZIndex = zIndex
        } else if (!isNaN(zIndex) && zIndex > maxZIndex) {
          maxZIndex = zIndex
        }
      }
      return ++maxZIndex
    }
  }
}