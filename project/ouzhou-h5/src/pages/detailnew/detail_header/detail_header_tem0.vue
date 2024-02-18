<template>
  <div class="detail_header_tem0">
    <div class="detail-header-score row">
      <div class="detail-home">
        <div class="detail-home-info">
          <span class="detail-home-info-text detail-team-name">{{ get_match_detail.mhn }}</span>
          <span class="detail-separate"></span>
          <span class="detail-home-info-score-text" v-if="scoew_icon_list['S1']">{{ scoew_icon_list['S1'].home }}</span>
        </div>
      </div>
      <div class="detail-score">
        <div class="detail-score-time" :class="get_match_detail.mmp == 0?'active':''">
          <match-stage :detail_data="get_match_detail" v-if="get_match_detail.ms != 110"></match-stage>
        </div>
      </div>
      <div class="detail-away">
        <div class="detail-away-info">
          <span class="detail-away-info-score-text" v-if="scoew_icon_list['S1']">{{ scoew_icon_list['S1'].away }}</span>
          <span class="detail-separate"></span>
          <span class="detail-away-info-text detail-team-name">{{ get_match_detail.man }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import matchStage from "src/base-h5/components/match/match-stage.vue";  // 详情页上推后置顶的赛事具体状态(1.未开赛显示2.开赛时间小于1小时显示分钟)
import { ref, watch } from "vue";
/** @type {{ get_match_detail:TYPES.MatchDetail }} */
const props = defineProps({
  get_match_detail: {
    type: Object,
    default: () => ({}),
  },
});
const scoew_icon_list = ref({});
watch(()=>props.get_match_detail, (new_value, old_value) => {
  scoew_icon_list.value = {};
  set_scoew_icon_list(new_value);
},{deep:true})
const set_scoew_icon_list = (new_value) => {
  if (new_value && new_value.msc) {
    for (let key in new_value.msc) {
      let score_key_arr = new_value.msc[key].split("|");
      let score_value_arr = score_key_arr[1].split(":");
      scoew_icon_list.value[score_key_arr[0]] = {
        home: score_value_arr[0],
        away: score_value_arr[1]
      }
    }
    // console.log("scoew_icon_list", scoew_icon_list);
  }
}
setTimeout(() => {
  scoew_icon_list.value = {};
  set_scoew_icon_list(props.get_match_detail);
}, 100);
</script>
  
<style lang="scss" scoped>
.detail_header_tem0 {
  background-color: var(--q-gb-bg-c-2);
  .detail-header-score {
    display: flex;
    padding: 0 8px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    min-height: 45px;
    .detail-home {
      flex: 1;
      line-height: 20px;
      .detail-home-info {
        line-height: 25px;
        font-size: 13px;
        font-weight: bold;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .detail-home-info-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .detail-home-info-score-text {
          //color: #FF7000;
          color: var(--q-gb-t-c-1);
          font-size: 18px;
        }
      }
    }
    .detail-score {
      padding: 0 10px;
      text-align: center;
      .detail-score-time {
        &.active{
          color: var(--q-gb-t-c-1);
        }
        font-weight: 500;
      }
    }
    .detail-away {
      flex: 1;
      line-height: 20px;
      text-align: right;
      .detail-away-info {
        line-height: 25px;
        font-size: 13px;
        font-weight: bold;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .detail-away-info-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .detail-away-info-score-text {
          //color: #FF7000;
          color: var(--q-gb-t-c-1);
          font-size: 18px;
        }
      }
    }
  }
}
.detail-team-name{
  flex: 1;
  width: 0;
}
.detail-separate{
  width: 10px;
}
</style>