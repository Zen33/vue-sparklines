export default () => {
  const characters = '0123456789ABCDEF'
  let color = '#'
  let i = 0

  for (; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)]
  }
  return color
}
