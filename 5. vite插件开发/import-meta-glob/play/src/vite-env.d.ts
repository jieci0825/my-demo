/// <reference types="vite/client" />

interface ImportMeta {
    jcGlob<T>(glob: string): Record<string, () => Promise<T>>
}
