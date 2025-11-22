// 渐变颜色数组
export const gradientColorList = [
    'linear-gradient( 180deg, #5433FF 0%, #20BDFF 50%, #A5FECB 100%)',
    'linear-gradient( 180deg, #9796F0 0%, #FBC7D4 100%)',
    'linear-gradient( 180deg, #1FA2FF 0%, #12D8FA 50%, #A6FFCB 100%)',
    'linear-gradient( 180deg, #00C6FF 0%, #0072FF 100%)',
    'linear-gradient( 90deg, #EE9CA7 0%, #FFDDE1 100%)',
    'linear-gradient( 180deg, #F56464 0%, #FFE6E6 100%)',
    'linear-gradient( 180deg, #34D399 0%, #6EE7B7 50%, #E4FFF3 100%)',
    'linear-gradient( 180deg, #FF5F6D 0%, #FFC371 100%)',
    'linear-gradient( 249deg, #FFBBFF 0%, #DB54FF 50%, #6B46DB 100%)',
    'linear-gradient( 180deg, #63ACFA 0%, #7FF9F9 50%, #FDFFA2 100%)',
    'linear-gradient( 270deg, #FF0404 0%, #FA9121 100%)',
    'linear-gradient( 270deg, #00BEFE 0%, #0076FF 100%)',
    'linear-gradient( 270deg, #DBF3F0 0%, #70B5B0 100%)',
    'linear-gradient( 270deg, #D5D9FF 0%, #737ACD 100%)',
    'linear-gradient( 270deg, #F8CEF2 0%, #E17BD4 100%)',
    'linear-gradient( 135deg, #9DE5FF 0%, #FAD4FF 50%, #FFF7D4 100%)',
    'linear-gradient( 139deg, #A2BAF6 0%, #FEB0D7 50%, #FCE1D0 100%)',
    'linear-gradient( 287deg, #BDF7FD 0%, #F6C8FF 50%, #81B6FD 100%)',
    'linear-gradient( 288deg, #F9FFA3 0%, #B0FED9 50%, #5ADEFF 100%)',
    'linear-gradient( 108deg, #FB91B5 0%, #CB6CEB 50%, #6DC9FF 100%)'
]

// 主色
export const PRIMARY_COLORS = [
    '#EF4444',
    '#F43F5E',
    '#FB7185',
    '#EC4899',
    '#D946EF',
    '#A78BFA',
    '#A855F7',
    '#8A43E1',
    '#6366F1',
    '#5E1FE7',

    '#FF6C06',
    '#FF8B2C',
    '#FFA40B',
    '#FFBD22',
    '#60A5FA',
    '#458CFF',
    '#009DFF',
    '#0793C6',
    '#2F54EB',
    '#0C2EB6',

    '#06B6D4',
    '#09BDEF',
    '#14B8A6',
    '#36CFC9',
    '#34D399',
    '#22C55E',
    '#84CC16',
    '#81DE4B',
    '#C9EE41',
    '#07A065'
] as const

// 副色
export const SECONDARY_COLORS = [
    '#FECACA',
    '#FFDDDF',
    '#FFE9EA',
    '#FCE7F3',
    '#F9E5FF',
    '#DDD6FE',
    '#F3E8FF',
    '#EDE9FE',
    '#E0E7FF',
    '#D5C9F0',

    '#FFD5A4',
    '#FFE4C6',
    '#FDE68A',
    '#FFF5AC',
    '#BFDBFE',
    '#DBEAFE',
    '#D4F1FF',
    '#E6F5FF',
    '#C3D8FF',
    '#A1AFE7',

    '#CFFAFE',
    '#A5F3FC',
    '#CCFBF1',
    '#DFF9F5',
    '#A7F3D0',
    '#DCFCE7',
    '#ECFCCB',
    '#E1FBCA',
    '#F4FFB8',
    '#B2EAD4'
] as const

/**
 * 获取css变量颜色值
 *
 * @param color css变量名
 */
export function getCssVarColorValue(color: string): string {
    const styles = getComputedStyle(document.documentElement)
    return styles.getPropertyValue(color).trim()
}
