<!--
 * @Author: Amor
 * @Date: 2020-09-05 20:13:44
 * @Description: 左侧菜单 投注相关 头部
-->
<template>
  <div class="bet-scorll-header">
    <q-separator v-if='!is_free' class="bet-top-separator" :class="{'shijiebei-separator': $route.name.includes('world_cup')} "></q-separator>
    <!-- 返回菜单（投注记录、单/串关投注栏） -->
    <div class="row bet-back-btn yb-flex-between" @click="bet_back">
      <div class="col yb-flex cursor-pointer"  v-if="is_free">
        <icon name="icon-back" size="14px" />
        <div class="back-text ellipsis" :style="{width: vx_is_bet_single || (!vx_is_bet_single && !vx_cur_esports_mode)?'100px':'70px'}" v-tooltip="{content:'&nbsp;'+$root.$t('common.return_sports')+'&nbsp;',overflow:1}">{{$root.$t('common.return_sports')}}</div>
      </div>
        <!--bet-zone-head-width虚拟体育投注框宽度-->
        <div  v-else class="bet-zone-head justify-between align-items center cursor-pointer" @click.stop="toggle_handle" :class="{'bet-zone-head-width':vx_get_is_virtual_bet}">
          <div v-if="is_esports && show_button">
            <span>
              <icon class="mr15" :name="`img:${iocn_img_unfold}`" size="14px" v-if="is_expand"/>
              <icon class="mr15" :name="`img:${iocn_img_fold}`" size="14px" v-else/>
            </span>
            <span style="font-size:14px">{{$root.$t('bet.bet_order')}}</span> 
          </div>
            <div v-else  style="font-size:14px">
              <template v-if="vx_get_virtual_bet_list.length==1">
                {{$root.$t('bet.bet_one_')}}
              </template>
              <template v-else-if="vx_get_virtual_bet_list.length>1">
                {{$root.$t('menu.match_bet')}}<span class="bet-count">{{bet_count}}</span>
              </template>
              <span>
            </span>
            </div>
        </div>
      <!--返回菜单-->
      <div class="col-auto bet-series yb-flex-between" @click.stop="change_bet_mode" v-if="is_esports && show_button">
        <template v-if="is_series">
          <!--单关-->
          <span>{{$root.$t('bet.bet_one_')}}</span><span class="bet-count">1</span>
        </template>
        <template v-else>
          <!--串关-->
          <span>{{$root.$t('bet.bet_series')}}</span>
          <span>+</span>
        </template>
      </div>
      <div v-else @click.stop="toggle_handle">
        <div v-if="!vx_get_left_menu_toggle">
          <icon class="mr15" :name="`img:${iocn_img_unfold}`" size="14px" v-if="is_expand"/>
        <icon class="mr15" :name="`img:${iocn_img_fold}`" size="14px" v-else/>
        </div>
      </div>
      
    </div>
    <div class="row bg-white"></div>
    <!-- 供投注项定位时 获取头部定位 -->
    <div class="bet-header-position"></div>
    <!-- 投注记录 未结算&已结算 tab bar -->
    <div v-if="bet_recode_this && vx_layout_left_show=='bet_history'" class="full-width bet-type yb-fontsize13">
      <div class="row bet-record-item cursor-pointer">
        <div class="col text-center" :class="{'active': (bet_recode_this.selected==0)}" @click.stop="bet_recode_this.selected=0">
          {{$root.$t('common.no_settlement')}}
          <!--未结算-->
          <template v-if="bet_recode_this.selected==0">
            <div class="tabs-line"></div>
          </template>
        </div>
        <div class="col-auto menu-tab-line">
          <div class="line"></div>
        </div> 
        <div class="col text-center" :class="{'active': (bet_recode_this.selected==1)}" @click.stop="bet_recode_this.selected=1">
          {{$root.$t('common.settlement_')}}
          <!--已结算-->
          <template v-if="bet_recode_this.selected==1">
            <div class="tabs-line"></div>
          </template>
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
        <q-separator class="appoint-separator"></q-separator>
      </template> 
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "VirtualBetScrollHeader",
  // 投注记录组件对象
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
  data() {
    return {
      is_esports: false, // 标记是否为电竞
      is_series: true, // 是否支持串关
      show_button: true // 按钮是否显示
    };
  },
  computed: {
    ...mapGetters({
      // 菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
      // 左侧布局
      vx_layout_left_show: "get_layout_left_show",
      // 电竞模式
      vx_cur_esports_mode: "get_cur_esports_mode",
      // 虚拟体育投注列表
      vx_virtual_bet_list: "get_virtual_bet_list",
      // 虚拟体育投注对象
      vx_virtual_bet_obj: "get_virtual_bet_obj",
      // 投注类别 1: 普通赛事 2: 虚拟体育 3: 电竞
      vx_get_bet_category: "get_bet_category",
      // 是否为单关
      vx_is_bet_single: 'is_bet_single',
      vx_get_theme: "get_theme",
      vx_get_left_menu_toggle: 'get_left_menu_toggle',  // 菜单是否为展开状态
    }),
         /**
     * 正常体育赛事展开 ICON
     */

     iocn_img_unfold(){
         return  require(`public/image/yabo/${this.vx_get_theme}/${this.vx_get_theme}_unfold.svg`)
     },
    /**
     * 正常体育赛事折叠  ICON
     */

     iocn_img_fold(){
      return  require(`public/image/yabo/${this.vx_get_theme}/${this.vx_get_theme}_fold.svg`)

    }, 
    /**
     * 当前选中的顶部菜单冠军
     */
    is_esports_champion() {
      return $menu.menu_data.is_esports_champion;
    },
    computed_show_btn() {
      let type_name = this.vx_cur_menu_type.type_name || "";
      if(this.vx_virtual_bet_list.length==1 && ($menu.menu_data.is_esports || (type_name=='play' && this.vx_get_bet_category=='3'))) {
        let id = this.vx_virtual_bet_list[0];
        let serial_type = _.get(this.vx_virtual_bet_obj,`${id}.bs.ispo`);
        let single_type = _.get(this.vx_virtual_bet_obj, `${id}.cs.serial_type`)
        if(serial_type && single_type) {
          return true;
        } 
        return false;
      }
      return true;
    }
  },
  created() {
    this.$root.$on(this.emit_cmd.EMIT_VIRTUAL_BET_BACK_CMD, this.bet_back);
    let type_name = this.vx_cur_menu_type.type_name || "";
    // 判断当前选中的是否为电竞
    if ($menu.menu_data.is_esports || (type_name=='play' && this.vx_get_bet_category=='3')) {
      this.is_esports = true;
    }
    // 获取当前的电竞模式
    this.is_series = this.vx_cur_esports_mode;
  },
  destroyed() {
  	//电竞菜单投注销毁时设置单关
    if($menu.menu_data.is_esports){
      // 设置单关
      this.vx_set_is_bet_single(true);
    }
    this.$root.$off(this.emit_cmd.EMIT_VIRTUAL_BET_BACK_CMD, this.bet_back);
  },
  watch: {
    /**
     * 选中的菜单id进行监控
     */
    is_esports_champion: {
      handler(new_, old_) {
        if(new_  && !_.isUndefined(old_) && !old_) {
          this.vx_virtual_bet_clear();
        }
      },
      immediate: true
    },
    /**
     * @description:是否显示串关切换按钮
     * @param {boolean} new_ 新值 
     * @returns {undefined} undefined
     */
    computed_show_btn: {
      handler(new_) {
        this.show_button = new_;
      },
      immediate: true
    },
    vx_layout_left_show: {
      handler(new_) {
        if(new_=='bet_history') {
          this.show_button = false;
        } else {
          let type_name = this.vx_cur_menu_type.type_name || "";
          // 判断当前选中的是否为电竞
          if ($menu.menu_data.is_esports || (type_name=='play' && this.vx_get_bet_category=='3')) {
            this.show_button = this.computed_show_btn;
            this.is_esports = true;
            // 获取当前的电竞模式
            this.is_series = this.vx_cur_esports_mode;
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      // 设置左侧布局
      vx_set_layout_left_show: "set_layout_left_show",
      // 设置是否为虚拟体育投注
      vx_set_is_virtual_bet: "set_is_virtual_bet",
      // 清除虚拟体育投注项
      vx_virtual_bet_clear: "virtual_bet_clear",
      // 设置单关串关
      vx_set_bet_single: "set_bet_single",
      // 设置电竞模式
      vx_set_cur_esports_mode: "set_cur_esports_mode",
      // 设置虚拟体育列表
      vx_virtual_bet_list_push: "virtual_bet_list_push",
      // 添加虚拟体育投注项
      vx_virtual_bet_obj_add: "virtual_bet_obj_add",
      vx_virtual_bet_obj_del: "virtual_bet_obj_del",
      vx_virtual_bet_list_del: "virtual_bet_list_del",
      // 设置单关串关标志
      vx_set_is_bet_single: 'set_is_bet_single',
    }),
    /**
     * @description:返回体育项目
     * @param {undefined} undefined 
     * @returns {undefined} undefined
     */
    bet_back() {
      // 清除虚拟体育投注项
      this.vx_virtual_bet_clear();
      // 左侧布局显示为菜单
      this.vx_set_layout_left_show('menu');      
    },
    /**
     * @description:切换列表投注项的支持模式(单关显示全部投注项，串关只显示支持串关的玩法投注项)
     * @param {undefined} undefined 
     * @returns {undefined} undefined
     */
    change_bet_mode() {
      this.is_series = !this.is_series;
      if(this.is_series) {
        // 串关模式
        this.vx_set_cur_esports_mode(true);
      } else {
        // 单关模式
        this.vx_set_cur_esports_mode(false);
        if(this.vx_virtual_bet_list.length>1) {
          let index = this.vx_virtual_bet_list.length -1;
          let id = this.vx_virtual_bet_list[index];
          let bet_obj = _.cloneDeep(this.vx_virtual_bet_obj[id]);
          // 删除该子项
          for (let index = 0; index < this.vx_get_virtual_bet_list.length-1; index++) {
            let id = this.vx_get_virtual_bet_list[index];
            let item = _.get(this.vx_get_virtual_bet_obj, `${id}`,{});        
            if (!_.isEmpty(item)) {
              this.vx_virtual_bet_obj_del(id);
              // 删除该子项
              this.vx_virtual_bet_list_del(index, 1);
              index--;
            }
          }
          this.vx_virtual_bet_list_push(id);
          this.vx_virtual_bet_obj_add(bet_obj);
        }
      }
      //获取投注数据(内嵌mini切换或者语言发生变化时调用)
      this.$root.$emit(this.emit_cmd.EMIT_UPDATE_BET_DATA_CMD);
    },
    toggle_handle() {
      //重新计算投注框高度
      this.$root.$emit("toggle-handle");
    },
  },
};
</script>

<style lang="scss" scoped>
/* 返回菜单 */
.bet-back-btn {
  padding-left: 15px;
  height: 34px;
  cursor: pointer;
  .yb-flex {
    display: flex;
  }

  .yb-fontsize13{
    margin-top: 5px;
  }
  /*  返回菜单 */
  .back-text {
    width: 100px;
    padding-left: 10px;
  }
  /*  串关/单关按钮样式 */
  .bet-series {
    padding: 8px;
    margin-right: 5px;
    min-width: 66px;
    height: 28px;
    font-size: 12px;
    .bet-count {
      padding-left: 4px;
      border-radius: 50%;
    }
  }
}

/*  投注记录相关 */
.bet-type {
  .row {
    height: 34px;
    line-height: 34px;
  }

  /*  未结算,已结算中间分割线设置 */
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
.mr15 {
  margin-right: 15px;
}
</style>
