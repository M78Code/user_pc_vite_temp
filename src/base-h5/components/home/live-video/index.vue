<!--
 * @Author:
 * @Date:
 * @Description: 视频直播 列表文件
-->
<template>
  <div class="live-video">
    <template v-if="tabList.length > 0">
      <!--  上方tab选项卡  -->
      <div class="video-tabs">
        <div class="tabs-bar">
          <div class="tabs-bar-nav a3" ref="scrollBox">
            <template v-for="(tab, index) in tabList">
              <div class="tabs-tab" v-if="tab.field1 == -6 && GlobalAccessConfig.get_collectSwitch() || tab.field1 != -6"
                :key="index" ref="scrollItem" :class="[tab_Index == index ? 'tabs-active' : '']"
                @click="changeTab(tab, index)">
                <div>
                  {{ tab.name }}
                </div>
                <span>{{ tab.count }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- 视频主列表内容 -->
      <div class="match-warp" v-if="carousel_data.list.length">
        <!-- 左侧侧边栏菜单 -->
        <div class="left-menu">
          <q-scroll-area :thumb-style="{ display: 'none' }">
            <div class="item" :class="{ 'active': index == menu_index }"
              v-for="(item, index) in tabList[tab_Index].subList" :key="index" @click="change_menu(index, item.field1)">
              <!-- 联赛icon -->
              <img class="match_logo" v-if="index != 0" :src="item.field2 && get_server_file_path(item.field2)"
                @error="league_icon_error" />
              <!--<img class="match_logo" v-else  :src="`${LOCAL_PROJECT_FILE_PREFIX}image/svg/home/all.svg`" alt="">-->
              <i v-else class="match_logo"></i>
              <span class="label">{{ item.name }}</span>
            </div>
          </q-scroll-area>
        </div>
        <!-- 右侧主列表页 -->
        <div class="match-content">
          <div class="right_main_list" ref="scrollArea" @scroll="wrapper_scroll_handler">
            <div class="video_list" v-for="(item, index) in carousel_data.list" :key="index"
              :ref="(el) => mid_refs[item.mid] = el" @click="goto_detail_video(item, index)">
              <div class="video_list_left"
                :style="{ backgroundImage: 'url(' + (item.mgif ? item.mgif : `${LOCAL_PROJECT_FILE_PREFIX}/image/png/live_loading.png`) + ')' }">
                <div class="player">
                  <img :src="`${LOCAL_PROJECT_FILE_PREFIX}image/svg/home/play.svg`" alt="">
                  <span>{{ $filters.money_filter(item.plnum) }}</span>
                </div>


                <img class="img" v-if="GlobalAccessConfig.get_collectSwitch()"
                  :src="item.mf ? compute_img_url('icon-favorite-s') : compute_img_url('icon-favorite')"
                  @click.stop="on_collection(item)">
              </div>
              <div class="video-list-right">
                <div class="video-describe">
                  <span v-if="item.ms != 110">{{ format_total_score(item, 0) }}-{{ format_total_score(item, 1) }}</span>
                  {{ item.mhn }} v {{ item.man }}
                </div>
                <div class="score-time">
                  <div class="time relative-position">
                    <!-- 倒计时组件 -->
                    <counting-down
                      :title="item.ms == 0 ? i18n_t('list.match_no_start') : matchListClass.match_period_map(item)"
                      :mmp="item.mmp" :m_id="item.mid" :second="item.mst" :match="item"
                      :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+item.csid)" />
                  </div>
                  <div class="score">
                    <span>{{ GlobalAccessConfig.get_handicapNum() ? item.mc : i18n_t('footer_menu.more') }}</span>
                    <span v-if="GlobalAccessConfig.get_handicapNum()">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <SLive v-if="loading" />

    <!-- 没有数据 组件 -->
    <no-data v-if="noMenu" :which='no_menu_txt' height='500' class="no-list"></no-data>

    <!-- 回到顶部按钮组件 -->
    <scrollTop v-show="!get_is_show_menu && list_scroll_top > 0" ref="scroll_top" :list_scroll_top="list_scroll_top"
      @back-top="scroll_top" />
  </div>
</template>

<script setup>
import { api_common } from "src/api";
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
// import { mapGetters, mapMutations } from "vuex";
// import match_list_mixin from "src/base-h5/mixins/match-list/match-list-mixin";
// import skt_live_bw3 from "src/base-h5/mixins/websocket/data/skt-live-bw3.js";
// import common from "src/base-h5/mixins/constant";
// import msc from "src/base-h5/mixins/common/msc.js";
import ListMap from "src/core/match-list-h5/match-class/list-map.js";
import {  get_server_file_path, UserCtr, MatchDetailCalss, compute_img_url } from 'src/output/index.js';
import SLive from "src/base-h5/components/skeleton/live.vue"
import noData from 'src/base-h5/components/common/no-data.vue'
import scrollTop from 'src/base-h5/components/common/record-scroll/scroll-top.vue'
import countingDown from 'src/base-h5/components/common/counting-down.vue'
import { format_total_score } from "src/output/index.js"
import matchListClass from 'src/core/match-list-h5/match-class/match-list.js'
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import { useRouter } from "vue-router";
import { project_name ,LOCAL_PROJECT_FILE_PREFIX} from "src/output/index.js";
const router = useRouter()
const scrollBox = ref(null) //dom
let mid_refs = {} //dom map
//右侧菜单内容
let carousel_data = ref({ list: [], obj: {} })
// 头部选项卡下标
let tab_Index = ref(1)
// tab选项卡内容
let tabList = ref([])
// 左侧菜单选中项
let menu_index = ref(0)
// 有没有菜单数据
let noMenu = ref(false)
//没有数据展示
let no_menu_txt = ref("nolive")
// 代表 是否在收藏菜单下
let is_collect = ref(false)
// 加载动画
let loading = ref(true)
// 代表的是联赛id  tid
let field_tid = ref('')
// 赛事列表滑动高度
let list_scroll_top = ref(0)
// 锚点
let scrollArea = ref(null)

// ws，数据仓库 混入 TODO: 后续修改调整
// mixins:[ match_list_mixin, skt_live_bw3, common, msc],
// components: {
//   "no-data": no_data,
//   "scroll-top": scroll_top,
//   "counting-down": counting_down,
//   SLive
// },
// computed: {
//   ...mapGetters({
//     uid: "get_uid",
//     UserCtr: "UserCtr",
//     UserCtr_token:'UserCtr_token',
//     get_goto_detail_match_info:'get_goto_detail_match_info',
//     get_home_tab_item:'get_home_tab_item',
//     get_access_config,
//     get_is_show_menu:"get_is_show_menu",
//   })
// },
// ...mapMutations([
//   // 设置去详情的赛事id
//   'set_goto_detail_matchid',
//   // 设置去详情的赛事信息
//   'set_goto_detail_match_info',
//   // 设置默认的选中的玩法id:0
//   'set_details_item',
//   // 直播进入详情,设置视频播放
//   'set_play_video',
//   // 设置视频是否播放
//   'set_show_video',
//   'set_toast'
// ]),

watch(() => tab_Index.value, (index) => {
  tab_move2(index, scrollBox.value)
  if (index == 0) {   //收藏时显示暂无收藏,非收藏时显示暂无直播赛事
    no_menu_txt.value = 'collect'
  } else {
    // 显示暂无直播赛事
    no_menu_txt.value = 'nolive'
  }
})
/**
 * @description: 更新赛事列表滚动高度
 */
const wrapper_scroll_handler = (e) => {
  if (e) {
    list_scroll_top = e.target.scrollTop
  }
}
/**
 * @description: 图标出错时
 * @param {Object} $event 错误事件对象
 */
const league_icon_error = ($event) => {
  $event.target.src = compute_img_url("match-up")
  $event.target.onerror = null
}
// 点击视频界面跳转到详情播放视频
const goto_detail_video = (match) => {
  const match_info = {
    mid: match.mid,//赛事id
    top: mid_refs[match.mid].getBoundingClientRect().top,
    tid: match.tid,
    sportId: match.csid || '',//球类id
    media_type: "auto", // 直播类型
    is_collect: is_collect.value
  }
  // mid: "", //赛事id
  //     tid: "", // 联赛 id
  //     sportId: "", //球类id
  //     media_type: "auto", // 直播类型
  //     time: Date.now()
  MatchDetailCalss.set_match_details_params(match_info)

  // set_goto_detail_matchid(match.mid);
  // 进入详情页前，记录目标赛事信息
  //TODO  set_goto_detail_match_info(match_info);
  // set_details_item(0);

  sessionStorage.setItem('video_details', true)
  router.push({ name: 'category', params: { mid: match.mid, csid: match.csid } })
  //播放视频信息类型
  MatchDetailCalss.set_play_media({
    mid: match.mid,
    media_type: "auto",// 直播类型
    is_auto: true,
    time: Date.now()
  })

  // set_play_video(true)
  // set_show_video(true)
}
// 切换头部菜单选项卡
const changeTab = (tab, index) => {
  if (tab.count === 0) {
    $toast(i18n_t('home.no_favorite_events'), 1000)
    return
  }
  if (tab_Index.value == index) return
  tab_Index.value = index
  noMenu.value = false
  scroll_top()
  // tab.sportId -6代表是 收藏选项卡
  if (tab.sportId == -6) {
    is_collect.value = true // 是在收藏菜单下
    // 调用 收藏列表接口
    video_collect_list(api_common.get_collect_live_matchs)
  } else {
    is_collect.value = false // 不在收藏菜单下
    // 调用 直播视频列表接口
    video_collect_list(api_common.get_videos, tab.field1)
  }

  menu_index.value = 0
}
// 收藏 接口
const on_collection = (item) => {
  if (!judge_collectSwitch(GlobalAccessConfig.get_collectSwitch(), this)) return

  let params = {
    cuid: UserCtr.get_uid(), //用户ID/或UUid
    mid: item.mid,
    cf: item.mf ? 0 : 1
  };
  // 如果是收藏，则取消收藏 , 否则 添加收藏
  api_common.add_or_cancel_match(params).then(({ code, msg }) => {
    if (code == 200) {
      item.mf = !item.mf
      get_menu_videos_list().then(() => {
        // is_collect 代表是 在收藏菜单栏下, 调用收藏列表接口
        if (is_collect.value) {
          // 如果在收藏菜单栏,左侧 不是在全部菜单下, 调用收藏部分列表接口
          if (menu_index.value != 0) {
            video_collect_list(api_common.get_collect_live_matchs, '', item.tid).then(data => {
              //  没有数据的时候，再去调用全部的菜单栏接口
              if (!data.list.length) {
                menu_index.value = 0
                noMenu.value = false
                video_collect_list(api_common.get_collect_live_matchs)
              }
            })
          } else { // 左侧 是在全部菜单下, 调用全部收藏列表接口
            video_collect_list(api_common.get_collect_live_matchs)
          }
        }
      })
    } else if (msg) {
      set_toast({ 'txt': msg });
    }
  }).catch(err => {
    console.error(err);
  });
}
/**
 * @description: 收藏 和 直播列表的接口数据,
 *  @param {String} (收藏列表接口 url 是 get_collect_live_matchs) (直播列表 url是   get_videos)
 */
const video_collect_list = (url, csid, tid) => {
  let params = {
    cuid: UserCtr.get_uid(), //用户ID
    csid: csid ? csid : '', // 球类ID    传空是所有  1 足球，2 篮球 5 网球，7 斯诺克    8乒乓球  10 羽毛球 4 冰球 3 棒球  9 排球 6 美式足球
    tid: tid ? tid : '',  // 联赛ID
  };
  return new Promise((resolve, reject) => {
    url(params).then(({ code, data }) => {
      if (code == 200) {
        if (!data.length) {
          noMenu.value = true
          carousel_data.value = []
        }

        carousel_data.value = new ListMap("mid")
        carousel_data.value.setList(data);
        resolve(carousel_data.value);
      }
    }).catch(err => {
      reject(err)
      no_wifi()
    }).finally(() => {
      loading.value = false
    });
  })
}
/**
 * @description: 获取头部 菜单选项卡
 */
const get_menu_videos_list = (item) => {
  return new Promise((resolve, reject) => {
    if (!UserCtr.get_uid()) return
    item == 1 ? loading.value = true : loading.value = false
    api_common.get_menu_videos({ cuid: UserCtr.get_uid() }).then(res => {
      const code = lodash.get(res, 'code');
      const data = lodash.get(res, 'data');
      // loading = false
      if (code == 200) {
        if (data.length) {
          // 手动添加 左侧菜单 第一个 选项卡（全部）
          data.forEach(item => {
            if (item.subList.length) {
              item.subList.unshift({
                field1: '',
                name: i18n_t('footer_menu.all'),
              });
            }
          })
          tabList.value = data
          noMenu.value = false
          // $forceUpdate()
          resolve(tabList.value)
        } else {
          noMenu.value = true
          tabList.value = []
          loading.value = false
        }
      }
    }).catch(err => {
      no_wifi()
      loading.value = false
      reject(err)
    });
  })
}
/**
 * @description: 页面刚刚进来时执行方法 获得菜单数据后， 再获取视频直播赛事的数据
 */
const get_init = (load_first) => {
  get_menu_videos_list(load_first).then((data) => {
    // 如果菜单栏长度>=1,代表有球类，可以调用接口
    if (data.length >= 1) {
      const { mid, top, sport_id, is_collect: _collect } = {}//get_goto_detail_match_info

      // 存在mid时，才更新tab_Index
      if (mid) {
        let new_tab_index = tabList.value.findIndex(item => item.field1 === sport_id)
        tab_Index.value = new_tab_index > -1 ? new_tab_index : 1
      }

      // 若之前是收藏下的列表，则更新相应状态
      if (_collect) {
        tab_Index.value = 0
        is_collect.value = true
      }
      // is_collect 代表是 在收藏菜单栏下, 调用收藏列表接口
      if (is_collect.value) {
        video_collect_list(api_common.get_collect_live_matchs, '', field_tid.value)
          .then(res => {
            set_match_scroll_top(mid, top)
            // set_goto_detail_match_info({})
          })
      } else {
        // !is_collect 不是在收藏菜单选项卡时，调用 直播视频列表
        video_collect_list(api_common.get_videos, data[tab_Index.value].field1, field_tid.value)
          .then(res => {
            set_match_scroll_top(mid, top)
            // set_goto_detail_match_info({})
          })
      }
    }
  }).catch(err => {
    no_wifi()
    console.error(err);
  })
}
/**
 * @description: 切换左侧菜单
 * @param {String} index 选中下标
 */
const change_menu = (index, field1) => {
  mid_refs = {} //重置dom
  scroll_top()
  // 如果点击的左侧菜单下标相等，则return 不再执行下边方法
  if (menu_index.value == index) return
  field_tid.value = field1 ? field1 : ''
  menu_index.value = index
  // 代表是 在收藏菜单栏下
  if (is_collect.value) {
    video_collect_list(api_common.get_collect_live_matchs, '', field1)
  } else { // 不是收藏菜单时，调用 直播视频列表
    video_collect_list(api_common.get_videos, tabList.value[tab_Index.value].field1, field1)
  }
}
// 回到顶部
function scroll_top() {
  scrollArea.value && scrollArea.value.scrollTo(0, 0)
}
// 由详情返回后，列表滚动至之前位置
const set_match_scroll_top = (mid, top) => {
  if (!mid) {
    return
  }
  const match_dom = mid_refs[mid]
  if (match_dom) {
    scrollArea.value.scrollTop = match_dom.getBoundingClientRect().top - top
  }
}
// 没有网络的情况下，初始化页面数据
const no_wifi = () => {
  if (!UserCtr.get_user_token()) {
    no_menu_txt.value = "noMatch"
    useMittEmit(MITT_TYPES.EMIT_GO_TO_VENDER);
  } else {
    no_menu_txt.value = "noMatch"
  }
  carousel_data.value = []
  tabList.value = []
  noMenu.value = true
}

// 如果有视频列表数据，则页面销毁时，清除内存
onUnmounted(() => {
  if (lodash.get(carousel_data.value, 'list.length')) { carousel_data.value.destroy() }
  //TODO 不是跳转到详情则清除赛事信息
  // if (get_home_tab_item.index !== 2) {
  //   set_goto_detail_match_info({})
  // }
})
get_init(1)
</script>

<style lang="scss" scoped>
.video-tabs {
  position: relative;
  padding-left: 0.1rem;

  .tabs-bar {
    padding: 0 0 0.04rem;
    position: relative;

    &:after {
      content: "";
      width: 120%;
      height: 1px;
      position: absolute;
      bottom: 0;
      left: -0.3rem;
    }

    .tabs-bar-nav {
      display: flex;
      align-items: center;
      overflow-x: auto;
      overflow-y: hidden;
      margin-top: 0.1rem;
      height: 0.4rem;

      .tabs-tab {
        position: relative;
        text-align: center;
        font-size: 0.14rem;
        padding-right: 0.32rem;
        display: flex;
        min-width: fit-content;

        &:nth-child(1) {
          margin-left: 0.08rem;
        }

        &:last-child {
          padding-right: 0 !important;
        }

        >span {
          font-size: 0.1rem;
          text-align: center;
          margin-left: 0.02rem;
          position: relative;
          top: 0;
          left: 0.02rem;
          z-index: 10;
          line-height: 1;
        }

        &.tabs-active {
          font-size: 0.14rem;
          font-weight: bold;
          padding-right: 0.08rem;
          position: relative;
          left: -0.08rem;

          >div {
            position: relative;
            border-radius: 0.16rem;
            padding: 0 0.07rem;
            height: 0.32rem;
            line-height: 0.32rem;
          }

          span {
            min-width: 0.2rem;
            border-radius: 0.07rem;
            font-size: 0.11rem;
            font-weight: inherit;
            top: 0.02rem;
            left: -0.09rem;
            height: 0.14rem;
            line-height: 0.17rem;
            display: block;
          }
        }
      }
    }
  }
}

.live-video {
  position: relative;

  .match-warp {
    display: flex;
    position: fixed;
    top: 0.9rem;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 0.1rem;
    max-width: 3.78rem;
    margin: 0 auto;

    :deep(.q-scrollarea) {
      height: 100%;
    }
  }

  .left-menu {
    padding-top: 0.1rem;
    width: 0.8rem;
    margin-right: 0.12rem;

    :deep(.absolute-right) {
      height: 200px !important;
    }

    .item {
      height: 0.4rem;
      display: flex;
      align-items: center;
      margin-bottom: 0.05rem;

      .match_logo {
        min-width: 0.16rem;
        width: 0.16rem;
        height: 0.16rem;
        margin-right: 0.05rem;
        margin-left: 0.06rem;
      }

      .label {
        margin-top: 0.03rem;
        font-size: 0.12rem;
        line-height: 0.16rem;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      &.active {
        border-radius: 0.04rem;

        .label {
          font-size: 0.13rem;
          font-weight: bold;
        }
      }
    }
  }

  .match-content {
    width: 2.6rem;

    .right_main_list {
      padding-top: 0.25rem;
      overflow-y: auto;
      height: 100%;
    }

    .video_list {
      height: 0.67rem;
      display: flex;
      align-items: center;
      margin-bottom: 0.3rem;

      .video_list_left {
        width: 1.19rem;
        height: 0.67rem;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 0.1rem;
        border-radius: 0.05rem;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        background-color: var(--q-color-com-bg-color-28);
        padding: 0 0.07rem 0.05rem;

        &[lazy="loading"] {}

        .player {
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 0.16rem;
            height: 0.12rem;
            margin-right: 0.05rem;
          }

          span {
            font-size: 0.12rem;
            line-height: 0.12rem;
          }
        }

        >img {
          width: 0.16rem;
          height: 0.149rem;
        }
      }

      .video-list-right {
        width: 1.3rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;

        .video-describe {
          font-size: 0.14rem;
          font-weight: 700;
          letter-spacing: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          margin-bottom: 0.05rem;
          line-height: 0.2rem;

          >span {
            font-size: 0.14rem;
            letter-spacing: 0;
            line-height: 0.2rem;
            font-weight: 500;
          }
        }

        .score-time {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.12rem;
          height: 0.16rem;

          .time {
            width: 0.8rem;
            height: 100%;

            :deep(.counting-down-wrap) {
              height: 0.16rem;

              .counting {
                color: var(--q-color-fs-color-30) !important;
              }
            }

            >span:nth-child(2) {
              margin-left: 0.06rem;
              font-family: DIN-Regular;
              text-align: left;
              line-height: 16px;
            }
          }

          .score {
            text-align: center;
            padding: 0 0.06rem;
            height: 0.16rem;
            line-height: 0.16rem;
            border-radius: 0.04rem;
            font-size: 0.12rem;
            box-sizing: border-box;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;

            >span {
              //height: 0.16rem !important;
              display: flex;
              align-items: flex-end;

              &:first-child {
                height: 100%;
                line-height: 0.12rem;
                font-size: 0.12rem;
              }

              &:nth-child(2) {
                font-size: 0.1rem;
                line-height: 0.13rem;
              }
            }
          }
        }
      }
    }
  }

  :deep(.no-list) {
    position: fixed;
    top: 1.15rem;
    left: 0;
    right: 0;
    bottom: 50%;
  }
}
</style>
