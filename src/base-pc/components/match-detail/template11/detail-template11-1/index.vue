<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description:玩法模板11   特点：五列无数行  例：VR虚拟赛狗-前二组合、准确前二等
-->

<template>
  <div class="wrap-template" data-template="template11">
    <handicap-title
      :index="index"
      :item_details="item_details"
      @sort_index="sort_index(arguments)"
      @click="toggle_menu"
      :is_show="isShow"
      :match_info="match_info"
    ></handicap-title>

    <div class="handicap" v-if="isShow">
      <div
        class="handicap-item"
        :class="[
          `os-${item?.os}`,
          { 'no_border-right': (i + 1) % 5 == 0 },
          {
            'border-right':
              i >=
              lodash.get(item_details, 'hl[0].ol.length') -
                (_lodash.get(item_details, 'hl[0].ol.length') % 5),
          },
          { no_border_bottom: i >= renderBorder },
        ]"
        v-for="(item, i) in lodash.get(item_details, 'hl[0].ol')"
        :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + i}`"
      >
        <bet-item
          :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + i}`"
          :match_info="match_info"
          :play_data="item_details"
          :bet_data="item"
          :bet_path="{ hl_index: 0, ol_index: i }"
          bet_source="match_details"
        >
          <div class="bet-item">
            <div class="item-label bet-ellipsis ellipsis">
              <div
                v-if="
                  ['1002', '1011', '1010', '1009'].includes(match_info.csid)
                "
                class="ranking-nos"
              >
                <div
                  class="rank-no"
                  v-for="(_item, _i) in format_ranking(item.ot)"
                  :key="_i"
                  :class="_item"
                ></div>
              </div>
            </div>
          </div>
        </bet-item>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommon } from "../../use-common";
import { computed } from "vue";

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

const { sort_index, filter_odds,format_ranking, toggle_menu, curIsShow,betItem, HandicapTitle,lodash } =
  useCommon({ emit, props });

const renderBorder = computed(() => {
  let length = lodash.get(props.item_details, "hl[0].ol.length");
  return length % 5 == 0 ? length - 5 : length - (length % 5);
});
</script>
<style lang="scss" scoped>
.wrap-template {
  .handicap {
    flex-wrap: wrap;
    line-height: 1;
    justify-content: left;
    border-radius: 0 0 8px 8px;
    overflow: hidden;
    .handicap-item {
      width: 20%;
      flex: unset;
    }
    .no_border-right {
      border-right: none !important;
    }
    :deep(.c-bet-item) {
      height: 100%;
      .bet-inner {
        .handicap-wrap {
          margin: 0;
          .rank-no {
            width: 16px;
            height: 16px;
            margin-right: 1px;
          }
        }
        .yb-family-odds {
          padding: 0 5px;
          height: 13px;
          line-height: 1;
        }
      }
    }
  }
}
</style>
