import {
    genderInitStatus,
    multiplePicSelectStatus,
    multipleSelectStatus,
    optionSelectStatus,
    textInputStatus
} from '@/configs/default-status/init-status'
import {
    MULTIPLE_PIC_SELECT_KEY,
    MULTIPLE_SELECT_KEY,
    OPTION_SELECT_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    TEXT_INPUT_KEY
} from '@/constants'
import { isOptionEditCompStatusObject, isTypeEditCompStatusObject, type BaseBusinessComp } from '@/types'
import type { MaterialKeys } from '@/types/materials'

function updateTitleAndDesc(comStatus: BaseBusinessComp, title: string, desc: string) {
    comStatus.editCompConfig.title.state = title
    comStatus.editCompConfig.desc.state = desc
}

const onlyTitleAndDescMap = {
    [OPTION_SELECT_KEY]: optionSelectStatus,
    [MULTIPLE_PIC_SELECT_KEY]: multiplePicSelectStatus,
    [MULTIPLE_SELECT_KEY]: multipleSelectStatus
}

// 更新初始化状态，在状态添加之前
export const updateInitStatusBeforeAdd = (comStatus: BaseBusinessComp, newMaterialName: MaterialKeys) => {
    comStatus.name = newMaterialName
    switch (newMaterialName) {
        case PRESET_PERSONAL_INFO_GENDER_KEY:
            if (isOptionEditCompStatusObject(comStatus.editCompConfig)) {
                const { title, desc, options, currentStage } = genderInitStatus()
                updateTitleAndDesc(comStatus, title, desc)
                comStatus.editCompConfig.options.state = options
                comStatus.editCompConfig.options.currentStage = currentStage
            }
            break
        case MULTIPLE_SELECT_KEY:
        case MULTIPLE_PIC_SELECT_KEY:
        case OPTION_SELECT_KEY:
            const { title, desc } = onlyTitleAndDescMap[newMaterialName]()
            updateTitleAndDesc(comStatus, title, desc)
            break
        case TEXT_INPUT_KEY:
            if (isTypeEditCompStatusObject(comStatus.editCompConfig)) {
                const { title, desc, typeIcons, typeOptions, typeTitle } = textInputStatus()
                updateTitleAndDesc(comStatus, title, desc)
                comStatus.editCompConfig.type.title = typeTitle
                comStatus.editCompConfig.type.icons = typeIcons
                comStatus.editCompConfig.type.state = typeOptions
                comStatus.editCompConfig.type.isTooggle = false
                for (const key in comStatus.editCompConfig) {
                    const config = comStatus.editCompConfig[key as keyof BaseBusinessComp['editCompConfig']]
                    config.isShow = true
                }
                break
            }
    }

    return comStatus
}
