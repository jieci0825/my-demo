<script setup lang="ts">
import { ProTable, type ProTableColumnType } from '@jc/element-plus-pro'
import { h } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { ref } from 'vue'
import type { OperationColumnConfig } from '@jc/element-plus-pro'

const tableColumns: ProTableColumnType[] = [
    {
        label: {
            render: () =>
                h(
                    ElButton,
                    {
                        type: 'primary',
                        size: 'small',
                        onClick: () => {
                            ElMessage.success('点击了自定义渲染函数表头')
                        }
                    },
                    () => '用户名'
                )
        },
        prop: 'username',
        width: 100
    },
    { label: { slot: 'age' }, prop: 'age' },
    { label: '地址', prop: 'address' },
    { label: '电话', prop: 'phone', width: 150 },
    { label: '描述', prop: 'desc', width: 200 },
    {
        label: '职业',
        prop: 'job',
        width: 120,
        cell: {
            cellType: 'txt',
            isCopy: true
        }
    },
    { label: '邮箱', prop: 'email' },
    { label: '生日', prop: 'birthday' }
]

const tableData = ref([
    {
        id: 'd8c3aa96-f35d-4951-90e4-fdb948cd560f',
        username: '戈国良',
        age: 70,
        address: '东北',
        phone: '069-25671039',
        desc: '鸟笼贡献者，创始人🍀',
        job: '动态创意技术员',
        email: 'lm1md226@yeah.net',
        avatar: 'https://avatars.githubusercontent.com/u/35303079',
        birthday: '1981-10-11 14:41:00'
    },
    {
        id: '968714fc-a459-4ad9-9c26-20fa049f01cd',
        username: '鲍涛',
        age: 84,
        address: '西北',
        phone: '045-78091343',
        desc: '带宽爱好者，脑力爱好者',
        job: '内部网络协调员',
        email: 'k18iui.hr05@126.com',
        avatar: 'https://avatars.githubusercontent.com/u/63081178',
        birthday: '1981-05-27 15:25:27'
    },
    {
        id: '1d7b7972-9705-4ea6-9148-92f3feef4ce7',
        username: '溥俊熙',
        age: 56,
        address: '华南',
        phone: '013-52409241',
        desc: '类比粉丝',
        job: '前进运营分析师',
        email: 'ucop8d.i60@sina.com',
        avatar: 'https://avatars.githubusercontent.com/u/3541527',
        birthday: '1962-05-08 23:17:16'
    },
    {
        id: '85c9667e-6ac1-4321-a047-a160e4a74f25',
        username: '法晨',
        age: 14,
        address: '华东',
        phone: '0185-75615242',
        desc: '飞机狂热者，作者',
        job: '直接创意经理',
        email: 'nf7sbt58@yeah.net',
        avatar: 'https://avatars.githubusercontent.com/u/85324142',
        birthday: '1980-03-03 18:57:50'
    },
    {
        id: '3c60aaeb-5ab1-48e9-b48f-f3f8b8fd9442',
        username: '隗语桐',
        age: 62,
        address: '华南',
        phone: '18767326861',
        desc: '踢脚线贡献者',
        job: '人力市场策略师',
        email: 'fmnnzu_ts0@163.com',
        avatar: 'https://avatars.githubusercontent.com/u/96441263',
        birthday: '2003-07-13 15:45:30'
    },
    {
        id: '66a9108c-08bc-4150-a7fd-90094aa6bdb1',
        username: '宓国华',
        age: 100,
        address: '西北',
        phone: '095-32942058',
        desc: '公众演说家，工程师，玩家',
        job: '公司功能性主管',
        email: 'kutqrx_g1v59@foxmail.com',
        avatar: 'https://avatars.githubusercontent.com/u/83101117',
        birthday: '1976-09-17 21:21:11'
    },
    {
        id: '005f48c4-bd95-42a7-8d39-dc1efe1fa088',
        username: '谭凤英',
        age: 86,
        address: '西北',
        phone: '0158-30006446',
        desc: '烘焙器具发烧友',
        job: '投资者因素办事员',
        email: 'lh7lnf_p4a@163.com',
        avatar: 'https://avatars.githubusercontent.com/u/17821604',
        birthday: '1993-04-30 15:13:31'
    },
    {
        id: '06c3bded-442b-4cf8-aeab-22aa2c0dfdc3',
        username: '淳于国兰',
        age: 22,
        address: '西北',
        phone: '074-15980424',
        desc: '电影爱好者，电影制片人，科学家🕣',
        job: '产品内部网助理',
        email: 'pybsbt89@tom.com',
        avatar: 'https://avatars.githubusercontent.com/u/19993110',
        birthday: '1966-12-26 12:49:38'
    },
    {
        id: '2465ff90-0bb8-44a8-a3d6-2b9b3d085844',
        username: '扬治文',
        age: 51,
        address: '华南',
        phone: '068-72792518',
        desc: '改编发烧友，电影制片人🚌',
        job: '内部数据协调员',
        email: 'v9rlnf.k3351@yahoo.com.cn',
        avatar: 'https://avatars.githubusercontent.com/u/93653252',
        birthday: '2002-11-04 17:23:49'
    },
    {
        id: 'ec2f5806-c27a-4c88-b80f-940764b42594',
        username: '越艺涵',
        age: 78,
        address: '西南',
        phone: '026-76856806',
        desc: '书架倡导者，朋友🥉',
        job: '直接网络专员',
        email: 'k88to3.sl540@yeah.net',
        avatar: 'https://avatars.githubusercontent.com/u/10197600',
        birthday: '2007-06-09 11:05:04'
    },
    {
        id: 'dac92f11-94e9-4921-adf4-5ee0fcff8bf6',
        username: '公冶凤英',
        age: 36,
        address: '华南',
        phone: '0784-72528853',
        desc: '企业家，活动家，作者🎏',
        job: '主要集成协调员',
        email: 'i1crqi_nkz24@outlook.com',
        avatar: 'https://avatars.githubusercontent.com/u/19521935',
        birthday: '1995-05-31 09:17:04'
    },
    {
        id: 'ea3df9bd-fc27-4de4-8042-20464163afc1',
        username: '兴志国',
        age: 83,
        address: '西北',
        phone: '17632739634',
        desc: '设计师，创始人',
        job: '全国性互动办事员',
        email: 'k1zu0c.ios80@outlook.com',
        avatar: 'https://avatars.githubusercontent.com/u/14452264',
        birthday: '1952-03-13 04:51:40'
    },
    {
        id: '56851585-6bcb-4152-8dbf-09ccbb54e3f5',
        username: '宇语桐',
        age: 69,
        address: '东北',
        phone: '085-38830783',
        desc: '篝火贡献者，毕业生',
        job: '直接指标主管',
        email: 'k1zggq67@139.com',
        avatar: 'https://avatars.githubusercontent.com/u/75849428',
        birthday: '1998-05-31 04:37:36'
    },
    {
        id: '937d0716-5370-41bc-8037-118dd667315b',
        username: '颜佳琪',
        age: 77,
        address: '华东',
        phone: '10556858810',
        desc: '僧袍爱好者，公众演说家👩🏾‍❤️‍👨🏾',
        job: '公司问责制经理',
        email: 'o97fmn_ipq@21cn.com',
        avatar: 'https://avatars.githubusercontent.com/u/40203179',
        birthday: '1958-08-11 13:53:26'
    },
    {
        id: '95cc4341-3eda-49a2-9574-d73f6a43c428',
        username: '融诚',
        age: 88,
        address: '东北',
        phone: '15825552962',
        desc: '电器倡导者',
        job: '客户基础设施开发员',
        email: 'jlbffg45@21cn.com',
        avatar: 'https://avatars.githubusercontent.com/u/24358103',
        birthday: '1966-09-24 12:18:45'
    },
    {
        id: 'd9902dce-ed49-4ae2-9dd3-c4814bf12c6f',
        username: '冒芳',
        age: 32,
        address: '华东',
        phone: '19562774178',
        desc: '命令狂热者',
        job: '首席问责制管理员',
        email: 'pu9ggq.q3r@hotmail.com',
        avatar: 'https://avatars.githubusercontent.com/u/58354385',
        birthday: '1985-07-20 04:38:30'
    },
    {
        id: '819ca35f-e5a5-4598-93b2-9d3862705608',
        username: '时鑫',
        age: 70,
        address: '华东',
        phone: '0628-04975990',
        desc: '鸟笼狂热者，发明家🇧🇿',
        job: '主管质量制作人',
        email: 'knnk8812@outlook.com',
        avatar: 'https://avatars.githubusercontent.com/u/49930129',
        birthday: '1971-04-04 08:24:48'
    },
    {
        id: 'f82d2dc9-9d5d-44b5-8039-c4205d42a4e2',
        username: '慎宇轩',
        age: 99,
        address: '华南',
        phone: '057-87964481',
        desc: '旅行家',
        job: '客户范式管理员',
        email: 'negtue37@yahoo.cn',
        avatar: 'https://avatars.githubusercontent.com/u/17608043',
        birthday: '1977-05-11 11:51:19'
    }
])

const operateionColumn: OperationColumnConfig = {
    btnProps: {
        hideBtns: [false, false, false]
    }
}
</script>

<template>
    <div class="container">
        <div class="table-area">
            <ProTable
                :table-data="tableData"
                align="center"
                border
                :table-columns="tableColumns"
                :operation-column="operateionColumn"
            >
                <template #age>
                    <el-tag
                        type="success"
                        @click="
                            () => ElMessage.warning('点击了年龄-模板插槽渲染')
                        "
                        >年龄</el-tag
                    >
                </template>
            </ProTable>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    padding-top: 70px;
    width: 800px;
    height: 100vh;
    background-color: #ccc;
    border: 1px solid #000;
    .table-area {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
}
</style>
