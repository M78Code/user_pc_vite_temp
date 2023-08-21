/*
 * @Description: H5 主菜单 逻辑
 */
import utils from 'src/public/utils/utils.js';
import { api_home } from "src/project/api/index.js";
//  菜单 和接口返回一样格式的本地假数据（一整个菜单的数据）
import { local_menu_data } from "src/project/pages/sport_menu/config/common_menu.js"
// import {mapGetters} from "vuex";
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"
import lodash from 'lodash'
import { useRoute } from 'vue-router'

export default {
  methods: {
    // 初始化监听事件
    on_listeners() {
      useMittOn(MITT_TYPES.EMIT_MENU_MATCH_COUNT_CHANGE, this.menu_match_count_change_on).on;
      useMittOn(MITT_TYPES.EMIT_RE_STATISTICS_MATCH_COUNT, this.re_statistics_match_count_on).on;
      useMittOn(MITT_TYPES.EMIT_HID_SEARCH_DIA,this.hid_search_dia).on;
    },
    // 调用接口，更新菜单数据
    // follow 代表是 点击关注时，触发这个 方法
    call_the_interface_to_update_the_menu_data(follow) {
      let param = {
        cuid: this.cuid
      }
      api_home.get_menu_init(param).then(res => {
        let menu_data = lodash.get(res, "data");
        // 如果接口正常，有数据
        if (menu_data) {
          this.remove_crosstalk(menu_data)
          // 如果没有get_home_data 数据，则走接口数据形式  first_load 代表是第一次加载菜单接口
          if(lodash.isEmpty(this.get_home_data)) {
            this.menu_first_load(menu_data,'first_load')
          }else if(follow == 'follow'){ //  点击关注才会触发这个方法
            this.menu_first_load(menu_data,follow)
          }
          // 更新主菜单列表
          this.update_main_menu_list(lodash.cloneDeep(menu_data));
          // 设置菜单缓存数据
          this.save_home_data(lodash.cloneDeep(lodash.get(res, "data")))
        }else{
          // 如果接口正常，没有数据，则走本地缓存数据
          this.local_full_menu_method()
        }
      }).catch(e => {
        console.error(e)
        // 本地完整菜单，走主流程的方法
        this.local_full_menu_method()
        this.show_one_menu_index = true
      });
    },
    // 本地完整菜单，走主流程的方法
    local_full_menu_method() {
      this.menu_first_load(local_menu_data(),'first_load')
    },
    // 去除串关
    remove_crosstalk(data) {
      for(let i = data.length-1; i>=0; i--) {
        // 如果是串关去除串关
        if(data[i].menuType == 11){
          data.splice(i,1)
        }
      }
    },
    // 赛果二级菜单  数据（名称） 特殊处理 成 menuName
    result_sub_menu_api_handle(res_data, type){
      // 赛果二级菜单  name 特殊处理 成 menuName
      res_data.forEach(sub_menu => {
        sub_menu.menuName = sub_menu.name;
        sub_menu.subList.forEach(date_menu => {
          date_menu.menuName = date_menu.name;
        })
      });
      this.sub_menu_list = res_data;
      // 如果上次刷新的，则保存上一次的状态，如果是点击的则初始化下标 为 默认第一个 0
      if(type == 'dir_click'){
        this.sub_menu_i = 0
      }
      // 如果是小于0，则默认展示成 0
      if(this.sub_menu_i < 0) {
        this.sub_menu_i = 0
        //选中的子菜单下标集合
        this.selected_sub_menu_i_list = [this.sub_menu_i]
      }
      this.date_menu_list = this.sub_menu_list[this.sub_menu_i].subList;
    },
    // 关闭 中间  一級弹出的  下拉框选择器
    close_menu_popup() {
      if(this.show_selector_sub){
        this.show_selector_s2 = false;
        this.show_selector_inner = false;
        clearTimeout(this.timer_super1)
        this.timer_super1 = setTimeout(() => {
          this.show_selector_sub = false;
        },600);
      }
    },
    // 更新二级菜单滚球 里边的 全部菜单赛事数量
    update_gunqiu_count (m_m_a_copied){
      // 如果是滚球
      for(let i=0, len=m_m_a_copied.length; i<len; i++){
        if(m_m_a_copied[i].menuId == 400){
          this.all_sport_count = m_m_a_copied[i].count;
          break
        }
      }
    },
    /**
     * 记录主菜单 切换的下标，放在 prev_main_menu_i
     */
    record_main_index(main_index){
      let main_menu_first_i = 1;
      // 虚拟体育menuId是 407, 电竞 410
      if(lodash.get(this.get_current_first_menu, 'menuType') == 1) {  main_menu_first_i = 0; }
      else if(lodash.get(this.get_current_first_menu, 'menuType') == 3000) {  main_menu_first_i = 2; }
      else if(lodash.get(this.get_current_first_menu, 'menuType') == 900) {  main_menu_first_i = 3; }
      this.prev_main_menu_i = main_menu_first_i;
    },
    //一级菜单初始化加载
    initial_loading_of_the_first_level_menu() {
      // 如果是滚球下边的全选
      if(this.get_sport_all_selected){
        this.select_all_sub_menu_handle()
      }else{
        this.sub_menu_i = lodash.findIndex(this.sub_menu_list,{menuId:this.get_current_sub_menuid});
        // 如果首次是进入列表页，找不到赛事时，要查找第一个有赛事的二级菜单
        if(this.sub_menu_i < 0) {
          // this.sub_menu_i = this.find_second_menu_have_first_match()
          // 如果是电竞，则默认调用第一个tab 选项卡
          if(this.menu_type == 3000){
            this.sub_menu_i = 0
          }
        }
        // 切换一级菜单时，二级菜单切回第一个有赛事的位置
        this.sub_menu_changed(this.sub_menu_i,'init_sub_data')
      }
    },
    // 获取主菜单列表  this.main_select_items 弹出的一级 菜单数据   this.main_menu_list_items 一级菜单数据
    get_main_menu_init_data(){
      let m_list = this.main_menu_list;
      if(!m_list) return;
      let first, virtual, esport;
      this.main_select_items = [];
      m_list.forEach(m_m => {
        if(m_m.menuType == 1) { first = m_m } // 滚球
        else if(m_m.menuType == 900) { virtual = m_m } // 虚拟体育
        else if(m_m.menuType == 3000) { esport = m_m } // 電競
        else {  this.main_select_items.push(m_m) } // 中间的 一级菜单
      });
      let middle = this.main_select_items[this.selector_w_m_i ? this.selector_w_m_i : 0]; // 当前选中的 中间一级菜单
      this.main_menu_list_items = [];
      if(first){  // 滚球
        this.main_menu_list_items.push(lodash.cloneDeep(first));
      }
      if(middle){ // 中间的 一级菜单
        this.main_menu_list_items.push(lodash.cloneDeep(middle));
      }
      if(esport){ // 电竞
        this.main_menu_list_items.push(lodash.cloneDeep(esport));
      }
      if(virtual){ // 虚拟体育
        this.main_menu_list_items.push(lodash.cloneDeep(virtual));
      }
    },
    // 查找第一个有赛事的二级菜单的 位置下标
    find_second_menu_have_first_match(){

      let sub_menu_list_index = -1
      // 二级菜单数据
      // console.error('sssss')
      let new_main_menu_list_items = this.new_main_menu_list_items
      for(let i = 0, len = new_main_menu_list_items.length; i < len; i++){
        if(new_main_menu_list_items[i].ct > 0 ){ // 二级菜单其中一个有数量，赋值下标
          sub_menu_list_index = i
          break
        }
      }
      return sub_menu_list_index
    },
    /**
     * 检查当前选中的菜单赛事是否为0,如果为0则选中其他菜单
     */
    check_selected_is_nomatch(){
      let cu_sub_menuid = this.get_current_sub_menuid;
      // 查找当前 二级菜单
      let found_sub = this.sub_menu_list.filter(sub_menu => sub_menu.menuId == cu_sub_menuid)[0];
      if(found_sub){
        //当前选中项菜单赛事数量小于1,则 切换另一个赛事数量不为0的菜单
        if(+found_sub.count < 1){
          let f_i = -1;
          // f_i。 = this.find_second_menu_have_first_match()
          if(f_i > -1){
            this.sub_menu_changed(f_i, 'dir_click');
          }
        }
      }
    },
    /**
     * @description: 更新 一级菜单 和 二级菜单 列表 更新
     * @param {Array} menu_list 菜单数据
     */
    update_main_menu_list(menu_list){
      //更新主菜单 数量
      this.main_menu_list = menu_list
      // 获取主菜单列表
      this.get_main_menu_init_data()
      // 二级菜单 list渲染数据   更新本地二级菜单,赛果二级菜单 之前已经赋值了的
      if(this.menu_type != 28){
        this.sub_menu_list = this.main_menu_list_items[this.get_main_menu_dom_i].subList
      }
      // 更新二级菜单滚球 里边的 全部菜单赛事数量
      this.update_gunqiu_count (lodash.cloneDeep(menu_list));
      this.$forceUpdate()
    },
    // 统计菜单赛事数量(调用接口)
    re_statistics_match_count_on() {
      if(['category','details','virtual_sports'].includes(useRoute().name)){return;}
      let params = {cuid: this.cuid };//用户ID/或UUid
      // 如果不是关注模式下，则调用关注赛事列表
      if(!this.show_favorite_list){
        //接口调用
        let fun_temp = ()=> {
          api_home.get_menu_init(params).then(res => {
            let menu_data = lodash.get(res, "data");
            if(menu_data){
              this.remove_crosstalk(menu_data)
              this.main_menu_list = lodash.cloneDeep(menu_data)
              let list_ = utils.menu_to_list_menu_conut(menu_data);
              this.menu_match_count_change_on(list_);
            }
          });
        }
        // 接口限频
        this.cache_limiting_throttling_get_list(params, fun_temp, 'menu_init')
      }
    },
    /**
     * C301推送菜单变化,处理函数 ws推送菜单赛事数量变化
     * @param {Object} skt_data 推送的数据对象
     * @return {Undefined}
     */
    menu_match_count_change_on(skt_data) {
      return
      //更新二级菜单
      let sub_menu_list_copy = lodash.cloneDeep(this.sub_menu_list);
      sub_menu_list_copy.forEach(sub_menu => {
        skt_data.forEach(item => {
          if (sub_menu.menuId == item.menuId ) {
            sub_menu.count = item.count;
          }
        });
      });
      this.sub_menu_list = sub_menu_list_copy
      //更新主菜单
      let main_menu_array = lodash.cloneDeep(this.main_menu_list);
      main_menu_array.forEach((main,m_i) => {
        skt_data.forEach(item => {
          if(item.menuId == main.menuId ){
            if(main_menu_array[m_i].count != item.count){
              main_menu_array[m_i].count = item.count;
            }
          }
        })
        main.subList.forEach(sub => {
          let found_sub = skt_data.filter(skt_sub => skt_sub.menuId == sub.menuId)[0];
          if(found_sub){
            if(sub.count != found_sub.count){
              sub.count = found_sub.count;
            }
          }
        });
      });
      let m_m_a_copied = lodash.cloneDeep(main_menu_array);
      this.main_menu_list = m_m_a_copied
      this.get_main_menu_init_data();
      this.check_selected_is_nomatch();
      this.update_gunqiu_count (m_m_a_copied);
    },
    // 参考iphone6,7,8窗口宽度(375)模拟rem
    rem(value){
      let font_size = innerWidth * 100 / 375;
      return Math.ceil(value * font_size);
    },
    //  获取二级菜单的列表数据 和 二级菜单 选中的下标
    get_sub_dom_i_handle(main_data_i,s_menu_id){
      let curr_sub_list = this.main_menu_list[main_data_i].subList;
      this.sub_menu_list = lodash.cloneDeep(curr_sub_list);
      this.sub_menu_i = lodash.findIndex(this.sub_menu_list,{menuId:s_menu_id});
      this.selected_sub_menu_i_list = [this.sub_menu_i];
    },
    // 监听然后触发隐藏弹出框动作
    hid_search_dia(){
      this.set_show_match_filter(false);
    },
    /**
     * 获取一级菜单，二级菜单id,跳转到对应的 菜单
     * res_data 是接口返回的所有菜单数据
     */
    get_the_first_and_second_level_menu_id() {
      let first_menu_i = -1, main_data_i = 0;
      // mt1,mt2 转换为m,s,t参数
      if(Object.keys(this.get_global_route_menu_param).length){//首页跳转菜单参数
        this.set_global_route_menu_param(this.menu_type2menu_id(this.get_global_route_menu_param,this.main_menu_list))
      }
      let main_id = this.get_global_route_menu_param.m;
      let s_menu_id = this.get_global_route_menu_param.s;
      if(main_id){
        main_data_i = lodash.findIndex(this.main_menu_list, {menuId: main_id});
        // 如果没有找到，默认 0
        if(main_data_i <0) { main_data_i = 0 }
        // 获取主菜单dom元素下标
        first_menu_i = this.get_main_dom_i_handle(main_id);
        // 二级菜单  menuid
        let sub_id = main_id + s_menu_id;
        // 还是获取二级菜单 menuid，重复...
        sub_id = this.check_sub_id_illegal(main_data_i,sub_id);
        this.set_current_sub_menuid(sub_id);
        // 获取二级菜单的列表数据 和 二级菜单 选中的下标
        // this.sub_menu_list = lodash.cloneDeep(curr_sub_list)    this.sub_menu_i    this.selected_sub_menu_i_list=[this.sub_menu_i]
        this.get_sub_dom_i_handle(main_data_i,sub_id);
        // 选择菜单获取赛事   代表   滚球   电竞   虚拟体育
        if([400,407,410].includes(+main_id)){
          // 非中间菜单==============
          this.main_item_clicked(first_menu_i,'init_data');
        }
        else{
          // 中间菜单==============
          this.selector_m_clicked(this.selector_w_m_i,'init_data');
        }
      }else{
        // 菜单初始化时，不能弹出中间弹出框,所以设置初始值 -1
        this.prev_main_menu_i = -1;
        // 一级菜单点击事件
        this.main_item_clicked(this.get_main_menu_dom_i, 'init_data')
      }
    },
    /**
     * @description: 菜单menuType参数  转换成   菜单ID
     * @param {Object} route_menu_param 跳转参数
     * @param {Object} menu_data 菜单数据
     * @return {Object} 修正后的跳转参数
     */
    menu_type2menu_id(route_menu_param,menu_data){
      let res = route_menu_param;
      if(menu_data && menu_data.length){
        // 转换成  m  和  s 的值
        if(route_menu_param.mt1 && route_menu_param.mt2){
          let menu_subList = null;
          for (let i = 0; i < menu_data.length; i++) {
            if(route_menu_param.mt1 == lodash.get(menu_data,i+'.menuType')){
              route_menu_param.m = lodash.get(menu_data,i+'.menuId');
              menu_subList = lodash.get(menu_data,i+'.subList')
              if(menu_subList){
                for (let j = 0; j < menu_subList.length; j++) {
                  if(route_menu_param.mt2 == lodash.get(menu_subList,j+'.menuType')){
                    let menu_id2=lodash.get(menu_subList,j+'.menuId');
                    let parent_id=lodash.get(menu_subList,j+'.parentId');
                    if(parent_id && menu_id2 && menu_id2.startsWith(parent_id)){
                      route_menu_param.s = menu_id2.substring(parent_id.length);
                    }
                    break;
                  }
                }
              }
              break;
            }
          }
        } else if(route_menu_param.mt1){
          // 获取第一个有数量的  二级菜单
          let menu_subList = null;
          for (let i = 0; i < menu_data.length; i++) {
            if(route_menu_param.mt1 == lodash.get(menu_data,i+'.menuType')){
              route_menu_param.m = lodash.get(menu_data,i+'.menuId');
              menu_subList = lodash.get(menu_data,i+'.subList')
              if(menu_subList){
                for (let j = 0; j < menu_subList.length; j++) {
                  if(lodash.get(menu_subList,j+'.count')){
                    let menu_id2=lodash.get(menu_subList,j+'.menuId');
                    let parent_id=lodash.get(menu_subList,j+'.parentId');
                    if(parent_id && menu_id2 && menu_id2.startsWith(parent_id)){
                      route_menu_param.s = menu_id2.substring(parent_id.length);
                    }
                    break;
                  }
                }
              }
              break;
            }
          }
        }
      }
      return res;
    },
    // 二级菜单  滚球的全选按钮
    select_all_sub_menu_handle_old() {
      let changeSubmenu = {}
      this.sub_menu_i = null;
      this.selected_sub_menu_i_list = [];
      // 二级菜单 下标
      this.sub_menu_list.forEach((sub_m,sub_i) => {
        this.selected_sub_menu_i_list.push(sub_i);
      });
      // 获取每个二级菜单 数据
      let sub_focused2 = [];
      this.selected_sub_menu_i_list.forEach(select_i => {
        let sub_select_i = this.sub_menu_list[select_i];
        if(sub_select_i){
          sub_focused2.push(sub_select_i);
        }
      });
      // 获取每个二级菜单的 menuId
      changeSubmenu.menuId = sub_focused2.map(s_m => s_m.menuId).join(',');
      this.set_current_sub_menuid(changeSubmenu.menuId);
      // 设置  一 二 三级 菜单
      let menu_record = {
        main: this.get_current_first_menu,
        sub: { menuId:changeSubmenu.menuId },
        date_menu: null,
      };
      // 设置当前二级 菜单id
      this.set_current_second_menu(changeSubmenu.menuId);
      this.set_current_menu(menu_record);
      // 设置缓存，代表全部
      this.set_sport_all_selected(true);
      // 菜单实例 初始化
      this.handle_MenuInfoInstance_init()
    },
    /**
     * 根据 球类型 获取图标
     * @param {boolean} is_focus 是否选中
     */
    get_sport_icon( is_focus){
      let favorite = ''
      if(is_focus) {
        if(this.show_favorite_list) {
          favorite = 'f';
        }
      }
      if(this.show_favorite_list){
        favorite = 'f';
      }
      // 赛果 408  sport-match-count
      if(this.main_menu_id_c == 408){
        favorite = '';
      }
      //赛果我的投注
      if(is_focus){  //选中情况下的 关注 和 非关注
        return favorite ? (this.get_theme.includes('y0') ? 'focus-e' :'focus-c') : (this.get_theme.includes('y0') ? 'focus-b' :'focus-a')
      }
      //默认黑色版还是白色版
      return this.get_theme.includes('theme02') ? 'focus-d' : '';
    },
    // 是否展示二级菜单 图标
    show_secondary_menu_icon(item) {
      if(!this.show_favorite_list) return true
      let flag = true;
      // 一级菜单赛果 选中关注 不显示虚拟体育的icon (1001:虚拟足球 1002:赛狗 1011:赛马 1004:虚拟篮球 1010:虚拟摩托车)
      if(this.menu_type == 28  && [1001,1002,1011,1004,1010].includes(+item.menuType)){
        flag = false;
      }
      return flag;
    },
    // 回到首页
    go_home() {
      if (this.show_favorite_list) {
        this.set_show_favorite_list(false);
        useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
          text: "footer-follow"
        });
      } else {
        // 应该需要url回传参数才对
        useRoute()r.push({name: 'home'});
        this.set_sport_all_selected(false);
      }
    },
    // 早盘,串关,电竞拉取接口更新日期菜单
    async get_date_menu_api_when_subchange(item){
      // 如果是早盘，串关，电竞的话
      if ([4,11,3000].includes(+this.menu_type) && this.get_current_sub_menuid) {
        // 三级菜单先显示骨架屏，接口回来后，再隐藏骨架屏
        // useMittEmit('match_skeleton_screen_loading',true)
        useMittEmit(MITT_TYPES.EMIT_BEFORE_LOAD_THIRD_MENU_HANDLE);
        let api_func = null,params = {"euid":this.get_current_sub_menuid};
        if(3000 == this.menu_type){
          api_func = api_home.esport_date_menu_api;
          let value = item.mi.slice(1,4)
          params = {csid:value};
          if(!params.csid){
            params.csid = value;
          }
        }
        else{
          api_func = api_home.post_date_menulist;
        }
        await api_func(params).then(res => {
          if(res.code == 200){
            if(res.data && res.data.length){
              this.date_menu_list = res.data;
              this.set_current_date_menu(res.data);
              // 设置日期选中项  调用三级菜单点击事件，默认第一个
              if(this.menu_type != 3000){
                this.select_result_date_menu()
              }
            }else{
              this.date_menu_list = [];
              this.set_current_date_menu([]);
            }
          }
        }).catch((err) => {
          console.error(err);
        });
      }
      else if([28].includes(+this.menu_type)){ // 如果是赛果
        this.date_menu_list = this.sub_menu_list[this.sub_menu_i].subList;
        // 设置日期选中项 调用三级菜单点击事件，默认第一个
        this.select_result_date_menu()
      }
      else{
        //  设置三级日期 菜单
        this.set_current_three_menu(null)
        this.set_one_two_three_level_menu_data()
        // 菜单实例 初始化
        this.handle_MenuInfoInstance_init()
      }
    },
    // 设置一二三级 菜单的 内存, 放在VUEX 里边
    set_one_two_three_level_menu_data() {
      // 一级 主菜单 main, 二级菜单 sub， 三级菜单 date_menu
      let menu_record = {
        main: this.get_current_first_menu,
        sub: this.get_current_sub_menuid,
        date_menu: this.get_current_three_menu,
      };
      // 设置2级菜单类型
      if(this.get_current_second_menu) { this.set_curr_sub_menu_type(lodash.get(this.get_current_second_menu, 'menuType')); }
      if(this.get_current_three_menu){
        this.set_md(this.get_current_three_menu.field1)
        // 设置3级菜单id
        this.set_curr_third_menu_id(lodash.get(this.get_current_three_menu, 'menuId'))
      }
      this.set_current_menu(menu_record);
    },
    /**
     * 获取主菜单dom元素下标
     * @param {String|Number} menu_id 主菜单id
     */
    get_main_dom_i_handle(menu_id){
      let main_dom_i = 0;
      if(menu_id){
        main_dom_i = lodash.findIndex(this.main_menu_list_items,{menuId:menu_id});
        if(main_dom_i == -1){
          main_dom_i = 1;
        }
        if(main_dom_i == 1){
          this.get_menu_selector_dom_i(menu_id);
        }
        this.set_main_menu_dom_i(main_dom_i);
      }
      return main_dom_i;
    },
    /**
     * 获取主菜单下拉选择器dom元素下标
     * @param {String|Number} menu_id 主菜单id
     */
    get_menu_selector_dom_i(menu_id){
      // 一级菜单下拉框dom选择器下标
      let selector_m_i = 0;
      // 滚球, 虚拟体育(VR), 电竞
      if([400,407,410].includes(+menu_id)){
        selector_m_i = 0;
      }else{
        this.main_select_items.forEach((item, index)=>{
          // 如果一级菜单id 和  主选择器的相等，则取下标
          if(item.menuId == menu_id){
            selector_m_i = index
          }
        })
      }
      this.set_selector_w_m_i(selector_m_i);
    },
    /**
     * 检查指定的子菜单id是否存在主菜单里并且是否存在赛事
     * @param {Number} main_i 主菜单下标
     * @param {String}} sub_id 子菜单id
     * @return {String} 合法的子菜单id
     */
    check_sub_id_illegal(main_i,sub_id){
      let resut = sub_id;
      let m = this.main_menu_list[main_i];
      //指定下标的主菜单不存在时取第0个主菜单
      if(!m){
        if(this.main_menu_list && this.main_menu_list[0]){
          m = this.main_menu_list[0];
        }
      }
      //查找指定子菜单id的子菜单
      let found_sub_id = '';
      if(sub_id){
        m.subList.forEach(sub_m => {
          if(sub_m.menuId == sub_id && sub_m.count > 0){
            found_sub_id = sub_m.menuId;
          }
        });
      }
      if(found_sub_id){
        resut = found_sub_id;
      }
      //如果没有找到子菜单,则找第一个有赛事的子菜单
      else{
        for(let i = 0;i < m.subList.length;i++){
          let sub_m_iter = m.subList[i];
          if(+sub_m_iter.count > 0){
            found_sub_id = sub_m_iter.menuId;
            break;
          }
        }
      }
      //如果存在有赛事的
      if(found_sub_id){
        resut = found_sub_id;
      }
      else{ //如果不存在有赛事的子菜单,  则找第0个子菜单的id
        if(m.subList && m.subList[0]){
          resut = m.subList[0].menuId;
        }else{
          resut = '';
        }
      }
      return resut;
    },
    // 一级菜单切换时的状态还原
    main_menu_state_restore(is_val){
      this.menu_wrap_simple = is_val;
      this.sport_container_simple = is_val;
    },
   // 设置日期选中项
    select_result_date_menu(){
      //设置日期选中下标
      let date_m_c_i;
      if (this.get_current_menu && this.get_current_menu.date_menu && this.get_prev_menu_type == this.menu_type && this.get_current_menu.sub == this.get_current_sub_menuid) {
        date_m_c_i = lodash.findIndex(this.date_menu_list, {
          menuId: this.get_current_menu.date_menu.menuId
        });
        if (date_m_c_i == -1) {
          date_m_c_i = 0
        }
      } else {
        date_m_c_i = 0
      }
      this.date_menu_clicked(date_m_c_i,'init_data');
    },
    // 计算是否展示弹出框
    show_popup(item, index) {
      let flag = true
      if(!this.show_favorite_list){
      }else{
        if(item.menuType == 28){
          flag = false
        }
      }
      return flag
    },
    // 是否展示
    is_menu_show(item) {
      let reslut = true
      if([3,4,100].includes(+item.menuType)){
        if(item.count<=0){
          reslut = false
        }
      }
      return reslut
    }
  },
  computed: {
    ...mapGetters({
      get_main_menu_dom_i:"get_main_menu_dom_i",        // 主菜单选中下标
      selector_w_m_i:"get_selector_w_m_i",  // 主菜单选择器的下标
      get_theme: "get_theme",
      get_current_first_menu: "get_current_first_menu",    // 当前选中的一级菜单
      get_current_second_menu: "get_current_second_menu",    // 当前选中的二级菜单
      get_current_three_menu: "get_current_three_menu",    // 当前选中的三级菜单
      menu_type: "get_menu_type",           // 获取当前主菜单的menu_type
      get_golistpage: "get_golistpage",      // 商户是否需要直接跳到列表页（url地址有 label=1 或者 sy=1 参数）
      get_lang:"get_lang",
      cuid: "get_uid",                      // 获取当前uuid或用户id
      show_favorite_list:"get_show_favorite_list", // 显示收藏列表
      user_info: "get_user",                   // 当前登录的用户信息
      get_current_menu: "get_current_menu",    // 获取当前主菜单
      current_esport_csid:'get_current_esport_csid',  // 电竞游戏csid
      get_list_scroll_direction:'get_list_scroll_direction',
      date_menu_curr_i: "get_date_menu_curr_i",   //早盘选中项下标
      get_current_sub_menuid:"get_current_sub_menuid", // 当前选中的二级菜单id
      get_current_date_menu:"get_current_date_menu", // 早盘和串关当前球类的日期菜单数据
      get_home_data:"get_home_data", // 首页菜单数据
      get_list_scroll_top:'get_list_scroll_top',
      get_global_match_route_enter:'get_global_match_route_enter',
      get_global_route_menu_param:'get_global_route_menu_param',
      get_sport_all_selected:'get_sport_all_selected',
      get_newer_standard_edition:'get_newer_standard_edition',// 新手版与标准版
      get_prev_menu_type:'get_prev_menu_type',// 新手版与标准版
    }),
    // 当前选择的 一级菜单的 menuId
    main_menu_id_c(){
      let id = -1
      //主菜单 一级主菜单 下边的四个菜单（滚球， 今日， 电竞， 虚拟体育）的 menuId
      let c_menu = this.main_menu_list_items[this.get_main_menu_dom_i];
      if(c_menu){
        id = c_menu.menuId
      }
      return id;
    },
    // 切换到电竞时 的菜单 背景图片
    first_level_menu_subscript_css() {
      return {
        yb_fontsize12: ['th','ms', 'vi', 'ad'].includes(this.get_lang) || (['en'].includes(this.get_lang) && this.get_newer_standard_edition == 1)
      }
    },
    // 赛果下边的 虚拟体育 的四级菜单 数据
    virtual_sports_results_tab() {
      // 如果有二级菜单
      if(this.sub_menu_list.length　> 0){
        let obj = lodash.get(this.sub_menu_list[this.sub_menu_i], 'subList')
        return lodash.get(obj && obj[this.date_menu_curr_i], 'subList')
      }
      return null
    },
    // 是赛果虚拟体育
    is_results_virtual_sports() {
      let is_results_virtual = false
      // 如果是赛果，并且是 虚拟体育
      if(this.menu_type == 28 && [1001,1002,1004,1010,1011,1009].includes(+this.get_current_sub_menuid) && this.virtual_sports_results_tab){
        is_results_virtual = true
      }
      return is_results_virtual
    }
  },
  beforeDestroy() {
    this.useMittOn(MITT_TYPES.EMIT_MENU_MATCH_COUNT_CHANGE, this.menu_match_count_change_on).off;
    this.useMittOn(MITT_TYPES.EMIT_RE_STATISTICS_MATCH_COUNT, this.re_statistics_match_count_on).off;
    this.useMittOn(MITT_TYPES.EMIT_HID_SEARCH_DIA,this.hid_search_dia).off;
    clearTimeout(this.timer_super1)
    clearTimeout(this.timer_super2)
    clearTimeout(this.route_enter_timeout)
    clearTimeout(this.route_enter_timer)
    // clearInterval(this.this.timer_2)
  },
}
