<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:52
 * @Description: 内容加载：有内容展示、加载动画、无内容提示
-->
<template>
  <!-- 用户失效隐藏load中的所有布局元素 -->
  <div
    class="load-data-wrap col"
    v-show="!no_user"
    :class="{
      'is-detail': is_detail,
      'not-list': cur_state != 'data',
      limit_height: limit_height,
    }"
  >
    <div
      v-if="cur_state == 'data' || limit_height"
      class="fit"
      :style="limit_height ? `height:${limit_height}px !important;` : ''"
    >
      <slot />
    </div>
    <!-- cur_state=='empty' || cur_state=='loading' -->
    <div
      class="column yb-flex-center empty"
      :class="{
        fit: [
          'empty',
          'notice-empty',
          'loading',
          'box_opening',
          'right_details_loading',
          'code_empty',
        ].includes(cur_state),
      }"
    >
      <div
        v-if="cur_state == 'loading' || cur_state == 'box_opening'"
        class="loading-wrap padding-top"
      >
        <div class="img-loading custom-format-img-loading"></div>
        <div class="text-center loading-text flex items-end justify-center">
          <span v-if="cur_state == 'box_opening'" style="font-size: 16px"
            >抽盒中......</span
          >
          <span v-else>{{ i18n_t("common.loading") }}</span>
          <!-- 内容加载中... -->
        </div>
      </div>
      <!-- 右侧详情内容加载中... -->
      <div
        v-if="cur_state == 'right_details_loading'"
        class="loading-wrap right_details_loading"
      >
        <div class="img-loading custom-format-img-loading"></div>
        <div class="text-center loading-text flex items-end justify-center">
          <span>{{ i18n_t("common.loading") }}</span>
          <!-- 右侧详情内容加载中... -->
        </div>
      </div>
      <no-data
        v-else-if="['empty', 'notice-empty', 'code_empty'].includes(cur_state)"
        :msg="
          no_data_msg
            ? no_data_msg
            : 'code_empty' == cur_state
            ? i18n_t('common.code_empty')
            : '$store.state.filter.open_select_time'
            ? i18n_t('filter.empty')
            : i18n_t('common.no_data')
        "
        :msg2="no_data_msg2"
        :marginBottom="'0px'"
        width="180px"
        height="180px"
        :color="color"
        class="empty-wrap"
        :class="{ filter_img: '$store.state.filter.open_select_time' }"
      >
      </no-data>

      <div
        class="list_right_empty"
        v-else-if="['all_empty', 'new_empty'].includes(cur_state)"
      >
        <div class="img"></div>
        <span>{{ i18n_t(`common.${cur_state}`) }}</span>
      </div>
    </div>
    <!-- refresh || 404 -->
    <div
      class="refresh fit"
      v-if="cur_state == 'refresh' || cur_state == '404'"
    >
      <div class="row column items-center">
        <div
          v-if="cur_state == 'refresh'"
          class="img refresh-img"
          :class="color"
        />
        <!-- 网络不给力 -->
        <div v-if="cur_state == 'refresh'" class="text1">
          {{ i18n_t("common.no_network2") }}
        </div>
        <div v-if="cur_state == '404'" class="img img404" :class="color"></div>
        <!-- 哦豁~页面不见了 -->
        <div v-if="cur_state == '404'" class="text1">
          {{ i18n_t("common.page404") }}
        </div>
        <div class="text2">{{ i18n_t("common.nervous") }}</div>
        <div class="btn" @click="refresh">{{ i18n_t("common.refresh") }}</div>
      </div>
    </div>
    <!-- 用户接口限流提示 -->
    <div class="user_api_limited fit" v-if="cur_state == 'user_api_limited'">
      <div class="row column items-center">
        <div class="img"></div>
        <div class="text1">
          <!-- Hi，真不巧，页面走丢了 -->
          <span>{{ i18n_t("common.user_api_limited1") }}</span
          ><br />
          <!-- 别紧张，点“刷新”马上找回~ -->
          <span>{{ i18n_t("common.user_api_limited2") }}</span>
        </div>
        <!-- 刷新 -->
        <div class="btn" @click="refresh">{{ i18n_t("common.refresh") }}</div>
      </div>
    </div>
    <!-- 接口限流提示 -->
    <div
      class="record_api_limited fit column yb-flex-center"
      v-if="cur_state == 'api_limited'"
    >
      <div class="row column items-center">
        <div class="img"></div>
        <div class="text1">
          <!-- 当前访问人数过多，请稍后再试 -->
          <span>{{ i18n_t("common.limited") }}</span>
        </div>
      </div>
    </div>
    <!-- 投注记录 refresh -->
    <div class="refresh fit" v-if="cur_state == 'record_refresh'">
      <div class="row column items-center">
        <div
          v-if="cur_state == 'record_refresh'"
          class="img refresh-img"
          :class="color"
        />
        <!-- 网络不给力 -->
        <div v-if="cur_state == 'record_refresh'" class="text1">
          {{ i18n_t("common.limited") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import no_data from "../no_data/no_data.vue";
import {
  useMittOn,
  useMittEmit,
  useMittEmitterGenerator,
  MITT_TYPES,
} from "project_path/src/core/index.js";

import acticity_mixin from "project/activity/src/mixins/acticity_mixin/acticity_mixin";

export default {
  name: "loadData",

  components: {
    "no-data": no_data,
  },
  mixins: [acticity_mixin],

  props: {
    // 是详情时 loading 与 empty 不居中
    is_detail: {
      type: Boolean,
      default: false,
    },

    state: {
      type: String,
      default: "loading",
    },
    // 根据页面需求减去需要的高度
    scroll_decrease_height: {
      type: Number,
      default: 0,
    },
    // 根据页面需求减去需要的高度
    limit_height: {
      type: Number,
      default: 0,
    },
    can_scroll: {
      type: Boolean,
      default: true,
    },
    no_data_msg: {
      type: String,
      default: "",
    },
    no_data_msg2: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "dark", //dark深色  light浅色
    },
    // 组件类型  league_fold:联赛折叠加载
    load_type: String,
  },

  data() {
    return {
      time_out: false,
      // 用户失效标志位
      no_user: false,
      vx_get_is_invalid: false,
    };
  },
  created() {
    // 用户登录失效时,直接关闭loading中动画
    this.no_user = this.vx_get_is_invalid;
    // 绑定接收用户失效事件
    this.handle_generat_emitters();
  },

  computed: {
    cur_state() {
      return this.state;
    },
  },

  methods: {
    /**
     * 生成事件监听
     */
    handle_generat_emitters() {
      let event_pairs = [
        // 投注数量
        { type: MITT_TYPES.EMIT_SHOW_ALERT_CMD, callback: this.no_user_event },
      ];
      let { emitters_off } = useMittEmitterGenerator(event_pairs);
      this.emitters_off = emitters_off;
    },
    refresh() {
      if (this.load_type == "league_fold") {
        this.$emit("refresh");
      } else {
        location.reload();
      }
    },
    /**
     * @description: 用户失效时,loading页面显示no data页面
     */
    no_user_event() {
      // 设置用户失效
      this.no_user = true;
    }
  },
  unmounted() {
    //移除相应监听事件 //视图销毁钩子函数内执行
    if (this.emitters_off) {
      this.emitters_off();
    }
  },
};
</script>

<style lang="scss" scoped>
.load-data-wrap {
  min-height: 60%;
  overflow: auto;
  &.is-detail {
    .loading-wrap,
    .empty-wrap {
      padding-top: 30%;
    }
    .empty-wrap {
      &.esports {
        padding-top: 5%;
      }
    }
  }
  .text-center {
    font-size: 12px;
    img {
      width: 13px;
      height: 13px;
    }
  }
  .loading-wrap {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    .img-loading {
      margin-bottom: 10px;
      width: 50px;
      height: 50px;
      background-size: 100%;
      background-repeat: no-repeat;
    }
  }
  // 右侧详情加载进行优化
  .loading-wrap.right_details_loading {
    margin-top: 10%;
    padding: 30px 11px;
    background: var(--qq--theme-bg-details_loading);
    box-shadow: 0px 2px 8px rgb(0 0 0 / 20%);
    border-radius: 10px;
    .loading-text {
      color: #ffffff;
    }
  }
  .refresh,
  .user_api_limited,
  display flex {
    align-items: center;
    justify-content: center;
    font-size: 12px;
    text-align: center;
    .img {
      width: 180px;
      height: 180px;
      background-size: 100%;
    }
    .text1 {
      font-size: 14px;
      margin: 20px 0 6px 0;
    }
    .btn {
      width: 68px;
      height: 34px;
      line-height: 32px;
      border-radius: 4px;
      cursor: pointer;
      margin: 15px 0;
      font-size: 14px;
    }
  }
  .user_api_limited {
    .text1 {
      margin-top: 0;
      span:first-child {
        color: #666;
        font-size: 14px;
      }
      span:last-child {
        color: #999;
        font-size: 12px;
      }
    }
    .btn {
      width: 120px;
    }
  }
  .list_right_empty {
    padding-top: 20px;
    height: 200px;
    line-height: 14px;
    text-align: center;
    .img {
      display: block;
      width: 162px;
      height: 128px;
      margin: 8px auto;
    }
  }
  .empty {
    .empty-btn-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 8px;
      .empty-btn {
        height: 28px;
        padding: 0 15px;
        text-align: center;
        line-height: 28px;
        color: #fff;
        font-size: 13px;
        border-radius: 17px;
        background-image: linear-gradient(270deg, #ff7000 0%, #ff7000 100%);
      }
    }
  }
}
.limit_height {
  position: relative;
  top: 0px;
  left: 0px;
  .empty {
    position: absolute !important;
    top: 0px;
    left: 0px;
  }
}
</style>
