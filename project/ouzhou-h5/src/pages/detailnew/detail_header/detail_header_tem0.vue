<template>
  <div class="detail_header_tem0">
    <div class="detail-header-score row">
      <div class="detail-home col-5">
        <div class="detail-home-info">
          <span class="detail-home-info-text">{{ get_match_detail.mhn }}</span>
          <span class="detail-home-info-score-text" v-if="scoew_icon_list['S1']">{{ scoew_icon_list['S1'].home }}</span>
        </div>
      </div>
      <div class="detail-score col-2">
        <div class="detail-score-time">{{get_match_detail.course}}
          <span v-if="get_match_detail.ms != 110">{{get_match_detail.mstValue}} {{get_match_detail.mstValueTime}}</span></div>
      </div>
      <div class="detail-away col-5">
        <div class="detail-away-info">
          <span class="detail-away-info-score-text" v-if="scoew_icon_list['S1']">{{ scoew_icon_list['S1'].away }}</span>
          <span class="detail-away-info-text">{{ get_match_detail.man }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { defineComponent, onMounted, ref, toRef, watch } from "vue";
const props = defineProps({
  get_match_detail: {
    type: Object,
    default: () => {},
  },
});
const scoew_icon_list = ref({});
const toRef_get_match_detail = toRef(props, "get_match_detail");
watch(toRef_get_match_detail, (new_value, old_value) => {
  set_scoew_icon_list(new_value);
})
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
  background: #fff;
  .detail-header-score {
    display: flex;
    padding: 0 8px;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
    .detail-home {
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
          width: 100%;
        }
        .detail-home-info-score-text {
          color: #FF7000;
          font-size: 18px;
        }
      }
    }
    .detail-score {
      text-align: center;
      .detail-score-time {
        font-weight: 500;
      }
    }
    .detail-away {
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
          width: 100%;
        }
        .detail-away-info-score-text {
          color: #FF7000;
          font-size: 18px;
        }
      }
    }
  }
}
</style>