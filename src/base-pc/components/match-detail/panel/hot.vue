<!--
 * @
 * @Author: Yellow
 * @Date: 2020-08-06 15:54:20
 * @Description: 右侧热门推荐
-->
<template>
  <div v-if="hot_data.length" class="wrap-hot">
    <div class="item-title">
      <div class="hot-title"></div>
      <!-- 热门推荐 -->
      <span>{{ i18n_t("common.hot_recommend") }}</span>
    </div>
    <!-- 轮播组件 S-->
    <div
      class="carousel"
      @mouseenter="autoplay = false"
      @mouseleave="carousel_leave"
    >
      <q-carousel
        animated
        v-model="slide"
        infinite
        :autoplay="false"
        ref="carousel"
      >
        <q-carousel-slide :name="i" v-for="(item, i) in hot_data" :key="i">
          <!-- 赛事信息 S-->
          <div class="info">
            <div class="info-botn">
              <div class="logo">
                <div class="img-wrap">
                  <img
                    v-img="[
                      lodash.get(item, 'mhlu[0]'),
                      lodash.get(item, 'frmhn[0]'),
                      lodash.get(item, 'csid'),
                    ]"
                    alt
                  />
                </div>
                <div
                  class="img-wrap logo-double"
                  v-if="lodash.get(item, 'mhlu.length') > 1"
                >
                  <img
                    v-img="[
                      lodash.get(item, 'mhlu[1]'),
                      lodash.get(item, 'frmhn[1]'),
                      lodash.get(item, 'csid'),
                    ]"
                    alt
                  />
                </div>
              </div>
              <div>
                <span class="ellipsis">{{ item.mhn }}</span>
              </div>
            </div>
            <div class="info-score">
              <div class="info-title">
                <span class="title ellipsis">{{ item.tn }}</span>
<!--                <match-date :match_props="{ match: item }" />-->
<!--                Bug: 53791-->
                <match-date :match_props="{ match: item }" :match="item" />
              </div>
              <span class="item" v-if="lodash.get(item, 'msc.S1')">{{
                get_score_text(item)
              }}</span>
              <span v-else class="item">VS</span>
            </div>
            <div class="info-botn">
              <div class="logo">
                <div class="img-wrap">
                  <img
                    v-img="[
                      lodash.get(item, 'malu[0]'),
                      lodash.get(item, 'frman[0]'),
                      lodash.get(item, 'csid'),
                    ]"
                    alt
                  />
                </div>
                <div
                  class="img-wrap logo-double"
                  v-if="lodash.get(item, 'malu.length') > 1"
                >
                  <img
                    v-img="[
                      lodash.get(item, 'malu[1]'),
                      lodash.get(item, 'frman[1]'),
                      lodash.get(item, 'csid'),
                    ]"
                    alt
                  />
                </div>
              </div>
              <div>
                <span class="ellipsis">{{ item.man }}</span>
              </div>
            </div>
          </div>
          <!-- 赛事信息 E-->

          <!-- 投注项 S-->
          <div class="handicap" v-if="!menu_data.is_esports()">
            <template v-for="index in [0, 2, 1]">
              <div
                v-if="index !== 2 || lodash.get(item, `hps.0.hl.0.ol.${index}`)"
                :key="`item_${i}_${index}`"
                :class="[
                  'handicap-item',
                  'os-' + lodash.get(item, `hps.0.hl.0.ol.${index}.os`),
                  {
                    item_border: !(
                      lodash.get(item, 'hps.0.hl') &&
                      mx_get_bet_simple(item, index, 'oid')
                    ),
                  },
                ]"
              >
                <bet-item
                  v-if="
                    lodash.get(item, 'hps.0.hl') &&
                    mx_get_bet_simple(item, index, 'oid')
                  "
                  :key="`item_0_${index}`"
                  :match_info="item"
                  :play_data="mx_get_bet_simple(item, index, 'play')"
                  :bet_data="mx_get_bet_simple(item, index, 'bet_data')"
                  :bet_ids="mx_get_bet_simple(item, index, 'bet_id')"
                  bet_source="recent"
                  :bet_info="{
                    mid_obj:match_ctr.get_quick_mid_obj(item.mid)
                  }"
                >
                  <div
                    class="play-name ellipsis bet_handicap"
                    v-tooltip="{
                      content:
                        lodash.get(item, `hps.0.hl.0.ol.${index}.onb`) ||
                        lodash.get(item, `hps.0.hl.0.ol.${index}.on`),
                      overflow: 1,
                    }"
                  >
                    {{
                      lodash.get(item, `hps.0.hl.0.ol.${index}.onb`) ||
                      lodash.get(item, `hps.0.hl.0.ol.${index}.on`)
                    }}
                  </div>
                </bet-item>
              </div>
            </template>
          </div>
          <!-- 投注项 E-->

          <!-- 收藏、跳转、统计按钮 S-->
          <div class="more-handel">
            <div
              v-if="
                !(
                  menu_data.is_esports() &&
                  ['play', 'hot'].includes(cur_menu_type)
                ) && global_switch.collect_switch
              "
              class="wrap-icon"
              @click="collect({ match: item, i })"
              @mouseenter="collect_enter(i)"
              @mouseleave="collect_leave(i)"
            >
              <icon-wapper name="icon-star" :class="{ active: item.mf }" size="14px" />
            </div>
            <div
              class="view-more wrap-icon"
              :class="{ full: item.cds !== 'SR' }"
              @click="go_detail(item)"
            >
              <span>{{ handicap_num(item.mc) }}</span>
              <icon-wapper name="icon-triangle3" color="#99A3B1" size="14px" />
            </div>
            <div
              class="wrap-icon hot"
              v-show="is_show_sr_flg(item)"
              @click="sr_click_handle(item, 1)"
            >
              <icon-wapper name="icon-signal" size="14px" color="#5A6074" />
              <q-tooltip
                anchor="top middle"
                self="center middle"
                :content-style="tooltip_style"
                >{{ i18n_t("common.analysis") }}</q-tooltip
              >
              <!-- 统计分析 -->
            </div>
          </div>
          <!-- 收藏、跳转、统计按钮 E-->
        </q-carousel-slide>
        <!-- 轮播icon S-->
        <template v-slot:control>
          <q-carousel-control position="bottom">
            <div class="control">
              <div class="btn left" @click="carousel_click('previous')"></div>
              <span
                v-for="(list, i) in hot_data"
                :key="i"
                class="control-item"
                :class="{ active: i == slide }"
                @click="carousel_click(i)"
              ></span>
              <div class="btn right" @click="carousel_click('next')"></div>
            </div>
          </q-carousel-control>
        </template>
        <!-- 轮播icon E-->
      </q-carousel>
    </div>
    <!-- 轮播组件 E-->
  </div>
</template>

<script>
import ZHUGE from "src/core/http/zhuge-tag.js";

const tooltip_style = 'background:rgba(0,0,0,0.8);padding:4px 5px;border-radius:0px;color:#fff'
import { api_details, api_match } from "src/api/index";
import { MatchProcessFullVersionWapper } from "src/components/match-process/index.js";
import { IconWapper } from 'src/components/icon/index.js'
import bet_item from "src/base-pc/components/bet-item/bet_item.vue";
// import skt_data_list_hot from "src/public/mixins/websocket/data/skt_data_list_hot.js";  todo  ws更新
import detailUtils from "src/core/match-detail/match-detail-pc/match-detail.js";
import { is_show_sr_flg } from "src/core/utils/project/module/other.js";
import { mx_get_bet_simple } from "src/core/utils/project/module/bet-util.js";
import {
  GlobalSwitchClass,
  UserCtr,
  MenuData,
  MatchDataWarehouse_PC_List_Common as MatchListData,
  useMittEmit,
  MITT_TYPES,
  useMittEmitterGenerator,
} from "src/output/index.js";
import {LayOutMain_pc} from "src/output/project/index.js";
import { ws_c8_obj_format } from 'src/core/data-warehouse/util/index.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import { onMounted, onUnmounted } from "vue";
import details from "src/core/match-detail/match-detail-pc/match-detail.js";
export default {
  // mixins: [skt_data_list_hot],
  components: {
    "match-date": MatchProcessFullVersionWapper,
    "bet-item": bet_item,
    IconWapper
  },
  data() {
    return {
      mx_get_bet_simple,
      is_show_sr_flg,
      tooltip_style,
      i18n_t,
      // 菜单数据
      menu_data: MenuData,
      match_ctr: MatchListData,
      slide: 0, //轮播下标
      autoplay: true, //轮播自动切换
      hot_data: [], //轮播数据
      socket_name: "hot", // 接入socket的名称
      skt_mid: {}, // 需要订阅的赛事id
      skt_hpid: "", // 需要订阅的玩法
      choose_bet: false, //是否选择了投注项
      global_switch: GlobalSwitchClass.global_switch, //全局开关
      uid: UserCtr.get_uid(), // 获取用户 Id
      vx_get_user: UserCtr.get_user(),   // 用户信息
      get_theme: UserCtr.theme, // 获取当前是日间版还是夜间版模式
      is_bet_single: BetData.is_bet_single, // true= 单关投注 false= 串关投注
      is_handle: BetData.is_handle, // 是否正在处理投注
      is_single_handle: BetData.is_single_handle, // 单关 是否正在处理投注
      off_mitt:null, //批量关闭mitt
      cur_menu_type: MenuData.menu_type,// 获取当前菜单类型
      cur_route: LayOutMain_pc.layout_current_path,// 获取当前路由   todo
       // 投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
       bet_mode : BetData.bet_mode,
      // 是否锁住投注项不让点，默认为不锁住(针对新的投注流程)
      bet_item_lock : BetData.bet_item_lock,     
    };
  },
  watch: {
    "menu_data.is_esports"(_new, _old) {
      if (_new !== _old) {
        //滚球切换顶部菜单时拉取热门接口
        this.get_hots();
      } else {
        this.hot_data = [];
      }
    },
  },
  created() {
    this.get_hots();
        /** 批量注册mitt */
    const { emitters_off } = useMittEmitterGenerator([
      // 监听轮播启用
      { type: MITT_TYPES.EMIT_HOT_START_PLAY, callback: this.start_play },
      // 轮播暂停
      { type: MITT_TYPES.EMIT_HOT_STOP_PLAY, callback: this.stop_play },
      // 获取轮播数据
      { type: MITT_TYPES.EMIT_HOT_COLLECT, callback: this.get_hots },
      // 接收列表收藏变化
      { type: MITT_TYPES.EMIT_MATCH_TO_HOT_COLLECT, callback: this.match_to_hot_collect },
    ]);
    this.off_mitt = emitters_off
  },
  destroyed() {
    this.match_ctr.destroy();
    this.off_mitt()
  },
  computed: {
    // 前端控制是否禁用收藏功能
    enable_collect_api() {
      return window.env.config.ENABLE_COLLECT_API;
    },
  },
  methods: {
    // 是否展示为比分判定中
    get_score_text(match_info) {
      const { mmp } = match_info;
      const home_score = lodash.get(match_info, "msc[S1].home");
      const away_score = lodash.get(match_info, "msc[S1].away");
      let score_text = `${home_score} : ${away_score}`;
      // 电竞未开赛 展示为 第一局
      const mmp_state = mmp || 1;
      // 当前局数不等于 比分总和加一，則提示比分判定中
      if (
        mmp_state != Number(home_score) + Number(away_score) + 1 &&
        this.menu_data.is_esports()
      ) {
        score_text = i18n_t("mmp.100.scoring");
      }
      return score_text;
    },
    handicap_num(mc) {
      if (this.global_switch.handicap_num) {
        return `+${mc || 0}`;
      } else {
        return i18n_t("match_info.more");
      }
    },
    carousel_click(type) {
      if (type == "previous") {
        this.$refs.carousel.previous();
      } else if (type == "next") {
        this.$refs.carousel.next();
      } else {
        this.slide = type;
      }
      this.send_zhuge_event("PC_热门推荐_切换控件点击");
    },
    /**
     * 接收列表收藏状态变化
     * * @param {String} mid 赛事id
     * @param {Number} mf 收藏状态
     */
    match_to_hot_collect({ mid, mf }) {
      for (let index = 0; index < this.hot_data.length; index++) {
        if (this.hot_data[index].mid == mid) {
          this.hot_data[index].mf = Boolean(mf);
          return;
        }
      }
    },
    /**
     * @description: 获取轮播数据
     */
    get_hots(callback) {
      let api;
      // 电竞
      if (this.menu_data.is_esports()) {
        api = api_details.get_hots_es;
      } else {
        // 其他赛种
        api = api_details.get_hots;
      }
     
      // this.match_ctr.clear_data();
      api({ cuid: this.uid, isHot: 1 }).then((res) => {

        let code = lodash.get(res, "code");
        let data = lodash.get(res, "data");
        let timestap = lodash.get(res, "ts");
        if (code == 200 && lodash.isArray(data)) {
          // 格式化比分
          data.forEach((item, index) => {
            item.cur_timer = new Date().getTime();
            let obj = {};
            for (let i in item.msc) {
              let format = item.msc[i].split("|");
              obj[format[0]] = {
                home: format[1].split(":")[0],
                away: format[1].split(":")[1],
              };
            }
            item.msc = obj;
            item._index = index;

            let handicaps = lodash.get(item, "hps[0].hl[0]");
            if (handicaps) {
              if (handicaps.hs == 1) {
                handicaps.ol.forEach((j) => {
                  j.os = 2;
                });
              } else if (handicaps.hs == 11) {
                handicaps.ol.forEach((j) => {
                  j.os = 4;
                });
              }
            }
          });
          if (!this.match_ctr) {
            return;
          }
          
          this.match_ctr.set_list(data);
          console.log(  this.match_ctr,'  this.match_ctr.');
          this.hot_data = data;
          let match_c8 = null;
          let _skt_mid_obj = ws_c8_obj_format(this.match_ctr.list);
          //todo
        //  this.match_ctr.list.map((item) => {
        //     match_c8 = _skt_mid_obj[item.mid];
        //     if (match_c8) {
        //       item.hps &&
        //         item.hps.map((item2) => {
        //           if (item2.hpid) {
        //             match_c8.hpids.push(item2.hpid);
        //           }
        //         });
        //     }
        //   }); 
          this.skt_mid = _skt_mid_obj;
          // if (this.vx_layout_cur_page.cur == "home") {
          //   // socket订阅
          //   this.SCMD_C8("h_match_list");
          // } else {
          //   this.SCMD_C8();
          // }
          // if (callback) {
          //   callback();
          // }
          //同步赛事时间
          // let mid = this.$route.params.mid;
          // if (this.match_ctr.get_quick_mid_obj(mid)) {
          //   let mst = lodash.get(this.match_ctr.mid_obj, `${mid}.mst`);
          //   this.yabo_common.update_match_time({ mid, mst });
          // }
          // if (!lodash.isEmpty(this.match_ctr.mid_obj)) {
          //   for (let key of Object.keys(this.match_ctr.mid_obj)) {
          //     // 同步投注项
          //     if (MenuData.is_esports || MenuData.is_virtual_sport) {
          //       this.virtual_common.upd_bet_obj(this, timestap, key);
          //     } else {
          //       this.yabo_common.upd_bet_obj(this, timestap, key);
          //     }
          //   }
          // }
        }
      });
    },

    /**
     * @description: 启用轮播
     */
    start_play() {
      //console.log('===========启用轮播========');
      this.choose_bet = false;
      this.autoplay = true;
    },

    /**
     * @description: 暂停轮播
     */
    stop_play() {
      //console.log('===========结束轮播========');
      this.choose_bet = true;
      this.autoplay = false;
    },

    /**
     * @description: 轮播面板鼠标移出
     */
    carousel_leave() {
      if (this.choose_bet) {
        this.autoplay = false;
      } else {
        this.autoplay = true;
      }
    },

    /**
     * @description: 收藏
     * @param {String} mid 赛事id
     * @param {String} cuid 用户id
     * @param {String} cf 1收藏;0取消收藏
     */
    collect({ match = { mf: false, mid: "" }, i = -1 }) {
      // 前端开    后台开       >开
      // 前端开    后台关       >关
      // 前端关    后台开       >关
      // 前端关    后台关       >关
      if (!this.enable_collect_api || !this.global_switch.collect_switch) {
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_09"));
        return;
      }
      let mf = match.mf;
      let params = {
        mid: match.mid,
        cuid: this.uid,
        cf: mf ? 0 : 1,
      };
      api_match.post_collect_match(params).then((res) => {
        let code = lodash.get(res, "data.code");
        let data = lodash.get(res, "data.data");
        if (code == 200 && data == 1) {
          if (mf) {
            this.hot_data[i].mf = false;
          } else {
            this.hot_data[i].mf = true;
          }
          //通知列表更新收藏状态
          useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_COUNT_CMD, {
            mid: params.mid,
            mf: this.hot_data[i].mf,
            type: "set_status",
          });
        }
      });
      let info = {};
      info["点击状态"] = mf ? "取消收藏" : "收藏";
      this.send_zhuge_event("PC_热门推荐_收藏点击", info);
    },

    /**
     * @description: 收藏图标鼠标进入
     */
    collect_enter(index) {
      if (!this.hot_data[index].mf) {
        this.hot_data[index].color =
          this.get_theme == "theme01" ? "#666" : "#ABBAC8";
      }
    },

    /**
     * @description: 收藏图标鼠标移出
     */
    collect_leave(index) {
      if (!this.hot_data[index].mf) {
        this.hot_data[index].color =
          this.get_theme == "theme01" ? "#999" : "#5A6074";
      }
    },

    /**
     * @description:
     * @param {}
     * @return {undefined} undefined
     */
    go_detail(item) {
      this.send_zhuge_event("PC_热门推荐_详情页入口点击");
      this.$router.push({
        name: "details",
        params: {
          mid: item.mid,
          tid: item.tid,
          csid: item.csid,
        },
      });
      this.save_match_info(item);
    },

    /**
     * @description: 跳转统计页
     * @param {Object} match 当前轮播子项数据
     */
    navigate(match) {
      let url = this.get_full_sr_url(match);

      let _window_width = 1000;
      let _window_height = 650;
      let _window_offset_left = (screen.width - _window_width) / 2;
      let _window_offset_top = (screen.height - _window_height) / 2;
      window.open(
        url,
        "",
        `height=${_window_height}, width=${_window_width}, top=${_window_offset_top}, left=${_window_offset_left}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
      );
    },

    // sr 分析数据点击跳转
    sr_click_handle(match, type) {
      if (type == "details") {
        // 发送埋点事件
        ZHUGE.send_zhuge_event("PC_情报分析");
      } else if (type == 1) {
        ZHUGE.send_zhuge_event("PC_热门推荐_赛事分析点击");
      }
      details.sr_click_handle(match);
    }

  },
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
  font-weight: 500;
  .hot-title {
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
/* ************** 中小屏 *************** -S */
.screen-medium,
.screen-min {
  .carousel {
    :deep(.q-carousel) {
      padding: 30px 15px 40px;
    }
  }
}

/* ************** 中小屏 *************** -E */
/* ************** 轮播 *************** -S */
.carousel {
  :deep(.q-carousel) {
    padding: 30px 40px 40px 40px;
    height: auto;
    background: transparent;
    .scroll {
      overflow: unset;
    }
    .q-carousel__slide {
      padding: 0;
    }
  }

  /* ************** 赛事详情 *************** -S */
  .info {
    display: flex;
    margin-bottom: 5px;
    .info-botn {
      display: flex;
      flex: 1;
      flex-flow: column;
      overflow: hidden;
      .logo {
        margin: 0 auto 14px;
        .img-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;

          img {
            max-width: 40px;
            max-height: 40px;
            width: 40px;
          }
          &.logo-double {
            margin-left: -8px;
          }
        }
      }
      & > div {
        display: flex;
        justify-content: center;
      }
    }
    .info-score {
      display: flex;
      flex: 1;
      flex-flow: column;
      justify-content: center;
      overflow: hidden;
      text-align: center;
      .info-title {
        display: flex;
        flex-flow: column;
        font-size: 14px;
        .title {
          margin-bottom: 2px;
        }
        :deep(.c-match-process) {
          justify-content: center;
        }
      }
      .item {
        margin-top: 10px;
        font-size: 18px;
      }
    }
  }

  /* ************** 赛事详情 *************** -E */
  /* ************** 投注项 *************** -S */
  .handicap {
    display: flex;
    margin: 19px 0 10px 0;
    height: 40px;
    .handicap-item {
      flex: 1;
      overflow: hidden;
      margin-right: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      background: #22262f;
      border-radius: 6px;
      &:last-child {
        margin-right: 0;
      }
      
      :deep(.c-bet-item.active ){
          .play-name {
            color: var(--q-gb-t-c-18) !important;
          }
        }
        :deep(.handicap-wrap){
          flex: 1;
          min-width: 1px;
        }
        :deep(.odds){
          justify-content: flex-end;
        }
      
    }
    .os-1:hover {
      border: 1px solid #666b7d;
    }
  }

  /* ************** 投注项 *************** -E */
  /* ************** 收藏、跳转、统计 *************** -S */
  .more-handel {
    display: flex;
    justify-content: space-between;

    div {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      background: #22262f;
      cursor: pointer;
    }
    .wrap-icon {
      margin-right: 10px;
      width: 40px;
      height: 40px;
      border: 1px solid var(--q-gb-bd-c-8);
      border-radius: 6px;
      &.hot {
        margin-right: auto;
        margin-left: 10px;
      }
      &:hover {
        border: 1px solid var(--q-gb-bd-c-8);
        &.hot {
          i {
            color: #abbac8 !important;
          }
        }
      }
    }
    .view-more {
      flex: 1;
      margin-right: 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
      &.full {
        width: 423px;
      }
      &:hover {
        border: 1px solid var(--q-gb-bd-c-8);
      }
    }
  }

  /* ************** 收藏、跳转、统计 *************** -E */
  /* ************** 轮播icon *************** -S */
  .control {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
    .btn {
      min-width: 16px;
      height: 16px;
      cursor: pointer;
      // display: none;
      margin-right: 10px;
      &.right {
        transform: rotate(180deg);
      }
    }
    .control-item {
      margin-right: 10px;
      width: 12px;
      height: 6px;
      border-radius: 4px;
      background: #272a33;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
    }
    .active {
      width: 40px;
    }
  }

  /* ************** 轮播icon *************** -E */
  :deep(.date-wrap) {
    display: flex;
    flex-wrap: nowrap;

    align-content: space-between;
    align-items: center;
    .timer-layout2 {
      width: 100%;
    }
  }
}
</style>
