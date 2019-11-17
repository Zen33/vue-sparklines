import MaxZIndex from './mixins'

export default {
  name: 'sparkline-pie',
  mixins: [MaxZIndex],
  props: {
    data: {
      type: Array,
      default: () => []
    },
    width: {
      type: [Number, String],
      default: 100
    },
    height: {
      type: [Number, String],
      default: 30
    },
    margin: {
      type: Number,
      default: 3
    },
    styles: {
      type: Object,
      default: () => ({})
    },
    indicatorStyles: {
      type: [Object, Boolean],
      default: () => ({
        stroke: 'red'
      })
    },
    tooltipProps: {
      type: Object,
      default: () => ({
        formatter () {
          return null
        }
      })
    },
    tooltipStyles: {
      type: Object,
      default: () => ({
        position: 'absolute',
        display: 'none',
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '3px',
        minWidth: '30px',
        padding: '3px',
        color: '#fff',
        fontSize: '12px'
      })
    }
  },
  data () {
    return {
      onFocus: false
    }
  },
  watch: {
    data () {
      this.onFocus && this.hideTooltip()
    }
  },
  methods: {
    hideTooltip () {
      const tooltip = this.$parent.$refs.sparklineTooltip

      tooltip && (tooltip.style.display = 'none')
    },
    showTooltip (evt, value, color) {
      const tooltip = this.$parent.$refs.sparklineTooltip

      tooltip && (tooltip.style.display = '')

      const leeway = tooltip.getBoundingClientRect()
      const tooltipContent = `<span style="color:${color};">&bull;</span>&nbsp;${value}<br />`

      if (leeway) {
        tooltip.style.left = `${evt.clientX + leeway.width * .25}px`
        tooltip.style.top = `${evt.clientY - leeway.height}px`
        tooltip.style.zIndex = this.zIndex
        try {
          tooltip.innerHTML = this.tooltipProps.formatter({ value, color}) || tooltipContent
        } catch (e) {
          return (tooltip.innerHTML = tooltipContent)
        }
      }
    }
  },
  render (h) {
    const {
      data = [],
      width,
      height,
      // margin,
      styles,
      // tooltipProps,
      indicatorStyles
    } = this

    if (!data.length) {
      return null
    }
    const center = Math.min(width / 2, height / 2)
    const strokeWidth = styles && styles.strokeWidth || 0
    const radius = center - strokeWidth / 2
    // const radius = center - margin
    let prevPieNumbers = 0

    for (let slot of this.$parent.$slots.default) {
      (slot.tag === 'sparklinePie') && prevPieNumbers++
    }
    if (prevPieNumbers > 1) {
      return null
    }

    const total = Math.ceil(data.reduce((a, b) => (b.hasOwnProperty('value') ? b.value : b) + a, 0))
    let angleStart = 0
    let angleEnd = 0
    // const startX = center + (prevPieNumbers > 1 ? prevPieNumbers - 1 : 0) * (radius + margin * 2)
    const startX = center

    return h('g', {
      attrs: {
        // transform: `translate(0, 0)`
      }
    }, (() => {
      const items = []

      if (data.length === 1) {
        items.push(h('ellipse', {
          style: styles,
          attrs: {
            cx: startX,
            cy: center,
            rx: radius,
            ry: radius,
            fill: data[0].color
          },
          on: {
            mousemove: evt => {
              this.onFocus = true
              indicatorStyles && this.showTooltip(evt, data[0].value, data[0].color)
            },
            mouseleave: () => {
              this.onFocus = false
              this.hideTooltip()
            }
          }
        }))
      } else {
        data.map((d, i) => {
          const value = d.hasOwnProperty('value') ? d.value : d
          const isLarge = value / total > 0.5
          const angle = 360 * value / total

          angleStart = angleEnd
          angleEnd = angleStart + angle

          const x1 = startX + radius * Math.cos(Math.PI * angleStart / 180)
          const y1 = center + radius * Math.sin(Math.PI * angleStart / 180)
          const x2 = startX + radius * Math.cos(Math.PI * angleEnd / 180)
          const y2 = center + radius * Math.sin(Math.PI * angleEnd / 180)
          const path = `M${startX},${center} L${x1},${y1} A${radius},${radius} 0 ${isLarge ? 1 : 0},1 ${x2},${y2} Z`
          const color = d.hasOwnProperty('color') ? d.color : (styles && styles.fill || '#000')

          items.push(h('path', {
            style: styles,
            attrs: {
              fill: color,
              d: path
            },
            props: {
              key: i
            },
            on: {
              mousemove: evt => {
                this.onFocus = true
                indicatorStyles && this.showTooltip(evt, value, color)
              },
              mouseleave: () => {
                this.onFocus = false
                this.hideTooltip()
              }
            }
          }))
        })
      }
      return items
    })())
  }
}
