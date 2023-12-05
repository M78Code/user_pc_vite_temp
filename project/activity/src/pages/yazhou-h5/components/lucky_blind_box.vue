<!--
 * @Author: ledron
 * @Date: 2021-08-25
 * @Description: 幸运盲盒活动
-->
<template>
  <div class="lucky_blind_box">
    <!-- 图片预加载   -->
    <div style="display: none">
      <img  src="activity/yazhou-h5/activity/lucky/gift1.png" alt="">
      <img  src="activity/yazhou-h5/activity/lucky/gift2.png" alt="">
      <img  src="activity/yazhou-h5/activity/lucky/gift3.png" alt="">
    </div>
    <!-- 抽奖按钮点击时loading   -->
    <div v-show="lottery_loading" class="fullscreen">
      <div class="fullscreen_loading">
        <span>抽盒中......</span>
        <img alt class="loading-static-animation" src="public/yazhou-h5/image/bw3/svg/loading-more.svg"/>
      </div>
    </div>
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
          <span style="width: 1.91rem">活动内容：</span>
          <span>本场馆内满足任务条件的会员可以获得奖券，消耗奖券可以兑换不同等级的盲盒，并抽取盲盒的随机奖金，每个盲盒100%中奖，让您的奖金收获不停刺激不断！</span>
        </div>
      </div>
    </div>
    <div class="scroll-to-view"></div>
    <div class="activity-rules activities-content">
      <div class="title">
        活动内容
      </div>
      <div class="reward-list">
        <div class="reward-list-title" v-show="get_user.activityList[activityIndex].period != 3">
          每天
          <span>12:00:00</span>
          开抢
        </div>
        <div class="wait-for-u">
          <img class="line-left" src="activity/yazhou-h5/activity/lucky/line-left.png" alt="">
          <span>大奖等您拿</span>
          <img class="line-right" src="activity/yazhou-h5/activity/lucky/line-right.png" alt="">
        </div>
        <div class="Gift-box">
          <div v-for="(item, i ) in lihe_list" :key="i+'i'" @click="lihe_list_click(item, i, 'frequent_clicks')">
            <img :class="{'animate-bounce-up': lihe_index == i, ' opacity_': lihe_index != i}" :src="item.url" alt="" style="z-index:unset;">
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="Lucky_blind_box_content">
          <template v-if="get_user.activityList[activityIndex].period == 1">
            <active_count_down :endTime='inStartTime'></active_count_down>
            <div class="juli">距离活动开始还有</div>
            <div class="btn" >
              敬请期待
            </div>
          </template>
          <template v-if="lihe_name.num_ber <= 0 && get_user.activityList[activityIndex].period == 2  && !show_nextbox_countdown">
            <div class="juli">距离下一次盲盒派发还有</div>
            <active_count_down :endTime='+nextTimeToRelease' :timer="true"></active_count_down>
          </template>
          <template v-if="lihe_name.num_ber <= 0 && get_user.activityList[activityIndex].period == 2  && show_nextbox_countdown">
            <div class="juli">距离下一次盲盒派发还有</div>
            <active_count_down :endTime='next_time' @time-end="get_Lucky_box_init('first')"></active_count_down>
          </template>
          <div class="Unboxing-list" v-if="get_user.activityList[activityIndex].period == 2 ">
            <p>
              今日剩余 <span class="red">{{ lihe_name.num_ber || 0 }}</span> 个
              {{lihe_name.name}}
            </p>
            <div class="Token-history">
              <div>
                <img  src="activity/yazhou-h5/activity/diamond.png" alt="">
                <span>奖券:{{ get_Lucky_box.tokenNum || 0}}</span>
              </div>
              <div class="zoom_in"
                   @click="Unpack_gift_box"
                   :class="{
                       'set-gray' : get_Lucky_box.tokenNum == 0 ||
                       lihe_name.num_ber == 0 ||
                       get_user.activityList[activityIndex].period == 3 ||
                       !btn_click || lottery_loading
                     }">
                <span>{{btn_click ? '拆盒1次' :`${count_down_click}s后再次拆盒`}}</span>
                <div class="flex align_items" v-if="btn_click">
                  <img  src="activity/yazhou-h5/activity/diamond1.png" alt="">
                  <span>x {{lihe_name.Number_tokens_consumed}}</span>
                </div>
              </div>
              <div @click="expand_history(1)">
                历史记录
              </div>
            </div>
          </div>
          <div class="end-time" v-if="get_user.activityList[activityIndex].period == 3">
            <p>活动已结束</p>
            <div class="end-btn btn" @click="expand_history(1)">
              历史记录
            </div>
          </div>
          <template v-if="get_user.activityList[activityIndex].period != 1 && lucky_top_50.length > 0">
            <div class="blind-table-title">幸运盲盒拆盒榜</div>
            <div class="blind-table Lucky-Blind-Box">
              <p class="text-white"><span>游戏账号</span><span>奖项</span><span>获奖时间</span></p>
              <div class="Rolling_box" :class="{'table_bg_color': table_background_color == true}">
                <div>
                  <p v-for="(item, i) in lucky_top_50.slice(turn_page, turn_page + 5)" :key="i+'box1'" :class="{'first-line': i == 0}">
                    <span>{{ item.userName || '---' }}</span>
                    <span>{{ item.remark || item.awardStr }}</span>
                    <span>{{item.createTime ? new Date(+(item.createTime)).Format('yyyy-MM-dd hh:mm'): '-----'}}</span>
                  </p>
                </div>
              </div>
            </div>
            <data-pager
              class="record-data-pager"
              :total="top50_page_info.pages"
              :pageSize = 5
              @change="top50_page_changed"
            />
          </template>
          <div class="blind-table-title">盲盒奖品</div>
          <div class="blind-table">
            <p class="text-white"><span>钻石盲盒</span><span>黄金盲盒</span><span>白银盲盒</span></p>
            <div class="blind-box-prizes">
              <div>
                <span v-for="(v,i) in prizes[1]" :key="i+'pid'">{{ v.name }}</span>
              </div>
              <div>
                <span v-for="(v,i) in prizes[2]" :key="i+'rid'">{{ v.name }}</span>
              </div>
              <div>
                <span v-for="(v,i) in prizes[3]" :key="i+'zid'">{{ v.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 历史记录弹框 -->
    <q-dialog v-model="history_alert">
      <div class="history-dialog" :class="{'isIphoneX':isIphoneX}" @click.self="history_alert = false">
        <div class="history-record">
          <div class="choice-title">
            历史记录
          </div>
          <div class="history-content">
            <div class="blind-table Member-Ranking">
              <p class="text-white"><span>盲盒类型</span><span>奖券消耗数</span><span>奖励</span><span>拆盒时间</span></p>
              <p v-for="(v, i) in history_records" :key="i+'vip'">
                <span>{{ v.boxType==1 ? '白银盲盒' : v.boxType==2 ? '黄金盲盒 ' : v.boxType==3 ? '钻石盲盒' : '---' }}</span>
                <span>{{ v.useToken }}</span>
                <span :class="{'ellipsis-2-lines': v.remark}">
                  <div>{{ v.remark || v.awardStr }}</div>
                </span>
                <span>{{new Date(+(v.createTime)).Format('yyyy-MM-dd hh:mm')}}</span>
              </p>
            </div>
          </div>
          <data-pager
            class="record-data-pager"
            :total="result_page_info.pages"
            :pageSize = 7
            @change="data_page_changed"
          />
          <img class="close"  @click="history_alert = false"  src="activity/yazhou-h5/activity/lucky/close.png"/>
        </div>
      </div>
    </q-dialog>
    <!-- 点击获奖的弹框 -->
    <q-dialog v-model="gift_box_alert">
      <div class="gift_box_dialog">
        <img class="gift-img" :src="blind_box_url" alt="">
        <div class="money">
          <span>{{ amount_of_winning }}</span>
          元
        </div>
        <span>恭喜获得</span>
        <div class="gift-btn" v-if="false">
          <p>再拆1次</p>
          <div class="flex align_items justify-center">
            <img  src="activity/yazhou-h5/activity/diamond1.png" alt="">
            <span>x {{lihe_name.Number_tokens_consumed}}</span>
          </div>
        </div>
        <div class="get-more-tokens" v-else @click="gift_box_alert = false">
          我知道了
        </div>
        <img class="close-img" @click="gift_box_alert = false"  src="activity/yazhou-h5/activity/lucky/close.png" alt="">
      </div>
    </q-dialog>
    <!--活动规则-->
    <div class="activity-rules">
      <div class="title">
        活动规则
      </div>
      <div class="rules-object">
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span>会员可根据完成任务获得的奖券数量，抽取三种不同等级盲盒，每种盲盒皆为100%中奖；</span>
          </div>
        </div>
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span>盲盒数量将于每日12:00、15:00、18:00、21:00、00:00添加数量，先抽先得，如抽完后需待下次更新时间；</span>
          </div>
        </div>
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span>盲盒奖励实时派发，仅需在本场馆完成1倍流水即可出款；</span>
          </div>
        </div>
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span>本活动仅计算有效注单，且所有注单皆以结算时间为准，任何低于欧洲盘<font color="#ff7000">1.5</font>或香港盘<font color="#ff7000">0.5</font>水位、同一赛事中同时投注对等盘口、提前结算以及串关注单，将不予计算（不包含串关注单）；</span>
          </div>
        </div>
        <div>
          <img :src="(`${ $g_image_preffix }/activity/yazhou-h5/activity/smaller${get_theme.includes('y0') ? '_y0' : ''}.png`)" alt="">
          <div>
            <span>每位有效会员、每个手机号、每个电子邮箱、每张银行卡、每个IP地址、每台电脑使用者，在活动期间仅可享受1次优惠，如会员使用一切不正当投注、套利等违规行为，我们将保留无限期审核扣回彩金及所产生利润的权利；</span>
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
/**
 *  get_user.activityList[activityIndex].period  1 未开始  2 进行中   3 已结束
 */
import {api_activity} from "project/activity/src/api/index.js";
let lh1 =  "activity/yazhou-h5/activity/lucky/lh1.png";
let lh2 =  "activity/yazhou-h5/activity/lucky/lh2.png";
let lh3 =  "activity/yazhou-h5/activity/lucky/lh3.png";
let gift1 =  "activity/yazhou-h5/activity/lucky/gift1.png";
let gift2 =  "activity/yazhou-h5/activity/lucky/gift2.png";
let gift3 =  "activity/yazhou-h5/activity/lucky/gift3.png";

import acticity_mixin from "../mixin/acticity_mixin";
import data_pager from "project/activity/src/components/data_pager.vue";
import active_count_down from "./active_count_down.vue";
import common from "project/activity/src/mixins/module/common.js";
import formartmixin from 'project/activity/src/mixins/module/formartmixin.js';
import utils from 'project/activity/src/utils/utils.js';
import themeStore from 'project/activity/src/store/module/theme/theme.js';
import userStore from 'project/activity/src/store/module/user/index.js';

export default {
  name: "lucky_blind_box",
  mixins: [acticity_mixin, common, formartmixin],
  props: {
    activityIndex: {
      type: Number | String,
      default: 2
    },
    // 活动开始时间
    inStartTime: {
      type: Number | String,
      default: 0
    },
    // 活动结束时间
    inEndTime: {
      type: Number | String,
      default: 0
    },
    isIphoneX: Boolean
  },
  components:{
    'data-pager':data_pager,
    'active_count_down':active_count_down,
  },
  data() {
    return {
      lihe_list: [
        {name: '钻石盲盒', url: lh1},
        {name: '黄金盲盒', url: lh2},
        {name: '白银盲盒', url: lh3},
      ],
      // 当前选中的 礼盒
      lihe_index: -1,
      // 是否可以点击
      count_down_click: 5,
      btn_click: true,
      table_background_color: false,
      animate:false,
      //消息列表对应的数组
      lucky_top_50:[],
      turn_page:0, // 第几页
      // 历史记录分页
      result_page_info:{current: 1, pages: 1},
      // 榜单前50记录分页
      top50_page_info:{current: 1, pages: 1},
      // 历史记录
      history_records: [],
      history_alert: false,
      // 获奖的弹框
      gift_box_alert: false,
      // 礼盒初始状态
      get_Lucky_box: {
        tokenNum: '--',
        dailyLuckyBoxNumber:{diamonds:0, golds:0, silvers:0},
        timeRemaining:[]
      },
      prizes:{
        1:[],
        2:[],
        3:[]
      },
      lihe_name: {
        name: '白银盲盒',
        num_ber: '--', // 当前还剩下多少个礼盒
        box_type: 2,// 礼盒的类型
        Number_tokens_consumed: 12, // 拆礼盒消耗的奖券数量
      },
      // 中奖弹框的金额
      amount_of_winning: 0,
      gift_img: { gift1, gift2, gift3},
      // 当前时间，只要是 凌晨00:00:00 就刷新当前的初始化数据
      current_time: '',
      next_time: 0,
      lottery_loading: false,
      nextTimeToRelease: null, // 下一次派发盲盒的时间
      nextOpenTime: {
        h: 0,
        m: 0,
        s: 0
      },
      $g_image_preffix: ''
    }
  },
  computed: {
    get_user() {
        return userStore.getters.get_user();
    },
    get_theme() {
        return themeStore.getters.get_theme();
    },
    // 展示哪张背景图
    blind_box_url() {
      if (this.lihe_name.box_type == 3){
        return this.gift_img.gift1
      }else if (this.lihe_name.box_type == 2){
        return this.gift_img.gift2
      }else{
        return this.gift_img.gift3
      }
    },
    // 判断展示哪一个倒计时
    show_nextbox_countdown() {
      // 如果是有配置 盲盒距离下次派发时间的话，就显示
      if(this.get_Lucky_box.timeRemaining.length > 0 && this.get_Lucky_box.timeRemaining[this.lihe_name.box_type - 1].showRate > 0){
        this.next_time = (+new Date().getTime() + +this.get_Lucky_box.timeRemaining[this.lihe_name.box_type - 1].showRate)
        return true
      }else{
        return false
      }
    }
  },
  created() {
    // 延时器
    this.timer1_btn = 0;
    this.up_date_Info = 0;

    // 首次加载 盲盒数量 接口
    this.get_Lucky_box_init('first')
    // 榜单前50名统计 接口
    this.get_lucky_box_top50()
    // 箭头00：00：00 点整时，调用初始化方法
    this.listen_for_time()

    // 获取服务器时间-----初始化倒计时
    let stime = this.get_now_server();
    let now = this.utc_to_gmt_no_8_ms2_(stime);
    // 判断倒计时是到中午12点还是晚上12点
    const curHours = now.h;
    this.nextTimeToRelease = new Date(new Date(`${now.y}-${now.m}-${now.d} ${now.h}:${now.mm}:${now.s}`).getTime()+(curHours <= 11 ? 12*60*60*1000-1 : (23 - curHours + 12)*60*60*1000-1)).getTime();
  },
  methods: {
    // 数据页变化
    data_page_changed($event){
      this.expand_history($event)
    },
    // 数据页变化
    top50_page_changed($event){
      this.turn_page = ($event - 1) * 5
    },
    // 箭头00：00：00 点整时，调用初始化方法
    listen_for_time() {
      this.up_date_Info = setInterval(() => {
        this.current_time = new Date().Format('hh:mm:ss')
        if(this.current_time == '12:00:00'){
          this.get_Lucky_box_init('first')
          clearInterval(this.up_date_Info);
        }
      }, 1000);
    },
    // 礼盒切换数量变更
    switch_method(i) {
      // diamonds 钻石盲盒 golds 黄金盲盒 silvers 白银盲盒
      if(i == 0){
        this.lihe_name.num_ber = this.get_Lucky_box.dailyLuckyBoxNumber.diamonds
        this.lihe_name.box_type = 3
        this.lihe_name.Number_tokens_consumed = this.get_Lucky_box.boxToken[2]
      }else if(i ==1){
        this.lihe_name.num_ber = this.get_Lucky_box.dailyLuckyBoxNumber.golds
        this.lihe_name.box_type = 2
        this.lihe_name.Number_tokens_consumed = this.get_Lucky_box.boxToken[1]
      }else if(i ==2){
        this.lihe_name.num_ber = this.get_Lucky_box.dailyLuckyBoxNumber.silvers
        this.lihe_name.box_type = 1
        this.lihe_name.Number_tokens_consumed = this.get_Lucky_box.boxToken[0]
      }
      // // 获取服务器时间
      let stime = this.get_now_server();
      let now = this.utc_to_gmt_no_8_ms2_(stime);
      // 判断倒计时是到中午12点还是晚上12点
      const curHours = now.h;
      this.nextTimeToRelease = new Date(new Date(`${now.y}-${now.m}-${now.d} ${now.h}:${now.mm}:${now.s}`).getTime()+(curHours <= 11 ? 12*60*60*1000-1 : (23 - curHours + 12)*60*60*1000-1)).getTime();
      this.$forceUpdate()
    },
    // 点击礼盒切换
    lihe_list_click(item, i, frequent_clicks){
      if(utils.is_time_limit() || (this.lihe_index == i && frequent_clicks)) return //  防止调用多次接口
      this.lihe_index = i
      this.lihe_name.name = item.name
      if(!this.get_Lucky_box) return
      this.switch_method(i)
      this.get_Lucky_box_init()
    },
    // 初始化数据获取奖券
    async get_Lucky_box_init(Unboxing) {
      try {
        // diamonds 钻石盲盒 golds 黄金盲盒 silvers 白银盲盒
        let {code , data} = await api_activity.get_Lucky_box_index_param({userId: this.get_user.userId})
        if(code == 200 && Object.keys(data).length > 0) {
          // 处理下个盲盒的剩下时间
          let blind_box_time = []
          data.timeRemaining.forEach( (item,i)=> {
            if(item.boxType == 1){
              blind_box_time[0] = item
            }else if(item.boxType == 2) {
              blind_box_time[1] = item
            }else if(item.boxType == 3) {
              blind_box_time[2] = item
            }
          })
          data.timeRemaining = blind_box_time
          this.get_Lucky_box = data
          this.switch_method(this.lihe_index)
          // 如果是刚刚进页面时，首次加载
          if(Unboxing == 'first'){
            // 首次加载展示 盲盒奖品的数据
            this.prizes = {1:[], 2:[], 3:[]}
            data.lucky.forEach((item, i)=>{
              item.award = parseInt(item.award/100)
              if(item.boxType == 3) {
                this.prizes[1].push(item)
              }else if(item.boxType == 2) {
                this.prizes[2].push(item)
              }else if(item.boxType == 1) {
                this.prizes[3].push(item)
              }
            })
            // 首次加载显示哪个盲盒的 处理
            if(data.tokenNum >=this.get_Lucky_box.boxToken[2]){
              this.lihe_list_click(this.lihe_list[0],0)
            }else if(data.tokenNum>=this.get_Lucky_box.boxToken[1] && data.tokenNum<this.get_Lucky_box.boxToken[2]){
              this.lihe_list_click(this.lihe_list[1],1)
            }else{
              this.lihe_list_click(this.lihe_list[2],2)
            }
          }
        }
        else if ( ['0401038'].includes(code) ){
          const msg_nodata_22 = this.$root.$t('msg.msg_nodata_22')
          this.$toast(msg_nodata_22, 1500)
        }
      } catch (err) {
        console.error(err);
      }
    },
    // 拆礼盒，调用礼盒接口
    async Unpack_gift_box() {
      if(this.btn_click){
        if(this.get_user.activityList[this.activityIndex].period == 3) return this.$toast('活动已结束', 1000)
        if(this.lihe_name.num_ber <= 0) return this.$toast('盲盒已被抢完', 1000)
        if(this.get_Lucky_box.tokenNum < this.lihe_name.Number_tokens_consumed) {this.gift_box_alert = false; return this.$toast('奖券不足', 1000)}
        if(utils.is_time_limit() || this.lottery_loading) return //  防止调用多次接口
        try {
          this.lottery_loading = true
          // boxType	盲盒类型，1：白银盲盒  2：黄金盲盒  3：钻石盲盒
          let {code , data, msg} = await api_activity.get_open_lucky_box1({boxType: this.lihe_name.box_type})
          if(code == 200 && Object.keys(data).length > 0) {
            // costTokenNum 消耗奖券数
            this.amount_of_winning = data.award
            this.gift_box_alert = true
            this.get_Lucky_box_init()
            this.$utils.gtag_event_send('H5_luckybox_getAwardClick', 'H5_活动', 'H5_幸运盲盒', parseInt(data.award))
          } else if(['0410505'].includes(code)) { // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
            this.$emit('to_maintenance')
            return
          }else {
            this.$toast(msg, 1500)
            this.gift_box_alert = false
            this.get_Lucky_box_init()
          }
          this.lottery_loading = false
          this.btn_click = false
          this.timer1_btn = setInterval( () => {
            this.count_down_click--
            if(this.count_down_click == '-1'){
              this.count_down_click = 5
              this.btn_click = true
              clearInterval(this.timer1_btn)
            }
          }, 1000)
        } catch (err) {
          console.error(err);
          this.lottery_loading = false
          if (err.type == "openbox_cencel") {
            this.$toast(err.message, 1500)
          }else if(err.type == 'activity_page_destroyed'){
          } else {
            this.$toast("网络异常，请重新抽取", 1500)
          }
        }
      }else{
        return this.$toast('操作过于频繁，请稍后再试', 2000)
      }
    },
    // 历史记录接口
    async expand_history( cpn_number ) {
      //  防止调用多次接口
      if(utils.is_time_limit()) return
      try {
        // 服务器时间
        // 查询最近90天的历史记录
        let stime = this.get_now_server();
        let nineDaysAgo = new Date(stime - 1000 * 60 * 60 * 24 * 90);
        nineDaysAgo = new Date(`${nineDaysAgo.getFullYear()}-${nineDaysAgo.getMonth() + 1}-${nineDaysAgo.getDate()}`);
        let parameter = {
          userId: this.get_user.userId,
          cps: 7,
          cpn: cpn_number,
          inEndTime: this.inEndTime ? this.inEndTime : null,
          activityId: this.get_user.activityList[this.activityIndex].activityId,
          inStartTime: nineDaysAgo.getTime()
        }
        let {code , data} = await api_activity.get_lucky_box_history(parameter)
        if(code == 200 && data.records.length > 0) {
          this.history_records = data.records
          this.$set(this.result_page_info, 'pages' , +data.total )
          this.history_alert = true
        }else if ( ['0401038'].includes(code) ){
          const msg_nodata_22 = this.$root.$t('msg.msg_nodata_22')
          this.$toast(msg_nodata_22, 1500)
        }
        else{
          this.$toast('暂无历史记录数据', 1500)
        }
      } catch (err) {
        console.error(err);
      }
    },
    // 排行榜前五十
    async get_lucky_box_top50() {
      try {
        let parameter = {
          from: 'activity_task',
          inStartTime: this.inStartTime ? this.inStartTime : null,
          inEndTime: (this.get_user.activityList[this.activityIndex].period != 3 && this.inEndTime) ? this.inEndTime : null,
          activityId: this.get_user.activityList[this.activityIndex].activityId
        }
        let {code , data} = await api_activity.get_lucky_box_top50(parameter)
        if(code == 200 && Object.keys(data).length > 0) {
          this.lucky_top_50 = data
          this.$set(this.top50_page_info, 'pages' , +data.length )
        }
      } catch (err) {
        console.error(err);
      }
    },
    /**
     * 获取服务器时间的年月日时分秒
     */
    utc_to_gmt_no_8_ms2_(value) {
      if (!value) { return '' }
      let time = this.$utils.format_time_zone_time(parseInt(value));
      let [y, m, d, h, mm, s] = this.format_date_base(time)
      return {y, m, d, h, mm, s}
    }
  },
  destroyed() {
    clearInterval(this.up_date_Info);
    this.up_date_Info = null;

    clearInterval(this.timer1_btn);
    this.timer1_btn = null;

    for (const key in this.$data) {
      this.$data[key] = null
    }
    // 抽奖的过程中取消上一次请求
    window.vue.blind_box_lottery_cancel && window.vue.blind_box_lottery_cancel()
  }
}
</script>

<style lang="scss" scoped>
@import "../mixin/activity.scss";

.activities-content {
  padding: 0 0 0.24rem;
  box-shadow: 0 2px 10px 0 #c2d0e1;

  .reward-list {
    .reward-list-title {
      font-family: SourceHanSansSC-Medium;
      font-size: 0.28rem;
      color: #666666;
      text-align: center;
      line-height: 0.3rem;

      > span {
        font-family: dinMedium;
        color: #ff7000;
      }
    }

    .wait-for-u {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 0.05rem;

      img {
        width: 0.23rem;
        height: 0.06rem;
      }

      > span {
        margin: 0 0.07rem;
        font-family: SourceHanSansSC-Medium;
        font-size: 0.2rem;
        color: #5e637e;
        text-align: center;
        line-height: 0.3rem;
      }
    }

    .Gift-box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0.3rem auto;

      > div {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
          width: 0.93rem;
          height: 0.74rem;
        }

        span {
          margin-top: 0.1rem;
        }
      }
    }

    .Lucky_blind_box_content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 0.18rem;

      .Unboxing-list {
        > p {
          margin: 0.1rem 0;
          font-family: SourceHanSansSC-Medium;
          font-size: 16px;
          color: #5e637e;
          text-align: center;
          line-height: 30px;

          .red {
            color: red;
          }
        }

        .Token-history {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 0.1rem;

          > div {
            width: 1rem;
            height: 0.36rem;
            color: #666666;
            border-radius: 0.3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: dinMedium;
            position: relative;
            border: solid 0.01rem #ffffff;

            &:after {
              width: calc(100% + 4px);
              height: calc(100% + 4px);
              content: " ";
              display: block;
              position: absolute;
              top: -0.02rem;
              left: -0.02rem;
              border-radius: 0.3rem;
            }

            &:nth-child(1) {
              color: #ff7000;
              background-image: linear-gradient(
                180deg,
                #ffeddc 0%,
                #febf95 99%
              );

              img {
                width: 0.18rem;
                height: 0.18rem;
                margin-right: 0.05rem;
              }

              &:after {
                border: solid 0.01rem #fec59e;
              }
            }

            &:nth-child(2) {
              flex-direction: column;
              background-image: linear-gradient(
                180deg,
                #fbb259 0%,
                #ff773f 100%
              );
              margin: 0 0.04rem;
              font-family: SourceHanSansSC-Medium;
              color: #ffffff;
              text-align: center;

              &:after {
                border: solid 0.01rem #fec59e;
                left: -0.02rem;
              }

              &.set-gray {
                opacity: 0.5;
              }

              img {
                width: 0.18rem;
                height: 0.14rem;
                margin-right: 0.05rem;
              }
            }

            &:nth-child(3) {
              background-image: linear-gradient(
                180deg,
                #ffffff 0%,
                #e7e7e7 49%,
                #ffffff 100%
              );
              box-shadow: 0 1px 0.02rem 0 rgba(96, 96, 96, 0.17);
              font-family: SourceHanSansSC-Medium;
              text-align: center;
              color: #333333;

              &:after {
                border: solid 0.01rem #d3d3d3;
              }
            }
          }
        }
      }

      .blind-table-title {
        margin: 0.3rem auto 0.16rem;
        padding: 0 0.1rem;
        width: 1.4rem;
        height: 0.3rem;
        background-image: var(--q-color-com-img-bg-164);
        background-size: cover;
        background-repeat: no-repeat;
        font-family: SourceHanSansSC-Medium;
        font-size: 0.16rem;
        color: #ffffff;
        text-align: center;
        line-height: 0.18rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .blind-table {
        p {
          &:not(:first-child) {
            span {
              font-family: SourceHanSansSC-Regular;
              color: #5e637e;
            }

            &:nth-child(odd) {
              background: #fcfcfc;
            }
          }
        }

        > .blind-box-prizes {
          display: flex;

          > div {
            flex: 1;
            background: unset;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-content: center;
            border-right: 0.01rem solid #e4e4e4;

            > span {
              width: 100%;
              height: 0.6rem;
              line-height: 0.6rem;
              display: flex;
              justify-content: center;
              align-content: center;
              text-align: center;
              border-bottom: 0.01rem solid #e4e4e4;

              &:last-child {
                border-bottom: unset;
              }
            }

            &:last-child {
              border-right: unset;
            }
          }
        }

        &.Lucky-Blind-Box {
          margin-bottom: 0.15rem;
          background: #e7eaee;

          .Rolling_box {
            max-height: 2.99rem;
            overflow: hidden;
            transition: margin 0.5s;

            p {
              &:first-child {
                background: unset;

                span {
                  color: #5e637e;
                  font-family: SourceHanSansSC-Regular;
                }
              }

              &.first-line {
                height: 0.6rem;
                font-size: 0.12rem;
              }

              &:nth-child(odd) {
                background: #fcfcfc;
                border-radius: unset;
              }
            }

            &.table_bg_color {
              p {
                font-family: unset;

                &:nth-child(even) {
                  background: #fcfcfc !important;
                }

                &:nth-child(odd) {
                  background: unset !important;
                }
              }
            }
          }
        }
      }
    }
  }
}

.juli {
  font-family: SourceHanSansSC-Regular;
  font-size: 0.12rem;
  color: #5e637e;
  text-align: center;
  line-height: 0.14rem;
  margin-bottom: 0.1rem;
}

.CountdownTitle {
  padding: 0 0.1rem;
  margin: 0 auto 0.1rem;
  height: 0.32rem;
  line-height: 35px;
  background-image: linear-gradient(
    180deg,
    #ffffff 0%,
    #e7e7e7 49%,
    #ffffff 100%
  );
  border: 1px solid #ffffff;
  box-shadow: 0 1px 2px 0 rgba(96, 96, 96, 0.17);
  border-radius: 0.33rem;
  font-size: 0.12rem;
  color: #666666;
  display: flex;
  justify-content: center;

  ::v-deep span {
    font-family: dinMedium;
    font-size: 0.18rem;
    color: #ff7000;
    margin: 0 0.05rem 0 0.1rem;
  }
}

.btn {
  width: 1rem;
  height: 0.36rem;
  margin-top: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.12rem;
  color: #ffffff;
  background: #f5f6fa;
  background-image: linear-gradient(179deg, #ffb001 0%, #ff7000 100%);
  border-radius: 0.3rem;
  position: relative;

  &:after {
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    content: " ";
    display: block;
    position: absolute;
    top: -0.02rem;
    left: -0.02rem;
    border-radius: 0.3rem;
    border: solid 0.01rem #d3d3d3;
  }
}

.gift_box_dialog {
  width: 3.45rem;
  height: 4.2rem;
  background: var(--q-color-com-img-bg-165) no-repeat;
  background-size: 100% 100%;
  box-shadow: 0 0.06rem 0.15rem 0 rgba(0, 0, 0, 0.11);
  border-radius: 0.2rem;
  overflow: unset;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: unset;

  .gift-img {
    min-width: 2.61rem;
    min-height: 1.8rem;
    margin: 0.27rem auto 0;
    width: 80%;
  }

  .money {
    margin-top: 0.2rem;

    > span {
      font-family: dinMedium;
      font-size: 0.48rem;
      color: #e93333;
      text-align: center;
      line-height: 0.3rem;
    }
  }

  > span {
    font-family: SourceHanSansSC-Medium;
    font-size: 0.12rem;
    color: #5e637e;
    text-align: center;
    line-height: 0.3rem;
    margin-bottom: 0.2rem;
  }

  .close-img {
    position: absolute;
    bottom: -0.66rem;
    width: 0.48rem;
    height: 0.48rem;
  }

  .get-more-tokens {
    width: 1.57rem;
    height: 0.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: SourceHanSansSC-Medium;
    font-size: 0.14rem;
    color: #ffffff;

    background-image: linear-gradient(179deg, #ffb001 0%, #ff7000 100%);
    border-radius: 0.3rem;
    position: relative;

    &:after {
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      content: " ";
      display: block;
      position: absolute;
      top: -0.02rem;
      left: -0.02rem;
      border-radius: 0.3rem;
      border: solid 0.01rem #fec59e;
    }
  }
}

.end-time {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    margin: 0 auto 0.15rem;
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;
    color: #ff7000;
    text-align: center;
  }

  .end-btn {
    width: 1rem;
    height: 0.36rem;
    border-radius: 0.3rem;
    font-family: PingFangSC-Regular;
    font-size: 0.12rem;
    color: #333333;
    text-align: center;
    margin-top: unset;
    background-image: linear-gradient(
      0deg,
      #f7f8f8 0%,
      #e3e3e3 31%,
      #ffffff 100%
    );
  }
}

.opacity_ {
  filter: alpha(opacity=50);
  opacity: 0.5;
  filter: none;
}

/* 定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称 */
@keyframes scaleDraw {
    0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(0.9);
  }
}


.zoom_in {
  // 关键帧名称
  -webkit-animation-name: scaleDraw;
  // 动画的速度曲线
  -webkit-animation-timing-function: ease-in-out;
  // 动画播放的次数
  -webkit-animation-iteration-count: infinite;
  // 动画所花费的时间
  -webkit-animation-duration: 3s;
  line-height: 0.9;
}

.lucky_blind_box:after {
  content: "";
  display: block;
  position: absolute;
  background: var(--q-color-com-img-bg-165) no-repeat;
  background-size: 100% 100%;
  width: 0;
  height: 0;
}

.lucky_blind_box {
  .fullscreen {
    top: 0.4rem;
  }

  .fullscreen_loading {
    position: fixed;
    z-index: 1000;
    width: 0.87rem;
    height: 0.65rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 0.058rem;
    background: #040506;
    border-radius: 0.06rem;

    > span {
      color: #ffffff;
    }

    img {
      width: 0.24rem;
      height: 0.24rem;
      position: absolute;
      left: 36%;
      top: 19%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
