<!--
 * @Description: 热门页入口主页面
-->
<template>
  <div class="popular-hot-pages">
    <!-- 第一个tab 精选 骨架屏 -->
    <hot-featured v-if="featured_loading && tab_Index === 0" :first="first_loading"></hot-featured>
    <!-- 热门赛程 骨架屏-->
    <hot-schedule v-if="featured_loading && tab_Index === 1"></hot-schedule>
    <!-- 热门下边的 tab球类 选项卡-->
    <div class="hot-pages-tabs">
      <div class="tabs-bar">
        <div class="tabs-bar-nav" ref="scrollBox" :class="[change_background]">
          <div class="tabs-tab"
               v-for="(tab, index) in tabList" :key="index"
               :class="[tab_Index == index ? 'tabs-active' : '']"
               @click="changeTab(tab, index, true)"
          >
            <!-- 竞足 tab图标 -->
            <template v-if='tab.menuId == "30101"'>
              <img  src="image/wwwassets/bw3/home/chinaBet.png" alt="">
            </template>
            <template v-else>
              <!-- 精选的tab图标 -->
              <!-- <img v-if='tab.index == 0' :src="(`${ $g_image_preffix }/image/wwwassets/bw3/home/hot_jx_black${get_theme.includes('y0') ? '_y0' : ''}.svg`)" alt=""> -->
              <img v-if='tab.index == 0' :src="(`${ $g_image_preffix }/image/wwwassets/bw3/home/hot_jx_black2${get_theme.includes('y0') ? '_y0' : ''}.svg`)" alt="">
              <!-- 电竞类的tab图标 -->
              <img v-else-if="[100,101,102,103].includes(+tab.field1)" :src="(`${ $g_image_preffix }/image/wwwassets/bw3/home/hot_jx_esport_${tab.field1}.svg`)" alt=""/>
              <!-- 体育类的图标 -->
              <img v-else :src=" tab.field3 && get_file_path(tab.field3)" @error="league_icon_error" alt="">
            </template>
            <span class="menu-name">{{ tab.menuName }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--tab模块  页面 -->
    <div :class="[tab_Index == 0 && 'quiz']">
      <div>
        <!--猜你喜欢  模块-->
        <may-also-like :from_where="101" v-if="tab_Index == 0 && _.get(get_access_config,'hotRecommend')" />
        <!-- 精选赛事  标题-->
        <div class="may_also_like">
          <div class="title" v-if="tab_Index == 0">
            {{ $root.$t('home_popular.featured_events') }}
          </div>
        </div>
        <!-- 精选赛事  标题-->
        <sports-balls-tab ref="sports_balls_tab" :tab_Index="tab_Index"></sports-balls-tab>
      </div>
    </div>
  </div>
</template>

<script>
import { api_home } from "src/project/api/index";
import utils from "src/public/utils/utils";
import {mapActions, mapGetters,mapMutations} from "vuex";
import hot_featured from "src/project/components/skeleton/home_hot/hot_featured"    // 热门精选 骨架屏
import hot_schedule from "src/project/components/skeleton/home_hot/hot_schedule";   // 热门赛程 骨架屏
import may_also_like from "src/project/pages/match-list/components/may_also_like"   // 列表页猜你喜欢
import sports_balls_tab from "src/project/pages/home/hot/components/sports_balls_tab.vue"

export default {
  name: "index",
  components: {
    'may-also-like' : may_also_like,
    'sports-balls-tab' : sports_balls_tab,
    "hot-featured": hot_featured,
    "hot-schedule": hot_schedule, // 热门赛程 骨架屏
  },
  data() {
    return {
      tabList: [],  // tab选项卡内容
      tab_Index: 0, //  tab 选项卡的下标位置
      featured_loading: true, // 精选骨架屏
      first_loading: true, // 精选是否第一次加载骨架屏
      can_click_tab: false, // 可以点击菜单tab 选项卡
      wrapper_scroll_top:0, //当列表滚动时隐藏罚牌说明
    }
  },
  created() {
    this.timer2 = null;
    this.get_list('first_loading')
    this.$root.$on(this.emit_cmd.EMIT_SHOW_HOT_SCHEDULE_LOADING,this.show_hot_schedule_loading)
  },
  watch: {
    tab_Index:{
      handler(n, o){
        this.first_loading = false
      },
    }
  },
  computed:{
    ...mapGetters({
      get_theme:"get_theme",
      get_hot_tab_item:"get_hot_tab_item",
      get_bet_obj:"get_bet_obj",
      get_access_config: "get_access_config",
    }),
    // 改变背景颜色
    change_background() {
      if(this.tab_Index != 0){
        return 'change-background'
      }
    },
  },
  mounted() {
    this.$root.$on(this.emit_cmd.EMIT_VISIBILITYCHANGE_EVENT, this.refresh_list)
  },
  methods:{
    ...mapActions({
      set_hot_tab_item: "set_hot_tab_item",
      set_hot_list_item: "set_hot_list_item",
    }),
    ...mapMutations([
      'set_collapse_map_match',
      "set_menu_type",    // 设置当前主菜单menu_type值
      "set_bet_obj",
      "set_bet_list"
    ]),
    // 监听div滚动 事件，传到列表页
    wrapper_scrolling($event){
      //当列表滚动时隐藏罚牌说明
      this.wrapper_scroll_top = $event.target.scrollTop;
      this.$root.$emit(this.emit_cmd.EMIT_MATCH_LIST_SCROLLING,{
        cb:(_child_this)=>{
        // 回调函数 重写子类的方法值
        const scroll_top =  _child_this.$refs["scroll_top"];
        if(scroll_top){
             scroll_top.list_scroll_top = $event.srcElement.scrollTop;
             scroll_top.scroll_dom = $event.target;
         }
        }
      });
    },
    /**
     * @description: 联赛联赛图标出错
     * @param {Object} $event 错误事件对象
     */
    league_icon_error($event){
      if(this.get_theme.includes('theme02')){
        $event.target.src =  "image/bw3/svg/match_cup_black.svg";
      } else {
        $event.target.src =  "image/bw3/svg/match_cup.svg";
      }
      $event.target.onerror = null
    },
    // 竞彩足球图片 处理
    host(item){
        let url = ''
        let domain = window.env.config.domain[window.env.config.current_env][0]
        let prefix_job = window.env.config.api.API_PREFIX_JOB
        let is_jing_cai = _.get(item,'chinaBetting')==1
        if(is_jing_cai && item.field3) {
          url = `${domain}/${prefix_job}/${item.field3}`
        }
        return url
      },
    // tab 初始化数据
    get_list(first){
      first ? this.first_loading = true : this.first_loading = false
        let parameter = {
          menuType: 12, // 菜单类型  12热门赛事
          disabled: 1, // 是否移除三级菜单  默认：(null)空=展开 ,1=移除
          lang: 'JC'  // 名称简称传：JC  ，默认为空
      }
      api_home.get_hot_list(parameter).then((res) => {
        const data =  _.get(res, "data")
        const code =  _.get(res, "code")
        console.error('data',data)
        if(code == 200 && data.length > 0){
          // 过滤掉赛事场数为0的二级联赛菜单
          data[0].subList = data[0].subList.filter(item => item.count !== 0)
          this.set_hot_list_item(data[0])
          // 加个jz_666 是用作首页 竞彩足球 背景墙用的
          data[0].subList.forEach( item => { if(item.chinaBetting) {item.jz_666 = 'jz_666'} })
          // 手动添加一个 精选tab 选项卡
          this.tabList=[{menuName: this.$root.$t('home_popular.featured'), field3: ""}]
          this.tabList = this.tabList.concat(data[0].subList)
          this.tabList.forEach( (item, index) => {
            item.index = index
            if(this.get_hot_tab_item && (this.get_hot_tab_item.menuId == item.menuId || this.get_hot_tab_item.field2 == item.field2)) {
              this.tab_Index = index
              // 滑动tab动画操作
              let dom_ = this.$refs
              clearTimeout(this.timer2)
              this.timer2 = setTimeout(() => {
                dom_.scrollBox && utils.tab_move2(index, dom_.scrollBox, true)
                this.changeTab(this.tabList[index], index)
              }, 80);
            }
          })
        }else{
          this.featured_loading = false
        }
      }).catch((err)=>{
        console.error(err)
        this.featured_loading = false
      })
    },
    //判断是否要清空投注项
    checkClearBet(obj){
      let flag = false
      const dj_csid_list = [100,101,102,103]
      _.forIn(this.get_bet_obj, function(item, key) {
          const csid = _.get(item,'bs.csid')
          if (dj_csid_list.includes(obj.field1*1)) {//切换的菜单是电竞
            if(!dj_csid_list.includes(csid*1)){
              flag = true
            }
          }else{//切换的菜单是普通赛事
            if(dj_csid_list.includes(csid*1)){
              flag = true
            }
          }
      })
      if(flag){
        this.set_bet_obj({})
        this.set_bet_list([])
      }
    },
    // 菜单切换 is_self 是否手动触发
    changeTab(item, index, is_self) {
      // 如果是电竞赛事，需要设置菜单类型
      if ([100,101,102,103].includes(+item.field1)) {
        this.set_menu_type(3000)
      }else{
        this.set_menu_type('')
      }
      // 是否可以点击tab 选项卡
      if (is_self) {
        if (this.tab_Index == index) return
      }
      this.checkClearBet(item)
      this.set_hot_tab_item(item)
      // 滑动tab动画操作
      utils.tab_move2(index, this.$refs.scrollBox)
      // 当前index 赋值
      this.tab_Index = index;
      //  调用列表页接口
      this.$root.$emit(this.emit_cmd.EMIT_TAB_HOT_CHANGING);
      // 如果不是第一个选项卡，则调用 下边方法，初始化数据
      this.$root.$emit(this.emit_cmd.EMIT_SET_SPORTS_BALLS_TAB)
    },
    // 展示loading
    show_hot_schedule_loading(is_true) {
      if(is_true){
        this.featured_loading = true
      }else{
        this.featured_loading = false
      }
    },
    // 刷新列表数据
    refresh_list() {
      this.$root.$emit(this.emit_cmd.EMIT_MENU_CHANGE_FOOTER_CMD, {
        text: "footer-refresh"
      });
    }
  },
  destroyed() {
    this.$root.$off(this.emit_cmd.EMIT_SHOW_HOT_SCHEDULE_LOADING,this.show_hot_schedule_loading)
    this.$root.$off(this.emit_cmd.EMIT_VISIBILITYCHANGE_EVENT, this.refresh_list)
    if (this.timer2) {
      clearTimeout(this.timer2)
      this.timer2 = null
    }
    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
}
</script>

<style lang="scss" scoped>
.popular-hot-pages {
  .title {
    height: 0.3rem;
    line-height: 0.3rem;
    padding-left: 0.24rem;
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;
    letter-spacing: 0;
    font-weight: 700;
    position: relative;
    &:before {
      content: "";
      width: 0.03rem;
      height: 0.12rem;
      position: absolute;
      left: 0.16rem;
      top: 0.1rem;
      border-radius: 1.5px;
    }
  }
  .quiz {
    position: fixed;
    top: 1.12rem;
    bottom: 0;
    left: 0;
    right: 0;
    max-width:3.78rem;

    > div {
      height: 100%;
      overflow-y: auto;
      width: 100%;
      overflow-x: hidden;
    }
  }

  .hot-pages-tabs {
    .tabs-bar {
      .tabs-bar-nav {
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        margin-top: 0.1rem;
        height: 0.65rem;
        padding-top: 0.05rem;
        padding-left: 0.12rem;

        .tabs-tab {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-width: fit-content;
          padding-right: 0.38rem;
          height: 100%;
          position: relative;
          width: 0.5rem;
          .menu-name{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: .7rem;
          }

          &:nth-child(1) {
            padding-left: 0.15rem;

            // > img {
            //   padding: 0.03rem !important;
            // }

            &.tabs-active {
              > img {
                // padding: 0.05rem !important;
              }
            }
          }

          &:last-child {
            padding-right: 0.2rem;
          }

          > img {
            width: 0.22rem;
            height: 0.22rem;
            margin-bottom: 0.04rem;
            border-radius: 50%;
            padding: 0.02rem;

          }

          > span {
            font-family: PingFangSC-Medium;
            font-size: 0.1rem;
            text-align: center;
          }

          &.tabs-active {

            > img {
              width: 0.22rem;
              height: 0.22rem;
              z-index: 11;
              &.hot_tab_DJ{
                --per: -0.3903rem;
                background: var(--q-color-com-img-bg-139) no-repeat 0 0/0.33rem 23.06rem;
              }
            }
          }
          
        }
      }
    }
  }
}
</style>
