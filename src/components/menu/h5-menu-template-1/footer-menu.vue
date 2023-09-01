<!--
 * @Author:
 * @Date:
 * @Description: 赛事列表页 底部菜单
-->
<template>
  <div class="container-menu-w" :class="{
      'black2':UserCtr.theme.includes('theme02'),
      'scrolling-up':scroll_dir > 0,
      'scrolling-down':scroll_dir < 0,
  }">
    <bet-bar v-if="get_betbar_show && route.name == 'matchList'"></bet-bar>
    <!-- 底部菜单资源配置图片 -->
    <div v-if="isshow_bottom_banner" class="bottom-banner">
      <img :src="calc_resources_obj.img_src" alt="" class="banner" @click="jump" />
      <img  src="image/wwwassets/bw3/svg/close9.svg" alt="" class="close" @click.self="close_banner">
    </div>
    <div class="floating-menu">

      <div class="footer-menu-item" @click="menu_item_click(item,k)"
           v-for="(item,k) of footer_menulist" :key="k" v-show="bottom_option_show(item)"
           :class="{
            'f-disabled-m':k == 0 && menu_type == 100,
            'sub-menu-first':k == 0,
            'is-hidden':is_sub_first_hidden && k == 0 || !GlobalAccessConfig.get_collectSwitch() && item.id == 1 || !GlobalAccessConfig.get_filterSwitch()  && ! GlobalAccessConfig.get_searchSwitch()  && item.id == 3,
            'effect-show':is_sub_first_effect && k == 0,
            'disabled':item.is_disabled,
            'is-follow': get_show_favorite_list && item.id == 1,
          }" >
        <div class="m-item-inner">
          <div class="item-img-wrapper"
               :class="{'effected':item.id == 4 && is_effecting_ref,
              'rotate-clock-wise':is_refreshing}">
            <span class="menu-item-img" :class="[item.icon.slice(0,-4), menu_item_img(item),(lodash.get(get_user, 'favoriteButton')?'favoriteButton':'')]"></span>
          </div>
          <div class="menu-item-title"
               :class="{'theme02-focus':get_show_favorite_list && UserCtr.theme.includes('theme02') && item.id == 1,}"
               v-show="item.id != 5"
          >
            <span class="title-p1" :class="{'title-p2': item.title1}">
              {{item.title}}
            </span>
            <span v-if="item.title1"
                  :class="item.title1?'title-p2':'title-p1'">
              {{item.title1}}
            </span>
          </div>
          <img v-if="item.id == 0 && UserCtr.theme.includes('y0')" class="play-w-change-icon"
               src="image/wwwassets/bw3/common/f-icon-pay-change-y0.svg"/>
          <img v-else-if="item.id == 0" class="play-w-change-icon"
               src="image/wwwassets/bw3/common/f-icon-pay-change.svg"/>
        </div>
      </div>
    </div>

    <!--玩法菜单-->
    <div class="sub-background" v-if="sub_menu_l_show"
         :class="{'show-slow':sub_menu_l_show_slow}" @touchstart.prevent='hide_sub_menu_l_p'
         @click="hide_sub_menu_l_p">

      <div class="sub-m-menu flex justify-around items-center" @click.stop=""
           :class="{'show-slow':sub_menu_l_show_slow}">
        <div v-for="(sub_m,sub_i) of footer_sub_m_list" :key="sub_i"
             @touchstart.prevent.stop="sub_menu_changed(sub_m,sub_i)"
             class="wrapper column justify-center items-center"
             v-show="((get_curr_sub_menu_type == 5 || sub_m.id != 114) && !([900,3000].includes(menu_type) && sub_m.id == 114)) && !(get_sport_all_selected && menu_type==1 && sub_m.id == 114)"
             :data-sid="sub_m.id" :data-mtype="get_curr_sub_menu_type" :data-cmtype="menu_type"
             :class="{
            'current_sub_menu':sub_i == sub_footer_menu_i,
            'is-favorite':get_show_favorite_list,
            'no-display': get_curr_sub_menu_type == 44 && sub_m.id == 4
          }">
          <div class="wrapper-inner column items-center justify-center">
            <div class="play-icon-wrap relative-position" :class="sub_m.icon">
            </div>
            <div class="title-contain relative-position row">
              <span>{{sub_m.title}}</span>&nbsp;<span class="title0">{{sub_m.title1}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// TODO: 后续修改调整
// import { mapGetters, mapMutations} from "vuex";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import common from "src/project/mixins/constant";
import betBar from 'src/project/components/bet/bet-bar.vue';  // 投注栏收起后的底部条
import {utils } from 'src/core/index.js';
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"
import lodash from 'lodash'
import { useRoute, useRouter } from 'vue-router'

import { UserCtr } from "src/core/index.js";

// import { Platform } from 'quasar'

  // mixins:[common],
  let is_effecting_ref = ref(true)
  let is_refreshing = ref(false)
  // 子菜单是否显示
  let sub_menu_l_show = ref(false)
  // 渐进式显示\隐藏子菜单
  let sub_menu_l_show_slow = ref(false)
  // 选中的子菜单下标
  let sub_footer_menu_i = ref(0)
  // 返回顶部按钮显示
  let scroll_to_top_show = ref(false)
  // 返回顶部时钟对象
  let scroll_to_top_timeout = ref(0)
  // 拖拽x坐标
  let init_poi_y = ref(0)
  // 拖拽过程中上一帧的鼠标x坐标
  let prev_x = ref(null)
  // 拖拽过程中上一帧的鼠标y坐标
  let prev_y = ref(null)
  // 是否拖拽到上方限制区
  let flat_topped = ref(false)
  // 滚动时点击返回顶部无效
  let list_scroll_timeout = ref(0)
  //列表滚动距离
  let scroll_h = ref(0)
  //上次记录的滚动方向 1向上滚  -1向下滚
  let scroll_prev_dir = ref(-1)
  //上一帧滚动位置
  let prev_frame_poi = ref(0)
  //处理中
  let footer_clicked_handleing = ref(false)
  //上一次的
  let prev_floating_sub = ref('prev-floating-sub-i')
  //页脚数据
  let footer_menulist = ref([])
  //子菜单显示/隐藏渐进效果
  let is_sub_first_effect = ref(false)
  //子菜单隐藏
  let is_sub_first_hidden = ref(false)
  //投注栏弹层显示非0否则0
  let local_bet_status = ref(0)
  //小于0显示页脚,大于0隐藏页脚
  let scroll_dir = ref(0)
  let timer_object = ref({
    timer1_: null,
    timer2_: null,
    timer3_: null,
    timer4_: null,
    timer5_: null,
    timer6_: null,
    timer7_: null,
    //第一个页脚菜单更新相关逻辑
    timer_super9: null,
    //简版足球角球图标分割线相关
    timer_super10: null,
  })
  set_show_match_filter(false)
  // 路由
  const route =  useRoute()
  const router = useRouter()


  onMounted(() => {
    set_footer_menulist();

    // 监听赛事列表数据获取事件
    useMittOn(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED,update_first_menu).on;

    // 初始化关注按钮显示状态
    init_follow_icon_style();
    init_play_way_selected();

    virtual_disable_follow_filter();
    update_first_menu();

    first_sub_menu_changed();
  })
  /**
   * @description: 销毁前回调函数
   */
  onBeforeUnmount(() => {
    clear_timer();
    useMittOn(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED,update_first_menu).off
  })
    // ...mapMutations([
    //   'set_goto_list_top', // 设置赛事列表回到顶部
    //   'set_toast',          // 设置提示信息
    //   'set_settle_dialog_bool',
    //   'set_show_favorite_list',
    //   'set_show_match_filter',
    //   'set_footer_sub_menu_id',
    //   'set_footer_sub_changing',
    //   'set_newer_standard_edition',
    //   'set_resources_obj',
    //   'set_menu_type',
    //   'set_goto_detail_matchid',
    //   'set_details_item',
    //   'set_home_tab_item',
    //   'set_hot_tab_item'
    // ]),
    /**
     * 点击图片跳转逻辑
     * type '0'-无链接 '1'-内部跳转链接（目前支持跳转到详情页，'details/3403089/1'、 'details/36858678123944596/100'...） '2'-外部跳转链接（'http://www.example.com'）
     */
    const jump = () => {
      let {jump_url, type} = calc_resources_obj
      if (jump_url) {
        if (type == '2' && jump_url.startsWith('http')) {
          window.open(calc_resources_obj.jump_url, '_blank')
        } else if (type == '1') {
          if (/#*\/*details/.test(jump_url) && route.name != 'category') {
            const {groups: {mid, csid}} = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(jump_url) || {groups:{}}
            if (mid && csid) {
              // 如果是电竞赛事，需要设置菜单类型
              if ([100,101,102,103].includes(+csid)) {
                set_menu_type(3000)
              }
              set_goto_detail_matchid(mid);
              set_details_item(0);
              router.push({name:'category', params: {mid, csid}});
            }
          }
          // 跳热门联赛
          if (jump_url.startsWith('hot') && !get_golistpage) {
            let tid = jump_url.split('/')[1]
            let is_existtid = get_hot_list_item && get_hot_list_item.subList && get_hot_list_item.subList.find(item => {
              return item.field2 == tid
            })
            if (tid && is_existtid) {
              set_home_tab_item({component: 'hot', index: 1, name: '热门'})
              set_hot_tab_item({field2: tid})
              router.push({name: 'home'})
            }
          }
        }
      }
    }
    /**
     * 关闭UI挂件
     */
    const close_banner = () => {
      set_resources_obj({is_show: false})
    }
    /**
     * 隐藏页脚二级菜单
     */
    const hide_sub_menu_l_p = () => {
      sub_menu_l_show_slow = false;
      timer_object.timer1_ = setTimeout(() => {
        sub_menu_l_show = false
      },300);
    }
    /**
     * 初始化玩法选中项
     */
    const init_play_way_selected = () => {
      let p_i = sessionStorage.getItem(prev_floating_sub);
      if(p_i != null){
        p_i = p_i * 1;

        sub_menu_changed(footer_sub_m_list[p_i],p_i);
      }
    }
    /**
     * 根据场景切换页脚第一个菜单的显示内容
     */
    const first_sub_menu_changed = () => {
      let ed = get_newer_standard_edition;
      if(ed == 2){
        is_sub_first_effect = false;
        timer_object.timer2_ = setTimeout(() => {
          is_sub_first_hidden = true;
        },210);
      }
      else{
        is_sub_first_hidden = false;
        timer_object.timer3_ = setTimeout(() => {
          is_sub_first_effect = true;
        },10);
      }
    }
    /**
     * 初始化关注图标样式
     */
    const init_follow_icon_style = () => {
      let item = footer_menulist.filter(f_item => f_item.id === 1)[0];
      let is_follow = get_show_favorite_list;
      if(is_follow){
        item.icon = item.icon1;
      }
      else{
        item.icon = item.icon0;
      }
    }
    /**
     * @description: 更新第一个页脚菜单
     * @param {Object} sub_menu
     * @param {Number} i
     * @return {Undefined} Undefined
     */
    const sub_menu_changed = (sub_menu,i) => {
      // TODO:后续修改调整
      sessionStorage.setItem(prev_floating_sub,i);
      // 非足球选择角球时,选中独赢
      if((get_curr_sub_menu_type != 5 && sub_menu.id == 114) || (get_curr_sub_menu_type == 44 && sub_menu.id == 4)){
        sub_footer_menu_i = 0;
        sessionStorage.setItem(prev_floating_sub,0);
      }
      else{
        sub_footer_menu_i = i;
        update_first_menu();
      }
    }
    /**
     * 更新第一个页脚菜单
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    const update_first_menu = () => {
      let sub_menu = footer_sub_m_list[sub_footer_menu_i];
      footer_menulist[0].title = sub_menu.title;
      footer_menulist[0].title1 = sub_menu.title1;
      footer_menulist[0].icon = sub_menu.icon;
      footer_menulist[0].icon_black = UserCtr.theme.includes('theme01') ? sub_menu.icon: sub_menu.icon1;
      set_footer_sub_menu_id(sub_menu.id);
      set_footer_sub_changing(true);
      clearTimeout(timer_object.timer_super9);
      timer_object.timer_super9 = setTimeout(() => {
        set_footer_sub_changing(false);
      },800);
      timer_object.timer4_ = setTimeout(() => {
        useMittEmit(MITT_TYPES.EMIT_FOOTER_SUB_MENU_ID_CHANGED,sub_menu.id);
      },200);
    }
    /**
     * @description: 底部子菜单点击事件
     * @param {Object} item 点击的子菜单
     * @param {Number} i 主菜单下标
     * @return {Undefined} Undefined
     */
    const menu_item_click = (item,i) => {
      if(item.is_disabled) return;
      if(menu_type == 100 && i == 0) return;

      //独赢
      if(item.id === 0){
        //赛马,摩托车,泥地摩托车不能切换玩法
        if([1002, 1011, 1010, 1009].includes(get_curr_sub_menu_type)){
          return;
        }
        sub_menu_l_show = true;
        clearTimeout(timer_object.timer_super10);
        timer_object.timer_super10 = setTimeout(() => {
          sub_menu_l_show_slow = true;
        },50);
      }
      //关注
      else if(item.id === 1){
        if( !utils.judge_collectSwitch(GlobalAccessConfig.get_collectSwitch() ,this ) ) return
        if(footer_clicked_handleing) return;
        footer_clicked_handleing = true;
        timer_object.timer5_ = setTimeout(() => {
          footer_clicked_handleing = false;
        },800);
        useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
          text: "footer-follow",
          before_status:get_show_favorite_list,
        });
        let is_follow = !get_show_favorite_list;
        if(is_follow){
          item.icon = item.icon1;
        }
        else{
          item.icon = item.icon0;
        }
        set_show_favorite_list(is_follow);
      }
      //注单
      else if(item.id === 2){
        useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW,true);
      }
      //筛选
      else if(item.id === 3){
        if(!GlobalAccessConfig.get_filterSwitch()  && !GlobalAccessConfig.get_searchSwitch()){
          $toast(i18n_t(`common.temporarily_unavailable`), 2000)
          return
        }
        set_show_match_filter(true);
      }
      //刷新
      else if(item.id === 4){
        if(is_refreshing) return
        is_effecting_ref = true;
        is_refreshing = true;
        timer_object.timer6_ = setTimeout(() => {
          is_effecting_ref = false;
          is_refreshing = false;
        },1000);
        useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
          text: "footer-refresh"
        });
      }

    }
    /**
     *切换到简版
     *@param {Undefined} undefined
     *@return {Undefined} undefined
     */
    const change_to_simple_handle = () => {
      set_newer_standard_edition(1);
    }
    /**
     * 虚拟体育禁用关注和筛选
     */
    const virtual_disable_follow_filter = () => {
      // 赛果禁用筛选
      if(28 == menu_type){
        footer_menulist.forEach(f_m => {
          if(f_m.id == 3 && lodash.get(get_current_main_menu,'menuId') == 10000){
            f_m.is_disabled = true;
          }else{
            f_m.is_disabled = false;
          }
          // 赛果关注 禁用
          if(f_m.id === 1){
            f_m.is_disabled = true;
          }
        });
        //虚拟体育  暂时注释代码
        if([1001,1002,1004,1010,1011,1009].includes(get_curr_sub_menu_type)){
          footer_menulist.forEach(f_m => {
            if(f_m.id == 1){
              f_m.is_disabled = true;
            }
          });
        }

        if([100].includes(get_curr_sub_menu_type)){
          footer_menulist.forEach(f_m => {
            if(f_m.id == 3){
              f_m.is_disabled = true;
            }
          });
        }
      }
      else{
        footer_menulist.forEach(f_m => {
          // 电竞下冠军不可点击关注
          if (f_m.id === 1 && menu_type === 3000 && lodash.get(get_current_menu, 'date_menu.menuType') == 100) {
            f_m.is_disabled = true
          } else {
            if(f_m.id == 3&& get_show_favorite_list){

            }else{
              f_m.is_disabled = false
            }
          }
          // 电竞放开 筛选
          if(f_m.id === 3 && menu_type === 3000){
            f_m.is_disabled = true
          }
          if(f_m.id == 1 && !GlobalAccessConfig.get_collectSwitch()  ){
            f_m.is_disabled = true;
          }
        });
      }
    }
    /**
     * 设置页脚菜单数据
     */
    const set_footer_menulist = () => {
      let is_virtual = menu_type == 900;
      // 赛果虚拟体育
      let is_result_virtual = [1001,1002,1004,1011,1010,1009].includes(get_curr_sub_menu_type);
      let is_saiguo_gz = menu_type == 28 && [100].includes(get_curr_sub_menu_type)
      let is_electronicSports = menu_type == 3000  // 电竞
      // console.error(is_virtual, is_saiguo_gz,get_show_favorite_list);
      if(init_footer_menulist_data){
        footer_menulist = [
          // 玩法菜单(独赢|大小|让球|角球等)
          {
            title:i18n_t('footer_menu.win_alone'),
            title1:get_lang == 'en'?"":i18n_t('footer_menu.play_way_f'),
            icon:'f-icon-sub-duying.svg',
            icon_black:'f-icon-sub-duying-black.svg',
            id:0,
            is_disabled:false,
          },
          // 关注
          {
            title:i18n_t('footer_menu.follow'),
            icon0:'f-icon-follow.svg',
            icon:get_show_favorite_list ? 'f-icon-follow1.svg' : 'f-icon-follow.svg',
            icon1:'f-icon-follow1.svg',
            icon_black:'f-icon-follow-black.svg',
            icon_black_fav:'f-icon-follow1-black.svg',
            icon2:'f-icon-follow-black.svg',
            id:1,
            is_disabled:is_virtual || is_result_virtual ||  menu_type == 28 ,
          },
          // 注单
          {
            title:i18n_t('footer_menu.bet_order'),
            icon:'f-icon-bet-order.svg',
            icon_black:'f-icon-bet-order-black.svg',
            id:2,
            is_disabled:false,
          },
          //筛选
          {
            title:i18n_t('footer_menu.filter'),
            icon:'f-icon-filter.svg',
            icon_black:'f-icon-filter-black.svg',
            id:3,
            is_disabled:is_virtual || is_saiguo_gz || get_show_favorite_list || is_electronicSports,
          },
          // 刷新
          {
            title:i18n_t('footer_menu.refresh'),
            icon:'f-icon-refresh.svg',
            icon_black:'f-icon-refresh-black.svg',
            id:4,
            is_disabled:false,
          }
        ];
      }
      $forceUpdate()
    }
    // 批量清除定时器
    const clear_timer = () => {

      for (const timer of timer_object) {
        clearTimeout(timer_object[timer])
        timer_object[timer] = null
      }
    }
  // computed:{
    // ...mapGetters([
    //   "get_user",
    //   "get_bet_list",
    //   "get_settle_dialog_bool",
    //   "get_curr_sub_menu_type",
    //   "get_show_favorite_list",
    //   "get_current_main_menu",
    //   "get_filter_list",
    //   "get_current_menu",
    //   "get_lang",
    //   "get_bet_status",
    //   'get_list_scroll_direction',
    //   'get_bet_list',
    //   'get_betbar_show',
    //   'get_curr_third_menu_id',
    //   'get_access_config',
    //   'get_resources_obj',
    //   'get_golistpage',
    //   'get_hot_list_item'

    // ]),
    // ...mapGetters({
    //   menu_type: "get_menu_type",
    //   get_newer_standard_edition:'get_newer_standard_edition',// 新手版与标准版
    //   current_esport_csid:'get_current_esport_csid',
    // }),
    const isshow_bottom_banner = computed(() => {
      return get_resources_obj.is_show && !get_betbar_show && calc_resources_obj.img_src
    })

    const calc_resources_obj = computed(() => {
      if (UserCtr.theme.includes('theme01')) {
        return get_resources_obj.theme01
      } else {
        return get_resources_obj.theme02
      }
    })
    // 是否展示 底部菜单 选项
    const bottom_option_show = computed(() => {
      return function (item) {
        return !(
            (menu_type == 3000 && lodash.get(get_current_menu, 'date_menu.menuType') == 100 && item.id == 0)
        )
      }
    })
    // 今日 串关 早盘 筛选时，要高亮
    const menu_item_img = computed(() => {
      return function (item) {
        let obj = item.id ==3  && typeof get_filter_list == "object" && Object.keys(get_filter_list).length && 'fillter-high-light';
        if(UserCtr.theme.includes('y0')) obj = item.id ==3  && typeof get_filter_list == "object" && Object.keys(get_filter_list).length && 'fillter-high-light';
        return obj;
      }
    })
    const footer_sub_m_list = computed(() => {
      return [
        {
          title:['en','th','ms','ad'].includes(get_lang)?'':i18n_t('footer_menu.full_time'),
          title1:i18n_t('footer_menu.win_alone'),
          icon0:'f-icon-sub-duying0.svg',
          icon:'f-icon-sub-duying.svg',
          icon1:'f-icon-sub-duying-black.svg',
          // hpid 独赢
          id:1
        },
        {
          title:['en','th','ms','ad'].includes(get_lang) ?'':i18n_t('footer_menu.full_time'),
          title1:i18n_t('footer_menu.rangqiu'),
          icon0:'f-icon-sub-rang0.svg',
          icon:'f-icon-sub-rang.svg',
          icon1:'f-icon-sub-rang-black.svg',
           // hpid 让球
          id:4
        },
        {
          title:['en','th','ms','ad'].includes(get_lang) ?'':i18n_t('footer_menu.full_time'),
          title1:i18n_t('footer_menu.daxiao'),
          icon0:'f-icon-sub-daxiao0.svg',
          icon:'f-icon-sub-daxiao.svg',
          icon1:'f-icon-sub-daxiao-black.svg',
          // hpid 大小
          id:2
        },
        {
          title:['en','th','ms','ad'].includes(get_lang) ?'':i18n_t('footer_menu.corner_kick'),
          title1:i18n_t('footer_menu.corner'),
          icon0:'f-icon-sub-jiaoqiu0.svg',
          icon:'f-icon-sub-jiaoqiu.svg',
          icon1:'f-icon-sub-jiaoqiu-black.svg',
          // hpid 角球
          id:114
        }
      ]
    })
    /**
     * @description: 当前是否为ihone,为iPhone添加特有的样式
     * @param {Undefined} Undefined
     * @return {Boolean}
     */
    const is_iphone = computed(() => {
      let {iphone,mobile,safari} = Platform.is;
      if(iphone && mobile && safari){
        return true;
      }
      return false;
    })
  // },
   /**
     * 滚球菜单是否选中全部菜单变化
     */
    watch(() => get_sport_all_selected, (val) => {
      // 简版时滚球菜单选中全部菜单时
      if(get_newer_standard_edition == 1 &&val && menu_type==1){
        let sub_menu = footer_sub_m_list[sub_footer_menu_i];
        if( lodash.get(sub_menu,'id') == 114){
          // 当时菜单是角球时设置菜单为独赢
          sub_menu_changed(footer_sub_m_list[0],0);
        }
      }
    })
    /**
     * 通过列表滚动决定页脚菜单显示/隐藏
     */
    watch(() => get_list_scroll_direction, (direction) => {
      //不显示投注弹层时改变页脚菜单显示状态
      if(local_bet_status == 0){
        scroll_dir = direction;
      }
    })
    watch(() => get_show_favorite_list, (is_fav) => {
      let item = footer_menulist.filter(f_item => f_item.id === 1)[0];
      if(is_fav){
        item.icon = item.icon1;
        item.icon_black = item.icon1;
      }
      else{
        if(UserCtr.theme.includes('theme01')){
          item.icon = item.icon0;
        }
        else if(UserCtr.theme.includes('theme02')){
          item.icon_black = item.icon2;
        }
      }
      // 切换关注页面时，初始化底部菜单数据
      set_footer_menulist();
    })
    watch(() => get_newer_standard_edition, () => {
      sub_menu_l_show = false;
      first_sub_menu_changed();
    })
    watch(() => get_current_main_menu.menuId, () => {
      virtual_disable_follow_filter();
    })
    watch(() => menu_type, () => {
      virtual_disable_follow_filter();
    })
    watch(() => get_curr_third_menu_id, () => {
      virtual_disable_follow_filter();
    })
    watch(() => get_lang, () => {
      set_footer_menulist();
    })
    watch(() => get_curr_sub_menu_type, (new_v) => {
      init_play_way_selected();
      // 32014 确定每次点击菜单 都重置为独赢
      // if(1 || [1002, 1011, 1010, 1009].includes(+new_v)){
         //赛马 摩托车 泥地摩托车强制改为独赢
      let p_i = 0;
      sub_menu_changed(footer_sub_m_list[p_i],p_i);
      // }
      set_footer_menulist();
      virtual_disable_follow_filter();
    })
    //投注栏弹层显示非0否则0
    watch(() => get_bet_status, (c_status) => {
      if(c_status == 0){
        timer7_ = setTimeout(() => {
          local_bet_status = c_status;
        },400);
      }
      else{
        local_bet_status = c_status;
      }
    })
</script>

<style lang="scss">
/* **********覆盖quasar组件默认样式********************* *-S*/
.q-btn--fab {
  .q-icon {
    width: 55%;
    height: auto;
    top: 50%;
    left: 50%;
    margin: -25% 0 0 -25%;
  }
}

.menu-item-btn {
  .q-btn__wrapper {
    width: 0.55rem;
    height: 0.55rem;
  }
}

/* **********覆盖quasar组件默认样式********************* *-E*/
</style>

<style lang="scss" scoped>
/* **********拖拽菜单********************* *-S*/
.container-menu-w {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 500;
  transition: transform 0.7s;

  .menu-item-img,
  .play-icon-wrap {
    background: var(--q-color-img-bg-13) no-repeat 0 0 / 0.2rem 2.77rem;
  }

  &.black2 {
    .floating-menu{
      backdrop-filter: blur(5px);
    }
    .menu-item-img,
    .play-icon-wrap {
      background-image: var(--q-color-img-bg-14);
    }
    .footer-menu-item{
      .menu-item-img{
      }
    }
  }

  &.scrolling-up {
    transform: translateY(0.56rem);
  }

  &.scrolling-down {
    transform: unset;
  }
  .bottom-banner {
    height: 0.56rem;
    width: 100%;
    position: relative;
    .banner {
      width: 100%;
      height: 100%;
    }
    .close {
      position: absolute;
      right: 0.1rem;
      top: calc(50% - 0.08rem);
      height: 0.16rem;
      width: 0.16rem;

    }
  }
}

.sub-background {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 502;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.4s;

  &.show-slow {
    opacity: 1;
  }

  .sub-m-menu {
    width: 3.2rem;
    height: 0.66rem;
    border-radius: 0.12rem;
    margin-bottom: 0.8rem;
    transform: translate3d(0, 1rem, 0);
    transition: transform 0.4s;

    &.show-slow {
      transform: translate3d(0, 0, 0);
    }

    .wrapper {
      width: 25%;
      height: 100%;
      position: relative;

      &.no-display {
        display: none;
      }

      &.current_sub_menu {
        &:after {
          content: ' ';
          display: block;
          width: 0.44rem;
          height: 0.28rem;
          z-index: 1;
          border-radius: 0.22rem;
          margin-top: 0.14rem;
        }
      }

      .wrapper-inner {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: absolute;
      }

      .play-icon-wrap {
        height: 0.2rem;
        width: 0.2rem;
        z-index: 2;

        &[class*='duying'] {
          background-position: 0 -1.5rem !important;
        }

        &[class*='rang'] {
          background-position: 0 -1.8rem !important;
        }

        &[class*='daxiao'] {
          background-position: 0 -2.4rem !important;
        }

        &[class*='jiaoqiu'] {
          background-position: 0 -2.1rem !important;
        }
      }

      .title-contain {
        max-width: 100%;
        font-size: 0.11rem;
        z-index: 2;
        padding-top: 0.06rem;
        flex-wrap: nowrap;

        span {
          flex-shrink: 0;
        }
      }
    }
  }
}

.floating-menu {
  /*  单号9070 H5还原度问题 */
  padding-bottom: 0.05rem;
  /* 兼容 IOS<11.2 */
  height: calc(0.48rem + constant(safe-area-inset-bottom));
  /* 兼容 IOS>11.2 */
  height: calc(0.48rem + env(safe-area-inset-bottom));
  /* 兼容 IOS<11.2 */
  padding-bottom: calc(0.05rem + constant(safe-area-inset-bottom));
  /* 兼容 IOS>11.2 */
  padding-bottom: calc(0.05rem + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-around;

  .inner-img {
    width: 0.24rem;
    height: 0.24rem;
    display: block;
    transition: transform 0.4s;

    &.active {
      width: 0.14rem;
      height: 0.14rem;
      transform: rotateZ(180deg);
    }
  }

  .menu-item-btn {
    width: 0.55rem;
    height: 0.55rem;
  }

  .footer-menu-item {
    width: 0.75rem;
    height: auto;
    display: flex;
    justify-content: center;
    position: relative;

    &.is-hidden {
      display: none;
    }

    &.sub-menu-first {
      width: 0;
      height: 0;
      overflow: hidden;
      transition: width 0.2s, height 0.2s;

      &.effect-show {
        width: 0.75rem;
        height: 0.55rem;
      }
    }

    &.disabled {
      opacity: 0.2 !important;
    }

    &.f-disabled-m {
      opacity: 0.4;
      display: none;
    }

    .item-img-wrapper {
      width: 0.23rem;
      height: 0.34rem;
      display: flex;

      span {
        margin: auto;
      }

      &.effected {
        span {
          transition: transform 1s;
        }

        &.rotate-clock-wise {
          span {
            transform: rotate(360deg);
          }
        }
      }
    }

    .m-item-inner {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      position: relative;

      .play-w-change-icon {
        position: absolute;
        right: 0;
        top: unset; /*  联想S5手机自带浏览器不支持该关键字,导致图标往下掉 */
      }
    }

    &:first-child {
      .menu-item-img {
        width: 0.2rem;
        height: 0.2rem;
      }
    }

    .menu-item-img {
      width: 0.2rem;
      height: 0.2rem;
      display: block;

      &.setting-newstan-icon {
        width: 0.2rem !important;
      }

      &.f-icon-follow1 {
        background-position: 0 -0.3rem !important;
        &.favoriteButton{
          background-image: var(--q-color-com-img-bg-225);
        }
      }

      &.f-icon-bet-order {
        background-position: 0 -0.9rem !important;
      }

      &.f-icon-filter {
        background-position: 0 -0.6rem !important;
      }

      &.fillter-high-light {
        background: var(--q-color-img-bg-12) no-repeat 100% 100% !important;
      }
      &.f-icon-refresh {
        background-position: 0 -1.2rem !important;
      }

      &.f-icon-sub-duying {
        background-position: 0 -1.5rem !important;
      }

      &.f-icon-sub-rang {
        background-position: 0 -1.8rem !important;
      }

      &.f-icon-sub-daxiao {
        background-position: 0 -2.4rem !important;
      }

      &.f-icon-sub-jiaoqiu {
        background-position: 0 -2.1rem !important;
      }
    }

    div {
      line-height: 1;
    }

    .menu-item-title {
      min-width: 0.45rem;
      color: var(--q-color-com-fs-color-2);
      font-size: 0.11rem;
      display: flex;
      justify-content: center;
    }
  }

  .footer-menu-icon {
    width: 0.24rem;
    height: 0.24rem;
  }
}

/* **********拖拽菜单********************* *-E*/

/* **********返回顶部********************* *-S*/
.footer-menu-item2 {
  position: fixed;
  width: 0.6rem;
  height: 0.3rem;
  z-index: 545;
  left: 50%;
  bottom: 0.38rem;
  transform: translateX(-50%);
  line-height: 0.55rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.15rem;
  background-color: var(--q-color-com-bg-color-8);
  box-shadow: var(--q-color-box-shadow-color-2);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  visibility: visible;

  &.bottom-h {
    bottom: 0.57rem;
  }

  &.is_iphone {
    margin-left: -2px;
  }

  &.show {
    opacity: 1;
    pointer-events: auto;
  }

  .menu-item-img2 {
    vertical-align: middle;
  }

  img {
    width: 0.13rem;
    height: 0.16rem;
  }
}

/* **********返回顶部********************* *-E*/
</style>
