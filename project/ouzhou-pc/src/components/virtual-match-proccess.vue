<!--
 * @Author: Amor 
 * @Date: 2020-12-23 14:11
 * @Description: 虚拟体育 赛事阶段
-->
<template>
  <div class="c-match-process virtual-sport">
    <div class="match-no-wrap inner-wrap row justfiy-start yb-flex-nowrap">
      <div class="timer-wrap row items-center col-left">
        <!-- 倒计时图标 -->
        <icon
          v-show="cur_ountdown_second >= -1"
          name="icon-timer"
          size="14px"
          color="#F5F8FA"
        />
        <!-- 倒计时 -->
        <timer
          v-show="cur_ountdown_second >= -1"
          :tconfig="{ time: Number(match.mgt), step: -1000, on_time_change }"
        />
      </div>
      <!-- 当轮数 -->
      <div
        v-if="show_no"
        class="match_no ellipsis"
        v-tooltip="{ content: match.no, overflow: 1 }"
      >
        {{ substrName(match.no, match.csid) }}
      </div>
    </div>
  </div>
</template>

<script>
import { api_common } from "src/api";//虚拟体育api
import { reactive,onMounted,toRefs } from " vue";
import { ServerTime,format_second_ms,update_bet_item_status } from "src/output/index.js";
// import { mapGetters } from "vuex";
// import time_format_mixin from "src/public/mixins/common/time_format"; //格式化方法
import timer from "src/public/components/timer.vue"; //倒计时组件

export default {
  mixins: [time_format_mixin],

  components: {
    timer,
  },

  setup(ctx) {
    const props = defineProps({
      // 单场赛事信息
      match: Object,
      // 是否显示轮次/批次号
      show_no: {
        type: Boolean,
        default: true,
      },
      // 可投注的回调方法
      can_bet_callback: Function,
      // 停止投注：距开赛还有 n 秒的回调方法
      stop_bet_callback: Function,
      // 进行时的回调方法
      begin_callback: Function,
      // 结束时的回调方法
      end_callback: Function,
      // 最后 60s 的回调方法
      second60_callback: Function,
    });

    const state = reactive({
      // 定时对象
      timer_obj: null,
      // 当前进行赛事的最大视频时长
      video_maxtime: 0,
      // 开赛后的保留 x 秒后拉取新的批赛事
      stay_time: this.match.csid == "1004" ? -10 : -30,
      // 记录当前赛事的最新倒计时（详情开赛后需隐藏倒计时）
      cur_ountdown_second: 0,
      // 是否执行过 can_bet_callback 回调
      can_bet_callback_once: false,
      // 是否执行过 begin_cllback 回调
      begin_callback_once: false,
      // 是否执行过 end_cllback 回调
      end_callback_once: false,
      // 是否执行过 second60_callback 回调
      second60_callback_once: false,
      // 篮球滚球 10 秒后是否拉过接口
      second15_fetch_list: false,
      // 是否正在设置最大视频时长
      set_video_maxtime_lock: false,
    });


    // =====================methods=================

     /**
     * @description 滚球虚拟篮球去掉 滚球 赛前
     * @param { test,csid}  展示文字 球种id
     * @return {undefined} test
     *
     */
    //
  const  substrName = (test, csid) =>{
      if (this.vx_cur_menu_type.type_name == "play" && csid == "1004") {
        return test.substr(0, test.indexOf("-") - 1);
      } else {
        return test;
      }
    }

        /**
     * @description 时间变化时调用(S)
     * @param  {object} obj  时间对象
     * @return {undefined} undefined
     */
    const on_time_change = (obj)=> {
      set_match_stage(obj.tconfig.time, obj);
    }

     /**
     * @description 设置各阶段的逻辑
     * @param  {number} millisecond  毫秒
     * @return {undefined} undefined
     */
    const set_match_stage = (millisecond, obj)=> {
      let match = props.match;
      let remote_time = ServerTime.get_remote_time();
      let second = (Number(millisecond) - remote_time) / 1000;

      // 计时器调用
      obj && (obj.time_str = format_second_ms(second, "default"));

      /**最后 10 秒前调用————仅详情 */
      if (second > 10 && !state.can_bet_callback_once) {
        props.can_bet_callback && props.can_bet_callback();
        state.can_bet_callback_once = true;
        //console.error("can_bet_callback")
      }

      /**【标题栏变成橙色】最后 60 秒————仅列表 **/
      if (second >= 0 && second <= 60 && !state.second60_callback_once) {
        props.second60_callback && props.second60_callback();
        state.second60_callback_once = true;
        // console.error("second60");
      }

      /**【停止投注】最后 10 秒 **/
      if (second >= 0 && second <= 10) {
        props.stop_bet_callback && props.stop_bet_callback(second);
        state.begin_callback_once = false;
        // console.error("stop");
        // 赛事结束禁止投注TODO
        // this.virtual_common.update_bet_item_status(this, {
        //   mid: props.match.mid,
        //   status: 2,
        // });
      }
      if (second <= 0) {
        // console.warn(second)
        // 篮球
        if (match.csid == "1004") {
          let mmp = match.mmp.toUpperCase();

          // 已开赛 ————— 折叠赛事盘口
          if (!state.begin_callback_once) {
            props.begin_callback && props.begin_callback();

            state.begin_callback_once = true;
            // console.error("begin");
          }

          // （赛前 && 10 秒后） || （滚球 && 15 秒后）————为了拉最新的赛前
          if (
            (mmp == "PREGAME" && second <= -10) ||
            (mmp == "INGAME" && second <= -15)
          ) {
            // 从未调用过
            if (!state.second15_fetch_list) {
              props.end_callback && props.end_callback();

              state.second15_fetch_list = true;

              // console.error("end");
            }
          }

          if (mmp == "INGAME" && state.second15_fetch_list) {
            // 未拉取到最大时长 每隔一秒拉一次
            if (!state.video_maxtime) {
              state.set_video_maxtime_lock || set_video_maxtime(second);
              //console.warn('max' ,this.second15_fetch_list,mmp)
            } else {
              set_callback(second);
            }
          }
        } else {
          // 未拉取到最大时长 每隔一秒拉一次
          if (!state.video_maxtime) {
            state.set_video_maxtime_lock || set_video_maxtime(second);
          } else {
            set_callback(second);
          }
        }
      }

      state.cur_ountdown_second = second;
    }

        /**
     * @description 设置此批次 视频时长最长的时间(s)
     * @param  {number} second  当前秒数
     * @return {undefined} undefined
     */
    const set_video_maxtime = (second)=> {
      state.set_video_maxtime_lock = true;
      let params = {
        tid: props.match.tid,
        batchNo: props.match.batchNo,
      };

      api_common.get_video_maxtime(params).then((res) => {
        let code = lodash.get(res, "data.code");
        if (code == 200) {
          let data = lodash.get(res, "data.data");

          state.set_video_maxtime_lock = false;

          let video_maxtime = lodash.get(data, props.match.tid);

          if (video_maxtime) {
            state.video_maxtime = 1;
            //console.error(this.stay_time, video_maxtime);

            state.stay_time += -Number(video_maxtime);
          } else {
            set_callback(second);
          }
        }
      });
    }

    
    /**
     * @description 不同阶段调用不同回调方法
     * @param  {number} second  当前秒数
     * @return {undefined} undefined
     */
    const set_callback = (second)=> {
      // 未结束
      if (second >= state.stay_time) {
        // 从未调用过
        if (!state.begin_callback_once) {
          props.begin_callback && props.begin_callback();

          state.begin_callback_once = true;
          // console.error("begin");
        }

        // 已结束
      } else {
        // 从未调用过
        if (!props.end_callback_once) {
          props.end_callback && props.end_callback();

          state.end_callback_once = true;
          // console.error("end");
        }
      }
    }

    onMounted(()=>{
        //设置各阶段的逻辑
    set_match_stage(props.match.mgt);
    })


    return {
      substrName,
      on_time_change,
      ...toRefs(state)
    }



  }
  
      // TODO
  // computed: {
  //   ...mapGetters({
  //     vx_layout_cur_page: "get_layout_cur_page", //获取路由信息
  //     vx_cur_menu_type: "get_cur_menu_type", //获取菜单类型
  //     vx_get_timestamp: "get_timestamp", //获取服务器时间
  //     vx_get_virtual_bet_obj: "get_virtual_bet_obj", //获取虚拟体育投注对象
  //   }),
  // },

};
</script>

<style lang="scss" scoped>
.match_no {
  line-height: 2;
}
</style>
