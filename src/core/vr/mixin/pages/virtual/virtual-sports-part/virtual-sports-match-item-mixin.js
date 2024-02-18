/*
 * @Description: 虚拟体育足球篮球赛事项组件
 */
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import virtual_sports_m_item_mixin from 'src/core/vr/mixin/virtual-sports-m-item-mixin.js'
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
// import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import UserCtr from "src/core/user-config/user-ctr.js"; 
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";

export default {
  mixins:[virtual_sports_m_item_mixin],
  props:{
    i:Number,
    match_item:Object,
    match_selected_i:Number,
    other_status:Number,
    is_vr_lock: Boolean,
  },
  data(){
    return {
      curr_match_map_time:{},
      vsports:null,
      standard_odd_status:0,
      is_basketball_score:false,
      // arrows: `image/wwwassets/bw3/common/slide_icon_y0.svg",
      arrows: `${LOCAL_PROJECT_FILE_PREFIX}/image/common/slide_icon_y0.svg`,
      // arrows_default: `image/wwwassets/bw3/common/slide_icon.svg`,
      arrows_default: `${LOCAL_PROJECT_FILE_PREFIX}/image/common/slide_icon.svg`,
      // arrows_reverse: `image/wwwassets/bw3/common/slide_icon_reverse_y0.svg`,
      arrows_reverse: `${LOCAL_PROJECT_FILE_PREFIX}/image/common/slide_icon_reverse_y0.svg`,
      // arrows_default_balck:`image/wwwassets/bw3/common/slide_icon_r.svg`,
      arrows_default_balck:`${LOCAL_PROJECT_FILE_PREFIX}/image/common/slide_icon_r.svg`,
      // standard_edition  //新手版1    标准版  2
    }
  },
  created(){
  },
  mounted(){
    this.video_process_init_video();
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_VIDEO_PROCESS_DATA_GOT, this.video_process_init_video).off,
      useMittOn(MITT_TYPES.EMIT_PRE_COUNTING_EDN, this.pre_counting_end_handle).off,
      useMittOn(MITT_TYPES.EMIT_XU_NI_TY_STANDARD_ODD_STATUS, this.xu_ni_ty_standard_odd_status).off,
    ]
  },
  methods:{
    // 设置玩法项默认选中
    set_details_item(data){ VR_CTR.state.details_item = data },
    set_current_gotodetail_match(data){ return VR_CTR.state.current_gotodetail_match = data },
    /**
     * 篮球早盘倒计时结束显示列表比分
     */
    pre_counting_end_handle(){
      this.is_basketball_score = true;
    },
    /**
     * 获取hl的hs
     * @param {Number} hp_i
     * @return Undefined Undefined
     */
    get_hl_hs(hp_i){
      let hs = 0;
      if(hp_i && hp_i.hl && hp_i.hl[0]){
        hs = hp_i.hl[0].hs;
      }
      return hs;
    },
    /**
     * 获取ol的length
     * @param {Number} hp_i
     * @param {Number} hp_i_i
     * @return Undefined Undefined
     */
    get_ol_length(hp_i,hp_i_i){
      let ol_list = [];
      if(hp_i && hp_i.hl && hp_i.hl[0] && hp_i.hl[0].ol){
        ol_list = hp_i.hl[0].ol;
      }
      else{
        if([1,4].includes(+this.match_item.csid)){
          if(this.match_item.hps && this.match_item.hps[hp_i_i]){
            if(this.match_item.hps[hp_i_i].hpid == 1){
              return 3;
            }
          }
        }
      }
      return ol_list.length;
    },
    /**
     * 获取hp指定部分
     * @param {Number} type 0 第一部分; 1 第二部分
     * @return Undefined Undefined
     */
    get_hp_list(type){
      if(type == 0){
        let hps = [];
        if(this.match_item && this.match_item.hps){
          hps = this.match_item.hps.slice(0,3);
        }
        return hps;
      }
      else if(type == 1){
        let hps = [];
        if(this.match_item && this.match_item.hps && this.match_item.hps.length > 3){
          hps = this.match_item.hps.slice(3,6);
        }
        return hps;
      }
    },
    /**
     * 滑动赔率容器
     * @param {Number} type 0 第一部分; 1 第二部分
     * @return Undefined Undefined
     */
    odd_wrapper_pan({ direction,isFinal }){
      return; //复刻版vr不能滑动
      if (this.get_hp_list(1).length && !isFinal) {
        if(direction == "left"){
          this.standard_odd_status = 1;
        }
        else{
          this.standard_odd_status = 0;
        }
        this.$emit('odd_pan',this.standard_odd_status);
      }
    },
    /**
     * 获取播放按钮图标路径
     */
    get_play_btn_class(match,i){
      if(match.match_status == 1){
        if(this.match_selected_i == i){
          return 'img-playing';
        }
        else{
          return 'img-play';
        }
      }
      else{
        return 'img-disabled';
      }
    },
    /**
     * 切换赛事
     * @param {Number} i 赛事下标
     * @return {Undefined}
     */
    switch_match_handle(i,m){
      //虚拟篮球不允许切换
      if(m.match_status == 2 || this.get_curr_sub_menu_type == 1004) return;
      this.$emit('switch_match',i);
    },
    /**
     * 获取投注项
     * @param {Object} match 赛事
     * @return {Object}
     */
    get_hl_item(match){

      let hp_item = {}
      let hp_id_convert;
      //足球
      if(match.csid == 1001){
        if(this.footer_sub_menu_id == 1){      //独赢
          hp_id_convert = 20001
        }
        else if(this.footer_sub_menu_id == 4){  //让盘
          hp_id_convert = 20004
        }
        else if(this.footer_sub_menu_id == 2){   // 大小
          hp_id_convert = 20002
        }
        else if(this.footer_sub_menu_id == 114){  // 大小
          hp_id_convert = 20001   //角球独赢
        }
      }
      //篮球
      else if(match.csid == 1004){
        if(this.footer_sub_menu_id == 1){      //独赢
          hp_id_convert = 20043
        }
        else if(this.footer_sub_menu_id == 4){  //让盘
          hp_id_convert = 20045
        }
        else if(this.footer_sub_menu_id == 2){   // 大小
          hp_id_convert = 20044
        }
      }

      if(match.hps && match.hps.length){
        hp_item = match.hps.filter(hp => hp.hpid == hp_id_convert)[0];
      }
      return hp_item;
    },
    /**
     * 获取赔率列表
     * @param {Object} match 赛事
     * @return {Array}
     */
    get_ol_list(hp_item){
      let ol_list = [];
      if(hp_item && hp_item.hl && hp_item.hl.length){
        ol_list = hp_item.hl[0].ol;
      }
      return ol_list;
    },
    /**
     * 获取赔率列表
     * @param {Object} match 赛事
     * @return {Array}
     */
    get_ol_list_f_match(match){
      let ol_list = [];

      let hp_id_convert;
      //足球
      if(match.csid == 1001){
        ol_list = [
          {
            invalid:1
          },
          {
            invalid:1
          },
          {
            invalid:1
          }
        ];

        if(this.footer_sub_menu_id == 1){      //独赢
          hp_id_convert = 20001
        }
        else if(this.footer_sub_menu_id == 4){  //让盘
          hp_id_convert = 20004
        }
        else if(this.footer_sub_menu_id == 2){   // 大小
          hp_id_convert = 20002
        }
        else if(this.footer_sub_menu_id == 114){  // 大小
          hp_id_convert = null   //角球独赢
          ol_list = [
            {
              invalid:1
            },
            {
              invalid:1
            }
          ];
        }
      }
      //篮球
      else if(match.csid == 1004){
        ol_list = [
          {
            invalid:1
          },
          {
            invalid:1
          },
          {
            invalid:1
          }
        ];

        if(this.footer_sub_menu_id == 1){      //独赢
          hp_id_convert = 20043
        }
        else if(this.footer_sub_menu_id == 4){  //让分
          hp_id_convert = 20045
        }
        else if(this.footer_sub_menu_id == 2){   // 总分大小
          hp_id_convert = 20044
        }
        else if(this.footer_sub_menu_id == 114){  // 大小
          hp_id_convert = 20043
          // hp_id_convert = null   //角球独赢
          // ol_list = [
          //   {
          //     invalid:1
          //   },
          //   {
          //     invalid:1
          //   }
          // ];
        }

      }
      if(match.hps && match.hps.length && this.footer_sub_menu_id != 114){
        let hp_item = match.hps.filter(hp => hp.hpid == hp_id_convert)[0];
        if(hp_item && hp_item.hl && hp_item.hl.length){
          if(this.footer_sub_menu_id == 1){ //独赢
            let ol_l_list = hp_item.hl[0].ol;
            let m = ol_l_list.filter(ol_item => ol_item.ot == "1")[0];
            let he = ol_l_list.filter(ol_item => ol_item.ot == "X")[0];
            let a = ol_l_list.filter(ol_item => ol_item.ot == "2")[0];
            ol_list = [];
            if(m){
              ol_list.push(m);
            }
            if(he){
              ol_list.push(he);
            }
            if(a){
              ol_list.push(a);
            }
          }
          else{ //非独赢
            ol_list = hp_item.hl[0].ol;
          }
        }
      }
      console.log('ol_list', ol_list);
      
      return ol_list;
    },
    /**
     * 跳转至虚拟体育详情
     * @param {Object} match 赛事
     * @return {String}
     */
    goto_details(match) {
      let mid = match.mid;
      let copied = lodash.cloneDeep(match);
      this.set_current_gotodetail_match(copied);
      this.set_details_item(0);
      this.$router.push({
        name: 'virtual_sports_details',
        query: {
          mid: mid,
          i: this.id,
          home: this.$route.query.home ? this.$route.query.home : 'match'
        }
      })
    },
    xu_ni_ty_standard_odd_status(status) {
      this.standard_odd_status = status;
    },
    /**
     *@description 虚拟体育点击列表小方块投注
     *@param {Object} match_item 最外层赛事数据
     *@param {Object} ol_item 里层ol数据
     *@return {Undefined} undefined
     */
    item_click4(match_item,ol_item){
      //对应没有赔率值或者欧赔小于101000,或者虚拟体育赛事状态不为0
      if (match_item.mhs != 0 || !ol_item.ov || ol_item.ov < 101000 || match_item.match_status || this.is_vr_lock){
        return;
      }

      let hl_item = this.get_hl_item(match_item)
      if (!hl_item) return;
      ol_item.id_ = lodash.get(hl_item,'hl[0].hn') ?
        `${match_item.mid}_${hl_item.chpid || hl_item.hpid}_${ol_item.ot}_${hl_item.hl[0].hn}` : ol_item.oid;
      // this.bet_click3(match_item, hl_item, ol_item);
      this.go_to_bet(ol_item);
      
    },
    go_to_bet (ol_item) {
      const {oid,_hid,_hn,_mid,_hpid } = ol_item
      let params = {
        oid, // 投注项id ol_obj
        _hid, // hl_obj 
        _hn,  // hn_obj
        _mid,  //赛事id mid_obj
      }
      let other = {
        is_detail: false,
        // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
        // 根据赛事纬度判断当前赛事属于 那种投注类型
        bet_type: 'vr_bet',
        // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
        device_type: 1,  
        // 数据仓库类型
        match_data_type: "h5_list",
    }
      set_bet_obj_config(params,other)
  }
  },
  computed:{
    footer_sub_menu_id(){return VR_CTR.state.footer_sub_menu_id },
    get_video_process_data(){return VR_CTR.state.video_process_data},
    get_curr_sub_menu_type(){ return VR_CTR.state.curr_sub_menu_type },
    get_access_config(){return {handicapNum: true}},
    //新手版1    标准版  2
    standard_edition(){return UserCtr.standard_edition},
    show_debugger_line(){
      let wsl = sessionStorage.getItem('wsl');
      if(wsl == '9999') return true;
      return false;
    },
    show_basketball_score(){
      let flag = false;
      if(this.is_basketball_score){
        flag = true;
      }
      if(this.get_curr_sub_menu_type == 1004){
        if(this.match_item.mmp == "INGAME"){
          flag = true;
        }
      }
      return flag;
    }
  },
  watch:{
    other_status(n){
      this.standard_odd_status = n;
    },
  },
  unmounted(){
    if(this.vsports){
      this.vsports.destroy();
    }
    this.emitters.map((x) => x());
  }
}