<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description:玩法模板10
-->

<template>
  <div class="wrap-template template10" data-template="template10">
    <handicap-title
      :index="index"
      :item_details="item_details"
      @sort_index="sort_index(arguments)"
      @click="toggle_menu"
      :is_show="isShow"
      :match_info="match_info"
    ></handicap-title>

    <div class="handicap" v-if="isShow">
      <template
        v-if="
          !lodash.get(item_details, 'title').length &&
          lodash.get(match_info, 'csid') * 1 < 1000
        "
      >
        <div class="handicap-layout">
          <div
            class="handicap-item"
            v-for="(item, index) in handicap_data[0]"
            :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + index}`"
            :class="`os-${item.os}`"
          >
            <bet-item
              :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + index}`"
              :match_info="match_info"
              :play_data="item_details"
              :bet_data="item"
              :bet_path="{ hl_index: 0, ol_index: item.ol_index }"
              bet_source="match_details"
            >
              <div class="bet-item rank_nos">
                <div
                  v-if="['1002', '1011', '1010'].includes(match_info?.csid)"
                  class="ranking-nos"
                >
                  <div
                    class="rank-no"
                    v-for="(_item, _i) in format_ranking(item.ot)"
                    :key="_i"
                    :class="_item"
                  ></div>
                </div>
                <span class="ellipsis">{{ item.on }}</span>
              </div>
            </bet-item>
          </div>
        </div>
        <div class="handicap-layout">
          <div
            class="handicap-item"
            v-for="(item, index) in handicap_data[1]"
            :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + index}`"
            :class="`os-${item.os}`"
          >
            <bet-item
              :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + index}`"
              :match_info="match_info"
              :play_data="item_details"
              :bet_data="item"
              :bet_path="{ hl_index: 0, ol_index: item.ol_index }"
              bet_source="match_details"
            >
              <div class="bet-item">
                <div
                  v-if="['1002', '1011', '1010'].includes(match_info?.csid)"
                  class="ranking-nos"
                >
                  <div
                    class="rank-no"
                    v-for="(_item, _i) in format_ranking(item.ot)"
                    :key="_i"
                    :class="_item"
                  ></div>
                </div>
                <span class="ellipsis">{{ item.on }}</span>
              </div>
            </bet-item>
          </div>
        </div>
        <div class="handicap-layout">
          <div
            class="handicap-item"
            v-for="(item, index) in handicap_data[2]"
            :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + index}`"
            :class="`os-${item.os}`"
          >
            <bet-item
              :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + index}`"
              :match_info="match_info"
              :play_data="item_details"
              :bet_data="item"
              :bet_path="{ hl_index: 0, ol_index: item.ol_index }"
              bet_source="match_details"
            >
              <div class="bet-item">
                <div
                  v-if="['1002', '1011', '1010'].includes(match_info?.csid)"
                  class="ranking-nos"
                >
                  <div
                    class="rank-no"
                    v-for="(_item, _i) in format_ranking(item.ot)"
                    :key="_i"
                    :class="_item"
                  ></div>
                </div>
                <span class="ellipsis">{{ item.on }}</span>
              </div>
            </bet-item>
          </div>
        </div>

        <div class="layout-line" v-if="handicap_data[3].length">
          <div class="handicap-item"><div class="empty"></div></div>
          <div class="handicap-item"><div class="empty"></div></div>
          <div
            class="handicap-item"
            v-for="(item, index) in handicap_data[3]"
            :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + index}`"
            :class="`os-${item.os}`"
          >
            <bet-item
              :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + index}`"
              :match_info="match_info"
              :play_data="item_details"
              :bet_data="item"
              :bet_path="{ hl_index: 0, ol_index: item.ol_index }"
              bet_source="match_details"
            >
              <div class="bet-item">
                <div
                  v-if="['1002', '1011', '1010'].includes(match_info?.csid)"
                  class="ranking-nos"
                >
                  <div
                    class="rank-no"
                    v-for="(_item, _i) in format_ranking(item.ot)"
                    :key="_i"
                    :class="_item"
                  ></div>
                </div>
                <span class="ellipsis">{{ item.on }}</span>
              </div>
            </bet-item>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          class="handicap-item base-item"
          v-for="(item, index) in lodash.get(item_details, 'hl[0].ol')"
          :key="`title-${index}`"
          :class="[
            `os-${item.os}`,
            {
              no_border_bottom:
                index > lodash.get(item_details, 'hl[0].ol').length - 4,
            },
            { no_border_right: (index + 1) % 3 == 0 },
          ]"
        >
          <bet-item
            :key="`bet_4_${index}`"
            :match_info="match_info"
            :play_data="item_details"
            :bet_data="item"
            :bet_path="{ hl_index: 0, ol_index: index }"
            bet_source="match_details"
          >
            <div class="bet-item">
              <div
                v-if="['1002', '1011', '1010'].includes(match_info?.csid)"
                class="ranking-nos"
              >
                <div
                  class="rank-no"
                  v-for="(_item, _i) in format_ranking(item.ot)"
                  :key="_i"
                  :class="_item"
                ></div>
              </div>
              <span class="ellipsis" :class="{ 'on-text': item.ott }">{{
                item.ott || item.on
              }}</span>
            </div>
          </bet-item>
        </div>
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
  format_ranking,
  toggle_menu,
  curIsShow,
  HandicapTitle,
  betItem,
  lodash,
  isShow
} = useCommon({ emit, props });

const handicap_data = ref([]);
/**
 * @description: 投注项补空
 */
 const format_handicap = (data) => {
  const home_length = data[0].length;
  const away_length = data[2].length;
  const center_length = data[1].length;
  const max_length = Math.max(home_length, away_length, center_length);

  for (var i = 0; i < max_length; i++) {
    if (!data[0][i]) {
      data[0].push("");
    }
    if (!data[2][i]) {
      data[2].push("");
    }

    if (!data[1][i]) {
      data[1].push("");
    }
  }
  return data;
};
watch(
  () => props.item_details,
  (res) => {
    if (props.match_info?.csid == "1001") {
      let ol = lodash.get(res, "hl[0].ol");
      if (ol && ol.length % 3) {
        for (var i = 0; i < Math.ceil(ol.length / 3) * 3 - ol.length + 1; i++) {
          res.hl[0].ol.push("");
        }
      }
      return false;
    }

    if (lodash.get(res, "title").length) return false;

    let data = lodash.get(res, "hl[0].ol");
    let handicap_data_ = [[], [], [], []];
    data.forEach((item, i) => {
      if (item.os != 3) {
        if (item.otd == 1) {
          item.ol_index = i;
          handicap_data_[0].push(item);
        } else if (item.otd == 0) {
          item.ol_index = i;
          handicap_data_[1].push(item);
        } else if (item.otd == 2) {
          item.ol_index = i;
          handicap_data_[2].push(item);
        } else if (item.otd == -1) {
          item.ol_index = i;
          handicap_data_[3].push(item);
        }
      }
    });
    handicap_data.value = format_handicap(handicap_data_);
  },
  { immediate: true, deep: true }
);


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
    flex-wrap: wrap;
    .handicap-layout {
      flex: 1;
    }
    .base-item {
      width: 33.333%;
      flex: unset;
    }
    .layout-line {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      .handicap-item {
        flex: 1 1 33.33%;
        border-right: none;
        .empty {
          width: 100%;
          height: 100%;
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

.handicap {
  .no_border_right {
    border-right: none !important;
  }
}
</style>
