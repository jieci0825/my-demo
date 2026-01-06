export const myButtonVariants = [
    'primary',
    'secondary',
    'danger',
    'outline',
    'ghost',
    'link'
] as const

export type MyButtonVariant = (typeof myButtonVariants)[number]

export type NativeButtonType = 'button' | 'submit' | 'reset'

export interface MyButtonProps {
    variant?: MyButtonVariant
    loading?: boolean
    disabled?: boolean
    asChild?: boolean
    nativeType?: NativeButtonType
}

export type MyButtonEmits = {
    (e: 'click', evt: MouseEvent): void
}

export interface MyButtonExpose {}

type _MyButtonPublicInstance =
    import('vue').ComponentPublicInstance<MyButtonProps>

export type MyButtonInstance = _MyButtonPublicInstance & {
    $emit: MyButtonEmits
}
