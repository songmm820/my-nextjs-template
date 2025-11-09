/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps, ComponentType, ElementType, JSXElementConstructor } from 'react'

/**
 * 提取任意 React 组件的 Props 类型
 * 函数组件、class 组件、ForwardRef、Memo、第三方库组件 全部支持
 */
export type GetProps<T extends ElementType | ComponentType<any> | JSXElementConstructor<any>> = ComponentProps<T>
