
<template>
    <mi-menu :items="menus" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
    AppstoreAddOutlined,
    LayoutOutlined,
    BellOutlined
} from '@ant-design/icons-vue'

const menus = reactive([
    {
        name: 'Home',
        path: '/admins/home',
        meta: {
            title: 'About',
            subTitle: 'Home'
        }
    },
    {
        name: 'Total',
        path: '',
        meta: {
            title: '统计',
            subTitle: 'Components',
            icon: AppstoreAddOutlined
        },
        children: [
            {
                name: 'DashBoard',
                path: '/admins/dashboard',
                meta: {
                    title: '仪表盘',
                    subTitle: 'Notice',
                    icon: BellOutlined
                }
            },{
                name: 'Sheet',
                path: '/admins/sheet',
                meta: {
                    title: '报表展示',
                    subTitle: 'Layout',
                    icon: LayoutOutlined
                }
            }
            
        ]
    },{
        name: 'Management',
        path: '',
        meta: {
            title: '管理',
            subTitle: 'Management',
        },
        children: [
            {
                name: 'ReverseCtrl',
                path: '/admins/reverse',
                meta: {
                    title: '预订管理',
                    subTitle: 'Reverse',
                }
            },{
                name: 'OrderCtrl',
                path: '/admins/order',
                meta: {
                    title: '订单管理',
                    subTitle: 'Order',
                }
            },{
                name: 'FeedBackCtrl',
                path: '/admins/feedback',
                meta: {
                    title: '评论汇总',
                    subTitle: 'Feedback',
                }
            }
            
        ]
    }
])
</script>
