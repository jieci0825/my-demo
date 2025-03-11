/// <reference types="vite/client" />

interface ImportMeta {
    // 重载
    //  - 第一个重载表示默认的行为
    jcGlob<T>(glob: string | string[], options?: GlobOptins<false>): Record<string, () => Promise<T>>
    jcGlob<T>(glob: string | string[], options?: GlobOptins<true>): Record<string, T>
    // jcGlob<T, Eager extends boolean = boolean>(
    //     glob: string | string[],
    //     options?: GlobOptins<Eager>
    // ): Eager extends true ? Record<string, T> : Record<string, () => Promise<T>>
}

interface GlobOptins<Eager extends boolean> {
    as?: string
    eager?: Eager
}
