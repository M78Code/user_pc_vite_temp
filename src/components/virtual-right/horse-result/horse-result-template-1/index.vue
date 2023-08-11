<!--
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 赛马赛果
-->

<template>
  <div class="horse-result">
    <div class="header-title">{{vsport_ctr.info.no}}</div>
    <!-- 前三排名 -->
    <div class="rank-list">
      <div class="item" v-for="(item,key) in vsport_ctr.horse_rank" :key="key">
        <div class="bg-style" :class="`ranking-bg-style1-${item.no} csid-${vsport_ctr.info.csid}`"></div>
        <div class="name col ellipsis">{{item.name}}</div>
        <div class="rank din-medium yb-flex-center">{{item.ranking}}</div>
      </div>
    </div>
    <!-- 玩法投注项 -->
    <div class="result din-medium" v-for="(row,row_key) in vsport_ctr.horse_play_id" :key="row_key">
      <template v-for="(play_id,play_key) in row">
        <div class="result-item yb-flex-center" v-if="vsport_ctr.horse_play_data[play_id]" :key="play_key">
          <div class="name">{{vsport_ctr.horse_play_data[play_id].playName}}</div>
          <div class="ol-wrap">
            <div class="ol" v-for="(ol,index) in vsport_ctr.horse_play_data[play_id].ol" :key="index">
              <div class="on">
                <div class="bg-style" :class="`ranking-bg-style1-${on} csid-${vsport_ctr.info.csid}`" v-for="(on,on_key) in ol.ons" :key="on_key"></div>
              </div>
              <div class="odds">{{compute_value_by_cur_odd_type(ol.ov / 100000,'',vsport_ctr.horse_play_data[play_id].hsw)}}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name: "horseResult",
  props:{
    // 虚拟体育控制类
    vsport_ctr: Object
  },
  setup(props, evnet) {
    const data = reactive({
      match:vsport_ctr.replay_list[0]
    });
    onMounted(() => {
      vsport_ctr.set_match_result()
    });
    onUnmounted(() => {
      vsport_ctr.horse_rank = []
      vsport_ctr.horse_play_data = {}
    })
    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>
/*  标题 */
.header-title {
  height: 32px;
  line-height: 28px;
  font-size: 13px;
  position: relative;
  padding-left: 42px;
  align-items: center;
  &::before {
    content: "";
    position: absolute;
    top: 7px;
    left: 21px;
    width: 3px;
    height: 14px;
    border-radius: 1.5px;
    }
}

/*  排行榜 */
.rank-list {
  .item {
    display: flex;
    align-items: center;
    height: 33px;
    .bg-style {
      width: 24px;
      height: 24px;
      margin: 0 20px;
    }
    .name {
      font-size: 13px;
    }
    .rank {
      width: 44px;
      height: 100%;
    }
  }
}

/*  赛果 */
.result {
  display: flex;
  &:last-child {
    border-bottom: none;
  }
  .result-item {
    flex: 1;
    text-align: center;
    height: 88px;
    flex-direction: column;
    line-height: 1;
    &:last-child {
      border-right: none;
    }
    .name {
      padding-bottom: 8px;
    }
    .ol-wrap {
      display: flex;
      justify-content: center;
      .ol {
        min-width: 36px;
        .on {
          display: flex;
          justify-content: center;
          .bg-style {
            width: 20px;
            height: 20px;
            margin: 0 1px;
          }
        }
        .odds {
          font-size: 14px;
          padding-top: 8px;
        }
      }
    }
  }
}
</style>
