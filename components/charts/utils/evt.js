export default (mouseEvents, data, p) => {
  const evts = {}

  if (typeof mouseEvents === 'function') {
    ['enter', 'leave', 'up', 'down', 'move', 'over'].map(evt => {
      return evts[`mouse${evt}`] = () => mouseEvents(`mouse${evt}`, data, p)
    })
  }
  return evts
}
