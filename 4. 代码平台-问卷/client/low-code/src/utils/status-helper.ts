import {
    addressInitStatus,
    ageInitStatus,
    birthInitStatus,
    careerInitStatus,
    collageInitStatus,
    companyInitStatus,
    educationInitStatus,
    emailInitStatus,
    genderInitStatus,
    idInitStatus,
    industryInitStatus,
    majorInitStatus,
    nameInitStatus,
    optionSelectInitStatus,
    phoneInitStatus,
    positionInitStatus,
    qqInitStatus,
    wechatInitStatus
} from '@/configs/default-status/init-status'
import {
    OPTION_SELECT_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    PRESET_PERSONAL_INFO_ID_KEY,
    PRESET_PERSONAL_INFO_NAME_KEY,
    PRESET_PERSONAL_INFO_COLLAGE_KEY,
    PRESET_PERSONAL_INFO_MAJOR_KEY,
    PRESET_PERSONAL_INFO_INDUSTRY_KEY,
    PRESET_PERSONAL_INFO_COMPANY_KEY,
    PRESET_PERSONAL_INFO_BIRTH_KEY,
    PRESET_PERSONAL_INFO_POSITION_KEY,
    PRESET_PERSONAL_INFO_AGE_KEY,
    PRESET_PERSONAL_INFO_CAREER_KEY,
    PRESET_PERSONAL_INFO_EDUCATION_KEY,
    PRESET_CONTACT_PHONE_KEY,
    PRESET_CONTACT_EMAIL_KEY,
    PRESET_CONTACT_QQ_KEY,
    PRESET_CONTACT_WECHAT_KEY,
    PRESET_CONTACT_ADDRESS_KEY
} from '@/constants'
import { isOptionEditCompStatusObject, isTypeEditCompStatusObject, type BaseBusinessComp } from '@/types'
import type { MaterialKeys } from '@/types/materials'

function updateTitleAndDesc(comStatus: BaseBusinessComp, title: string, desc: string) {
    comStatus.editCompConfig.title.state = title
    comStatus.editCompConfig.desc.state = desc
}

function allShowInitStatus(comStatus: BaseBusinessComp) {
    for (const key in comStatus.editCompConfig) {
        const config = comStatus.editCompConfig[key as keyof BaseBusinessComp['editCompConfig']]
        config.isShow = true
    }
}

const onlyTitleAndDescMap = {
    [PRESET_PERSONAL_INFO_BIRTH_KEY]: birthInitStatus
}

const personalInfoTextInputInitStatusMap = {
    [PRESET_PERSONAL_INFO_ID_KEY]: idInitStatus,
    [PRESET_PERSONAL_INFO_NAME_KEY]: nameInitStatus,
    [PRESET_PERSONAL_INFO_COLLAGE_KEY]: collageInitStatus,
    [PRESET_PERSONAL_INFO_MAJOR_KEY]: majorInitStatus,
    [PRESET_PERSONAL_INFO_INDUSTRY_KEY]: industryInitStatus,
    [PRESET_PERSONAL_INFO_COMPANY_KEY]: companyInitStatus,
    [PRESET_PERSONAL_INFO_POSITION_KEY]: positionInitStatus,
    [PRESET_CONTACT_PHONE_KEY]: phoneInitStatus,
    [PRESET_CONTACT_EMAIL_KEY]: emailInitStatus,
    [PRESET_CONTACT_QQ_KEY]: qqInitStatus,
    [PRESET_CONTACT_WECHAT_KEY]: wechatInitStatus,
    [PRESET_CONTACT_ADDRESS_KEY]: addressInitStatus
}

const personalInfoSingleSelectInitStatusMap = {
    [PRESET_PERSONAL_INFO_GENDER_KEY]: genderInitStatus,
    [PRESET_PERSONAL_INFO_AGE_KEY]: ageInitStatus,
    [PRESET_PERSONAL_INFO_CAREER_KEY]: careerInitStatus,
    [PRESET_PERSONAL_INFO_EDUCATION_KEY]: educationInitStatus
}

// 更新初始化状态，在状态添加之前
export const updateInitStatusBeforeAdd = (comStatus: BaseBusinessComp, newMaterialName: MaterialKeys) => {
    // 更新 name
    comStatus.name = newMaterialName

    switch (newMaterialName) {
        case PRESET_PERSONAL_INFO_GENDER_KEY:
        case PRESET_PERSONAL_INFO_AGE_KEY:
        case PRESET_PERSONAL_INFO_CAREER_KEY:
        case PRESET_PERSONAL_INFO_EDUCATION_KEY:
            if (isOptionEditCompStatusObject(comStatus.editCompConfig)) {
                const { title, desc, options, currentStage } = personalInfoSingleSelectInitStatusMap[newMaterialName]()
                updateTitleAndDesc(comStatus, title, desc)

                comStatus.editCompConfig.options.state = options
                comStatus.editCompConfig.options.currentStage = currentStage
            }
            break
        case PRESET_PERSONAL_INFO_BIRTH_KEY:
            const { title, desc } = onlyTitleAndDescMap[newMaterialName]()
            updateTitleAndDesc(comStatus, title, desc)
            break
        case OPTION_SELECT_KEY:
            if (isOptionEditCompStatusObject(comStatus.editCompConfig)) {
                const { title, desc, typeComp } = optionSelectInitStatus()
                updateTitleAndDesc(comStatus, title, desc)
                comStatus.type = typeComp
            }
            break
        case PRESET_PERSONAL_INFO_ID_KEY:
        case PRESET_PERSONAL_INFO_NAME_KEY:
        case PRESET_PERSONAL_INFO_COLLAGE_KEY:
        case PRESET_PERSONAL_INFO_MAJOR_KEY:
        case PRESET_PERSONAL_INFO_INDUSTRY_KEY:
        case PRESET_PERSONAL_INFO_COMPANY_KEY:
        case PRESET_PERSONAL_INFO_POSITION_KEY:
        case PRESET_CONTACT_PHONE_KEY:
        case PRESET_CONTACT_EMAIL_KEY:
        case PRESET_CONTACT_QQ_KEY:
        case PRESET_CONTACT_WECHAT_KEY:
        case PRESET_CONTACT_ADDRESS_KEY:
            if (isTypeEditCompStatusObject(comStatus.editCompConfig)) {
                const { title, desc, titleSizeOptions } = personalInfoTextInputInitStatusMap[newMaterialName]()
                updateTitleAndDesc(comStatus, title, desc)
                allShowInitStatus(comStatus)

                // 这里需要后置处理 type.isShow
                comStatus.editCompConfig.type.isShow = false
                comStatus.editCompConfig.type.currentStage = 0
                comStatus.editCompConfig.position.currentStage = 0
                comStatus.editCompConfig.titleSize.state = titleSizeOptions
            }
            break
    }

    return comStatus
}
