<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description:玩法模板4  特点：三列无限行（顶部名称固定不可点、包含其他）   例：全场比分、上半场比分等
-->

<template>
  <div class="wrap-template template4" data-template="template4">
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
        <!-- 主队、平局、客队 S-->
        <div
          class="flex-1 overflow-hidden"
          :class="{
            'part-left': cur_index == 0,
            'part-middle': cur_index == 1,
            'part-right': cur_index == 2,
          }"
          v-for="(cur_key, cur_index) in ['home', 'dogfall', 'away']"
          :key="cur_key"
        >
          <div class="sub-title ellipsis" v-if="item_details.title.length">
            {{ lodash.get(item_details, `title[${cur_index}].osn`) }}
          </div>
          <div class="handicap">
            <div
              class="handicap-item"
              :class="`os-${item.os}`"
              v-for="(item, i) in lodash.get(handicap, cur_key, [])"
              :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + i}`"
            >
              <bet-item
                :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + i}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="item"
                :bet_path="{ hl_index: item.hl_index, ol_index: item.ol_index }"
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
        </div>
        <!-- 主队、平局、客队 E-->
      </div>
      <template v-if="lodash.get(other, 'oid')">
        <div class="other-item">
          <div class="placehold"><div class="empty"></div></div>
          <div class="placehold"><div class="empty"></div></div>
          <div
            class="placehold other no_border_bottom"
            :class="`os-${other.os}`"
          >
            <bet-item
              :key="'bet_oid_' + other.oid"
              :match_info="match_info"
              :play_data="item_details"
              :bet_data="other"
              :bet_path="{ hl_index: other.hl_index, ol_index: other.ol_index }"
              bet_source="match_details"
            >
              <div class="bet_handicap ellipsis" style="margin-left: 12px">
                {{ other.on }}
              </div>
            </bet-item>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useCommon } from "../../use-common";
import { computed, ref } from "vue";
import { format_three_data } from "src/output/index.js";
const other = ref({});
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
  toggle_menu,
  curIsShow,
  HandicapTitle,
  lodash,
  betItem,
  isShow,
} = useCommon({ emit, props });

/**
 * @description: 左中右格式化数据
 * @return {undefined} undefined
 */
const formatData = () => {
  let formatData = {
    home: [],
    dogfall: [],
    away: [],
  };
  let title = props.item_details.title;
  if (title.length) {
    let hl = props.item_details.hl;
    hl.forEach((item, i) => {
      item.ol.forEach((list, j) => {
        list.hl_index = i;
        list.ol_index = j;
        if (list.otd == title[0].otd) {
          formatData.home.push(list);
        } else if (list.otd == title[1].otd) {
          formatData.dogfall.push(list);
        } else if (list.otd == title[2].otd) {
          formatData.away.push(list);
        } else {
          other.value = list;
        }
      });
    });
  } else {
    let hl = props.item_details.hl[0].ol;
    hl.forEach((item, i) => {
      item.hl_index = 0;
      item.ol_index = i;
      if (item.otd == -1) {
        other.value = item;
      } else {
        let arr = item.on.split("-");
        if (arr[0] > arr[1]) {
          formatData.home.push(item);
        } else if (arr[0] == arr[1]) {
          formatData.dogfall.push(item);
        } else if (arr[0] < arr[1]) {
          formatData.away.push(item);
        }
      }
    });
  }
};

/**
 * @description: 补充占位符
 * @return {undefined} undefined
 *  (待修改)
 */
const sort_data = () => {
  let res = format_three_data(props.item_details);
  const home_length = res.home.length;
  const away_length = res.away.length;
  const center_length = res.dogfall.length;
  const max_length = Math.max(home_length, away_length, center_length);

  for (var i = 0; i < max_length; i++) {
    if (!res.home[i]) {
      res.home.push("");
    }
    if (!res.away[i]) {
      res.away.push("");
    }

    if (!res.dogfall[i]) {
      res.dogfall.push("");
    }
  }
  other.value = res.other;
  return res;
};
const handicap = computed(() => {
  return sort_data();
});
</script>
<style lang="scss" scoped>
.other-item {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 31px;

  border-radius: 0 0 8px 8px;
  overflow: hidden;
  .placehold {
    flex: 1;
    & > div.empty {
      height: 100%;
      border-right: 1px solid transparent;
    }
  }
}
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
    .handicap {
      .handicap-item:last-child {
        border-bottom: none;
      }
    }
    &:last-child {
      .handicap-item {
        border-right: none !important;
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

.theme02 {
  .other-item {
    .placehold {
      background: rgba(31, 34, 43, 0.5);
    }
  }
}
</style>