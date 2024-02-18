/**
 * 投注相关的   视图强相关的 一些逻辑
 * 这个类是多个 实例 ，每一个投注对象 就是一个实例
 *
 */
import { ref,nextTick } from "vue";
import lodash_ from "lodash"
import BetData from "./bet-data-class.js"
import { SessionStorage } from "src/core/utils/common/module/web-storage.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;

const { PROJECT_NAME } = BUILDIN_CONFIG ;

class BetViewData {
  constructor() { 
    this.init()
    
  }
  init() {
    // 金额的范围  -1:输入金额小于最低限额时，1: 输入金额超出最大限额时 2:输入金额超出用户余额时 3:用户余额是小于等于输入金额(转换后)
    this.input_money_state = 0;
    // 错误码
    this.error_code = "";
    // 金额是否为空
    this.is_empty_money = true;
    // 投注成功记录 内真正是投注成功 的  部分
    this.bet_order_success_success = [];
    // 投注成功记录
    this.bet_order_success_all = [];
    //0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
    this.order_confirm_complete = 0;
    //错误信息
    this.error_message = "";
    this.tip_message = "";
    this.cur_keyboard_index = "";
    // 最大值获取标志 0: 默认值 1: 正在获取最大最小值 2:获取完成
    this.input_max_flag = 0;
    this.is_submit_result = "";
    // 检测数据是否右边,主要在提交时使用
    this.bet_data_change = false;
    // 投注失败标识
    this.bet_fail_flag = false;
    //计时器
    this.timer_ = "";
    //  1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
    this.bet_order_status = 1;
    this.timestap = "";
    //投注项有效无效的标识
    this.is_effect = true;

    // 是否投注完成 投注确认中的时候，轮询和ws还在跑；等轮询和ws回来 会清空投注项内容
    // 是否上一个投注流程已走完
    this.is_finally = false;

    //tips 数据 */
    this.bet_tips_info = {
      //目标id
      id: "",
      // 赛事名称  世界杯2022亚洲外围赛
      match_name: "",
      // 对战信息 中国 v 关岛
      battle_info: "",
      // 玩法游戏 滚球 让球
      play_game: "",
      // 赛事类型
      match_type: "",
      // 联赛名称
      league_name: "",
      // 投注截止时间
      bet_end_time: "",
    };

    // 串关  专用参数
    this.bet_special_series = [];
    // 普通单关 专用参数
    this.bet_special_single = {};
    // 合并单关 专用参数
    this.bet_special_combine = {};
    // h5 专用参数
    this.bet_special_h5 = {
      //
    };
    //pc 专用参数
    this.bet_special_pc = {
      bet_count: 0,
      bet_total: 0,
      bet_win: 0,
    };
    // 是否显示全屏下投注弹窗
    this.bet_show = ref(false)

    // 限额
    this.bet_min_max_money = {}
  
    // 投注后的 
    this.orderNo_bet_obj = []
    // 投注后串关信息 
    this.orderNo_bet_single_obj = []
    // 是否已失效
    this.bet_expired = false

    this.bet_view_version = ref('11')

    this.error_code_list = [200,500,'200','500','0000000','0402001','0402002','0402003','0402005','0402006','0402007','0402008','0402011','0402012','0402016',
    '0402022','0402024','0402025','0402026','0402043','0402044','0402045','0402046','0402047','04020448','0400500',
    '04020449','0400451','0400452','0400461','DJ006','0402009','0402010','0402023','0402027','0402028','0402014',
    '0402015','0402017','0402020','0402021','0402039','0402040','0402041','0400456','0400457','0400458','0400462','0400463','XXXXXX','DJ999','0402018',
    '0402019','0402038','0400450','132113','0402035','0400454','0400455','0402042','0400453','0400459','0400460','0400464','0400475','0400468','0400469','M400004',
    'M400005','M400007','M400009','M400010','DJ002','M400011','M400012','0401038','DJ001','DJ003','DJ004','DJ005']
    // 按钮锁
    this.lock_mask = false 

    // 获取缓存信息
    nextTick(()=>{
      this.set_loacl_config()
    })
  }

  // 设置失效状态
  set_bet_expired(state) {
    this.bet_expired = state
  }

  // 根据缓存信息 设置数据
  set_loacl_config(){
    // 获取数据缓存
    let session_info = SessionStorage.get('bet_view_class');
    if (!session_info) {
      return;
    }
    if (Object.keys(session_info).length) {
      for(let item in session_info){
        if(!['bet_view_version'].includes(item) ){
          this[item] = session_info[item]
        }
      }
    }
    this.set_bet_view_version()
  }
  /**
   * 计算确定按钮显示
   */
  compute_show_xxx() {
    let arr = [
      "0400459",
      "0400475",
      "0400486",
      "0400517",
      "0400519",
      "0400540",
    ];
    return arr.includes(this.error_code);
  }

  // 设置当前 投注页面显示 版本
  set_bet_view_version = lodash_.debounce(() => {
    this.bet_view_version.value = Date.now()
    // console.error('set_bet_view_version',this)
    nextTick(()=>{
      SessionStorage.set('bet_view_class',this)
    })
  }, 5)

  // 设置 金额的范围  -1:输入金额小于最低限额时，1: 输入金额超出最大限额时 2:输入金额超出用户余额时 3:用户余额是小于等于输入金额(转换后)
  set_input_money_state(val) {
    this.input_money_state = val
    this.set_bet_view_version()
  }

  // 设置限额
  // obj 接口返回数据
  // type 接口类型 min_max 或者最大值 最小值接口 数据结构不同
  set_bet_min_max_money(obj, type = '') {
    // 获取query_bet_amount数据对应的限额
    let bet_amount_list = lodash_.get(obj, 'betAmountInfo',[])
    // min_max 或者最大值 最小值接口 数据结构不同
    if (type == 'min_max') {
      bet_amount_list = obj
    }
    let bet_amount = {}
    // 串关 投注限额
    if( BetData.is_bet_single){
      bet_amount_list.forEach(item => {
        // 单关 使用 投注项作为 key值 在投注列表做对应关系
        bet_amount[item.playOptionsId] = {
          min_money: item.minBet, // 最小限额
          max_money: item.orderMaxPay, // 最大限额
          globalId: item.globalId,  //  风控响应id
        }
      })
      this.bet_min_max_money = bet_amount
      
    }else{
      let special_series = this.bet_special_series.map((item,index)=>{

        let showQuick = false
        if(PROJECT_NAME.includes('pc') && index == 0) showQuick  = true

        //  串关使用 type 复连串 30001
        let obj = bet_amount_list.find(page => page.type == item.id) || {}
        if(obj.type){
          return {
            ...item,
            min_money: obj.minBet, // 最小限额
            max_money: obj.orderMaxPay, // 最大限额
            globalId: obj.globalId,  //  风控响应id
            seriesOdds: obj.seriesOdds, // 赔率  // 串关使用 3串1
            bet_amount: '', // 投注金额
            show_quick: showQuick, // 快捷金额
          }
        } else {
          return {
            ...item
          }
        }
      })
      this.bet_special_series = special_series
    }

    // console.error("最大最小值",this.bet_min_max_money)
    this.set_bet_view_version()
  }

  // 设置默认值
  set_bet_min_max_money_default(oid) {
    let bet_amount = {}
    bet_amount[oid] = {
      min_money: 10, // 最小限额
      max_money: 8888, // 最大限额
      globalId: '',  //  风控响应id
      seriesOdds: '', // 赔率  // 串关使用 3串1
    }
    this.bet_min_max_money = bet_amount

    // console.error("最大最小值",this.bet_min_max_money)
    this.set_bet_view_version()
  }


  // 显示投注框
  set_bet_show(val) {
    this.bet_show = val
  }

  // 设置投注状态
  // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
  set_bet_order_status(code) {
    this.bet_order_status = code
    // 更新页面
    this.set_bet_view_version()
  }
  // 设置提示信息 
  // code code码
  // msg 提示信息
  set_bet_before_message({ code, message }) {
    this.error_message = message
    this.error_code = code
    //console.error('ssssss',code,message)
    this.set_bet_view_version()
  }
  /**
   * @description: 完成按钮是否显示
   * @param {undefined} undefined
   * @return {Boolean}
   */
  set_bet_complete_show() {
    //bet_order_status:3-投注成功状态 order_confirm_complete:2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败  4.所有注单已经确认完成 部分成功部分失败
    return this.bet_order_status === 3 || [2, 3, 4].includes(this.order_confirm_complete);
  }
  /**
   * @description: 是否在投注中
   * @param {undefined} undefined
   * @return {Boolean}
   */
  set_bet_loadding() {
    //bet_order_status:2-投注中状态 order_confirm_complete:1.注单确认中
    return this.bet_order_status == 2 || this.order_confirm_complete == 1;
  }

  // 设置 code对应的 message数据 
  set_code_message_config(code, message) {
    let text = ''
    switch (code) {
      case 200:
        text = "bet_message.loading"
        break

      case '0402001':
      case '0402002':
      case '0402003':
      case '0402005':
      case '0402006':
      case '0402007':
      case '0402008':
        //盘口已失效
        text = "bet_message.m_0402001"
        break
      case '0402011':
      case '0402012':
      case '0402016':
      case '0402022':
      case '0402024':
      case '0402025':
      case '0402026':
      case '0402043':
      case '0402044':
      case '0402045':
      case '0402046':
      case '0402047':
      case '04020448':
      case '04020449':
      case '0400451':
      case '0400452':
      case '0400461':
      case 'DJ006':
        text = "bet_message.m_0402001"
        break
       
      case '0402009':
      case '0402010':
      case '0402023':
      case '0402027':
      case '0402028':
        // 投注项盘口、赔率或有效性产生变化!
        text = "bet_message.m_0402009"
        break
      case '0402014':
        // 网络异常，请在注单中查看投注结果
        text = "bet_message.m_0402014"
        break

      case '0402015':
      case '0402017':
      case '0402020':
      case '0402021':
      case '0402039':
      case '0402040':
      case '0402041':
      case '0400456':
      case '0400457':
      case '0400458':
      case '0400462':
      case '0400463':
      case '0400500':
      case 'XXXXXX':
      case 'DJ999':
        // 投注未成功~再试一次吧
        text = "bet_message.m_0402015"
        break

      case '0402018':
      case '0402019':
      case '0402038':
      case '0400450':
        // 投注未成功，请稍后再试
        text = "bet_message.m_0402018"
        break

      case '132113':
        // 投注失败，请重新选择投注项
        text = "bet_message.m_132113"
        break
        
      case '0402035':
      case '0400454':
      case '0400455':
        // 余额不足，请您先充值
        text = "bet_message.m_0402035"
        break

      case '0402042':
        // 网络异常，请联系客服
        text = "bet_message.m_0402042"
        break

      case '0400453':
        //  "m_0400453": "账户异常，请联系客服",
        text = "bet_message.m_0400453"
        break

      case '0400459':
        //  "m_0400459": "盘口确认中，请稍等",
        text = "bet_message.m_0400459"
        break

      case '0400460':
        //  "m_0400460": "拒绝投注",
        text = "bet_message.m_0400460"
        break

      case '0400464':
      case '0400475':
        // "m_0400464": "额度已变更，再试一次吧~",
        text = "bet_message.m_0400464"
        break

      case '0400468':
        //  "m_0400468": "比分已变更，再试一次吧",
        text = "bet_message.m_0400468"
        break

      case '0400469':
        // "m_0400469": "投注项盘口、赔率或有效性产生变化!",
        text = "bet_message.m_0400469"
        break

      case 'M400004':
        text = "bet_message.m_M400004"
        break

      case 'M400005':
        text = "bet_message.m_M400005"
        break

      case 'M400007':
        text = "bet_message.m_M400007"
        break

      case 'M400009':
        text = "bet_message.m_M400009"
        break

      case 'M400010':
      case 'DJ002':
        text = "bet_message.m_M400010"
        break

      case 'M400011':
        text = "bet_message.m_M400011"
        break

      case 'M400012':
        text = "bet_message.m_M400012"
        break
        
      case '0401038':
        text = "bet_message.m_0401038"
        break

      case 'DJ001':
        text = "bet_message.m_DJ001"
        break

      case 'DJ003':
        text = "bet_message.m_DJ003"
        break

      case 'DJ004':
        text = "bet_message.m_DJ004"
        break

      case 'DJ005':
        text = "bet_message.m_DJ005"
        break

      default:
        text = message
        break
    }

    return text
  }

  // 串关专用参数
  set_bet_special_series(array) {
    array.filter(item=>{
      item.min_money = item.min_money || 5
      item.max_money = item.max_money || 8888
    })
    this.bet_special_series = array
    this.set_bet_view_version()
  }

  // 清空串关类型的投注金额
  set_clear_bet_special() {
    this.bet_special_series.filter(item=>{
      item.bet_amount = ''
    })

    this.set_bet_view_version()
  }

  // 设置限额对应的金额
  set_bet_special_series_item(item) {
    let special_series = this.bet_special_series.map(obj=>{
      let series_obj = lodash_.cloneDeep(obj)
      if(obj.id == item.id){
        series_obj = {
          ...obj,
          ...item
        }
      }
      return series_obj
    })
    this.bet_special_series = special_series
    this.set_bet_view_version()
  }

  // 设置默认限额
  set_bet_special_series_defalut() {
    this.bet_special_series.filter(obj=>{
        obj.min_money = 5
        obj.max_money = 8888
        obj.bet_amount = 0
    })
 
    this.set_bet_view_version()
  }
  // 投注后的数据
  set_orderNo_bet_obj(array) {
    this.orderNo_bet_obj = array
    this.set_bet_view_version()
  }

  orderNo_bet_obj_config(obj) {
    // console.error('orderNo_bet_obj_config',obj)
    this.orderNo_bet_obj = this.orderNo_bet_obj.map(item => {
      if(item.orderNo == obj.orderNo){
        item.orderStatusCode = obj.status
      }
      return item
    })
    this.set_bet_view_version()
  }

  set_orderNo_bet_single_obj_item(obj) {
    // console.error('orderNo_bet_single_obj',obj)
    this.orderNo_bet_single_obj = this.orderNo_bet_single_obj.map(item => {
      if(item.orderNo == obj.orderNo){
        item.orderStatusCode = obj.status
      }
      return item
    })
    this.set_bet_view_version()
  }

  // 投注后的 串关信息数据
  set_orderNo_bet_single_obj(array) {
    this.orderNo_bet_single_obj = array
    this.set_bet_view_version()
  }

  // 设置是否走完投注流程
  set_is_finally(val) {
    this.is_finally = val
    this.set_bet_view_version()
  }

  // 清空数据
  set_clear_bet_view_config(){
    this.orderNo_bet_obj = []
    this.bet_order_status = 1
    this.order_confirm_complete = 0
    this.is_finally = true
    this.set_bet_view_version()
  }

  //投注的提示信息
  set_tip_message(array){
    // console.error('array', array)
    this.tip_message = array.message
    this.set_bet_view_version()
    setTimeout(()=>{
      this.tip_message = ''
      this.set_bet_view_version()
    },5000)
  }

  //投注后的按钮锁状态
  set_lock_mask(_BOOL){
    if(this.lock_mask != _BOOL){
      this.lock_mask = _BOOL
    }
    this.set_bet_view_version()
  }

  set_bet_play_options_amount(){
    this.bet_special_series.filter(item=> item.bet_amount = '')
  }
}
export default new BetViewData();