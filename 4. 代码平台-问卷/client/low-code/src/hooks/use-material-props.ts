import { computed } from 'vue'
import type { OptionEditCompStatus } from '@/types'

interface MaterialHeaderProps {
    editCompConfig: OptionEditCompStatus
    sn: number
}

export function useMaterialProps(props: MaterialHeaderProps) {
    const { editCompConfig, sn } = props

    const alignClassMap: any = {
        0: '',
        1: 'text-center',
        2: 'text-right'
    }

    const computedState = computed(() => {
        const {
            title,
            desc,
            options,
            position,
            titleSize,
            descSize,
            titleBold,
            descBold,
            titleSlant,
            descSlant,
            titleColor,
            descColor
        } = editCompConfig
        return {
            title: title.state,
            desc: desc.state,
            options: options.state,
            position: position.currentStage,
            titleSize: titleSize.state[titleSize.currentStage],
            descSize: descSize.state[descSize.currentStage],
            isTitleBold: !!titleBold.currentStage,
            isDescBold: !!descBold.currentStage,
            isTitleSlant: !!titleSlant.currentStage,
            isDescSlant: !!descSlant.currentStage,
            titleColor: titleColor.state,
            descColor: descColor.state
        }
    })

    const materialHeaderProps = computed(() => {
        const {
            title,
            desc,
            titleSize,
            descSize,
            isTitleBold,
            isDescBold,
            isDescSlant,
            isTitleSlant,
            titleColor,
            descColor
        } = computedState.value
        return {
            sn,
            title,
            desc,
            titleSize,
            descSize,
            isTitleBold,
            isDescBold,
            isDescSlant,
            isTitleSlant,
            titleColor,
            descColor
        }
    })

    return {
        computedState,
        materialHeaderProps,
        alignClassMap
    }
}
