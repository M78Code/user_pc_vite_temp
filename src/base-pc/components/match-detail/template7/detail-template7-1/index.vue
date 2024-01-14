<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description: 玩法模板7    特点：三列一行   例：全场让球胜平负 等
-->

<template>
  <div class="component wrap-template template7" data-template="template7">
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
      <!-- 投注项 S-->
      <template v-if="isShow">
        <div class="handicap" v-for="(list,j) in lodash.get(item_details,'hl')" :key="list.hid">
          <div
            class="handicap-item"
            :class="[`os-${item.os}`, {'no_border_bottom': j > lodash.get(item_details,'hl').length - 2}]"
            v-for="(item,i) in list.ol"
            :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + i}`"
          >
            <bet-item
              :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + i}`"
              :match_info="match_info"
              :play_data="item_details"
              :bet_data="item"
              :bet_path="{hl_index: j, ol_index: i}"
              bet_source="match_details"
            >
              <div class="bet-item">
                <div class="item-label bet-ellipsis ellipsis">
                  <span class="ellipsis-wrap">{{item.ott}}</span>
                </div>
                  <span class="bet_handicap yb-family-odds ellipsis" :class="{'highlight':is_highlight}">{{item.on}}</span>
              </div>
            </bet-item>
          </div>
        </div>
      </template>
      <!-- 投注项 E-->

    </div>
    <!-- 主盘 E-->
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

const { sort_index, filter_odds, toggle_menu, curIsShow, HandicapTitle,lodash ,betItem,isShow} =
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
      width: 33.333%;
      flex: unset;
    }
  }
}
.subjoin-handicap {
  width: 100%;
}
</style>
