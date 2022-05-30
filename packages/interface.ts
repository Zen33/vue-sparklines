import type { Ref, VNode } from 'vue'

export interface SetValueArgs {
  id: string
  color: string
  data: number[]
  points: Point[]
  limit: number | string
  type: string
}
export interface Point {
  x: number
  y: number
}
export interface SparkEvent extends MouseEvent {
  ox: number
  oy: number
  cx: number
  cy: number
}
export interface EventBus {
  updateValue: (value: SetValueArgs) => void
  setStatus: (status?: boolean) => void
  tooltip: Ref<HTMLElement | null>
  isFocusing: Ref<boolean>
  svgMouseEvt: Ref<boolean>
}
export interface Pie {
  value: number
  color: string
}
export interface Props {
  [key: string]: unknown
}
export interface SpotType {
  props: Props
  items: VNode[]
  point: Point
  i: number
  hasSpotlight: boolean
}
export interface RefLine {
  value: number | null
}
export interface Tooltip {
  formatter: (args: unknown) => string
}
