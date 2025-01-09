import { defineStore } from 'pinia'
import {
    setTextState,
    addOption,
    removeOption,
    updateCurrentState,
    setPicLinkByIndex,
    toggleType
} from './common-actions'
import textNodeDefaultStatus from '@/configs/default-status/text-node'
import { emitter, isQuestionType } from '@/utils'
import { insertSurveryData } from '@/db/operation'
import type { BaseBusinessComp, SurveyDBData } from '@/types'

interface IEditorState {
    currentCompIndex: number
    comps: BaseBusinessComp[]
}

const initComps = () => {
    const textNodeStatus1 = textNodeDefaultStatus()
    textNodeStatus1.editCompConfig.type.currentStage = 0
    textNodeStatus1.editCompConfig.title.state = '游戏满意度问卷调查'

    const textNodeStatus2 = textNodeDefaultStatus()
    textNodeStatus2.editCompConfig.desc.state = `为了给您提供更好的服务，希望您抽出几分钟的时间，将您的感受和建议告诉我们，我们会充分考虑您的意见，不断改进。期待您的参与！`

    return [textNodeStatus1, textNodeStatus2]
}

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            currentCompIndex: -1, // 当前选中的组件。即问卷画布中选中的组件
            comps: initComps() // 问卷画布中的题目数组
        } as IEditorState
    },
    actions: {
        setTextState,
        addOption,
        removeOption,
        updateCurrentState,
        setPicLinkByIndex,
        toggleType,
        addComp(comp: BaseBusinessComp) {
            this.comps.push(comp)
            this.currentCompIndex = -1 // 推入后，将选中组件置空
            emitter.emit('scrollToBottom')
        },
        removeComp(index: number) {
            this.comps.splice(index, 1)
            this.setCurrentCompIndex(-1)
        },
        resetComps() {
            this.comps = initComps()
            this.setCurrentCompIndex(-1)
        },
        async saveComp(data: SurveyDBData) {
            await insertSurveryData(data)
        },
        setStore(comps: BaseBusinessComp[]) {
            this.comps = comps
        },
        setCurrentCompIndex(index: number) {
            this.currentCompIndex = index
        }
    },
    getters: {
        // 题目数量
        surveyCount: (state: IEditorState): number => {
            let count = 0
            state.comps.forEach(comp => {
                if (isQuestionType(comp.name)) {
                    count++
                }
            })
            return count
        }
    }
})

export type EditorStoreInstance = ReturnType<typeof useEditorStore>
