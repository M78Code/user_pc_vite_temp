<template>
  <div
    ref="details_tab"
    class="component details-tab"
    :class="{ 'tab-fixed': get_tab_fix }"
    v-cloak
  >
    <div class="fat-btn" @click="change_btn()">
      <!-- <div class="tab-btn" :class="{ collapsed: get_fewer != 2 }"></div> -->
      <div :class="['expand_item', {collapsed: get_fewer != 2}]" :style="compute_css_obj({key: 'h5-kyapp-expand-lague'})"></div>
    </div>
    <span class="menu-third"></span>
    <div class="tabs-container">
      <!-- // app 复刻版第一个玩法集固定不随滚动 -->
      <div
        class="menu-item-stick"
        v-if="fixd_left"
        :class="current_category_id == lodash.get(data_list,'[0][id]') ? 't_color' : ''"
        @click.self="selete_item(lodash.get(data_list,'[0][id]'), 0, lodash.get(data_list,'[0]'))"
      >
        {{ data_list[0]?.marketName   }}
      </div>
      <div class="menu-s" ref="reset_scroll_dom">
        <div
          class="menu-item"
          v-for="(item, index) in new_list"
          :key="index"
          @click.self="selete_item(item['id'], index, item)"
          :class="current_category_id == item['id'] ? 't_color' : ''"
        >
          {{ item.marketName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters, mapActions,mapMutations } from "vuex"
import {
  MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance,
  csid_to_sport_name,
  compute_css_obj
} from "src/output/index.js";
import {
  useMittEmitterGenerator,
  useMittEmit,
  MITT_TYPES,
} from "src/core/mitt";
import {
  reactive,
  computed,
  onMounted,
  onUnmounted,
  toRefs,
  watch,
  defineComponent,
  ref,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import UserCtr from "src/core/user-config/user-ctr.js";
import { MatchDetailCalss } from "src/output/index.js";
import { SessionStorage } from "src/output/module/constant-utils.js";
import tab_move from "src/core/tab-move/tab-move.js";
import zhuge from "src/core/http/zhuge-tag.js";
export default defineComponent({
  name: "details_tab",
  props: {
    data_list: {
      // 玩法集列表
      type: Array,
      default: [],
    },
    // 是否需要左侧第一个玩法集固定不随滚动,app 复刻版需要，其他版本暂不需要
    fixd_left: {
      type: Boolean,
      default: false,
    },
    scroller_scroll_top: {
      type: Number,
      default: 0,
    },
    new_match_detail_ctr: {
      type: Object,
      default: {},
    },
  },

  setup(props, evnet) {
    const route = useRoute();
    const router = useRouter();
    // 一键收起状态: 1.全展开 2.全收起 3.部分展开 1和3箭头向上
    const get_fewer = ref(lodash.get(SessionStorage.get("SET_FEWER")) || 1);
    const matchDetailCtr = ref(MatchDetailCalss);
    const current_category_id = ref(MatchDetailCalss.current_category_id);
    const data = reactive({
      emitters: [],
      timer1_: null,
      reset_scroll_dom: null,
    });

    // 玩法tab 所有投注 - 进球 - 上半场 - 球队 - 让球&大小
    const get_tab_fix = ref(" ");
    // 当用户未登录时返回uuid, 当用户登录时返回userId
    // const get_uid = computed(() => {
    //   return ""
    // });
    // 点击视频或者是动画的时候玩法集是否固定
    // const get_tab_fix = computed(() => {
    //   return ""
    // });
    // 一键收起状态: 1.全展开 2.全收起 3.部分展开 1和3箭头向上
    const get_detail_data = ref("");
    // 列表mid
    const match_id = computed(() => {
      return route.params.mid || get_detail_data.mid;
    });

    // 列表数据
    const new_list = computed(() => {
      // 如果需要左侧第一个玩法固定，则将玩法集第一个数据去掉，其余数据滚动
      if (props.fixd_left) {
        const list = JSON.parse(JSON.stringify(props.data_list));
        list.shift();
        return list;
      } else {
         // 如果不需要则返回所有数据
        return props.data_list;
      }
    });
    watch(
      () => MatchDetailCalss.details_data_version.version,
      (val, old) => {
        current_category_id.value =
          MatchDetailCalss.current_category_id ||
          SessionStorage.get("DETAIL_TAB_ID") ||
          "0";
      }
    );

    onMounted(() => {
     

      SessionStorage.set("SET_FEWER", 1);
      // 延时器
      data.timer1_ = null;
      initEvent();
    });
    onUnmounted(() => {
      clearTimeout(data.timer1_);
      // set_subscript_game_index(0)
    });
    const change_btn = () => {
   
      // 设置vuex变量值,没有玩法数据时不能点击
      if (
        props.data_list &&
        props.data_list.length == 1 &&
        matchDetailCtr.value.current_category_id == "0"
      )
        return;
      if (get_fewer.value == 1 || get_fewer.value == 3) {
        get_fewer.value = 2;
        useMittEmit(MITT_TYPES.EMIT_DETAILS_TOGGLE_HANDICAP, 2);
        SessionStorage.set("SET_FEWER", 2);
      } else {
        
        get_fewer.value = 1;
        useMittEmit(MITT_TYPES.EMIT_DETAILS_TOGGLE_HANDICAP, 1);
        SessionStorage.set("SET_FEWER", 1);
      }
    };
    // 单击玩法集--玩法集和tab 点击
    const selete_item = (uId, index, item) => {
      // 点击的玩法是当前选中的玩法
      if (matchDetailCtr.value.current_category_id == uId) return false;
      // 移动当前玩法的位置
      tab_move.tab_move2(index, data.reset_scroll_dom);
      MatchDetailCalss.set_details_item(uId);
      // set_subscript_game_index(index)
      let search_term = route.query.search_term;
      // 重新加载category组件，触发重新请求
      //如果是常规详情玩法集
      if (route.name == "category") {
        router.replace({
          name: "category",
          params: {
            mid: match_id.value,
            csid: get_detail_data.csid,
            mcid: uId,
          },
          query: { search_term: search_term },
        });
      }
      //如果是vr详情玩法集
      else {
        router.replace({
          name: "virtual_sports_category",
          query: { mid: route.query.mid, mcid: uId },
        });
      }
      // 点击玩法对页面吸顶tab做高度处理
      useMittEmit(MITT_TYPES.EMIT_DETAILILS_TAB_CHANGED);
      // 记录当前玩法集ID和玩法集合
      matchDetailCtr.value.category_tab_click(item);
      // 存储tab的id
      SessionStorage.set('DETAIL_TAB_ID', item.id)
      // useMittEmit(MITT_TYPES.EMIT_DETAILILS_TAB_CHANGED)
      if (get_fewer.value == 3) {
        get_fewer.value = 1;
      }
    

      
      // 发送埋点
      let zhuge_obj = {
        玩法集名称: item.marketName,
        玩法集ID: item.id,
        球种名称: csid_to_sport_name(get_detail_data.csid),
      };
      zhuge.send_zhuge_event(
        "TY_H5_详情页/大屏_玩法分类导航_点击",
        UserCtr,
        zhuge_obj
      );
    };
    /**
     * @Description 获取当前选中详情玩法集
     * @param {undefined} undefined
     */
    const get_active_details_play_tab = (callback) => {
      let item = props.data_list.filter(
        (item) => matchDetailCtr.value.current_category_id == item.id
      )[0];
      callback(item);
    };
    const initEvent = () => {
      // 赛事切换应切换回所有投注tab
      current_category_id.value = '0'
      matchDetailCtr.value.current_category_id = "0"
      try {
        if (data.timer1_) {
          clearTimeout(data.timer1_);
        }
        // 加上400毫秒解决scrollLeft未定义的问题
        data.timer1_ = setTimeout(() => {
          data.reset_scroll_dom.scrollLeft = 0;
        }, 400);
      } catch (e) {
        console.error(e);
      }
    };

    // 添加相应监听事件
    const { emitters_off } = useMittEmitterGenerator([
      { type: MITT_TYPES.EMIT_REFRESH_DETAILS_TAB, callback: initEvent },
      { type: MITT_TYPES.EMIT_REFRESH_DETAILS_TAB_BET, callback: initEvent },
      {
        type: MITT_TYPES.EMIT_GET_ACTIVE_DETAILS_PLAY_TAB,
        callback: get_active_details_play_tab,
      },
    ]);
    // 移除相应监听事件
    onUnmounted(emitters_off);
    return {
      ...toRefs(data),
      match_id,
      get_tab_fix,
      get_fewer,
      matchDetailCtr,
      MatchDetailCalss,
      current_category_id,
      MatchDataWarehouseInstance,
      change_btn,
      selete_item,
      get_active_details_play_tab,
      initEvent,
      new_list,
      compute_css_obj
    };
  },
});
</script>

<style lang="scss" scoped>
.details-tab {
  min-height: 0.4rem;
  background-color: var(--q-gb-bg-c-25);
  // border-bottom: 0.01rem solid var(--q-gb-bd-c-5);
  display: flex;
}
.expand_item{
  width: 0.2rem;
  height: 16px;
  transition: transform 0.25s ease;
  transform: rotate(-90deg);
}
.collapsed {
  transform: rotate(0deg);
}
.menu-item-stick {
  // position: absolute;
  // left: 0.14rem;
  box-sizing: content-box;
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
  width: auto;
  line-height: 0.4rem;
  padding: 0 0.12rem;
  display: inline-block;
  white-space: nowrap;
  z-index: 100;
  cursor: pointer;
  color: var(--q-gb-t-c-19);
}

.menu-s {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: auto;
  white-space: nowrap;
  padding: 0.02rem 0;
  color: var(--q-gb-t-c-19);
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.menu-item {
  box-sizing: content-box;
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
  width: auto;
  line-height: 0.4rem;
  padding: 0 0.12rem;
  display: inline-block;
}

/*************** 选中的玩法集 *************** -S*/
.t_color {
  position: relative;
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
  font-weight: bold;
  color: var(--q-gb-t-c-1);
  background: var(--q-gb-bg-c-31);
  border-radius: 0.22rem;
  height: 0.3rem;
  line-height: 0.3rem;
}

/*************** 选中的玩法集 *************** -E*/
.fat-btn {
  float: right;
  text-align: center;
  width: 0.4rem;
  min-height: 0.4rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  order: 10;
}

// .tab-btn {
//   display: inline-block;
//   width: 0.12rem;
//   height: 0.12rem;
//   margin-top: 0.09rem;
//   background-image: url($SCSSPROJECTPATH + "/image/svg/tab_up_btn_off.svg");

//   background-size: 100% 100%;
//   // transform: rotateZ(180deg);
//   transition: transform 0.3s;
//   // @include webkit(transition, transform 0.3s);

//   &.collapsed {
//     background-image: url($SCSSPROJECTPATH + "/image/svg/tab_up_btn.svg");
//     // @include webkit(transition, transform 0.3s);
//   }
// }

.menu-third {
  padding-right: 0.1rem;
  height: 0.4rem;
  position: relative;
  float: left;

  &:after {
    content: " ";
    display: block;
    width: 1px;
    height: 0.14rem;
    position: absolute;
    top: 0.14rem;
  }
}
.tabs-container{
  display: flex;
  align-items: center;
  flex: 1;
  width: 0;
}
// .tab-fixed {
//   position: fixed;
//   top: 2.04rem;
//   z-index: 90;
// }
</style>
src/core/utils/common/index.js
