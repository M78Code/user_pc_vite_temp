<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页头部置顶title
-->
<template>
  <div ref="common_header" class="common-header" @touchmove.prevent>
    <div class="row justify-between full-height mx-15" >
      <!-- 返回上一页 -->
      <div class="go-back-btn-wrap a1" @click="go_to_back">
        <div class="go-back"></div>
      </div>
      <div ref="contents" class="ellipsis title-style details-c" @click.stop="show_dialog">
        <!-- 联赛名 -->
        <seamless-marquee :content="title"/>
        &nbsp;
        <!-- 三角形logo -->
        <template>
          <span class="triangle-down"></span>
        </template>
      </div>
      <div class="row common-header-right" >
        <div 
          class="collect-icon" 
          :class="{active:get_detail_data.mf}" 
          v-if="_.get(get_access_config,'collectSwitch') && is_DJ_show && get_menu_type !== 28" 
          @click="details_collect(get_detail_data)"
        ></div>
        <div class="det-ref" :class="{'refreshing':refreshing,'refreshing-common': get_menu_type !== 3000}" @click="details_refresh"></div>
        <!--<div class="analysis_new" v-if="(get_detail_data.csid == 1 || get_detail_data.csid == 2)" @click="analysis_show(get_detail_data)"></div>-->
      </div>
    </div>
  </div>
</template>

<script>
// import { mapMutations, mapGetters } from "vuex";
import seamlessMarquee from 'src/project/components/common/seamless_marquee.vue'  // 详情页头部联赛名文字超出隐藏无缝滚动
import {api_common} from "src/project/api";
import utils from "src/public/utils/utils";


export default {
  name: "common_header",
  data() {
    return {
      dialog:false,
      position: 'top',
      // 默认不刷新
      refreshing:false,
      // 收藏|取消收藏是否请求中
      favorite_loading: false,
    };
  },
  created() {
    // 延时器
    this.timer1_ = null;
    this.timer2_ = null;
    this.cancel_ref = this.debounce(this.cancel_ref,200)

    this.go_to_back = this.debounce(this.go_to_back, 500, {leading: true})

    this.$root.$on(MITT_TYPES.EMIT_VISIBILITYCHANGE_EVENT, this.details_refresh)
  },
  // 接受父组件传递的数据
  props: {
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
  },
  components:{
    seamlessMarquee
  },
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
    //   "get_detail_data",
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
    //   'get_access_config',
    // ]),
    // 是否是电竞
    is_DJ_show() {
      return this.get_menu_type == 3000 || (this.get_menu_type == 28 && [100,101,102,103,104].includes(+this.get_detail_data.csid))
    }
  },
  beforeUnmount() {
    // 恢复默认的注单icon
    this.set_is_show_settle_tab(false)
    this.debounce_throttle_cancel(this.cancel_ref);
    this.debounce_throttle_cancel(this.go_to_back);

    this.$root.$off(MITT_TYPES.EMIT_VISIBILITYCHANGE_EVENT, this.details_refresh)

    clearTimeout(this.timer1_)
    this.timer1_ = null

    clearTimeout(this.timer2_)
    this.timer2_ = null
  },
  methods: {
    // ...mapMutations(["set_is_matchpage","set_toast","set_is_show_settle_tab","set_godetailpage",
    // "set_detail_data","set_details_changing_favorite"]),
    /**
     * @description: 电竞 收藏与取消收藏
     * @param {Object} match 赛事信息
     * @return {String}
     */
    details_collect(match_obj) {
      if( !utils.judge_collectSwitch( _.get(this.get_access_config,'collectSwitch'),this ) ) return

      // 如果还在请求中则return
      if ( this.favorite_loading ) return;
      let txt = 0;
      let params = {
        // 赛事ID
        mid: match_obj.mid,
        // 1收藏||0取消收藏
        cf: Number(!match_obj.mf),
        // 用户id
        cuid: this.get_uid,
      };
      // 收藏赛事或取消收藏
      if (match_obj.mf) {
        txt = i18n.t('common.cancel');//'取消';
      } else {
        txt = i18n.t('collect.betted_title');//'收藏';
      }
      this.favorite_loading = true;
      // 更新收藏状态
      this.set_details_changing_favorite(1)

      api_common.add_or_cancel_match( params ).then( res => {
        this.favorite_loading = false;
        if (res.code == 200) {
          let cloneData = _.clone(this.get_detail_data)
          cloneData.mf = params.cf
          this.set_detail_data(cloneData);
        } else if (res.msg) {
          this.set_toast({ 'txt': res.msg });
        }
      }).catch((e) => {console.error(e)});
    },
    /**
     *@description: 详情页刷新
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    details_refresh(){
      if(this.refreshing) return;

      // 赛果详情页
      const curr_tab = this.view_tab
      if (this.$route.name === 'match_result') {
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
        // 刷新 盘口赔率信息
        useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS)
        // useMittEmit(MITT_TYPES.EMIT_REF_API, 'details_refresh')
      }
      else if (curr_tab === 'match_analysis') {
        // 刷新 赛事分析信息
        useMittEmit(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS)
      }
      else {
        useMittEmit(MITT_TYPES.EMIT_REFRESH_CHATROOM)
      }

      // useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS)
      this.refreshing = true;
      clearTimeout(this.timer1_)
      this.timer1_ = setTimeout(() => {
        // 取消刷新 已做节流
        this.cancel_ref();
      },700);
    },
    cancel_ref(){
      this.refreshing = false;
    },
    /**
     *@description 显示足篮分析页
     *@param {obj} 赛事详情
     *@return {obj}
     */
    analysis_show(obj){
      let csid = _.get(obj,'csid')
      useMittEmit(MITT_TYPES.EMIT_ANA_SHOW,csid)
    },
    /**
     *@description 加载联赛列表
     *@param {obj}
     *@return {obj}
     */
    async interface_b_header() {
      // 显示联赛列表传true
      useMittEmit(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, true);
    },
    // 返回列表页亦或是返回上一级
    go_to_back() {
      this.$common.go_where({back_to: 'go_to_back'})
    },
    // 点击下拉三角加载联赛列表
    show_dialog(){
      let params0 = { tId: this.get_detail_data.tid , page: 1, count: 50 };
      // 加载联赛列表
      this.interface_b_header(params0)
    },
    /**
     *@description: 点击注单icon显示注单历史
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    open(position){
      useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW,true)
    },
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
    border-right: .15rem solid transparent;   /*扩大可点击范围*/

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
  padding-left: 0.6rem;
  background-color: transparent !important;
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
  background: var(--q-color-com-img-bg-70) center no-repeat;
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
  width: 0.12rem;
  height: 0.2rem;
  background: var(--q-color-com-img-bg-3) no-repeat center / 96% 96%;
  background-size: 100% 100%;
}

.analysis_new {
  width: 0.2rem;
  height: 92.5%;
  background: var(--q-color-com-img-bg-71) center no-repeat;
  background-size: 0.2rem auto;
}

.collect-icon {
  width: 0.18rem;
  height: 0.18rem;
  background-image: var(--q-color-com-img-bg-72);
  background-size: 100% 100%;
  position: absolute;
  left: 0.1rem;
  top: 0.13rem;
}
</style>
