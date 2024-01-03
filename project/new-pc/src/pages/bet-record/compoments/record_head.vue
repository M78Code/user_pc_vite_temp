<template>
  <div class="record-head">
    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/settled.png`" alt="" srcset="" class="record-bc" />
    <div class="record-head-title">{{i18n_t("ouzhou.record.my_bet")}}</div>
    <div class="tabs-wrap">
      <span v-for="item in tabList" :key="item.id" @click="tabClick(item)"
            :class="[{ 'is-active': item.id === active }, 'tabs-item']">{{ i18n_t(item.label)}}
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js'
const tab = ref('unsettled')
const emits = defineEmits(['tab_change'])
const active = ref('unsettled')
const tabClick = (item) => {
  active.value = item.id
  emits('tab_change', item.id)
}
const tabList = ref([
  { label: "ouzhou.record.unsettled", id: 'unsettled' },
  { label: "ouzhou.record.settled", id: 'settled' }
])
// 监听tab切换

</script>

<style lang="scss" scoped>
@import './record_head.scss';
</style>