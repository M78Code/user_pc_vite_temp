<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description: 玩法模板6   特点：两列无限行（顶部名称不可点）   例：网球-全场比分 等
-->

<template>
  <div class="wrap-template template6" data-template="template6">
    <div class="main-handicap">
      <handicap-title
        :index="index"
        :item_details="item_details"
        @sort_index="sort_index(arguments)"
        @click="toggle_menu"
        :is_show="isShow"
        :match_info="match_info"
      ></handicap-title>
      <div v-if="isShow">
        <div class="sub-title">
          <span
            class="ellipsis"
            v-for="(item, i) in lodash.get(item_details, 'title')"
            :key="item.otd"
            >{{ item.osn }}</span
          >
        </div>

        <div class="group">
          <!-- 左 S-->
          <div class="flex-1">
            <div class="handicap">
              <div
                class="handicap-item"
                v-for="(item, index) in formatData.home"
                :class="[
                  `os-${item.os}`,
                  {
                    no_border_bottom:
                      index == lodash.get(formatData, 'home').length - 1 &&
                      !other.length,
                  },
                ]"
                :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + index}`"
              >
                <bet-item
                  :key="`bet_oid_${
                    item.oid ? item.oid : 'placeholder_' + index
                  }`"
                  :match_info="match_info"
                  :play_data="item_details"
                  :bet_data="item"
                  :bet_path="{
                    hl_index: item.hl_index,
                    ol_index: item.ol_index,
                  }"
                  bet_source="match_details"
                  v-if="item"
                >
                  <div class="bet-item">
                    <div class="item-label bet-ellipsis ellipsis">
                      <span class="ellipsis-wrap">{{ item.ott }}</span>
                      <span class="on-text">{{ item.on }}</span>
                    </div>
                  </div>
                </bet-item>
              </div>
            </div>
          </div>
          <!-- 左 E-->

          <!-- 右 S-->
          <div class="flex-1">
            <div class="handicap">
              <div
                class="handicap-item"
                v-for="(item, index) in formatData.away"
                :class="[
                  `os-${item.os}`,
                  {
                    no_border_bottom:
                      index == lodash.get(formatData, 'away').length - 1 &&
                      !other.length,
                  },
                ]"
                :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + index}`"
              >
                <bet-item
                  :key="`bet_oid_${
                    item.oid ? item.oid : 'placeholder_' + index
                  }`"
                  :match_info="match_info"
                  :play_data="item_details"
                  :bet_data="item"
                  :bet_path="{
                    hl_index: item.hl_index,
                    ol_index: item.ol_index,
                  }"
                  bet_source="match_details"
                  v-if="item"
                >
                  <div class="bet-item">
                    <div class="item-label bet-ellipsis ellipsis">
                      <span class="ellipsis-wrap">{{ item.ott }}</span>
                      <span class="on-text">{{ item.on }}</span>
                    </div>
                  </div>
                </bet-item>
              </div>
            </div>
          </div>
          <!-- 右 E-->
        </div>

        <!-- 其他 S-->
        <template v-if="other.length">
          <div class="handicap other-wrap" v-for="(list, i) in other" :key="i">
            <div class="other-item placehoder"></div>
            <div
              class="other-item"
              :class="[`os-${list.os}`, 'no_border_bottom']"
            >
              <bet-item
                :key="`bet_oid_${list.oid ? list.oid : 'placeholder_' + i}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="list"
                :bet_path="{ hl_index: list.hl_index, ol_index: list.ol_index }"
                bet_source="match_details"
              >
                <div class="bet-item" style="margin-left: 7px">
                  {{ list.on }}
                </div>
              </bet-item>
            </div>
          </div>
        </template>
        <!-- 其他 E-->
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommon } from "../../use-common";
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

const { sort_index, filter_odds, toggle_menu, curIsShow, HandicapTitle,lodash,betItem,isShow } =
  useCommon({ emit, props });

const formatData = ref({}); //主客队投注项
const other = ref([]); //其他
const is_sort = ref(false); //是否有排序

watch(()=>props.item_details,res=>{
   // 格式化投注项，主队、客队、其他
   let formatDa = {
          home: [],
          away: [],
        };
        let other_ = [];
        let title = res.title;
        if (title.length) {
          res.hl.forEach((item, i) => {
            item.ol.forEach((list, j) => {
              list.hl_index = i;
              list.ol_index = j;
              if (list.otd == title[0].otd) {
                formatDa.home.push(list);
              } else if (list.otd == title[1].otd) {
                formatDa.away.push(list);
              } else {
                other_.push(list);
              }
            });
          });

          //主客队投注项总数补成一致
          let max_length = Math.max(
            formatDa.home.length,
            formatDa.away.length
          );
          for (var i = 0; i < max_length; i++) {
            if (!formatDa.home[i]) {
              formatDa.home.push("");
            }
            if (!formatDa.away[i]) {
              formatDa.away.push("");
            }
          }
          formatData.value = formatDa;

          //根据赔率排序
          other.value = other_.sort((a, b) => {
            return a.ov - b.ov;
          });
        }
      },
      {immediate: true}
)

 /**
    * @description: 球员玩法按赔率大小排序
    * @param {Object} data 主客队投注项，
    * @return {undefined} 赔率升序的投注项
    */
   const size_sort =(data)=>{
    let {home, away} = data
    if(is_sort.value){
      data.home = home.sort((a, b) => {
        return a.index - b.index;
      })
      data.away = away.sort((a, b) => {
        return a.index - b.index;
      })

    } else {
      data.home = home.sort((a, b) => {
        return a.ov - b.ov;
      })
      data.away = away.sort((a, b) => {
        return a.ov - b.ov;
      })
    }
    return data
   }
</script>
<style lang="scss" scoped>
.sub-title {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 30px;
  line-height: 30px;
  span {
    flex: 1;
    text-align: center;
  }
}
.group {
  display: flex;
  .flex-1 {
    flex: 1;
    width: 50%;
    .handicap {
      display: block;
      .handicap-item {
        flex: unset;
        width: 100%;
        height: 34px;
        .on-text {
          margin-left: 7px;
        }
      }
    }
  }
}
.other-wrap {
  width: 100%;

  overflow: hidden;
  &:last-child {
    border-radius: 0 0 8px 8px;
    .other-item {
      border-bottom: none;
    }
  }
  .other-item {
    display: flex;
    align-items: center;
    width: 50%;
    height: 34px;

    border-right: 1px solid #ebecf3;
    &:last-child {
      border-right: none;
    }
  }
}
.theme01 {
  .main-handicap {
    .other-wrap:not(:last-child) {
      .no_border_bottom {
        border-bottom: 1px solid #f3f4f8 !important;
      }
    }
  }
}
.theme02 {
  .other-item {
    border-right: 1px solid #282b37;
  }
}
</style>
