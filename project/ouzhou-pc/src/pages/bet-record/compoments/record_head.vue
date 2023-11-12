<!--
 * @Author: cooper
 * @Date: 2023-06-24 17:43:55
 * @Description: 注单历史头部
-->
<template>
  <div class="record-head">
    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/settled.png`" alt="" srcset="" class="record-bc" />
    <div class="record-head-title">My Bets</div>
    <div class="tabs-wrap">
      <span v-for="item in tabList" :key="item.id" @click="tabClick(item)"
            :class="[{ 'is-active': item.id === active }, 'tabs-item']">{{ item.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
const tab = ref('unsettled')
const emits = defineEmits(['tab_change'])
const active = ref('unsettled')
const tabClick = (item) => {
  active.value = item.id
  emits('tab_change', item.id)
}
const tabList = ref([
  { label: 'Unsettled', id: 'unsettled' },
  { label: 'Settled', id: 'settled' }
])
// 监听tab切换

</script>

<style lang="scss" scoped>
@import './record_head.scss'
</style>
