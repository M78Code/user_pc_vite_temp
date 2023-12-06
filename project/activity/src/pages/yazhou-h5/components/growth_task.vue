<!--
 * @Author: ledron
 * @Date: 2021-08-25
 * @Description: 成长/每日任务 公用组件
-->
<template>
  <div class="daily-betting-Payouts">
    <div class="active-object">
      <div>
        <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
        <div>
          <span>活动对象：</span>
          <span>本场馆全体会员</span>
        </div>
      </div>
      <div>
        <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
        <div>
          <span>活动时间：</span>
          <template v-if="get_user.activityList[activityIndex].period == 1">
            <span class="count_down_css">
              <span>距离活动开始还有</span>
              <active_count_down :endTime='inStartTime' :noNeedCss="true"></active_count_down>
            </span>
          </template>
          <template v-else-if="get_user.activityList[activityIndex].period == 2">
            <template v-if="get_user.activityList[activityIndex].type == 2 && inEndTime">
              <span class="count_down_css">
                <span>距离活动关闭还有</span>
                <active_count_down :endTime='inEndTime' :noNeedCss="true"></active_count_down>
              </span>
            </template>
            <span v-else>活动长期有效</span>
          </template>
          <span v-else>
            活动结束
          </span>
        </div>
      </div>
      <div>
        <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
        <div>
          <span :style="{width: actId == 1? '.85rem' : '.94rem'}">活动内容：</span>
          <span>{{actId == 1 ? '『每日』达成指定任务，即可获得对应数量的普通奖券，普通奖券可至『老虎机』进行合成并参与老虎机抽奖。' : '『每周/月』达成指定任务，即可获得对应数量的普通奖券，普通奖券可至『老虎机』进行合成并参与老虎机抽奖。'}}</span>
        </div>
      </div>
    </div>
    <div class="activity-rules activities-content">
      <div class="title">
        活动内容
      </div>
      <div class="cumulative-bet-amount" v-if="actId == 2">
        <div v-for="(item, i) in cumulative_betting_list" :key="i+ '_iid'" :class="{'not_first_div': (i==1 || i==2) && (item.mBet && item.mBet.length > 8)}">
          <p>{{i== 1 ? '本周' : '本月'}}累计</p>
          <p>{{ item.name2 }}</p>
          <div class="flex align_items justify-center">
            <span>{{item.mBet != null ? item.mBet : '-'}}</span>
            <span>{{i== 0 ? '天' : '元'}}</span>
          </div>
        </div>
      </div>
      <div class="table">
        <p>
          <span>任务事项</span>
          <span>状态</span>
          <span class="special-Header">
            <div>奖券</div>
            <div>数量</div>
          </span>
          <span>领取状态</span>
        </p>
        <p v-for="(v, i) in get_everyDay_list" :key="i+ '_id_'" v-show="get_everyDay_list.length>0" :class="{'last-row':i==(get_everyDay_list.length-1)}">
          <span v-html="v.taskName"></span>
          <span :class="{'to-be-completed': [2].includes(v.bonusType),completed: [1,3].includes(v.bonusType)}">
            <template v-if="[1,3].includes(v.bonusType)">
              <img class="completed"  :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/completed${get_theme.includes('y0') ? '_y0' : ''}.svg`)" alt="">
              <div class="to-be-completed-stata">已完成</div>
            </template>
            <template v-else>
              未完成
            </template>
          </span>
          <span class="ticket-num">{{v.ticketNum}}</span>
          <span>
            <div v-if="v.bonusType == 1">已领取</div>
            <div v-else-if="v.bonusType == 2" class="to-be-completed">待完成</div>
            <div
              v-else-if="v.bonusType == 3"
              class="receive flex align_items justify-center"
              :class="{'Ash-grey': isDuringDate(inStartTime, inEndTime) == 3}"
              @click.stop="task_receive_btn(v.bonusId)"
            >
              领取
            </div>
          </span>
        </p>
        <div style="text-align: center;padding-top: .6rem;" v-show="!has_data">暂无数据</div>
        <q-inner-loading :showing="get_data_loading">
          <img alt class="loading-static-animation" src="image/wwwassets/bw3/svg/loading-more.svg"/>
        </q-inner-loading>
      </div>
      <div class="f-minutes-update"><i></i>每{{actId == 1? '5分钟' : '小时'}}更新一次</div>
      <div class="collection-record" @click="show_dialog(1)">
        领取记录
      </div>
      <div class="go-to-lottery">
        <div>
          您可每日按照指定任务进行完成，完成指定任务后可获得普通奖券，普通奖券可用于合成系统，参加老虎机抽奖。同时也可一键领取全部已完成任务，诚邀您的参与！
        </div>
        <div>
          <!-- <span @click="go_to_draw">前往抽奖</span> -->
          <span @click="all_receive">一键领取</span>
        </div>
      </div>
    </div>
    <!-- 历史记录弹框 -->
    <q-dialog v-model="history_alert">
      <div class="history-dialog" :class="{'isIphoneX':isIphoneX}" @click.self="history_alert = false">
        <div class="history-record">
          <div class="choice-title">
            领取记录
          </div>
          <div class="history-content">
            <div class="blind-table Member-Ranking">
              <p><span>任务</span><span>奖券数量</span><span>领取时间</span></p>
              <p v-for="(v, i) in history_records" :key="i+'vip'">
                <!-- 把列表任务事项有1/2/3点的断行展示 -->
                <span v-if="v.taskName" v-html="v.taskName"></span>
                <span v-else>{{'---'}}</span>

                <span>{{ v.ticketNum }}</span>
              <span>{{new Date(+(v.receiveTime)).Format('yyyy-MM-dd hh:mm')}}</span>
              </p>
            </div>
          </div>
          <data-pager
            class="record-data-pager"
            :total="result_page_info.total"
            :pageSize = 7
            @change="data_page_changed"
          />
          <img class="close"  @click="history_alert = false"  src="activity/yazhou-h5/activity/lucky/close.png"/>
        </div>
      </div>
    </q-dialog>
    <q-dialog v-model="daily_task_success">
      <div class="daily_task_dialog" @click.self="daily_task_success= false">
        <div class="task_success">
          <div class="title">
            {{pop_parameter.ticket >= 0 ? `恭喜您，获得 ${pop_parameter.ticket} 张奖券`: '领取失败，请重新领取奖券'}}
          </div>
          <img :src="pop_parameter.ticket >= 0 ? pop_parameter.success : pop_parameter.failure" alt="">
          <div class="Go-to-lottery" :class="{'failure': pop_parameter.ticket<0}" @click="Reclaim">{{pop_parameter.ticket>=0 ? '我知道了': '重新领取'}}</div>
        </div>
        <img class="colse2" @click="daily_task_success = false"  src="activity/yazhou-h5/activity/colse2.png"/>
      </div>
    </q-dialog>
    <div class="activity-rules">
      <div class="title">
        活动规则
      </div>
      <div class="rules-object">
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span>{{actId == 1 ? '会员每日达成指定任务，即可获得对应数量的普通奖券；' : '会员周期内达成指定任务，即可获得对应数量的普通奖券；'}}</span>
          </div>
        </div>
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span v-if="actId == 1">单笔注单投注<font color="#ff7000">≥100</font>元，方可视为每日任务活动有效注单；</span>
            <span v-else>每日在本场馆累计投注<font color="#ff7000">≥100</font>元，即视为投注1天； </span>
          </div>
        </div>
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span v-if="actId == 1">每日任务数据每<font color="#ff7000">5</font>分钟更新一次，在次日数据将自动清零重新计算，请会员每日提前<font color="#ff7000">30</font>分钟完成任务并领取奖券，避免因数据延迟导致领取失败；</span>
            <span v-else>成长任务数据每小时更新一次，在下个自然周/自然月数据将自动清零重新计算，请会员于自然周期最后一天提前<font color="#ff7000">一小时</font>完成任务并领取奖券，避免因数据延迟导致领取失败；</span>
          </div>
        </div>
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span v-if="actId == 1">每日任务活动有效注单以结算时间为准，且需满足单笔投注金额<font color="#ff7000">≥100</font>元。任何低于欧洲盘<font color="#ff7000">1.5</font>(香港盘<font color="#ff7000">0.5</font>)水位、同场赛事中投注对等盘口、串关注单，皆不予计算；</span>
            <span v-else>成长任务活动有效注单以结算时间为准。任何低于欧洲盘<font color="#ff7000">1.5</font>(香港盘<font color="#ff7000">0.5</font>)水位、同场赛事中投注对等盘口、串关注单，皆不予计算；</span>
          </div>
        </div>
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span>每位有效会员、每个手机号、每个电子邮箱、每张银行卡、每个IP地址、每台电脑使用者，仅可享受1次优惠，如会员使用一切不正当投注、套利等违规行为，我们将保留无限期审核扣回奖金及所产生利润的权利；</span>
          </div>
        </div>
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span>为避免文字理解差异，本场馆保留本活动最终解释权。</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {api_activity} from "project/activity/src/api/index.js";
import data_pager from "project/activity/src/components/data_pager.vue";
import acticity_mixin from "../mixin/acticity_mixin";
import active_count_down from "./active_count_down.vue";
import utils from 'project/activity/src/utils/utils.js';
import themeStore from 'project/activity/src/store/module/theme/theme.js';
import userStore from 'project/activity/src/store/module/user/index.js';

export default {
  name: "daily_betting_payouts",
  props: {
    actId: String | Number ,
    isIphoneX: Boolean ,
    // 对应的活动下标
    activityIndex: String | Number ,
    // 活动开始时间
    inStartTime: {
      type: Number | String,
      default: 0
    },
    // 活动结束时间
    inEndTime: {
      type: Number | String,
      default: 0
    }
  },
  components:{
    'data-pager':data_pager,
    'active_count_down':active_count_down,
  },
  mixins: [acticity_mixin],
  data() {
    return {
      cumulative_betting_list: [
        { name2: '有效投注天数', mBet: '-'},
        { name2: '有效投注额', mBet: '-'},
        { name2: '有效投注额', mBet: '-'},
      ],
      // 任务领取的弹框
      daily_task_success: false,
      // 任务领取弹框 的图片及奖励
      pop_parameter:{failure:"activity/yazhou-h5/activity/failure.png", success: "activity/yazhou-h5/activity/success.png", ticket: -1},
      // 任务列表
      get_everyDay_list: [],
      has_data: true,
      get_data_loading: true,
      // 历史记录
      history_records: [],
      // 历史记录弹框
      history_alert: false,
      // 历史记录分页
      result_page_info:{current: 1, total: 1},
      day_week_month_time_limit_timer: null,
    }
  },
  created() {
    // 5分钟更新一次接口
    this.up_date_Info=0;
    this.timer1_=0;
    let _now = this.format_date_base(new Date().getTime());
    // 时间限制，每日，每周，每月，凌晨 00：00  到 00:05 分之间
    if(_now[3] == '00' && parseInt(_now[4]) < 5){
      this.day_week_month_time_limit()
    }else{
      // 活动列表接口
      this.get_daily_task_list()
      console.log('不是凌晨 00：00 - 00:05  分之间');
    }
    // 箭头00：00：00 点整时，调用初始化方法
    this.listen_for_time()
  },
  mounted() {
    if(this.actId == 2 && this.isDuringDate(this.inStartTime, this.inEndTime) != 1){
      // 如果是 成长任务才调用 用户每周每月的统计 接口
      this.get_task_every_week()
    }
  },
  methods:{
    set_user(args) {
        return userStore.mutations.set_user(args);
    },
    // 数据页变化
    data_page_changed($event) {
      this.show_dialog($event)
    },
    // 调用领取记录接口
    async show_dialog(current) {
      try {
        // 跟产品沟通接口有限频，前端不用做限制
        if(utils.is_time_limit()) return //  防止调用多次接口
        let parameter = {current, size: 7,  actId: this.actId}
        let {code , data} = await api_activity.get_receiveRecord(parameter)
        if(code == 200 && data.records.length > 0) {
          // data.records.map((item, index) => {
          //   if (item.taskName.includes("\n")) {
          //     item.taskName = item.taskName.replace(/\n/g, "<br/>")
          //   }
          // })
          this.history_records = data.records
          this.$set(this.result_page_info, 'total' , +data.total )
          this.history_alert = true
        }else if(['0410505'].includes(code)) { // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
          this.$emit('to_maintenance')
          return
        }else if ( ['0401038'].includes(code) ){
          const msg_nodata_22 = i18n_t('msg.msg_nodata_22')
          this.$toast(msg_nodata_22, 1500)
        }
        else{
          this.$toast('暂无历史记录数据', 1500)
        }
      } catch (err) {
        console.error(err);
      }
    },
    // 箭头00：00：00 点整时，调用初始化方法
    listen_for_time() {
      this.up_date_Info = setInterval(() => {
        this.get_daily_task_list('listen_timer')
      }, this.actId == 1 ? 5*60*1000 :60*60*1000);
    },
    /**
     * 1.日任务重置的0点开始，   00：00~00：05          期间为任务的重置时间，玩家不能够领取奖券，此时前端显示为任务状态为未领取状态；
     * 2.周任务、月任务重置的每一自然周,  00：00~00：05   期间为任务的重置时间，玩家不能够领取奖券，此时前端显示为任务状态为未领取状态；
     * 3.自然月的最后一天的0点开始，  00：00~00：05       期间为任务的重置时间，玩家不能够领取奖券，此时前端显示为任务状态为未领取状态
     * */
    day_week_month_time_limit() {
      // 如果是每日任务，则在凌晨 00:05 以内就开启一个倒计时，到5分钟的时候就拉取一次列表接口并清除倒计时
      if (this.actId == 1) {
        this.get_daily_task_list('listen_timer', 'day_limit')
      }else if(this.actId == 2 && new Date().getDay() == 1){
        this.get_daily_task_list('listen_timer', 'week_limit')
      }else if(this.actId == 2 && new Date().getDate() == 1 == 1){
        this.get_daily_task_list('listen_timer', 'month_limit')
      }
    },
    // 活动列表接口
    async get_daily_task_list(listen_timer, day_week_month_time_limit) {
      try {
        listen_timer ? '' :this.get_data_loading = true
        const param = {
          actId: this.actId
        }
        let {code , data} = await api_activity.get_details(param, {type: 1})
        if(code == 200 && data.length > 0) {
          if(this.isDuringDate(this.inStartTime, this.inEndTime) == 1 || day_week_month_time_limit){
            data.forEach( (v, i)=> {
              v.bonusType = 2
            })
          }
          // data.forEach( (item, index)=> {
          //   // 把列表任务事项有1/2/3点的断行展示
          //     if (item.taskName.includes("\n")) {
          //       item.taskName = item.taskName.replace(/\n/g, "<br/>")
          //     }
          //   })

          this.get_everyDay_list = data
        }else{
          this.get_everyDay_list = []
          this.has_data = false
          if ( ['0401038'].includes(code) ){
          const msg_nodata_22 = i18n_t('msg.msg_nodata_22')
          this.$toast(msg_nodata_22, 1500)
        }
        }
        listen_timer ? '' :this.get_data_loading = false
      } catch (error) {
        console.error(error);
        listen_timer ? '' :this.get_data_loading = false
      }
    },
    // 单个领取 或者 一键领取
    async task_receive_btn(ids) {
      if(this.isDuringDate(this.inStartTime, this.inEndTime) == 3) return this.$toast('任务已结束', 1500)
      try {
        const parameter = {ids, ty: this.actId == 1 ? 0 : 1, rdm : new Date().getTime()}
        let {code , data, msg} = await api_activity.get_task_receive(parameter)
        if(code == 200 && Object.keys(data).length > 0) {
          Object.assign(this.pop_parameter, data)
          this.timer1_ = setTimeout(() => {
            this.get_daily_task_list()
          }, 800)
          if (this.actId == 1) {
            this.$utils.gtag_event_send('H5_edtask_getAwardClick', 'H5_活动', 'H5_每日任务')
          } else {
            this.$utils.gtag_event_send('H5_grtask_getAwardClick', 'H5_活动', 'H5_成长任务')
          }
        } else if(['0410501', '0401003'].includes(code)) {
          this.$toast(msg, 3000)
          this.get_daily_task_list()
          return
        } else if(['0410505'].includes(code)) { // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
          this.$emit('to_maintenance')
          return
        }else{
          this.$toast(msg, 3000)
          this.get_daily_task_list()
          return
        }
        this.daily_task_success = true
      }catch (e){
        console.error(e);
      }
    },
    // 一键领取
    all_receive() {
      let id_list = []
      this.get_everyDay_list.forEach((item) => {
        if(item.bonusType == 3) id_list.push(item.bonusId)
      })
      if(id_list.length <= 0){
        this.$toast('没有可领取的奖项', 1500)
        return
      }
      this.task_receive_btn(id_list.join(","))
    },
    // 前往抽奖
    go_to_draw() {
      this.$emit('to_lucky')
    },
    // '前往抽奖': '重新领取'
    Reclaim() {
      // 前往抽奖
      if(this.pop_parameter.ticket >= 0 ) {
        // this.go_to_draw()
        // 前往领取改为 "我知道了" 并且关闭弹窗
        this.daily_task_success = false;
      }
      this.daily_task_success = false
    },
    // 用户每周每月的统计
    async get_task_every_week() {
      let {code , data} = await api_activity.get_task_everyWeek()
      if(code == 200 && Object.keys(data).length > 0) {
        this.cumulative_betting_list.forEach((item,i) => {
          if(i == 0) {
            item.mBet = data.mBetDays
          }else if(i ==1) {
            item.mBet = data.wBillAmount && data.wBillAmount.toFixed(2)
          }else{
            item.mBet = data.mBillAmount && data.mBillAmount.toFixed(2)
          }
        })

      }
    }
  },
  computed: {
    get_user() {
        return userStore.getters.get_user();
    },
    get_theme() {
        return themeStore.getters.get_theme();
    },
  },
  destroyed() {
    clearInterval(this.up_date_Info);
    clearTimeout(this.timer1_)
  }
}
</script>

<style lang="scss" scoped>
@import "../mixin/activity.scss";

.table {
  width: 3.2rem;
  min-height: 1.5rem;
  margin: 0.25rem auto 0;
  border-radius: 0.1rem;
  overflow: hidden;
  font-size: 0.12rem;
  position: relative;
  border-bottom: unset;

  p {
    display: flex;
    margin: 0;
    min-height: 0.6rem;
    border-bottom: 1px solid #d8d8d8;

    > span {
      &:first-child {
        flex: 1.5;
        padding: 0 0.15rem;
        border-left: 1px solid #d8d8d8;
      }

      &:last-child {
        flex: 1.1;
        padding: 0 0.15rem;
        border-right: 1px solid #d8d8d8;
      }
    }

    span {
      text-align: center;
      flex: 1;
      position: relative;
      border-right: 1px solid #d8d8d8;
      display: flex;
      align-items: center;
      justify-content: center;

      &.ticket-num {
        font-family: dinMedium;
        font-size: 0.16rem;
        color: #666666;
      }

      &:last-child {
        > div {
          &.receive {
            padding: 0 0.15rem;
            height: 0.32rem;
            background: #F5F6FA;
            background-image: linear-gradient(179deg, #FFB001 0%, #FF7000 100%);
            border: 1px solid #FFFFFF;
            color: #FFFFFF;
            border-radius: 0.2rem;

            &.Ash-grey {
              background: grey;
              opacity: 0.5;
            }
          }
        }
      }

      &.special-Header {
        line-height: 1 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        > div {
          margin-bottom: 0.03rem;
        }
      }

      &.completed {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        > div {
          font-family: PingFangSC-Regular;
          color: #FF7000;
        }
      }
    }

    &:nth-child(1) {
      background: #e7eaee;

      color: #fff;
      line-height: 0.5rem;
      border: none;

      span {
        border: 0 none !important;
        font-family: PingFangSC-Medium;
        font-size: 0.14rem;
        color: #333;
      }
    }

    &.last-row {
      border-radius: 0 0 0.1rem 0.1rem;

      span {
        &:first-child {
          border-radius: 0 0 0 0.1rem;
        }

        &:last-child {
          border-radius: 0 0 0.1rem 0;
        }
      }
    }
  }
}
.theme01_y0, .theme02_y0 {
  .Ash-grey {
    opacity: 1 !important;
  }
  .table {
    p {
      span {
        &:last-child {
          > div {
            &.receive {
              background: linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%), #F5F6FA;
              border: 1px solid #FFFFFF;
            }
          }
        }
      }
    }
  }
}

.to-be-completed {
  color: #999999;
}

.activities-content {
  margin-bottom: 0.4rem;
  padding-bottom: 0.3rem;
}

.f-minutes-update {
  margin: 0.1rem auto;
  text-align: center;
  color: #FF0602;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.12rem;

  i {
    display: block;
    width: 0.04rem;
    height: 0.04rem;
    background-color: #FF0602;
    border-radius: 50%;
    margin-right: 0.04rem;
  }
}

.collection-record {
  margin: 0 auto 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 0.36rem;
  font-family: PingFangSC-Medium;
  font-size: 0.14rem;
  font-weight: bold;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  line-height: 0.14rem;
  background-image: linear-gradient(0deg, #F7F8F8 0%, #E3E3E3 31%, #FFFFFF 100%);
  border: 1px solid #D3D3D3;
  border-radius: 0.3rem;
}

.cumulative-bet-amount {
  width: 3.2rem;
  padding: 0.1rem 0;
  margin: 0.2rem auto 0;
  background: #FFFFFF;
  background-image: linear-gradient(180deg, #FFF5EB 0%, #FFE3CA 100%);
  border: 1px solid #FEC59E;
  border-radius: 0.1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    border-right: 1px solid #FEC59E;

    &.not_first_div {
      flex: 1.5;
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 0.12rem;
      color: #333333;
      text-align: center;
      line-height: 0.16rem;
      font-weight: bold;
    }

    > div {
      span {
        font-family: dinMedium;
        text-align: left;
        line-height: 0.3rem;

        &:nth-child(1) {
          font-size: 0.18rem;
          color: #FF7000;
          margin-right: 0.05rem;
        }
      }
    }

    &:nth-child(3) {
      border-right: none;
    }
  }
}

.history-content {
height: 4rem;
  overflow: hidden;
  overflow-y: auto;
  
  .blind-table {
    > p {
      > span {
        &:nth-child(1) {
          flex: 1.6;
          padding: 0 0.08rem;
        }

        &:last-child {
          border-left: unset !important;
        }
      }

      &:first-child {
        > span {
          border-right: unset;
        }
      }
    }
  }
}
// 分页条样式
::v-deep .pagination-wrapper {
    height: 0.4rem;
    align-items: center;
}
.daily_task_dialog {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: unset;
  box-shadow: unset;
}

.task_success {
  max-height: unset !important;
  width: 2.8rem;
  height: 2.8rem;
  position: relative;
  z-index: -1;
  background: var(--q-color-com-img-bg-160) no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;
    color: #E69C41;
    text-align: right;
    margin-bottom: 0.14rem;
  }

  .Go-to-lottery {
    margin-top: 0.16rem;
    width: 1.4rem;
    height: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(180deg, #FBB259 0%, #FF773F 99%);
    border: 1px solid #FFFFFF;
    box-shadow: 0 1px 2px 0 rgba(96, 96, 96, 0.17);
    border-radius: 0.23rem;
    font-family: PingFangSC-Regular;
    font-size: 0.12rem;
    color: #FFFFFF;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

    &.failure {
      background-image: linear-gradient(180deg, #FFE8BC 0%, #E79B40 99%);
    }
  }
}

.colse2 {
  width: 0.24rem;
  height: 0.24rem;
  position: absolute;
  bottom: 0.8rem;
  left: 50%;
  transform: translate(-50%);
}
</style>
