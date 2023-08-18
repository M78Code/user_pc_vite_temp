<!--
 * @Author: Amor
 * @Date: 2020-09-05 20:13:44
 * @Description: 详情区--玩法集 Tab 选项
-->
<template>
  <div
    v-if="handicap_this && handicap_this.category_list.length"
    class="scroll-fixed-header wrap-tabs"
  >
    <div class="tabs-panel relative-position" ref="warp">
      <tab
        ref="tab"
        :list="handicap_this.category_list"
        :is_show_btn="is_details"
        tab_name_key="marketName"
        @onclick="toggle_play"
        :currentIndex="currentIndex"
        :is_drag="!is_details"
      />
      {{ handicap_this.category_list.length }}
    </div>
    <!-- 详情右侧 排序、单列、双列 || 右侧详情视频区域-->
    <div v-if="is_details || whitchDetail == 'rightDetails'" class="row">
      <div class="right-icons" @click="handicap_this.toggle_panel">
        <icon
          :name="
            handicap_this.panel_status == 'hide' ? 'icon-open' : 'icon-hide'
          "
          color="#5A6074"
          size="14px"
        />
        <q-tooltip
          anchor="top middle"
          self="center middle"
          :content-style="tooltip_style"
          >{{
            handicap_this.panel_status == "hide"
              ? $t("icon_tips.unfold")
              : $t("icon_tips.fold")
          }}</q-tooltip
        >
        <!-- 展开：收起 -->
      </div>
      <!-- 一栏/两栏布局按钮在页面宽度 < 1680 的时候和内嵌版里不展示 -->
      <div
        class="tabs-handel"
        v-if="
          handicap_this.check_half() &&
          handicap_this.get_layout_list_size.width >= 1680
        "
      >
        <span>
          <icon
            name="icon-play_stop"
            size="14px"
            class="icon-toggle"
            color="#5A6074"
            :class="!get_layout_statu && 'active'"
            @click="handicap_this.toggele_layout(0)"
          />
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ $t("icon_tips.column") }}</q-tooltip
          >
          <!-- 一栏布局 -->
        </span>
        <span>
          <icon
            name="icon-play_pause"
            size="14px"
            class="icon-toggle"
            color="#5A6074"
            :class="get_layout_statu && 'active'"
            @click="handicap_this.toggele_layout(1)"
          />
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
            >{{ $t("icon_tips.multicolumn") }}</q-tooltip
          >
          <!-- 两栏布局 -->
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  onUnmounted,
  watch,
  defineExpose,
  defineEmits
} from "vue";
// import { mapGetters, mapActions } from "vuex";
import { useRoute } from "vue-router";
import store from "src/store-redux/index.js";
import ZhuGe from "src/core/http/zhuge-tag";
import { CommonTabFullVersionWapper } from "src/components/tab/common-tab/index.js";
import icon from "src/components/icon/icon.vue";
import lodash from 'lodash'
export default defineComponent({
  name: "HandicapTab",
  components: {
    tab: CommonTabFullVersionWapper,
    icon,
  },
  props: {
    handicap_this: Object,
    match_info: Object,
    whitchDetail: String,
  },
  setup(props, evnet) {
    const store_state = store.getState();
    //当前选中
    const currentIndex = ref(0);
    const tab = ref(null);
    const isRouterAlive = ref(false);

    defineExpose({
      tab,
      currentIndex,
    });

    // 当前所选的玩法集子项id
    const tabs_active_index = ref(store_state.matchesReducer.tabs_active_index);
    // 当前布局状态  一栏布局/两栏布局
    const get_layout_statu = ref(store_state.matchesReducer.layout_statu);
    // 监听状态变化
    let un_subscribe = store.subscribe(() => {
      state = store.getState();
      tabs_active_index.value = state.matchesReduce.tabs_active_index;
      get_layout_statu.value = state.matchesReduce.layout_statu;
    });
    const route = useRoute();

    const emit = defineEmits(["get_mattch_details", "on_go_top"]);

    const is_details = computed(() => {
      return ["details", "virtual_details"].includes(route.name);
    });
    // 获取玩法集菜单长度
    const category_list_length = computed(() => {
      return lodash.get(props.handicap_this, "category_list.length", 0);
    });

    //玩法集子项id 变化
    watch(tabs_active_index, (val) => {
      if (lodash.get(props.handicap_this, "category_list")) {
        let index = lodash.findIndex(
          props.handicap_this.category_list,
          (item) => item.id == tabs_active_index.value
        );
        currentIndex.value = index == -1 ? 0 : index;
      }
    });

    // 监听玩法集菜单长度变化
    watch(
      () => category_list_length.value,
      (val) => {
        if (lodash.get(props.handicap_this, "category_list")) {
          let index = lodash.findIndex(
            props.handicap_this.category_list,
            (item) => item.id == get_tabs_active_id.value
          );
          currentIndex.value = index == -1 ? 0 : index;
        }
      }
    );

    /**
     * 切换玩法
     * @return {undefined} undefined
     */
    const toggle_play = ({ index, item }) => {
      let { id, round, plays } = item;
      // this.reset_toggle = Math.random();
      currentIndex.value = index;
      //   this.$emit('change-loading-state', 'loading'); // 切换玩法时展示 loading 状态
      // 设置玩法集中当前选中的子项
      // 保存当前选中的玩法集子项id
      store.dispatch({
        type: "SET_TABS_ACTIVE_ID",
        data: id,
      });
      // 保存当前选中的玩法集子项对应的盘口玩法
      store.dispatch({
        type: "SET_TABS_ACTIVE_PLAYS",
        data: plays,
      });
      // 发送当前玩法集 id ， round 字段为电竞动态玩法集标记
      emit("get_mattch_details", { id, round, plays });

      // 玩法列表回到顶部
      emit("on_go_top");

      if (props.match_info.csid == 1) {
        // 发送埋点
        let zhuge_obj = {
          玩法集名称: item.marketName,
          玩法集ID: id,
          区域位置:
            this.whitchDetail && this.whitchDetail == "details"
              ? "详情页"
              : "右侧列表",
        };
        ZhuGe.send_zhuge_event("TY_PC_足球_玩法分类导航_点击", zhuge_obj);
      }
    };

    onUnmounted(() => {
      un_subscribe();
    });

    return {
      toggle_play,
      is_details,
      get_layout_statu,
      currentIndex,
    };
  },
});
</script>

<style lang="scss" scoped>
.scroll-fixed-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  height: 40px;
  font-size: 12px;
  background: #191c24;
  position: relative;
  .tabs-panel {
    flex: 1;
    height: 40px;
  }
  .tabs-bar {
    z-index: 1;
    display: flex;
    width: 1000px;
    position: absolute;
    .tabs-item-wrap {
      display: flex;
    }
    .tabs-item {
      padding: 0 15px;
      height: 36px;
      text-align: center;
      white-space: nowrap;
      line-height: 38px;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
    }
    .tabs-line {
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 24px;
      height: 2px;
      border-radius: 2px;
      z-index: 10;
      transition: all 0.3s;
    }
  }
  .tabs-icons {
    position: absolute;
    top: 0;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 40px;
    background-color: #1f222b;
    cursor: pointer;
  }
  .tabs-icons-left {
    left: 0;
    .yb-icon-arrow {
      transform: rotate(180deg);
    }
  }
  .tabs-icons-right {
    right: 0;
  }
  .row {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    .right-icons {
      cursor: pointer;
      text-align: center;
      padding: 0 13px;
    }
    .icon-toggle {
      margin-right: 10px;
      cursor: pointer;
      &:last-child {
        margin-right: 13px;
      }
      &:hover:before {
        color: var(--qq--right-icons-color-hover);
      }
      span {
        width: 24px;
      }
    }
  }
}
</style>
