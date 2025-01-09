import { defineStore } from 'pinia'
import {
    setTextState,
    addOption,
    removeOption,
    updateCurrentState,
    setPicLinkByIndex,
    toggleType
} from './common-actions'
import { emitter, isQuestionType } from '@/utils'
import type { BaseBusinessComp, SurveyDBData } from '@/types'
import { insertSurveryData } from '@/db/operation'

interface IEditorState {
    currentCompIndex: number
    comps: BaseBusinessComp[]
}

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            currentCompIndex: -1, // 当前选中的组件。即问卷画布中选中的组件
            comps: [] // 问卷画布中的题目数组
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
            this.comps = []
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
