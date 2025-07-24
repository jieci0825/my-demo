import { h, reactive, ref } from 'vue'
import FormBuilder from '../components/FormBuilder/index.vue'

export function useFormBuilder(formData, props) {
    const FormBuilderInstance = ref(null)

    const Comp = (_, { slots }) => {
        // reactive 自动解包
        return h(FormBuilder, { ...reactive(props), modelValue: formData, ref: FormBuilderInstance }, slots)
    }

    return [Comp, FormBuilderInstance]
}
