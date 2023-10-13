<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description:混合玩法模板18  特点：多行title 例：半全场&总进球
-->

<template>
  <div class="wrap-template template18" data-template="template18">
    <handicap-title
      :index="index"
      :item_details="item_details"
      @sort_index="sort_index(arguments)"
      @click="toggle_menu"
      :is_show="isShow"
      :match_info="match_info"
    ></handicap-title>
    <div v-if="isShow">
      <div class="handicap-sub-title">
        <template v-for="(col1, index1) in item_details.title" :key="index1">
          <div class="flex-1 overflow-hidden">
            <template v-for="(col2, index2) in col1" :key="col2.otd || index2">
              <div
                class="sub-title ellipsis"
                v-tooltip="{ content: lodash.get(col2, 'osn'), overflow: 2 }"
              >
                {{ lodash.get(col2, "osn", "") }}
              </div>
              <div class="handicap">
                <div
                  :class="['handicap-item', `os-${item.os}`]"
                  v-for="(item, i) in lodash.get(
                    temp_format_data,
                    `[ols_${index1}_${col2.otd}]`,
                    []
                  )"
                  :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + i}`"
                >
                  <bet-item
                    :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + i}`"
                    :match_info="match_info"
                    :play_data="item_details"
                    :bet_data="item"
                    :bet_path="{
                      hl_index: 0,
                      ol_index: item.ol_index,
                    }"
                    bet_source="match_details"
                    v-if="item"
                  >
                    <div class="bet-item">
                      <div class="bet-ellipsis ellipsis" v-if="item.on">
                        <span class="bet_handicap yb-family-odds">{{
                          item.on
                        }}</span>
                      </div>
                    </div>
                  </bet-item>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommon } from "../../use-common";
import { ref, computed } from "vue";

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
  betItem,
  lodash,
  isShow
} = useCommon({ emit, props });
/**
 * @description: 玩法数据
 * @return {undefined} undefined
 */
const temp_format_data = computed(() => {
  return formatData();
});

/**
 * @description: 左中右格式化数据
 * @return {undefined} undefined
 */
const formatData = () => {
  let title_arr = lodash.get(props, "item_details.title", []);
  let temp_format_data = {};
  lodash.each(title_arr, (col1, index) => {
    lodash.each(col1, (col2) => {
      temp_format_data[`ols_${index}_${col2.otd}`] = filter_temp_data(
        col2.otd
      );
    });
  });
  return temp_format_data;
};
/**
 * @description: 筛选投注项
 * @return {undefined} undefined
 */
const filter_temp_data = (otd) => {
  let data_origin = lodash.get(props, "item_details.hl.0.ol", []);
  let cur_data = [];
  lodash.each(data_origin, (ol, index) => {
    if (otd === ol.otd) {
      ol.ol_index = index;
      cur_data.push(ol);
    }
  });
  return cur_data;
};
</script>
<style lang="scss" scoped>
.handicap-sub-title {
  &:last-child {
    border-radius: 0 0 8px 8px;
    overflow: hidden;
  }
  display: flex;
  .sub-title {
    height: 30px;
    text-align: center;
    line-height: 30px;
  }
  .flex-1 {
    flex: 1;
    &:last-child {
      .handicap {
        .handicap-item {
          border-right: none;
        }
      }
    }
    .handicap:last-child {
      .handicap-item:last-child {
        border-bottom: none;
      }
    }
  }
  .flex-2 {
    flex: 2;
    .handicap {
      .handicap-item {
        width: 100%;
      }
    }
  }
  .handicap {
    flex-wrap: wrap;
    height: auto;
    .handicap-item {
      flex: unset;
      width: 100%;
      height: 31px;
    }
  }
}

.wrap-template {
  :deep(.bet-item) {
    margin-left: 5px;
  }
  :deep(.c-bet-item.zhuanye .odds) {
    margin-right: 6px;
  }
}
</style>
