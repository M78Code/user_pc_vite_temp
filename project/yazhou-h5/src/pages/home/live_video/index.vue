<!--
 * @Author: 
 * @Date: 
 * @Description: 视频直播 列表文件
-->
<template>
  <div class="live-video">
    <template v-if="tabList.length>0">
      <!--  上方tab选项卡  -->
      <div class="video-tabs">
        <div class="tabs-bar">
          <div class="tabs-bar-nav a3" ref="scrollBox">
            <template v-for="(tab, index) in tabList">
              <div class="tabs-tab"
                   v-if="tab.field1 == -6 && _.get(get_access_config,'collectSwitch') || tab.field1 != -6"
                   :key="index"
                   ref="scrollItem"
                   :class="[tab_Index == index ? 'tabs-active' : '']"
                   @click="changeTab(tab, index)"
              >
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
        <div class="left-menu" >
          <q-scroll-area :thumb-style="{ display: 'none' }">
            <div
              class="item"
              :class="{'active': index == menu_index}"
              v-for="(item, index) in tabList[tab_Index].subList"
              :key="index"
              @click="change_menu(index, item.field1)"
            >
              <!-- 联赛icon -->
              <img class="match_logo" v-if="index != 0"
                   :src=" item.field2 && get_file_path(item.field2)"
                   @error="league_icon_error"
              />
              <!--<img class="match_logo" v-else  src="image/wwwassets/bw3/svg/home/all.svg" alt="">-->
              <i v-else class="match_logo"></i>
              <span class="label">{{ item.name }}</span>
            </div>
          </q-scroll-area>
        </div>
        <!-- 右侧主列表页 -->
        <div class="match-content">
          <div class="right_main_list" ref="scrollArea" @scroll="wrapper_scroll_handler">
            <div class="video_list"
                 v-for="(item, index) in carousel_data.list"
                 :key="index"
                 :ref="'mid-' + item.mid"
                 @click="goto_detail_video(item)"
            >
              <div class="video_list_left" :style="{backgroundImage: 'url(' + (item.mgif ? item.mgif : `${ $g_image_preffix }/image/bw3/png/live_loading.png`) + ')'}">
                <div class="player">
                  <img  src="image/bw3/svg/home/play.svg" alt="">
                  <span>{{ item.plnum | money_filter}}</span>
                </div>
                <img 
                    v-if="_.get(get_access_config,'collectSwitch')"
                    :src="item.mf ? (!_.get(get_user, 'favoriteButton') && get_theme.includes('y0') ? y0_img_favorite_black:`${ $g_image_preffix}/image/bw3/svg/home/pentagram_s.svg`) : `${ $g_image_preffix }/image/bw3/svg/home/pentagram.svg`" @click.stop="on_collection(item)">
              </div>
              <div class="video-list-right">
                <div class="video-describe">
                  <span v-if="item.ms != 110">{{ item | format_total_score(0)}}-{{ item | format_total_score(1)}}</span>
                  {{ item.mhn }} v {{ item.man }}
                </div>
                <div class="score-time">
                  <div class="time relative-position">
                    <!-- 倒计时组件 -->
                    <counting-down
                      :title="item.ms == 0? i18n.t('list.match_no_start') :match_period_map(item)"
                      :mmp="item.mmp"
                      :m_id="item.mid"
                      :second="item.mst"
                      :match="item"
                      :is_add="[1,4,11,14,100,101,102,103].includes(+item.csid)"
                    />
                  </div>
                  <div class="score">
                    <span>{{ _.get(get_access_config, 'handicapNum') ? item.mc: i18n.t('footer_menu.more') }}</span>
                    <span v-if="_.get(get_access_config,'handicapNum')">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <SLive v-if="loading"/>
    
    <!-- 没有数据 组件 -->
    <no-data v-if="noMenu" :which='no_menu_txt' height='500' class="no-list"></no-data>
    
    <!-- 回到顶部按钮组件 -->
    <scroll-top
        v-show="!get_is_show_menu && list_scroll_top > 0"
        ref="scroll_top"
        :list_scroll_top="list_scroll_top"
        @back-top="scroll_top"
    />
  </div>
</template>

<script setup>
import { api_common } from "src/project/api/index";
// import { mapGetters, mapMutations } from "vuex";
import match_list_mixin from "src/project/mixins/match-list/match-list-mixin";
import skt_live_bw3 from "src/public/mixins/websocket/data/skt-live-bw3.js";
import msc from "src/public/mixins/common/msc.js";
import ListMap from "src/public/utils/list-map";
import common from "src/project/mixins/constant";
import utils from "src/core/utils/utils.js";
import SLive from "src/project/components/skeleton/live"
import no_data from 'src/project/components/common/no-data'
import scroll_top from 'src/project/components/record-scroll/scroll-top'
import counting_down from 'src/project/components/common/counting-down'

  //右侧菜单内容
  const carousel_data = ref({list:[],obj:{}}) 
  // 头部选项卡下标
  const tab_Index = ref(1)  
  // tab选项卡内容
  const tabList = ref([])  
  // 左侧菜单选中项 
  const menu_index = ref(0)  
  // 有没有菜单数据
  const noMenu = ref(false)  
  //没有数据展示
  const no_menu_txt = ref("nolive")  
  // 代表 是否在收藏菜单下
  const is_collect = ref(false)  
  // 加载动画
  const loading = ref(true) 
  // 代表的是联赛id  tid
  const field_tid = ref('') 
  const y0_img_favorite_black = ref("image/wwwassets/bw3/common/m-list-favorite-s-y0.svg") 
  // 赛事列表滑动高度
  const list_scroll_top = ref(0)  
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
  get_init(1)
  
  watch(() => tab_Index, (index) => {
      utils.tab_move2(index, $refs.scrollBox)
      if (index == 0) {   //收藏时显示暂无收藏,非收藏时显示暂无直播赛事
        no_menu_txt = 'collect'
      } else {
        // 显示暂无直播赛事
        no_menu_txt = 'nolive'
      }
    })
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
    /**
     * @description: 赛事列表回到顶部
     */
    const back_top = () => {
      $refs.scrollArea && $refs.scrollArea.scrollTo(0,0)
    }
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
    const league_icon_error = ($event) =>{
      if(get_theme.includes('theme02')){
        $event.target.src = 'image/bw3/svg/match_cup_black.svg'
      } else {
        $event.target.src = 'image/bw3/svg/match_cup.svg'
      }
      $event.target.onerror = null
    }
    // 点击视频界面跳转到详情播放视频
    const goto_detail_video = (match) => {
      const match_info = {
        mid: match.mid,
        top: $refs['mid-' + match.mid][0].getBoundingClientRect().top,
        sport_id: match.csid,
        is_collect: is_collect
      }
      set_goto_detail_matchid(match.mid);
      // 进入详情页前，记录目标赛事信息
      set_goto_detail_match_info(match_info);
      set_details_item(0);
      sessionStorage.setItem('video_details', true)
      $router.push({name:'category', params: {mid: match.mid, csid: match.csid}});
      // 播放视频操作
      set_play_video(true)
      set_show_video(true)
    }
    // 切换头部菜单选项卡
    const changeTab = (tab, index) => {
      if(tab.count === 0) {
        $toast(i18n.t('home.no_favorite_events'), 1000)
        return
      }
      if (tab_Index == index) return
      tab_Index = index
      noMenu = false
      scroll_top()
      // tab.sportId -6代表是 收藏选项卡
      if (tab.sportId == -6) {
        is_collect = true // 是在收藏菜单下
        // 调用 收藏列表接口
        video_collect_list(api_common.get_collect_live_matchs)
      } else {
        is_collect = false // 不在收藏菜单下
        // 调用 直播视频列表接口
        video_collect_list(api_common.get_videos, tab.field1)
      }

      menu_index = 0
    }
    // 收藏 接口
    const on_collection = (item) => {
      if( !utils.judge_collectSwitch( _.get(get_access_config,'collectSwitch'),this) ) return

      let params = {
        cuid: uid, //用户ID/或UUid
        mid: item.mid,
        cf: item.mf ? 0 : 1
      };
      // 如果是收藏，则取消收藏 , 否则 添加收藏
      api_common.add_or_cancel_match(params).then(({code,msg})=>{
        if (code === 200) {
          item.mf = !item.mf
          get_menu_videos_list().then(() => {
            // is_collect 代表是 在收藏菜单栏下, 调用收藏列表接口
            if (is_collect) {
              // 如果在收藏菜单栏,左侧 不是在全部菜单下, 调用收藏部分列表接口
              if (menu_index != 0){
                video_collect_list(api_common.get_collect_live_matchs,'', item.tid).then( data => {
                  //  没有数据的时候，再去调用全部的菜单栏接口
                  if(!data.list.length ) {
                    menu_index = 0
                    noMenu = false
                    video_collect_list(api_common.get_collect_live_matchs)
                  }
                })
              }else { // 左侧 是在全部菜单下, 调用全部收藏列表接口
                video_collect_list(api_common.get_collect_live_matchs)
              }
            }
          })
        }else if (msg) {
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
        cuid: uid, //用户ID
        csid: csid ? csid : '', // 球类ID    传空是所有  1 足球，2 篮球 5 网球，7 斯诺克    8乒乓球  10 羽毛球 4 冰球 3 棒球  9 排球 6 美式足球
        tid: tid ? tid : '',  // 联赛ID
      };
      return new Promise((resolve, reject) => {
        url(params).then(({code, data}) => {
          if (code === 200) {
            if (!data.length) {
              noMenu = true
              carousel_data = []
            }
            carousel_data = new ListMap("mid", data)
            resolve(carousel_data)
          }
        }).catch(err => {
          reject(err)
          no_wifi()
        }).finally(() => {
          loading = false
        });
      })
    }
    /**
     * @description: 获取头部 菜单选项卡
     */
    const get_menu_videos_list = (item) => {
      return new Promise((resolve, reject) => {
        if (!uid) return
        item == 1 ? loading = true : loading = false
        api_common.get_menu_videos({cuid: uid}).then(res => {
          const code = _.get(res,'code');
          const data = _.get(res,'data');
          // loading = false
          if (code === 200) {
            if (data.length){
              // 手动添加 左侧菜单 第一个 选项卡（全部）
              data.forEach(item => {
                if(item.subList.length) {
                  item.subList.unshift({
                    field1: '',
                    name: i18n.t('footer_menu.all'),
                  });
                }
              })
              tabList = data
              noMenu = false
              $forceUpdate()
              resolve(tabList)
            }else{
              noMenu = true
              tabList = []
              loading = false
            }
          }
        }).catch(err => {
          no_wifi()
          loading = false
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
        if (data.length >= 1){
          const {mid, top, sport_id, is_collect} = get_goto_detail_match_info

          // 存在mid时，才更新tab_Index
          if (mid) {
            let tab_index = tabList.findIndex(item => item.field1 === sport_id)
            tab_Index = tab_index > -1 ? tab_index : 1
          }

          // 若之前是收藏下的列表，则更新相应状态
          if (is_collect) {
            tab_Index = 0
            is_collect = true
          }
          // is_collect 代表是 在收藏菜单栏下, 调用收藏列表接口
          if (is_collect) {
            video_collect_list(api_common.get_collect_live_matchs, '', field_tid ? field_tid : '')
                .then(res => {
                  set_match_scroll_top(mid, top)
                  set_goto_detail_match_info({})
                })
          } else {
            // !is_collect 不是在收藏菜单选项卡时，调用 直播视频列表
            video_collect_list(api_common.get_videos, data[tab_Index].field1, field_tid ? field_tid : '')
                .then(res => {
                  set_match_scroll_top(mid, top)
                  set_goto_detail_match_info({})
                })
          }
        }
      }).catch( err => {
        no_wifi()
        console.error(err);
      })
    }
    /**
     * @description: 切换左侧菜单
     * @param {String} index 选中下标
     */
    const change_menu = (index, field1) => {
      scroll_top()
      // 如果点击的左侧菜单下标相等，则return 不再执行下边方法
      if (menu_index == index) return
      field_tid = field1 ? field1 : ''
      menu_index = index
      // 代表是 在收藏菜单栏下
      if(is_collect){
        video_collect_list(api_common.get_collect_live_matchs, '', field1)
      } else { // 不是收藏菜单时，调用 直播视频列表
        video_collect_list(api_common.get_videos, tabList[tab_Index].field1, field1)
      }
    }
    // 回到顶部
    const scroll_top = () => {
      $refs.scrollArea && ($refs.scrollArea.scrollTop = 0)
    }
    // 由详情返回后，列表滚动至之前位置
    const set_match_scroll_top = (mid, top) => {
      if (!mid) {
        return
      }

      const match_dom = $refs['mid-' + mid][0]

      if (match_dom) {
        $refs.scrollArea.scrollTop = match_dom.getBoundingClientRect().top - top
      }
    }
    // 没有网络的情况下，初始化页面数据
    const no_wifi = () => {
      if(!get_user_token){
        no_menu_txt = "noMatch"
        useMittEmit(MITT_TYPES.EMIT_GO_TO_VENDER);
      }else{
        no_menu_txt = "noMatch"
      }
      carousel_data = []
      tabList = []
      noMenu = true
    }
  // computed: {
  //   ...mapGetters({
  //     uid: "get_uid",
  //     get_theme: "get_theme",
  //     get_user: "get_user",
  //     get_user_token:'get_user_token',
  //     get_goto_detail_match_info:'get_goto_detail_match_info',
  //     get_home_tab_item:'get_home_tab_item',
  //     get_access_config:'get_access_config',
  //     get_is_show_menu:"get_is_show_menu",
  //   })
  // },
  // 如果有视频列表数据，则页面销毁时，清除内存
  onUnmounted(() => {
    if(_.get(carousel_data, 'list.length')) {carousel_data.destroy()}

    // 不是跳转到详情则清除赛事信息
    if (get_home_tab_item.index !== 2) {
      set_goto_detail_match_info({})
    }

    // for (const key in $data) {
    //   $data[key] = null
    // }
  })

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

        > span {
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

          > div {
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
    max-width:3.78rem;
    margin: 0 auto;

    ::v-deep.q-scrollarea {
      height: 100%;
    }
  }

  .left-menu {
    padding-top: 0.1rem;
    width: 0.8rem;
    margin-right: 0.12rem;

    ::v-deep .absolute-right {
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

        &[lazy="loading"] {

        }

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

        > img {
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

          > span {
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

            ::v-deep.counting-down-wrap {
              height: 0.16rem;

              .counting {
                color: var(--q-color-fs-color-30) !important;
              }
            }

            > span:nth-child(2) {
              margin-left: 0.06rem;
              ont-family: DIN-Regular;
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

            > span {
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

  ::v-deep .no-list {
    position: fixed;
    top: 1.15rem;
    left: 0;
    right: 0;
    bottom: 50%;
  }
}
</style>
