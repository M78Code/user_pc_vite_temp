<!--
 * @
 * @Author: Yellow
 * @Date: 2020-08-06 15:54:20
 * @Description: 详情页-近期关注模块
-->
<template>
  <div v-if="recent_data.length" class="wrap-recents">
    <div class="item-title">
      <div class="recents-tilte"></div>
      <!-- 近期关注 -->
      <span>{{i18n_t('common.recent_attention')}}</span>
    </div>

    <!-- 列表 S-->
    <div v-for="(item, i) in recent_data" :key="i">
      <!-- 标题 S -->
      <div class="title" :class="{'border-top-0': i === 0}">
        <div class="wrap-img">
          <img v-img="[lodash.get(item,'lurl')]" />
          <span>{{item.tn}}</span>
        </div>
        <match-date :match_props="{match: item}" />
      </div>
      <!-- 标题 E -->

      <!-- 投注行 S-->
      <div class="info">
        <!-- 对阵信息 S-->
        <div class="both" @click="go_details(item)">
          <!-- 主队 S-->
          <div class="both-item">
            <img v-img="([lodash.get(item,'mhlu[0]'), lodash.get(item,'frmhn[0]')])" alt />
            <img
              v-if="lodash.get(item,'mhlu').length>1"
              v-img="([lodash.get(item,'mhlu[1]'), lodash.get(item,'frmhn[1]')])"
              alt
              class="logo-double"
            />
            <span class="both-title both-home ellipsis">{{item.mhn}}</span>
            <!-- 全场比分 -->
            <span class="score">{{lodash.get(item, 'msc.S1.home')}}</span>
          </div>
          <!-- 主队 E-->

          <!-- 客队 S-->
          <div class="both-item">
            <img v-img="([lodash.get(item,'malu[0]'), lodash.get(item,'frman[0]')])" alt />
            <img
              v-if="lodash.get(item,'malu').length>1"
              v-img="([lodash.get(item,'malu[1]'), lodash.get(item,'frman[1]')])"
              alt
              class="logo-double"
            />
            <span class="both-title ellipsis">{{item.man}}</span>
            <span class="score">{{lodash.get(item, 'msc.S1.away')}}</span>
          </div>
          <!-- 客队 E-->
        </div>
        <!-- 对阵信息 E-->

        <!-- 投注项 S -->
        <div class="handicap">
          <template  v-for="index in [0,2,1]">
            <div
              v-if="index !== 2 || lodash.get(item, `hps.0.hl.0.ol.${index}`)"
              :key="`item_${i}_${index}`"
              :class="[
                'item handicap-item',
                'os-' + lodash.get(item, `hps.0.hl.0.ol.${index}.os`),
                {
                  item_border: !(lodash.get(item, 'hps.0.hl') && mx_get_bet_simple(item, index, 'oid')),
                }
              ]"
            >
              <bet-item
                v-if="lodash.get(item, 'hps.0.hl') && mx_get_bet_simple(item,index,'oid')"
                :key="`item_0_${i}`"
                :match_info="item"
                :play_data="mx_get_bet_simple(item,index,'play')"
                :bet_data="mx_get_bet_simple(item,index,'bet_data')"
                :bet_ids="mx_get_bet_simple(item,index,'bet_id')"
                style="padding: 0 10px"
                bet_source="recent"
                :bet_info="{
                  mid_obj:match_ctr.mid_obj,
                  hl_obj:match_ctr.hl_obj,
                  ol_obj:match_ctr.ol_obj
                }"
              >
                <div
                  class="play-name ellipsis bet_handicap"
                  v-tooltip="{content:lodash.get(item, `hps.0.hl.0.ol.${index}.onb`) || lodash.get(item, `hps.0.hl.0.ol.${index}.on`),overflow:1}"
                >{{lodash.get(item, `hps.0.hl.0.ol.${index}.onb`) || lodash.get(item, `hps.0.hl.0.ol.${index}.on`)}}</div>
              </bet-item>
            </div>
          </template>
        </div>
        <!-- 投注项 E-->
      </div>
      <!-- 投注行 E-->
    </div>
    <!-- 列表 E-->
  </div>
</template>

<script>
import { api_details } from "src/api/index";
import { MatchProcessFullVersionWapper } from "src/components/match-process/index.js";
import bet_item from "src/base-pc/components/bet-item/bet_item.vue";
// import skt_data_list_hot from "src/public/mixins/websocket/data/skt_data_list_hot.js";  todo  ws更新
import {
  UserCtr,
  MenuData,
  MatchDataWarehouse_PC_Detail_Common as MatchDetailsData,
  useMittOn,
  MITT_TYPES,
  i18n_t
} from "src/output/index.js";
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import { mx_get_bet_simple } from "src/core/utils/project/module/bet-util.js";
export default {
  components: {
    "match-date": MatchProcessFullVersionWapper,
    "bet-item": bet_item,
  },
  // mixins: [skt_data_list_recent],
  data() {
    return {
      mx_get_bet_simple,
      recent_data: [], //列表数据
      match_ctr: MatchDetailsData,
      socket_name: "recent", // 接入socket的名称
      skt_mid: {}, // 需要订阅的赛事id
      skt_hpid: "", // 需要订阅的玩法
      off_mitt: null, // 关闭mitt
      uid: UserCtr.get_uid(), // 获取用户 Id
      vx_get_user: UserCtr.get_user(),   // 用户信息
      get_theme: UserCtr.theme, // 获取当前是日间版还是夜间版模式
      is_bet_single: BetData.is_bet_single, // true= 单关投注 false= 串关投注
      is_handle: BetData.is_handle, // 是否正在处理投注
      is_single_handle: BetData.is_single_handle, // 单关 是否正在处理投注
      off_mitt:null, //批量关闭mitt
      cur_menu_type: MenuData.menu_type,// 获取当前菜单类型
      cur_route: LayOutMain_pc.layout_current_path,// 获取当前路由   
       // 投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
      bet_mode : BetData.bet_mode,
      // 是否锁住投注项不让点，默认为不锁住(针对新的投注流程)
      bet_item_lock : BetData.bet_item_lock,
    };
  },
  computed: {
  },
  methods: {
    /**
     * @获取近期关注数据
     */
    get_history(callback) {
      api_details.get_history({ cuid: this.uid }).then((res) => {
        const code = lodash.get(res, "code");
        const data = lodash.get(res, "data");
        const timestap = lodash.get(res, "ts");
        if (code == 200 && data.length) {
          // 格式化比分
          data.forEach((item) => {
            let obj = {};
            for (let i in item.msc) {
              let format = item.msc[i].split("|");
              obj[format[0]] = {
                home: format[1].split(":")[0],
                away: format[1].split(":")[1],
              };
            }            
            item.msc = obj;

            let handicaps = lodash.get(item, "hps[0].hl[0]")
            if(handicaps){
              if(handicaps.hs == 1) {
                handicaps.ol.forEach(j => {
                  j.os = 2
                })
              } else if(handicaps.hs == 11){
                handicaps.ol.forEach(j => {
                  j.os = 4
                })
              }
            }
          });          
          if (this.match_ctr) {
            // this.match_ctr.set_list_obj(data,timestap);
            this.recent_data = data;
            // let match_c8 = null;
            // let _skt_mid_obj = ws_c8_obj_format(this.match_ctr.list) || null;
            // this.match_ctr.list.map((item) => {
            //   match_c8 = lodash.get(_skt_mid_obj, `${item.mid}`);
            //   if(match_c8)
            //   {
            //     item.hps &&
            //     item.hps.map((item2) => {
            //       if(item2.hpid) {
            //         match_c8.hpids.push(item2.hpid);
            //       }
            //     });
            //   }
            // });
            // this.skt_mid = _skt_mid_obj;
          }
          // if(this.cur_menu_type.cur=="home") {
          //   // socket订阅
          //   this.SCMD_C8("h_match_list");
          // } else {
          //   this.SCMD_C8();
          // } 
          // if (callback) {
          //   callback();
          // }
          // //同步赛事时间
          // let mid = this.$route.params.mid;
          // if (lodash.get(this.match_ctr, `mid_obj[${mid}]`)) {
          //   let mst = lodash.get(
          //     this.match_ctr.mid_obj,
          //     `${mid}.mst`
          //   );
          //   this.yabo_common.update_match_time({mid, mst});
          // }          
          // if(!lodash.isEmpty(this.match_ctr.mid_obj)) {
          //   for(let key of Object.keys(this.match_ctr.mid_obj)) {              
          //     // 同步投注项
          //     this.yabo_common.upd_bet_obj(this,timestap,key);
          //   }
          // }          
        }
      });
    },

    /**
     * @跳转赛事
     * 进入赛事详情
     */
    go_details(item) {
      let { mid, tid, csid } = item;
      
      this.$router.push({
        name: 'details',
        params: {
          mid,
          tid,
          csid
        }
      })
      this.save_match_info(item)
    },
  },
  created(){
    let {off} = useMittOn(MITT_TYPES.EMIT_GET_HISTORY,this.get_history);
    this.off_mitt = off
  },
  destroyed(){
    this.off_mitt()
    this.match_ctr.destroy();
  }
};
</script>

<style lang="scss" scoped>
/* ************** 标题 *************** -S */
.item-title {
  display: flex;
  align-items: center;
  padding-left: 16px;
  height: 32px;
  font-size: 13px;
  .recents-tilte {
    &::before {
      display: inline-block;
      position: relative;
      top: 2px;
      margin-right: 8px;
      width: 3px;
      height: 14px;
      border-radius: 1.5px;
      content: "";
    }
  }
}

/* ************** 标题 *************** -E */
/* ************** 投注列表标题 *************** -S */
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  height: 36px;
  border-top: 1px solid var(--qq--wrap-recents-border-color);
  border-bottom: 1px solid var(--qq--wrap-recents-border-color);
  background: rgba(31, 34, 43, 0.5);
  &.border-top-0 {
    border-top: 0;
  }
  .wrap-img {
    display: flex;
    align-items: center;

    img {
      margin-right: 10px;
      width: 18px;
      height: 18px;
    }
  }

     :deep(.c-match-process) {
      .c-match-date {
        padding: 0;
        & > span {
          &:last-child {
            margin-left: 10px;
          }
        }
      }
      & > div:last-child {
        margin-left: 10px;
      }
    }
  
}

/* ************** 投注列表标题 *************** -E */
/* ************** 投注行 *************** -S */
.info {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  height: 80px;
  .both,
  .handicap {
    flex: 1;
    overflow: hidden;
  }

  /* ************** 对阵信息 *************** -S */
  .both {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin-right: 20px;
    height: 50px;
    cursor: pointer;
    .both-item {
      display: flex;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
        &.logo-double {
          margin-left: -5px;
        }
      }
      .both-title {
        flex: 1;
        margin: 0 5px;
        color: var(--qq--list-replay-text-color);
      }
    }
  }

  /* ************** 对阵信息 *************** -E */
  /* ************** 投注项 *************** -S */
  .handicap {
    display: flex;
    .item {
      flex: 1;
      overflow: hidden;
      margin-right: 10px;
      height: 50px !important;
      .play-name {
        text-align: center;
      }
      &.os-1 {
        .c-bet-item {
          &.active {
            .play-name {
              color: var(--q-gb-t-c-1);
            }
          }
        }
      }
      &:last-child {
        margin-right: 0;
      }
      :deep(.c-bet-item) {
        height: 48px !important;
        .bet-inner {
          flex-flow: column;
          .handicap-wrap {
            width: 100%;
            line-height: normal;
          }
          .odds {
            margin: 0;
            height: auto;
            .yb-family-odds {
              line-height: 20px;
            }
            .icon-lock {
              margin: 0;
            }
          }
        }
      }
    }
  }

  /* ************** 投注项 *************** -S */
}

/* ************** 投注行 *************** -E */
:deep(.c-match-date) {
  display: flex;

  margin-right: 8px;
  span {
    padding-left: 8px;
    &.timer-layout2 {
      width: 100%;
    }
  }
}
</style>
