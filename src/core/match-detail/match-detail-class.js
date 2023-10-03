/**
 * H5 ,PC 通用的   常规赛事的  详情 控制 类
 * 不关系数据 只关心 玩法 顾虑 显示表征 
 * 数据在数据仓库读取
 *
 */
 
import { ref ,reactive} from "vue"
import { SessionStorage } from "src/core/utils/index.js"
export default class MatchDetailCtr {
 
  constructor( ) {

    // 初始化数据
    this.init();
  }
  /**
   * @description: 数据初始化
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  init() {
    this.is_pause_video = true; // 电竞视频是否暂停
    this.is_unfold_multi_column = false; //是否展开多列玩法
    //赛事ID
    this.mid=  '';
    //玩法集 数组  原始玩法集数组 
    this.category_arr=[]
    //玩法集 对象
    this.category_obj={}
    //当前玩法集ID 
    this.current_category_id = SessionStorage.get('DETAIL_TAB_ID') ? SessionStorage.get('DETAIL_TAB_ID') : '0';
    //当前显示 玩法 数组 
    this.current_category_plays=[]
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
    this.topId = [];//置顶的玩法id
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
    this.layout_statu = 0;//玩法列表单双列 0单列， 1双列
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
    })
  }
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
     this.category_arr=category_list.sort((a,b)=>a.orderNo-b.orderNo)
     let obj={}
     category_list.map(x=>{
      obj[`id_${x.id}`]=x
     })
     this.category_obj=obj
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
  set_details_data_version(){
    this.details_data_version.version = Date.now()
    // console.error(this.details_data_version.version,'this.details_data_version.value');
  }

  /**
   * @description: 设置mid参数
   * @param {*} val
   * @return {*}
   */
  set_match_details_params(val){
    const {mid,tid,sportId,media_type} = val
    this.params = {
      mid,
      tid, // 联赛 id
      sportId, //球类id
      media_type, // 直播类型
      time: Date.now()
    }
    this.mid = mid
    this.play_media.media_type = media_type
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
   * @description: 设置是否展开多列玩法
   * @param {boolean} val 
   * @return {*}
   */
  set_unfold_multi_column(val){
    this.is_unfold_multi_column = val
  }
}