/**
 * @description: 用于处理一些纯类型工具（无运行时逻辑）​
 * @example: export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
 */

/**
 * 将对象转换为键值对数组
 * @description 约束 key，且根据 key 自动推导这个 key 对应 value 的类型，即联合类型。如：["isDark", boolean] | ["theme", "light" | "dark"];
 */
export type ObjToKeyValueArray<T> = {
    [K in keyof T]: [K, T[K]]
}[keyof T]
