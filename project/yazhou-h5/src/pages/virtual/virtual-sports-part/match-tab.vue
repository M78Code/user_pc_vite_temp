<template>
  <div class="match-tab row justify-end">
    <!-- 足球联赛league_type 0 -->
    <div class="row items-center part-nav" ref="scrollBox" :class="{'part-nav-full': lodash.get(get_access_config, 'statisticsSwitch') && sub_menu_type != 1004}">
      <div ref="scrollItem" v-for="(item,i) in no_list" class="row sub-nav-item" @click="sub_nav_click_handle(item.batchNo, true)"
        :class="{focus:item.batchNo === sub_focus_batch_no,footbal:[1001,1004].includes(sub_menu_type)}"
        v-show="sub_menu_type != '1004' || item.mmp != 'PREGAME' || !pre_to_playing || i != 0"
        :key="i">
        {{item.no}}
      </div>
    </div>
    <!-- 分析icon显示 -->
    <div class="sr-icon-wrapper row justify-center items-center" @click.stop="trend_event"  v-if="lodash.get(get_access_config,'statisticsSwitch') && sub_menu_type != 1004">
      <img class="sub-item-trend-icon2" v-if="[1002, 1011, 1010, 1009].includes(sub_menu_type) && trend_is_show"
            src="image/wwwassets/bw3/common/analyse_icon.svg" alt="" />
      <img class="sub-item-trend-icon1" v-if="[1001,1004].includes(sub_menu_type) && trend_is_show"
            src="image/wwwassets/bw3/common/analyse_icon.svg" alt="" />
      <img class="sub-item-close-icon" v-if="!trend_is_show"
            src="image/wwwassets/bw3/common/sub_item_list_close.svg" alt="">
    </div>
  </div>
</template>

<script>
// #TODO VUEX 
// import { mapGetters, mapMutations } from "vuex"
import utils from "utils/utils";
import lodash from "lodash";
import { useMittOn, useMittEmit, MITT_KEY } from  "src/core/mitt"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name: "match_tab",
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
  
  setup(props, evnet) {
    const data = reactive({
      // 事件集合
      emitters: [],
      // 默认显示分析按钮
      trend_is_show:true,
      // 默认选中第一项
      sub_nav_focus_i:0,
      // 选中的期号
      sub_focus_batch_no:'',
      // 赛前切到滚球
      pre_to_playing:false,
      timer1_: null,
    })
    // #TODO VUEX COMPUTED 
    // computed: {
    // ...mapGetters({
    //   sub_menu_type: 'get_curr_sub_menu_type',
    //   current_batch:'get_current_batch',
    //   get_access_config: 'get_access_config',
    // }),
    // 联赛的类型 field3: 空:不是杯赛 不为空:是杯赛
    const league_type = computed(() => {
      return current_league ? current_league.field3 : ''
    })
    onMounted(() => {
      // #TODO EMIT 
      emitters = [
        useMittOn.on(MITT_KEY.EMIT_BASKETBALL_TIME_ARRIVED, basket_ball_time_handle).off,
        useMittOn.on(MITT_KEY.EMIT_FORCE_END_PLAYING_BASKETBALL, end_playing_basketball_handle).off,
        useMittOn.on(MITT_KEY.EMIT_INGAME_RESULT_SHOW_END, ingame_result_show_end).off,
      ]
      // $root.$on(emit_cmd.EMIT_BASKETBALL_TIME_ARRIVED,basket_ball_time_handle);
      // $root.$on(emit_cmd.EMIT_FORCE_END_PLAYING_BASKETBALL,end_playing_basketball_handle);
      // $root.$on(emit_cmd.EMIT_INGAME_RESULT_SHOW_END,ingame_result_show_end);
    })
    onUnmounted(() => {
      emitters.map((x) => x())
    })
    watch(
      () => props.before_match_tab_trend,
      () => {
        trend_event();
      }
    );
    /**
     * 监听到主菜单(虚拟足球篮球赛马赛狗等)切换变化
     * 改变排行榜与赛事列表的显示状态
     * @param {Undefined}
     * @param {Undefined}
     */
    watch(
      () => props.v_menu_changed,
      () => {
        trend_is_show = true;
      }
    );
    /**
     * 监听到日期列表变化时,
     * 初始化虚拟篮球赛前盘切换到滚球盘的状态
     * @param {Undefined}
     * @param {Undefined}
     */
    watch(
      () => props.no_list,
      () => {
        pre_to_playing = false;
      }
    );
    /**
     * 是否为篮球切换到下一期
     * @param {Boolean} flag true是 false否
     * @param {Undefined}
     */
    watch(
      () => props.is_basket_ball_next_no,
      (flag) => {
        if(flag){
          basket_ball_time_handle();
        }
      }
    );
    /**
     * 监听到用户手动切换联赛
     * @param {Undefined}
     * @param {Undefined}
     */
    watch(
      () => props.is_user_switch_league,
      () => {
        no_init_selected()
      }
    );
    /**
     * 监听到重设期下标动作
     * @param {Undefined}
     * @param {Undefined}
     */
    watch(
      () => props.is_reset_tab_i,
      () => {
        sub_nav_focus_i = 0;
        no_init_selected();
      }
    );
    /**
     * 监听到篮球自动切换到第一期
     * @param {Undefined}
     * @param {Undefined}
     */
    watch(
      () => props.auto_change_tab_i_first,
      () => {
        sub_focus_batch_no = '';
        let batchNo = no_list[sub_nav_focus_i].batchNo;
        sub_nav_click_handle(batchNo);
      }
    );

    // #TODO VUEX ACTIONS 
    // ...mapMutations(['set_current_mid','set_detail_data']),
    /**
     * 篮球倒计时到达
     * @param {Undefined}
     * @param {Undefined}
     */
    const basket_ball_time_handle = () => {
      if(current_batch.mmp == 'INGAME'){
        // #TODO EMIT 
        // $emit('time_ended','is_basketball_playing');
      }
      else if(current_batch.mmp == 'PREGAME'){
        let no_item = no_list.filter(no_item => no_item.mmp == 'INGAME')[0];
        if(no_item){
          sub_nav_click_handle(no_item.batchNo);
          pre_to_playing = true;
        }else{
          timer1_ = setTimeout(() => {
            // #TODO EMIT 
            // $emit('update_next_batch_match');
          },8000);
        }
      }
    };
    /**
     * 批次变化
     * @param {String|Number} batchNo 当前最新期号
     * @param {Undefined}
     */
    const sub_nav_click_handle = (batchNo, is_user_lick = false) => {
      // 期号相同 且 是用户点击 则直接退出
      if(batchNo == sub_focus_batch_no && is_user_lick){
        return;
      }
      sub_nav_focus_i = lodash.findIndex(no_list,{batchNo:batchNo});
      sub_focus_batch_no = batchNo;
      utils.tab_move2(sub_nav_focus_i, $refs.scrollBox)
      let current_sub_nav = no_list[sub_nav_focus_i];

      // #TODO EMIT 
      // $emit('sub_nav_change',{
      //   nav:current_sub_nav,
      //   i:sub_nav_focus_i
      // });

      //将赛马赛事信息跟新到vuex
      let match_info = lodash.get(current_sub_nav,'match[0]')
      match_info && set_detail_data(lodash.cloneDeep(match_info))

      //赛马传递赛事集合唯一赛事的赛事id
      if([1002, 1011, 1010, 1009].includes(sub_menu_type)){
        let mid = '';
        try{
          mid = current_sub_nav.match[0].mid;
        }catch(e){console.error(e)}
        if(mid){
          set_current_mid(mid);
        }
      }
    };
    /**
     * 初始化选择期号与用户手动切换期号
     * @param {Undefined}
     * @param {Undefined}
     */
    const no_init_selected = () => {
      if(!no_list || !no_list.length) return;
      set_i_by_batch_no();
      let selected = no_list[sub_nav_focus_i];
      // #TODO EMIT 
      // $emit('sub_nav_change', {
      //   nav:selected,
      //   i:sub_nav_focus_i
      // });
      //赛马传递赛事集合唯一赛事的赛事id
      if(![1001,1004].includes(sub_menu_type)){
        let mid = '';
        try{
          mid = selected.match[0].mid;
          //将赛马赛事信息跟新到vuex
          selected.match[0] && set_detail_data(lodash.cloneDeep(selected.match[0]));
        }catch(e){console.error(e)}
        if(mid){
          set_current_mid(mid);
        }
      }
    };
    /**
     * 图表切换按钮点击
     * @param {Undefined}
     * @param {Undefined}
     */
    const trend_event = () => {
      trend_is_show = !trend_is_show
      // #TODO EMIT 
      // $emit('trend_event_change', !trend_is_show)
    };
    /**
     * 通过当前期设置期下标
     * @param {Undefined}
     * @param {Undefined}
     */
    const set_i_by_batch_no = () => {
      if(current_batch && current_batch.batchNo){
        if(current_batch.mmp == "PREGAME"){
          if(no_list && no_list[0].mmp == "INGAME"){
            no_list.shift();
          }
        }
        else if(current_batch.mmp == "INGAME"){
          if(no_list && no_list[0].mmp == "PREGAME"){
            no_list.shift();
          }
        }
        sub_nav_click_handle(current_batch.batchNo);
      }
    };
    /**
     * 篮球滚球赛事结束
     * @param {Undefined}
     * @param {Undefined}
     */
    const end_playing_basketball_handle = () => {
      basket_ball_time_handle();
    };
    /**
     * 滚球篮球赛果展示结束切换到下一个赛前tab
     * @param {Undefined}
     * @param {Undefined}
     */
    const ingame_result_show_end = () => {
      let no_item = no_list.filter(no_item => no_item.mmp == 'PREGAME')[0];
      if(no_item){
        sub_nav_click_handle(no_item.batchNo);
        if(no_list[0].mmp == 'INGAME'){
          no_list.shift();
        }
      }
    }
    return {
      ...toRefs(data),
      lodash,
      league_type,
      basket_ball_time_handle,
      sub_nav_click_handle,
      no_init_selected,
      trend_event,
      set_i_by_batch_no,
      end_playing_basketball_handle,
      ingame_result_show_end
    }
  }
})
</script>

<style lang="scss" scoped>
.match-tab {
  width: 100%;
  height: 0.4rem;
  position: sticky;
  top: 1.08rem;
  z-index: 99;
  display: flex;
  align-items: center;
}

.part-nav {
  overflow-y: hidden;
  overflow-x: auto;
  width: 100%;
  height: 0.4rem;
  line-height: 0.4rem;
  padding-right: 0.2rem;
  padding-left: 0.08rem;
  flex-wrap: nowrap;
  
  &.part-nav-full {
    width: 3.25rem;
  }
  
  &:after {
    content: ' ';
    display: block;
    width: 0.16rem;
    height: 0.1rem;
    flex-shrink: 0;
  }

  .sub-nav-item {
    min-width: fit-content;
    font-size: 0.14rem;
    margin-right: 0.19rem;
    letter-spacing: -0.01rem;
    height: 100%;
    position: relative;
    padding-left: 0.08rem;

    &.focus {
      &:after {
        display: block;
      }
    }

    &:last-child {
      margin-right: 0;
    }

    &.footbal {
      font-size: 0.13rem;
      line-height: 0.41rem;
    }

    &:after {
      content: '';
      width: 4px;
      height: 4px;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-2px);
      display: none;
    }
  }
}

.sr-icon-wrapper {
  flex: 1;
  height: 0.4rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0.1rem;
    height: 0.2rem;
    width: 1px;
  }

  .sub-item-trend-icon1 {
    width: 0.18rem;
    height: 0.2rem;
  }

  .sub-item-trend-icon2 {
    width: 0.18rem;
    height: 0.2rem;
  }

  .sub-item-close-icon {
    width: 0.2rem;
    height: 0.2rem;
    display: block;
  }
}
</style>
