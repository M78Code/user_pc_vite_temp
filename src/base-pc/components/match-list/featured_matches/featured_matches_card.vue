<template>
  <div class="featured-matched-card-wrap">
    <CurrentMatchTitle :title_value="'Featured Matches'" :show_more_icon="false" />
    <!-- 当热门赛事超过四条 展示右侧滚动按钮 -->
    <template2 :is_show_btn="matches_featured_list.length >= 4">
      <div @click="toJump(item)" class="featured-matched-card" v-for="(item, index) in col_ols_data" :key="item.tid"
        :class="{ 'margin-box': index != matches_featured_list.length - 1 }">
        <div class="right-top-img" :style="`background-position:0 -${current_ball_type(item.csid)}px`"></div>
        <div class="matches_description">
          <div class="matches_type">{{ item.tn }}</div>
          <div class="matches_time din_font">
            <span>{{ item.course }}</span>
            <span v-show="Number(item.mmp)">{{ item.mstValue }}</span>
          </div>
        </div>
        <div class="club-name">
          <span>{{ item.mhn }}</span><span class="din_font">{{ lodash.get(item.msc, 'S1.home') }}</span>
        </div>
        <div class="union-name">
          <span>{{ item.man }}</span><span class="din_font">{{ lodash.get(item.msc, 'S1.away') }}</span>
        </div>
        <div class="odds_box">
          <div class="top-line"></div>
          <div class="odds_item" v-for="ol_data in item.ols">
            <betItem :ol_data="ol_data"></betItem>
          </div>
        </div>
      </div>
    </template2>
  </div>
</template>
<script setup>
import betItem from "src/base-pc/components/bet-item/bet-item-list-ouzhou-data.vue"
import { get_match_to_map_obj } from 'src/core/match-list-pc/match-handle-data.js'
import CurrentMatchTitle from "src/base-pc/components/match-list/current_match_title.vue";
import { get_hots_odds_list } from 'src/core/match-list-pc/list-template/module/template-101.js'
import { ref, watch, onBeforeUnmount, computed } from 'vue';
import { api_details } from 'src/api';
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import template2 from './template2.vue';
import { MenuData } from "src/core/index.js"
import { useRouter } from "vue-router";
import use_match_list_ws from 'src/core/match-list-pc/composables/match-list-ws.js'
import { MatchDataWarehouse_ouzhou_PC_hots_List_Common, UserCtr } from 'src/core'
const matches_featured_list = ref([])
const router = useRouter();
const { ws_destroyed, set_active_mids } = use_match_list_ws(MatchDataWarehouse_ouzhou_PC_hots_List_Common)
onBeforeUnmount(() => {
  ws_destroyed()
})
// 获取当前header展示背景图
// const current_ball_type = ref(630)
// key值为赛种id value值为对应的背景图y轴坐标
const sport_ball = {
  1: 0,
  2: 1,
  3: 5,
  4: 10,
  5: 6,
  6: 8,
  7: 13,
  8: 2,
  9: 3,
  10: 4,
  11: 12,
  12: 9,
  13: 14,
  14: 15,
  15: 16,
  16: 12,
  17: 20,
  18: '',
  19: 12,
  20: 25,
  21: 13,
  22: 1,
  23: 1,
  24: 1,
  25: 1,
  26: 1,
  27: 1,
  28: 1,
  29: 1,
  30: 1,
  31: 1,
  32: 1,
  37: 1,
  38: 1,
  100: 1,
  101: 1,
  102: 1,
  103: 1,
}

const get_featurd_list = async () => {
  let params = {
    isHot: 1,
    cuid: UserCtr.get_uid()
  }
  let res = await api_details.get_hots(params)
  MatchDataWarehouse_ouzhou_PC_hots_List_Common.set_list(res.data);
  // 获取matches_featured
  // featured_list = filter_featured_list(
  //   MatchDataWarehouse_ouzhou_PC_hots_List_Common.match_list
  // );
  set_active_mids(res.data.map(i => i.mid))
  matches_featured_list.value = MatchDataWarehouse_ouzhou_PC_hots_List_Common.match_list
}
get_featurd_list()
//const current_ball_type = computed((csid = 0) => {
//  console.error("sssssssssss",csid)
//  return sport_ball[csid] || 0
//})

// 每个banner在精灵图中的高度为70
const current_ball_type = csid => {
  return sport_ball[csid] * 70
}


const current_check_betId = ref(MenuData.current_check_betId.value)

// 监听 当前投注项ID的变化
watch(
  MenuData.current_check_betId,
  () => {
    current_check_betId.value = MenuData.current_check_betId.value
  },
)
const col_ols_data = computed(() => {
  return matches_featured_list.value.map((match) => {
    try {
      let { hn, mid } = match;
      let handicap_type = hn || 1
      const many_obj = get_match_to_map_obj(match); //非坑位对象
      const hn_obj = lodash.get(MatchDataWarehouse_ouzhou_PC_hots_List_Common, "list_to_obj.hn_obj", {})
      console.log(get_hots_odds_list(), 'get_hots_odds_list()')
      match.ols = get_hots_odds_list().map(item => {
        // 投注项数据拼接
        // 投注项数据拼接
        let hn_obj_config = MatchDataWarehouse_ouzhou_PC_hots_List_Common.get_list_to_obj_key(mid, `${mid}_${item._hpid}_${handicap_type}_${item.ot}`, 'hn')
        // 获取投注项内容 
        return lodash.get(hn_obj, hn_obj_config) || many_obj[hn_obj_config] || {};

      })
    } catch (e) {
      console.error('deal_width_handicap_ols', e)
      return []
    }
    return match
  })
})

// // 选中当前td 使td高亮 且将投注信息存储到数据仓库中
const checked_current_td = payload => {
  MenuData.current_check_betId.value = payload.ol.oid
  let params = {
    oid: payload.ol.oid, // 投注项id ol_obj
    _hid: payload.hps.hid, // hl_obj 
    _hn: payload.hps.hn,  // hn_obj
    _mid: payload.payload.mid  //赛事id mid_obj
  }
  console.log(payload, params, 'params')
  set_bet_obj_config(params, {})
}

const toJump = (item) => {

  router.push({
    name: "details",
    params: {
      mid: item.mid,
      tid: item.tid,
      csid: item.csid,
    },
  });
}

</script>

<style lang="scss" scoped>
.featured-matched-card-wrap {
  height: 140px;
  width: 100%;

  .featured-matched-card {
    flex-shrink: 0;
    width: 300px;
    height: 140px;
    display: inline-block;
    background: var(--q-gb-bg-c-4);
    padding-top: 8px;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;

    .right-top-img {
      position: absolute;
      right: 0;
      top: 0;
      width: 80px;
      height: 60px;
      background-image: url('src/assets/images/icon_sport_top.png');
      background-size: 80px;
    }

    .matches_description {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      height: 14px;
      padding: 0 14px;

      .matches_type {
        font-family: "Roboto";
        font-size: 12px;
        font-weight: 400;
        line-height: 14px;
        letter-spacing: 0px;
        color: var(--q-gb-t-c-8);
      }

      .matches_time {
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
        font-weight: 500;

        span {
          &:first-child {
            color: var(--q-gb-t-c-8);
            margin-right: 4px;
            font-family: DIN;
            font-size: 12px;
            line-height: 14px;
            letter-spacing: 0px;
            text-align: left;
          }

          &:last-child {
            color: #3D3B37;
            font-family: DIN;
            font-size: 12px;
            line-height: 12px;
            letter-spacing: 0px;
            text-align: right;
          }
        }
      }
    }

    .club-name,
    .union-name {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #3D3B37;
      height: 16px;
      font-size: 14px;
      font-family: "Roboto";
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0px;
      text-align: left;
      padding: 0 14px;

      span {
        &:last-child {
          font-family: DIN;
          font-size: 14px;
          font-weight: 500;
          line-height: 17px;
          letter-spacing: 0px;
          text-align: left;
        }
      }
    }

    .club-name {
      margin-bottom: 8px;
    }

    .union-name {
      margin-bottom: 14px;
    }

    .odds_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      height: 53px;
      padding: 0 14px;
      cursor: pointer;

      .top-line {
        position: absolute;
        top: 0;
        left: 0;
        height: 0.5px;
        background: #000000;
        width: 300px;
        opacity: 0.05;
      }

      .odds_item {
        width: 74px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 2px;
        font-family: DIN;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0px;

        &:hover {
          background: rgba(255, 112, 0, 0.1);
        }

        span {
          &:first-child {
            color: var(--q-gb-t-c-8);
            margin-right: 8px;
          }

          &:last-child {
            // color: #FF7000;
            color: var(--q-gb-t-c-2);
          }
        }
      }

      .checked {
        background: var(--q-gb-bg-c-1);
        // color: #FFFFFF;
        color: var(--q-gb-t-c-1);

        span {
          // color: #FFFFFF !important;
          color: var(--q-gb-t-c-1);
        }

        &:hover {
          background: var(--q-gb-bg-c-1);
        }
      }
    }
  }

  .margin-box {
    margin-right: 10px;
  }
}
</style>
