import { computed } from 'vue'
import {
    isOptionEditCompStatusObject,
    isTypeEditCompStatusObject,
    type BaseEditCompStatus,
    type OptionEditCompStatus,
    type TypeEditCompStatus
} from '@/types'

interface MaterialHeaderProps<T> {
    editCompConfig: T
    sn: number | null
}

export function useMaterialProps<T extends BaseEditCompStatus>(props: MaterialHeaderProps<T>) {
    const alignClassMap: any = {
        0: '',
        1: 'text-center',
        2: 'text-right'
    }

    const computedState = computed(() => {
        const {
            title,
            desc,
            position,
            titleSize,
            descSize,
            titleBold,
            descBold,
            titleSlant,
            descSlant,
            titleColor,
            descColor
        } = props.editCompConfig

        interface MaterialProps {
            title: string
            desc: string
            position: number
            titleSize: string
            descSize: string
            isTitleBold: boolean
            isDescBold: boolean
            isTitleSlant: boolean
            isDescSlant: boolean
            titleColor: string
            descColor: string
            options?: OptionEditCompStatus['options']['state']
            type?: TypeEditCompStatus['type']['currentStage']
        }

        const base: MaterialProps = {
            title: title.state,
            desc: desc.state,
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

        if (isOptionEditCompStatusObject(props.editCompConfig)) {
            base.options = props.editCompConfig.options.state
        } else if (isTypeEditCompStatusObject(props.editCompConfig)) {
            base.type = props.editCompConfig.type.currentStage
        }

        return base
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
            sn: props.sn,
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
