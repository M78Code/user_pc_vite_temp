<!--
 * @Description: 详情页头部置顶title
-->
<template>
  <div ref="common_header" class="common-header" @touchmove.prevent>
    <div class="row justify-between full-height ">
      <!-- 返回上一页 -->
      <div class="go-back-btn-wrap" @click="go_to_back" >
        <GoBackSvg class="go-back" />
      </div>
      <div ref="contents" class="ellipsis title-style details-c" @click.stop="show_dialog">
        <!-- 联赛名 -->
        <seamless-marquee :content="title" />
        &nbsp;
        <!-- 三角形logo -->
        <span class="triangle-down"></span>
      </div>
      <div class="row common-header-right">
        <div class="collect-icon" :class="{ active: get_detail_data.mf }"
          v-if="GlobalAccessConfig.get_collectSwitch() && is_DJ_show && MenuData.get_menu_type() !== 28"
          @click="details_collect(get_detail_data)">
          <slot name="right"></slot>
        </div>
        <!-- todo 后面判断项目名称 -->
        <!-- <div class="det-ref" :class="{ 'refreshing': refreshing, 'refreshing-common': MenuData.get_menu_type() !== 3000 }"
          @click="details_refresh"></div> -->
        <!--<div class="analysis_new" v-if="(get_detail_data.csid == 1 || get_detail_data.csid == 2)" @click="analysis_show(get_detail_data)"></div>-->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from "vue-router"
import lodash from 'lodash'

import seamlessMarquee from 'src/base-h5/components/details/seamless-marquee.vue'  // 详情页头部联赛名文字超出隐藏无缝滚动
import GoBackSvg from 'src/components/go_back/index.vue'
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import { api_common } from "src/api/index.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { i18n_t } from "src/boot/i18n.js";
import { MatchDataWarehouse_H5_Detail_Common as matchDetailData, MenuData,compute_css_obj } from "src/output/index.js";
import uid from "src/core/uuid/index.js";
import BetData from 'src/core/bet/class/bet-data-class.js'

const props = defineProps({
  // 联赛名
  title: {
    type: String, // 类型字符串
    default: "" // 默认值为空
  },
  // 当前tab
  view_tab: {
    type: String,
    default: 'bet'
  }
})

const route = useRoute()
const router = useRouter()
// 获取详情数据
const get_detail_data = ref(matchDetailData.list_to_obj.mid_obj[`${route.params.mid}_`])
/** 默认不刷新 */
const refreshing = ref(false)
const position = ref('top')
/** 收藏|取消收藏是否请求中 */
const favorite_loading = ref(false)
// 延时器
const timer1_ = ref(null)
const clear_timer1_ = () => {
  if (timer1_.value) {
    clearTimeout(timer1_.value)
    timer1_.value = null
  }
}
const cancel_ref = lodash.debounce(() => {
  refreshing.value = false;
}, 200)
onBeforeUnmount(() => cancel_ref.cancel())

// 返回列表页亦或是返回上一级
const go_to_back = lodash.debounce(() => {

  // 非串关页面 在详情页面点击了串关 回到列表页 需要设置为单关
  let is_ = ['match_result','details','category'].includes(route.name);
  if(![28,6].includes(MenuData.current_lv_1_menu_i *1) && is_){
    BetData.set_is_bet_single('single')
    BetData.set_clear_bet_info()
    if (route.name=='category') {
      router.push({name:'matchList'})
    }else if(route.name=='match_result'){
      router.push({name:'matchResults'})
    }

  }else{
    if(route.name=='match_result'){
      router.push({name:'matchResults'})
    }else{
      router.back()
    }
   
  }
 
}, 500, { leading: true })

onBeforeUnmount(() => go_to_back.cancel())

/**
 * @description: 详情页刷新
 * @param {Undefined}
 * @return {Undefined} undefined
 */
const details_refresh = () => {
  if (refreshing.value) return;
  // 赛果详情页
  const curr_tab = props.view_tab
  if (route.name === 'match_result') {
    // 刷新 盘口赔率信息
    useMittEmit(MITT_TYPES.EMIT_REF_API, 'details_refresh')
    // 触发列表页监听事件，调接口拉取指定赛事
    useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
      text: "footer-refresh"
    });
    // 刷新 注单记录----请求
    useMittEmit(MITT_TYPES.EMIT_UPDATE_ORDER_LIST)
  }
  else if (curr_tab === 'bet') {
    // 刷新 盘口赔率信息 延时的原因是 刷新页面有可能先执行了详情接口 盘口接口没有拉倒数据刷新  加一个参数变量判断是否是刷新页面的变量 refresh
    useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS, { refresh: true })
    //   useMittEmit(MITT_TYPES.EMIT_REF_API,(true))
  }
  else if (curr_tab === 'match_analysis') {
    // 刷新 赛事分析信息
    useMittEmit(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS)
  }
  else {
    useMittEmit(MITT_TYPES.EMIT_REFRESH_CHATROOM)
  }
  // useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS)
  refreshing.value = true;
  clear_timer1_()
  timer1_.value = setTimeout(() => {
    // 取消刷新 已做节流
    cancel_ref();
  }, 700);
}
const { off } = useMittOn(MITT_TYPES.EMIT_VISIBILITYCHANGE_EVENT, details_refresh)
onBeforeUnmount(off)


/**
 * @description: 电竞 收藏与取消收藏
 * @param {Object} match 赛事信息
 * @return {String}
 */
const details_collect = (match_obj) => {
  if (!judge_collectSwitch(GlobalAccessConfig.get_collectSwitch())) return
  // 如果还在请求中则return
  if (favorite_loading) return;
  let txt = 0;
  let params = {
    // 赛事ID
    mid: match_obj.mid,
    // 1收藏||0取消收藏
    cf: Number(!match_obj.mf),
    // 用户id
    cuid: uid,
  };
  // 收藏赛事或取消收藏
  if (match_obj.mf) {
    txt = i18n_t('common.cancel');//'取消';
  } else {
    txt = i18n_t('collect.betted_title');//'收藏';
  }
  favorite_loading.value = true;
  // 更新收藏状态
  set_details_changing_favorite(1)

  api_common.add_or_cancel_match(params).then(res => {
    favorite_loading.value = false;
    if (res.code == 200) {
      let cloneData = lodash.clone(get_detail_data.value)
      cloneData.mf = params.cf
    } else if (res.msg) {
      useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, res.msg)
    }
  }).catch((e) => { console.error(e) });
}

/**
 *@description 显示足篮分析页
 *@param {obj} 赛事详情
 *@return {obj}
 */
const analysis_show = (obj) => {
  let csid = lodash.get(obj, 'csid')
  useMittEmit(MITT_TYPES.EMIT_ANA_SHOW, csid)
}

// 点击下拉三角加载联赛列表 显示联赛列表传true
const show_dialog = () => useMittEmit(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, true);

/**
 *@description: 点击注单icon显示注单历史
 *@param {Undefined}
 *@return {Undefined} undefined
 */
const open = (position) => {
  useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true)
}

// 是否是电竞
const is_DJ_show = computed(() => MenuData.get_menu_type() == 3000 || (MenuData.get_menu_type() == 28 && [100, 101, 102, 103, 104].includes(+lodash.get(get_detail_data.value, 'csid'))))

</script>

<script>

export default {
  name: "common-header",
  computed: {
    // ...mapGetters([
    //   // 赛事id
    //   "get_goto_detail_matchid",
    //   // 当用户未登录时返回uuid, 当用户登录时返回userId
    //   "get_uid",
    //   "get_change_count",
    //   // 详情下拉三角是否显示
    //   "get_sanjiao_is_bool",
    //   // 详情页的数据
    //   // 视频是否关闭
    //   "get_is_close_video",
    //   // 初始化状态值
    //   "get_is_show_settle_tab",
    //   // 收藏菜单为6
    //   "get_menu_type",
    //   // 当前选中的菜单
    //   "get_current_menu",
    //   // 是否从首页轮播区域跳转到详情
    //   "get_is_banner_jump",
    //   // 当前语言
    //   "get_lang",
    //   // 商户是否需要直接跳到列表页（url地址有label参数）
    //   "get_golistpage",
    //   // 商户是否直接跳到的赛事详情页
    //   'get_godetailpage',
    //   'get_curr_sub_menu_type',
    // ]),

  },

};
</script>

<style lang="scss" scoped>
.common-header {
  height: 0.44rem;
  line-height: 0.44rem;

  .go-back-btn-wrap {
    display: flex;
    align-items: center;
    border-right: .15rem solid transparent;
    /*扩大可点击范围*/

    .iocn {
      top: 50%;
      position: absolute;
      display: block;
      transform: translateX(0.02rem) translateY(-50%) rotateZ(90deg);

      &:before {
        color: #414655;
      }

      &.details-c {
        &:before {
          color: #fff !important;
        }
      }
    }
  }

  .triangle-down {
    width: 0;
    height: 0;
    margin-top: 0.04rem;
    border: 0.05rem solid;
    border-color: #fff transparent transparent transparent;
    display: inline-block;
  }

  .common-header-right {
    position: relative;
    flex: 0 0 0.7rem;
    justify-content: flex-end;
  }
}

.title-style {
  font-size: 0.16rem;
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
   //padding-left: 0.6rem;
  // 修复名称居中问题
  // width不能用100%，会盖住返回等问题
  background-color: transparent !important;
  position: absolute;
  left: 50%;
  width: 76%;
  margin-left: -38%;
}

.details-c {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  background-color: transparent !important;
}

/*  刷新按钮 */
// @include keyframes(loading-ring-animate) {
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(360deg);
//   }
// }

.det-ref {
  width: 0.28rem;
  height: 100%;
  // TODO: 后续上传
  background: url($SCSSPROJECTPATH + '/image/list/virtual-ref.svg') center no-repeat;
  background-size: 0.2rem auto;

  &.refreshing {
    animation: 0.7s loading-ring-animate linear;
  }

  &.refreshing-common {
    width: 0.28rem;
  }
}

.go-back {
  display: inline-block;
  color: #E7E7E7;
  margin-left: 0.15rem;
}

.analysis_new {
  width: 0.2rem;
  height: 92.5%;
  // TODO: 后续上传
  background: url($SCSSPROJECTPATH + '/image/svg/analysis_new.svg') center no-repeat;
  background-size: 0.2rem auto;
}

.collect-icon {
  width: 0.18rem;
  height: 0.18rem;
  // TODO: 后续上传
  background-image: url($SCSSPROJECTPATH + '/image/common/m-list-favorite.svg');
  background-size: 100% 100%;
  position: absolute;
  left: 0.1rem;
  top: 0.13rem;
}
</style>
