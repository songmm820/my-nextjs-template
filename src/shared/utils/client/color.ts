/**
 * 获取css变量颜色值
 *
 * @param color css变量名
 */
export function getCssVarColorValue(color: string): string {
  const styles = getComputedStyle(document.documentElement)
  return styles.getPropertyValue(color).trim()
}
