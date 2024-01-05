/*
 * @Description: 虚拟体育列表页批次tab切换组件
 */
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import { utils } from "src/core/utils/common/module/utils.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"

export default {
  name:'match_tab',
  props:{
    //当前选中的赛事
    current_match:Object,
    //当前选中的联赛
    current_league:Object,
    //当前虚拟赛事的日期编号列表
    no_list:Array,
    //是否为用户手动切换联赛
    is_user_switch_league:Number,
    //重设日期所在的列表中的下标
    is_reset_tab_i:Number,
    //是否为自动切换到第一个tab(0否,非0是)
    auto_change_tab_i_first:Number,
    //是否为主菜单(虚拟足球篮球赛马赛狗等)切换动作(0否,非0是)
    v_menu_changed:Number | String,
    //虚拟篮球更新到下一期
    is_basket_ball_next_no:Number,
    before_match_tab_trend:Number,
  },
  data(){
    return {
      // 默认显示分析按钮
      trend_is_show:true,
      // 默认选中第一项
      sub_nav_focus_i:0,
      // 选中的期号
      sub_focus_batch_no:'',
      // 赛前切到滚球
      pre_to_playing:false,
      timer1_: null,
    }
  },
  mounted(){
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_BASKETBALL_TIME_ARRIVED, this.basket_ball_time_handle).off,
      useMittOn(MITT_TYPES.EMIT_FORCE_END_PLAYING_BASKETBALL, this.end_playing_basketball_handle).off,
      useMittOn(MITT_TYPES.EMIT_INGAME_RESULT_SHOW_END, this.ingame_result_show_end).off,
    ]
  },
  computed: {
    sub_menu_type(){
      return VR_CTR.state.curr_sub_menu_type;
    },
    current_batch(){
      return VR_CTR.state.current_batch;
    },
    get_access_config(){
      return {};
    },
    // 联赛的类型 field3: 空:不是杯赛 不为空:是杯赛
    league_type(){
      return this.current_league ? this.current_league.field3 : ''
    }
  },
  watch: {
    before_match_tab_trend(){
      this.trend_event();
    },
    /**
     * 监听到主菜单(虚拟足球篮球赛马赛狗等)切换变化
     * 改变排行榜与赛事列表的显示状态
     * @param {Undefined}
     * @param {Undefined}
     */
    v_menu_changed(){
      this.trend_is_show = true;
    },
    /**
     * 监听到日期列表变化时,
     * 初始化虚拟篮球赛前盘切换到滚球盘的状态
     * @param {Undefined}
     * @param {Undefined}
     */
    no_list(){
      this.pre_to_playing = false;
    },
    /**
     * 是否为篮球切换到下一期
     * @param {Boolean} flag true是 false否
     * @param {Undefined}
     */
    is_basket_ball_next_no(flag){
      if(flag){
        this.basket_ball_time_handle();
      }
    },
    /**
     * 监听到用户手动切换联赛
     * @param {Undefined}
     * @param {Undefined}
     */
    is_user_switch_league(){
      this.no_init_selected()
    },
    /**
     * 监听到重设期下标动作
     * @param {Undefined}
     * @param {Undefined}
     */
    is_reset_tab_i(){
      this.sub_nav_focus_i = 0;
      this.no_init_selected();
    },
    /**
     * 监听到篮球自动切换到第一期
     * @param {Undefined}
     * @param {Undefined}
     */
    auto_change_tab_i_first(){
      this.sub_focus_batch_no = '';
      let batchNo = this.no_list[this.sub_nav_focus_i].batchNo;
      this.sub_nav_click_handle(batchNo);
    }
  },
  methods: {
    set_detail_data(data){
      // TODO 需要对应
      VR_CTR.state.detail_data = data
    },
    set_current_mid(mid){
      VR_CTR.state.current_match_mid = mid
    },
    /**
     * 篮球倒计时到达
     * @param {Undefined}
     * @param {Undefined}
     */
    basket_ball_time_handle(){
      if(this.current_batch.mmp == 'INGAME'){
        this.$emit('time_ended','is_basketball_playing');
      }
      else if(this.current_batch.mmp == 'PREGAME'){
        let no_item = this.no_list.filter(no_item => no_item.mmp == 'INGAME')[0];
        if(no_item){
          this.sub_nav_click_handle(no_item.batchNo);
          this.pre_to_playing = true;
        }else{
          this.timer1_ = setTimeout(() => {
            this.$emit('update_next_batch_match');
          },8000);
        }
      }
    },
    /**
     * 批次变化
     * @param {String|Number} batchNo 当前最新期号
     * @param {Undefined}
     */
    sub_nav_click_handle(batchNo, is_user_lick = false){
      // 期号相同 且 是用户点击 则直接退出
      if(batchNo == this.sub_focus_batch_no && is_user_lick){
        return;
      }
      this.sub_nav_focus_i = lodash.findIndex(this.no_list,{batchNo:batchNo});
      this.sub_focus_batch_no = batchNo;
      // utils.tab_move2(this.sub_nav_focus_i, this.$refs.scrollBox)
      let current_sub_nav = this.no_list[this.sub_nav_focus_i];

      this.$emit('sub_nav_change',{
        nav:current_sub_nav,
        i:this.sub_nav_focus_i
      });

      //将赛马赛事信息跟新到vuex
      let match_info = lodash.get(current_sub_nav,'match[0]')
      match_info && this.set_detail_data(lodash.cloneDeep(match_info))

      //赛马传递赛事集合唯一赛事的赛事id
      if([1002, 1011, 1010, 1009].includes(this.sub_menu_type)){
        let mid = '';
        try{
          mid = current_sub_nav.match[0].mid;
        }catch(e){console.error(e)}
        if(mid){
          this.set_current_mid(mid);
        }
      }
    },
    /**
     * 初始化选择期号与用户手动切换期号
     * @param {Undefined}
     * @param {Undefined}
     */
    no_init_selected(){
      if(!this.no_list || !this.no_list.length) return;
      this.set_i_by_batch_no();
      let selected = this.no_list[this.sub_nav_focus_i];
      this.$emit('sub_nav_change', {
        nav:selected,
        i:this.sub_nav_focus_i
      });
      //赛马传递赛事集合唯一赛事的赛事id
      if(![1001,1004].includes(this.sub_menu_type)){
        let mid = '';
        try{
          mid = selected.match[0].mid;
          //将赛马赛事信息跟新到vuex
          selected.match[0] && this.set_detail_data(lodash.cloneDeep(selected.match[0]));
        }catch(e){console.error(e)}
        if(mid){
          this.set_current_mid(mid);
        }
      }
    },
    /**
     * 图表切换按钮点击
     * @param {Undefined}
     * @param {Undefined}
     */
    trend_event() {
      this.trend_is_show = !this.trend_is_show
      this.$emit('trend_event_change', !this.trend_is_show)
    },
    /**
     * 通过当前期设置期下标
     * @param {Undefined}
     * @param {Undefined}
     */
    set_i_by_batch_no(){
      if(this.current_batch && this.current_batch.batchNo){
        if(this.current_batch.mmp == "PREGAME"){
          if(this.no_list && this.no_list[0].mmp == "INGAME"){
            this.no_list.shift();
          }
        }
        else if(this.current_batch.mmp == "INGAME"){
          if(this.no_list && this.no_list[0].mmp == "PREGAME"){
            this.no_list.shift();
          }
        }
        this.sub_nav_click_handle(this.current_batch.batchNo);
      }
    },
    /**
     * 篮球滚球赛事结束
     * @param {Undefined}
     * @param {Undefined}
     */
    end_playing_basketball_handle(){
      this.basket_ball_time_handle();
    },
    /**
     * 滚球篮球赛果展示结束切换到下一个赛前tab
     * @param {Undefined}
     * @param {Undefined}
     */
    ingame_result_show_end(){
      let no_item = this.no_list.filter(no_item => no_item.mmp == 'PREGAME')[0];
      if(no_item){
        this.sub_nav_click_handle(no_item.batchNo);
        if(this.no_list[0].mmp == 'INGAME'){
          this.no_list.shift();
        }
      }
    }
  },
  unmounted(){
    this.emitters.map((x) => x());
    clearTimeout(this.timer1_)
  }
}