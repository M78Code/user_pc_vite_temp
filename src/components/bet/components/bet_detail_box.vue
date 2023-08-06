<!--
 * @Author: Router
 * @Description: 详情页视频全屏时横屏的投注弹框，只处理常规赛事,类名加bd是为了防止和全局类名冲突
-->
<template>
  <div class="bet-detail-box column" @click.self="pack_up">
    <!-- 投注中的蒙层，所有不能点击 -->
    <div v-if="get_bet_status == 2" class="fullscreen"></div>
    <div class="content yb_px16">
      <hr class="line">

      <!-- 投注单和金额 -->
      <div class="title row justify-between yb_fontsize14">
        <template v-if="get_bet_success">
          <span>{{$root.$t("bet.bet_information")}}</span>
          <img  src="image/wwwassets/bw3/svg/bet_close.svg" alt="" @click.stop="remove">
        </template>
        <template v-else>
          <div class="left">{{$root.$t("bet.bet_record")}}</div>
          <div class="right">
            <span class="yb_fontsize10">{{$root.$t('common.money')}}：</span>
            <span class="money-span">{{get_user.balance | format_money2}}</span>
          </div>
        </template>
      </div>

      <!-- 展示投注项名称、赔率、玩法名称、对阵信息 -->
      <div class="detail row yb_py8" :class="{'detail2':pankou_change == 2}">
        <div class="imgbox yb_mr6 yb_pt4" v-if="!get_bet_success">
          <img  src="image/wwwassets/bw3/svg/bet_xuanx.svg" @click.stop="remove">
        </div>
        <div style="flex:1">
          <!-- 上 -->
          <div class="shang row justify-between items-center">
            <div class="col-9">
              <!-- 投注成功后的展示值用接口返回的 -->
              <template v-if="play_optionname && [3, 6].includes(+get_bet_status)">{{play_optionname}} </template>
              <template v-else>
                <!-- 拜仁慕尼黑 -->
                <span v-show="value_show.value1" class="yb_fontsize14">{{value_show.value1}}</span>
                <!-- +0/0.5 -->
                <span :class="{ 'change':pankou_change == 1}" v-show="value_show.value2" class="yb_px2 yb_py2">{{value_show.value2}}</span>
              </template>
            </div>
            <div class="oddwrap col-3 text-right yb_fontsize16" :class="{'sheng':odds_change == 1,'jiang':odds_change == 2}">
              <i class="yb_mr8" v-if="!get_bet_success"></i>
              <span>
                <template v-if="get_bet_status == 3">
                  {{odds_value2 | format_odds(value_show.csid)}}
                </template>
                <template v-else>{{odds_value}}</template>
              </span>
            </div>
          </div>
          <!-- 中 -->
          <div class="zhong row justify-between items-center">
            <!-- 左 -->
            <span class="col-7">
              <!-- 滚球 -->
              <template v-if="hl0.hmt == 0">{{ $root.$t('bet_record.ing') }}&thinsp;</template>
              <!-- 投注成功后的玩法名称用接口返回的 -->
              <template v-if="playname && [3, 6].includes(+get_bet_status)">{{playname}}</template>
              <template v-else>{{value_show.hps[0].hpnb || value_show.hps[0].hpn}}</template>
              <!-- 基准分 -->
              <template v-if="value_show.csid == 1">&ensp;{{value_show | calc_bifen}}</template>
            </span>
            <!-- 右 -->
            <template v-if="[3, 6, 8].includes(+get_bet_status)">
              <!-- 投注成功 -->
              <span v-if="get_bet_status == 3" class="color1"><img  src="image/wwwassets/bw3/svg/bet_chengg.svg">{{ $root.$t('bet.bet_suc') }}</span>
              <!-- 投注失败 -->
              <span v-if="get_bet_status == 8" class="color3"><img  src="image/wwwassets/bw3/svg/bet_shib.svg">{{ $root.$t('bet.bet_err') }}</span>
              <!-- 提交成功 -->
              <span v-if="get_bet_status == 6" class="color2"><img :src="(`${ $g_image_preffix }/image/wwwassets/bw3/svg/bet_tijiao${get_theme.includes('y0') ? '2' : ''}.svg`)">{{ $root.$t('bet.submitted_successfully') }}</span>
            </template>
            <template v-else-if="pankou_change == 2">
              <!-- 失效 -->
              <span class="invalidation">{{$root.$t('bet.invalidation')}}</span>
            </template>
          </div>
          <!-- 下 -->
          <div class="xia">
            <template v-if="get_bet_success && match_info">{{match_info}}</template>
            <template v-else>{{value_show.mhn}}<span class="q-mx-xs">v</span>{{value_show.man}} {{calc_now_score(value_show)}}</template>
          </div>
        </div>
      </div>

      <template v-if="get_bet_success">
        <!-- 单关投注完成后底部的显示（包括投注失败8，投注成功3，提交成功6） -->
        <div class="bet-after row justify-between yb_fontsize12">
          <p><span>{{ $root.$t('bet_record.bet_max_win') }}:</span><span class="color3 yb_ml8">{{ (max_winmoney / 100).toFixed(2) }}</span></p>
          <p><span>{{ $root.$t('bet.bet_val') }}:</span><span class="color4 yb_ml8">{{ (bet_money / 100).toFixed(2) }}</span></p>
        </div>
      </template>
      <template v-else>
        <!-- 金额输入框 -->
        <div class="ipt yb_mb8 yb_pl8">
          <template v-if="!money && max_money_back">
            <i class="cursor" ref="cursor_line" :style="{opacity:get_bet_status == 1 ? '1':'0'}"></i>
            <span v-if="!money && max_money_back" class="limit-txt yb_fontsize12 ">{{get_money_format()}}</span>

          </template>
          <template v-if="money">
            <span v-if="money" class="yb_fontsize14">{{money | format_money3}}</span>
            <i class="cursor" ref="cursor_line" :style="{opacity:get_bet_status == 1 ? '1':'0'}"></i>
          </template>
        </div>

        <!-- 最高可赢和常用金额 -->
        <div class="win row justify-between yb_mb6">
          <div>{{$root.$t('bet.total_win2')}}
            <span :class="{'color2':money_ok && money}">{{max_win_money | four_five_six_double(2) | format_money2}}</span>
          </div>
          <div class="usedmoney">
            <i class="select" :class="{'select2':get_used_money != 0}" @click="set_used_money(null)"></i>
            {{$root.$t('bet.used_money2')}}
          </div>
        </div>

        <!-- 小键盘 -->
        <div class="keyboard text-center yb_fontsize18 row justify-between items-start" @click.stop="_handleKeyPress($event)">
          <div data-num="1">1</div>
          <div data-num="2">2</div>
          <div data-num="3">3</div>
          <div data-num="4">4</div>
          <div data-num="5">5</div>
          <div data-num=".">.</div>
          <div data-num="6">6</div>
          <div data-num="7">7</div>
          <div data-num="8">8</div>
          <div data-num="9">9</div>
          <div data-num="0">0</div>
          <div data-num="x" class="delkey"><img  src="image/wwwassets/bw3/svg/bd_delete.svg" alt=""></div>
          <p data-num="100" :class="{'shadow-show':prevent_click(100)}">+100</p>
          <p data-num="200" :class="{'shadow-show':prevent_click(200)}">+200</p>
          <p data-num="500" :class="{'shadow-show':prevent_click(500)}">+500</p>
          <p data-num="max">MAX</p>
        </div>

        <!-- 自动接受更好赔率 -->
        <div class="accept yb_my4">
          <i class="select" :class="{'select2':get_is_accept == 2}" @click="set_is_accept"></i>
          <span class="yb_mx4">{{$root.$t("ac_rules.auto")}}</span>
          <img  src="image/wwwassets/bw3/svg/bd_xuanzhong2.svg" alt="" @click="change_accept">
        </div>
      </template>

      <!-- 提示信息 -->
      <div class="tips text-center">
        <span v-if="tips_msg">{{tips_msg}}</span>
      </div>

      <!-- 底部按钮 -->
      <div class="btn-box yb_mb12 row yb_fontsize14">

        <!-- 左边 -->
        <div class="save yb_mr10 row text-center" @click.stop="bet_save" v-if="get_bet_success">
          <span>{{$root.$t('bet.save')}}</span>
        </div>
        <!-- 右边 -->
        <div class="btn row" :class="{'btn2':btn_show == 5}">
          <!-- 投注 -->
          <div v-if="btn_show == 0" @click="submit_order" style="flex:1" class="text-center">
            <p class="yb_fontsize12">{{$root.$t('common.bet')}}</p>
          </div>
          <!-- 投注 有投注项失效后点击接受变化的置灰样式-->
          <div v-if="btn_show == 5">
            <p class="yb_fontsize12">{{$root.$t('common.bet')}}</p>
          </div>
          <!-- 确定 -->
          <div v-if="btn_show == 1" @click="bet_end" style="flex:1" class="text-center">{{$root.$t('common.ok')}}</div>
          <!-- 处理中 -->
          <div v-if="btn_show == 2" class="row justify-center items-center">
            <p class="yb_mr8">{{$root.$t('bet_record.submitting_bet')}} </p>
            <ball-spin />
          </div>
          <!-- 接受变化 -->
          <p v-if="btn_show == 3" @click="agree_change" style="flex:1" class="text-center">{{$root.$t('bet.agree_change')}}</p>
          <!-- 接受变化并投注 -->
          <p v-if="btn_show == 4" @click="submit_order" style="flex:1" class="text-center">{{$root.$t('bet.agree_change2')}}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
  import ballSpin from './ball_spin.vue';
  const money = ref('')//金额
  // const get_bet_status = 1,    //0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,7-有投注项锁盘，8-单关投注失败(bet接口返回200)
  const odds_change = ref('0')    //0-正常，1-赔率升，2-赔率降
  const  pankou_change= ref('0')  //0-盘口未变化，1-盘口值变化，2-盘口失效(封盘和关盘)，3-锁盘
  const money_ok = ref('true')   //金额是否合适
  const min_money = ref('10')  //最低投注金额
  const max_money = ref('0')   //最高可投金额
  const is_watch = ref('true')    //组件渲染时是否监听money
  const max_money_back = ref('false')   //最高可赢金额的接口是否有返回(不管成功与失败)
  const btn_show = ref('0') //右下角显示状态，0投注，1确定（知道了），2注单处理中...,3接受变化  4 接受变化并投注 5 有投注项失效后点击接受变化的置灰样式
  const is_exist_code = ref('false')   //投注后是否返回code码
  const tips_msg = ref('')  // 提示信息
  const need_bet_again = ref('false')  //是否需要重新发起投注
  const check_odds_beforebet2 = this.debounce(this.check_odds_beforebet, 200) //防抖处理

  const max_winmoney = ref('0')   //单关投注成功后接口返回的最高可赢
  const odds_value2 = ref('')  //单关投注成功后接口返回的赔率
  const playname = ref('')   //单关投注成功后接口返回的玩法名称
  const bet_money = ref('0')    //单关投注成功后接口返回的投注金额
  const play_optionname = ref('')   //单关投注成功后接口返回的playOptionName
  const match_info = ref('')   //单关投注成功后接口返回的matchInfo 

  // mixins: [odd_convert, betting, compute_max_win_money],
  // onmounted开始
  /**            onmounted开始              */
  onmounted(()=>{ 
    flicker()
    // 调用合并后接口还是分开调用
    if (this.is_exist_pa_operate()) {
      this.fetch_limit_money_and_odd_info()
    } else {
      //投注前拉取最新的盘口赔率状态(应对socket推送不及时)
      this.check_odds_beforebet().then(() => {
        // 获取最大最小金额
        this.fetch_limit_money();
      })
    }

    // 5秒后没有金额返回就用默认值
    this.timer_5000_2 = setTimeout(() => {
      if (!this.max_money_back) {
        this.max_money = 8888;
        // 获取接口返回的单关最小投注金额
        this.min_money = _.get(this.get_user, 'cvo.single.min', 10)
        if (this.max_money < this.min_money) {
          this.min_money = this.max_money
        }
        this.max_money_back = true;
        this.check_moneyok(this.money)
      }
    }, 5000);
  })
/**            onmounted结束             */



  


</script>
<style lang="scss" scoped>
.bet-detail-box {
  position: fixed;
  width: 2.8rem;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;

  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
}
.line {
  background-color: #ffb001;
  margin: 0 -0.16rem;
  padding-top: 2px;
  border: none;
}
.title {
  color: #ffffff;
  line-height: 0.28rem;
  border-bottom: 0.5px solid #585858;

  img {
    width: 0.12rem;
  }
}
/* ************** 中间区域颜色相关样式 ************** -S */
.money-span {
  color: #ffb001;
}
.shang {
  color: #ffffff;
}
.zhong,
.xia {
  color: #999999;
}
/* ************** 中间区域颜色相关样式 ************** -E */
.imgbox {
  width: 0.14rem;

  img {
    width: 0.14rem;
  }
}
.content {
  background-color: #262626;
}
.detail {
  max-height: 0.76rem;
  overflow-y: auto;
}
.detail2 {
  div,
  span {
    opacity: 0.8;
  }
}
.ipt {
  height: 0.32rem;
  line-height: 0.32rem;
  border: 0.5px solid #ffb001;
  border-radius: 4px;
  color: #fff;
  background-color: #202020;
}
.win {
  color: #999999;
  font-size: 0.11rem;
  background-color: unset !important;
}
.btn-box {
  min-height: 0.3rem;
}
.btn {
  color: #ffffff;
  background-image: linear-gradient(-44deg, #ff9124 0%, #feb001 100%);
  border-radius: 4px;
  overflow: hidden;
  flex: 1;
  justify-content: center;
  align-items: center;
}
.btn2 {
  background-image: linear-gradient(0deg, #bdc5cf 0%, #bdc5cf 100%);
}
.accept {
  color: #999999;

  img {
    height: 0.12rem;
    vertical-align: -0.02rem;
  }
}
.color2 {
  color: #e93d3d;
}
.cursor {
  display: inline-block;
  width: 0.02rem;
  height: 0.16rem;
  background-color: #ffb001;
  margin-bottom: -3px;
}
.cursor2 {
  background-color: transparent;
}
.limit-txt {
  color: #666;
}
.tips {
  color: #e93d3d;
  min-height: 0.16rem;
  line-height: 1;
  font-size: 0.11rem;
  margin-bottom: 2px;
}
.save {
  width: 0.84rem;
  border: 1px solid #999;
  border-radius: 4px;
  color: #999;
  justify-content: center;
  align-items: center;
  line-height: 1;
}
.usedmoney {
  img {
    height: 0.12rem;
    vertical-align: -2px;
  }
}
.oddwrap {
  i {
    display: inline-block;
    width: 0.06rem;
    height: 0.1rem;
  }
}
.sheng {
  color: #ff2a2a;

  i {
    background: var(--q-color-com-img-bg-59) no-repeat center / 100% 100%;
  }
}
.jiang {
  color: #50c042;

  i {
    background: var(--q-color-com-img-bg-60) no-repeat center / 100% 100%;
  }
}
/* ************** 投注成功或者失败后的颜色展示 ************** -S */
.color1 {
  color: #66a754;
}
.color2 {
  color: #ff9124;
}
.color3 {
  color: #ff2a2a;
}
.color4 {
  color: #ffffff;
}
/* ************** 投注成功或者失败后的颜色展示 ************** -E */
[class*="color"] {
  img {
    vertical-align: -1px;
    margin-right: 0.04rem;
  }
}
.invalidation {
  color: #e93d3d;
}
.bet-after {
  color: #999;
}
.change {
  background-color: #ffb001;
  color: #333333;
  border-radius: 2px;
}
.select {
  display: inline-block;
  vertical-align: -0.02rem;
  width: 0.12rem;
  height: 0.12rem;
  background: var(--q-color-com-img-bg-61) no-repeat center /
    contain;
}
.select2 {
  background-image: var(--q-color-com-img-bg-62);
}

/* ************** 小键盘样式 ************** -S */
.keyboard {
  -webkit-overflow-scrolling: touch;
  background-color: #262626;
  color: #ffffff;
  margin: 0 -0.16rem;

  div {
    line-height: 0.32rem;
    flex: 1 1 16%;
    border-right: 1px solid #262626;
    border-bottom: 1px solid #262626;
    background-color: #383838;
    &[data-num="."],
    &[data-num="x"] {
      border-right: none;
    }
  }

  p {
    line-height: 0.32rem;
    flex: 1;
    border-right: 1px solid #262626;
    background-color: #484848;
    &[data-num="max"] {
      border-right: none;
    }
  }

  img {
    height: 0.18rem;
    pointer-events: none;
    transform: translateY(3px);
  }
  .shadow-show {
    background-color: #282828;
    color: #666;
  }

  /* ************** 小键盘样式 ************** -E */
}
</style>
