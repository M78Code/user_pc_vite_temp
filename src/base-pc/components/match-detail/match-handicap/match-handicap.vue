<!--
 * @Author: Coopoer
 * @Date: 2020-08-15 17:13:55
 * @Description: 玩法模板条件加载 详情页面 玩法集下面的玩法 列表
-->
<template>
  <div class="component wrap-handicap relative-position">
    <div class="template-handicap" id="_handicap_list_wrap"> 
      <!-- 详情玩法列表容器，盘口关闭时会隐藏 -->
      <div class="details_data" v-if="showDetails">
        <div
          class="group-flex"
          id="_handicap_list"
          :class="{ double: get_layout_statu }"
        >
          <!-- waterfall 外层循环控制1栏布局和2栏布局 -->
        <!-- {{ waterfall }} -->
          <div
            class="group-template icontainer column"
            v-for="(list, index) in waterfall"
            :key="index"
          >
            <!--<div v-for="(item, i) in list" :key="`${index}_${i}`" class="template">-->
            <div
              v-for="item in list"
              :key="`hpid_${item.hpid}_topKey_${item.topKey}`"
              v-show="is_component_show(item)"
              class="template"
              :style="{
                'order': -Number(item.hton?.substring(4))
              }"
            >
              <!-- <div>{{ plays_list }}----{{ item.hpt }}---{{ item.chpid }}---{{ item.hpn }}---{{ currentRound }}</div> -->
              <div v-show="is_component_show(item)">
                <!--修改全场让球赛果为有附加盘时不出现的问题 item.hpt == 1|| ['3'].includes(item.hpid)-->
                <component
                  v-if="
                    item.show_hl &&
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 51].includes(
                      +item.hpt
                    )
                  "
                  :is="`template${item.hpt}`"
                  :key="`hpid_${item.hpid}_topKey_${item.topKey}`"
                  :item_details="item"
                  :match_info="match_info"
                  :index="item.index"
                  :reset_toggle="reset_toggle"
                  :is_highlight="item.hlf"
                  @sort_index="sort_index"
                  :panel_status="panel_status"
                  :class="{ is_rang: rang.includes(item.hpid * 1) }"
                ></component>
              </div>
            </div>
          </div>
        </div>
        <!-- 详情页下方文案和返回顶部按钮 -->
        <div
          v-show="
            ['details', 'virtual_details'].includes(route.name) &&
            lodash.get(waterfall, '[0].length')
          "
          style="margin-top: 20px"
        >
          <div style="height: 152px">
            <go-top
              v-if="has_thumb"
              @on_go_top="on_go_top"
              class="to-top"
            ></go-top>
          </div>
        </div>
        <div class="null-bg" v-show="route.name != 'details'"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import match_handicap from "src/base-pc/components/match-detail/match-handicap/match-handicap.js";
import { useMethods } from "./use-methods";
export default defineComponent({
  mixins: [match_handicap], //引入玩法组件
  emit :[
      "set_handicap_state",
      "on_go_top",
      "set_handicap_this",
    ],
  setup(props, context) {
    console.log(context,'context');
    // const emit = defineEmits([
    //   "set_handicap_state",
    //   "on_go_top",
    //   "set_handicap_this",
    // ]);
    console.log(context.emit,'emit11');
 
    //  ============================数据===================
    const {
      showDetails,
      reset_toggle,
      rang,
      panel_status,
      get_layout_statu,
      waterfall,
      route,
      has_thumb,
      is_component_show,
      sort_index,
      on_go_top,
      lodash
    } = useMethods({
      props,
      emit:context.emit,
    });
    return {
      showDetails,
      reset_toggle,
      rang,
      panel_status,
      get_layout_statu,
      waterfall,
      has_thumb,
      is_component_show,
      sort_index,
      on_go_top,
      route,
      lodash
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
