<!--
 * @Author:
 * @Description: be3新版投注记录页展示对阵信息，玩法赔率
-->
<template>
  <div class="body-main yb_ml12 yb_pt10" :class="[type_.seriesType == '1'?'yb_pl12':'yb_pl18',{'body-main3':box_bool && index_ == 1,'body-main2':type_.seriesType != '1' && index_ != len-1}]"
    @click="goto_details">
    <!-- 上 -->
    <div class="row yb_fontsize14 justify-between" :class="type_.seriesType == '1'?'box-top':'box-top2 justify-between'">
      <p v-if="type_.seriesType != '1'">
        <!-- 电竞图标先写死 -->
        <span v-if="main.sportId == 101" style="--num:39"></span>
        <span v-else-if="main.sportId == 100" style="--num:42"></span>
        <span v-else-if="main.sportId == 103" style="--num:40"></span>
        <span v-else-if="main.sportId == 102" style="--num:41"></span>
        <img :src="get_server_file_path(main.tournamentPic,main.sportId)" @error="handle_img_load_error" v-else>
        <div class="beif_src" :style="compute_css_obj('match-cup')"  alt=""></div>
      
      </p>
      <p class="col-9" :style="{'font-weight':$q.platform.is.ios ? '500':'bold'}">
        <!-- 冠军趣味玩法特殊对应 -->
        <!-- managerCode=4 代表电竞  -->
        <!-- matchType=3 是冠军  -->
        <!-- managerCode=3 代表虚拟体育 -->
        <!-- seriesType = 3 表示冠军 -->
        <!-- matchType= 4 表示虚拟体育(尽量不要用这个字段) -->
        <template v-if="type_.seriesType == '3' && main.sportId == 50">{{main.sportName}}</template>
        <template v-else-if="[1011, 1002, 1010, 1009].includes(+main.sportId)">{{main.batchNo}}</template>
        <template  v-else-if="type_.seriesType == '3'">{{main.matchName}}</template>
        <template v-else>{{main.matchInfo}}</template>
      </p>
      <!-- .Format(i18n_t('time4')) -->
      <p class="text-right begintime" v-if="!type_.acCode&&main.beginTime">{{formatTime(+main.beginTime, 'mm/DD HH:MM')}}</p>
    </div>

    <!-- 中 -->
    <div class="row box-main yb_py4">
      <p class="col-8">
        <span>
          <!--球类名称 赛前还是滚球 玩法名称-->
          {{i18n_data.sport_name}}
          <span
            v-if="type_.seriesType != '3' && main.matchType != 4 && main.sportId != 1004">&thinsp;{{i18n_data.type}}&ensp;</span>
          <template v-if="(main.sportId == 1001 || main.sportId == 1004) && type_.seriesType != '1'">&ensp;{{main.matchName}}{{main.matchDay}}&ensp;{{main.batchNo}}</template>
          {{main.playName}}
          <!-- 基准分 -->
          <template v-if="main.scoreBenchmark && !is_pre">({{format_score(main.scoreBenchmark)}})</template>&thinsp;
          <span v-if="!type_.acCode">[{{i18n_data.mtype}}]</span>
        </span>
      </p>
      <!-- 结算比分存在时显示结算比分 -->
      <!-- <template> -->
        <p class="col-4 row items-center justify-end text-right">
          <span style="flex:1">
            <template v-if="main.settleScore != ''"> {{calc_settle_score}}</template>
          </span>
         <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon.svg`" alt="" class="arrow2" v-if="show_arrow">
        </p>
      <!-- </template> -->
    </div>

    <!-- 下 -->
    <div class="box-bottom row">
      <p class="col-9" :class="{'dog': [1002, 1010].includes(+main.sportId),'moto': [1010].includes(+main.sportId),'nidi-moto':+main.sportId == 1009}">
        <!-- 赛马有些玩法特殊对应 -->
        <template v-if="[1011, 1002, 1010, 1009].includes(+main.sportId) && calc_num">
          <span v-for="(item,i) in calc_num" :key="i" :class="'num' + item" class="num yb_mr4"></span>
        </template>

        <span :style="{'font-weight':$q.platform.is.ios ? '500':'bold'}">
          <template v-if="!([1011, 1002, 1010, 1009].includes(+main.sportId) && calc_num && calc_num.length > 1)">
            {{is_pre ? main.playOptionName: main.marketValue}}
          </template>
        </span>
        <!-- 优化后的赔率 -->
        <span class="oddfinally" v-if="!type_.acCode"><span>&nbsp;@&thinsp;{{format_odds(main.oddFinally, main.sportId)}}</span></span>
      </p>
      <!-- managerCode=4 代表电竞 orderStatus=1 是已结算 -->
      <p class="col-8 text-left yb_fontsize10 item-order" v-if="type_.managerCode == 4&&type_.orderStatus == 1">
        <!-- {{i18n_t('bet_record.result_score')}}： -->
        {{main.settleScore}}
      </p>

      <p class="col-3 text-right yb_fontsize12">
        <span :class="(main.betResult == 4 && main.betStatus != 3 && main.betStatus != 4 || main.betResult == 5 && main.betStatus != 3 && main.betStatus != 4) &&'text-red'">
          {{calc_text(type_.orderStatus,type_.seriesType,main.betStatus,main.betResult,main.cancelType)}}
        </span>
      </p>

      <!-- <div class="col-8 text-left yb_fontsize10 item-order" v-if="type_.seriesType == '3'">
        <template v-if="!['zh', 'tw'].includes(get_lang)">
          {{(new Date(+type_.orderVOS[0].closingTime)).Format(i18n_t('time7'))}} {{ i18n_t('match_main.cut_off')}}
        </template>
        <template v-else>
          {{(new Date(+type_.orderVOS[0].closingTime)).Format(i18n_t('time7'))}} {{ i18n_t('match_main.cut_off')}}
        </template>
      </div> -->

    </div>

  </div>
</template>

<script setup>
// import { mapGetters, mapMutations } from "vuex";
import {compute_css_obj, LOCAL_PROJECT_FILE_PREFIX} from "src/output/index.js"
import { api_common } from "src/api/index.js";
import {
  useMittEmit, 
  MITT_TYPES, 
  MenuData, 
  MatchListH5DetailMiddleware, 
  MatchDataWarehouse_H5_Detail_Common as MatchDetailDataWarehouse, 
  MatchDataWarehouse_H5_List_Common as MatchListDataWarehouse
} from 'src/output/index.js'
import { format_time_zone_time, format_odds, format_score, formatTime } from 'src/core/format/common'
import { onUnmounted, ref, computed, onMounted  } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { i18n_t } from "src/boot/i18n.js";
import UserCtr from "src/core/user-config/user-ctr.js";;
//国际化
import { get_server_file_path } from "src/core/file-path/file-path.js";
const props =defineProps({
    main: {
      type: Object
    },
    marketType: {
      type: String
    },
    playOptionsId: {
      type: String
    },
    type_: {
      type: Object
    },
    box_bool: {
      type: Boolean
    },
    index_: {
      type: Number || String
    },
    len: {
      type: Number
    },
    is_pre: {
      type: Boolean
    }
  })
  const bet_result = ref({
    //'未结算',
    "0": i18n_t("bet_record.bet_no_status00"),
    //'走水',
    "2": i18n_t("bet_record.bet_no_status02"),
    //'输',
    "3": i18n_t("bet_record.bet_no_status03"),
    //'赢',
    "4": i18n_t("bet_record.bet_no_status04"),
     //'赢半',
    "5": i18n_t("bet_record.bet_no_status05"),
    //'输半',
    "6": i18n_t("bet_record.bet_no_status06"),
    //'比赛取消',
    "7": i18n_t("bet_record.bet_no_status07"),
    //'比赛延期',
    "8": i18n_t("bet_record.bet_no_status08"),
    // '比赛延迟',
    "11": i18n_t("bet_record.bet_no_status11"),
    // '比赛中断',
    "12": i18n_t("bet_record.bet_no_status12"),
    // '比赛放弃'
    "15": i18n_t("bet_record.bet_no_status15")
  })
  const bet_result_1 = ref({
    //'比赛取消',
    "7": i18n_t("bet_record.bet_no_status07"),
    //'比赛延期',
    "8": i18n_t("bet_record.bet_no_status08"),
    // '比赛延迟',
    "11": i18n_t("bet_record.bet_no_status11"),
    // '比赛中断',
    "12": i18n_t("bet_record.bet_no_status12"),
    // '比赛放弃'
    "15": i18n_t("bet_record.bet_no_status15")
  })
  //手动取消订单的原因展示
  const bet_result_3 = ref({
    "1": i18n_t("bet_record.cancel_type_1"),
    "2": i18n_t("bet_record.cancel_type_2"),
    "3": i18n_t("bet_record.cancel_type_3"),
    "4": i18n_t("bet_record.cancel_type_4"),
    "5": i18n_t("bet_record.cancel_type_5"),
    "6": i18n_t("bet_record.cancel_type_6"),
    "17": i18n_t("bet_record.cancel_type_17"),
    "20": i18n_t("bet_record.cancel_type_20")
  })
  let lang = ref(UserCtr.lang)
  // 3个需要特殊对应的国际化数据写到这里
  const i18n_data = ref({
    sport_name: i18n_t(`common_lang.${lang.value}.sport2`)[props.main.sportId],
    type: i18n_t(`common_lang.${lang.value}.matchtype`)[props.main.matchType],
    mtype: i18n_t(`common_lang.${lang.value}.odds`)[props.main.marketType]
  })

  // 路由
  const router = useRouter()
  const route = useRoute()

    // ...mapGetters(["get_main_item",  "get_menu_type", "get_lang"]),
    //单关已结算投注成功（orderStatus == 1）时，不在此位置显示结算比分
  const calc_settle_score = computed(() => {
      if (props.type_.orderStatus == 1 && props.type_.seriesType == '1') {
        return '';
      } else {
        return props.main.settleScore
      }
    })
    //投注项展示内容，见产品文档  http://lan-confluence.sportxxxr1pub.com/pages/viewpage.action?pageId=22018812
  const calc_text = computed(() => {
      return function (orderStatus, seriesType, betStatus, betResult, cancelType) {
        let res = '';
        //orderStatus  字段0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败。 1  2  4  都在已结算列表里面 ，0 和 3 是在未结算列表里面
        switch (orderStatus) {
          //3（确认中，订单是确认中状态）
          case '3':
          //4（投注失败，订单是投注失败状态)
          case '4':
            res = '';
            break;
            //0（未结算，订单是投注成功状态)
          case '0':
            if (seriesType == '1') {
              res = '';
            } else {
              if (betStatus == 3 || betStatus == 4) {
                // return '无效';
                res = bet_result_3.value[cancelType] || i18n_t("bet_record.invalid");
              } else if (betStatus == 1) {
                if (betResult == 13 || betResult == 16) {
                  res = i18n_t("bet_record.invalid")
                } else {
                  res = bet_result.value[betResult] || '';
                }
              } else {
                res = '';
              }
            }
            break;
            //1（已结算 订单是投注成功状态）
          case '1':
            if (seriesType == '1') {
              //放到下面显示
              res = ''
            } else {
              if (betStatus == 3 || betStatus == 4) {
                // return '无效';
                res = bet_result_3.value[cancelType] || i18n_t("bet_record.invalid");
              } else if (betStatus == 1) {
                if (betResult == 13 || betResult == 16) {
                  res = i18n_t("bet_record.invalid");
                } else {
                  // 冠军玩法特殊对应
                  if (seriesType == '3' && [2, 3, 4, 5, 6].includes(+betResult)) {
                    res = '';
                    break;
                  }
                  res = bet_result.value[betResult] || '';
                }
              } else {
                res = '';
              }
            }
            break;
            //2（注单无效，订单是投注无效状态）
          case '2':
            if (seriesType == '1') {
              res = ''
            } else {
              if (betStatus == 3 || betStatus == 4) {
                // return '无效';
                res = bet_result_3.value[cancelType] || i18n_t("bet_record.invalid");
              } else if (betStatus == 1) {
                res = bet_result_1.value[betResult] || i18n_t("bet_record.invalid");
              } else {
                res = '';
              }
            }
            break;
          default:
            break;
        }
        return res;
      }
    })
    //虚拟赛马计算标识数量
  const calc_num = computed(() => {
      if (/[0-9]/.test(props.main.playOptions)) {
        return props.main.playOptions.split('/')
      } else {
        return false
      }
    })
    // 箭头是否展示
  const show_arrow = computed(() => {
      let flag = true;
      //不在列表页不用跳，赛事id不存在不用跳，虚拟体育不用跳,冠军不用跳，超过投注时间7天不用跳
      let calc_time = (new Date().getTime() - props.type_.betTime) / (24 * 60 * 60 * 1000)
      if (route.name != 'matchList' || !props.main.matchId || props.type_.managerCode == 3
        || !props.type_.betTime || calc_time > 7 || props.type_.seriesType == 3) {
        flag = false;
      }
      return flag;
    })
    onUnmounted(() => {
    //   for (const key in $data) {
    //   $data[key] = null
    // };
    })

    // ...mapMutations(['set_goto_detail_matchid', 'set_details_item', 'set_menu_type']),
  const handle_img_load_error = (e) => {
      e.target.classList.add('err_src')
      e.target.onerror = null
    }
    /**
     *@description 调用接口查询是否存在赛果详情页面,并跳转到相应页面
     *@return {Undefined} undefined
     */
  const goto_details = () => {
      if (!show_arrow) return;
      let mid_ = props.main.matchId;
      api_common.existMatchResult({ matchId: mid_, playOptionsId: props.main.playOptionsId }).then(res => {
        if (!(res && res.code == 200 && res.data)) return
        const _result = res.data.marketResult, _matchEnd = res.data.matchEnd;
        if (_result) {   //有赛果页去到赛果详情页
          useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, false)
          set_goto_detail_matchid(mid_);
          set_details_item(0);
          router.push({ name: 'match_result', params: { mid: mid_, index: '0' } });
        } else {  //无赛果页去到赛事详情页
          if (_matchEnd) return; // 赛事结束但是没有赛果不跳转
          useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, false)
          if ([100,101,102,103].includes(+props.main.sportId)) {  // 如果是电竞赛事，需要设置菜单类型
            MenuData.set_menu_type(3000)
          }
          // set_goto_detail_matchid(mid_);
          // set_details_item(0);
          // 详情中间件
          console.error(MatchListDataWarehouse);
          // TODO: 暂时注释--列表数据仓库只存储当前展示区域的赛事数据，注单记录的赛事有可能不在可视区域内
          // MatchListH5DetailMiddleware.before_enter_detail_form_list({
          //   MatchDataWarehouse_source: MatchListDataWarehouse,
          //   MatchDataWarehouse_target: MatchDetailDataWarehouse,
          //   mid: mid_,
          //   back_to_source_params: {},
          // })
          router.push({ name: 'category', params: {mid: mid_, csid: props.main.sportId} });
        }
      })
    }
</script>

<style lang="scss" scoped>
.body-main2 {
  padding-bottom: 0.06rem;
  &::before {
    content: "";
    display: block;
    width: 1px;
    height: 76%;

    position: absolute;
    left: 0.04rem;
    top: 0.28rem;
  }
}
.body-main3 {
  &::before {
    content: "";
    display: block;
    width: 1px;
    height: 68%;
    position: absolute;
    left: 0.04rem;
    top: 0.26rem;
  }
}
.body-main {
  min-height: 0.76rem;
  color:  var(--q-gb-t-c-3);
  position: relative;
  margin-right: 0.15rem;
  .box-top {
    position: relative;
    color: var(--q-cathectic-color-1);
    &::before {
      content: "";
      display: block;
      width: 0.03rem;
      height: 0.12rem;
      background-color: var(--q-gb-bd-c-13);
      border-radius: 0.02rem;
      position: absolute;
      left: -0.1rem;
      top: 0.04rem;
    }
  }
  .box-top2 {
    position: relative;

    p:first-child {
      position: absolute;
      width: 0.2rem;
      height: 0.22rem;
      left: -0.24rem;
      top: 0;

      span {
        --per: -0.32rem;
        display: inline-block;
        width: 100%;
        height: 100%;
        background: var(--q-color-com-img-bg-11) no-repeat 0 calc(var(--per) * var(--num)) / 0.2rem 18.88rem;
      }

      img {
        width: 99%;
        height: 99%;
      }
    }
  }
  .box-bottom {
    font-size: 0.14rem;
    color: var(--q-cathectic-color-1);
    .oddfinally {
      color: var(--q-gb-t-c-1);
    }
  }
  .beif_src {
    display: none;
  }
  .err_src {
    display: none;
    & + .beif_src {
      display: block;
    }
  }
  .begintime {
    font-size: 0.11rem;

    line-height: 0.2rem;
    white-space: nowrap;
  }
  .arrow2 {
    transform: rotateZ(90deg);
    height: 0.06rem;
    margin-left: 0.08rem;
  }
}

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

/* ************** 赛狗1-6号的标识 ************** -S */
.nidi-moto {
  @for $count from 1 through 4 {
    .num#{$count} {
      background-position-y: calc(var(--per) * #{$count + 13});
    }
  }
}
</style>
