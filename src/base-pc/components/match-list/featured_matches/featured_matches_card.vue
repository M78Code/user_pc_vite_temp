<template>
  <CurrentMatchTitle :title_value="i18n_t('ouzhou.match.featured') + i18n_t('ouzhou.match.matches')"
    v-if="matches_featured_list.length" :show_more_icon="false" />
  <div class="featured-matched-card-wrap" v-if='matches_featured_list.length'>
    <!-- 当热门赛事超过四条 展示右侧滚动按钮 -->
    <template2 :is_show_btn="matches_featured_list.length >= 4">
      <div @click="toJump(item)" class="featured-matched-card" v-for="(item, index) in matches_featured_list"
        :key="item.tid" :class="{ 'margin-box': index != 0 }">
        <div class="right-top-img" :style="compute_css_obj({ key: 'pc-home-icon-sport-top', position: item.csid })"></div>
        <div class="matches_description">
          <div class="matches_type">{{ get_match_item(item.mid)?.tn }}</div>
          <!-- <div class="matches_time din_font">
            <span>{{ item.course }}</span>
            <span v-show="Number(item.mmp)">{{ item.mstValue }}</span>
          </div> -->
          <!-- 比赛进程 -->
          <match-process v-if="item" :match="get_match_item(item.mid)" source='match_list' show_page="match-list"
            :rows="1" :date_rows="1" date_show_type="inline" periodColor="gray" />
        </div>
        <div class="club-name" :class="{ 'bold': get_handicap_index_by(item) == 1 }">
          <span>{{ get_match_item(item.mid)?.mhn }}</span><span class="din_font"
            v-show="get_match_status(get_match_item(item.mid).ms)">{{ get_match_score(get_match_item(item.mid)).home_score
            }}</span>
        </div>
        <div class="union-name" :class="{ 'bold': get_handicap_index_by(item) == 2 }">
          <span>{{ get_match_item(item.mid)?.man }}</span><span class="din_font"
            v-show="get_match_status(get_match_item(item.mid).ms)">{{ get_match_score(get_match_item(item.mid)).away_score
            }}</span>
        </div>
        <div class="odds_box">
          <div class="top-line"></div>
          <div class="odds_item bet-item-wrap-ouzhou" v-for="ol_data in get_col_ols_data(item.mid)"
            :key="ol_data.oid + '_' + ol_data._hpid + '_' + ol_data._ot">
            <betItem :ol_data="ol_data" :csid="item.csid" :pmatch='item' match_data_type="pc_hots_list"></betItem>
          </div>
        </div>
      </div>
    </template2>
  </div>
</template>
<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

import betItem from "src/base-pc/components/bet-item/bet-item-list-ouzhou-data.vue"
import CurrentMatchTitle from "src/base-pc/components/match-list/current_match_title.vue";
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { api_match } from 'src/api';
import template2 from './template2.vue';
import { useRouter, useRoute } from "vue-router";
import use_match_list_ws from 'src/core/match-list-pc/composables/match-list-ws.js'
import { compute_css_obj } from 'src/core/server-img/index.js'
import { MatchDataWarehouse_ouzhou_PC_hots_List_Common, MenuData, SessionStorage, MITT_TYPES, useMittOn, get_match_status } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import { api_bymids } from 'src/core/match-list-pc/composables/match-list-featch.js'
import { get_ouzhou_data_tpl_id, get_handicap_index_by, get_match_to_map_obj, get_match_score } from 'src/core/match-list-pc/match-handle-data.js'
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'

const router = useRouter();
const route = useRoute();
const cache_data = SessionStorage.get('get_hots', []);
if (cache_data.length) {
  MatchDataWarehouse_ouzhou_PC_hots_List_Common.set_list(cache_data);
}
const matches_featured_list = ref(cache_data)
const get_featurd_list = async () => {
  let params = {
    apiType: 1,
    cuid: UserCtr.get_uid(),
    orpt: -1,
    sort: 1,
    euid: '30199',
    selectionHour: null,
    tid: ''
  }
  let res = await api_match.post_fetch_match_list(params)
  if (res.data && res.data.length) {
    const mids = []
    //使用数据仓库的数据 因为ws会推送数据 会改变数据仓库的数据 用本地没有数据变化哦哦
    // matches_featured_list.value=res.data
    // 只显示5条数据
    const five = lodash.get(res, 'data', []).slice(0, 5)
    MatchDataWarehouse_ouzhou_PC_hots_List_Common.set_list(five);
    matches_featured_list.value = []
    five.forEach(match => {
      mids.push(match.mid)
      matches_featured_list.value.push(MatchDataWarehouse_ouzhou_PC_hots_List_Common.get_quick_mid_obj(match.mid))
    })
    // 如果有数据加上特色赛事的高度 防止可视区域计算不对
    MatchListScrollClass.set_special_offset(195, true)
    SessionStorage.set('get_hots', five)
    //查询赔率接口
    api_bymids({ mids }, null, MatchDataWarehouse_ouzhou_PC_hots_List_Common)
    set_active_mids(mids) //添加ws订阅
  }
}
const { ws_destroyed, set_active_mids } = use_match_list_ws(MatchDataWarehouse_ouzhou_PC_hots_List_Common, (mid) => {
  const idx = matches_featured_list.value.findIndex(i => i.mid == mid);
  idx > -1 && get_featurd_list() //如果特色赛事ID已经删除 就重新查询
})
const mitt_list = [useMittOn(MITT_TYPES.EMIT_LANG_CHANGE, get_featurd_list).off]
const get_match_item = (mid) => {
  return MatchDataWarehouse_ouzhou_PC_hots_List_Common.get_quick_mid_obj(mid)
}
const current_check_betId = ref(MenuData.current_check_betId.value)
// 监听 当前投注项ID的变化
watch(
  MenuData.current_check_betId,
  () => {
    current_check_betId.value = MenuData.current_check_betId.value
  },
)
function get_col_ols_data(_mid) {
  const match = MatchDataWarehouse_ouzhou_PC_hots_List_Common.get_quick_mid_obj(_mid)
  let { hn, mid, csid } = match;
  //获取欧洲要显示的数据
  const tpl_id = get_ouzhou_data_tpl_id(csid)
  //101 视图模板 却是对应不同的数据模板ID 所以要重新取
  const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${tpl_id}_config`]
  const hots_odds_list = lodash.cloneDeep(match_tpl_info.get_hots_odds_list())
  let handicap_type = hn || 1
  const many_obj = get_match_to_map_obj(match); //非坑位对象
  const hn_obj = lodash.get(MatchDataWarehouse_ouzhou_PC_hots_List_Common, "list_to_obj.hn_obj", {})
  return hots_odds_list.map(item => {
    // 投注项数据拼接
    // 投注项数据拼接
    let hn_obj_config = MatchDataWarehouse_ouzhou_PC_hots_List_Common.get_list_to_obj_key(mid, `${mid}_${item._hpid}_${handicap_type}_${item.ot}`, 'hn')
    // 获取投注项内容 
    let ols_data = lodash.get(hn_obj, hn_obj_config) || many_obj[hn_obj_config] || {};
    // 15mins 和 featured赛事展示的投注项名称
    return Object.assign({},item,ols_data);
  })
}
// // 选中当前td 使td高亮 且将投注信息存储到数据仓库中
const toJump = (item) => {
  let obj = {
    pre_route : route.name
  }
  MenuData.set_router_info(obj)
  router.push({
    name: "details",
    params: {
      mid: item.mid,
      tid: item.tid,
      csid: item.csid,
    },
  });
}
onBeforeUnmount(() => {
  ws_destroyed()
  mitt_list.forEach(i => i())
})
get_featurd_list()
</script>

<style lang="scss" scoped>
.featured-matched-card-wrap {
  height: 140px;
  width: 100%;
  margin-bottom: 24px;

  .featured-matched-card {
    flex-shrink: 0;
    width: 288px;
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
      background-size: 80px;
    }

    .matches_description {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      height: 14px;
      padding: 0 4px 0 14px;
      justify-content: space-between;

      .matches_type {
        font-family: "Roboto";
        font-size: 12px;
        font-weight: 400;
        line-height: 14px;
        letter-spacing: 0px;
        color: var(--q-gb-t-c-8);
        text-overflow: ellipsis; 
        overflow: hidden;
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

      &.bold {
        color: var(--q-gb-t-c-2);
      }

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
      color: var(--q-gb-t-c-8);
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
        width: 288px;
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

        :deep(.c-bet-item) {
          width: 74px;
          height: 40px;
        }

        // &:hover {
        //   background: rgba(255, 112, 0, 0.1);
        // }

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
    margin-left: 10px;
  }
}
</style>