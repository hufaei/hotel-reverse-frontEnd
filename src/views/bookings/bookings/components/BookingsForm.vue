<template>
    <mi-items-list
      type="card"
      :data="hotelData"
      :thumbSetting="{ width: 200 , height: 250 ,scale: true }"
    />
  </template>
  
  <script setup lang="ts">
  import { reactive, onMounted } from 'vue'
  import type { ListItem } from '@miitvip/admin-pro'
  import { getHotelsDetailApi } from '@/api/modules/hotels/hotels'
  
  // 酒店ID列表
  const hotelIds = [
    "JD0000107934",
    "JD0000121402",
    "JD0000127841",
    "JD0000346300",
    "JD0000346302",
    "JD0000346307",
    "JD0000346311",
    "JD0000346316",
    "JD0000346339"
  ]
  
  // 用于存储转换后的酒店数据，符合 ListItem 格式
  const hotelData = reactive<ListItem[]>([])
  
  onMounted(async () => {
    // 同时发起所有请求
    const fetchPromises = hotelIds.map(id =>
      getHotelsDetailApi({ id }).then(res => res.data) // 假设返回结构为 { data: Row }
    )
    try {
      const hotelsDetails = await Promise.all(fetchPromises)
      hotelsDetails.forEach(row => {
        hotelData.push({
          thumb: row.img || '', // 酒店图片
          title: row.hotelName +""+row.contactPhone + "地址："+row.address, // 酒店名称
          intro: row.description || '',
          date: row.openingYear ? String("开业时间："+row.openingYear+"年") : String("开业时间："+row.renovationYear+"年"),
          category: row.stars+"星级",
          link: `/hotels/${row.hotelId}`
        })
      })
    } catch (error) {
      console.error("获取酒店数据失败:", error)
    }
  })
  </script>
  