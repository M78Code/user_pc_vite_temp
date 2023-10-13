<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description: 玩法模板12
-->

<template>
  <div class="wrap-template template12" data-template="template12">
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
        <!-- 主队 -->
        <template v-if="valid_home">
          <!--横向标题-->
          <div class="row sub-title-1">
            <span style="width: 25%; padding-left: 28px">{{
              lodash.get(match_info, "mhn")
            }}</span>
            <span
              style="width: 37.5%; text-align: center"
              v-for="(item, i) in lodash.get(item_details, 'title')"
              :key="item.otd"
              >{{ item.osn }}</span
            >
          </div>
          <div
            class="handicap"
            v-for="(item, hl_index) in lodash.get(item_details, 'hl')"
            :key="item.hid"
          >
            <template v-if="item.ad1 == '1'">
              <!--纵向标题-->
              <div class="handicap-item sub-title-2 yb-family-odds">
                <span class="ellipsis">{{ lodash.get(item, "ad2") }}</span>
              </div>

              <template v-if="lodash.get(item, 'ol.length') == 2">
                <div
                  class="handicap-item"
                  :class="`os-${lodash.get(item, 'ol[0].os')}`"
                  v-if="
                    lodash.get(item, 'ol[0].otd') ==
                    lodash.get(item_details, 'title[0].otd')
                  "
                >
                  <bet-item
                    :key="`bet_0_${hl_index}`"
                    :match_info="match_info"
                    :play_data="item_details"
                    :bet_data="lodash.get(item, `ol[0]`)"
                    :bet_path="{ hl_index, ol_index: 0 }"
                    bet_source="match_details"
                  >
                    <div class="bet-item highlight">
                      <div>{{ lodash.get(item, "ol[0].on") }}</div>
                    </div>
                  </bet-item>
                </div>

                <div
                  class="handicap-item"
                  :class="`os-${lodash.get(item, 'ol[1].os')}`"
                  v-if="
                    lodash.get(item, 'ol[1].otd') ==
                    lodash.get(item_details, 'title[1].otd')
                  "
                >
                  <bet-item
                    :key="`bet_1_${hl_index}`"
                    :match_info="match_info"
                    :play_data="item_details"
                    :bet_data="lodash.get(item, `ol[1]`)"
                    :bet_path="{ hl_index, ol_index: 1 }"
                    bet_source="match_details"
                  >
                    <div class="bet-item highlight">
                      <div>{{ lodash.get(item, "ol[1].on") }}</div>
                    </div>
                  </bet-item>
                </div>
              </template>

              <template v-if="lodash.get(item, 'ol.length') == 1">
                <div
                  class="handicap-item"
                  :class="
                    lodash.get(item, 'ol[0].otd') ==
                    lodash.get(item_details, 'title[0].otd')
                      ? 'left'
                      : lodash.get(item, 'ol[0].otd') ==
                        lodash.get(item_details, 'title[1].otd')
                      ? 'right'
                      : 'long'
                  "
                >
                  <bet-item
                    :key="`bet_2_${hl_index}`"
                    :match_info="match_info"
                    :play_data="item_details"
                    :bet_data="lodash.get(item, `ol[0]`)"
                    :bet_path="{ hl_index, ol_index: 0 }"
                    bet_source="match_details"
                  >
                    <div class="bet-item highlight">
                      <div>{{ lodash.get(item, "ol[0].on") }}</div>
                    </div>
                  </bet-item>
                </div>
              </template>
            </template>
          </div>
        </template>
        <!-- 主队 -->

        <!-- 客队 -->
        <template v-if="valid_away">
          <!--横向标题-->
          <div class="row sub-title-1">
            <span style="width: 25%; padding-left: 28px">{{
              lodash.get(match_info, "man")
            }}</span>
            <span
              style="width: 37.5%; text-align: center"
              v-for="(item, index) in lodash.get(item_details, 'title')"
              :key="index"
              >{{ item.osn }}</span
            >
          </div>
          <div
            class="handicap"
            v-for="(item, hl_index) in lodash.get(item_details, 'hl')"
            :key="item.hid"
          >
            <template v-if="item.ad1 == '2'">
              <!--纵向标题-->
              <div class="handicap-item sub-title-2 yb-family-odds">
                <span class="ellipsis">{{ lodash.get(item, "ad2") }}</span>
              </div>

              <template v-if="lodash.get(item, 'ol.length') == 2">
                <div
                  class="handicap-item"
                  :class="`os-${lodash.get(item, 'ol[0].os')}`"
                  v-if="
                    lodash.get(item, 'ol[0].otd') ==
                    lodash.get(item_details, 'title[0].otd')
                  "
                >
                  <bet-item
                    :key="`bet_3_${hl_index}`"
                    :match_info="match_info"
                    :play_data="item_details"
                    :bet_data="lodash.get(item, `ol[0]`)"
                    :bet_path="{ hl_index, ol_index: 0 }"
                    bet_source="match_details"
                  >
                    <div class="bet-item highlight">
                      <div>{{ lodash.get(item, "ol[0].on") }}</div>
                    </div>
                  </bet-item>
                </div>

                <div
                  class="handicap-item"
                  :class="`os-${lodash.get(item, 'ol[1].os')}`"
                  v-if="
                    lodash.get(item, 'ol[1].otd') ==
                    lodash.get(item_details, 'title[1].otd')
                  "
                >
                  <bet-item
                    :key="`bet_4_${hl_index}`"
                    :match_info="match_info"
                    :play_data="item_details"
                    :bet_data="lodash.get(item, `ol[1]`)"
                    :bet_path="{ hl_index, ol_index: 1 }"
                    bet_source="match_details"
                  >
                    <div class="bet-item highlight">
                      <div>{{ lodash.get(item, "ol[1].on") }}</div>
                    </div>
                  </bet-item>
                </div>
              </template>

              <template v-if="lodash.get(item, 'ol.length') == 1">
                <div
                  class="handicap-item"
                  :class="
                    lodash.get(item, 'ol[0].otd') ==
                    lodash.get(item_details, 'title[0].otd')
                      ? 'left'
                      : lodash.get(item, 'ol[0].otd') ==
                        lodash.get(item_details, 'title[1].otd')
                      ? 'right'
                      : 'long'
                  "
                >
                  <bet-item
                    :key="`bet_5_${hl_index}`"
                    :match_info="match_info"
                    :play_data="item_details"
                    :bet_data="lodash.get(item, `ol[0]`)"
                    :bet_path="{ hl_index, ol_index: 0 }"
                    bet_source="match_details"
                  >
                    <div class="bet-item highlight">
                      <div>{{ lodash.get(item, "ol[0].on") }}</div>
                    </div>
                  </bet-item>
                </div>
              </template>
            </template>
          </div>
        </template>
        <!-- 客队 -->
      </template>
    </div>
  </div>
</template>

<script setup>
import { useCommon } from "../../use-common";
import { ref, watch } from "vue";

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

const hl_index = ref(0);
const valid_home = ref(false);
const valid_away = ref(false);

watch(
  () => props.item_details,
  (res) => {
    res.hl.forEach((item) => {
      if (item.ad1 == "1" && item.ol.length) {
        valid_home.value = true;
      }
      if (item.ad1 == "2" && item.ol.length) {
        valid_away.value = true;
      }
    });
  },
  { immediate: true }
);
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
