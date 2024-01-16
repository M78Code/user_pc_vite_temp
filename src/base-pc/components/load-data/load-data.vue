<!--
 * @Author: Cooper
 * @Date: 2023-08-05 16:13:52
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
  <!-- {{ cur_state}} -->
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
        <div class="img-loading custom-format-img-loading"  :style="compute_css_obj({key:'pc-loading'})"></div>
        <div class="text-center loading-text flex items-end justify-center">
          <span v-if="cur_state == 'box_opening'" style="font-size: 16px"
            >{{ i18n_t('common.in_box') }}</span
          >
          <span v-else>{{i18n_t("common.loading") }}</span>
          <!-- 内容加载中... -->
        </div>
      </div>
      <!-- 右侧详情内容加载中... -->
      <div
        v-if="cur_state == 'right_details_loading'"
        class="loading-wrap right_details_loading"
      >
        <div class="img-loading custom-format-img-loading" :style="compute_css_obj({key:'pc-loading'})"></div>
        <div class="text-center loading-text flex items-end justify-center">
          <span>{{i18n_t("common.loading") }}</span>
          <!-- 右侧详情内容加载中... -->
        </div>
        
      </div>
      
      <no-data-wapper
        v-else-if="['empty', 'notice-empty', 'code_empty'].includes(cur_state)"
        :msg="
          no_data_msg
            ? no_data_msg
            : 'code_empty' == cur_state
            ?i18n_t('common.code_empty')
            : filterHeader.open_select_time
            ?i18n_t('filter.empty')
            :i18n_t('common.no_data')
        "
        :msg2="no_data_msg2"
        :marginBottom="'0px'"
        width="180px"
        height="180px"
        :color="color"
        class="empty-wrap"
        :class="{ filter_img: filterHeader.open_select_time }"
        which="noMatch"
        :url="compute_local_project_file_path('/image/png/no_data_01.png')"
      >
      </no-data-wapper>
      <no-data-wapper
        v-else-if="['all_empty', 'new_empty'].includes(cur_state) && is_eports"
        :msg="i18n_t('common.no_data')"
        :type_name="'esports-size'"
        :marginBottom="'0px'"
        width="203px"
        height="180px"
        :color="color"
        class="empty-wrap esports"
        which="noMatch"
      >
        <!-- <div class="empty-btn-wrap" >
          <div class="empty-btn" @click="journey">
            {{ i18n_t('common.go_now')}}
           </div>
        </div> -->
      </no-data-wapper>
      <div
        class="list_right_empty"
        v-else-if="['all_empty', 'new_empty'].includes(cur_state)"
      >
        <div class="img" :style="compute_css_obj('pc-lock-img-details')"></div>
        <span>{{i18n_t(`common.${cur_state}`) }}</span>
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
          {{i18n_t("common.no_network2") }}
        </div>
        <div v-if="cur_state == '404'" class="img img404" :class="color"></div>
        <!-- 哦豁~页面不见了 -->
        <div v-if="cur_state == '404'" class="text1">
          {{i18n_t("common.page404") }}
        </div>
        <div class="text2">{{i18n_t("common.nervous") }}</div>
        <div class="btn" @click="refresh">{{i18n_t("common.refresh") }}</div>
      </div>
    </div>
    <!-- 用户接口限流提示 -->
    <div class="user_api_limited fit" v-if="cur_state == 'user_api_limited'">
      <div class="row column items-center">
        <div class="img"></div>
        <div class="text1">
          <!-- Hi，真不巧，页面走丢了 -->
          <span>{{i18n_t("common.user_api_limited1") }}</span
          ><br />
          <!-- 别紧张，点“刷新”马上找回~ -->
          <span>{{i18n_t("common.user_api_limited2") }}</span>
        </div>
        <!-- 刷新 -->
        <div class="btn" @click="refresh">{{i18n_t("common.refresh") }}</div>
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
          <span>{{i18n_t("common.limited") }}</span>
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
          {{i18n_t("common.limited") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NoDataWapper} from "src/components/common/no-data/index";
import { onMounted,computed,ref,onUnmounted, watch } from 'vue'
import store from "src/store-redux/index.js";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/";
import UserCtr from "src/core/user-config/user-ctr.js";
import filterHeader from "src/core/filter-header/filter-header.js";
import { i18n_t,is_eports_csid, compute_local_project_file_path ,compute_css_obj} from "src/output/index.js"
import { useRoute } from "vue-router";
const {route} = useRoute()
const noData = NoDataWapper
const props = defineProps({
  // 是详情时 loading 与 empty 不居中
  is_detail: {
    type: Boolean,
    default: false
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
    default: ""
  },
  no_data_msg2: {
    type: String,
    default: ""
  },
  color: {
    type: String,
    default: "dark", //dark深色  light浅色
  },
  // 组件类型  league_fold:联赛折叠加载
  load_type: String
})

const menu_data = ref([])
const time_out = ref(false)
const no_user = ref(false)   // 用户失效标志位

// 用户信息是否失效
const store_state = store.getState();
const is_invalid = ref(UserCtr.is_invalid);

const unsubscribe = store.subscribe(() => {
  is_invalid.value = UserCtr.is_invalid
})

onMounted(() => {
  // 用户登录失效时,直接关闭loading中动画
  no_user.value = is_invalid.value;
  // 绑定接收用户失效事件
  useMittOn(MITT_TYPES.EMIT_SHOW_ALERT_CMD,no_user_event)
})

onUnmounted(()=>{
  unsubscribe()
})

const cur_state = computed(()=>{
  return props.state
})
//是否电子竞技
const is_eports = computed(()=>{
    return is_eports_csid(+route?.params.csid)
  }) 
   
/**
    * @description: 用户失效时,loading页面显示no data页面
    */
const no_user_event = () => {
  // 设置用户失效
  no_user.value = true;

}
</script>

<style lang="scss" scoped>
.load-data-wrap {
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
    margin-bottom: 10px;
    padding: 30px 11px;
    background: var(--qq--theme-bg-details_loading);
    box-shadow: 0px 2px 8px rgb(0 0 0 / 20%);
    border-radius: 10px;

    .loading-text {
      color: var(--q-gb-t-c-1);
    }
  }

  .refresh,
  .user_api_limited,
  display flex {
    align-items: center;
    justify-content: center;
    font-size: 12px;
    text-align: center;
    padding-top: 30%;

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
      width: 162px;
      height: 128px;
      margin-bottom: 8px;
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
        color: var(--q-gb-t-c-1);
        font-size: 13px;
        border-radius: 17px;
        background-image: var(--q-gb-bg-lg-9);
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