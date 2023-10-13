<!--
 * @Author: cooper
 * @Date: 2023-08-06 19:40:55
 * @Description:玩法模板2  特点：两列两行   例：上半场让球、全场让球等
-->

<template>
   <div class="wrap-template template2" data-template="template2">
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
        <!-- 全屏模式 横向标题-->
        <div class="row sub-title-1" v-if="$route.params.video_size == 1">
          <span
            style="text-align:center"
            v-for="(item, i) in lodash.get(item_details,'title')"
            :key="i"
          >{{item.osn}}</span>
        </div>
        <div class="handicap" v-for="(item,j) in lodash.get(item_details,'hl')" :key="item.hid">
          <div
            class="handicap-item"
            :class="[`os-${list.os}`, {'no_border_bottom': j > (lodash.get(item_details,'hl').length - 2)}]"
            v-for="(list,i) in item.ol"
            :key="i"
          >
            <bet-item
              :key="`bet_${j}_${i}`"
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
                <div>
                  <span
                    class="bet_handicap yb-family-odds ellipsis"
                    :class="{'highlight':is_highlight}"
                  >{{list.on}}</span>
                </div>
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

const { sort_index,  toggle_menu, HandicapTitle,betItem,isShow,lodash } =
  useCommon({ emit, props });
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
  .border-r {
    &:first-child {
      border-right: 2px solid rgba(0, 0, 0, 0.4);
    }
  }
  .handicap-item {
    width: 50%;
  }

  :deep(.bet-item) {
    margin-left: 5px;
  }
  :deep(.c-bet-item.zhuanye .odds) {
    margin-right: 6px;
  }
}
</style>
