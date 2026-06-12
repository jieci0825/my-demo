import { createRequest } from '@coderjc/reqflow'
import { fetchAdapter } from '@coderjc/reqflow/adapters/fetch'
import { errorPlugin } from '@coderjc/reqflow/plugins'
import { parseResponse } from './parse-response.plugin'

const request = createRequest({
    baseURL: 'http://localhost:7748/api',
    adapter: fetchAdapter(),
    plugins: [
        errorPlugin({
            /** 输出统一请求错误。 */
            onError: error => {
                console.error('Request error:', error)

                throw new Error(error.message)
            },
        }),
        parseResponse(),
    ],
})

export interface ApiResponse<T> {
    errorCode: number
    message: string
    data: T
}

export default request
