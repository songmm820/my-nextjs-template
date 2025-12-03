import 'server-only'

/**
 * 生成验证码
 *
 * @param len 验证码长度
 */
export async function generateCaptchaCode(len: number): Promise<string> {
  const chars: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/**
 * 生成随机颜色
 */
function randomColor(): string {
  const colors: Array<string> = ['#2563eb', '#dc2626', '#059669', '#7c3aed', '#ea580c']
  return colors[Math.floor(Math.random() * colors.length)]
}

type CaptchaSvgOptions = {
  width?: number
  height?: number
  fontSize?: number
  backgroundColor?: string
}

/**
 * 生成验证码图片
 *
 * @param captcha 验证码
 * @param options 配置
 */
export async function generateCaptchaImage(
  captcha: string,
  options?: CaptchaSvgOptions
): Promise<string> {
  const { width = 120, height = 40, fontSize = 24, backgroundColor = '#f9fafb' } = options || {}

  // 生成干扰线
  const noiseLines = Array.from({ length: 5 }, () => {
    const x1 = Math.random() * width
    const y1 = Math.random() * height
    const x2 = Math.random() * width
    const y2 = Math.random() * height
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e5e7eb" stroke-width="1" opacity="0.7"/>`
  }).join('')

  // 生成干扰点
  const noiseDots = Array.from({ length: 50 }, () => {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 2
    return `<circle cx="${x}" cy="${y}" r="${size}" fill="#9ca3af" opacity="0.5"/>`
  }).join('')

  const charsSvg = captcha
    .split('')
    .map((char, i) => {
      const charWidth = width / captcha.length
      const x = charWidth * i + charWidth / 2
      const y = height / 2 + fontSize / 4
      const rotate = (Math.random() - 0.5) * 30

      return `<text x="${x}" y="${y}" 
              font-size="${fontSize}" 
              font-family="Arial, sans-serif" 
              font-weight="bold"
              fill="${randomColor()}" 
              text-anchor="middle"
              dominant-baseline="middle"
              transform="rotate(${rotate} ${x} ${y})">${char}</text>`
    })
    .join('')

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${backgroundColor}"/>
    ${noiseLines}
    ${noiseDots}
    ${charsSvg}
  </svg>`
}
