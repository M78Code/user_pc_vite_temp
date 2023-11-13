<!--
 * @Author: Amor
 * @Date: 2020-09-05 20:13:44
 * @Description: 左侧菜单 投注相关 头部 正常
-->
<template>
  <div class="bet-scorll-header">
    <q-separator v-if='!is_free' class="bet-top-separator" :class="{'shijiebei-separator': $route.name.includes('world_cup')} "></q-separator>
    <div class="row bet-back-btn yb-flex-between bet-back-btn-bg" :class="{'free-style': !is_free}" @click.stop="vx_set_layout_left_show('menu')">
     <!-- 返回菜单（投注记录、单/串关投注栏） -->
      <div class="col yb-flex cursor-pointer" v-if="is_free">
        <!--箭头图标-->
        <div class="icon-back-box"><icon name="icon-back" color="#3B3A3D" size="16px" /></div>
        <!--返回菜单-->
        <div class="back-text ellipsis" v-if="vx_is_bet_single">{{$root.$t('common.return_sports')}}</div>
        <div class="back-text2 ellipsis" v-tooltip="{content:'&nbsp;'+$root.$t('common.return_sports')+'&nbsp;',overflow:1}" v-else>{{$root.$t('common.return_sports')}}</div>
      </div>
      <div v-else>
        <!-- <q-separator class="bet-top-separator" :class="{'shijiebei-separator': $route.name.includes('world_cup')}"></q-separator> -->
        <!--bet-zone-head-width虚拟体育投注框宽度-->
        <div class="bet-zone-head justify-between align-items center cursor-pointer" @click.stop="toggle_handle" :class="{'bet-zone-head-width':vx_get_is_virtual_bet}">
          <template v-if="vx_get_is_virtual_bet">
            <div>
              <template v-if="vx_get_virtual_bet_list.length==1">
                {{$root.$t('bet.bet_one_')}}
              </template>
              <template v-else-if="vx_get_virtual_bet_list.length>1">
                {{$root.$t('menu.match_bet')}}<span class="bet-count">{{bet_count}}</span>
              </template>
            </div>
            <span>
              <icon class="mr15" :name="`img:${iocn_img_unfold}`" size="14px" v-if="is_expand"/>
              <icon class="mr15" :name="`img:${iocn_img_fold}`" size="14px" v-else/>
            </span>
          </template>
          <template v-else>
            <div>
            <template v-if="!$route.name.includes('world_cup')"> <!--世界杯rn-->
              <icon class="mr15" :name="`img:${iocn_img_unfold}`"     size="14px" v-if="vx_get_theme.includes('y0') ? is_expand : !is_expand"/>
              <icon class="mr15" :name="`img:${iocn_img_fold}`" size="14px" v-else/>
              <span>{{$root.$t('bet.bet_order')}}</span> <!--投注单-->
            </template> <!--世界杯rn-->
            <template v-else> <!--世界杯rn-->
              <icon class="mr15" :name="`img:${require('public/yabo/shijiebei_unfold.svg')}`"  size="14px" v-if="is_expand"/>
              <icon class="mr15" :name="`img:${require('public/yabo/shijiebei_fold.svg')}`"  size="14px" v-else/>
              <!--世界杯rn-->
              <span>{{$root.$t('bet.bet_order')}}</span>
            </template>
          </div>
          </template>

        </div>
      </div>
      <!--右边的单关或者复式串关按钮 hide_bet_series_but()是否为C01赛事 -->
      <template v-if="!(menu_data.is_winner_champion || menu_data.is_esports || menu_data.is_virtual_sport || hide_bet_series_but())">
        <template v-if="computed_show_btn && !vx_get_is_virtual_bet && (vx_layout_left_show != 'bet_history') " >
          <div class="bet-series-box">
            <span class="bet-series-text" :class="!vx_is_bet_single ? 'actions':'' ">{{$root.$t('bet.bet_series')}}</span>
             <!--复式串关已改为串关-->
            <div class="bet-series-switch" @click.stop="change_series" :class="!vx_is_bet_single ? 'actions':'' ">
              <div class="bet-series-ok" :class="!vx_is_bet_single ? 'actions':'' "></div>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <template v-if="computed_show_btn && !vx_get_is_virtual_bet && (vx_layout_left_show != 'bet_history') " >
          <template v-if="vx_is_bet_single">
            <div class="col-auto bet-series yb-flex-between" v-show="!hide_bet_series_but()" @click.stop="change_series">
              <!--复式串关已改为串关-->
              <span class="series_style" :class="{'vi_th_series_style': ['vi', 'th', 'ad'].includes(get_lang)}">{{$root.$t('bet.bet_series')}}</span>
              <span>+</span>
            </div>
          </template>
          <!--单关-->
          <template v-else>
            <div class="col-auto bet-series yb-flex-between"  @click.stop="change_series">
              <span>{{$root.$t('bet.bet_one_')}}</span>
              <span class="bet-single-btn">
                <!--单关数量-->
                <span class="bet-single-count">{{bet_count}}</span>
                <span class="add">+</span>
              </span>
            </div>
          </template>
        </template>
      </template>
    </div>
    <div class="row bg-white"></div>
    <!-- 供投注项定位时 获取头部定位 -->
    <div class="bet-header-position"></div>
    <!-- 投注记录 未结算&已结算$ 预约 tab bar -->
    <div v-if="bet_recode_this && vx_layout_left_show=='bet_history'" class="full-width bet-type" style="margin-top:10px">
      <div class="row bet-record-item cursor-pointer">
        <!--点选未结算0-->
        <div class="col text-center ellipsis" :class="{'active': bet_recode_this.selected==0}" @click.stop="bet_recode_this.selected=0">
          {{$root.$t('common.no_settlement')}}
          <!--未结算-->
        </div>
        <!--点选预约2-->
        <div class="col-auto menu-tab-line" v-if="bet_recode_this.selected==2">
          <div class="line"></div>
        </div>
        <!--点选已结算1-->
        <div class="col text-center ellipsis" :class="{'active': bet_recode_this.selected==1}" @click.stop="bet_recode_this.selected=1">
          {{$root.$t('common.settlement_')}}
          <!--已结算-->
        </div>
        <div class="col-auto menu-tab-line" v-if="bet_recode_this.selected==0">
          <div class="line"></div>
        </div>
        <div class="col text-center"  :class="{'active': bet_recode_this.selected==2}"  @click.stop="bet_recode_this.selected=2">
          {{ $root.$t('bet.bet_book2') }}
          <!--预约-->
        </div>
      </div>
      <template v-if="bet_recode_this.selected==2">
        <div class="row cursor-pointer appoint-order-status">
          <div class="col text-center"
            :class="{'active': bet_recode_this.appoint_order_status==0}"
            @click.stop="bet_recode_this.appoint_order_status=0">
            {{ $root.$t('bet.bet_process') }}
            <template v-if="bet_recode_this.appoint_order_status==0">
              <div class="tabs-line"></div>
            </template>
          </div>
          <div class="col-auto menu-tab-line">
            <div class="line"></div>
          </div>
          <div class="col text-center"
            :class="{'active': bet_recode_this.appoint_order_status==2}"
            @click.stop="bet_recode_this.appoint_order_status=2">
            {{ $root.$t('bet.bet_invalid') }}
            <template v-if="bet_recode_this.appoint_order_status==2">
              <div class="tabs-line"></div>
            </template>
          </div>
        </div>
        <!-- <q-separator class="appoint-separator"></q-separator> -->
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "BetScrollHeader",
  props: {
    bet_recode_this:Object,
    //是不是内嵌框,默认不是
    is_free: {
      type:Boolean,
      default:true
    },
    //是不是展开
    is_expand: Boolean,
  },
  data(){
    return{
      menu_data:$menu.menu_data
    }
  },
  created() {
     if(this.vx_cur_menu_type.pre_name == 'virtual_sport' && this.vx_cur_menu_type.type_name == 'play' && this.vx_get_bet_single_list.length == 0) {
          this.vx_set_is_bet_single(true)
    }
    console.log('is_free===', this.is_free);
  },
  computed: {
    ...mapGetters({
      //获取当前盘口类型
      vx_get_cur_odd: "get_cur_odd",
      // 左侧布局
      vx_layout_left_show: "get_layout_left_show",
      // 菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
      // 是否为单关
      vx_is_bet_single: 'is_bet_single',
      // 单关列表
      vx_get_bet_single_list: "get_bet_single_list",
      // 单关投注对象
      vx_get_bet_single_obj: "get_bet_single_obj",
      // 串关列表
      vx_get_bet_list: "get_bet_list",
      // 串关投注对象
      vx_get_bet_obj: "get_bet_obj",
      // 是否合并
      vx_get_is_bet_merge: "get_is_bet_merge",
      // 被预约的投注项id
      vx_get_bet_appoint_obj: "get_bet_appoint_obj",
      get_lang: 'get_lang'  ,
      vx_get_theme: "get_theme",
    }),

    /**
     * @description:是否显示右边的单关或者复式串关按钮
     * @param {undefined} undefined
     * @return {undefined} undefined
    */
    computed_show_btn() {
      let type_name = this.vx_cur_menu_type.type_name;
      if(!this.vx_get_is_bet_merge) {
        // 获取单关id
        let id = this.vx_get_bet_single_list[0];
        // 是否为冠军投注
        let match_type = _.get(this.vx_get_bet_single_obj,`${id}.cs.match_type`, 1);
        // 冠军不显示按钮
        if(match_type == 3) {
          return false;
        }
      }
      // 冠军不显示按钮
      if(type_name == 'winner_top') {
         return false;
      }
      return true;
    },

    /**
     * @description:投注数量  默认是单关数量
     * @param {undefined} undefined
     * @return {undefined} undefined
    */
    bet_count() {
      if(this.vx_get_is_virtual_bet) {
        return this.vx_get_virtual_bet_list.length;
      }
      if(this.vx_is_bet_single) {
        return this.vx_get_bet_single_list.length;
      }
      if(this.vx_get_is_bet_merge) {
        return this.vx_get_bet_list.length;
      } else {
        return this.vx_get_bet_single_list.length;
      }
    },
    /**
     * @description:串关/单关按钮切换
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    show_series_btn() {
      // 获取当前菜单类型
      let {type_name} = this.vx_cur_menu_type;
      // 获取单关id
      let id = this.vx_get_bet_single_list[0];
      // 是否为冠军投注
      let has_winner = _.get(this.vx_get_bet_single_obj,`${id}.cs.match_type`, 3) != 3;
      // 数据来源
      let source = _.get(this.vx_get_bet_single_obj,`${id}.cs.source`, 'match_list');
      // 数据是从投注列表并且为单关并且为冠军
      return this.vx_is_bet_single &&
             has_winner &&
             (!['bet','virtual_sport'].includes(type_name) ||
             (type_name=='winner_top' && source != 'match_list')) &&
             this.vx_layout_left_show=='bet_list';
    },
        /**
     * 正常体育赛事展开 ICON
     */

     iocn_img_unfold(){
      console.error('this.vx_get_theme',this.vx_get_theme)
         return  require(`public/image/yabo/${this.vx_get_theme}/${this.vx_get_theme}_unfold.svg`)
     },
    /**
     * 正常体育赛事折叠  ICON
     */

     iocn_img_fold(){
      return  require(`public/image/yabo/${this.vx_get_theme}/${this.vx_get_theme}_fold.svg`)

    },
  },
  methods: {
    ...mapActions({
      // 设置左侧布局
      vx_set_layout_left_show: "set_layout_left_show",
      // 投注项列表
      vx_set_bet_list: "set_bet_list",
      // 添加投注对象
      vx_bet_obj_add_attr: 'bet_obj_add_attr',
      vx_set_bet_single_list: 'set_bet_single_list',
      vx_bet_single_obj_attr: 'bet_single_obj_attr',
      // 设置是否为当
      vx_set_is_bet_single: 'set_is_bet_single',
       // 设置预约投注项
      vx_set_bet_appoint_obj: "set_bet_appoint_obj"
    }),
    /**
     * @description:是否隐藏串关按钮
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    hide_bet_series_but(){
      let res = false;
      // 单关时,获取投注列表数据
      if(this.is_bet_single && _.get(this,'vx_get_bet_single_list.length')){
        // 遍历投注列表数据,检测是否C01赛事
        for (let i = 0; i < this.vx_get_bet_single_list.length; i++) {
          // 获取投注项id
          let id = _.get(this,`vx_get_bet_single_list[${i}]`);
          // 获取投注项的数据源
          let cds = _.get(this,`vx_get_bet_single_obj[${id}].bs.cds`);
          if(cds == "C01"){
            // C01赛事时,隐藏串关按钮
            res=true;
            break;
          }
        }
      }
      return res;
    },
    /**
     * @description:单串关切换
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    change_series() {
      // 恢复预约投注项id为初始值
      if(!_.isNull(this.vx_get_bet_appoint_obj)) {
         // 置空预约投注项
        this.vx_set_bet_appoint_obj(null);
      }
      let is_bet_single = !this.vx_is_bet_single;
      // 串关数量小于10 如果是合并
      if(this.vx_get_is_bet_merge) {
        if(is_bet_single) {
          // 串关投注列表拷贝出来
          let bet_single_list = [...this.vx_get_bet_list];
          // 串关投注项对象拷贝出来
          let bet_single_obj = {...this.vx_get_bet_obj};
          // 设置拷贝出来的数据放到单关投注项列表中
          this.vx_set_bet_single_list(bet_single_list);
          _.forEach(bet_single_list, item => {
            // 根绝单关列表中的投注项id，获取拷贝出来的对象
            let obj =_.get(bet_single_obj,`${item}`);
            // 设置key值为投注项id
            obj.key = item;
            // 存储对象到单关对象中
            this.vx_bet_single_obj_attr(obj);
          });
        } else {
          // 单关投注列表拷贝出来
          let bet_list = [...this.vx_get_bet_single_list];
          // 单关投注项对象拷贝出来
          let bet_obj = {...this.vx_get_bet_single_obj};
          // 设置拷贝出来的数据放到串关投注项列表中
          this.vx_set_bet_list(bet_list);
          _.forEach(bet_list, item => {
            // 根绝串关列表中的投注项id，获取拷贝出来的对象
            let obj =_.get(bet_obj,`${item}`);
            // 设置key值为投注项id
            obj.key = item;
            // 存储对象到串关对象中
            this.vx_bet_obj_add_attr(obj);
          });
          // 检查是否可以串关
          this.yabo_common.check_mix(this);
        }
      } else if(!is_bet_single) { // 若为串关
        // 克隆单关列表以及单关对象
        let id = this.vx_get_bet_single_list[0];
        let bet_single_obj = {...this.vx_get_bet_single_obj};
        let obj =_.get(bet_single_obj,`${id}`);
        // 设置拷贝出来的数据放到串关投注项列表中
        this.vx_set_bet_list([id]);
        obj.key = id;
        this.vx_bet_obj_add_attr(obj);
        this.yabo_common.check_mix(this);
      }
      this.vx_set_is_bet_single(is_bet_single);
      //获取投注数据(内嵌mini切换或者语言发生变化时调用)
      this.$root.$emit(this.emit_cmd.EMIT_UPDATE_BET_DATA_CMD);
    },
    /**
     * @description: 点击加或者减图标需要重新计算高度
     * @param {undefined} undefined
     * @return {undefined} undefined
    */
    toggle_handle() {
      //重新计算投注框高度
      this.$root.$emit("toggle-handle");
    },
  },
};
</script>

<style lang="scss" scoped>
.bet-back-btn-bg{
  background: var(--qq--back-menu-bg-color) !important;
}
.arrow-icon{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 16px;
  border-radius: 16px;
  background: var(--qq--yb-text-color4_3);
  //color: transparent;
  border: 1px solid var(--qq--yb-text-color4_3_1);
  .icon-back{
    transform: scale(0.7);
  }
}
.icon-back-box{
  // border: 1px solid var(--qq--back-menu-bg-border-color);

  .icon-back{
    transform: scale(0.7);
  }
}
.add {
  font-size: 16px;
}
.mr15 {
  margin-right: 15px;
}

.yb-fontsize13{
  margin-top: 5px;
}
.free-style {
  padding-left: 0px !important;
  height: 44px !important;
}
/* 返回体育项目 */
.bet-back-btn {
  padding-left: 15px;
  height: 34px;
  cursor: pointer;
   /**返回菜单文字样式*/
  .back-text {
    width: 100px;
    padding-left: 10px;
  }
   /**返回菜单文字样式2*/
  .back-text2 {
    width: 65px;
    padding-left: 10px;
  }
  .bet-zone-head {
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
  }
  /**虚拟体育投注框宽度*/
  .bet-zone-head-width {
    width: 300px;
  }
  .bet-series-box {
    display: flex;
    align-items: center;
    .bet-series-text{
      color: var(--qq--theme-color-bet-keyboard_1);
      &.actions{
        color: var(--qq--theme-bg-bet-series-text-open) ;
      }
    }
    .bet-series-switch{
      position: relative;
      display: flex;
      min-width: 36px;
      height: 18px;
      border-radius: 18px;
      margin-left: 4px;
      margin-right: 5px;
      transition: .3s;
      background: var(--qq--background-gradient-1_2);
      border: 0.5px solid rgba(0, 0, 0, 0.2);
      &.actions{
        background: var(--qq--y0-btn-hover);
      }
      
      .bet-series-ok{
        width: 14px;
        height: 14px;
        position: absolute;
        background-color: var(--qq--y0-bg-color2_1_1);
        border-radius: 50%;
        top: 1px;
        left: 2px;
        transition: .3s;
        &.actions{
          background-color: var(--qq--yb-text-color4_2_1);
          left: 19px;
        }
      }
    }
  }
  /** 右边的单关或者复式串关按钮*/
  .bet-series {
    display: flex;
    padding: 8px;
    margin-right: 5px;
    min-width: 86px;
    height: 28px;
    font-size: 12px;
   
    /**单关按钮*/
    .bet-single-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      /**单关数量*/
      .bet-single-count {
        font-size: 14px;
        text-align: center;
        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 50%;
        transform: scale(0.7);
      }
    }
    /** 串关按钮不可用*/
    &.bet-series-disabled {
      background: #f0f5fc;
      color: rgba(45, 45, 45, 0.3);
      border: 1px solid #e4ebf1;
      border-radius: 4px;
    }
  }
}

/* 投注记录相关 */
.bet-type {
   /** 行样式*/
  .row {
    height: 34px;
    line-height: 34px;
  }

  /* 未结算,已结算中间分割线设置 */
  .tabs-line {
    margin-left: auto;
    margin-right: auto;
    margin-top: -4px;
    height: 2px;
    width: 39px;
    border-radius: 2px;
    transition: all 0.3s;
  }
}
.yb-flex {
  display: flex;
}
 /** 切换按钮样式 */
.series_style{
  padding-left: 10px;
}
.vi_th_series_style{
  padding-left:5px
}
.icon-back-box {
  width: 28px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  background: var(--qq--back-menu-bg-button-color);
}
.icon-back:before {
  color: #626262 !important;
}
</style>
