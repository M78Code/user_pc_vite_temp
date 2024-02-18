<!--
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 联赛积分榜
-->

<template>
  <div class="league-rank">
    <template v-if="vsport_ctr.league_rank_list.length > 0">
      <div class="title" :class="{'fixed_league_rank_title': titleFixed}"
        :style="{'top': `${titleTop}px`, 'width': titleFixed ? `${titleWidth}px` : 'auto'}"><span>{{i18n_t('vsport.rank')}}</span></div>
      <div class="header" ref="league_rank_header">
        <!-- 排名 -->
        <div class="col1">{{i18n_t('vsport.gtab9')}}</div>
        <!-- 球队 -->
        <div class="col2">{{i18n_t('vsport.gtab1')}}</div>
        <!-- 比赛 -->
        <div class="col3">{{i18n_t('vsport.gtab2')}}</div>
        <!-- 胜/平/负 -->
        <div class="col4">{{i18n_t('vsport.gtab3')}}</div>
        <!-- 积分 -->
        <div class="col5">{{i18n_t('vsport.gtab7')}}</div>
      </div>
    </template>
    <!-- 榜单列表 -->
    <div class="match-item" :class="{three:item.ranking < 4,'din-medium':item.ranking < 4}" v-for="(item,key) in vsport_ctr.league_rank_list" :key="key">
      <div class="col1">
        <div class="number" :class="'number'+item.ranking">{{item.ranking}}</div>
      </div>
      <div class="col2 relative-position">
        <div class="ellipsis yb-absolute-fit">{{item.virtualTeamName}}</div>
      </div>
      <div class="col3">{{item.totalCount}}</div>
      <div class="col4">{{item.win}}/{{item.draw}}/{{item.lost}}</div>
      <div class="col5">{{item.points}}</div>
    </div>
  </div>
</template>

<script>
// import {mapGetters,} from "vuex";
export default {
  name: "leagueRank",
  props:{
    // 虚拟体育控制类
    vsport_ctr: Object,
    titleFixed: Boolean,
  },
  data() {
    return {
      // 是否是内嵌版
      is_iframe:window.is_iframe,
      // fixed 定位时距离顶部高度
      titleTop: 0,
      // 吸顶后的宽度
      titleWidth: 0,
    }
  },
  computed:{
    // ...mapGetters(['get_menu_collapse_status'])
  },
  watch: {
    // 当前是否吸顶
    titleFixed: {
      handler(n) {
        if (n) {
          this.titleWidth = this.$refs.league_rank_header.offsetWidth;
        }
      }
    }
  },
  created(){
    // 获取视频区高度
    this.$root.$on("virtual_right_list_header_height", this.getHeaderHeight)
    this.vsport_ctr.set_league_rank_list();
  },
  methods: {
    /**
     * 获取头部视频区高度
     */
    getHeaderHeight(h) {
       
      // 内嵌和非内嵌版顶部导航高度不一样
      let navHeaderHeight = this.is_iframe ? 50 : 60;
      if(this.get_menu_collapse_status && this.is_iframe){
          navHeaderHeight -= 50
       }
      // 吸顶部件离浏览器可视区域顶部的距离
      this.titleTop = navHeaderHeight + 34 + h + 8 - 2;
    }
  },
  destroyed(){
    this.vsport_ctr.league_rank_list = [];
    this.$root.$off("virtual_right_list_header_height", this.getHeaderHeight)
  }
};
</script>

<style lang="scss" scoped>
/*  标题 */
.title {
  height: 40px;
  line-height: 40px;
  padding-left: 35px;
  position: unset;
  font-family: PingFangSC-Medium;
  font-size: 13px;
  span {
    position: relative;
    &:before {
      display: block;
      content: "";
      width: 11px;
      height: 14px;
      position: absolute;
      top: 3px;
      left: -21px;
    }
  }
}
.col1 {
  width: 20%;
  min-width: 55px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col2 {
  flex: 1;
  height: 100%;
  text-align: left;
}
.col3 {
  width: 11%;
  min-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col4 {
  width: 18%;
  min-width: 95px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col5 {
  width: 11%;
  min-width: 83px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*  头部 */
.header {
  height: 32px;
  display: flex;
  text-align: center;
  line-height: 32px;
  // padding: 0 10px;
  margin-bottom: 5px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
}

/*  赛事 */
.match-item {
  display: flex;
  // padding-right: 10px;
  height: 46px;
  line-height: 46px;
  text-align: center;
  &.three {
    font-size: 13px;
    .col2 {
      font-size: 14px;
    }
  }

  /*  赛事排名 */
  .number {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    text-align: center;
    line-height: 16px;
  }
  .col1 {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .col2 {
    font-size: 13px;
  }
  .col6 {
    font-size: 12px;
    letter-spacing: 4px;
  }
}

/*  title 吸顶 */
.fixed_league_rank_title {
  position: fixed;
  width: 100%;
  padding-left: 20px;
  text-indent: 15px;
  z-index: 1;
}
</style>
