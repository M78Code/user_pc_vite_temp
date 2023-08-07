<!--
 * @Description: H5 列表主菜页
-->
<template>
  <div  class="menu" @touchmove.stop="" @touchstart.stop="">
    <div id="sport_menu" class="menu-inner-wrap">
      <!--  电竞背景图片  -->
      <div class="m-i-background" :data-type="current_esport_csid" v-if="3000 == menu_type" :class="dj_back_img"></div>
      <!-- 一级主菜单 -->
      <div class="main-wrap flex" :class="{esport:3000 == menu_type}">
        <!--  返回按鈕  -->
        <div class="goback-icon-wrapper column justify-center" @click="go_home" :class="get_golistpage && 'goback-icon-wrapper2'">
          <img class="theme01" v-if="get_theme.includes('theme01') && 3000 != menu_type"
               src="image/wwwassets/bw3/svg/go-back-icon-theme02.svg"  />
          <img class="theme02" v-if="get_theme.includes('theme02') && 3000 != menu_type"
               src="image/wwwassets/bw3/svg/go-back-icon.svg"  />
          <img class="esport" v-if="3000 == menu_type"
               src="image/wwwassets/bw3/svg/go-back-icon-esport.svg"  />
        </div>
        <div class="main-menu-container" :class="{esport:3000 == menu_type}">
          <!-- 一级主菜单 下边的四个主图标 -->
          <template v-for="(main_m, m_m_i) of main_menu_list_items" :key="m_m_i">
            <div class="m-menu-item" 
                 :class="[
                     {current: show_one_menu_index && get_main_menu_dom_i === m_m_i,
                      esport:3000 == menu_type
                     },
                      `main_menu_${main_m.menuId}`
                  ]"
                 @click="main_item_clicked(m_m_i,'dir_click','',main_m)"
            >
              <div class="i-title" :class="first_level_menu_subscript_css">
                {{main_m.menuName}}
              </div>
              <div class="m-menu-count">
                <span class="count" :class="{is_unit:main_m.count < 10 && m_m_i == 1,
                  esport:3000 == menu_type}"
                  :style="{
                    visibility:show_favorite_list ||
                    main_m.menuType == 900 || main_m.menuId==408 ||
                    3000 == main_m.menuType ? 'hidden' : 'visible'
                  }">
                  {{main_m.count}}
                </span>
                <i v-if="m_m_i === 1"
                   class="dir-triangle"
                   :class="{open:show_selector_s2,arrow_esport:3000 == menu_type || get_theme == 'theme02'}">
                </i>
              </div>
            </div>
          </template>
        </div>
        <!-- 活动图标 -->
        <img class="activity-logo animate-bounce-up" :src="get_file_path(user_info.activityList[0].h5Url) || activity_default"
             v-if="lodash.get(get_access_config,'activitySwitch') && user_info.inActivity && get_lang == 'zh'" @click="openActivity" @error="activity_icon_error" alt="">
        <!-- 活动图标红点 -->
        <div class="red-dot" v-show="task_list > 0 && user_info.inActivity && get_lang == 'zh' && !user_info.maintaining"></div>
        <!-- 右边设置菜单 -->
        <set-menu/>
      </div>
      <!--二级菜单, 三级菜单，上下滑动 隐藏显示 , 竞彩足球 (get_menu_type:30 不显示二级菜单) -->
      <div
        v-show="menu_type != 30"
        class="sub-menu-date-w"
        :class="{
          simple:menu_wrap_simple && 3000 != menu_type,
          zaopan:[4,11,28,3000].includes(+menu_type),
          esport:3000 == menu_type,
        }">
        <!-- 二级菜单, 三级菜单, 四级菜单  -->
        <div class="sport-m-container"
             :class="{simple:sport_container_simple && 3000 != menu_type,
            'shadow-down':3000 != menu_type
          }">
          <!--二级菜单 球类和运动类-->
          <div class="s-menu-container flex" ref="sub_menu_scroller">
            <!--  二级菜单 滚球下边的一个按钮   "全部"按钮  -->
            <sub-menu-specially
              @click="select_all_sub_menu_handle"
              v-show="lodash.get(get_access_config,'playAllShow') && lodash.get(get_current_first_menu,'menuId') == 400"
              :count="all_sport_count ? all_sport_count:0"
              :title="$root.$t('footer_menu.all')"
              v-if="lodash.get(get_access_config,'playAllShow')"
            >
              <span class="sport-icon-wrap" :class="get_sport_icon(get_sport_all_selected)"></span>
            </sub-menu-specially>
            <!--   二级菜单 除了‘全部’按钮的其他所有 二级菜单  -->
            <div class="sport-menu-item flex justify-center" ref="scrollItem"
                 v-for="(sub,sub_i) of sub_menu_list" :key="sub_i"
                 v-show=" show_two_menu_func(sub) && show_secondary_menu_icon(sub)"
                 @click="sub_menu_changed(sub_i,'dir_click')"
                 :class="{'current':selected_sub_menu_i_list.includes(sub_i),'champion':menu_type == 100}"
            >
              <div class="inner-w flex justify-between items-center" :class="{favorite:show_favorite_list}">
                <div class="sport-w-icon">
                    <span class="sport-icon-wrap"
                          :class="[get_sport_icon(selected_sub_menu_i_list.includes(sub_i)),`${'s'+sub.menuType}`]"
                          :data-type="sub.menuType+sub.menuName"
                    ></span>
                  <div class="sport-match-count"
                       v-show="28 != menu_type && 3000 != menu_type && menu_type != 900 && ![1001,1002,1004,1011,1010].includes(+sub.menuType)">
                    {{show_favorite_list ? '' : sub.count ? sub.count:0 }}
                  </div>
                </div>
                <div class="s-w-i-title" :class="{
                    esport:3000 == menu_type,
                    'din-regular':3000 == menu_type}">
                    {{sub.menuName}}
                </div>
              </div>
            </div>
          </div>
          <!-- 三级菜单 日期 (只有 串关，早盘，赛果，电竞，才有) -->
          <div class="d-c-wrapper" :class="{esport:3000 == menu_type}" v-if="date_menu_list.length && [4,11,28,3000].includes(+menu_type)">
            <div class="date-container" ref="date_menu_container" :class="{esport:3000 == menu_type}">
              <div class="date-menu-item" :key="date_index"
                   :class="{
                      focus:date_menu_curr_i === date_index,
                      'is-favorite':show_favorite_list,
                      'hidden-champion': show_favorite_list && menu_type === 3000 && date_menu_item.menuId === '-999',
                      }"
                   @click="date_menu_clicked(date_index, 'date_click')"
                   v-for="(date_menu_item, date_index) of date_menu_list"
              >
                <div>
                  <!-- 串关不显示日期菜单后面的数量 -->
                  {{date_menu_item.menuName}}
                  <span v-if="!show_favorite_list && date_menu_item.count && ![11, 28].includes(+menu_type)">
                      &nbsp;({{date_menu_item.count}})
                    </span>
                </div>
              </div>
            </div>
          </div>
          <!--四级菜单 虚拟体育赛果才有的 联赛tab-->
          <div class="virtual-sports-results" v-if="is_results_virtual_sports">
            <div class="tab-item" :class="{active:i == virtual_sports_results_tab_item_i}" v-for="(tab_item,i) of virtual_sports_results_tab"
                 :key="i" @click="virtual_sports_results_click_handle(tab_item,i)">
              {{tab_item.name}}
            </div>
          </div>
        </div>
      </div>
      <!--主菜单里边---中间下拉弹框-->
      <div class="main-m-selector-w" :class="{'effct-in':show_selector_s2}" v-show="show_selector_sub" @click="close_menu_popup">
        <div class="selector-w-inner flex wrap justify-left hairline-border" :class="{show:show_selector_inner}">
          <template v-for="(m_items,i_m) of main_select_items">
            <div :key="i_m"
                 :class="[{current:i_m === selector_w_m_i,'is-favorite':show_favorite_list,}]"
                 @click="selector_m_clicked(i_m,'dir_click')"
                 class="main-m-select-item flex justify-center items-center"
                 v-if="is_menu_show(m_items)"
                 v-show="show_popup(m_items, i_m)"
            >
              <div class="m-menu-name-m">{{m_items.menuName}}</div>
              <div class="m-count-match" v-if="m_items.count && !show_favorite_list">
                {{m_items.count}}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// TODO 后续修改调整
// import { mapMutations, mapGetters} from "vuex";
import setMenu from "src/project/components/common/set-menu";
import sub_menu_specially from "src/project/pages/sport_menu/sub-menu-specially.vue";
import utils from "utils/utils";
import list_menu_mixin_new from 'src/project/pages/sport_menu/match-list-menu';
import { api_result} from "src/project/api/index.js";
import { activity_task_api } from "src/public/api";
import lodash from 'lodash'
//  一二级菜单 本地化假数据
import {Level_one_menu_list, second_sub_list} from "src/project/pages/sport-menu/config/common-menu.js" 
import { watch } from "vue";
// import{ date }  from 'quasar'

  // TODO 后续修改调整
  // mixins: [ list_menu_mixin_new ],
  
  //主菜单列表数据, 进行数据操作用的, 不是 真正渲染到 页面的数据，真正渲染到页面数据的是下面的 main_menu_list_items  =================
  const main_menu_list = ref([]) 
  //主菜单 一级主菜单 下边的四个菜单（滚球， 今日， 电竞， 虚拟体育）, 真正渲染到 页面的数据    =================
  // Level_one_menu_list(this) || 后续修改调整
  const main_menu_list_items = ref([]) 
  //二级菜单项目 TODO second_sub_list(this) ||  后续修改调整
  const sub_menu_list = ref([]) 
  // 二级菜单选中项下标
  const sub_menu_i = ref(0) 
  //选中的子菜单下标集合
  const selected_sub_menu_i_list = ref([0])
  //二级菜单 全部菜单赛事数量
  const all_sport_count = ref(0)
  //三级菜单 早盘日期菜单项
  const date_menu_list = ref([])
  // 四级菜单  虚拟体育赛果 的当前下标
  const virtual_sports_results_tab_item_i = ref(0) 
  // 四级菜单信息
  const four_menu_item = ref(null) 
  //一级主菜单 选择项菜单  中间下拉弹框
  const main_select_items = ref([])
  //菜单容器是否收起
  const menu_wrap_simple = ref(false)
  //菜单容器二级菜单是否收起
  const sport_container_simple = ref(false)
  //渐进显示子菜单选择器
  const show_selector_s2 = ref(false)
  //弹出框的 中间选择器
  const show_selector_inner = ref(false)
  //是否显示子菜单选择器
  const show_selector_sub = ref(false)
  //上次选择的主菜单
  const prev_main_menu_i =ref(-1)
  //活动是否有可领取的任务
  const task_list = ref(0) 
  // 定时器
  const timer_super1 = ref(0)
  const timer_super2 = ref(0)
  // 隐藏一级菜单下标
  const show_one_menu_index = ref(false) 
  const route_enter_timeout = ref(0)
  const route_enter_timer = ref(null) 
  // 出错时，活动默认图片
  const activity_default = ref(`image/wwwassets/activity/activity_entrance.png`) 
  // computed: {
  //   ...mapGetters([
  //     'get_user',
  //     'get_curr_sub_menu_type',
  //     'get_access_config'
  //   ])
  // },
  // 进入主列表页立即触发  TODO $route 后续修改调整
  if($route.name == 'matchList'){
      enter_page_immediately()
  }
  // 早盘，串关，电竞日期，缓存数据获取
  date_cache_initialization()
  // 初始化 root.$on 事件监听
  on_listeners()

  // 从活动页面返回时，执行方法, 活动是否有可领取的任务数量，中文并且不是维护，有活动数据时，才调用是否有红点的接口
  get_task_list()
  
    // ...mapMutations({
      // 主菜单选中项下标 (非展开的)
    //   set_main_menu_dom_i:'set_main_menu_dom_i', 
    //设置当前二级菜单menu_type
    //   set_curr_sub_menu_type: "set_curr_sub_menu_type", 
    //设置三级菜单id
    //   set_curr_third_menu_id: "set_curr_third_menu_id",
    // 设置首页菜单数据 
    //   save_home_data:"save_home_data",
    // 主菜单下拉选择器选中的赛事下标
    //   set_selector_w_m_i:'set_selector_w_m_i',  
    // 当前选中的一级菜单
    //   set_current_first_menu:'set_current_first_menu',  
    // 当前选中的二级菜单
    //   set_current_second_menu:'set_current_second_menu',  
    // 当前选中的二级菜单
    //   set_current_three_menu:'set_current_three_menu',  
    // 当前选中的菜单
    //   set_current_menu:'set_current_menu', 
    // 当前选中的菜单   
    //   set_md:'set_md',    
     // 设置当前主菜单menu_type
    //   set_menu_type: "set_menu_type",  
    // 当前选中日期菜单索引    
    //   set_date_menu_curr_i:'set_date_menu_curr_i', 
    // 设置当前二级菜单id  
    //   set_current_sub_menuid: "set_current_sub_menuid",
    // 设置当前电竞二级菜单id 
    //   set_current_esport_csid: "set_current_esport_csid", 
    //   set_sport_all_selected:'set_sport_all_selected',
    // 早盘 和 串关和 电竞的  日期菜单数据
    //   set_current_date_menu:'set_current_date_menu', 
     // 是否收藏
    //   set_show_favorite_list:'set_show_favorite_list',
     // 首页跳转菜单参数
    //   set_global_route_menu_param: 'set_global_route_menu_param', 
    // 筛选弹出框是否显示设置
    //   set_show_match_filter:'set_show_match_filter', 
     // 进入列表页时 触发
    //   set_global_match_route_enter:'set_global_match_route_enter',
    //上次选中的主菜单type
    //   set_prev_menu_type:'set_prev_menu_type', 
    // 四级菜单信息
    //   set_level_four_menu:'set_level_four_menu',   
    // 存储赛事折叠/展示状态
    //   set_ball_current_csid_object: 'set_ball_current_csid_object', 
    // }),
    // 进入主列表页 主菜单时，立即触发方法
    const enter_page_immediately = () => {
      // 初始化 路由的参数 TODO $route后续修改调整
      if ($route.query.m) {
        //     m表示主菜单id    s表示二级菜单id         （t日期菜单id一般不用）r
        let { m, s, t } = $route.query; 
        set_global_route_menu_param({ m, s, t });
      } else if ($route.query.mt1) {
        //    mt1 表示主菜单menu_type     mt2 表示子菜单menu_type         记住首页球种r
        let { mt1, mt2 } = $route.query; 
        set_global_route_menu_param({ mt1, mt2 });
      } else {
        set_global_route_menu_param({});
      }
      // 刚进入页面阻止二级菜单收起
      set_global_match_route_enter(Math.random());
      clearTimeout(route_enter_timeout);
      route_enter_timeout = setTimeout(() => {
        set_global_match_route_enter(0);
      }, 2500);
    }
    // 初始化菜单数据
    const initialize_menu_data = (type) => {
      prev_main_menu_i = -1
      // 如果所有菜单数据 有缓存，则走缓存
      // 如果有get_home_data 数据，则走缓存, 更快的渲染，或者菜单出错时，可以走得通
      if(get_home_data.length > 0){
        menu_first_load(get_home_data,type)
      }
      // 调用接口，更新菜单数据
      call_the_interface_to_update_the_menu_data()
      // TODO 后续修改调整
      $forceUpdate()
    }
    // 菜单首次加载，一级菜单，二级菜单 数据，都在这里赋值
    const menu_first_load = (res_data, type) => {
      // 主菜单列表数据, 进行数据操作用的, 不是 真正渲染到 页面的数据
      main_menu_list = res_data
      // 获取主菜单列表
      get_main_menu_init_data()
      // 二级菜单 list渲染数据
      sub_menu_list = main_menu_list_items[get_main_menu_dom_i].subList
      show_one_menu_index = true
      // 更新二级菜单  全部菜单 赛事数量
      update_gunqiu_count(res_data)
      //  如果是首页跳转过来的，则跳转到对应的 id 菜单
      if (type == 'first_load') {
        // 获取一级菜单，二级菜单id,跳转到对应的 菜单
        get_the_first_and_second_level_menu_id()
      }else{
        // 代表点击一级菜单
        // 一级菜单点击事件
        main_item_clicked(get_main_menu_dom_i, type || 'init_data')
      }
    }
    // 二级菜单显示隐藏
    const show_two_menu_func = (item) => {
      // ((show_favorite_list && sub.count) || [900,3000].includes(+menu_type) || sub.count)
      return item.count ? true :false
    }
    /**
     * 一级菜单点击事件
     * @param {Number} main_index 一级菜单下标
     * @param {String} type 变化类型
     * @param {String} is_selected 一级菜单选择器选中项触发
     * @return {undefined}
     */
    const main_item_clicked = (main_index, type, is_selected, main_m) => {
      // 一级菜单限制切换
      if((get_main_menu_dom_i == main_index && main_index != 1 && type == 'dir_click')) {return;}
      // 一级菜单切换时的状态还原   二级菜单, 三级菜单，四级菜单 容器是否收起
      main_menu_state_restore(false)
      // menu_type 滚球:1 今日:3 早盘:4 串关:11 冠军:100 虚拟体育:900  赛果:20,如果不是 虚拟体育 900.则设置当前菜单
      // 点击的 当前 一级菜单对象
      let main_menu_o = lodash.cloneDeep(main_menu_list_items[main_index]);
      // 如果不是虚拟体育
      if(main_menu_o.menuType != 900){
        // 当前选中的 一级菜单对象
        set_current_first_menu(main_menu_list_items[main_index])
        // 当前选中的 一级菜单对 下标 (非展开的)
        set_main_menu_dom_i(main_index);
      }
      //虚拟体育页跳转逻辑，直接跳转到 虚拟体育的 路由 TODO $router后续修改调整
      if((main_menu_o.menuType == 900 || main_menu_o.menuId == 407) && type == 'dir_click'){
        $router.push({name: 'virtual_sports'});
        return;
      }
      // 如果当前点击的一级菜单 下标是 1， 并且 上次记录的 一级菜单是 1， 并且是 （第一次查询 或者 用户手动点击）
      if(main_index == 1 && prev_main_menu_i == 1 && ['init_data','dir_click'].includes(type) && is_selected != 'is_selected'){
        // 限制点击切换
        if (utils.is_time_limit()) { return }  
        // 记录一级菜单切换的 下标,记录之后赋值给 prev_main_menu_i
        record_main_index(main_index)
        // 主菜单  今日里边---中间下拉弹框,如果是true，展开, 则隐藏 中间下拉弹框
        if(show_selector_sub){
          close_menu_popup()
        }else{// 若隐藏，则 展开弹出框
          show_selector_sub = true;
          clearTimeout(timer_super2)
          timer_super2 = setTimeout(() => {
            show_selector_s2 = true;
            show_selector_inner = true;
          },50);
        }
      }else{
        // 正常一级菜单切换时触发
        // 设置上一次的主菜单 menu_type
        set_prev_menu_type(menu_type);
        // 设置当前主菜单 menu_type
        set_menu_type(main_menu_o.menuType);
        when_switching_primary_menu(main_menu_o, main_index, type)
        // 主菜单  今日里边---中间下拉弹框,如果是true，展开, 则隐藏 中间下拉弹框
        if(show_selector_sub){
          close_menu_popup()
        }
      }
      if(main_m?.menuId && main_m.menuId == "400"){
        if(is_selected != 'first'){
          setTimeout(() => {
            // 头部点击滚球进入列表  默认 全部
            select_all_sub_menu_handle() 
          }, 100);
        }
      }
    }
    /**
     * 滚球和 今日 和 电竞的正常一级菜单切换
     * @param {Number} main_menu_item 点击的 当前对象
     * @param {String} main_index 一级菜单 下标
     * @param {String} type 变化类型
     */
    const when_switching_primary_menu = async (main_menu_item, main_index, type) => {
      // 如果当前主菜单不是赛果
      if(![28].includes(+main_menu_item.menuType)){
        // 设置 当前二级菜单的值
        sub_menu_list = main_menu_item.subList
        // 诸葛埋点相关集中在这里
        one_lable_zhuge(type)
      }else{  // 如果是赛果
        // 如果有缓存，则使用缓存
        // TODO sessionStorage 后续修改调整
        let cache_data_str = sessionStorage.getItem('result_sub_menu_cache')
        // 缓存执行
        if(cache_data_str){
          // 赛果二级菜单数据处理
          result_sub_menu_api_handle(JSON.parse(cache_data_str), type);
        }else{ // 每次点击一级菜单时，都触发赛果  获取赛果二级菜单  接口
          // 如果当前主菜单是赛果, 获取赛果二级菜单
          let {code, data} = await api_result.get_result_menu()
          if (code == 200 && Array.isArray(data)) {
            if(lodash.get(data,'[0].menuType')==29){
              // 当是我的投注时菜单进行时间排序
              let arr = lodash.get(data,'[0].subList');
              if(arr){
                arr.sort((a, b)=>{
                  if(b.field1 < a.field1){
                    return -1
                  }else{
                    return 1
                  }
                })
              }
            }
             // TODO sessionStorage 后续修改调整
            sessionStorage.setItem('result_sub_menu_cache',JSON.stringify(data));
            // 赛果二级菜单数据处理
            result_sub_menu_api_handle(data, type);
          }
        }
      }
      // 记录一级菜单切换的 下标,记录之后赋值给 prev_main_menu_i
      record_main_index(main_index)
      if(['init_data', 'follow'].includes(type)){
        //一级菜单初始化加载
        initial_loading_of_the_first_level_menu()
      }else{
        // 查找第一个有赛事的 二级菜单
        let has_match_index = find_second_menu_have_first_match()
        // 切换一级菜单时，二级菜单切回第一个有赛事的位置
        sub_menu_changed(menu_type == 3000 ? 0 : has_match_index,'init_sub_data')
      }
    }
    /**
     * 二级菜单点击事件
     * @param {Number|Array}sub_i 变化菜单的下标
     * @param {String}is_dir_click 是否为用户直接点击触发,而不是一级菜单选中后自动切换二级菜单
     */
    const sub_menu_changed = (sub_i, is_dir_click) => {
      //重复点击相同的二级菜单阻止请求
      if(is_dir_click == 'dir_click' && sub_menu_i == sub_i){
        return
      }
      // 切换二级菜单时把当前页赛事折叠/展开状态置空
      set_ball_current_csid_object({})
      // 二级菜单诸葛埋点集中在这里----赛种
      zhuge_md(is_dir_click, sub_i)
      //滚动二级菜单选中项到屏幕显示区域
      $nextTick(()=>{
        utils.tab_move(sub_i, $refs.sub_menu_scroller, $refs.scrollItem, is_dir_click == 'init_sub_data' ? true : 'no_fast')
      })
      // 选中二级菜单全部按钮 置为false
      set_sport_all_selected(false);
      // 二级菜单选中项下标
      sub_menu_i = sub_i;
      virtual_sports_results_tab_item_i = 0
      //选中的子菜单下标集合
      selected_sub_menu_i_list = [sub_i]
      // 设置当前二级 菜单 内容
      set_current_second_menu(sub_menu_list[sub_i]);
      // 设置当前二级 菜单id
      set_current_sub_menuid(lodash.get(sub_menu_list[sub_i],'menuId'));
      // 如果是电竞，则 设置背景图
      if(main_menu_list_items[get_main_menu_dom_i].menuType == 3000){
        set_current_esport_csid(sub_menu_list[sub_i].field1)
      }
      // 早盘,串关,电竞  ------  拉取接口，更新日期菜单
      get_date_menu_api_when_subchange()
    }
    /**
     * 三级菜单日期 点击事件
     * @param {Number} i 变化的下标
     * @param {String} is_direct 是否为用户直接点击界面触发
     */
    const date_menu_clicked = (index, is_direct) => {
      // 限制三级菜单
      if(date_menu_curr_i == index && is_direct == 'date_click'){
        return
      }
      // 当前选中日期菜单索引
      set_date_menu_curr_i(index);
      // tab的 一个滑动动画
      utils.tab_move2(index, $refs.date_menu_container)
      //  设置三级日期 菜单
      set_current_three_menu(date_menu_list[index])
      set_one_two_three_level_menu_data()
      // 如果上一次选择的主菜单和 这一次选中的主菜单一样，
      if(get_prev_menu_type == menu_type && is_direct =='date_click'){
        // 重置上一次选择的主菜单
        set_prev_menu_type(menu_type)
      }
      // 如果是赛果，并且是 虚拟体育, 即 是  四级菜单
      if(is_results_virtual_sports){
        virtual_sports_results_click_handle(virtual_sports_results_tab[virtual_sports_results_tab_item_i],virtual_sports_results_tab_item_i)
      }else{//  是三级菜单
        four_menu_item = null
        // 菜单实例 初始化
        handle_MenuInfoInstance_init()
        // 切换二级菜单时把当前页赛事折叠/展开状态置空
      set_ball_current_csid_object({})
      }
    }
    /**
     * 四级菜单虚拟体育赛果 点击事件
     * @param {Number} tab_item 点击的当前对象
     * @param {Number} index 变化的下标
     */
    const virtual_sports_results_click_handle = (tab_item,index) => {
      four_menu_item = tab_item
      set_level_four_menu(tab_item)
      virtual_sports_results_tab_item_i = index;
      // 菜单实例 初始化
      handle_MenuInfoInstance_init()
    }
    // 诸葛埋点
    const zhuge_md = (is_dir_click, sub_i) => {
      if (is_dir_click == 'dir_click' ) {
        let eventLabel = '',
        scheduleType = '';
        // 判断当前菜单类型
        switch (menu_type) {
            // 今日
          case 3:
            if (sub_menu_list[sub_i].menuType == '7') {
              eventLabel = 'H5_今日_篮球';
            } else if (sub_menu_list[sub_i].menuType == '5') {
              eventLabel = 'H5_今日_足球';
            }
            scheduleType = '今日'
            break;
            // 早盘
          case 4:
            if (sub_menu_list[sub_i].menuType == '7') {
              eventLabel = 'H5_早盘_篮球';
            } else if (sub_menu_list[sub_i].menuType == '5') {
              eventLabel = 'H5_早盘_足球';
            }
            scheduleType = '早盘'
            break;
            // 串关
          case 11:
            if (sub_menu_list[sub_i].menuType == '7') {
              eventLabel = 'H5_串关_篮球';
            } else if (sub_menu_list[sub_i].menuType == '5') {
              eventLabel = 'H5_串关_足球';
            }
            scheduleType = '串关'
            break;
        }
        if (eventLabel && scheduleType) {
          // TODO $utils 后续修改调整
          $utils.zhuge_event_send(eventLabel, user_info, {'赛程类型': scheduleType});
        }
      }
    }
    // 诸葛埋点
    const one_lable_zhuge = (type) => {
      if (menu_type === 1 && type === 'dir_click') {
        // 埋点采集现场滚球盘点击, 只采集手动点击
        let objKey = {
          clickTime: "点击时间",
          userName: "用户名",
          userId: "用户ID",
          merchantId: "商户ID",
          languageVersion: "语言版本",
          terminal: "访问终端",
        }
        let obj = {
          [objKey.clickTime]: date.formatDate(new Date().getTime(), 'YYYY-MM-DD HH:mm:ss'),
          [objKey.userName]: lodash.get(get_user, 'userName'),
          [objKey.userId]: lodash.get(get_user, 'userId'),
          [objKey.merchantId]: lodash.get(get_user, 'mId'),
          [objKey.languageVersion]: lodash.get(get_user, 'languageName'),
          [objKey.terminal]: "h5"
        }
        $utils.zhuge_track('现场滚球盘', obj);
      }
    }
    /**
     * @description: 联赛联赛图标出错
     * @param {Object} $event 错误事件对象
     */
    const activity_icon_error = ($event) => {
      $event.target.src = activity_default;
      $event.target.onerror = null
    }
    /**
     * 主菜选择器项目点击
     * @param {Number} i 一级菜单下标
     * @param {Number} type 用户触发的类型，初始化 init_data   点击 是  dir_click
     * @return {undefined}
     */
    const selector_m_clicked = (i, type) => {
      // 如果没有数据，则return 终止方法
      if(main_menu_list_items.length < 1) { return }
      // 如果面板点击的是 同一个，则关闭面板，并且 return 终止方法
      if(selector_w_m_i == i && type != 'init_data') {
        close_menu_popup()
        return;
      }
      // 记录当前菜单类型 今日/早盘/串关
      if ( type == 'dir_click') {
        let eventLabel = '', scheduleType = '';
        if (menu_type == '3') {
          eventLabel = 'H5_今日';
          scheduleType = '今日';
        } else if (menu_type == '4') {
          eventLabel = 'H5_早盘';
          scheduleType = '早盘';
        }
        if (eventLabel && scheduleType) {
          // TODO $utils 后续修改调整
          $utils.zhuge_event_send(eventLabel, user_info, {'赛程类型': scheduleType});
        }
      }
      // 设置  主菜单下拉选择器选中的赛事下标
      set_selector_w_m_i(i);
      let m_selected = main_select_items[i];
      // 当前选择的面板的值，赋值给 一级菜单 中间位置 “今日”
      // Object.assign(main_menu_list_items[1],lodash.cloneDeep(m_selected));
      // lodash.merge(main_menu_list_items[1],lodash.cloneDeep(m_selected));
      main_menu_list_items[1] = lodash.cloneDeep(m_selected)
      // 调用中间的 主菜单切换逻辑
      main_item_clicked(1, type, 'is_selected');
    }
    // 菜单实例 初始化, 调用 列表接口
    const handle_MenuInfoInstance_init = () => {
      // 调用列表接口
      // TODO $root 后续修改调整
      $root.$emit(emit_cmd.EMIT_MAIN_MENU_CHANGE);
    }
    // 早盘 和 串关 和 电竞 的日期菜单用缓存的数据初始化
    const date_cache_initialization = () => {
      if (get_current_date_menu.length && [4, 11, 3000].includes(+menu_type)) {
        date_menu_list = get_current_date_menu;
      }
    }
    /**
     * 进入活动页
     */
    const openActivity = () => {
      if(!lodash.get(get_access_config,'activitySwitch')){
        // TODO $toast 后续修改调整
        $toast($root.$t(`common.temporarily_unavailable`), 2000)
        return
      }
      // TODO $router $utils 后续修改调整
      $utils.zhuge_event_send('H5_任务中心', user_info);
      $router.push({name:'activity_task', query: { rdm: new Date().getTime() }})
    }
    // 是否有活动可领取的任务数量
    const get_task_list = (id = 1) => {
      if(get_lang == 'zh' && user_info && !user_info.maintaining && user_info.activityList) {
        let isMaintaining = lodash.get(user_info, 'maintaining');
        // 如果活动处于维护状态，直接去掉小红点
        if (isMaintaining == true) {
          if (task_list == true) {
            task_list = false;
          }
          return
        };
        // 判断是否有活动
        let activityList = lodash.get(user_info, 'activityList');
        // 检测两个活动是否存在以及活动状态不能是未开始和已结束
        let daily = activityList.find(item => item.activityId == '10007' && item.period == 2) || null;
        let growup = activityList.find(item => item.activityId == '10008' && item.period == 2) || null;
        if (!daily && !growup) {return;}
        // 1 每日任务 2成长任务
        const param = {
          actId: id
        }
        activity_task_api.get_details(param, {type: 1}).then(res => {
          let code = lodash.get(res, 'code');
          let data = lodash.get(res, 'data');
          if (code == 200 && data && data.length > 0) {
            // 判断是否有可领取奖券的任务
            task_list = data.some(item => item.bonusType == 3) || false;
            if (!task_list && id == 1) {
              get_task_list(2)
            };
          }
        });
      }
    }
    // 监听是否路由跳转进入赛事列表页状态变化
    const get_global_match_route_enter = watch((is_enter) => {
      if(is_enter){
        // 早盘 和 串关 和 电竞 的日期菜单用缓存的数据初始化
        date_cache_initialization()
        if(lodash.get(get_global_route_menu_param, 'm') || lodash.get(get_global_route_menu_param, 'mt1')){
          initialize_menu_data('first_load');
        }else{
          initialize_menu_data()
        }
      }
    })
    //监听路由跳转 信息
    watch(() => $route, (to, from) => {
      if( from.name != 'matchList' && to.name == 'matchList'){
        clearTimeout(route_enter_timer)
        route_enter_timer = setTimeout(() => {
          // 进入主列表页立即触发
          enter_page_immediately()
        },20);
      }
    })
    // 监听滚球全部菜单，如果关闭，并且在滚球下，则隐藏全部，调整到第一个位置
    watch(() => get_access_config.playAllShow, (n, o) => {
      // handler(){
      //   if(!n && menu_type == 1){
      //     sub_menu_changed(0,'dir_click');
      //   }
      // }
    })
    
    /**
     * 列表滚动
     */
    watch(() => get_list_scroll_top, (sc,o_sc) => {
      let scroll_y = +sc.split('-')[0];
      // 只有在今日  下边的 足球  和 篮球下，滑动 超过100px  才有效果，全局触发一次
       // TODO sessionStorage 后续修改调整
      if (scroll_y >= 100 && !sessionStorage.getItem('matchList_buried_point_time') && [3].includes(+menu_type) && [5, 7].includes(get_curr_sub_menu_type)) {
        sessionStorage.setItem('matchList_buried_point_time', new Date().getTime())
        // 今日足球篮球当 滑动超过100px  或者 今日足球停留 20秒  埋点触发方法
        $utils.zhuge_event_send(get_curr_sub_menu_type == 5 ? 'H5_今日_足球_默认页面滚动超100': 'H5_今日_篮球_页面滚动超100', user_info, {'停留时长分布': '1-5S'});
      }
      // 1向上滑,-1向下滑
      let scroll_dir = get_list_scroll_direction;
      if(!get_global_match_route_enter){
        //向下滑
        if(scroll_dir < 0 || !scroll_y){
          // 菜单容器是否收起
          main_menu_state_restore(false)
        }
        //向上滑
        else if(scroll_dir > 0){
          let menu_distance = [4,11,28].includes(+menu_type) ? rem(.93) : rem(.60);
          menu_distance -= rem(.04);
          if(scroll_y > menu_distance){
            // 菜单容器是否收起
            main_menu_state_restore(true)
          }
        }
      }
    })
    
    // 切换关注与非关注时，更新菜单接口数据
    watch(() => show_favorite_list, () => {
      call_the_interface_to_update_the_menu_data('follow');
    })
  // components: {
  //   'set-menu': setMenu,
  //   "sub-menu-specially":sub_menu_specially
  // },
</script>

<style scoped lang="scss">
.menu-inner-wrap {
  width: 100%;
  height: .44rem;
  position: relative;
  padding-bottom: .01rem;
  .m-i-background {
    width: 100%;
    height: 1.35rem;
    background-repeat: no-repeat;
    background-size: cover;
    // 使用css变量统一管理，所以废弃这里代码，转为不遍历
    // @each $e-sports in dota, lol, wangzhe, csgo {
    //   &.#{$e-sports} {
    //     background-image:  url("~public/image/bw3/menu/menu-top-background-#{$e-sports}.jpg");
    //   }
    // }
    &.dota {
      background-image: var(--q-color-com-img-bg-169);
    }

    &.lol {
      background-image: var(--q-color-com-img-bg-170);
    }

    &.wangzhe {
      background-image: var(--q-color-com-img-bg-171);
    }

    &.csgo {
      background-image: var(--q-color-com-img-bg-172);
    }

  }
  .main-wrap {
    width: 100%;
    height: 0.44rem;
    display: flex;
    align-items: center;
    color: #414655;
    transition: padding-top 0.3s;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    &.esport{
      background-color: transparent;
    }

    .goback-icon-wrapper {
      height: .2rem;
      padding-left: .15rem;
      img {
        width: .12rem;
        height: .2rem;
      }
    }
    .goback-icon-wrapper2{
      visibility:hidden;
    }
    .main-menu-container {
      flex:1;
      height:.27rem;
      line-height:1;
      position:relative;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      border-radius: 0 0 .05rem .05rem;
      padding-top:1px;
      padding-right:0.04rem;
      margin-left: .15rem;
      &.esport{
        background-color: transparent;
      }
      .m-menu-item{
        flex:1;
        max-width:.8rem;
        position:relative;
        height:.2rem;
        font-size:.16rem;
        display: flex;
        justify-content:center;
        &.current{
          .i-title{
            font-weight:bold;
            &:after{
              content: " ";
              position: absolute;
              /* right: 0.03rem; */
              width: 0.22rem;
              height: 0.03rem;
              border-radius: 0.015rem;
              display: block;
              left: 50%;
              transform: translateX(-50%);
              // background-color: #ffb001;
            }
          }
          .m-menu-count{
            font-weight:bold;
          }
          &.esport{
            .i-title,.m-menu-count{
              color:#ffffff
            }
          }
        }
        .i-title{
          text-overflow: ellipsis;
          white-space: nowrap;
          //overflow: hidden;
          line-height:.2rem;
          position: relative;
        }
        &.main_menu_407{
          &.is_favorite{
            visibility:hidden
          }
        }
        &.main_menu_410{
          margin-right:0;
          position: relative;
          left: .06rem;
        }
        .m-menu-count{
          width: .14rem;
          height:.18rem;
          position: relative;
          top: -.04rem;
          left: .01rem;
          padding-left: .02rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          .count{
            font-size: .11rem;
            &.is_unit{
              min-width: 15px;
              text-align: center;
            }
          }
        }
        &.current{
          .i-title,.m-menu-count{
            font-weight:bold;
          }
          &.esport{
            .i-title,.m-menu-count{
              color:#ffffff
            }
          }
        }
        .dir-triangle{
          width:0;
          height:0;
          border-left: .04rem solid transparent;
          border-right: .04rem solid transparent;
          //border-top: .04rem solid #000000;
          margin-top: .03rem;
          transition:transform .3s;
          position: absolute;
          top: .1rem;
          left: .03rem;
          &.open{
            transform:rotateZ(180deg);
          }
          &.arrow_esport{
            border-top: .04rem solid #fff;
          }
        }
      }
    }
    .activity-logo{
      display: block;
      width:.4rem;
      height:.3rem;
      margin: 0 .1rem 0 0;
      border:none;
      position: relative;
      left: -0.05rem;
    }
    .red-dot{
      width: .05rem;
      height: .05rem;
      border-radius: 50%;
      background: #B11E33;
      position: absolute;
      right: .42rem;
      top: .06rem;
    }
  }

  .sub-menu-date-w{
    width:100%;
    max-height: 1.35rem;
    position:absolute;
    left:0;
    top:.44rem;
    transition: transform 0.6s, max-height 0.3s;
    &.esport{
      transition:unset!important;
      .sport-m-container{
        background-color: transparent;
      }
    }
    &.simple {
      transform: translate3d(0, -0.6rem, 0);

      &.zaopan {
        transform: translate3d(0, -0.93rem, 0);
      }
    }
    // 二级菜单
    .sport-m-container{
      width:100%;
      height:auto;
      max-height:1.35rem;
      overflow:hidden;
      position:relative;

      .s-menu-container{
        width:100%;
        height:100%;
        overflow-x:auto;
        overflow-y:hidden;
        padding-top:.13rem;
        padding-bottom: .05rem;
        flex-wrap:nowrap;
        scrollbar-width: none; // 去除滚动条火狐浏览器兼容性问题
        .sport-menu-item{
          width:.7rem;
          height:100%;
          flex-shrink:0;
          &.champion{
            // width: 0.9rem;
          }
          &.current{
            .inner-w{
              position: relative;
              font-size: .1rem;
              &.favorite{
                &:after {
                  background: rgba(255,145,36,.08);
                }
              }
            }
          }
          .inner-w{
            height:.41rem;
            flex-direction:column;
            flex-wrap:nowrap;
            position:relative;
            .sport-w-icon{
              height:.27rem;
              position: relative;
              .sport-icon-wrap {
                --per: -0.32rem;
                display: block;
                width: auto;
                height: 0.22rem;
                width: 0.22rem;
                background: var(--q-color-com-img-bg-140) no-repeat 0 0 / 0.22rem 18.88rem;
                // 使用css变量统一管理，所以废弃这里代码，转为不遍历
                // @each $item, $img in (d: '04', c: '03', a: '01', e: 'y0', b: '05') {
                //   &.focus-#{$item} {
                //     background-image: url("~public/image/wwwassets/bw3/menu/sport_menu_#{$img}.png");
                //   }
                // }
                &.focus-d {
                  background-image: var(--q-color-com-img-bg-205);
                }

                &.focus-c {
                  background-image: var(--q-color-com-img-bg-206);
                }

                &.focus-a {
                  background-image: var(--q-color-com-img-bg-207);
                }

                &.focus-e {
                  background-image: var(--q-color-com-img-bg-208);
                }

                &.focus-b {
                  background-image: var(--q-color-com-img-bg-209);
                }
              }
              @each $s-number, $y in (s5, 1),
                  (s18, 2),
                  (s7, 3),
                  (s20, 4),
                  (s17, 6),
                  (s16, 7),
                  (s23, 8),
                  (s41, 9),
                  (s44, 10),
                  (s1002, 11),
                  (s45, 12),
                  (s43, 13),
                  (s24, 14),
                  (s14, 15),
                  (s27, 16),
                  (s25, 17),
                  (s39, 18),
                  (s13, 19),
                  (s22, 20),
                  (s26, 21),
                  (s15, 22),
                  (s1011, 23),
                  (s1009, 24),
                  (s30, 26),
                  (s19, 28),
                  (s1001, 29),
                  (s1004, 30),
                  (s29, 31),
                  (s48, 32),
                  (s49, 33),
                  (s50, 34),
                  (s51, 35),
                  (s52, 36),
                  (s53, 38),
                  (s3001, 39),
                  (s3003, 40),
                  (s3004, 41),
                  (s3002, 42),
                  (s20030, 43),
                  (s20031, 44),
                  (s20032, 45),
                  (s20026, 46),
                  (s20027, 47),
                  (s20033, 48),
                  (s20034, 49),
                  (s20035, 50),
                  (s20036, 51),
                  (s20037, 52),
                  (s20038, 53),
                  (s20039, 54),
                  (s100, 55),
                  (s40, 56),
                  (s1010, 57) {
                .#{$s-number} {
                  background-position-y: calc(var(--per) * #{$y});
                }
              }
              .sport-icon-wrap2{
                position:absolute;
                bottom:0;
                right:-0.04rem;
                width:.13rem;
                height:.14rem;
              }
              .sport-match-count{
                width:1px;
                height:1px;
                line-height:1;
                position:absolute;
                right:-.03rem;
                top: 0;
                font-size:.11rem;
              }
            }
            .s-w-i-title {
              max-width: 0.7rem;
              font-size: 0.1rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              position: relative;
              top: -0.01rem;
            }
          }
        }
      }
    }
    // 三级菜单
    .d-c-wrapper{
      width:100%;
      height:.33rem;
      overflow:hidden;
    }

    .date-container {
      width: 100%;
      height: 0.34rem;
      padding-top: 0.10rem;
      overflow-x: auto;
      overflow-y: hidden;
      display: flex;
      line-height: 1;
      padding-left: 0.2rem;
      &::-webkit-scrollbar {
        display: none;
      }
      &.esport{
        background-color: initial!important;
      }
      &:after {
        content: ' ';
        display: block;
        width: 0.01rem;
        height: 0.02rem;
        flex-shrink: 0;
      }
      /*****   日期菜单  ******* -S*/
      .date-menu-item {
        height: 0.2rem;
        font-size: 0.12rem;
        line-height: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex-shrink: 0;
        align-items: center;
        margin-right: 0.19rem;
        position: relative;

        &:last-child {
          width: auto;
          margin-right: 0.1rem;
        }
        &.focus {
          font-size: 0.12rem;

          &:after {
            content: ' ';
            width: 0.14rem;
            height: 0.02rem;
            display: block;
            border-radius: 0.08rem;
          }
        }

        &.hidden-champion {
          display: none;
        }
      }
    }
    /*  联赛菜单 */
    .virtual-sports-results {
      height: 0.42rem;
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      align-items: center;
      padding-left: 0.15rem;

      .tab-item {
        height: 0.26rem;
        line-height: 0.26rem;
        border-radius: 0.04rem;
        margin-right: 0.06rem;
        padding: 0 0.1rem;
        flex-shrink: 0;
      }
    }
  }
  /* **************主菜单中间的下拉弹框  容器********************************** -Star*/
  .main-m-selector-w{
    width:100%;
    height:100vh;
    position:fixed;
    top:.44rem;
    left:0;
    opacity:0;
    transition:opacity .7s;
    overflow:hidden;
    &.effct-in{
      opacity:1;
    }
    .selector-w-inner{
      padding:.2rem 0 .09rem 0.17rem;
      transform:translate3d(0,-2.2rem,0);
      transition:transform .35s;
      &.show{
        transform:translate3d(0,0,0);
      }
      .main-m-select-item{
        width:1.6rem;
        height:.48rem;
        border-radius:.04rem;
        margin-bottom:.15rem;
        &:nth-child(odd){
          margin-right:.2rem;
        }
        & > div {
          height: 0.24rem;
          &.m-menu-name-m {
            font-size: 0.16rem;
          }
          &.m-count-match {
            line-height: 0.24rem;
            font-size: 0.14rem;
            margin-left: 0.09rem;
          }
        }
        &.current{
          &.is-favorite{
            //background-color:#ff9124;
          }
          & > div{
            &:first-child{
              color:#ffffff;
            }
            &:last-child{
              color:#ffffff;
            }
          }
        }
      }
    }
  }
  /* **************主菜单容器********************************** -End*/
}

</style>
