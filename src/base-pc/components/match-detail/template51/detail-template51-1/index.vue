<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description:  电竞玩法模板 51    特点：两列一行    例：电竞
-->

<template>
 <div class="wrap-template template51" data-template="template51" v-if="curIsShow">
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
      <template v-if="isShow">
        <div class="handicap" v-for="(item,j) in lodash.get(item_details,'hl')" :key="item.hid">
          <div
            class="handicap-item"
            :class="[`os-${list.os}`, {'no_border_bottom': j > (lodash.get(item_details,'hl').length - 2)}]"
            v-for="(list,i) in item.ol"
            :key="`bet_oid_${list.oid ? list.oid : 'placeholder_' + i}`"
          >
            <bet-item
              :key="`bet_oid_${list.oid ? list.oid : 'placeholder_' + i}`"
              :match_info="match_info"
              :play_data="item_details"
              :bet_data="list"
              :bet_path="{hl_index: j, ol_index: i}"
              bet_source="match_details"
            >
              <div class="bet-item">
                <div class="item-label bet-ellipsis ellipsis">
                  <span class="ellipsis-wrap">{{list.ott}}</span>
                </div>
                <span
                  class="bet_handicap yb-family-odds ellipsis"
                  :class="{'highlight':is_highlight}"
                >{{list.on}}</span>
              </div>
            </bet-item>
          </div>
        </div>
      </template>
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

const {
  sort_index,
  filter_odds,
  toggle_menu,
  curIsShow,
  HandicapTitle,
  lodash,
  betItem,
  isShow
} = useCommon({ emit, props });

</script>
<style lang="scss" scoped>
.expand-match-list {
  .wrap-template {
    .border-r {
      &:first-child {
        border-right: none;
      }
    }
  }
}
.wrap-template {
  display: flex;
  flex-flow: column;
  .main-handicap {
    & > div:last-child {
      border-radius: 0 0 8px 8px;
      overflow: hidden;
    }
  }
  .border-r {
    &:first-child {
      border-right: 2px solid rgba(0, 0, 0, 0.4);
    }
  }
  .handicap-item {
    width: 50%;
  }

  :deep(.c-bet-item.zhuanye .odds) {
    margin-right: 6px;
  }
}
</style>
