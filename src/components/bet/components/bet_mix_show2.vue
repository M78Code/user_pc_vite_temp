<!--
 * @Author: Router
 * @Date: 2020-11-10 15:50:46
 * @Description: bw3版虚拟体育投注信息展示组件(单关和串关)
    1001: "虚拟足球",
    1004: "虚拟蓝球",
    1011: "虚拟赛马",
    1002: "虚拟赛狗",
    1010: "虚拟摩托",
    1009: "虚拟泥地摩托",
-->

<template>
  <div class="bet-mix-show2 row justify-start items-center" @click="handleonmousedown" :class="[get_bet_success ? 'yb_px14':'yb_pl12 yb_pr18',{'bet-mix-show3':is_conflict,'bet-mix-show4':pankou_change == 2}]">
    <!-- 失效蒙层 -->
    <div class="locked-shadow" v-if="pankou_change == 2"></div>
    <!-- 计时器 -->
    <timer :mgt="value_show.mgt" class="timer-down" v-if="[1, 5, 7].includes(+get_bet_status) && pankou_change != 2" @time_over="time_over"></timer>

    <div class="yb_mr12 dele-left" v-if="!get_bet_success">
      <!-- 删除按钮 -->
      <img  src="image/wwwassets/bw3/svg/bet_xuanx.svg" @click.stop="remove_">
    </div>
    <div style="flex:1">
      <!-- 上 -->
      <div class="row justify-between items-center yb_fontsize16 content-t yb_mb4 yb_mt8">
        <div class="col-9 row">
          <span class="fw_600" :class="{'dog': [1002, 1010].includes(+value_show.csid),'moto': [1010].includes(+value_show.csid),'nidi-moto':+value_show.csid == 1009}">
            <template v-if="calc_num && [1011, 1002, 1010, 1009].includes(+value_show.csid)">
              <span v-for="(item,index) in calc_num" :key="index" :class="'num' + item" class="num yb_mr4"></span>
            </template>
            <!-- 投注成功后的展示值用接口返回的 -->
            <template v-if="(play_optionname2 || play_optionname) && [3, 6].includes(+get_bet_status) && calc_show2">{{play_optionname2 || play_optionname}} </template>
            <template v-else>
              <span v-show="value_show.value1" class="yb_mr4">{{value_show.value1}}</span><span v-show="calc_show2">{{value_show.value2}}</span>
            </template>
             [{{ hptype }}]
          </span>
        </div>

        <div class="col-3 row justify-end items-center">
          <span class="yb_fontsize22">
            <template v-if="get_bet_status == 3">
              <template v-if="get_bet_list.length == 1">{{odds_value2 | format_odds(value_show.csid)}}</template>
              <template v-else>{{odds_after}}</template>
            </template>
            <template v-else>{{odds_value | format_odds(value_show.csid)}}</template>
          </span>
          <span class="odd-change yb_ml4" v-if="!get_bet_success"></span>
        </div>
      </div>

      <!-- 中 -->
      <div class="row justify-between yb_fontsize14">
        <!-- 球类名称、玩法名称 -->
        <span class="col-8 play-name2">
          <template v-if="value_show.csid">{{'[' + value_show.csna + ']'}}&thinsp;</template>
          <template v-if="(playname || playname2) && [3, 6].includes(+get_bet_status)">{{playname || playname2}}</template>
          <template v-else>{{value_show.hps[0].hpnb || value_show.hps[0].hpn}}</template>
        </span>
        <template v-if="get_bet_success && get_bet_list.length == 1">
          <!-- 投注成功 -->
          <span v-if="get_bet_status == 3" class="color1"><img  src="image/wwwassets/bw3/svg/bet_chengg.svg" class="img0">{{ $root.$t('bet.bet_suc') }}</span>
          <!-- 投注失败 -->
          <span v-if="get_bet_status == 8" class="color3"><img  src="image/wwwassets/bw3/svg/bet_shib.svg" class="img0">{{ $root.$t('bet.bet_err') }}</span>
          <!-- 提交成功 -->
          <span v-if="get_bet_status == 6" class="color2"><img :src="(`${ $g_image_preffix }/image/wwwassets/bw3/svg/bet_tijiao${get_theme.includes('y0') ? '2' : ''}.svg`)" class="img0">{{ $root.$t('bet.submitted_successfully') }}</span>
        </template>
        <template v-else>
          <!-- 失效 -->
          <span v-if="pankou_change == 2" class="invalid-span">{{$root.$t('bet.invalidation')}}</span>
        </template>
      </div>

      <!-- 联赛名、轮次、期号 -->
      <div class="team-info yb_mb4 yb_fontsize14">
        {{value_show.tn}}&nbsp;{{value_show.no}}<span class="yb_ml4 team-info2"  v-if="[1001, 1004].includes(+value_show.csid)">{{value_show.batchNo}}</span>
      </div>

      <!-- 下 -->
      <div class="yb_fontsize14 team-info yb_my4" v-if="[1001, 1004].includes(+value_show.csid)">
        <template>{{value_show.teams[0]}}<span class="q-mx-xs">v</span>{{value_show.teams[1]}}</template>
      </div>
      <div class="yb_px10 half-border-bottom" v-if="!show_border"></div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import odd_convert from "src/public/mixins/odds_conversion/odds_conversion.js";
import betting from 'src/project/mixins/betting/betting.js';
import timer from "src/project/components/bet/timer.vue";

export default {
  name: "bet_mix_show2",
  mixins: [odd_convert, betting],
  props: {
    name_: String,
    order_detail_resp_list: Array,
    odds_value2: String,
    play_optionname2: String,
    playname2: String,
  },
  data() {
    return {
      //get_bet_status: 0,    //0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,7-有投注项锁盘，8-单关投注失败(bet接口返回200)
      odds_change: 0,    //0-正常，1-赔率升，2-赔率降
      pankou_change: 0,  //0-盘口未变化，1-盘口值变化，2-盘口失效(封盘和关盘)，3-锁盘 (虚拟体育不存在盘口值和赔率的变更)
      odds_after: "",   //串关投注成功后的赔率
      playname: "",   //串关投注成功后的玩法名称
      play_optionname: "",   //串关投注成功后的投注项展示值
    };
  },
  components: { timer },
  computed: {
    ...mapGetters(['get_is_conflict', 'get_theme', 'get_bet_status', 'get_bet_list', 'get_bet_obj', 'get_bet_success', 'get_cur_odd']),
    is_conflict() {   //赛事id或者球员id是否冲突
      return this.get_is_conflict([this.value_show.maid, this.value_show.mhid])
    },
    bet_obj_ov() {   //将赔率映射为计算属性
      return this.get_bet_obj[this.name_].bs.hps[0].hl[0].ol[0].ov;
    },
    bet_obj_mhs() {   //将赛事级别盘口状态映射为计算属性
      return this.get_bet_obj[this.name_].bs.mhs;
    },
    bet_obj_hs() {   //将盘口状态映射为计算属性
      return this.get_bet_obj[this.name_].bs.hps[0].hl[0].hs;
    },
    bet_obj_os() {   //将投注项状态状态映射为计算属性
      return this.get_bet_obj[this.name_].bs.hps[0].hl[0].ol[0].os;
    },
    value_show() {  //投注对象数据
      return this.get_bet_obj[this.name_].bs;
    },
    value_show2() {  //投注对象ol层数据
      return this.get_bet_obj[this.name_].cs;
    },
    //是否显示下边线
    show_border() {
      return this.get_bet_list[this.get_bet_list.length - 1] == this.name_
    },
    //每个投注项状态是否正常
    status_normal() {
      return [1, 2].includes(+this.odds_change) || [1, 2].includes(+this.pankou_change)
    },
    /**
     *@description 赔率转换
     *@param {String} value 原始的欧洲赔率
     *@param {String} hsw 支持赔率转换的类型，逗号分隔
     *@return {String} 转换后的赔率
     */
    odds_value() {
      let val = this.bet_obj_ov / 100000,
          hsw = this.value_show.hps[0].hsw;

      let S = this.compute_value_by_cur_odd_type(val, null, hsw);
      return S ? S : '';
    },
    //虚拟赛马计算标识数量
    calc_num() {
      if (this.value_show2.num) {
        return [this.value_show2.num]
      } else if (this.value_show.value2 && this.value_show.value2.includes('/')) {
        return this.value_show.value2.split('/')
      } else {
        return false
      }
    },
    //计算是否显示
    calc_show2() {
      if ([1011, 1002, 1010, 1009].includes(+this.value_show.csid)) {
        return !this.value_show.value2.includes('/') && this.value_show.value2
      } else {
        return this.value_show.value2
      }
    },
   // 展示欧洲盘还是香港盘
   hptype() {
      let type = 'EU'
      if (this.get_cur_odd == 'HK' && _.get(this.value_show,'hps[0].hsw').includes('2')) {
        type = 'HK'
      }
      return this.$root.$t(`odds.${type}`)
   }
  },
  mounted() {
    if (this.bet_obj_mhs == 11 || this.bet_obj_hs == 11) {
      this.set_bet_status(7);
    };
    //投注项无效时要触发失效
    if (this.bet_obj_os == 2) {
      this.time_over()
    }
  },
  watch: {
    bet_obj_ov(new_, old_) {
      this.calc_mixcount(false)
    },
    bet_obj_mhs(new_) {    //监听赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
      if ([3, 4, 6].includes(+this.get_bet_status)) {return};

      if (new_ == 0) {
        this.set_bet_status(1);
        this.set_odds_change(false);
      }

      if ([1, 2].includes(+new_)) {
        this.pankou_change = 2;
        this.set_invalid_ids({ type: 1, val: this.value_show.mid }) // 对应赛事和盘口级别失效时记录id
        this.set_odds_change(true);
      }

      if (new_ == 11) this.set_bet_status(7);
    },
    bet_obj_hs: {    //监听盘口级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
      handler(new_) {
        if ([3, 4, 6].includes(+this.get_bet_status)) {return};

        if (new_ == 0) {
          this.set_bet_status(1);
          this.set_odds_change(false);
        }

        if ([1, 2].includes(+new_)) {
          this.pankou_change = 2;
          this.set_invalid_ids({ type: 1, val: this.value_show.mid }) // 对应赛事和盘口级别失效时记录id
          this.set_odds_change(true);
        }

        if (new_ == 11) this.set_bet_status(7);
      },
      immediate: true
    },
    bet_obj_os(new_) {    //监听投注项状态变化,socket对应1.开盘，2封盘，3详情页投注项需要隐藏(用失效对应)
      if ([3, 4, 6].includes(+this.get_bet_status)) {return};

      if ([2, 3].includes(+new_)) {
        this.pankou_change = 2;
        this.set_odds_change(true);
      }
    },
    //状态变为1时作初始化处理
    get_bet_status(new_) {
      if (new_ == 1) {
        this.odds_change = 0;
        this.pankou_change = 0;
        this.set_invalid_ids({ type: 0 })
      };
    },
    //监听状态变化来设置赔率或盘口变化的id_集合
    status_normal(new_) {
      if (new_ && this.get_bet_status != 6) {
        this.set_change_list({ value: this.value_show.hps[0].hl[0].ol[0].oid, status: 1 });
      } else {
        this.set_change_list({ value: this.value_show.hps[0].hl[0].ol[0].oid, status: 2 });
      }
    },
    //串关投注成功后的赔率使用接口返回的赔率
    order_detail_resp_list(newValue) {
      for (const item of newValue) {
        if (item.playOptionsId == this.name_) {
          this.odds_after = item.oddsValues;
          this.playname = item.playName;
          this.play_optionname = item.playOptionName;
        }
      }
    }

  },
  methods: {
    ...mapMutations(["set_odds_change", "set_bet_status", "set_change_list", "set_invalid_ids","set_active_index","set_keyboard_show"]),
    //展示栏点击事件
    handleonmousedown(){
      this.set_active_index('')
      this.set_keyboard_show(false)
    },
    /**
     *@description 删除一个投注项
     *@return {Undefined} undefined
     */
    remove_() {
      //校验是否是串关，并且删除后是否小于最小串关数量
      if(this.get_is_mix && !this.vilidata_mix_count(true)){return}
      this.set_change_list({ value: this.value_show2.oid, status: 2 });
      this.set_invalid_ids({ type: 2, val: this.value_show.mid })
      this.remove_item(this.value_show2.oid);
    },
    /**
     *@description 虚拟体育赛事倒计时小于10秒时，手动触发投注项失效
     *@return {Undefined} undefined
     */
    time_over() {
      if (this.value_show.hps[0].hl[0].hs != 1) {
        this.invalid_c106(this.value_show.hps[0].hl[0].hid, this.value_show.mid)
      }
    },
  },
  destroyed() {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
}

</script>
<style lang="scss" scoped>
.bet-mix-show2 {
  position: relative;
}
.timer-down {
  position: absolute;
  border-radius: 2px;
  text-align: center;
  width: 0.5rem;
  height: 0.24rem;
  line-height: 0.24rem;
  top: 0.42rem;
  right: 0.26rem;
}
.locked-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}
.content-t {
  line-height: 0.2rem;
}
.dele-left {
  z-index: 2;
  width: 0.14rem;
  height: 0.14rem;

  img {
    width: 99%;
    height: 99%;
  }
}
.odd-change {
  display: inline-block;
  width: 0.06rem;
  height: 0.08rem;
}
.invalid-span {
  border-radius: 2px;
  text-align: center;
  width: 0.4rem;
  height: 0.19rem;
  line-height: 0.19rem;
  font-size: 0.13rem;
  margin-right: 0.1rem;
}
.line {
  height: 1px;
  transform: scaleY(0.5);
}
.team-info {
  max-width: 2.4rem;
  line-height: 1.2;
}

/* ************** 投注完成后的颜色展示 ************** -S */
.img0 {
  margin-right: 0.06rem;
  width: 0.158rem;
  transform: translateY(16%);
}
/* ************** 投注完成后的颜色展示 ************** -E */

/* ************** 赛马1-6号的标识 ************** -S */
.num {
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 2px;
  vertical-align: text-bottom;
  background:  var(--q-color-com-img-bg-20) no-repeat 0 0 / 100%;
  --per: -0.3rem;
}

@for $count from 1 through 6 {
  .num#{$count} {
    background-position-y: calc(var(--per) * #{$count + 5});
  }
}
/* ************** 赛马1-6号的标识 ************** -E */
/* ************** 赛狗1-6号的标识 ************** -S */
.dog {
  @for $count from 2 through 6 {
    .num#{$count} {
      background-position-y: calc(var(--per) * #{$count - 1});
    }
  }

  &.moto {
    .num5 {
      background-position-y: calc(var(--per) * 13);
    }
    .num6 {
      background-position-y: calc(var(--per) * 12);
    }
  }
}
/* ************** 赛狗1-6号的标识 ************** -E */
.nidi-moto {
  @for $count from 1 through 4 {
    .num#{$count} {
      background-position-y: calc(var(--per) * #{$count + 13});
    }
  }
}
</style>
