/*
 * @Author: Sword
 * @Date: 2021-04-25 09:30:55
 * @Description: websocket数据页面数据接入 ---- 赛事列表
 */
// 发送websocket命令时使用
import { WsSend } from "src/core/data-warehouse/ws/ws-ctr/ws-ctr.js";
import { mapGetters } from "vuex";
import lodash from 'lodash';

import global_mixin from "src/core/global/mixin/global_mixin.js";
import betting from "src/public/mixins/betting/betting.js";
import ws_debounce from "src/public/mixins/websocket/data/ws_debounce.js"
import play_mapping from "src/public/config/mapping/play_mapping";


export default {
  mixins: [global_mixin, betting],
  data() {
    return {
      play_mapping: {},
      // ws 推送使用timeout
      timer_obj: {}
    }
  },
  computed: {
    ...mapGetters({
      // socket状态
      socket_status: 'get_socket_status',
      // 用户id
      vx_get_uid: "get_uid",
      // 用户信息
      vx_get_user: "get_user",
      // 列表显示内容  match:赛事 collect:收藏 search:搜索
      vx_layout_list_type: "get_layout_list_type",
       // 串关是否正在处理
      get_is_handle: "get_is_handle", // 有使用不在文件
      // 单关是否正在处理
      vx_get_is_single_handle: "get_is_single_handle",
      // 获取服务器时间和本地时间差
      vx_get_timestamp: "get_timestamp",
      // 详情接口请求参数
      vx_details_params: "get_match_details_params",
      // var事件 配置列表
      get_var_event_i18n: "get_var_event_i18n"
    }),
  },
  created() {
    //ws调用接口节流工具类
    this.ws_debounce = new ws_debounce(this)
    //赛事列表订阅
    this.$root.$on(this.emit_cmd.EMIT_MATCH_LIST_SUBSCRIBE2,this.sendSocketInitCmd);  
    //去抖
    this.SCMD_C01 = this.debounce(this.SCMD_C01,1000);
    this.play_mapping = play_mapping;
  },
  mounted() {
    // 节流5s get_match_detail_throttle方法
    this.get_match_all_list_throttle = this.throttle(this.get_match_all_list_throttle, (5+parseInt((Math.random()*1000)%6))*1000, {leading: true, trailing: true});
    //发送socket初始化命令  
    this.sendSocketInitCmd();
    // 注册当前页面的socket添加到消息队列
    let socket_name = this.socket_name || 'skt_data_list';
    if(window.ws) {    
      //注册事件  
      window.ws.addQueueViewObj(socket_name, this);
    }
  },
  methods: {
    /**
     * @description: 防抖处理拉取赛事所有列表数据
     */    
    get_match_all_list_throttle(){
      // 调用全量列表接口        
      this.fetch_match_list(true);
    },
    /**
     * @description: 是否继续发送socket命令进行初始化
     * @param {Number} count 发送第几次了
     * @return {undefined} undefined
     */
    continueSendSocketInit(count) {
      clearTimeout(this.timer_obj['continue_send']);
      this.timer_obj['continue_send'] = setTimeout(() => { 
        if(this.skt_mid && _.keys(this.skt_mid).length == 0 && count < 5) {
          count++
          //console.log(`=======================================count:${count}`);
          this.continueSendSocketInit(count);
        }
        // 发送socket初始化命令         
        this.sendSocketInitCmd();
      }, 500);
    },
    /**
     * @description: 发送启动命令
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    sendSocketInitCmd() {
      clearTimeout(this.timer_obj['send_socket_init']);
      this.timer_obj['send_socket_init'] = setTimeout(() => {
        // 发送赛状态订阅息命令C1
        //this.SCMD_C1();
        this.SCMD_C8();
      }, 0);
    },
    /**
     * @description: 发送关闭命令
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    sendSocketCloseCmd() {
      // 发送赛状态订阅息命令C1
      WsSend.sktCancelSend(window.ws, "C8");
      // 重新订阅赛事详情
      this.$root.$emit(this.emit_cmd.EMIT_MATCH_DETAIL_SUBSCRIBE);
    },
    RCMD_C01(obj) {
      
    },
    /**
     * C101 数据
     * `mid` 赛事Id
     * `ms` 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
     * @description: 赛事状态
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C101(obj) {
      //数据不存在或者数据存在不是当前赛事 
      if(!obj) {
        return;
      }
      // 合并数据
      this.match_list_data.ws_merge_match(obj,['ms'])
      // 赛事状态  0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断 110 即将开赛
      if([1, 110].includes(+obj.cd.ms)) {
        // 订阅C01指令
        this.SCMD_C01();        
      }
    },
    /**     
     *  C102 推送数据
     * `mid` 赛事Id
     * `mst` 比赛进行时间/比赛剩余时间
     * `cmec` 事件编码
     * `cmes` 事件状态 0:未取消 1:被取消
     * `mat` 发球方,主队发球 home，客队发球：away
     * `mmp` 
     * `mess` 开始结束状态 1:start 0:stop此字段只适用于特定事件编码）篮球暂停事件编码=time_start  现阶段只关注0、 1 其它值不必关注
     * `mct` 当前节/盘/局
     * `mbhn` 好球数（棒球专用）
     * `mbkn` 坏球数（棒球专用）
     * `mbcn` 出局数（棒球专用）
     * `mbolp` 一垒  0:未占用  1:已占用（棒球专用）
     * `mbtlp` 二垒 0:未占用  1:已占用（棒球专用）
     * `mbthlp` 三垒 0:未占用  1:已占用（棒球专用）
     * `mststs` 是否补时 0未开,1开
     * `mststi` 补时固定时间：比如补5分钟
     * @description: 赛事事件
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C102(obj) {
      let cur_match = this.match_list_data.mid_obj['mid_'+_.get(obj,'cd.mid')]
       //当前赛事数据不存在
      if (!cur_match) {
        return;
      }
      let skt_data = obj.cd;
      // var 事件 skt_data.cmec !== 'goal 避免接口返回 goal 事件
      const var_item = lodash.find(this.get_var_event_i18n, (t) => t.nameCode === skt_data.cmec)
      var_item && skt_data.cmec !== 'goal' && this.$root.$emit(this.emit_cmd.EMIT_VAR_EVENT, { skt_data, var_item });
      // 合并数据
      this.match_list_data.ws_merge_match(obj,Object.keys(skt_data))
        
      if (skt_data.mmp != "999") {
        // 当前的赛事阶段
        let cur_match_mmp = cur_match.mmp;
        
        // 篮球更新当前局盘口
        if(cur_match.csid == 2){
          // 设置当前局盘口数据
          this.set_match_cur_handicap_data(cur_match,true)
          // 重新计算赛事样式
          this.match_list_card.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs([cur_match.mid])
        }
        // 更新比分
        this.match_list_data.ws_update_score(obj)
        // 如果是模拟发送C102且补时开关是打开的且为足球赛事则同步时间 
        if(cur_match.csid == 1 && skt_data.mststs == 1) {
          this.$root.$emit(this.emit_cmd.EMIT_INIT_FILL_TIME_CMD, skt_data.mid);
        } 
        // 非足球,而且赛事阶段切换的时候拉取接口(并且不是内部发送的命令,内部发送会有send字段值为my_self)    
        let check_result = this.get_phase_result(cur_match.csid, skt_data.mmp); // 获取该阶段是否进行接口查询
        // 足球加时赛开始需要调用一次接口
        if(((cur_match.csid == 1 &&  skt_data.mmp == 32) ||
            (cur_match.csid != 1 && check_result)) && 
           skt_data.mmp != cur_match_mmp && 
           !skt_data.send) {
          // 订阅C01
          this.SCMD_C01();
        }
      }  
    },
    /**     
     *  C103 推送数据
     * `mid` 赛事Id
     * `csid` 球种Id
     * `msc` 比分
     * @description: 赛事比分
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C103(obj) {
      // 合并比分
      this.match_list_data.ws_update_score(obj)
      return;
      // 足球、篮球、棒球、乒乓球、排球
      if([1,2,3,8,9].includes(obj.cd.csid*1)) {
        // 同步比分
        this.yabo_common.update_bet_score(this, obj.cd.mid, this.socket_name);
      }
    },
    /**
     *  C104 推送数据
     * `mid` 赛事Id
     * `csid` 球种Id
     * `mhs` 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
     * `ms` 赛事状态  0:未开赛  1:滚球
     * @description: 赛事级盘口状态推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C104(obj) {
      // mid:赛事Id mhs: 盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
      let cur_match = this.match_list_data.mid_obj['mid_'+_.get(obj,'cd.mid')]
       //当前赛事数据不存在
      if (!cur_match) {
        return;
      }
      let skt_data = obj.cd;     
      // 赛事状态 0:active 开, 1:suspended 封, 2:deactivated 关
      if([0,1,11].includes(+skt_data.mhs)){ //开 封 锁
        //修改赛事级别状态变化
        this.match_list_data.set_match_mhs_status(skt_data.mid,skt_data.mhs);       
 
      } else if(skt_data.mhs == 2){  //关盘
        //移除赛事
        this.socket_remove_match(skt_data);
        return
      }
      if($menu.menu_data.is_esports) {
        // 同步投注项信息
        this.virtual_common.update_bet_item_status(this,{
          mid: skt_data.mid,
          hid: skt_data.hid,
          status: skt_data.mhs
        });
      } else {
        // 同步投注项信息
        this.yabo_common.update_bet_item_status(this,{
          mid: skt_data.mid,
          hid: skt_data.hid,
          status: skt_data.mhs
        });
      }
    },
    /**
     *  C105 推送数据
     * `hls` 盘口集合
     * `mid` 赛事Id
     * `hid` 盘口Id
     * `hpid` 玩法Id
     * `hs` 盘口状态 0:开盘 1:封盘 2:关盘 11:锁盘
     * `hn` 坑位 1:表示主盘，2:表示第一副盘，以此类推
     * `hps` 基准分S1|0:0  不存在基准分则不传输该字段
     * `hmt` 盘口类型 1:赛前盘 0:滚球盘
     * @description: 盘口赔率
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C105(obj) {
			let cur_match = this.match_list_data.mid_obj['mid_'+_.get(obj,'cd.mid')]
       //当前赛事数据不存在
      if (!cur_match) {
        return;
      }
      // 如果是ws推送的时间戳比接口更新时间小说明不是最新的推送数据不进行更新处理
      if(obj.ctsp < cur_match.api_update_time){
        return ;
      }
      cur_match.ws_update_time = obj.ctsp
      // 合并赛事级别盘口状态
      if(obj.cd.hasOwnProperty('mhs')) {
        // 修改赛事级别状态变化
        this.match_list_data.set_match_mhs_status(obj.cd.mid,obj.cd.mhs);
      }
  
      let hls = obj.cd.hls || []
			if(hls.length == 0) {
        return
      }  
      
      // 判断是否有坑位变化
      let hn_change = false;
      // 遍历所有盘口
      for(let j = 0; j < hls.length; j++) {
        // 获取玩法数据信息
        const hl_obj = hls[j];
        // 变量玩法投注项
        for (let i = 0; i < hl_obj.ol.length; i++) {
          // 坑位不为空时
          if(hl_obj.hn) {
            // 获取投注项对象
            const ol = _.get(hl_obj,`ol[${i}]`);
            if(ol){
              // 获取ol_obj中相同oid的坑位
              const ol_tmp_hn =  _.get(this.match_list_data.ol_obj,'[oid_'+ol.oid+']._hn');
              // 组装最新的坑位数据
              const _hn = hl_obj.hn?`${hl_obj.mid}_${hl_obj.chpid || hl_obj.hpid}_${hl_obj.hn}_${ol.ot}`:'';
              if(ol_tmp_hn && _hn && ol_tmp_hn != _hn){
                // 坑位不相等时表示,主副盘口发生变化
                hn_change = true;
                break;
              }
            }
          }
        }
        if(hn_change){
          break;
        }
      }
      if(hn_change){
        // 使用bymids获取最新数据
        this.ws_debounce.add_mid(cur_match);
        return;
      }
   
      // 遍历所有盘口
      hls.forEach( hl_obj => {
        if(hl_obj.hasOwnProperty('hs')){
          // 设置盘口状态 -- 盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
          this.match_list_data.set_match_hs_status(hl_obj.hid,hl_obj.hs); 
        }
        if(hl_obj.hasOwnProperty('hmt')){
          // 盘口类型合并0:滚球盘 1:赛前盘
          this.match_list_data.set_match_hmt(hl_obj.hid, hl_obj.hmt);
        }
    
        // orpt==18 为冠军赛事模板, hs=2关盘
        if(cur_match.tpl_id == 18 && hl_obj.hs == 2) {
          this.get_match_all_list_throttle();
          return
        }
  
        // 合并投注项
        _.each(hl_obj.ol, ol => {
          //坑位组合
          let _hn = hl_obj.hn?`${hl_obj.mid}_${hl_obj.chpid || hl_obj.hpid}_${hl_obj.hn}_${ol.ot}`:'';
          let _hid = hl_obj.hid;
          let _hpid = hl_obj.hpid;
          let _hs = hl_obj.hs;
          let _mid  = hl_obj.mid;
          // 设置其他的盘口信息数据
          Object.assign(ol,{_hn,_hid,_hpid,_hs,_mid})
          //合并投注项数据 
          this.match_list_data.merge_ol_data(ol);
          if(hl_obj.hn && _hn){
            // 当有坑位时设置合并坑位信息
            if(this.match_list_data.hn_obj[_hn]){
              Object.assign(this.match_list_data.hn_obj[_hn],ol);
            }
          }
        })
     
        // 如果是冠军玩法 且所以盘口都是的投注项都是关盘的  获取盘口下所有投注项 是否关盘 
        if(cur_match.tpl_id == 18 && this.match_list_data.get_handicap_ol_is_all_close(hl_obj.hid)) {
          this.get_match_all_list_throttle();
        }
        
      })
    },
    /**
     *  C107 推送数据
     * `mvs` 动画状态 -1 没有配置动画源 ，
     *    0 ： 已配置，但是不可用     
     *    1： 已配置，可用，播放中   
     *    2：已配置，可用，播放中
     * `mms` 动画状态 -1 没有配置动画源 ，
     *    0 ： 已配置，但是不可用   
     *    1： 已配置，可用，播放中   
     *    2：已配置，可用，播放中
     *   lvs 直播状态  -1 无 2有
     *   lss 当前状态 0 赛前  1滚球
     * @description: 赛事视频/动画状态推送 
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C107(obj) {
      // 合并数据
      this.match_list_data.ws_merge_match(obj,['mvs','mms','lvs','lss'])
    },
    /**
     *  109 推送数据
     * `mid` 赛事Id
     * `hs` 盘口状态
     * `csid` 球种Id
     * `ms` 赛事状态 赛事状态 0:未开赛 1:滚球 110:即将开赛
     * @description: 赛事级开盘推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
     RCMD_C109(obj) {
       //数据不存在
      if (!obj) {
        return;
      }  
      let type_name = this.vx_cur_menu_type.type_name || "";
      // 赛事从关盘到开盘发送C109
      let skt_data = obj.cd;
      let len = skt_data.length;
      for(let i = 0; i < len; i++) {
        let item = skt_data[i];
        let ms = this.$utils.get_match_status(item.ms);
        let is_winner = $menu.menu_data.match_tpl_number == 18
        if($menu.menu_data.is_esports) {
          this.SCMD_C01();
          break;
        } else {
          // 单签选中菜单的menuType
          let cur_menu_id = $menu.menu_data.cur_level2_menu;
          let cur_menu_type = _.get(window.$menu,`menu_obj.menu_id_${cur_menu_id}.menuType`,-1);
          // 推送过来球种对应的menuType
          let sport_to_menu_type = _.get(this.play_mapping,`SPORT_TO_MENU_TYPE.${item.csid}`,'');
          let flag = false;
          // 政治娱乐，冠军菜单 现场滚球 热门赛事
          if(['30','100'].includes(cur_menu_type) || 
             ['play', 'hot_one', 'hot'].includes(type_name)) {
            // 标记为true后面进行处理 
            flag = true;
          }
          if((['today','bet'].includes(type_name) || is_winner) && 
             (item.ms==0 || ms==1) && (cur_menu_type==sport_to_menu_type)) {  // 今日 串关
              // 订阅C01
            this.SCMD_C01();     
            break;          
          } else if(type_name=='early' && item.ms == 0 && (cur_menu_type == sport_to_menu_type)) { // 早盘 未开赛进行匹配
            // 订阅C01
            this.SCMD_C01();    
            break;            
          } else if(flag) {
            // 订阅C01
            this.SCMD_C01();  
            break;     
          }
        }
      }
    },
    /**
     * @description: 赛事玩法数量推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C110(obj) {
      // 合并数据
      this.match_list_data.ws_merge_match(obj,['mc'])
    },
    /**
     * tab部分变化推送
     * @param {*} obj 
     */
    RCMD_C114(obj) {
      let cur_match = this.match_list_data.mid_obj['mid_'+_.get(obj,'cd.mid')]
      //当前赛事数据不存在
      if (!cur_match) {
        return;
      }
      let skt_data = obj.cd;
      let params;
      // 当前选中的菜单id与角球菜单是否为角球菜单id
      if($menu.is_corner_menu() || $menu.match_list_api_params.orpt == 25 || _.has(skt_data, 'displayPenaltyCard') || _.has(skt_data, 'displayBoldNess')) {
        // 拉去全量接口
        this.get_match_all_list_throttle();
      } else {

        params = {
          mid: skt_data.mid,
          csid: cur_match.csid
        };
        // 拉去接口(byMids)
        this.ws_debounce.add_mid(params,null,true)
      }
    },
    /**
     * 只作用于冠军盘口 -> 冠军盘口开始/结束时间 修改实时推送
     */
    RCMD_C120(obj) {
      let cur_match = this.match_list_data.mid_obj['mid_'+_.get(obj,'cd.mid')]
      //当前赛事数据不存在
      if (!cur_match) {
        return;
      }
      // 冠军赛事 合并盘口结束时间
      if(cur_match.tpl_id == 18) {
        //ws推送合并冠军玩法结束时间 
        this.match_list_data.ws_set_champion_end_tine(obj.cd)
      }
    },
    /**
     * 提前结算赛事状态
     * @param {*} obj 
     * @returns 
     */
    RCMD_C211(obj) {
      // 合并数据 ws推送合并单个赛事 指定数据 
      this.match_list_data.ws_merge_match(obj,['mearlys'])
    },
    /**     
     *  C302 推送数据
     * `mid` 赛事Id
     * `ms` 赛事状态：0未开赛 1开赛
     * `csid` 球种id
     * @description: 赛事开赛状态
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C302(obj) {
      //数据不存在
      if (!obj) {
        return;
      }
      let skt_data = obj.cd;
      //console.log('-----------------赛事开赛通知状态C302------------obj:' + JSON.stringify(obj));
      // 0、未开赛 1、开赛
      if (skt_data.ms == 1) {
        this.SCMD_C01();
      }
    },
    /**
     *  C303 推送数据
     * `mid` 赛事Id
     * `hid` 盘口id
     * `hpid` 玩法id
     * `hs` 盘口状态
     * @description: 赛事盘口新增(玩法)
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C303(obj) {
      let cur_match = this.match_list_data.mid_obj['mid_'+_.get(obj,'cd.mid')]
      //当前赛事数据不存在
      if (!cur_match) {
        return;
      }
      // console.log('-----------------新增玩法/盘口通知C303------------obj:' + JSON.stringify(obj));
      //处理完后调用需要调用http拉取的接口为:/v1/w/getMatchOddsInfos
      let skt_data = obj.cd;
      let sport_id = cur_match.csid;
      // 网球且玩法为171时不处理 只是列表不处理
      if(sport_id == 5 && skt_data.hpid == 171) {
        return;
      }
      let type_name = this.vx_cur_menu_type.type_name || '';
      // 单签选中菜单的menuType
      let cur_menu_id =  _.get(window.$menu,'menu_data.cur_level2_menu');
      let cur_menu_type = _.get(window.$menu,`menu_obj.menu_id_${cur_menu_id}.menuType`,-1);
      // 推送过来球种对应的menuType
      let sport_to_menu_type = _.get(this.play_mapping,`SPORT_TO_MENU_TYPE.${skt_data.csid}`,'');
      let flag = false;
      if([0,30,100].includes(+cur_menu_type) || 
         (cur_menu_type==sport_to_menu_type)) { // 政治娱乐，冠军菜单
        flag = true;
      }
      if(flag || ['today','hot_one','hot'].includes(type_name) || $menu.menu_data.is_esports) {
        this.ws_debounce.add_mid(skt_data)
      }      
    },
    /**
     *  C801 推送数据
     * `mct` 当前节/盘/局
     * `mess` 1:start 0:stop
     * `mhs` 赛事级别盘口状态 0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态
     * `mid` 赛事Id
     * `mmp` 赛事阶段
     * `ms` 赛事状态
     * `mst` 比赛进行时间/比赛剩余时间
     * `msc` 比分数据
     * @description: 倒计时补充-C801
     * @param {Object} obj
     */
    RCMD_C801(obj) {
      //数据不存在
      if(!obj) {
        return;
      }
      let skt_data = obj.cd;
      // 记录ws推送的时间
      this.yabo_common.match_fill_time(this, skt_data, this.socket_name);
    },
    /**
     * @description: 联赛指令(C9)-关盘补充(C901) 针对为展开过的联赛赛事进行关盘的时候进行处理
     * @param {Object} obj
     */
    RCMD_C901(obj) {
      //数据不存在
      if (!obj) {
        return;
      }
      let skt_data = obj.cd;      
      // 非现场滚球盘菜单下赛事关盘，但是联赛没有展开过。
      if(skt_data.mhs == 2) {
        this.socket_remove_match(skt_data);
      }
    },
    /**
     * @description: 列表接口订阅
     * @param {*} key
     * @return {*}
     */
    SCMD_C01() {     
      this.get_match_all_list_throttle();
    },

    /**
     * C8 参数说明
     * `cufm` 赛事列表、详细在同一页面标识，传入"m"。赛事列表、详细不同页面不需要此字段
     * `marketLevel` 0:默认行情等级，1:信用网等级
     * `list` 要订阅的赛事玩法对象
     * `mid` 赛事Id
     * `hid` 盘口Id，多个玩法Id用逗号分隔。订阅所有玩法用"*"
     * `说明:` 订阅后会推送C101,C102,C103,C105,C107,C110,C113,C114,C115,C303,C304,C305,C801
     * @description: 赛事订阅(C1)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C8(key='match_list') {  
      clearTimeout(this.timer_obj['scmd_c8']);
      this.timer_obj['scmd_c8'] = setTimeout(()=>{
        let obj = {}; 
        // 所属的订阅模块     
        obj.module = key;
        // 订阅的赛事列表对象
        obj.list = this.get_c8_list();
        // 是否为用户发送      
        obj.one_send = false; 
        obj.cufm = "L";
        // 信用等级
        obj.marketLevel = _.get(this.vx_get_user, 'marketLevel', '0');
        obj.key = `h_${key}`;
        //处理逻辑
        if(obj.list.length>0) {
          WsSend.sktSendMatchStatus(window.ws, obj);
        } 
      },1000) 
    },
    /**
     * @description: C8的List部分获取
     * @param {*}
     * @return {*}
     */
    get_c8_list() {
      let list = [];
      _.forEach(this.skt_mid, item => { 
        // hpid *为全部玩法订阅      
        let mid = "", hpid="*";
        mid = item.mid;
        if(_.isArray(item.hpids) && item.hpids.length > 0 && !item.hpids.includes("*")) {
          hpid = item.hpids.join(',')
        }
        let obj = { mid, hpid, level: 3 }; // level：2 值针对C303
        list.push(obj);
      });    
      return list;
    },
    /**
     * C9联赛指令
     * 参数说明
     * `tid` 联赛Id，多个联赛Id用逗号分隔
     * @param {*} all_leagues 
     */
    SCMD_C9(all_leagues) {
      let obj = {};
      let league_ids = [];
      if(_.isArray(all_leagues)) {
        // 收集联赛id
        _.forEach(all_leagues, league_obj=>{
          league_ids.push(league_obj.tid);
        });
        // console.log(`==========league_ids:${JSON.stringify(league_ids)}`);
        obj.tid = league_ids.join(',');
        WsSend.sktLeagueListSend(window.ws, obj);
      }      
    },
  },
  watch: {
    /**
     * @description: 监控socket状态
     * @param {String} status 状态
     * @return {undefined} undefined
     */
    socket_status(status) {    
      // 监听sockect连接状态
      if (status) { //当sockect重新连接时自动发送消息
        if(status == 2){
          this.backend_run = true;
          // 拉取全量接口
          this.fetch_match_list(true);
          clearTimeout(this.timer_obj['send_c01']);
          this.timer_obj['send_c01'] = setTimeout(() => {
            this.SCMD_C01(); 
          },1000);
        }
        //发送C8订阅
        this.SCMD_C8();
      }
    },
    /**
     * @description: 数据加载状态
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    load_data_state: {
      handler(new_) {
        if(new_ == "data" && this.skt_mid && _.keys(this.skt_mid).length == 0) {
          let count = 0 
          //是否继续发送socket命令进行初始化
          this.continueSendSocketInit(count);
        }
      },
      immediate: true
    },
    skt_mid(new_){
      // console.log(`=============skt_mid:=============`);
      if(new_) {
        //发送启动命令
        this.sendSocketInitCmd();
      }
    } 
  },
  destroyed() {
    // 清空所有定时器
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    // 清空定时器对象
    this.timer_obj = {};
    // 映射对象列表清空
    this.play_mapping = {};
    // 取消防抖
    this.debounce_throttle_cancel(this.get_match_all_list_throttle);
    this.debounce_throttle_cancel(this.SCMD_C01);
    // 取消订阅
    this.sendSocketCloseCmd();
    // 清除定时器
    clearTimeout(this.ws_debounce.interval_id)
    this.$root.$off(this.emit_cmd.EMIT_MATCH_LIST_SUBSCRIBE2,this.sendSocketInitCmd);
    if(window.ws) {
      let socket_name = this.socket_name || 'skt_data_list';
      //清除消费对象
      window.ws.removeQueueViewObj(socket_name);
    }
    // 清除定时器
    clearTimeout(this.timer_ws_send_01);
  }
}