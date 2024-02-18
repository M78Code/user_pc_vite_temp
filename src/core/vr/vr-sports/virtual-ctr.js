
/**
 * @description 虚拟体育全局操控类(数据持久化操作改造而来)
 */
import { reactive,toRef} from 'vue'
class VirtualCtr {
  constructor() {
    // 初始化数据
    this.init();
  }
  /**
   * @description: 数据初始化
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  init(){
    let init_data = { 
      // 虚拟体育赛事接口请求中, 用于防治重复请求
      virtual_data_loading: 0,
      //当前选中的联赛
      current_league:{},
      //当前选中的批次
      current_batch:{},
      //视频进程接口已获取标志
      video_process_loaded:{},
      //当前赛事id
      current_match_mid:'',
      //视频进程数据
      video_process_data:null,
      //正在跳转详情的赛事
      current_gotodetail_match:{},
      //上次请求的虚拟赛事列表参数
      prev_v_sports_params:{},
      //上次请求的虚拟体育赛事列表
      prev_v_sports:{},
      // 是否是用户（顶部按钮）刷新
      is_user_refreshing: false,
      // 当前选中的二级菜单id
      current_sub_menuid: "",
      // 虚拟体育赛事接口请求中, 用于防治重复请求
      virtual_data_loading: 0,
      //虚拟体育子菜单
      virtual_menu_list: [],
      // 当前虚拟体育选中的二级菜单id
      virtual_current_sub_menuid: "",
      // 当前选中的二级菜单menu_type
      curr_sub_menu_type: 0,
      // 详情页的数据
      detail_data: "",
      // 视频进程数据
      process_changing_match: '',
      // 是否显示详情页的统计页面
      is_show_details_analyse: false,
      // 赛事id
      goto_detail_matchid: null,
      //抽屉设置菜单是否显示
      is_show_menu: false,   
      // 玩法tab 所有投注 - 进球 - 上半场 - 球队 - 让球&大小
      details_item: 0,
      // 页脚子菜单id
      footer_sub_menu_id :1,
    };
    // 数据持久化
    let str = sessionStorage.getItem('VirtualCtr');
    if(str){
      try {
        let json_data = JSON.parse(str);
        // 数据合并
        json_data && Object.assign(init_data,json_data);
      } catch (error) {
        console.error(error);
      }
    }
    // 所有赛事列表数据转obj对象
    let data = init_data;
    // 设置代理
    this.state = new Proxy(data, {
      set: function (target, key, value, receiver) {
        // 数据持久化
        let res = Reflect.set(target, key, value, receiver);
        sessionStorage.setItem('VirtualCtr',JSON.stringify(target));
        return res;
      }
    })
  }

  // //get方法
  // get_prev_v_sports(){
  //   return this.state.prev_v_sports;
  // }
  // get_prev_v_sports_params(){
  //   return this.state.prev_v_sports_params;
  // }
  // get_current_league() {
  //   return this.state.current_league;
  // }
  // get_current_batch(){
  //   return this.state.current_batch
  // }
  // get_video_process_loaded(){
  //   return this.state.video_process_loaded
  // }
  // get_current_mid(){
  //   return this.state.current_match_mid
  // }
  // get_video_process_data(){
  //   return this.state.video_process_data;
  // }
  // get_current_gotodetail_match(){
  //   return this.state.current_gotodetail_match;
  // }
  // get_is_user_refreshing() {
  //   return this.state.is_user_refreshing
  // }
  // get_virtual_menu_list() {
  //   return this.state.virtual_menu_list;
  // }
  // get_virtual_data_loading() {
  //   return this.state.virtual_data_loading;
  // }
  // get_virtual_current_sub_menuid() {
  //   return this.state.virtual_current_sub_menuid;
  // }
  // get_current_sub_menuid() {
  //   return this.state.current_sub_menuid;
  // }
  // get_curr_sub_menu_type() {
  //   return this.state.curr_sub_menu_type;
  // }
  // get_detail_data() {
  //   return this.state.detail_data;
  // }
  // get_is_show_details_analyse(){
  //   return this.state.is_show_details_analyse;
  // }
  // get_goto_detail_matchid() {
  //   return this.state.goto_detail_matchid;
  // }
  // get_is_show_menu() {
  //   return this.state.is_show_menu;
  // }
  // get_details_item() {
  //   return this.state.details_item;
  // }
  // get_footer_sub_menu_id(){
  //   return this.state.footer_sub_menu_id;
  // }
  

  // // get发放2
  // prev_v_sports(){
  //   return this.state.prev_v_sports;
  // }
  // prev_v_sports_params(){
  //   return this.state.prev_v_sports_params;
  // }
  // current_league() {
  //   return this.state.current_league;
  // }
  // current_batch(){
  //   return this.state.current_batch
  // }
  // video_process_loaded(){
  //   return this.state.video_process_loaded
  // }
  // current_mid(){
  //   return this.state.current_match_mid
  // }
  // video_process_data(){
  //   return this.state.video_process_data;
  // }
  // current_gotodetail_match(){
  //   return this.state.current_gotodetail_match;
  // }
  // is_user_refreshing() {
  //   return this.state.is_user_refreshing
  // }
  // virtual_menu_list() {
  //   return this.state.virtual_menu_list;
  // }
  // virtual_data_loading() {
  //   return this.state.virtual_data_loading;
  // }
  // virtual_current_sub_menuid() {
  //   return this.state.virtual_current_sub_menuid;
  // }
  // current_sub_menuid() {
  //   return this.state.current_sub_menuid;
  // }
  // is_show_menu() {
  //   return this.state.is_show_menu;
  // }

  // // set方法
  // set_prev_v_sports(value){
  //   this.state.prev_v_sports = value;
  // }
  // set_prev_v_sports_params(value){
  //   this.state.prev_v_sports_params = value;
  // }
  // // set_c_selected_match_i(value){
  // //   state.c_selected_match_i = value;
  // // },
  // set_current_league(league) {
  //   this.state.current_league = league;
  // }
  // set_current_batch(batch){
  //   this.state.current_batch = batch
  // }
  // set_video_process_loaded(value){
  //   this.state.video_process_loaded = value
  // }
  // set_current_mid(value){
  //   this.state.current_match_mid = value
  // }
  // set_video_process_data(value){
  //   this.state.video_process_data = value;
  // }
  // set_current_gotodetail_match(value){
  //   this.state.current_gotodetail_match = value;
  // }
  // set_current_match_assign(callback){
  //   if(callback){
  //     callback(this.state.current_gotodetail_match);
  //   }
  // }
  // set_is_user_refreshing(value) {
  //   this.state.is_user_refreshing = value
  // }
  // set_virtual_data_loading(value){
  //   this.state.virtual_data_loading = value;
  // }
  // set_virtual_data_loading(v) {
  //   this.state.virtual_data_loading = v;
  // }
  // set_virtual_menu_list(v) {
  //   this.state.virtual_menu_list = v;
  // }
  // set_virtual_current_sub_menuid(v) {
  //   this.state.virtual_current_sub_menuid = v;
  // }
  // set_current_sub_menuid(v) {
  //   this.state.current_sub_menuid = v;
  // }
  // set_curr_sub_menu_type(v) {
  //   this.state.curr_sub_menu_type = Number(v);
  // }
  // set_detail_data(payload) {
  //   this.state.detail_data = payload;
  // }
  // set_is_show_details_analyse(value){
  //   this.state.is_show_details_analyse = value;
  // }
  // set_goto_detail_matchid(value) {
  //   this.state.goto_detail_matchid = value;
  // }
  // set_is_show_menu(v) {
  //   this.state.is_show_menu = v;
  // }
  // set_details_item(payload) {
  //   this.state.details_item = payload;
  // }
  // set_footer_sub_menu_id(value){
  //   this.state.footer_sub_menu_id = value;
  // }
}
const VR_CTR = reactive(new VirtualCtr());
export default VR_CTR