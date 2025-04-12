
<template>
    <mi-items-image
        :data="items"
        :gap="{ row: 30, column: 15 }"
        line-color="red"
        height="200px"
        :hover="{ open: true, scale: true }"
        :number="{ mobile: 3, tablet: 3 }" />
</template>

<script setup lang="ts">
import { reactive , onMounted} from 'vue'
import type { ImageItem } from '@miitvip/admin-pro'
import thumb from '@/assets/background.png'
import {
  getRecommendList,getHotelsDetailApi
} from '@/api/modules/hotels/hotels';

const recommendList = () => {
  return getRecommendList().then((res) => {
    console.log(res);
  })
  ;
};
// 用来存放接口返回并转换后的 ImageItem 对象
const items = reactive([]) as ImageItem[]

onMounted(() => {
  getRecommendList()
    .then((res) => {
      console.log('接口返回的数据：', res)
      // 假设推荐列表返回的格式为：res.data.rows 数组，每项为酒店 id
      res.data.rows.forEach((item: any) => {
        console.log('推荐项 id:', item)
        // 调用酒店详情接口获取详细信息
        getHotelsDetailApi({ id: String(item) })
          .then((detailRes) => {
            const detail = detailRes.data
            // 根据返回数据构造 ImageItem 对象：
            // 取 detail.img 作为 thumb，detail.hotelname 为主标题，detail.englishname 为副标题，
            // detail.address 为介绍文本
            items.push({
              thumb: detail.img,
              title: { text: detail.hotelName, bold: true, align: 'center', size: 18,color: '#575757'},
              subtitle: { text: detail.englishName, align: 'center', size: 12 },
              intro: { text: detail.city+(detail.country || '')+(detail.address || ''), align: 'center', size: 16 },
              link: '/hotels/'+detail.hotelId, // 如果需要，可设置链接地址
              target: '_blank'
            })
          })
          .catch((error) => {
            console.error('获取酒店详情失败：', error)
          })
      })
    })
    .catch((error) => {
      console.error('获取推荐列表失败：', error)
    })
})
</script>
