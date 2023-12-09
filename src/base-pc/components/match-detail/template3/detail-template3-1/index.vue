<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description: 玩法模板3 特点：两列一行   例：两队都进球、平局退款、单双、第1局单局获胜等
-->

<template>
 <div class="wrap-template template3" data-template="template3" v-if="curIsShow">
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
      <!-- 模板3 由原来的固定展示两个改为循环 hl hl.ol -->
      <template v-if="isShow">
        <div class="handicap" v-for="(list,j) in lodash.get(item_details, 'hl')" :key="list.hid">
          <div class="handicap-item"
            v-for="(item,i) in list.ol"
            :class="[`os-${lodash.get(list, `ol[${i}].os`)}`, {'no_border_bottom': lodash.get(list, 'ol.length') > 2 ? (i > lodash.get(list, 'ol.length') - (lodash.get(list, 'ol.length')%2 ? 2 : 3)) : j == lodash.get(item_details, 'hl.length') - 1}]"
            :key="`bet_oid_${item?.oid ? item.oid : 'placeholder_' + i}`">
            <bet-item
              :key="`bet_oid_${item?.oid ? item?.oid : 'placeholder_' + i}`"
              :match_info="match_info"
              :play_data="item_details"
              :bet_data="item"
              :bet_path="{hl_index: j, ol_index: i}"
              :team_name="is_eports_csid(match_info?.csid) ? lodash.get(item_details, `title[${i}].osn`) : ''"
              bet_source="match_details"
            >
              <div class="bet-item">
                <div v-if="match_info?.csid == '1011'">{{item?.on}}</div>
                <template v-else>
                  <div class="item-label bet-ellipsis ellipsis">
                    <span :class="['ellipsis-wrap',{'yb-family-odds':[361, 362].includes(+lodash.get(item_details, 'hpid',-1))}]">{{item?.ott}}</span>
                  </div>
                  <span class="ellipsis">{{item?.on}}</span>
                </template>
              </div>
            </bet-item>
          </div>
        </div>
      </template>
      <!-- 投注项 E-->
    </div>
  </div>
</template>

<script setup>
import { useCommon } from "../../use-common";

const emit = defineEmits(["sort_index", "set_panel_status"]);
import { is_eports_csid} from "src/output/index.js"
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

const { sort_index, filter_odds, toggle_menu, curIsShow, HandicapTitle,lodash,betItem,isShow } =
  useCommon({ emit, props });
</script>
<style lang="scss" scoped>
.expand-match-list {
  .handicap {
    flex-wrap: wrap;
    height: auto;
  }
}
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
.main-handicap {
  width: 100%;
  .handicap {
    .handicap-item {
      width: 50%;
      flex: unset;
      &:nth-child(even) {
        border-right: none;
      }
    }
  }
}
</style>