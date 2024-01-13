/**
 * H5 ,PC 通用的   常规赛事的  详情 控制 类
 * 不关系数据 只关心 玩法 顾虑 显示表征 
 * 数据在数据仓库读取
 *
 */
 
import { ref ,reactive} from "vue"
import { SessionStorage } from "src/output/module/constant-utils.js";
import { debounce } from "lodash";
class MatchDetailCtr {
 
  constructor( ) {
    this.init();
  }
  /**
   * @description: 数据初始化
   * @param {undefined} undefinedwatch(() => MatchDetailCalss.details_data_version.version, (val, old) =>
   * @return {undefined} undefined
   */
  init() {
    //赛事ID
    this.mid=  '';
    //玩法集 数组  原始玩法集数组 
    this.category_arr=[]
    //玩法集 对象
    this.category_obj={}
    //当前玩法集ID 
    this.current_category_id =  SessionStorage.get('DETAIL_TAB_ID') || '0';
    //当前显示 玩法 数组 
    this.current_category_plays=[]
    // ===========H5页面需要存储的数据===============
    // 精彩回放接口返回数据
    this.playback_video_list = []
    // 详情头部动画相关
    this.video_url = {},
    this.show_video = false,
    this.iframe_onload = false,
    this.goto_detail_matchid = '',

    // ==================结束=======================
    // hpid 玩法ID 
    // topKey ： 玩法ID 拼接变量 x   "topKey":"357-3", "hpn":"先进3球的一方",
    //           带变量玩法的 同一个玩法ID  hpon 是一样的   357-1 会在 357-2 前面
    // hpon 玩法级别 赔率数据内 玩法排序参照对象
    // hton :  "1693133623814"  有值代表置顶了 ，根据时间戳大小排序 
    // {
		// 	"marketName":"所有投注",
		// 	"orderNo":2147483647,
		// 	"plays":[1,2,3,4,68,5,6,7,8,9,10,11,12,13,77,14,78,15,79,336,80,81,82,340,344,91,347,28,92,351,32,33,34,101,102,362,107,367,114],
		// 	"id":"0"
		// }
    //所有玩法 默认 排序对象  ，手动置顶的  记录置顶次序
    //所有投注 的 玩法级别 排序参照对象  这里不关心赔率等数据
    this.all_plays_sort_obj={}
    //所有投注 的 玩法级别 最终的排序 
    this.all_plays_sort_arr=[]
    //玩法 集 TAB 点击自动滚动居中 算法  需要在这里实现 或者其他地方实现
    //可以使用quasar 的scroll util 实现

    this.params= {
      mid: "", //赛事id
      tid: "", // 联赛 id
      sportId: "", //球类id
      media_type: "auto", // 直播类型
      time: Date.now()
    }
    this.isTop= true;//视频置顶
    this.top_id = [];//置顶的玩法id
    this.play_media= {  //播放视频信息类型
      mid: 0,
      media_type: "",
      is_auto: true,
      time: Date.now()
    };
    // 点返回按钮 返到列表
    this.is_back_btn_click = false;
    // 电竞视频是否暂停
    this.is_pause_video = true;
    this.zoom = true;
    /** 玩法列表单双列 0单列， 1双列 */
    this.layout_statu = 0;
    this.is_fullscreen = false; //是否全屏
    // 赛事详情数量
    this.match_detail_count = 0;
    this.history_random=1;
    // 当前选中玩法对应的盘口玩法
    this.tabs_active_plays = [];
    this.detail_show_type =''//详情页 显示类型 play:滚球   today：今日  early：早盘
    // 是否显示全屏投注
    this.is_show_full_bet =false
    this.active_detail = {}; //详情比分面板，接口报错时的备用数据
    this.details_data_cache = {} // 玩法集对应玩法缓存数据
    this.details_data_version = reactive({
      version:'111'
    });

    /* =========H5 */
    // H5是否显示详情页的统计页面
    this.is_show_details_analyse =false;
    // H5赛事id
    this.get_goto_detail_matchid = null;
    //正在跳转详情的赛事
    this.current_gotodetail_match={};
    // 玩法tab 所有投注 - 进球 - 上半场 - 球队 - 让球&大小
    this.details_item = 0;
    // 一键收起状态: 1.全展开 2.全收起 3.部分展开 1和3箭头向上
    this.fewer = 1;
     // 详情玩法集第一个
    this.first_details_item = '0';
    //赛果详情我的注单
    this.note_sheet_records_data ={}
    /* =========H5 */
  }

  // =============H5获取/设置数据==============
  /**
   * 获取精彩回放数据
   */
  get_playback_video_list() {
    return this.playback_video_list
  }
  /**
   * 设置精彩回放数据
   */
  set_playback_video_list(params) {
    this.playback_video_list = params
  }
  /**
   * 详情头部动画数据
   * @params 对象Object
   */
  set_video_url(params) {
    this.video_url = params
  }
  /**
   * 详情头部动画是否开启video
   * @param 布尔值 Boolean
   */
  set_show_video(params) {
    this.show_video = params
  }
  /**
   * 详情头部动画是否开启iframe
   * @param 布尔值 Boolean
   */
  set_iframe_onload(params) {
    this.iframe_onload = params
  }
  // =================结束====================
/**
 * 玩法集和tab 点击 
 * @param {*} obj  玩法集对象 
 */
  category_tab_click(obj={}){
    // 玩法tab的ID
    this.current_category_id= obj.id
    // 玩法tab的玩法集
    this.current_category_plays = obj.plays
    this.set_details_data_version() 
  }
    /**
   * 计算 玩法集 数组  参照对象
   *  @param {} category_list  category/getCategoryList  返回的实际的   数据
   */
    compute_category_refer(category_list=[]){
      if(lodash.isEmpty(category_list)) return
     this.category_arr=category_list.sort((a,b)=>a.orderNo-b.orderNo)
     let obj={}
     category_list.map(x=>{
      obj[`id_${x.id}`]=x
     })
     this.category_obj=obj
     if(obj[this.current_category_id])
      this.category_tab_click(obj[this.current_category_id])
    }
  /**
   * 计算 所有投注 的 玩法级别 排序参照对象
   *  @param {} all_plays  matchDetail/getMatchOddsInfo 返回的实际的  plays 下面的数据
   */
  compute_all_plays_sort_refer(all_plays=[]){
    let obj={}
    let arr=[]
    all_plays.map(x=>{
      let  tmp ={...x }
      delete tmp.hl
      delete tmp.title
      obj[`topKey_${tmp.topKey}`] =tmp 
      arr.push(tmp)
    })
    arr= this._sort_all_plays(arr)
    this.all_plays_sort_arr = arr
    this.all_plays_sort_obj = obj
  }
/**
 * 内部 排序 所有玩法 
 * @param {*} arr 
 */
  _sort_all_plays(arr=[]){
    let has_hton= []
    let no_hton=[]
    arr.map(x=>{
      if(x.hton){
        has_hton.push(x)
      }else{
        no_hton.push(x)
      }
    })
   //置顶排序 
    has_hton.sort((a,b)=> 1*(a.hton) - 1*(b.hton)  )
    //非置顶排序
    no_hton.sort((a,b)=>{
      if(a.hpid == b.hpid){
        // "topKey":"357-3"
       return a.topKey-b.topKey 
      }else{
        //hpon
        return a.hpon- b.hpon
      }
    })
    return [ ...has_hton,...no_hton ]
  }
 /**
  * 点击置顶 
  * @param {*} obj  点击的玩法的 对象 
  * @returns 
  */
  click_to_top(obj={}){
    let  ts = Date.now()
    let {topKey} = obj
    if(!topKey){ return false}
   let cobj= this.all_plays_sort_obj[`topKey_${ topKey}`]
   if(!cobj){ return false}
   cobj.hton =''+ts
   let arr = Object.values(this.all_plays_sort_obj)
   arr= this._sort_all_plays(arr)
   this.all_plays_sort_arr = arr
  }
  /**
   * @description: 获取当前玩法
   * @param {String}} hpid 玩法编号  示例  hpid: "2,38,39,216,57"
   * @return {Array} 玩法对象集合
   */
  getPlayInfo(hpid) {
    let play = [];
    if (hpid) {
      let arr_hpid = hpid.split(",");
      for (let i = 0; i < this.list.length; i++) {
        for (const item of arr_hpid) {
          if (this.list[i].hpid == item) {
            // play = this.list[i];
            play.push(this.list[i]);
            // break;
          }
        }
      }
    }
    return play;
  }

   // 设置详情版本变更
  set_details_data_version =debounce(() => {
    this.details_data_version.version = Date.now()
  }, 10);

  /**
   * @description: 设置mid参数
   * @param {*} val
   * @return {*}
   */
  set_match_details_params({mid = '',tid = '',sportId = '',media_type = ''}){
    // const {mid = '',tid = '',sportId = '',media_type = ''} = val
    this.params = {
      mid,
      tid, // 联赛 id
      sportId, //球类id
      media_type, // 直播类型
      time: Date.now()
    }
    this.mid = mid
    this.get_goto_detail_matchid = mid
    // this.play_media.media_type = media_type
    this.set_details_data_version()
  }


  /**
   * @description: 播放视频信息类型
   * @param {*} play_media_val  
   * @return {*}
   */
  set_play_media(play_media_val){
    this.play_media =play_media_val
    this.set_details_data_version()
  }
  /**
   * @description: 设置详情比分面板，接口报错时的备用数据
   * @param {*} val  match——info  赛事详情
   * @return {*}
   */
  set_active_detail(val){
    this.active_detail = val
  }
  /**
   * @description: 设置电竞视频是否暂停
   * @param {boolean} flag  
   * @return {*}
   */
  set_is_pause_video(flag){
    this.is_pause_video = flag
    this.set_details_data_version()
  }
  /**
   * @description: 设置是否是从详情返回
   * @param {boolean} flag  
   * @return {*}
   */
  set_is_back_btn_click(flag){
    this.is_back_btn_click = flag
    this.set_details_data_version()
  }
  /**
   * @description: 设置多列玩法 玩法列表单双列 0单列， 1双列
   * @param {*} val
   * @return {*}
   */
  set_layout_statu(val){
    this.layout_statu = val
    this.set_details_data_version()  
  }
  /**
   * @description: 设置当前玩法集id 
   * @param {*} val
   * @return {*}
  */
  set_current_category_id(val){
    this.current_category_id = val
    this.set_details_data_version()  
  }
  /**
   * @description:  设置玩法集对应玩法缓存数据  
   * @param {*} val
   * @return {*}
  */
  set_details_data_cache(val){
    if (!val || !Object.keys(val).length) {
      this.details_data_cache = {}
      return
    }
    this.details_data_cache = Object.assign({}, this.details_data_cache, val)
    this.set_details_data_version()  
  }
  /**
   * @description:  设置玩法集id对应的盘口玩法
   * @param {*} val
   * @return {*}
  */
  set_category_arr(val){
    this.category_arr = val
    this.set_details_data_version()  
  }
   /**
   * @description:  清除所有的 多列玩法  玩法缓存数据   玩法集id对应的盘口玩法
   * @param {*} val
   * @return {*}
  */
  set_clear_all_play_data(){
    this.layout_statu = 0
    this.current_category_id = ""
    this.details_data_cache={}
    this.category_arr = []
    this.set_details_data_version()  
  }
  /**
   * @description:置顶玩法的 id
   * @param {*} val
   * @return {*}
  */
  set_top_id(val){
    this.topId = val
    this.set_details_data_version()  
  }

  /**
   * @description:正在跳转详情的赛事 
   * @param {*} match
   * @return {*}
  */
  set_current_gotodetail_match(match){
    this.current_gotodetail_match = match
    this.set_details_data_version()  
  }
  /**
   * @description:正在跳转详情的赛事  
   * @param {*} id 玩法tab 
   * @return {*}
  */
  set_details_item(id){
    this.details_item = id
    this.set_details_data_version()  
  }
  /**
   * @description:H5赛事id
   * @param {*} id 玩法tab 
   * @return {*}
  */
  set_goto_detail_matchid(id){
    this.get_goto_detail_matchid = id
    this.mid = id
    this.set_details_data_version()  
  }
  /**
   * @description:H5详情是否显示统计
   * @param {Boolean} flag 
   * @return {*}
  */
  set_is_show_details_analyse(flag){
    this.is_show_details_analyse = flag
    this.set_details_data_version()  
  }
  /**
   * @description:H5详情一键收起状态: 
   * @param {Number} 1.全展开 2.全收起 3.部分展开 1和3箭头向上 
   * @return {*}
  */
  set_fewer(val){
    this.fewer = val
    this.set_details_data_version()  
  }
  /**
   * @description:H5详情 详情玩法集第一个
   * @param {{*}} 
   * @return {*}
  */
  set_first_details_item(val){
    this.first_details_item = val
    this.set_details_data_version()  
  }
  /**
   * @description:详情WS推送指令  只需要关注ms mmp字段的变化
   * @param {{*}} 
   * @return {boolean}
   *  * `ms` 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
   * `mmp` 赛事阶段  
   * 赛事结束标志 mmp=999 || ms = "比赛结束"  mhs=2 关盘 移除赛事 
   * `mhs` 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘 ,11:锁盘状态）
   * c303  拉取所有数据 
  */
  handler_details_ws_cmd(cmd){
    return ["C101","C102","C104","C109","C302","C303"].includes(cmd)
  }
  /**
   * @description:   ms: 0开 1封 2关 11锁  hs: 0开 1封 2关 11锁   os 1开 2封 3隐藏不显示不占地方  
   *  ms  0 和 11正常显示   hs0显示  ol 为 1 
   * @return {*}   
  */
  get_show_ol_handcip(ol){
    return o.os == 1 && o._hs != 11
  }
  /**
   * @description: 获取详情入参
   * @return {*}
   */
  get_parmas(){
    return this.params
  }
  /**
   * @description: 设置赛果注单
   * @return {*}
   */
  set_my_sheet(val){
      this.note_sheet_records_data =val
  }
  /**
   * @description: 设置赛果注单
   * @return {*}
   */
  get_my_sheet(){
    return this.note_sheet_records_data 
  }
}




export default  new  MatchDetailCtr()