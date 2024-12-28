import type { TextProps } from '@/types'

export function setTextState(textProps: TextProps, text: string) {
    textProps.state = text
}
