
<template>
    <mi-items-image
        :data="items"
        :gap="{ row: 30, column: 15 }"
        line-color="red"
        height="250px"
        :hover="{ open: true, scale: true }"
        :number="{ mobile: 3, tablet: 5 }" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { ImageItem } from '@miitvip/admin-pro'
import thumb from '@/assets/background.png'

const items = reactive([
    {
        thumb,
        title: { text: '《早发白帝城》', bold: true, align: 'center', size: 22 },
        subtitle: { text: '唐·李白', align: 'center', size: 18 },
        intro: {
            text: '朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。',
            align: 'center',
            size: 16
        },
        link: 'https://scan.makeit.vip',
        target: '_blank'
    },
    {
        thumb,
        title: { text: '《客中行》', bold: true, align: 'center', size: 22 },
        subtitle: { text: '唐·李白', align: 'center', size: 18 },
        intro: {
            text: '兰陵美酒郁金香，玉碗盛来琥珀光。<br />但使主人能醉客，不知何处是他乡。',
            align: 'center',
            size: 16
        },
        link: 'https://graffiti.makeit.vip',
        target: '_blank'
    },
    {
        thumb,
        title: { text: '《早发白帝城》', bold: true, align: 'center', size: 22 },
        subtitle: { text: '唐·李白', align: 'center', size: 18 },
        intro: {
            text: '朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。',
            align: 'center',
            size: 16
        },
        link: 'https://scan.makeit.vip',
        target: '_blank'
    },
    {
        thumb,
        title: { text: '《早发白帝城》', bold: true, align: 'center', size: 22 },
        subtitle: { text: '唐·李白', align: 'center', size: 18 },
        intro: {
            text: '朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。',
            align: 'center',
            size: 16
        },
        link: 'https://scan.makeit.vip',
        target: '_blank'
    },
    {
        thumb,
        title: { text: '《客中行》', bold: true, align: 'center', size: 22 },
        subtitle: { text: '唐·李白', align: 'center', size: 18 },
        intro: {
            text: '兰陵美酒郁金香，玉碗盛来琥珀光。<br />但使主人能醉客，不知何处是他乡。',
            align: 'center',
            size: 16
        },
        link: 'https://graffiti.makeit.vip',
        target: '_blank'
    },
    {
        thumb,
        title: { text: '《早发白帝城》', bold: true, align: 'center', size: 22 },
        subtitle: { text: '唐·李白', align: 'center', size: 18 },
        intro: {
            text: '朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。',
            align: 'center',
            size: 16
        },
        link: 'https://scan.makeit.vip',
        target: '_blank'
    },{
        thumb,
        title: { text: '《早发白帝城》', bold: true, align: 'center', size: 22 },
        subtitle: { text: '唐·李白', align: 'center', size: 18 },
        intro: {
            text: '朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。',
            align: 'center',
            size: 16
        },
        link: 'https://scan.makeit.vip',
        target: '_blank'
    },
    {
        thumb,
        title: { text: '《客中行》', bold: true, align: 'center', size: 22 },
        subtitle: { text: '唐·李白', align: 'center', size: 18 },
        intro: {
            text: '兰陵美酒郁金香，玉碗盛来琥珀光。<br />但使主人能醉客，不知何处是他乡。',
            align: 'center',
            size: 16
        },
        link: 'https://graffiti.makeit.vip',
        target: '_blank'
    },
    {
        thumb,
        title: { text: '《早发白帝城》', bold: true, align: 'center', size: 22 },
        subtitle: { text: '唐·李白', align: 'center', size: 18 },
        intro: {
            text: '朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。',
            align: 'center',
            size: 16
        },
        link: 'https://scan.makeit.vip',
        target: '_blank'
    },
]) as ImageItem[];
</script>
