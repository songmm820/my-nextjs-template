import { type UserExpOutputType } from '~/types/user-api'

type CalcLevelResultType = UserExpOutputType & {}

/**
 * 根据经验值计算当前等级，等级从1开始，第一级经验为0-100 ，第二级经验为101-250，每新增一级经所需升级的验值增加150
 *
 * @param xp 等级 当前等级以获得经验值 dang'qi'a'd'na
 */
export const calculateLevelExp = (xp: number): CalcLevelResultType => {
  // 第一级经验为0-100 ，第二级经验为101-250，每新增一级经所需升级的验值增加150
  if (xp <= 100) {
    return {
      level: 0,
      exp: xp,
      maxExp: 100
    }
  }
  let remainingExp = xp - 100 // 扣除第一级的100经验
  let level = 1
  let needExpForNext = 150
  // 从等级2开始循环判断
  while (remainingExp > 0) {
    if (remainingExp <= needExpForNext) {
      // 经验不足以升级，停留在当前等级
      return {
        level: level + 1,
        exp: remainingExp,
        maxExp: needExpForNext
      }
    }
    // 经验足够，升级
    remainingExp -= needExpForNext
    level++
    needExpForNext += 150
  }
  return {
    level: level,
    exp: remainingExp,
    maxExp: needExpForNext
  }
}
