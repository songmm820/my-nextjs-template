/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 这个类型工具会从一个 React 组件类型 T 中提取它的 props 类型。
 * 如果 T 是一个 React 组件类型，它会提取组件的 props 类型 P。
 * 如果 T 是一个对象类型（不是 React 组件类型），它会直接返回这个对象类型。
 * 如果 T 既不是 React 组件类型也不是对象类型，则返回 `ne  ver`。
 */
export type GetProps<T extends React.ComponentType<any> | object> = T extends React.ComponentType<infer P>
    ? P
    : T extends object
    ? T
    : never

/**
 * 这个类型工具会提取给定组件类型 T 中某个特定属性 PropName 的类型。
 * 它从 `GetProps<T>` 中提取该属性的类型，然后通过 `NonNullable` 使其不能为 `null` 或 `undefined`。
 * 例如，`T` 是一个 React 组件类型，`PropName` 是该组件的一个 props 名称。
 * 它返回该属性类型，但排除 `null` 和 `undefined`。
 */
export type GetProp<T extends React.ComponentType<any> | object, PropName extends keyof GetProps<T>> = NonNullable<
    GetProps<T>[PropName]
>

/** 通过内置的 `ReturnType` 类型工具，提取一个函数类型 `T` 的返回值类型。 */
export type GetReturnType<T extends (...args: any[]) => any> = ReturnType<T>

/**
 * 通过 `T[PropName]` 获取对象类型 `T` 中某个属性 `PropName` 的类型。
 */
export type GetPropType<T, PropName extends keyof T> = T[PropName]

/** 获取数组类型 T 的元素类型。 */
export type GetArrayItemType<T extends any[]> = T[number]

/**
 * 获取 Promise 类型解析后的结果类型
 * 通过条件类型判断，如果 `T` 是一个 Promise 类型，则返回其解析结果的类型；
 * 否则返回原始类型 `T`。
 */
export type GetPromiseType<T> = T extends Promise<infer U> ? U : T

/** 获取函数某个参数的类型 */
export type GetFunctionParameterType<T extends (...args: any[]) => any, K extends number> = T extends (
    ...args: infer P
) => any
    ? P[K]
    : never

/** 获取函数参数列表 */
export type GetFunctionParametersType<T extends (...args: any[]) => any> = T extends (...args: infer P) => any
    ? P
    : never

/** 获取组件的Ref类型 */
export type GetRefType<T extends React.ComponentType<any>> = GetProp<T, 'ref'>

/** 获取一个函数的完整类型 */
export type GetFunctionType<T extends (...args: any[]) => any> = T
