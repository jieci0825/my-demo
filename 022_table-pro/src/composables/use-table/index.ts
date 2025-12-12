import { reactive, watch, toValue, type MaybeRefOrGetter } from 'vue'
import { useAsyncState } from '@vueuse/core'

export interface UseTableOptions<T = any> {
    /** 数据获取函数 */
    request: (params: FetchParams) => Promise<FetchResult<T>>
    /** 初始查询参数（除分页外的业务参数） */
    queryParams?: MaybeRefOrGetter<Record<string, any>>
    /** 是否立即执行 */
    immediate?: boolean
    /** 是否监听查询参数变化自动重新查询 */
    watchQueryParams?: boolean
    /** 默认分页配置 */
    defaultPagination?: {
        currentPage?: number
        pageSize?: number
    }
    /** 参数处理函数（在发送请求前对参数进行处理） */
    paramsHandler?: (params: FetchParams) => FetchParams
    /** 数据转换函数 */
    transform?: (data: T[]) => T[]
    /** 请求成功回调 */
    onSuccess?: (data: T[], total: number) => void
    /** 请求失败回调 */
    onError?: (error: unknown) => void
    /** 数据字段 */
    listField?: string
    totalField?: string
}

export interface FetchParams extends Record<string, any> {
    /** 当前页码 */
    page: number
    /** 每页数量 */
    pageSize: number
}

export interface FetchResult<T = any> {
    /** 数据列表 */
    list: T[]
    /** 总数 */
    total: number
    /** 其他字段 */
    [key: string]: any
}

export function useTable<T = any>(options: UseTableOptions<T>) {
    const {
        request,
        queryParams,
        immediate = true,
        watchQueryParams = true,
        defaultPagination = {},
        paramsHandler,
        transform,
        onSuccess,
        onError,
        listField = 'list',
        totalField = 'total'
    } = options

    const {
        currentPage: defaultCurrentPage = 1,
        pageSize: defaultPageSize = 10
    } = defaultPagination

    // 分页状态
    const pagination = reactive({
        currentPage: defaultCurrentPage,
        pageSize: defaultPageSize,
        total: 0
    })

    // 获取查询参数
    const getQueryParams = () => toValue(queryParams) ?? {}

    /** 构建请求参数 */
    const buildRequestParams = () => {
        const totalParams = {
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
            ...getQueryParams()
        }

        // 如果更严谨一些，可以进一步判断是否是函数
        const finalParams = paramsHandler
            ? paramsHandler(totalParams)
            : totalParams
        return finalParams
    }

    // 实际的数据获取函数
    const doFetch = async () => {
        try {
            // 如果提供了参数处理函数，则先处理参数
            const result = await request(buildRequestParams())
            pagination.total = result[totalField]

            const finalData = transform
                ? transform(result[listField])
                : result[listField]
            onSuccess?.(finalData, result[totalField])

            return finalData
        } catch (err) {
            onError?.(err)
            throw err
        }
    }

    // 使用 useAsyncState 管理异步状态
    const {
        state: data,
        isLoading: loading,
        error,
        execute
    } = useAsyncState<T[]>(doFetch, [], {
        immediate,
        resetOnExecute: false
    })

    // 刷新数据（保持当前分页）
    const refresh = () => execute()

    // 重新查询（重置到第一页）
    const search = () => {
        pagination.currentPage = 1
        return execute()
    }

    // 分页变化处理
    const handlePageChange = (page: number) => {
        pagination.currentPage = page
        execute()
    }

    // 每页数量变化处理
    const handleSizeChange = (size: number) => {
        pagination.pageSize = size
        pagination.currentPage = 1
        execute()
    }

    // 重置分页到初始状态
    const resetPagination = () => {
        pagination.currentPage = defaultCurrentPage
        pagination.pageSize = defaultPageSize
    }

    // 监听查询参数变化，自动重新查询（可选）
    if (queryParams && watchQueryParams) {
        watch(
            () => toValue(queryParams),
            () => {
                search()
            },
            { deep: true }
        )
    }

    return {
        /** 表格数据 */
        data,
        /** 加载状态 */
        loading,
        /** 错误信息 */
        error,
        /** 分页信息 */
        pagination,
        /** 刷新数据（保持当前分页） */
        refresh,
        /** 重新查询（重置到第一页） */
        search,
        /** 分页变化处理 */
        handlePageChange,
        /** 每页数量变化处理 */
        handleSizeChange,
        /** 重置分页 */
        resetPagination
    }
}

export type UseTableReturn<T = any> = ReturnType<typeof useTable<T>>
