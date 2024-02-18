<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description: 玩法模板5   特点：三列无数行（顶部名称、左侧名称不可点）   例：全场大小 等
-->

<template>
  <div class="wrap-template template5" data-template="template5">
    <div v-if="!specific">
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
          <!--横向标题-->
          <div class="row sub-title-1">
            <span style="width: 25%"></span>
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
            <!--纵向标题-->
            <div class="handicap-item sub-title-2 yb-family-odds">
              {{ lodash.get(item, "ol[0].on") }}
            </div>
            <template v-for="(ol, index) in lodash.get(item, 'ol', [])">
              <div
                class="handicap-item"
                :class="get_bet_item_class(item_details, item, ol, hl_index)"
                v-if="
                  lodash.get(ol, 'otd') == lodash.get(item_details, `title[${index}].otd`)
                "
                :key="`bet_oid_${ol.oid ? ol.oid : 'placeholder_' + index}`"
              >
                <bet-item
                  :key="`bet_oid_${ol.oid ? ol.oid : 'placeholder_' + index}`"
                  :match_info="match_info"
                  :play_data="item_details"
                  :bet_data="ol"
                  :bet_path="{ hl_index, ol_index: index }"
                  bet_source="match_details"
                ></bet-item>
              </div>
            </template>
          </div>
        </template>
      </div>
      <!-- 主盘 E-->
    </div>

    <div v-else>
      <div class="main-handicap">
        <handicap-title
          :index="index"
          :item_details="item_details"
          @sort_index="sort_index(arguments)"
          @click="toggle_menu"
          :is_show="isShow"
        ></handicap-title>
        <template v-if="isShow">
          <div class="row sub-title-1">
            <!--横向标题-->
            <span style="width: 25%"></span>
            <span
              style="width: 37.5%; text-align: center"
              v-for="(item, i) in lodash.get(item_details, 'title')"
              :key="item.otd"
              >{{ item.osn }}</span
            >
          </div>
          <div
            class="handicap"
            v-for="(item, index) in page_data"
            :key="item.hid"
          >
            <!--纵向标题-->
            <div class="handicap-item sub-title-2 yb-family-odds">
              {{ lodash.get(item[0], "on") }}
            </div>
            <div
              class="handicap-item"
              :class="[
                `os-${data.os}`,
                [1, 2].includes(data.otd) ? '' : 'item-specific',
                { no_border_bottom: index == page_data.length - 1 },
              ]"
              v-for="(data, i) in item"
              :key="`sub_${i}_bet_oid_${
                data.oid ? data.oid : 'placeholder_' + i
              }`"
            >
           
              <bet-item
                :key="`sub_bet_oid_${data.oid ? data.oid : 'placeholder_' + i}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="data"
                :bet_path="{ hl_index, ol_index: data.ol_index }"
                bet_source="match_details"
              ></bet-item>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommon } from "../../use-common";
import lodash from "lodash";
import { ref,watch } from "vue";

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

const { sort_index, filter_odds, toggle_menu,isShow, curIsShow, HandicapTitle,betItem } =
  useCommon({ emit, props });

const page_data = ref([]); //纵向标题
const specific = ref(true);
const hl_index = ref(0);


const get_on = (res) => {
  let arr = [];
  for (var i in res.hl[0].ol) {
    if (!arr.includes(res.hl[0].ol[i].on)) {
      arr.push(res.hl[0].ol[i].on);
    }
  }
  return arr;
};

/**
 * @description: 根据otd排序，处理融合数据顺序错乱问题
 * @param {Obeject} obj 格式化好的投注项数据
 * @return {undefined} 主在前、客在后顺序排序
 */
 const otd_sort = (obj) => {
  if (!obj.length) {
    return obj;
  }

  obj.forEach((item) => {
    item.sort((a, b) => {
      return a.otd - b.otd;
    });
  });
  return obj;
};


watch(()=>props.item_details,res=>{
  if (res.hl[0].ol.length > 2) {
          specific.value = true;
          let on = get_on(res);
          let obj = [];
          if (on.length) {
            for (var i in on) {
              obj.push([]);
            }
            for (var i in res.hl[0].ol) {
              res.hl[0].ol[i].ol_index = i;
              let index = on.indexOf(res.hl[0].ol[i].on);
              obj[index]
                ? obj[index].push(res.hl[0].ol[i])
                : (obj[index] = res.hl[0].ol[i]);
            }
            page_data.value = otd_sort(obj)
          }
        } else {
          specific.value = false;
        }
      },
     { immediate: true},

)

/**
 * @description: 获取投注列样式
 * @param
 * @return {string}
 */
const get_bet_item_class = (item_details, item, ol, hl_index) => {
  let clas = "";
  if (lodash.get(item, "ol.length") == 1) {
    if (lodash.get(ol, "otd") == lodash.get(item_details, `title[0].otd`)) {
      clas = "left";
    } else if (
      lodash.get(ol, "otd") == lodash.get(item_details, `title[1].otd`)
    ) {
      clas = "right";
    } else {
      clas = "long";
    }
  } else {
    clas = `os-${lodash.get(ol, "os")}`;
    if (hl_index == lodash.get(item_details, "hl").length - 1) {
      clas += ` no_border_bottom`;
    }
  }
  return clas;
};

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
  .sub-title-1 {
    height: 32px;
    line-height: 32px;
  }
  .sub-title-2 {
    //background: rgba(31, 34, 43, 0.5);
    width: 25% !important;
    text-align: center;
    flex: unset !important;
    //background: red !important;
    //background: var(--q-gb-bg-c-22) !important;
    // to do use key
    background: #fcfcfc;
    //background: #fcfcfc !important;
    padding: 5px !important;
    background-clip: content-box !important;
  }
  :deep(.handicap) {
    flex-wrap: wrap;
    justify-content: flex-start;
    &:last-child {
      .yb-family-odds {
        border-bottom: none;
      }
    }
    .handicap-item {
      flex: unset;
      display: flex;
      justify-content: center !important;
      width: 37.5%;
      // 暂时先注释，不清楚为啥写这个
      // border-right: 6px solid var(--q-gb-bd-c-13) !important;
      // border-bottom: 6px solid var(--q-gb-bd-c-13) !important;
      // border-left: 6px solid var(--q-gb-bd-c-13) !important;
      &:last-child {
        border-right: none;
      }
      .c-bet-item {
        .handicap-wrap {
          display: none;
        }
      }
      &.item-specific {
        flex: 1;
        width: 100%;
      }
      &.right {
        float: right;
      }
      &.long {
        flex: 1;
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
</style>
