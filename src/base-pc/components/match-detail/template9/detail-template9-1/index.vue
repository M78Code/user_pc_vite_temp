<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description: 玩法模板9
-->

<template>
  <div class="wrap-template" data-template="template9" v-if="curIsShow">
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
        <!-- 左 S-->
        <div class="flex-2">
          <div class="sub-title" v-if="item_details.title.length">
            {{ lodash.get(item_details, "title[0].osn") }}
          </div>
          <div class="handicap">
            <div
              class="handicap-item"
              :class="`os-${item.os}`"
              v-for="(item, i) in handicap.home"
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
        <!-- 左 E-->

        <!-- 中 S-->
        <div class="flex-1">
          <div class="sub-title" v-if="item_details.title.length">
            {{ lodash.get(item_details, "title[1].osn") }}
          </div>
          <div class="handicap">
            <div
              class="handicap-item"
              :class="`os-${item.os}`"
              v-for="(item, i) in handicap.dogfall"
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
        <!-- 中 E-->

        <!-- 右 S-->
        <div class="flex-2">
          <div class="sub-title" v-if="item_details.title.length">
            {{ lodash.get(item_details, "title[2].osn") }}
          </div>
          <div class="handicap">
            <div
              class="handicap-item"
              :class="`os-${item.os}`"
              v-for="(item, i) in handicap.away"
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
        <!-- 右 E-->
      </div>

      <!-- 其他 S-->
      <template v-if="lodash.get(other, 'oid')">
        <div class="other-item">
          <div class="handicap-item" :class="`os-${other.os}`">
            <bet-item
              :key="'bet_oid_' + other.oid"
              :match_info="match_info"
              :play_data="item_details"
              :bet_data="other"
              :bet_path="{ hl_index: other.hl_index, ol_index: other.ol_index }"
              bet_source="match_details"
            >
              <div
                class="bet_handicap ellipsis"
                style="margin-left: 15px !important"
              >
                {{ other.on }}
              </div>
            </bet-item>
          </div>
        </div>
      </template>
      <!-- 其他 E-->
    </div>
  </div>
</template>

<script setup>
import { useCommon } from "../../use-common";
import {computed,toRef,ref} from 'vue'
import { format_three_data } from "src/output/index.js";
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

  const other = ref({})

   /**
    * @description: 玩法数据
    * @return {undefined} undefined
    */
   const handicap = computed(()=>{
    return sort_data();
   })

  /**
    * @description: 补充占位符 (待修改)
    * @return {undefined} undefined
    */
  const sort_data=()=> {
      let res = this.format_three_data(props.item_details);
      const home_length = res.home.length;
      const center_length = res.dogfall.length;

      if (home_length > center_length * 2) {
        for (let i = 0; i < home_length / 2 - center_length; i++) {
          res.dogfall.push("");
        }
      } else if (home_length < center_length * 2) {
        for (let i = 0; i < center_length * 2 - home_length; i++) {
          res.home.push("");
          res.away.push("");
        }
      }
      other.value = res.other;
      return res;
    }
</script>
<style lang="scss" scoped>
.other-item {
  height: 26px;
  display: flex;
  justify-content: flex-end;
  margin-right: 15px;
  width: 100%;
  .handicap-item {
    width: 20%;
  }
}
.handicap-sub-title {
  display: flex;
  .sub-title {
    text-align: center;
    height: 30px;
    line-height: 30px;
    background: rgba(31, 34, 43, 0.5);
  }
  .flex-1 {
    flex: 1;
    .handicap {
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
  .flex-2 {
    flex: 2;
    .handicap {
      .handicap-item {
        width: 50%;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        &:nth-child(even) {
          border-right: none;
        }
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
      border-right: none;
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
