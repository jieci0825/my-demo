import { defineComponent, h } from 'vue'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import { useTable, type UseTableOptions } from '../use-table'

export interface ColumnConfig {
    /** 列字段名 */
    prop: string
    /** 列标题 */
    label: string
    /** 列宽度 */
    width?: number | string
    /** 最小宽度 */
    minWidth?: number | string
    /** 对齐方式 */
    align?: 'left' | 'center' | 'right'
    /** 是否固定列 */
    fixed?: boolean | 'left' | 'right'
    /** 其他 el-table-column 支持的属性 */
    [key: string]: any
}

export interface UseTableComponentOptions<T = any> extends UseTableOptions<T> {
    /** 列配置 */
    columns: ColumnConfig[]
    /** 表格属性 */
    tableProps?: Record<string, any>
    /** 分页属性 */
    paginationProps?: Record<string, any>
}

export function useTableComponent<T = any>(
    options: UseTableComponentOptions<T>
) {
    const {
        columns,
        tableProps = {},
        paginationProps = {},
        ...tableOptions
    } = options

    // 内部调用 useTable 获取所有逻辑
    const tableState = useTable<T>(tableOptions)

    // 返回一个 Vue 组件
    const TableComponent = defineComponent({
        name: 'DynamicTableComponent',
        setup() {
            return () =>
                h('div', { class: 'table-component-wrapper' }, [
                    // 表格
                    h(
                        ElTable,
                        {
                            data: tableState.data.value,
                            vLoading: tableState.loading.value,
                            ...tableProps
                        },
                        () =>
                            columns.map(col =>
                                h(ElTableColumn, {
                                    key: col.prop,
                                    ...col
                                })
                            )
                    ),
                    // 分页
                    h(ElPagination, {
                        'class': 'table-pagination',
                        'currentPage': tableState.pagination.currentPage,
                        'pageSize': tableState.pagination.pageSize,
                        'total': tableState.pagination.total,
                        'layout': 'total, sizes, prev, pager, next, jumper',
                        'pageSizes': [10, 20, 50, 100],
                        'onUpdate:currentPage': tableState.handlePageChange,
                        'onUpdate:pageSize': tableState.handleSizeChange,
                        ...paginationProps
                    })
                ])
        }
    })

    return TableComponent
}
