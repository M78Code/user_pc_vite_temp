<!--
 * @Author:
 * @Date: 2021-08-29
 * @Description: 活动内容 主页面
-->
<template>
  <div>
    <div class="activity_task" :class="[is_maintaining && 'act-maintain']" v-show="the_first_time_show">
      <img src="/public/yazhou-h5/image/svg/go-back-icon-theme02.svg" class="back_btn" @click="$common.go_where({back_to: 'go_back_from_activity'})" v-show="is_maintaining"/>
      <!-- 活动返回按钮 及 标题 -->
      <div class="head yb_px14 yb_fontsize14" v-if="!isAPP && !is_maintaining">
        <img src="/public/yazhou-h5/image/svg/go-back-icon-theme02.svg" @click="$common.go_where({back_to: 'go_back_from_activity'})"/>
        <span>{{(is_maintaining) ? '活动维护' : '每天做任务 惊喜转不停，运气爆棚 奖金最高10倍送'}}</span>
      </div>
      <!-- 正常活动页面 -->
      <div v-show="!is_maintaining">
        <header class="activity_task-header"></header>
        <div class="header-tab">
          <div
              v-for="(item,i) in tab_list" :key="i+'ii_id'"
              :class="{'is-active' : tab_Id == item.activityId}"
              @click="tab_click(item, item.activityId, i, 'maintain')">
              <span>
                {{ item.activityId == '10010' ? '老虎机' :item.name }}
                <img :src="item.state_url"/>
              </span>
          </div>
        </div>
        <!-- 每日任务组件 -->
        <growth-task
            v-if="tab_Id == 10007 && get_user.activityList"
            :key="'daily'"
            :isIphoneX="isIphoneX"
            :inStartTime="inStartTime"
            :activityIndex="activity_index"
            :inEndTime="inEndTime"
            :actId = 1
            @to_lucky="to_lucky"
            @to_maintenance="to_maintenance"
        />
        <!-- 成长任务组件 -->
        <growth-task
            v-if="tab_Id == 10008 && get_user.activityList"
            :key="'growing'"
            :isIphoneX="isIphoneX"
            :inStartTime="inStartTime"
            :activityIndex="activity_index"
            :inEndTime="inEndTime"
            :actId = 2
            @to_lucky="to_lucky"
            @to_maintenance="to_maintenance"
        />
        <!-- 幸运盲盒组件 -->
        <lucky-blind-box
            v-if="tab_Id == 10009 && get_user.activityList"
            :isIphoneX="isIphoneX"
            :inStartTime="inStartTime"
            :inEndTime="inEndTime"
            :activityIndex="activity_index"
            :key ="'lucky'"
            @to_maintenance="to_maintenance"
        />
        <slot-machine
            v-if="tab_Id == 10010 && get_user.activityList"
            :isIphoneX="isIphoneX"
            :inStartTime="inStartTime"
            :inEndTime="inEndTime"
            :activityIndex="activity_index"
            :key ="'lucky'"
            @to_maintenance="to_maintenance"
        />
      </div>
      <!-- 活动挂维护页面 -->
      <div v-show="is_maintaining" class='maintain-main'>
        <img :src="get_file_path(get_user.maintainingH5Url)"/>
        <div class="maintain-describe">
          <div class="title_1">{{ get_user.maintainingTitle }}</div>
          <div class="title_2">{{style_special_treatment}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let over =  "activity/yazhou-h5/activity/over.png";
let stay_tuned = "activity/yazhou-h5/activity/stay_tuned.png";
let playing = "activity/yazhou-h5/activity/playing.png";
import { api_admin } from "project/activity/src/api/index.js";
import lucky_blind_box from "./components/lucky_blind_box.vue";
import growth_task from "./components/growth_task.vue";
import slot_machine from './components/slot_machine.vue'
import acticity_mixin from "./mixin/acticity_mixin.js";
import { UserCtr } from "project_path/src/core/index.js";

import _ from 'lodash';
 
 
import {gtag_config_send,
gtag_view_send,
gtag_event_send,
zhuge_event_send  ,format_time_zone_time ,is_time_limit } from "project_path/src/core/index.js"

export default {
  name: "activity_task",
  mixins:[acticity_mixin],
  components: {
    'lucky-blind-box': lucky_blind_box,
    'growth-task': growth_task,
    'slot-machine': slot_machine
  },
  data() {
    return {
      // 活动tab选项卡
      tab_list: [],
      // 当前的活动id
      tab_Id: 10007,
      // 当前的活动选择下标
      activity_index: 0,
      // 当前活动开始时间
      inStartTime:0,
      // 当前活动结束时间
      inEndTime:0,
      // 幸运盲盒位置
      lucky_blind_box_index: -1,
      // 是否ipx
      isIphoneX: false,
      // 是否是原生APP 的banner点击过来
      isAPP: false,
      // 是否是维护阶段
      is_maintaining:false,
      the_first_time_show: false,
    }
  },
  watch: {
    // 监听 get_user 的数据变化
    'get_user':{
      handler(n, o){
        // period1 未开始2 进行中3 已结束
        if(n && n.activityList){
          this.tab_list = _.cloneDeep(n.activityList)
          this.tab_list.forEach( item => this.activity_status_picture(item))
        }
        this.$forceUpdate()
      },
      deep: true
    }
  },
  computed: {
    // 活动维护公告，换行方法
    style_special_treatment() {
      let maintenance_string
        maintenance_string = this.get_user && this.get_user.maintainingContent && this.get_user.maintainingContent.replace(new RegExp('/',"gm"),'\n')
      return maintenance_string
    },
    get_user() {
        return UserCtr.get_user();
    },
    get_user_token() {
        return UserCtr.get_user_token();
    }
  },
  created() {
    // 定时器
    this.first_timer1 = 0;
    this.first_timer2 = 0;
    this.timer2_ = 0;
    // 初始化tab 选项卡
    let {act} = this.$route.params
    //isAPP为true时,活动中心返回按钮就隐藏 不传isAPP或者为false时就正常显示 
    if(sessionStorage.getItem('isAPP') == 1 ){
      this.isAPP = true
    }
    
    let params_obj = new URLSearchParams(location.search)
    this.is_maintaining = this.get_user.maintaining
    // 方便调试, 先放出来正常的活动页面吧
    this.is_maintaining = false;
    if(act){
      // 返回到场馆的 历史记录
      if (!location.search.includes('keep_url')) {
        history.replaceState(null, '', `${location.pathname}${location.hash}`)
      }
      this.first_timer1 = setTimeout(async ()=> {
        // 检测近3s内是否更新过用户数据
        if((new Date().getTime() - _.get(this.get_user,'upd_time',0)<3000)){
          let data = this.get_user;
		  // 配置埋点信息
          gtag_config_send(data.userId);
          this.initialization_menu(data.activityList,act)
        } else {
          let {data, code} = await api_admin.get_user_info_bytoken({token: params_obj.get('token') || this.get_user_token});
          if(data != null && code == 200){
            this.set_user(data);
            // 配置埋点信息
            gtag_config_send(data.userId);
            this.initialization_menu(data.activityList,act)
          }
        }
      },200)
    }else{
      this.initialization_menu(this.get_user.activityList, )
    }
    // this.$root.$on(MITT_TYPES.EMIT_INDEX_REFRESH_END, this.index_refresh_end_handle);
    this.isIphoneX =  /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
    // this.$root.$on(MITT_TYPES.EMIT_TO_MAINTENANCE, this.to_maintenance)
  },
  methods: {
    set_user(args) {
        return UserCtr.set_user_info(args);
    },
    get_file_path:  ()=>'',
    // 去到维护页面
    to_maintenance() {
      this.$toast('活动现已维护，感谢您的支持', 2000)
      clearTimeout(this.timer2_)
      this.timer2_ = setTimeout(()=>{
        this.is_maintaining = true
      },2000)
    },
    // 初始化tab 选项卡
    initialization_menu(activityList,act_copy) {
      this.tab_list = _.cloneDeep(activityList || []);
      this.tab_list.forEach( (item, i)=> {
        // 商户跳转过来时,有带 act参数，调用方法
        if(act_copy == item.activityId){
          console.log('有带 act参数，调用方法');
          this.tab_Id = act_copy
          this.tab_click(_.cloneDeep(activityList)[i], this.tab_Id, i, '', 'is_first_time')
        }else if(i == 0) {// 默认调用第一个
          console.log('默认调用第一个');
          this.tab_Id = item.activityId
          this.tab_click(_.cloneDeep(activityList)[0], this.tab_Id, 0,'', 'is_first_time')
        }
        // 盲盒活动的下标
        if(item.activityId == '10009') this.lucky_blind_box_index = i
        this.activity_status_picture(item)
      })
      // 成功进入活动页
      gtag_view_send('H5_activity', '/activity_task')
    },
    // 活动时间状态图片 period 或者 this.isDuringDate(time1,time2)： 1 未开始  2 进行中   3 已结束
    activity_status_picture(item) {
      if(item.period == 1) {
        item.state_url = stay_tuned
      }else if(item.period == 2){
        item.state_url = playing
      }else if(item.period == 3){
        item.state_url = over
      }
    },
    // tab 选项卡切换
    async tab_click(item, activityId, index, is_click, is_first_time) {
      let isCurrentTab = this.tab_Id == activityId;
      this.tab_Id = activityId
      this.activity_index = index
      this.inStartTime = +item.inStartTime
      this.inEndTime = +item.inEndTime
      if(this.get_user_token && is_click != 'not_need_click'){
        // 数据是否来源网络
        let user_data_from_net = true;
        try {
          let code,data;
          // 检测近3s内是否更新过用户数据
          if((new Date().getTime() - _.get(this.get_user,'upd_time',0)<3000)){
            data=this.get_user;
            code=200;
            // 设置数据来源非网络
            user_data_from_net = false;
          } else {
            let obj_temp = await api_admin.get_user_info_bytoken({token: this.get_user_token})
            data=obj_temp.data
            code=obj_temp.code
          }
          if(data != null && code == 200){
            this.is_maintaining = data.maintaining
            if(is_click == 'maintain' && data.maintaining){
              this.to_maintenance()
            }
            // 如果是第一次加载页面，则等接口加载完之后，显示页面
            if(is_first_time == 'is_first_time') {
              this.the_first_time_show = true
            } else {
              // 防止在点击当前页签时重复计算
              if (!isCurrentTab) {
                // 配置埋点信息
                gtag_config_send(data.userId);
                let eventLabel = ''
                // 埋点采集任务中心tab点击
                if (activityId == '10007') {
                  gtag_event_send('H5_edtask_click', 'H5_活动', 'H5_每日任务', new Date().getTime())
                  eventLabel = "H5_每日任务页签";
                } else if (activityId == '10008') {
                  gtag_event_send('H5_grtask_click', 'H5_活动', 'H5_成长任务', new Date().getTime())
                  eventLabel = "H5_成长任务页签";
                } else if (activityId == '10009') {
                  gtag_event_send('H5_luckybox_click', 'H5_活动', 'H5_幸运盲盒', new Date().getTime())
                  eventLabel = "H5_幸运盲盒页签";
                }
                if (eventLabel) {
                  zhuge_event_send(eventLabel, this.get_user);
                }
              }
            }
            // 同步最新用户数据
            user_data_from_net && this.set_user(data);
          } else {
          	// 显示页面
            this.the_first_time_show = true
          }
        }catch (e){
          console.error(e);
          this.the_first_time_show = true
        }
      }
    },
    // 跳转到 幸运盲盒
    to_lucky() {
      window.scrollTo(0,0);
      if(window.vue && window.vue.scroll_list_wrapper_by){
        window.vue.scroll_list_wrapper_by(0);
      }
      if(this.lucky_blind_box_index >=0){
        this.tab_click(_.cloneDeep(this.get_user.activityList)[this.lucky_blind_box_index], 10009, this.lucky_blind_box_index, 'maintain')
      }
      this.$nextTick(() => {
        document.querySelector(".scroll-to-view").scrollIntoView()
      })
    },
    // 倒计时结束 刷新当面页面
    index_refresh_end_handle() {
      clearTimeout(this.first_timer2)
      this.first_timer2 = setTimeout(async ()=> {
        let {data, code} = await api_admin.get_user_info_bytoken({token: this.get_user_token})
        if(data != null && code == 200){
          this.tab_click(_.cloneDeep(data.activityList)[this.activity_index], _.cloneDeep(data.activityList)[this.activity_index].activityId, this.activity_index, 'not_need_click')
          this.set_user(data);
          // 配置埋点信息
          gtag_config_send(data.userId);
        }
      },800)
    },
  },
  destroyed() {
    if(this.first_timer1) {
      clearTimeout(this.first_timer1)
      this.first_timer1 = null
    }

    if(this.first_timer2) {
      clearTimeout(this.first_timer2)
      this.first_timer2 = null
    }

    clearTimeout(this.timer2_)
    this.timer2_ = null

    // this.$root.$off(MITT_TYPES.EMIT_INDEX_REFRESH_END, this.index_refresh_end_handle);
    for (const key in this.$data) {
      this.$data[key] = null
    }
    // this.$root.$off(MITT_TYPES.EMIT_TO_MAINTENANCE, this.to_maintenance)
    sessionStorage.removeItem('isAPP')
  }
}
</script>

<style lang="scss" scoped>
.head {
  position: sticky;
  width: 100%;
  line-height: 0.44rem;
  height: 0.44rem;
  left: 0;
  top: 0;
  color: #333333;

  background: #fff;
  z-index: 99;
  text-align: center;
  padding-left: 0.15rem;

  > span {
    font-family: PingFangSC-Medium sans-serif;
    font-size: 0.13rem;
    color: #333333;
  }

  img {
    position: absolute;
    left: 0.15rem;
    top: 0.12rem;
    display: inline-block;
    width: 0.12rem;
    height: 0.2rem;
    vertical-align: -0.04rem;
    // margin-left: 0.01rem;
  }
}

.activity_task {
  padding-bottom: 0.5rem;

  background: #fff;
  position: relative;

  .back_btn {
    position: absolute;
    left: 0.16rem;
    top: 0.12rem;
  }

  .activity_task-header {
    width: 100%;
    padding-top: 100%;
    background: var(--q-color-com-img-bg-148) no-repeat;
    background-size: 100% auto;
    background-color: #fdfcfa;
    background-position: center;
  }

  .header-tab {
    width: 3.4rem;
    height: 0.49rem;
    padding: 0 0.05rem;
    display: flex;
    align-items: center;
    margin: 0 auto;
    box-sizing: border-box;
    background: #fafafa;
    background-image: linear-gradient(
      180deg,
      #ffffff 0%,
      #f3f3f3 77%,
      #fafdff 100%
    );
    border: 2px solid #f2f2f2;
    border-radius: 0.35rem;
    margin-top: 0.05rem;

    > div {
      height: 0.34rem;
      padding: 0 0.1rem;
      flex: 1;
      color: #666666;
      display: flex;
      justify-content: center;
      align-items: center;
      letter-spacing: 0;
      text-align: center;
      font-size: 0.12rem;

      > span {
        position: relative;

        > img {
          height: 0.2rem;
          position: absolute;
          top: -0.21rem;
          right: -.26rem;
        }
      }

      &.is-active {
        background-image: linear-gradient(180deg, #ffe8bc 0%, #e79b40 99%);
        border-radius: 0.245rem;
        color: #ffffff;
        font-weight: bold;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        width: 1.1rem;
      }
    }
  }
}

.act-maintain {
  padding: unset;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--q-color-com-img-bg-131)
    no-repeat;
  background-size: 100% 100%;

  .maintain-main {
    display: flex;
    flex-direction: column;
    align-items: center;

    > img {
      width: 3.44rem;
      height: 2.9rem;
      margin-top: 0.2rem;
    }

    .maintain-describe {
      width: 80%;
      margin: 0 auto;
      text-align: center;
      color: #000000;

      .title_1 {
        font-family: PingFangSC-Semibold;
        color: #576484;
        font-size: 0.32rem;
        font-weight: bold;
      }

      .title_2 {
        font-family: PingFangSC-Regular;
        color: #3f4d6a;
        font-size: 0.12rem;
        line-height: 0.24rem;
        font-weight: 400;
        white-space: pre-line;
      }
    }
  }
}

// y0 样式对应
.theme01_y0,.theme02_y0{
  .activity_task {
    .header-tab {
      > div {
        &.is-active {
          background-image: linear-gradient(180deg, #62B6FF 0.31%, #3D72FA 100%);
        }
      }
    }
  }

}

</style>
