import { componentMap } from '@/configs/componentMap'
import type { BaseBusinessComp, EditCompName } from '@/types'

// 还原组件状态
export function restoreComponentStatus(comps: BaseBusinessComp[]) {
    // 通过 name 去映射表中查找需要的组件状态
    for (const comp of comps) {
        // 获取业务组件
        const material = componentMap[comp.name]
        comp.type = material
        for (const key in comp.editCompConfig) {
            const editCompConfItem = comp.editCompConfig[key as keyof BaseBusinessComp['editCompConfig']]
            editCompConfItem.editComp = componentMap[editCompConfItem.name as EditCompName]
        }
    }
}
