<!--
 * @Author: Cable
 * @Date: 2020-08-04 17:13:55
 * @Description: 赛事列表卡片容器
-->
<template>
  <div
    v-if="card_style_obj.is_show_card"
    class="list-card-wrap v-scroll-item relative-position"
    :class="{
      'sticky-wrap':['sport_title','play_title','no_start_title','league_title','champion_league_title'].includes(card_style_obj.card_type),
      'matc-type-card':['sport_title','play_title','no_start_title'].includes(card_style_obj.card_type)
    }"
    :style="`height:${card_style_obj.card_total_height}px  !important;width:${vx_get_layout_size.list_content_width}px  !important;${card_style}`"
  >

    <div
      v-if="is_mounted"
      :class="{'list-card-inner':!match_list_card.is_champion}"
    >
      <!-- 赛事状态 | 赛种类型 -->
      <play-match-type
        v-if="['sport_title','play_title','no_start_title'].includes(card_style_obj.card_type)"
        :card_style_obj="card_style_obj"
      />
      <!-- 联赛标题 -->
      <play-match-league
        v-else-if="card_style_obj.card_type == 'league_title'"
        :card_style_obj="card_style_obj"
        :key="card_style_obj.card_type"
      />

      <!-- 冠军联赛标题 -->
      <match-type-champion
        v-else-if="card_style_obj.card_type == 'champion_league_title'"
        :card_style_obj="card_style_obj"
      />
      <!-- 暂无数据 -->
      <div class="fit" v-else-if="card_style_obj.card_type == 'no_data'">
        <load-data
          style="max-height:260px"
          state="empty"
        />
        <!-- 强力推荐 -->
        <div class="row">
          <img class="list-hot-icon" src="~public/image/yabo/svg/hot.svg" />
          <div class="list-hot-text">{{$root.$t('list.hot_match')}}</div>
        </div>
      </div>

      <!-- 赛事卡片 -->
      <template v-else>
        <!-- 数据加载状态 -->
        <load-data
          v-if="card_style_obj.load_data_status != 'loaded'"
          :state="card_style_obj.load_data_status"
          @refresh="refresh_league"
          load_type="league_fold"
        />
        <!-- 赛事列表 -->
        <template v-else>
          <match-card
            v-for="mid in mids_arr"
            :key="mid"
            :mid="mid"
          />
        </template>
      </template>
    </div>
    <div v-if="test" class="test-info">卡片索引--{{card_style_obj.card_index}}---卡片类型---{{card_style_obj.card_type}}---卡片ID---{{card_key}}</div>
  </div>
</template>

<script>
import loadData from "src/public/components/load_data/load_data.vue"
import { mapGetters } from "vuex"
export default {
  components:{
    matchCard: () => import( /* webpackChunkName: "details" */ "src/project/yabo/components/match_list/match_card.vue"),
    // 赛事列表头部——滚球——赛事类型
    playMatchType: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/play_match_type.vue"),

    // 赛事列表头部——滚球——联赛信息
    playMatchLeague: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/play_match_league.vue"),
    // 赛事列表头部——冠军信息
    matchTypeChampion: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_type_champion.vue"),
    loadData
  },
  inject:['match_list_card'],
  props:{
    card_key: String
  },
  data(){
    return {
      // 当前列表类型
      match_list_type:this.match_list_card.match_list_mapping_relation_obj_type,
      // 卡片样式对象
      card_style_obj:this.match_list_card.all_card_obj[this.card_key],
      // 是否显示调试信息
      test:sessionStorage.getItem('wsl'),
      // 组件是否加载完成
      is_mounted: false
    }
  },
  computed:{
    ...mapGetters({
      // 页面布局大小信息
      vx_get_layout_size: "get_layout_size",
    }),
    /**
     * @Description 设置卡片样式
     * @param {undefined} undefined
    */
    card_style(){
      // 设置卡片高度
      let card_style = ''
      // 如果卡片类型是球种标题、已开赛、未开赛标题  设置吸顶
      if(['sport_title','play_title','no_start_title'].includes(this.card_style_obj.card_type)){
        let top = this.match_list_card.view.sticky_top.type
        card_style = `top:${top - 0.5}px;`
      }
      // 如果是联赛标题卡片  设置联赛吸顶
      else if(['league_title','champion_league_title'].includes(this.card_style_obj.card_type)){
        let top = this.match_list_card.view.sticky_top.league
        card_style = `top:${top - 0.5}px;`
      }
      return card_style
    },
    /**
     * @Description 设置赛事ID列表
     * @param {undefined} undefined
    */
    mids_arr(){
      let mids_arr = []
      if(this.card_style_obj.card_type == 'league_container'){
        mids_arr = this.card_style_obj.mids.split(',')
      }
      return mids_arr
    }
  },
  mounted(){
    // 异步设置组件是否挂载完成
    setTimeout(()=>{
      this.is_mounted = true
    })
  },
  beforeDestroy(){
    this.card_style_obj = null
  },
  methods:{
    /**
     * @Description 刷新联赛
     * @param {undefined} undefined
    */
    refresh_league(){
      this.match_list_card.refresh_league(this.card_style_obj)
    },
  }
}
</script>

<style lang="scss" scoped>
.list-card-wrap {
  overflow: hidden;
  .list-card-inner {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  /*  数据加载组件 */
  .load-data-wrap {
    width: 100%;
    height: 100%;
    ::v-deep .empty-wrap .img {
      width: 130px !important;
      height: 130px !important;
    }
    ::v-deep .user_api_limited {
      .img {
        display: none;
      }
    }
  }
  .test-info {
    position: absolute;
    color: red;
    font-size: 14px;
    z-index: 999999;
    right: 0;
    bottom: 0;
    user-select: text;
  }
}
.list-hot-icon {
  width: 14px;
  height: 14px;
  margin: 2px 15px 0 10px;
}
.list-hot-text {
  font-size: 14px;
  font-weight: 600;
}
</style>
