import ButtonGroup from '@/components/survey-comps/edit-items/button-group.vue'
import { computed, inject } from 'vue'
import { UPDATE_STATE } from '@/constants'
import { isEmpty } from 'element-plus/es/utils/types.mjs'

interface EditItemButtonGroupProps {
    editConfKey: string
    state: string | Array<string>
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

    const buttonGroupProps = computed(() => {
        return {
            label: props.title,
            text: isEmpty(props.currentStage) ? (props.state as string) : props.state[props.currentStage!]
        }
    })

    return {
        ButtonGroup,
        innerValue,
        buttonGroupProps
    }
}
