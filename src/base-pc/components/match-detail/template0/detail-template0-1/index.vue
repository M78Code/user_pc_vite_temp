<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description:详情页玩法模板-0  玩法模板0  特点：两列无数行  例：独赢&进球大小 、准确进球数等
-->

<template>
  <div
    class="wrap-template template0"
    data-template="template0"
    v-if="curIsShow"
  >
    <!-- 主盘 S-->
    <div class="main-handicap">
      <handicap-title
        :index="index"
        :item_details="item_details"
        @sort_index="sort_index(arguments)"
        @click="toggle_menu"
        :is_show="isShow"
        :match_info="match_info"
      ></handicap-title>
      <!-- isShow玩法是否折叠 -->
      <template v-if="isShow">
        <div
          class="handicap"
          v-for="(list, j) in lodash.get(item_details, 'hl')"
          :key="list.hid"
        >
          <template v-for="(item, i) in list.ol">
            <!-- os参数： 1开盘、2封盘、3关盘、4锁盘 -->
            <div
              class="handicap-item"
              v-if="item?.os != 3"
              :class="[
                `os-${item?.os}`,
                {
                  no_border_bottom:
                    i > lodash.get(list, 'ol.length') - 3 &&
                    j > lodash.get(item_details, 'hl.length') - 2,
                },
              ]"
              :key="`bet_oid_${item?.oid ? item.oid : 'placeholder_' + i}`"
            >
              <!--osn：投注项显示名称，空则不需要显示 -->
              <bet-item
                :key="`bet_oid_${item?.oid ? item.oid : 'placeholder_' + i}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="item"
                :bet_path="{ hl_index: j, ol_index: i }"
                :team_name="
                 is_eports_csid(match_info?.csid)
                    ? lodash.get(item_details, `title[${i}].osn`)
                    : ''
                "
                bet_source="match_details"
              >
                <div class="bet-item">
                  <!-- csid 球类id 虚拟赛狗1002 虚拟赛马1011 虚拟摩托1010 泥地摩托车1009-->
                  <div
                    v-if="
                      ['1002', '1011', '1010', '1009'].includes(match_info?.csid)
                    "
                    class="rank-no"
                    :class="`ranking-bg-style1-${item?.ot} csid-${match_info?.csid}`"
                  ></div>
                  <div class="item-label bet-ellipsis ellipsis">
                    <!-- ott 展示用的和title一样 -->
                    <span
                      :class="[
                        'ellipsis-wrap',
                        {
                          'yb-family-odds': [361, 362].includes(
                            +lodash.get(item_details, 'hpid', -1)
                          ),
                        },
                      ]"
                      >{{ item.ott }}</span
                    >
                    <!-- hpid 玩法id -->
                    <span
                      v-if="
                        [
                          '13',
                          '102',
                          '171',
                          '216',
                          '20006',
                          '20010',
                          '20025',
                          '20026',
                          '20031',
                        ].includes(lodash.get(item_details, 'hpid'))
                      "
                      class="bet_handicap yb-family-odds"
                      :class="{ normal_color: item?.on.indexOf('&') > -1 }"
                      v-html="
                        item?.on.indexOf('&') > -1
                          ? filter_odds(item?.on)
                          : item?.on
                      "
                    ></span>
                    <!-- on 投注项显示值 例：on: "0-1"  on: "莱昂 & 大 3.5"-->
                    <span
                      v-else
                      class="bet_handicap yb-family-odds"
                      :class="{
                        normal_color: lodash.get(item_details, 'hpid') == 31,
                      }"
                      >{{ item?.on }}</span
                    >
                  </div>
                </div>
              </bet-item>
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- 主盘 E-->
  </div>
</template>

<script setup>
import { useCommon } from "../../use-common";
import {is_eports_csid} from 'src/output/index.js';
const emit = defineEmits(["sort_index", "set_panel_status"]);
import betItem from "src/base-pc/components/bet-item/bet_item.vue";
const props = defineProps({
  match_info: Object, //赛事详情
  screen: String, //match-detail详情页，match-list列表右侧
  item_details: Object, //玩法模板数据
  bet_path: {
    //投注项
    type: Object,
    default: () => {
      return {
        hl_index: -1,
        ol_index: -1,
      };
    },
  },
  index: Number, //排序下标
  reset_toggle: Number, //重置数据
  is_highlight: Number, //赔率高亮
  panel_status: String, //列表展开收起
});

const { sort_index, filter_odds, toggle_menu, curIsShow, HandicapTitle,lodash,isShow } =
  useCommon({ emit, props });
</script>
<style lang="scss" scoped>
.wrap-template {
  display: flex;
  flex-flow: wrap;
  .handicap {
    flex-wrap: wrap;
  }

  :deep(.bet-item) {
    margin-left: 5px;
  }
  :deep(.c-bet-item.zhuanye .odds) {
    margin-right: 6px;
  }
}
.main-handicap,
.subjoin-handicap {
  width: 100%;
  .handicap {
    .handicap-item {
      width: 50%;
      flex: unset;
    }
  }
}
.subjoin-handicap {
  width: 100%;
}

.main-handicap {
  .handicap {
    .handicap-item:nth-child(even) {
      border-right: none !important;
    }
  }
}
</style>