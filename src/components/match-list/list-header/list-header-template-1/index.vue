<!--
 * @Author: Amor
 * @Date: 2020-06-03 18:00
 * @Description: 赛事列表头部
-->

<template>
  <div class="c-match-list-header yb-flex-between " :class=" NewMenu.menu_root == 2 &&  NewMenu.match_list_api_config.guanjun?'today-champion':''">
    <!-- left -->
    <div class="col-left row items-center">
      <!--全部按钮-->
      <div
        v-show="!vx_show_filter_popup && !is_search_page"
        @click="on_change_list_type('match')"
        class="btn-wrap match-btn yb-flex-center cursor-pointer"
        :class="compute_quanbu_btn_class()"
      >
       {{$root.$t("common.all")}}
      </div>
      <!--收藏按钮-->
      <div
        v-show="NewMenu.compute_if_can_show_shoucang() && !vx_show_filter_popup && !is_search_page"
        @click="(enable_collect_api?collect_count:true) && on_change_list_type('collect')"
        class="btn-wrap collect-btn yb-flex-center cursor-pointer"
        :class="{'active':vx_layout_list_type=='collect',}"
        :title="$root.$t('list.my_collect')"
      >
       <icon name="icon-star" :class="{ active: collect_count }" size="14px" :color="vx_layout_list_type == 'collect' ? '#272A33' : collect_count ? '#EFCC6E' : '#ABBAC8'" />
        <span class="number" :class="{'had-count':collect_count}">
          {{collect_count}}
        </span>
      </div>

      <!--当前菜单-->
      <div class="list-title  row items-center">

        <!-- <div class="title-text yb-font-bold ellipsis" :class="{'w105': show_select_time && is_short_title}" v-tooltip="{content:page_title,overflow:1}" v-html="page_title"></div> -->
        <!-- <span v-if="is_search_page" class="title-text path-icon-wrapper" :class="{'search':is_search_page}">
          <span class="icon-triangle3 search-path-icon"></span>
          <span>{{ get_search_keyword.substr(5)}}</span>
        </span> -->
        <span class="title-text path-icon-wrapper">
          <span>{{ page_title }}</span>
        </span>
      </div>

    </div>

    <!-- right -->
    <!-- 冠军 电子竞技 vr  没有 -->
    <div class="col-right yb-flex-center">
      <div class="search-wrap" v-if="is_show_input">
          <icon class="search-icon" color="#ABBAC8" name="icon-search" size="12px" />
          <input class="search-input" @input="$emit('filter_league_data',leagueName)" v-model="leagueName" :placeholder="$root.$t('common.search_text')" type="search" >
      </div>

      <!-- 即将开赛筛选 -->
      <!-- 今日有 收藏没有 冠军没有 -->
      <com-select v-else-if=" NewMenu.menu_root == 2 && vx_layout_list_type !='collect' &&!NewMenu.is_guanjun()" :options="time_list" v-model="$store.state.filter.open_select_time"
      showKey="title" @input="select_time_change">
        <template #prefix><span class="fg1">{{ $t("common.match_soon_filtr") }}</span></template>
      </com-select>

      <!-- 选择联赛按钮 -->
      <!-- 电子竞技 vr 收藏 没有  -->
      <div
        v-show="NewMenu.compute_if_can_show_league_fliter() && vx_layout_list_type !='collect'"
        @click.stop="toggle_filter_popup"
        class="select-btn leagues-btn yb-flex-center cursor-pointer filter-handle yb-hover-bg"
        :class="{active:vx_show_filter_popup,disable:load_data_state != 'data' && !vx_show_filter_popup}"
        :id="DOM_ID_SHOW && `menu-leagues-filter-leagues-btn`"
      >
        {{$root.$t('filter.select_league')}}
        <span
          class="status yb-font-bold"
          :class="vx_show_filter_popup?'filter_full_all':''"
        >{{(vx_filter_checked_all || vx_get_checked_count==0)?$root.$t('common.all'):vx_get_checked_count}}</span>
        <i class="icon-arrow q-icon c-icon" size="14px" ></i>
      </div>
      <!-- 列表排序按钮 -->
       <!-- 电子竞技 vr 没有  -->
      <div
        v-show="NewMenu.compute_if_can_show_sort()"
        show_type="sort"
        class="flex list-sort select-btn  yb-hover-bg"
      >
        <div
          v-for="(sort,index) in sort_option"
          @click="on_click_sort(sort)"
          :class="[sort.id==vx_match_sort ? 'active' : 'yb-hover-bg','list-sort-item']"
          v-show="!vx_show_filter_popup && !is_search_page"
          :key="index"
        >
          {{sort.name}}
        </div>
      </div>

      <!-- 列表刷新 -->
      <div v-show="computed_show_refresh" class="select-btn refresh-btn yb-flex-center yb-hover-bg">
        <slot name="refresh_icon"></slot>
      </div>


      <div
        class="unfold-btn"
        @click="set_unfold_multi_column(false)"
        v-if="NewMenu.is_multi_column && !vx_show_filter_popup && !is_search_page && get_unfold_multi_column"
      >
          <span class="text">{{$root.$t('icon_tips.unfold')}}</span>
          <i class="icon-arrow q-icon c-icon" size="12px" ></i>
        </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import global_mixin from "src/public/mixins/global/global_mixin.js";
import sport_icon from "src/public/components/sport_icon/sport_icon.vue";//精灵图组件
import odds_conversion_mixin from "src/public/mixins/odds_conversion/odds_conversion_mixin";//赔率转换
import comSelect from "src/public/components/select";
import NewMenu from "src/public/utils/menuClass/menu_class_new.js";
import BaseData from "src/public/utils/base_data/base-data.js";

export default {
  name: "MatchListHeader",
  mixins: [global_mixin,odds_conversion_mixin],
  components: {
    "sport-icon": sport_icon, comSelect,
  },
  props: {
    // 收藏数量
    collect_count: Number,
    // 列表数据加载状态
    load_data_state: String,
    //是否展示模糊联赛搜索框
    is_show_input:{
        type:Boolean,
        default:false
    },
    is_show_hot:{
      type:Boolean,
      default:false
    },
  },
  data() {
    return {
      NewMenu,
      match_sort_show:false,//切换排序是否显示
      handicap_show:false,//切换盘口是否显示
      date_popup_show:false,//切换日期选择项是否显示,
      play_popup_show:false,//切换玩法选择项是否显示,

      leagueName:"",//模糊搜索联赛条件
      //即将开赛筛选数据
      time_list: null,

    };
  },
  computed: {
    ...mapGetters({
      vx_get_layout_size: "get_layout_size",
      //菜单切换状态
      vx_main_menu_toggle:"get_main_menu_toggle",
      // 获取当前盘口类型
      vx_get_cur_odd: "get_cur_odd",
      // 获取上次选择的盘口类型(盘口切换时使用)
      vx_get_pre_odd: "get_pre_odd",
      // 列表显示内容  match:赛事 collect:收藏 search:搜索
      vx_layout_list_type: "get_layout_list_type",
      // 获取当前页路由信息
      vx_layout_cur_page: "get_layout_cur_page",
      // 是否显示联赛筛选框
      vx_show_filter_popup: "get_show_filter_popup",
      // 获取联赛筛选是否全选
      vx_filter_checked_all: "get_filter_checked_all",
      // 获取当前菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
      // 获取全局点击事件
      get_global_click: "get_global_click",
      // 搜索关键字
      get_search_keyword:"get_search_keyword",
      // 单关是否正在处理中
      vx_get_is_single_handle: 'get_is_single_handle',
      // 串关是否正在处理中
      vx_get_is_handle: "get_is_handle",
      // 获取选中的赛事数量(列表右上角赛选功能)
      vx_get_checked_count: "get_checked_count",
      vx_is_bet_single: "is_bet_single",
      //收起右侧详情 展开多列玩法
      get_unfold_multi_column:"get_unfold_multi_column",
      //全局开关
      get_global_switch:'get_global_switch'
    }),
    sort_option(){
     let option = [
        {
          id: 1,
          name: this.$root.$t('set.match_sort'),//"按联赛排序",
          icon: "icon-sort_league"
        },
        {
          id: 2,
          name: this.$root.$t('set.time_sort'),//"按时间排序",
          icon: "icon-sort_date"
        }
      ]
      if(!this.get_global_switch.sort_cut){
        option = []
      }
      return option
    },
    /**
     * @Description  当前筛选icon
     * @param {string}
    */
    popup_match_sort_reshow(){
      let icon = ''
      this.sort_option.map( item => {
        if (item.id == this.vx_match_sort) {
          icon = item.icon;
        }
      });
      return icon
    },
    // 串关 && 冠军 不能切换赔率
    computed_handicap_select_disable() {

      let is_winner = NewMenu.is_guanjun()

      return this.vx_is_bet_single || is_winner
    },

    //排序筛选类
    sort_class(){
      if(this.computed_show_refresh){
        return 'match-sort-wrap'
      }else{
        return 'match-sort-wrap style2'
      }

    },
    // 是否显示刷新 btn
    computed_show_refresh() {
      let {
        vx_cur_menu_type,
        vx_show_filter_popup,
        vx_layout_cur_page
      } = this;

      let _show = !["hot_all"].includes(vx_cur_menu_type.type_name) &&
        vx_show_filter_popup == false &&
        vx_layout_cur_page.cur != "search"

      return _show
    },
      //是否搜索页
    is_search_page() {
      return this.vx_layout_cur_page.cur == "search";
    },

    // 当前页面菜单title
    page_title() {
         //当前点击的是今日还是早盘 今日 2 早盘为3
      let { jinri_zaopan } = this.NewMenu.left_menu_result
      let TITLE = {
        1: this.$root.$t("menu.match_play"), //"滚球",
        2: this.$root.$t("menu.match_today"), //"今日",
        3: this.$root.$t("menu.match_early"), //"早盘",
        500:this.$root.$t("menu.match_hot"), //"热门赛事"
        400:this.$root.$t("menu.match_winner"), //"冠军"
      };
  
      let _page_title = ""
      let _menu_type = NewMenu.left_menu_result.root
      if(this.is_search_page){
        _page_title = this.$root.$t("common.search_title")
        // 今日|早盘|串关
      }else if([2,3].includes(_menu_type)){
        let sport_name =  NewMenu.get_current_left_menu_name()

        if(sport_name){
          _page_title = `${TITLE[_menu_type]}（${sport_name}）`
        }else{
          _page_title = TITLE[_menu_type]
        }
      }else if([1,500].includes(NewMenu.menu_root)){
        _page_title = TITLE[_menu_type]
      }else if(_menu_type ==400){
        _page_title = TITLE[_menu_type]
      }
      if(jinri_zaopan ==2 && _menu_type ==2000){
        //'今日  (电子竞技)'
       _page_title =`  ${this.$root.$t("menu.match_today") } (${this.$root.$t("common.e_sports")})`
       }else if(jinri_zaopan ==3 && _menu_type ==2000){
       //'早盘  (电子竞技)'
        _page_title =  `  ${this.$root.$t("menu.match_early") } (${this.$root.$t("common.e_sports")})`
       }
      return _page_title;
    },
    //是否显示即将开赛
    show_select_time(){


      return NewMenu.menu_root==2  && this.vx_layout_list_type != 'collect'


    },
    //短标题
    is_short_title(){
      return window.vue.lang=='vi' && (this.vx_main_menu_toggle=='mini-normal' || (this.vx_get_layout_size.inner_width<1455 && this.vx_main_menu_toggle=='normal'))
    },
    // 前端控制是否禁用收藏功能
    enable_collect_api() {
        return window.env.config.ENABLE_COLLECT_API;
    }
  },

  watch: {

  },
  created() {
    //设置即将开赛筛选列表
    let hour = this.$t('common.hour')
    this.time_list = [
      { label:this.$t('common.all'), title:this.$t('common.all'), value: null },
      { label:this.$t('filter.select_time.3h'), title:'3'+hour, value: 3 },
      { label:this.$t('filter.select_time.6h'), title:'6'+hour, value: 6 },
      { label:this.$t('filter.select_time.9h'), title:'9'+hour, value: 9 },
      { label:this.$t('filter.select_time.12h'), title:'12'+hour, value: 12 },
    ],
    // 显示部分dom ID
    this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
    // console.error('reload')
    // 刷新时重置为列表展开
    this.vx_set_cur_expand_layout("match-list");

    this.show_date_switch = ["early"].includes(this.vx_cur_menu_type.type_name);
  },
  methods: {
    ...mapActions({
      // 设置页面宽高信息
      vx_set_layout_list_type: "set_layout_list_type",
      // 设置展开区块
      vx_set_cur_expand_layout: "set_cur_expand_layout",
      // 是否显示联赛筛选框
      vx_set_show_filter_popup: "set_show_filter_popup",
      // 设置当前赔率
      set_cur_odd: "set_cur_odd",
      // 设置上次赔率
      set_pre_odd: "set_pre_odd",
      //收起右侧详情 展开多列玩法
      set_unfold_multi_column:"set_unfold_multi_column",

    }),

    /**
     * 计算 全部 按钮样式
     */
    compute_quanbu_btn_class(){
      let str =''
      if( this. vx_layout_list_type=='match'){
        str+= 'active'
      }

      let can_show=   NewMenu.compute_if_can_show_shoucang()
      //如果不能显示收藏
      if(!can_show){
        str+= '   collect-btn'
      }
        return  str
    },
    /**
     * 即将开赛筛选
     */
    select_time_change() {
      //设置session
      sessionStorage.setItem('is_select_time', '1')

      this.$root.$emit(this.emit_cmd.EMIT_FETCH_MATCH_LIST);
    },
    /**
     * 重置条件
     */
    reset_filter(){
      this.$store.state.filter.open_select_time = null
    },
    /**
     * @ Description:切换联赛排序
     * @param {object} row 切换的排序
     * @return {undefined} undefined
     */
    on_click_sort(row) {
      if(!this.get_global_switch.sort_cut) return this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t("msg.msg_09"))
      this.match_sort_show = false
      this.vx_set_match_sort(row.id);
    },
    /**
     * @Description:切换联赛筛选
     * @return {undefined} undefined
     */
    toggle_filter_popup() {
      if(!this.get_global_switch.filter_switch) return this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t("msg.msg_09"));
      if((this.load_data_state != 'data' && !this.vx_show_filter_popup)){
        return
      }
      //打开或关闭赛事筛选弹层
      this.vx_set_show_filter_popup(!this.vx_show_filter_popup);
      if(this.vx_show_filter_popup) {
        //设置即将开赛筛选默认值
        this.reset_filter()
      }
    },
    /**
     * @Description:显示盘口切换
     * @return {undefined} undefined
     */
    show_handicap(){

      if(this.vx_get_is_single_handle || this.vx_get_is_handle) return; // 单关或者串关投注正在进行中，禁止切换
      this.computed_handicap_select_disable || (this.handicap_show = !this.handicap_show)

    },
    /**
     * @Description:切换盘口
     * @param {object} row 盘口数据
     * @return {undefined} undefined
     */
    on_click_handicap(row) {

      this.set_pre_odd(this.vx_cur_odd)
      this.set_user_preference(row.value);
      this.handicap_show = false
    },

    /**
     * @description 切换列表展示是的收藏还是非收藏
     *
     * @param  {string} type
     * @return {undefined} undefined
     */
    on_change_list_type(type){
    
      
      // console.warn("this.NewMenu",this.NewMenu)

      if(type == this.vx_layout_list_type){
        return
      }
      let { lv2_mi,lv1_mi,jinri_zaopan,root,guanjun } = this.NewMenu.left_menu_result
      let apiType = 1
      const api_params = {
        2000:{
          match:"post_fetch_esports_matchs",
          colloet:"post_collect_list_es"
        },  //
        400:{
          match:"post_champion_list",
          colloet:"post_fetch_collect_list"
        },
        1:{
          match:"post_fetch_match_list",
          colloet:"post_fetch_collect_list"
        },
        500:{
          match:"post_fetch_match_list",
          colloet:"post_fetch_collect_list"
        },
        other:{
          match:"post_league_list",
          colloet:"post_fetch_collect_list"
        }
      }

      let api_name = api_params.other.match

      if([1,500,300,400,2000].includes(Number(root))){
        api_name = api_params[root]. match
      }

      if(type === "collect"){
        // 前端开    后台开       >开
        // 前端开    后台关       >关
        // 前端关    后台开       >关
        // 前端关    后台关       >关
        if(!this.enable_collect_api || !this.get_global_switch.collect_switch) {
            return this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t("msg.msg_09"));
        }
        apiType = 2

        api_name = api_params.other.colloet

        if([1,500,300,2000].includes(Number(root))){
          api_name = api_params[root]. colloet
        }

      }

      // 调用列表接口

      // 当前 pid 和 orpt
      let lv2_mi_info = BaseData.mi_info_map[`mi_${lv2_mi}`];
     

      // 父级euid
      let euid;
      if([2,3].includes(Number(root)) ){
        // 今日 早盘 常规赛事
        if (lv1_mi == 118) {
          // 娱乐下只有冠军 直接写死
          euid = root == 3 ? '3020212': '3020112'
        }else{
          euid = BaseData.mi_info_map[`mi_${lv1_mi}${jinri_zaopan}`].euid
        }
        
        lv2_mi_info = {
          apiType,
          "orpt":"0",
          "pids":"",
          ...lv2_mi_info,
       
          euid,
        }
        if(root == 3 ){
          // 早盘获取选中的时间
          let {match_list:{params:{md,index}}} = this.NewMenu.match_list_api_config
          lv2_mi_info.md = md
          lv2_mi_info.index = index || 0 // 早盘收藏 切换后回到原来的
        }

      }else if(root== 400){
        guanjun = "guanjun"
        // 冠军
        let {mid_menu_result} = this.NewMenu
        lv2_mi_info = {
          ...lv2_mi_info,
          apiType,
          "sportId": (1 * mid_menu_result.mi - 400) || '',
          "outrightMatches":1,
          "orpt":18,
        }
      }else if(root== 2000){
        // 电子竞技
        let dianjing_sublist = BaseData.dianjing_sublist
        let current_menu = dianjing_sublist.find(item=>item.mi == lv2_mi) || {}
        lv2_mi_info = {
          ...lv2_mi_info,
          "category":1,
          "csid": current_menu.csid,
          "collect":1,
          apiType,
          md: (NewMenu.match_list_api_config.match_list || {}).params.md,
        }
      }else if(root == 500){
        let {mid_menu_result} = this.NewMenu
        euid = mid_menu_result.euid
        // 没有就重新获取
        if(!mid_menu_result.euid){

           // 热门默认赛事
          let mi_500_obj = BaseData.mew_menu_list_res.find((x) => x.mi == 500) || {
            sl: [],
          };
          // 热门赛事有值的
          let { mi } = mi_500_obj['sl'].find(item=> item.ct)
          let mi_info = BaseData.mi_info_map[`mi_${mi}`] || {};
          euid = mi_info.euid
        }
       
        // 热门赛事
        lv2_mi_info = {
          ...lv2_mi_info,
          apiType,
          hotMatches: euid == "30199"?'1':'', // 热门赛事 全部/赛事 才是1
          euid,
          "orpt": euid == "30101"?'12':'-1',  // 热门赛事 竞足 12，其他-1
          pids:euid == "30101"?-999:'',
        }
       
      }else if(root == 1){
        // 滚球赛事
        let {mid_menu_result} = this.NewMenu
        lv2_mi_info = {
          ...lv2_mi_info,
          apiType,
          euid:mid_menu_result.euid,
          "orpt":"-1",
          tid:""
        }
      }

      let config = {
        begin_request: true,
        is_collect: type == "collect",
        route: "list",
        root: "",
        sports: "",
        guanjun,  // 常规赛种下 冠军
        match_list :{
          api_name,
          params: {
            "cuid": this.vx_get_uid,
            "sort": this.vx_match_sort,
            "selectionHour":this.$store.state.filter.open_select_time,
            ...lv2_mi_info,
          },
        }
      }

      NewMenu.set_match_list_api_config(config);

      // this.vx_set_layout_list_type(type)

      // this.$root.$emit(this.emit_cmd.EMIT_FETCH_MATCH_LIST);
    }
  },

};
</script>

<style lang="scss" scoped>
.c-match-list-header {
  padding: 0 10px;
  width: 100%;
  height: 36px;
  .filter_full_all {
    font-weight: bold;
  }
  .col-left {
    .list-title {
      margin-right: 20px;
      .title-icon {
        margin-right: 10px;
      }
      .title-text {
        font-size: 14px;
      }
      .path-icon-wrapper {
        display: flex;
        align-items: center;
      }
      .search-path-icon {
        font-size: 18px;
        margin: 0 4px;
        font-weight: bold;
        &:before {
          color: #595f73;
        }
      }
      .league-logo {
        margin-right: 10px;
        width: 18px;
        height: 18px;
      }
    }
    .btn-wrap {
      padding: 0px 12px;
      height: 26px;
      &.match-btn {
        border-radius: 2px 0 0 2px;
      }
      &.collect-btn {
        border-radius: 0 2px 2px 0;
        margin-right: 10px;
      }
      .number {
        margin-left: 6px;
      }
    }
    .w105{width: 105px;}
  }
  .col-right {
    .search-wrap {
      position: relative;
      .search-icon {
        position: absolute;
        right: 6px;
        top: 8px;
      }
      .search-input {
        margin-left: 5px;
        height: 26px;
        width: 140px;
        padding-right: 20px;
        padding-left: 10px;
        outline: none;
        border-radius: 2px;
        font-size: 12px;
      }
    }
    .list-sort{
      .list-sort-item{
        padding:2px 11px;
        border-radius:12px;
      }
    }
    .select-btn {
      margin-left: 5px;
      padding: 2px 8px;
      border-radius:12px;
      cursor: pointer;
      border: 1px solid transparent;
      &.disable {
        cursor: not-allowed !important;
      }
      &.refresh-btn {
        padding: 4px 8px;
      }
      &.leagues-btn {
        .status {
          margin-left: 5px;
        }
        .icon-arrow{
          margin-left: 5px;
          transform: rotate(180deg);
          &::before{
            color: #abbac8;
          }
        }
      }
      &.list-sort {
        padding: 0;
      }
      &.refresh-btn {
        width: 24px;
        height: 24px;
      }
    }
    .unfold-btn{
      margin-left: 4px;
      border-radius: 11px;
      background-color: skyblue;
      padding: 2px 8px 2px 12px;
      color: #fff;
      display: flex;
      align-items: center;
      cursor: pointer;
      .text{
        padding-right: 2px;
      }
      .icon-arrow{

          transform: rotate(-90deg);
          &::before{
           color: #fff;
          }
      }
    }
    .icon-toggle1 {
      margin-left: 15px;
    }
  }
}
</style>

<style lang="scss">
/** 联赛排序 -S*/
.match-sort-wrap {
  margin: 0 !important;
  padding: 5px 0;
  height: 62px;
  border-radius: 2px !important;
  transform: translate(-16px, 4px);
  overflow: visible !important;
  .triangle {
    position: absolute;
    width: 5px;
    height: 5px;
    transform: rotate(45deg);
    left: 29px;
    top: -2px;
  }
  .item-wrap {
    padding: 0 10px;
    display: flex;
    align-items: center;
    height: 26px;
    cursor: pointer;
    .text {
      margin-left: 6px;
    }
  }
  &.style2 {
    transform: translate(-47px, 4px);
    .triangle {
      left: 60px;
    }
  }
}
/** 联赛排序 -E*/
</style>
