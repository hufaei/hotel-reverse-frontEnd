<template>
    <mi-items-list type="card" 
        :data= bookingData
        :thumbSetting="{ scale: true }"
        :title-setting="{ color: '#11558c', bold: true }"
        :intro-setting="{ color: '#118c3c' }"
        :date-setting="{ color: '#8c7a11' ,bold: true,size: '25px', align: 'right'}"
         />
</template>


<script setup lang="ts">
import { reactive ,ref} from 'vue'
import type { ListItem } from '@miitvip/admin-pro'
import thumb1 from '@/assets/bg.png'
import thumb2 from '@/assets/bg.png'
import thumb3 from '@/assets/bg.png'
const blank = '&emsp;'.repeat(24);  // 根据需要重复空格
const bookingData = reactive([
    {
        thumb: thumb1,
        title: '叙新当局称就解散武装派别达成协议 库尔德人武装未出席会议叙新当局称就解散武装派别达成协议 库尔德人武装未出席会议叙新当局称就解散武装派别达成协议 库尔德人武装未出席会议',
        intro: '叙利亚新领导层周二宣布，“叙利亚沙姆解放武装”领导人艾哈迈德·沙拉已同叙其他武装派别领导人就解散所有武装派别并将其纳入新国防部麾下达成协议。法新社报导指，美国支持的、库尔德人领导的、控制着叙东北部大片地区的部队的代表没有出席会议。叙利亚新领导层周二宣布，“叙利亚沙姆解放武装”领导人艾哈迈德·沙拉已同叙其他武装派别领导人就解散所有武装派别并将其纳入新国防部麾下达成协议。法新社报导指，美国支持的、库尔德人领导的、控制着叙东北部大片地区的部队的代表没有出席会议。',
        link: 'https://www.bbc.com/zhongwen/articles/cvg9p54j1qyo/simp',
        date: '888￥',
        category: blank +'民宿：'
    },
    {
        thumb: thumb2,
        title: '“明星车企”极越岁末突然倒闭，折射中国新能源车企低利润下的挣扎',
        intro: '在中国新能源汽车崛起的大潮中，倒下的品牌屡见不鲜，但极越汽车的突然倒闭还是令市场错愕——12月11日，CEO夏一平在一个视频会议上突然宣布，公司遇到困难，而且11月员工的社保已经无法缴纳，并随后给出清退方案。',
        date: '888$',
        link: 'https://www.bbc.com/zhongwen/articles/cvg9p54j1qyo/simp',
        target: '_blank',// 新页面打开
        category: '新能源'
    },
    {
        thumb: thumb3,
        title: '黄金交易提醒：美国核心耐用品订单强劲反弹，美债收益率再攀新高，金价反弹受阻回落',
        intro: '周二（12月24日）亚市早盘，现货黄金窄幅震荡，目前交投于2615.35美元/盎司附近。金价在周一低迷的假日季交投中走低，美国核心耐用品订单强劲反弹，帮助美元走强，美国10年期国债收益率刷新逾半年高点，令金价承压明显。',
        date: '2024-12-24 07:40',
        link: 'https://cn.investing.com/news/forex-news/article-2614043',
        target: '_blank',
        category: '黄金交易'
    }
]) as ListItem[];
</script>

