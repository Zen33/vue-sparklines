export default (data: number[]) => data.sort((a, b) => a - b)[Math.floor(data.length / 2)]
