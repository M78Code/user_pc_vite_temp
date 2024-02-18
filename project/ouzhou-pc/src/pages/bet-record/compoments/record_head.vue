<template>
  <div class="record-head">
    <div style="display: none;">{{ BetRecordHistory.bet_record_version }}</div>
    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/settled.png`" alt="" srcset="" class="record-bc" />
    <div class="record-head-title">{{i18n_t("ouzhou.record.my_bet")}}</div>
    <div class="tabs-wrap">
      <span v-for="(item, index) in tabList" :key="index" @click="tabClick(index)"
            :class="[{ 'is-active': BetRecordHistory.selected === index }, 'tabs-item']">{{ i18n_t(item.label)}}
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js'
import BetRecordHistory from "src/core/bet-record/pc/bet-record-history.js"

const tabClick = (index) => {
  BetRecordHistory.set_selected(index)
}
const tabList = ref([
{ label: "bet_record.outstanding_notes" },
  { label: "bet_record.settled_note" },
  { label: "bet_record.book_note" }
])
// 监听tab切换

</script>

<style lang="scss" scoped>
@import './record_head.scss';
</style>