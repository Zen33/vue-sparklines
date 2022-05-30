import { h } from 'vue'
import type { SpotType } from '../interface'
import Text from '../Text'

const useSpotCheck = () => {
  const checkSpotType = ({
    props,
    items,
    point,
    i,
    hasSpotlight
  }: SpotType) => {
    if (!props.hasSpot && !hasSpotlight) {
      return true
    }
    if (!props.hasSpot && props.spotlight === i) {
      items.push(h(Text, {
        ...props,
        text: `${props.data[props.spotlight]}`,
        point
      }))
      return true
    }
    return false
  }

  return { checkSpotType }
}

export default useSpotCheck
