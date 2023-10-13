<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description 玩法模板8
-->

<template>
  <div class="wrap-template" data-template="template8">
    <handicap-title
      :index="index"
      :item_details="item_details"
      @sort_index="sort_index(arguments)"
      @click="toggle_menu"
      :is_show="isShow"
      :match_info="match_info"
    ></handicap-title>
    <div class="flex-1" v-if="isShow">
      <!--横向标题 S-->
      <div class="row sub-title-1">
        <span class="col"></span>
        <span
          class="col text-center"
          v-for="(item, index) in lodash.get(item_details,'title')"
          :key="item.otd"
        >{{item.osn}}</span>
      </div>
      <!--横向标题 E-->

      <template v-for="(item, hl_index) in lodash.get(item_details,'hl')"  :key="item.hid">
        <div class="handicap">
          <!--横向标题 S-->
          <div class="handicap-item sub-title-2 yb-family-odds">{{lodash.get(item,'ol[0].on')}}</div>
          <!--横向标题 E-->

          <!-- 投注项 S-->
          <template v-if="lodash.get(item,'ol.length')==1">
            <div class="handicap-item long">
              <bet-item
                :key="`bet_0_${hl_index}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="lodash.get(item,`ol[0]`)"
                :bet_path="{hl_index, ol_index: 0}"
                bet_source="match_details"
              ></bet-item>
            </div>
          </template>

          <template v-if="lodash.get(item,'ol.length')==2">
            <div class="handicap-item" :class="`os-${lodash.get(item,'ol[0].os')}`">
              <bet-item
                :key="`bet_1_${hl_index}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="lodash.get(item,`ol[0]`)"
                :bet_path="{hl_index, ol_index: 0}"
                bet_source="match_details"
              ></bet-item>
            </div>
            <div class="handicap-item" :class="`os-${lodash.get(item,'ol[1].os')}`">
              <bet-item
                :key="`bet_2_${hl_index}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="lodash.get(item,`ol[1]`)"
                :bet_path="{hl_index, ol_index: 1}"
                bet_source="match_details"
              ></bet-item>
            </div>
            <div class="handicap-item"></div>
          </template>

          <template v-if="lodash.get(item,'ol.length')==3">
            <div class="handicap-item" :class="`os-${lodash.get(item,'ol[0].os')}`">
              <bet-item
                :key="`bet_3_${hl_index}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="lodash.get(item,`ol[0]`)"
                :bet_path="{hl_index, ol_index: 0}"
                bet_source="match_details"
              ></bet-item>
            </div>
            <div class="handicap-item" :class="`os-${lodash.get(item,'ol[1].os')}`">
              <bet-item
                :key="`bet_4_${hl_index}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="lodash.get(item,`ol[1]`)"
                :bet_path="{hl_index, ol_index: 1}"
                bet_source="match_details"
              ></bet-item>
            </div>
            <div class="handicap-item" :class="`os-${lodash.get(item,'ol[2].os')}`">
              <bet-item
                :key="`bet_5_${hl_index}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="lodash.get(item,`ol[2]`)"
                :bet_path="{hl_index, ol_index: 2}"
                bet_source="match_details"
              ></bet-item>
            </div>
          </template>
          <!-- 投注项 E-->
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useCommon } from "../../use-common";

const emit = defineEmits(["sort_index", "set_panel_status"]);

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

const { sort_index, filter_odds, toggle_menu, curIsShow, HandicapTitle,lodash,betItem } =
  useCommon({ emit, props });
</script>
<style lang="scss" scoped>
.expand-match-list {
  .handicap-name {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 48px;
  }
}
.wrap-template {
  .sub-title-1 {
    background: rgba(31, 34, 43, 0.5);
    border-bottom: 1px solid rgba(40, 43, 55, 0.5);
    color: #abbac8;
    height: 32px;
    line-height: 32px;
  }
  .sub-title-2 {
    background: rgba(31, 34, 43, 0.5);
    width: 25% !important;
    text-align: center;
    flex: unset !important;
  }
  :deep(.handicap) {
    flex-wrap: wrap;
    .handicap-item {
      flex: unset;
      display: flex;
      justify-content: center;
      flex: 1;
      .c-bet-item {
        .handicap-wrap {
          display: none;
        }
      }
    }
  }

  :deep(.bet-item) {
    margin-left: 5px;
  }
  :deep(.c-bet-item.zhuanye .odds) {
    margin-right: 6px;
  }
}
.long {
  width: 75% !important;
}
</style>
