/*
 * @Author: Amor
 * @Date: 2020-08-04 17:14:23
 * @Description: 赛列表列
 */
import { mapGetters,mapActions } from "vuex";

const bet_item = {
  props: {

    // 当前玩法信息
    play_data: Object,

    // 投注项来源 match_list:主列表、match_details：详情、hot：热门推荐、recent：近期关注
    bet_source: {
      type: String,
      default: "match_list"
    },

    // 投注项对象
    bet_info: {
      type: Object,
      default: () => {
        return {
          mid_obj: {},
          hl_obj: {},
          ol_obj: {}
        };
      }
    },

    //投注项队名
    team_name: {
      type: String,
      default: ""
    },

    /** 仅主列表拥有***********************/
    // 投注项 index
    ol_index: Number,
    // 投注项 id
    oid: String,
    // 是否显示盘口
    bet_tpl: {
      type: String,
      default: ""
    },
    //盘口
    handicap_value: {
      type: String,
      default: ""
    },
    // 盘口是否高亮
    handicap_highlight:{
      type:Boolean,
      default:true
    },

    /** 仅非主列表拥有***********************/
    // 投注项所在赛事的信息
    match_info: Object,
    bet_ids: Object,

    // 选中的投注项路径
    bet_path: {
      type: Object,
      default: () => {
        return {
          hps_index: 0,
          hl_index: 0,
          ol_index: 0
        };
      }
    },
    // 投注项
    bet_data: [Object, String],

    /** 虚拟体育***********************/
    // tpl2 行 index
    row_index:{
      type:Number,
      default:-1
    }

  },

  data() {
    return {
      // 赔率值
      match_odds: "",
      // 盘口状态 active:选中 lock:锁盘 seal:封盘 close:关盘
      odds_state: "",
      // 赔率升降 up:上升 down:下降
      odds_lift: "",
      // 是否红升绿降中
      odds_lift_show: false,
      // 马来和印尼盘负数显示红色
      is_odds_value_red: false,
      version_name: '',
      // 赛事信息
      match:{},
      // 玩法比分
      score:'',
      timer_obj:{}, //定时器
      // 用于显示的盘口信息对象
      ol_data_item:{
        ov:'',
        onb:'',
        onbl:'',
        _hs:0,
        _mhs:0,
        os:1
      }
    };
  },

  computed: {

    ...mapGetters({
      // 获取当前菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
    }),

    // 投注项信息 ++
    ol_data() {

      let { bet_source } = this
      // 详情
      let ol_data = this.bet_data

      // 主列表
      if (bet_source === "match_list") {
        // tpl99
        if (this.ol_index !== -1) {
          ol_data = _.get(this.play_data, `hl.ol.${this.ol_index}`)
          // 非 tpl99
        } else {
          ol_data = this.bet_info.ol_obj;
        }
        // 热门推荐 || 近期关注
      } else if (bet_source === "hot" || bet_source === "recent") {
        let { bet_ids: { oid } } = this
        ol_data = _.get(this.bet_info, `ol_obj.${oid}`)
      }
      return ol_data

    },
    /**
     * @Description 取消悬浮气泡
     * @param {boolean}
    */
    tooltip_cancel(){
      // 如果是 锁盘状态  或者是虚拟体育  不显示悬浮气泡
      return ['seal','disable'].includes(this.odds_state) || this.vx_cur_menu_type.type_name == 'virtual_sport'
    },

    // 是否需要选中
    computed_bet_select() {
      // 热门推荐模块是否有投注项选中
      if (this.bet_source == 'hot') {
        let id = _.get(this.bet_data, "_hn") || _.get(this.bet_data, "oid");
        let selected;
        if(this.vx_get_is_virtual_bet) {
          selected = this.virtual_bet_item_select(id)
        } else {
          selected = this.bet_item_select(id)
        }
        return selected;
      }
      return false;
    }
  },
  filters: {
    //赔率展示格式化
    format_odds_value(val) {
      if(val=='' || val == undefined){
        return '';
      }
      val = (val || '0').toString();
      let ret = val;
      if (val.includes('.')){
        if (val >= 100) {
          if (val.split('.')[1] == '00') {
            ret = val.split('.')[0];
              } else {
            let len = val.length;
            if(val.indexOf('.0') == (len-2)){
              ret = val.substring(0,len-2);
                } else {
              ret = val;
                }
              }
            } else if (val >= 10) {
          if (val.split('.')[1][1] == '0') {
            ret = val.slice(0,val.length-1);
              } else {
            ret = val;
              }
            }
          }
      return ret;
    }
  },
  watch: {
    /**
     * 监听状态变化
     */
    ol_data: {
      handler(cur) {
        if (cur) {
          let { _mhs, _hs, os } = cur;
          this.odds_state = this.get_odds_state(_mhs, _hs, os);
        }
        this.assign_ol_data_item()
      },
      deep: true
    },

    // 监听赔率切换
    vx_get_cur_odd: {
      handler(cur) {
        // 投注项赔率值处理
        let ov = _.get(this.ol_data_item, "ov");
        let obv = _.get(this.ol_data_item, "obv");
        this.format_odds(ov, obv);

        // 马来和印尼盘负数显示红色
        this.is_odds_value_red =
          this.match_odds < 0 && ["MY", "ID"].includes(cur);
      },
      immediate: true
    },
    // 监听赛事ID变化 取消赔率升降
    'match_info.mid'(){
      this.$nextTick(()=>{
        this.odds_lift = ''
      })
    },
    // 监听投注项赔率变化
    'ol_data_item.ov': {
      handler(cur, old) {
        // 赔率值处理
        this.format_odds(cur, 1);
        if (this.ol_data_item) {
          let { _mhs, _hs, os } = this.ol_data_item;
          this.odds_state = this.get_odds_state(_mhs, _hs, os);
        }

        // 红升绿降变化
        this.set_odds_lift(cur, old);
      }
    },
    // 计算是否需要选中,用来控制热门推荐轮播是否需要继续
    computed_bet_select: {
      handler(new_) {
       // 热门推荐模块是否有投注项选中选中则停止轮播,没有选中则继续轮播
        if (this.bet_source == 'hot') {
          // 热门推荐轮播控制
          if (new_) {
            this.$root.$emit(this.emit_cmd.EMIT_HOT_STOP_PLAY);
          } else {
            this.$root.$emit(this.emit_cmd.EMIT_HOT_START_PLAY);
          }
        }
      },
      immediate: true
    },

    // 监控串关切换时设置投注项的选中
    vx_get_bet_list: {
      handler() {

        if (this.ol_data_item) {
          let { _mhs, _hs, os } = this.ol_data_item;
          this.odds_state = this.get_odds_state(_mhs, _hs, os);
        }
      },
      immediate: true
    },

    // 监控单关列表的投注项选中
    vx_is_bet_single() {
      if (this.ol_data_item) {
        let { _mhs, _hs, os } = this.ol_data_item;
        this.odds_state = this.get_odds_state(_mhs, _hs, os);
      }
    },

    // 监控单关列表的投注项选中
    vx_get_bet_single_list: {
      handler() {
        if (this.ol_data_item) {
          let { _mhs, _hs, os } = this.ol_data_item;
          this.odds_state = this.get_odds_state(_mhs, _hs, os);
        }
      },
      immediate: true
    },

    // 监控串关切换时设置投注项的选中
    vx_get_virtual_bet_list: {
      handler() {
        if (this.ol_data_item) {
          let { _mhs, _hs, os } = this.ol_data_item;
          this.odds_state = this.get_odds_state(_mhs, _hs, os);
        }
      },
      immediate: true
    },
    vx_get_bet_category(new_) {
      if([2,3].includes(new_*1)) {
        this.vx_set_is_virtual_bet(true);
      } else {
        this.vx_set_is_virtual_bet(false);
      }
      this.vx_virtual_bet_clear();
    },
    /**
     * 监听预约投注计算球头字段
     */
    "vx_get_bet_appoint_obj.computed_appoint_ball_head"() {
      return;
      let { _mhs, _hs, os } = this.ol_data_item;
      this.odds_state = this.get_odds_state(_mhs, _hs, os);
      // 如果为单关
      if(this.vx_is_bet_single) {
        // 获取球头是否与盘口相等字段
        let is_head_eq_hadicap = _.get(this.vx_get_bet_appoint_obj, 'is_head_eq_hadicap');
        // 当预约投注的球头与盘口值不相等并且此时投注项处于选中状态则取消选中
        if(!is_head_eq_hadicap && this.odds_state == "active") {
          this.odds_state = "";
        }
      }
    },
    odds_state(_new,_old){
        if(this.bet_source === "hot" || this.bet_source === "recent"){
              if(_old == 'active'){
                 window.sessionStorage.removeItem("_bet_source")
              }
              if(_new =='active'){
                window.sessionStorage.setItem("_bet_source", this.bet_source)
              }
        }
    },
  },

  created() {
    this.assign_ol_data_item()
    this.set_match()
    this.score_format()
    this.format_odds(this.ol_data_item.ov, 1);
    // this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW
    // this.version_name = window.env.config.DEFAULT_VERSION_NAME
    this.DOM_ID_SHOW = _.get(window, 'env.config.DOM_ID_SHOW', false)
    this.version_name = _.get(window, 'env.config.DEFAULT_VERSION_NAME', 'zhuanye')
  },

  methods: {

    /**
     * @Description 合并用于显示的盘口信息对象
     * @param {undefined} undefined
    */
     assign_ol_data_item(){
      if(_.get(this.ol_data,'oid')){
        Object.assign(this.ol_data_item,this.ol_data)
      }else{
        Object.assign(this.ol_data_item,{_hs:2,os:3})
      }
    },
    /**
     * @Description 设置赛事
     * @param {undefined} undefined
    */
     set_match(){
      if(this.bet_info.mid_obj.mid){
        this.match = this.bet_info.mid_obj
      }else{
        this.match = this.match_info
      }
    },
    /**
     * 赔率转换
     * @param  {number} ov - 赔率值
     * @param  {number} obv - 断档赔率值
     * @return {undefined} undefined
     */
    format_odds(ov, obv) {

      // 列表取 hsw
      let hsw = _.get(this.play_data, `hl._play.hsw`) || '';
      // 非列表
      if (this.bet_source !== 'match_list') {
        hsw = _.get(this.play_data, `hsw`) || ''
      }
      let sport_id = _.get(this.ol_data_item,'csid');
      // 电竞赔率精度处理
      if(_.isUndefined(sport_id) && $menu.menu_data.is_esports) {
        sport_id = "101"
      }
      this.match_odds = this.compute_value_by_cur_odd_type(
        this.$mathjs.divide(ov, 100000),
        this.$mathjs.divide(obv, 100000),
        hsw,
        sport_id
      );
    },

    /**
     * 设置赔率升降
     * @param  {number} cur - 当前赔率值
     * @param  {number} old - 上次赔率值
     * @return {undefined} undefined
     */
    set_odds_lift(cur, old) {
      if($menu.menu_data.is_virtual_sport){
        return
      }
      let _odds_lift = "";

      if (this.odds_state != "lock" && this.odds_state != "seal" && old && !this.is_odds_seal()) {
        if (cur > old) {
          _odds_lift = "up";
        } else if (cur < old) {
          _odds_lift = "down";
        }

        if (_odds_lift && !this.odds_lift_show) {
          /**清除定时器 */
          if(this.timer_obj['odds_lift']) {
            clearTimeout(this.timer_obj['odds_lift'])
            this.timer_obj['odds_lift'] =null
          }
          this.odds_lift_show = true;
          this.odds_lift = _odds_lift;

          this.timer_obj['odds_lift'] = setTimeout(() => {
            this.odds_lift = "";
            this.odds_lift_show = false;
          }, 5000);
        }
      }
    },

    /**
    * 当赔率对应的欧赔小于1.01时，强制转换成封盘的状态 对盘口加锁
    * @return {boolean}
    */
    is_odds_seal() {
      let ov = _.get(this.ol_data_item, "ov");
      let obv = _.get(this.ol_data_item, "obv");
      let _odds =  ov || obv
      return _odds < 101000
    },

    /**
     * @description 获得最新的盘口状态
     * @param  {number} mhs  赛事级 0：开 1：封 2：关 11：锁
     * @param  {number} hs   盘口级 0：开 1：封 2：关 11：锁
     * @param  {number} os  投注项级 1：开 2：封 3：关 4：锁
     * @return {undefined} undefined
     */
    get_odds_state(mhs, hs, os) {
      let _active = this.get_odds_active(mhs, hs, os);
      let id = _.get(this.ol_data_item, "_hn") || _.get(this.ol_data_item, "oid");
      let state = ""
      const STATE = {
        // 封盘
        2: "seal",
        // 关盘
        3: "close"
      };
      if (!id) {
        state = "disable";
      } else if (STATE[_active]) {
        state = STATE[_active];
      } else {
        let selected_class;
        if(this.vx_get_is_virtual_bet) {
          selected_class = this.virtual_bet_item_select(id)
        } else {
          selected_class = this.bet_item_select(id)
        }
        state = selected_class ? "active" : "normal";
      }
      // 当赔率对应的欧赔小于1.01时，强制转换成封盘的状态 对盘口加锁

      return (this.is_odds_seal() && _active!==3) ? 'seal' : state
    },

    /**
     * @description 投注项点击
     * @return {undefined} undefined
     */
    bet_click(value=null, bet_item_info=null, is_chat_room=false) {
      console.log('value=', value);
      console.log('chat_match_info', bet_item_info);
      // 新的投注流程确认中时不让点击
      if(!this.vx_get_is_virtual_bet && this.vx_get_bet_mode === 1 && this.vx_get_bet_item_lock && !is_chat_room) {
        return;
      }
      if (this.show_fail_alert()) {
        return;
      }
      // 封盘状态不让选择
      if (["seal","close","disable"].includes(this.odds_state) && is_chat_room == false) {
        return;
      }
      console.log('this.ol_data_item', this.ol_data_item);
      let _oid = _.get(this.ol_data_item, "_hn") || _.get(this.ol_data_item, "oid");

      if (this.bet_source === "match_list" && !is_chat_room) {
        _oid = this.oid
      }else if(is_chat_room){
        _oid =  bet_item_info[0].oid
      }
      // if(is_chat_room){
      //   _oid = value.orderId;
      //   this.match_info = chat_match_info;
      // }
      if (_oid) {
        // let match_info = _.cloneDeep(this.match_info);
        //点击来源是赛事详情
        if (this.bet_source === "match_details" && !is_chat_room) {
          this.match_info.hps = [this.play_data];
          this.bet_path.hps_index = 0;
        }

        let id = _.get(this.ol_data_item, "_hn") || _.get(this.ol_data_item, "oid");
        if(is_chat_room) {
          id =  bet_item_info[0].oid;
        }
        // console.log('==================bet_click');
        /* console.log(`===============bet_info:${JSON.stringify(this.bet_info)}`);
        console.log(`===============ol_data_item:${JSON.stringify(this.ol_data_item)}`); */
        if(this.$route.name=='home') {
          this.$utils.send_zhuge_event("PC_首页_投注点击分类", {"详情区域": "右侧列表"});
        } else if(this.$route.name=='details') {
          // 获取父类组件tag名称,用于区分指定模块
          let parent_component_tag = _.get(this,'$options.parent.$options._componentTag');
          if(parent_component_tag == 'q-carousel-slide'){
            this.$utils.send_zhuge_event("PC_首页_投注点击分类", {"详情区域": "列表详情"});
          } else if(parent_component_tag == 'recents'){
            this.$utils.send_zhuge_event("PC_首页_投注点击分类", {"详情区域": "列表详情"});
          } else {
            this.$utils.send_zhuge_event("PC_首页_投注点击分类", {"详情区域": "中间详情"});
          }
        } else if(this.$route.name=='video') {
          this.$utils.send_zhuge_event("PC_首页_投注点击分类", {"详情区域": "大视频"});
        }
        if(!is_chat_room){
          this.match_info.ispo = this.match_info.hps[0].ispo;
        }
        console.log('this.bet_info1===', this.bet_info);
        console.log('this.bet_path1===', this.bet_path);
        console.log('this.bet_source1===', this.bet_source);
        console.log('this.row_index1===', this.row_index);
        console.log('this.bet_ids1===', this.bet_ids);
        if(this.bet_source === 'hot'){
          // 热门推荐
          this.hand_click_event('PC_热门推荐_投注项点击')
        }
        if(this.bet_source === 'recent'){
          // 近期关注
          this.hand_click_event('PC_近期关注_投注项点击')
        }
        let obj_info = this.bet_info;
        if(is_chat_room){
          obj_info = bet_item_info[0]
        }
        console.log('obj_info1----1===', obj_info);
        console.log('bet_source :>>>>>>>>>>>>>>>>>> ', this.bet_source);
        let obj = {
          id,
          match_info: is_chat_room ? value : this.match_info,  //赛事信息
          bet_ids: this.bet_ids,  // 投注项id集合
          bet_path: this.bet_path, // 选中的投注项路径
          ...obj_info,  //投注项信息
          bet_source: is_chat_room? 'is_chat_room':this.bet_source, // 投注项来源
          row_index: this.row_index  // tpl2 行 index
        };
        if(this.vx_get_is_virtual_bet) {
          //点击押注按钮操作 (虚拟体育)
          this.virtual_bat_click(obj);
        } else {
          //点击押注按钮操作
          this.bat_click(obj, is_chat_room);
        }
      }
    },
    hand_click_event(name){
      let info = {}
      if(this.odds_state == "active"){
        info['点击状态'] = '取消'
      }else{
        info['点击状态'] = '选中'
      }
      this.$utils.send_zhuge_event(name, info);
    },
    score_format() {
      let score = '';
      if(this.bet_source=="match_list") {
      let hpid = _.get(this.play_data,'hl._play.hpid');
      // 比分玩法的显示
      if(["7","20","74"].includes(hpid) &&
        !_.isEmpty(this.ol_data_item.ot)) {
          if(this.ol_data_item.ot.includes(':')) {
            score = this.ol_data_item.ot.replace(':', '-');
          } else if(_.toLower(this.ol_data_item.ot)=='other') {
            score = this.$root.$t('list.other')
          }
        }
      }
      this.score = score
    }
  },
  destroyed() {
    /**清除定时器 */
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
      this.timer_obj[key] = null;
    }
  }
}

export default bet_item
