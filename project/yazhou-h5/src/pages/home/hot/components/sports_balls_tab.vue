<!--
 * @Description: 首页热门第1个tab 以外的 tab 选项卡页面
-->
<template>
  <div :class="tab_Index !=0 ? 'sports_balls_tab' : ''">
    <div @scroll="wrapper_scrolling">
      <!-- 第二个tab 榜单 骨架屏 -->
      <hot-list v-if="list_loading"></hot-list>
      <!-- 热门赛程 骨架屏-->
      <hot-schedule v-if="schedule_loading"></hot-schedule>
      <!-- 足球篮球tab的 赛程列表页面，match-main 是整一块列表页组件 -->
      <match-main v-show="guess_standings && !schedule_loading"
        invok_source="home_hot_page_schedule"
        :wrapper_scroll_top="wrapper_scroll_top">
      </match-main>
      <!-- 足球篮球tab的 榜单页 -->
      <template v-if="!guess_standings && !loading_standings_data">
        <!-- header 的tab选项卡 -->
        <div class="header">
          <div class="header-title">
            <div class="item ellipsis"
                 v-for="(tab, index) in balls_list"
                 :class="[tabIndex == tab.index ? 'active' : '']"
                 @click="changeTab(tab)"
                 :key="index">
              {{tab.key}}
            </div>
          </div>
          <!-- 榜单页 和 赛程列表页面 的切换    menuId == "30101"是 竞彩足球的 唯一字段-->
          <div class="header-icon"
               v-if='!get_hot_tab_item.chinaBetting'
               @click="leaderboard_switch"
          >
            {{guess_standings ? $root.$t('home_popular.ranking') : $root.$t('home_popular.quiz')}}
          </div>
        </div>

        <!-- 榜单公共表格 -->
        <public-form
          :allianc_list_index="allianc_list_index"
          :allianc_list="allianc_list"
          :tab_name_index="tab_name_index"
          :liat_data="liat_data"
          :public_form_title="public_form_title"
          @allianc-tab="alliancTab"
        />
      </template>
    </div>
    <!-- 没有数据 组件 -->
    <no-data v-if="loading_standings_data" which='noMatch' height='500' class="no-list"></no-data>
  </div>
</template>

<script>
import match_main from "src/project/pages/match-list/match_main";   // 赛事列表页用于展示滚球、今日、早盘、串关、冠军等赛事
import no_data from "src/project/components/common/no_data";    // 无网络展示组件
import {mapGetters} from "vuex";
import {api_home} from "src/project/api";
import hot_list from "src/project/components/skeleton/home_hot/hot_list";   // 热门榜单 骨架屏
import hot_schedule from "src/project/components/skeleton/home_hot/hot_schedule";   // 热门赛程 骨架屏
import public_form from "src/project/pages/home/hot/components/public_form.vue";    // 首页热门足球和 篮球的 公共榜单表格

export default {
  name: "sports_balls_tab",
  components: {
    'public-form' : public_form, // 足球篮球榜单组件
    "match-main": match_main, // 列表页组件
    "no-data": no_data, // 无数据组件
    "hot-list": hot_list, // 热门榜单 骨架屏
    "hot-schedule": hot_schedule, // 热门赛程 骨架屏
  },
  props:{
    tab_Index: Number
  },
  data() {
    return {
      // 篮球 西部联盟8     东部联盟9
      allianc_list: [],
      balls_list:[], // 排行榜 得分榜 表格的数据
      // 0 代表 积分榜  否则 是 赛事列表
      guess_standings: true,
      // 当前榜单选择的下标
      tabIndex: 0,
      // 西部联盟8 东部联盟9 选择的下标
      allianc_list_index: 0,
      // 积分榜的 切换 下标
      tab_name_index: 1,
      // 积分榜 的接口数据
      liat_data: null,
      public_form_title: null,
      loading_standings_data: false, // 有没有积分榜数据
      list_loading: false, // 榜单 骨架屏
      schedule_loading: false, // 热门赛程 骨架屏,
      wrapper_scroll_top:0, //当列表滚动时隐藏罚牌说明
    };
  },
  computed:{
    ...mapGetters({
      // 首页 热门当前选中的菜单
      get_hot_tab_item:"get_hot_tab_item",
      // 主题
      get_theme:"get_theme",
    })
  },
  watch: {
    'balls_list': {
      handler(n, o){
        if(n.length>0) {
          this.changeTab(n[0])
        }
        let alliance = n.filter(item => {
          // 过滤掉热门赛事：item.spell != 'HOT'
          if (item.type == 7 && item.value != null) {
            return item
          }
        })
        if(alliance && alliance[0]) {
          this.allianc_list = alliance[0].value
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.$root.$on(this.emit_cmd.EMIT_SHOW_HOT_SCHEDULE_LOADING,this.show_hot_schedule_loading)
    this.$root.$on(this.emit_cmd.EMIT_HOT_LEADERBOARD_SWITCH,this.leaderboard_switch)
    this.$root.$on(this.emit_cmd.EMIT_SET_SPORTS_BALLS_TAB,this.set_data_update_handle)
  },
  methods: {
    /**
     * 页面滚动时隐藏提示
     */
    wrapper_scrolling($event){
      //当列表滚动时隐藏罚牌说明
      this.wrapper_scroll_top = $event.target.scrollTop;
    },
    // 积分榜表格 接口
    async get_ranking_list(tid) { // tid 联赛id
      try {
        this.list_loading = true
        this.loading_standings_data = false
        let {code, data} = await api_home.get_ranking_by_tournamentId({tournmentId:tid, isPc:0 })
        this.list_loading = false
        if (code == 200 && data != null) {
          data.forEach( (item, index) => {item.index = index})
          this.balls_list = data
        }else{
          this.balls_list = []
          this.loading_standings_data = true
        }
      } catch (error) {
        this.list_loading = false
        this.loading_standings_data = true
        console.error(error);
      }
    },
    // 榜单页 和 赛程列表页面 的切换
    leaderboard_switch() {
      this.guess_standings = !this.guess_standings
      this.loading_standings_data = false
      if(!this.guess_standings){
        this.get_ranking_list(this.get_hot_tab_item.field2)
      }
      this.$forceUpdate()
    },
    // 数据更新  初始化 sports_balls_tab 的data 数据
    set_data_update_handle() {
      this.guess_standings = true
      this.allianc_list = []
      this.loading_standings_data = false
      this.liat_data = null
    },
    // 赛程骨架屏的 显示
    show_hot_schedule_loading(is_true) {
      if(is_true){
        this.schedule_loading = true
      }else{
        this.schedule_loading = false
      }
    },
    /**
     *  积分榜的 切换
     *  篮球  球队榜7 (西部联盟8     东部联盟9)        得分榜1      篮球助攻榜6    篮板榜3
     *  足球  积分榜4     足球助攻榜2      射手榜5
     */
    changeTab(tab) {
      this.tabIndex = tab.index
      this.public_form_title = tab
      if(tab.type == 7) {
        this.tab_name_index = 1
        if(tab.value){
          this.allianc_list = tab.value
          this.alliancTab({tab: tab.value[0], index: 0})
        }else{
          this.liat_data = null
        }
      }else if(tab.type == 4){
        this.tab_name_index = 3
        this.liat_data = tab.value
        this.allianc_list = []
      } else{
        this.tab_name_index = 2
        this.allianc_list = []
        if([1,2,3,5,6].includes(+tab.type)){
          this.liat_data = tab.value
        }
      }
    },
    // 西部联盟8     东部联盟9 切换
    alliancTab({tab, index}) {
      this.allianc_list_index = index
      this.liat_data = tab.value
    }
  },
  destroyed() {
    this.$root.$off(this.emit_cmd.EMIT_SHOW_HOT_SCHEDULE_LOADING,this.show_hot_schedule_loading)
    this.$root.$off(this.emit_cmd.EMIT_HOT_LEADERBOARD_SWITCH,this.leaderboard_switch)
    this.$root.$off(this.emit_cmd.EMIT_SET_SPORTS_BALLS_TAB,this.set_data_update_handle)
    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
}
</script>

<style lang="scss" scoped>
.sports_balls_tab {
  position: fixed;
  top: 1.12rem;
  bottom: 0;
  left: 0;
  right: 0;

  > div {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;

  }

  ::v-deep.no-list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  /*  头部 */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.07rem 0 0.23rem;
    overflow-x: auto;
    height: 0.442rem;
    position: relative;
    z-index: 100;

    .header-title {
      display: flex;

      .item {
        margin-right: 0.3rem;
        font-size: 0.14rem;

        font-family: PingFangSC-Regular;
        border-width: 20px;
        padding-bottom: 0.04rem;
        position: relative;
        width: fit-content;

        &:last-child {
          margin-right: unset;
        }

        &:after {
          content: '';
          width: 0.2rem;
          height: 0.03rem;
          border-radius: 0.08px;
          background: transparent;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 0);
          padding-top: 4px;
        }

        &.active {
          font-weight: 600;
          font-size: 0.14rem;

          &:after {
            content: '';
          }
        }
      }
    }

    .header-icon {
      padding: 0.02rem 0.09rem;
      height: 0.24rem;
      border-radius: 0.115rem;
      box-sizing: border-box;
      font-size: 0.12rem;
      z-index: 110;
      margin-right: .02rem;
    }
  }
}
</style>
