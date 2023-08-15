<!--
 * @Author: Coopoer
 * @Date: 2020-08-15 17:13:55
 * @Description: 玩法模板条件加载 详情页面 玩法集下面的玩法 列表
-->
<template>
  <div class="wrap-handicap relative-position">
    <div class="template-handicap" id="_handicap_list_wrap">
      <!-- 详情玩法列表容器，盘口关闭时会隐藏 -->
      <div class="details_data" v-if="showDetails">
        <div
          class="group-flex"
          id="_handicap_list"
          :class="{ double: get_layout_statu }"
        >
          <!-- waterfall 外层循环控制1栏布局和2栏布局 -->
          <div
            class="group-template"
            v-for="(list, index) in waterfall"
            :key="index"
          >
            <!--<div v-for="(item, i) in list" :key="`${index}_${i}`" class="template">-->
            <div
              v-for="item in list"
              :key="`hpid_${item.hpid}_topKey_${item.topKey}`"
              class="template"
            >
              <!-- <div>{{ plays_list }}----{{ item.hpid }}---{{ item.chpid }}---{{ item.hpn }}---{{ currentRound }}</div> -->
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
            ['details', 'virtual_details'].includes($route.name) &&
            _.get(waterfall, '[0].length')
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
        <div class="null-bg" v-show="$route.name != 'details'"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  defineProps,
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  nextTick,
} from "vue";
import match_handicap from "src/components/match-detail/match_handicap.js";
import store from "src/store-redux/index.js";
import details from "src/core/match-detail-pc/match-detail.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/";
import { useRoute, useRouter } from "vue-router";
import lodash from "lodash";
export default defineComponent({
  mixins: [match_handicap], //引入玩法组件
  setup(props, event) {
    //  ============================数据===================
    const state = reactive({
      sportId: null,
      details_data: [], //拼接数据
      reset_toggle: 0,
      // 当前 loading 状态
      load_detail_statu: "loading",
      layout_statu: true, // 单双列样式
      waterfall: [], // 单双列数据
      // 是否开了滚球盘
      had_play_handicap: true,
      // 玩法展开状态
      panel_status: "default",
      has_thumb: false, //是否有滚动条
      handle_: [], // 用户操作过的数据
    });
    const emit = defineEmits(["set_handicap_state"]);
    const useRoute = useRoute();

    const showDetails = ref(false);
    //  ============================store===================
    const store_state = store.getState();
    // 获取页面宽高信息 --可以废弃，废弃改动较大
    const get_layout_list_size = ref(
      store_state.layoutReducer.layout_list_size
    );
    // 详情页玩法列表单双列 0单列， 1双列
    const get_layout_statu = ref(store_state.matchesReducer.layout_statu);
    // 获取用户uid
    const get_uid = store_state.userReducer.uuid;
    // 当前所选的玩法集子项id
    const get_tabs_active_id = ref(
      store_state.matchesReducer.tabs_active_index
    );
    // 获取当前页路由信息
    const vx_layout_cur_page = ref(store_state.layoutReducer.layout_cur_page);
    // 获取指定的玩法id
    const get_top_id = ref(store_state.matchesReducer.topId);
    // 获取指定的玩法id
    const get_right_zoom = ref(store_state.matchesReducer.zoom);

    //  ============================watch===================

    watch(
      () => props.load_detail_statu,
      (val) => {
        // 盘口关闭时隐藏详情列表
        if (["all_empty", "new_empty", "refresh", "404"].includes(n)) {
          showDetails.value = false;
          document.querySelector(".wrap-handicap").style.height = "auto";
        } else {
          showDetails.value = true;
        }
        // 右侧详情加载进行优化
        let s = n == "loading" ? "right_details_loading" : n;
        // 发送当前 loading 状态
        this.$root.$emit("change_loading_status_details", s);
        if (this.pageType == "right_details") {
          this.$root.$emit("change_loading_status_right_details", s);
        }
      }
    );
    // 页面宽高变化
    watch(get_layout_list_size, (val) => {
      if (get_layout_statu.value) {
        state.waterfall = details.set_waterfall(state.details_data);
      } else {
        state.waterfall = [state.details_data];
      }
      int_is_show();
      set_go_top_show();
    });
    // 监听关闭全部玩法
    watch(
      () => props.close_all_handicap,
      (res) => {
        if (res) {
          if (props.load_type == "details") {
            emit("set_handicap_state", "empty");
          } else {
            state.load_detail_statu = "empty";
          }
        }
      },
      { immediate: true }
    );
    // 加载状态
    watch(
      () => props.handicap_state,
      (res) => {
        state.load_detail_statu = res;
      }
    );
    /**
     * @Description:监听玩法是否展开
     * @return {undefined} undefined
     */
    watch(
      () => state.panel_status,
      (res) => {
        switch (res) {
          case "open":
            set_is_show_all(true);
            break;
          case "hide":
            set_is_show_all(false);
            break;
        }
      }
    );
    watch(
      () => mmp.value,
      (cur) => {
        if (cur == "999") {
          if (props.load_type == "details") {
            emit("set_handicap_state", "empty");
          } else {
            state.load_detail_statu = "empty";
          }
        }
      }
    );
    // match_detail变化
    watch(
      () => props.match_details,
      (res) => {
        state.load_detail_statu = props.handicap_state;
        if (props.handicap_state != "data") {
          state.details_data = [];
          state.waterfall = [[]];
          return false;
        }
        change_detail(res);
      },
      { immediate: true, deep:true }
    );
    // watch(get_right_zoom, (val) => {
    //   this.wrap_tabs_width = this.$refs.warp.offsetWidth;
    // });

    //  ============================computed===================
    const current_list = computed(() => {
      let list = [];
      props.plays_list.forEach((element) => {
        list.push(element + "-" + props.currentRound);
      });
      return list;
    });
    const mmp = computed(() => {
      return props.match_info.mmp;
    });
    //  ============================methods===================

    const change_detail = () => {
      const obj = {
        1: 2,
        2: 3,
        11: 4,
      };
      if (props.match_info.mhs) {
        let status = 1;
        status = obj[props.match_info.mhs];

        res.forEach((item) => {
          item.hl.forEach((list) => {
            list.ol.forEach((j) => {
              if (j._hs == 11) {
                j.os == 1 ? (j.os = status) : "";
              } else {
                j.os = status;
              }
            });
          });
        });
      } else {
        res.forEach((item) => {
          item.hl.forEach((list) => {
            if (list.hs) {
              let status = 1;
              status = obj[list.hs];
              list.ol.forEach((j) => {
                if (j._hs == 11) {
                  j.os == 1 ? (j.os = status) : "";
                } else {
                  j.os = status;
                }
              });
            }
          });
        });
      }
      // 详情和虚拟详情页计算单双列
      if (["details", "virtual_details"].includes(useRoute.name)) {
        if (get_layout_statu.value) {
          state.waterfall = details.set_waterfall(state.details_data);
        } else {
          this.waterfall = [res];
        }
      } else {
        this.waterfall = [res];
      }
      state.details_data = res;
      set_go_top_show();
      int_is_show();
    };

    /**
     * @Description:初始化玩法是否展开
     * @return {undefined} undefined
     */
    const int_is_show = () => {
      // let show_title = "hide"
      state.waterfall.forEach((list) => {
        list.forEach((item) => {
          //是否有附加盘
          if (item.hmm == 1 && lodash.get(item, "hl.length") > 1) {
            item.has_plus = true;
          } else {
            item.has_plus = false;
          }
          item.is_show = state.panel_status == "hide" ? false : true;
          item.is_show_plus = state.panel_status == "hide" ? false : true;
        });
      });
    };
    /**
     * @Description:设置是否显示返回按钮
     * @return {Undefined} Undefined
     */
    const set_go_top_show = () => {
      nextTick(() => {
        let obj =
          document.querySelector(".details .v-scrollarea .scroll") ||
          document.querySelector(".virtual_details .v-scrollarea .scroll");
        if (obj) {
          state.has_thumb = obj.scrollHeight > obj.clientHeight;
        }
      });
    };

    /**
     * @Description:设置所有玩法集是否展开
     * @param {boolean} status 设置的状态
     * @return {undefined} undefined
     */
    const set_is_show_all = (status) => {
      state.waterfall.forEach((list) => {
        list.forEach((item) => {
          item.is_show = status;
          item.is_show_plus = status;
        });
      });
    };
    onMounted(() => {
      rang.value = [
        3, 4, 19, 33, 46, 52, 58, 64, 69, 71, 113, 121, 128, 130, 143, 154, 155,
        163, 172, 176, 181, 185, 232, 243, 249, 253, 268, 269, 270, 278, 280,
        294, 306, 308, 324, 327, 334, 20003, 20004, 20015,
      ];
    });
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
