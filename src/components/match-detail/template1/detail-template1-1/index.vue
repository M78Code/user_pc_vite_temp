<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description:玩法模板1    特点：三列一行 例：全场独赢、第3个进球等
-->

<template>
  <div
    class="wrap-template template1"
    data-template="template1"
    v-if="curIsShow"
  >
    <handicap-title
      :index="index"
      :item_details="item_details"
      @sort_index="sort_index(arguments)"
      @click="toggle_menu"
      :is_show="isShow"
      :match_info="match_info"
    ></handicap-title>
    <!-- 投注项 S-->
    <div class="handicap" v-if="isShow">
      <div
        v-for="index in [0, 1, 2]"
        :key="index"
        class="handicap-item"
        :class="[
          `os-${lodash.get(item_details, `hl[0].ol[${index}].os`)}`,
          'no_border_bottom',
        ]"
      >
        <bet-item
          :key="`bet_0_${index}`"
          :match_info="match_info"
          :play_data="item_details"
          :bet_data="lodash.get(item_details, `hl[0].ol[${index}]`)"
          :bet_path="{ hl_index: 0, ol_index: index }"
          bet_source="match_details"
        >
          <div class="bet-item">
            <div class="item-label bet-ellipsis ellipsis">
              <span class="ellipsis-wrap">{{
                lodash.get(item_details, `hl[0].ol[${index}].ott`)
              }}</span>
              <span class="ellipsis-wrap">{{
                lodash.get(item_details, `hl[0].ol[${index}].on`)
              }}</span>
            </div>
          </div>
        </bet-item>
      </div>
    </div>
    <!-- 投注项 E-->
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

const { sort_index, toggle_menu, curIsShow, HandicapTitle,lodash,betItem,isShow } =
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
  .handicap {
    &:last-child {
      border-radius: 0 0 8px 8px;
      overflow: hidden;
    }
    .handicap-item {
      width: 33.33%;
    }
  }
  :deep(.bet-item) {
    margin-left: 5px;
  }
  :deep(.c-bet-item.zhuanye .odds) {
    margin-right: 6px;
  }
}
</style>
