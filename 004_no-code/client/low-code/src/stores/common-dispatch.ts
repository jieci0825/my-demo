import { extend, isBoolean, isNumber, isObjectWithKeys, isString } from '@/utils'
import { ElMessage } from 'element-plus'
import { setUse } from '@/stores/common-actions'
import type { OptionEditCompStatus, PicLink, TypeEditCompStatus, FullEditCompStatus } from '@/types'
import type { MaterialStoreInstance, EditorStoreInstance } from '@/types'
import type { ComputedRef } from 'vue'

export interface DispatchStatusOptions {
    isPass: () => boolean
}

export const dispatchStatus = (
    store: MaterialStoreInstance | EditorStoreInstance,
    currentEditCompStatusConfig: ComputedRef<FullEditCompStatus>,
    options?: Partial<DispatchStatusOptions>
) => {
    const defaultOptions: DispatchStatusOptions = {
        isPass: () => true
    }
    const config = extend(defaultOptions, options || {})

    return function (confKey: string, payload?: string | number | boolean | PicLink) {
        if (!config.isPass()) return

        switch (confKey) {
            case 'title':
            case 'desc':
            case 'titleColor':
            case 'descColor':
                if (isString(payload)) {
                    store.setTextState(currentEditCompStatusConfig.value[confKey], payload)
                }
                break
            case 'options':
                const curEditCompConf = currentEditCompStatusConfig.value as OptionEditCompStatus
                const addOption = store.addOption()
                // payload 为数值时，表示为索引，进行删除选项
                if (isNumber(payload)) {
                    const result = store.removeOption(curEditCompConf[confKey], payload)
                    if (result) return ElMessage.success('删除成功')
                    ElMessage.error('至少保留两个选项')
                }
                // 限定为图片链接类型
                else if (isObjectWithKeys<PicLink>(payload, ['link', 'idx'])) {
                    store.setPicLinkByIndex(curEditCompConf[confKey], payload)
                } else if (isBoolean(payload)) {
                    setUse(curEditCompConf[confKey], payload)
                } else {
                    addOption(curEditCompConf[confKey], payload)
                }
                break
            case 'type':
                if (isNumber(payload)) {
                    const curEditCompConf = currentEditCompStatusConfig.value as TypeEditCompStatus

                    // 存在切换标志时，进行切换
                    if (curEditCompConf[confKey].isTooggle === true) {
                        store.toggleType(curEditCompConf, payload)
                        return
                    }

                    // 不存在切换标志时，进行状态更新
                    store.updateCurrentState(curEditCompConf[confKey], payload)
                }
                break
            case 'position':
            case 'titleSize':
            case 'descSize':
            case 'titleBold':
            case 'descBold':
            case 'titleSlant':
            case 'descSlant':
                if (isNumber(payload)) {
                    store.updateCurrentState(currentEditCompStatusConfig.value[confKey], payload)
                }
                break
        }
    }
}
