
/**
 * @description 虚拟体育全局操控类(数据持久化操作改造而来)
 */
// import { reactive,toRef} from 'vue'
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
    // 所有赛事列表数据转obj对象
    this.state = { 
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
      // 虚拟体育赛事接口请求中, 用于防治重复请求
      virtual_data_loading: 0,
    };
  }

  //get方法
  get_prev_v_sports(){
    return this.state.prev_v_sports;
  }
  get_prev_v_sports_params(){
    return this.state.prev_v_sports_params;
  }
  get_current_league() {
    return this.state.current_league;
  }
  get_current_batch(){
    return this.state.current_batch
  }
  get_video_process_loaded(){
    return this.state.video_process_loaded
  }
  get_current_mid(){
    return this.state.current_match_mid
  }
  get_video_process_data(){
    return this.state.video_process_data;
  }
  get_current_gotodetail_match(){
    return this.state.current_gotodetail_match;
  }
  get_is_user_refreshing() {
    return this.state.is_user_refreshing
  }
  get_virtual_data_loading() {
    return this.state.virtual_data_loading;
  }
  get_virtual_data_loading(state) {
    return state.virtual_data_loading;
  }

  // get发放2
  prev_v_sports(){
    return this.state.prev_v_sports;
  }
  prev_v_sports_params(){
    return this.state.prev_v_sports_params;
  }
  current_league() {
    return this.state.current_league;
  }
  current_batch(){
    return this.state.current_batch
  }
  video_process_loaded(){
    return this.state.video_process_loaded
  }
  current_mid(){
    return this.state.current_match_mid
  }
  video_process_data(){
    return this.state.video_process_data;
  }
  current_gotodetail_match(){
    return this.state.current_gotodetail_match;
  }
  is_user_refreshing() {
    return this.state.is_user_refreshing
  }
  virtual_data_loading() {
    return this.state.virtual_data_loading;
  }

  // set方法
  set_prev_v_sports(value){
    this.state.prev_v_sports = value;
  }
  set_prev_v_sports_params(value){
    this.state.prev_v_sports_params = value;
  }
  // set_c_selected_match_i(value){
  //   state.c_selected_match_i = value;
  // },
  set_current_league(league) {
    this.state.current_league = league;
  }
  set_current_batch(batch){
    this.state.current_batch = batch
  }
  set_video_process_loaded(value){
    this.state.video_process_loaded = value
  }
  set_current_mid(value){
    this.state.current_match_mid = value
  }
  set_video_process_data(value){
    this.state.video_process_data = value;
  }
  set_current_gotodetail_match(value){
    this.state.current_gotodetail_match = value;
  }
  set_current_match_assign(callback){
    if(callback){
      callback(this.state.current_gotodetail_match);
    }
  }
  set_is_user_refreshing(value) {
    this.state.is_user_refreshing = value
  }
  set_virtual_data_loading(value){
    this.state.virtual_data_loading = value;
  }
}
const VR_CTR = new VirtualCtr();
export default VR_CTR