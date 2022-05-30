const SIZE = 256
let idx = SIZE
const hex: string[] = []
let buffer: string

while (idx--) hex[idx] = (idx + SIZE).toString(16).substring(1)

export default (len?: number) => {
  const tmp = len || 11
  let i = 0

	if (!buffer || ((idx + tmp) > SIZE * 2)) {
		for (buffer = '', idx = 0; i < SIZE; i++) {
			buffer += hex[Math.random() * SIZE | 0]
		}
	}

	return buffer.substring(idx, idx++ + tmp)
}
