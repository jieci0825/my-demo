/// <reference types="vite/client" />

interface ImportMeta {
    jcGlob<T>(glob: string | string[]): Record<string, () => Promise<T>>
}
