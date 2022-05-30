export const defaultLineStyle = {
  stroke: 'slategray',
  strokeWidth: 1,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
  fill: 'none'
}
export const defaultFillStyle = {
  stroke: 'none',
  strokeWidth: 0,
  fillOpacity: .1,
  fill: 'none'
}
export const defaultTooltipStyle = {
  display: 'none',
  background: 'rgba(0, 0, 0, 0.6)',
  borderRadius: '3px',
  minWidth: '30px',
  padding: '3px',
  color: '#fff',
  fontSize: '12px'
}
export const defaultSpotProps = {
  size: 3,
  spotColors: {
    '-1': '#dd2c00',
    '0': '#ffab00',
    '1': '#00c853'
  }
}
export const refLineTypes = ['max', 'min', 'mean', 'avg', 'median', 'custom']
