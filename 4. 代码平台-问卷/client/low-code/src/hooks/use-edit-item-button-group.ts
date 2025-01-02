import ButtonGroup from '@/components/survey-comps/edit-items/button-group.vue'
import { computed, inject } from 'vue'
import { UPDATE_STATE } from '@/constants'
import { isEmpty } from 'element-plus/es/utils/types.mjs'
import { isValueStateArr } from '@/types'
import { isArrayString } from '@/utils'

interface EditItemButtonGroupProps {
    editConfKey: string
    state: any
    icons?: string[]
    title: string
    currentStage?: number
    id: string
    isShow: boolean
}

export function useEditItemButtonGroup(props: EditItemButtonGroupProps) {
    const updateState = inject(UPDATE_STATE)

    const innerValue = computed({
        get() {
            return isEmpty(props.currentStage) ? props.state : props.currentStage
        },
        set(val) {
            updateState && updateState(props.editConfKey, val)
        }
    })

    const text = computed<string>(() => {
        if (isValueStateArr(props.state)) {
            return props.state[props.currentStage!].state
        } else if (isArrayString(props.state)) {
            return props.state[props.currentStage!]
        } else {
            return props.state
        }
    })

    const buttonGroupProps = computed(() => {
        return {
            label: props.title,
            text: text.value
        }
    })

    return {
        ButtonGroup,
        innerValue,
        buttonGroupProps,
        updateState
    }
}
