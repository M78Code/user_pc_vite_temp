/*
 * @Description:虚拟体育最外层父组件，包括了上方的球种菜单切换
 */
// import setMenu from "src/project/components/common/set_menu.vue"    // 设置菜单
import { api_v_sports } from "src/api/index.js";
import { utils } from "src/core/utils/common/module/utils.js";
import axios_api_loop from "src/core/http/axios-loop.js"
import { debounce_throttle_cancel } from "src/core/utils/common/module/other.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import lodash from "lodash"
import tab_move from "src/core/tab-move/tab-move.js";
import { useRouter, useRoute } from "vue-router";
import { go_where } from "src/output/index.js";
import { format_money2, compute_local_project_file_path, UserCtr } from "src/output/index.js";
import { compute_css_obj, MenuData } from "src/output/index.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { pre_load_video } from 'src/core/pre-load/module/pre-load-video.js';
import BaseData from "src/core/base-data/base-data.js";
export default {
  name:'match_main',
  data() {
    return {
      ws_invoke_key:'virtual-sports',
      // 当前选中的虚拟体育菜单(虚拟足球 赛马 赛狗 等)
      current_sub_menu: {},
      //虚拟体育赛事列表接口请求参数
      virtual_sports_params:{
        csid:'',
      },
      //虚拟体育菜单选中项下标
      sub_menu_i:0,
      //虚拟体育菜单
      sub_menu_list:[],
      //详情页返回的菜单id
      sub_menu_id_f_detail:'',
      // 默认不刷新
      refreshing:false,
      // 虚拟体育菜单切换标志
      v_menu_changed:0,
      //进入虚拟体育赛事列表标志
      v_match_router_ente:0,
      // 赛事列表滑动高度
      list_scroll_top: 0,
      router: useRouter(),
      route: useRoute(),
      UserCtr,
      BaseData,
      // 用户余额
      balance: 0,
      // 投注数据
      BetData,
      BetViewDataClass,
    };
  },
  created(){
    pre_load_video.load_player_js('old')
    //虚拟体育刷新赛事
    this.timer_super27=0;
    //获取虚拟体育菜单数据
    this.get_virtual_menus();
    this.cancel_ref = lodash.debounce(this.cancel_ref,200)
  },
  mounted() {
    // 不让浏览器记住上次的滚动位置
    if ('scrollRestoration' in History){
      history.scrollRestoration = 'manual'
    }
    //虚拟体育页更改语言
    if (!location.search.includes('keep_url')) {
      history.replaceState(window.history.state,'',`${location.pathname}${location.hash}`)    //地址栏优化
    }
  },
  /**
   * @description: 触发路由进入之前事件 详情页返回记住上次选中的体育类型
   * @param {Object} to 到达路由对象
   * @param {Object} from 来自路由对象
   * @param {Function} next 路由到达本组件后的回调函数
   * @return {Undefined} Undefined
   */
  beforeRouteEnter(to, from, next) {
    next(_this => {
      _this.v_match_router_ente = Math.random();
      if(from.name == "virtual_sports_details"){
        if(_this.get_virtual_current_sub_menuid){
          _this.sub_menu_id_f_detail = _this.get_virtual_current_sub_menuid;
        }
      }
    });
  },
  /**
   * @description: 触发本组件销毁之前回调
   * @param {Undefined} Undefined
   * @return {Undefined} Undefined
   */
  unmounted() {
    debounce_throttle_cancel(this.cancel_ref);
    this.emitters && this.emitters.map((x) => x());

    this.clear_timer();

    // 删除虚拟体育赛狗和赛马玩法缓存
    for (const key in sessionStorage) {
      if (key.match(/^\/d.+-cache$/)) {
        sessionStorage.removeItem(key);
      }
    }
    clearTimeout(this.timer_super27);
  },
  watch: {
    "UserCtr.user_version": {
      handler(){
        this.set_balance(UserCtr.balance)
      },
      immediate: true
    }
  },
  methods: {
    get_user_balance(){
      lodash.throttle(() => {
          UserCtr.get_balance()
      },5000)
    },
    go_to_back() {
      if(MenuData.old_current_lv_1_menu_i!=6) {
          BetData.set_is_bet_single('single')
      }
          BetData.set_clear_bet_info()
          BetViewDataClass.set_clear_bet_view_config()
    },
    set_balance(balance){
      this.balance = balance;
    },
    // 设置当前选中的二级菜单id
    set_virtual_current_sub_menuid(data){VR_CTR.state.virtual_current_sub_menuid = data},
    // 设置当前选中的二级菜单type
    set_curr_sub_menu_type(data){VR_CTR.state.curr_sub_menu_type = Number(data)},
    // 设置虚拟体育数据loading状态
    set_virtual_data_loading(data){VR_CTR.state.virtual_data_loading = data},
    /**
     * @description: 赛事列表回到顶部
     */
    back_top() {
      this.$refs.scrollArea && this.$refs.scrollArea.scrollTo(0,0)
    },
    click_event(){
      useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);
    },
    /**
     * @description: 更新赛事列表滚动高度
     */
    wrapper_scroll_handler(e) {
      if (e) {
        this.list_scroll_top = e.target.scrollTop
      }
    },
    /**
     * 虚拟体育刷新
     */
    vir_refresh(){
      if(this.refreshing) return;
      this.refreshing = true;
      this.timer_super27 = setTimeout(() => {
        // 取消刷新 已做节流
        this.cancel_ref();
      },700);
    },
    cancel_ref(){
      this.refreshing = false;
    },
    /**
     * 虚拟体育菜单切换
     */
    virtual_menu_changed(i){
      tab_move.tab_move(i, this.$refs.scroll_main, this.$refs.scroll_box)
      this.sub_menu_i = i;
      this.current_sub_menu = this.sub_menu_list[i];
      this.virtual_sports_params.csid = this.current_sub_menu.menuId;
      // 足蓝跳转到其他虚拟赛种前， 给状态一个标识
      this.v_menu_changed = ([1001, 1004].includes(this.get_curr_sub_menu_type) ? 'zu_lan_' : '') + Math.random();
      console.log(this.get_curr_sub_menu_type, 'this.get_curr_sub_menu_type')
      this.set_virtual_current_sub_menuid(this.current_sub_menu.menuId);
      this.set_curr_sub_menu_type(this.current_sub_menu.menuType || this.current_sub_menu.menuId)
    },
    get_sub_menu_c_index(){
      let r = 0;
      let sub_menu_id = this.get_virtual_current_sub_menuid;
      r = lodash.findIndex(this.sub_menu_list,{
        field1: sub_menu_id
      })
      if(r < 0) r = 0;
      return r;
    },
    /**
     * 获取虚拟体育菜单
     */
    get_virtual_menus(){
      this.set_virtual_data_loading(1)
      let obj_ = {
        // axios api对象
        axios_api: api_v_sports.get_virtual_menus,
        // axios api对象参数
        params:{},
        // axios中then回调方法
        fun_then: res => {
          if(res.code == 200){
            res.data.forEach(sub_menu => {
              sub_menu.menuName = sub_menu.name;
            });
            this.sub_menu_list = lodash.cloneDeep(res.data);
            // console.log('this.sub_menu_list', api_v_sports.get_virtual_menus)

            this.sub_menu_i = this.get_sub_menu_c_index();
            if(this.sub_menu_list.length){
              if(this.sub_menu_id_f_detail){
                let index = lodash.findIndex(this.sub_menu_list, item => item.menuId == this.sub_menu_id_f_detail);
                this.sub_menu_i = index;
                this.sub_menu_id_f_detail = '';
              }

              if(!this.get_virtual_current_sub_menuid){
                this.set_virtual_current_sub_menuid(this.sub_menu_list[this.sub_menu_i].menuId);
              }
              this.set_curr_sub_menu_type(this.sub_menu_list[this.sub_menu_i].menuId);

              this.virtual_menus_loaded(this.sub_menu_list);
            }else{
              this.virtual_menus_loaded(this.sub_menu_list);
            }
          }
        },
        // axios中catch回调方法
        fun_catch: err => {
          useMittEmit(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA);
        },
        // 最大循环调用次数(异常时会循环调用),默认3次
        max_loop:3,
        // 异常调用时延时时间,毫秒数,默认1000
        timers:1100
      }
      // axios_api轮询调用方法
      axios_api_loop(obj_);
    },
    /**
     * 虚拟体育菜单加载完成
     */
    virtual_menus_loaded(menues){
      if(!menues || !menues.length){
        this.current_sub_menu = {};
        useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
        return;
      }
      this.virtual_sports_params.csid = menues[this.sub_menu_i].menuId;
      if(menues.length){
        this.set_virtual_current_sub_menuid(menues[this.sub_menu_i].menuId);
        this.set_curr_sub_menu_type(menues[this.sub_menu_i].menuId);
      }
      this.current_sub_menu = menues[this.sub_menu_i];
    },
    // 批量清除定时器
    clear_timer() {
      const timer_arr = [
          'timer1_',
          'scrollItemTimer',
          'scrollItemTimer2',
      ]

      for (const timer of timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }
    },
    go_where,
    format_money2, 
    compute_css_obj,
    format_type:(item)=>{
      return MenuData.recombine_menu_bg?MenuData.recombine_menu_bg(item, true):0
    },
    compute_local_project_file_path
  },
  computed: {
    // 当前选中的二级菜单id
    get_virtual_current_sub_menuid(){return VR_CTR.state.virtual_current_sub_menuid},
    // 当前选中的二级菜单type
    get_curr_sub_menu_type(){return VR_CTR.state.curr_sub_menu_type},
  },
};