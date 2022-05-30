import {
  defineComponent,
  h,
  ref,
  onMounted
} from 'vue'
import { textProps as props } from './props'

export default defineComponent({
  name: 'Text',
  inheritAttrs: false,
  props,
  setup (props) {
    const sparklineText = ref<SVGGraphicsElement | null>(null)

    onMounted(() => {
      const text = sparklineText.value
      const textBox = text && text.getBBox()
  
      if (textBox) {
        text.setAttribute('x', `${textBox.x - textBox.width / 2}`)
        text.setAttribute('y', `${props.margin + textBox.height / 2}`)
      }
    })
  },
  render () {
    const { point, text, textStyles } = this
    const { x, y } = point

    return h('g', [
      h('text', {
        style: textStyles,
        x,
        y,
        ref: 'sparklineText'
      }, text)
    ])
  }
})
