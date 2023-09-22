<!--
 * @Description: 搜索联想建议
-->
<template>
  <div class="suggestion">
    <!-- 滚球 -->
    <ul class="inputSuggestion" v-show="suggestion_list.bowling && suggestion_list.bowling.length > 0">
      <li class="hotItem"  @click="suggestion_bowling_click(item)" v-for="(item, index) in suggestion_list.bowling" :key="index+'q'" :class="{'hotItem2':index == suggestion_list.bowling.length-1}">
        <div class="team-name ellipsis">
          <!-- 搜索时，对应到的 文字 要高亮 -->
          <span class="home" v-html="red_color(item.mhn)"></span>
          <span class="middle">v</span>
          <!-- 搜索时，对应到的 文字 要高亮 -->
          <span class="away" v-html="red_color(item.man)"></span>
        </div>
        <div class="score-time">
          <span class="score" v-if="item.msc.S1">{{ _.get(item, "msc.S1.home","0")}}-{{_.get(item, "msc.S1.away","0")}}</span>
          <span class="time" v-else>{{(new Date(+item.mgt)).Format($t('time4'))}}</span>
          <img src="image/wwwassets/bw3/list/league-collapse-icon.svg" alt="">
        </div>
      </li>
    </ul>
    <!-- 队伍 -->
    <div v-if="suggestion_list.teamH5 && suggestion_list.teamH5.length>0">
      <ul class="inputSuggestion">
        <li class="hotItem" v-for="(item, index) in suggestion_list.teamH5" :key="index" @click.stop="default_method_jump(item.name, item)" :class="{'hotItem2':index == suggestion_list.teamH5.length-1}">
          <div class="team-name ellipsis">
            <!-- 搜索时，对应到的 文字 要高亮 -->
            <span class="home" v-html="red_color(item.mhn)"></span>
            <span class="middle">v</span>
            <span class="away" v-html="red_color(item.man)"></span>
          </div>
          <div class="score-time">
            <span class="score" v-if="item.msc.S1">{{ _.get(item, "msc.S1.home","0")}}-{{_.get(item, "msc.S1.away","0")}}</span>
            <span class="time" v-else>{{(new Date(+item.mgt)).Format($t('time4'))}}</span>
            <img src="image/wwwassets/bw3/list/league-collapse-icon.svg" alt="">
          </div>
        </li>
      </ul>
    </div>
    <!-- 联赛 -->
    <div v-for="(big_item, index) in suggestion_list.league" :key="index+'ls'" v-show="suggestion_list.league && suggestion_list.league.length > 0">
      <!-- 标题比可以点击 @click.stop="default_method_jump(big_item.leagueName, big_item)" -->
      <div class="title" >
        <!-- 联赛icon -->
        <img class="match_logo"
            :src=" big_item.matchList[0] ? get_file_path(big_item.matchList[0].lurl) : get_theme.includes('theme02') ? none_league_icon_black : default_url"
            @error="league_icon_error"
        />
        <!-- 搜索时，对应到的 文字 要高亮 -->
        <span v-html="red_color(big_item.leagueName)"></span>
      </div>
      <ul class="inputSuggestion">
        <li class="hotItem" v-for="(item, index) in big_item.matchList" :key="index" @click.stop="default_method_jump(big_item.leagueName, item)" :class="{'hotItem2':index == big_item.matchList.length-1}">
          <div class="team-name ellipsis">
            <span class="home">{{ item.mhn }}</span>
            <span class="middle">v</span>
            <span class="away">{{ item.man }}</span>
          </div>
          <div class="score-time">
            <template v-if="get_menu_type == 28 && item.csid == 2">
              <span class="score">{{ _.get(item, "msc.S1.home","0")}}-{{_.get(item, "msc.S1.away","0")}}</span>
            </template>
            <template v-else>
              <span class="score" v-if="item.msc.S1">{{ _.get(item, "msc.S1.home","0")}}-{{_.get(item, "msc.S1.away","0")}}</span>
              <span class="time" v-else>{{(new Date(+item.mgt)).Format($t('time4'))}}</span>
            </template>
            <img src="image/wwwassets/bw3/list/league-collapse-icon.svg" alt="">
          </div>
        </li>
      </ul>
    </div>

    <!-- 没有数据 组件 -->
    <no-data v-if="there_any_data" which='noMatch' height='500' class="no-list" :class="{'black_no_data': get_theme.includes('theme02')}"></no-data>

  </div>
</template>

<script>
import {mapMutations, mapGetters} from "vuex";
import { get_insert_history } from 'src/project/api/module/search/search_api.js'
import loading from "src/project/components/common/loading";
import no_data from "src/project/components/common/no_data";

export default {
  name: "i_suggestion",
  props: {
    // 模糊搜索的数据源
    suggestion_list: {
      type: Object | Array,
    },
  },
  components: {
    "no-data": no_data,// 无数据组件
    loading, // 骨架屏
  },
  data() {
    return {
      default_url:  "image/bw3/svg/match_cup.svg",  //默认图片地址
      // 无联赛logo图标黑色版
      none_league_icon_black: "image/bw3/svg/match_cup_black.svg",
    }
  },
  computed: {
    // 没有数据时，显示 无数据组件
    there_any_data() {
      if (Array.isArray(this.suggestion_list)) {
        return Object.keys(this.suggestion_list).length <= 0
      }

      return this.suggestion_list.bowling.length <= 0 && this.suggestion_list.league.length <= 0 && this.suggestion_list.team.length <= 0
    },
    ...mapGetters(['get_search_txt','get_theme', 'get_current_menu', 'get_menu_type'])
  },
  methods: {
    //  文字特殊处理，颜色操作
    red_color(item){
      const reg = new RegExp(this.get_search_txt,"ig");
      let i_color = '#FF9124';
      if(this.get_theme.includes('theme02')){
        i_color = '#FFB001';
      }
      if(this.get_theme.includes('theme02_y0') || this.get_theme.includes('theme01_y0')){
        i_color = '#4987fb';
      }
      return item.replace(reg,`<span style="color:${i_color}">${this.get_search_txt.toUpperCase()}</span>`)
    },
    ...mapMutations([
      'set_search_txt',
      // 详情页的赛事id
      'set_goto_detail_matchid',
      // 详情页的玩法集
      'set_details_item',
      // 搜索历史文字
      'set_search_term',
    ]),
    // 图标出错时
    league_icon_error($event){
      // 黑色版 图片
      if(this.get_theme.includes('theme02')){
        $event.target.src = this.none_league_icon_black;
      }
      // 白色版 图片
      else {
        $event.target.src = this.default_url;
      }
      $event.target.onerror = null
    },
    // 滚球跳转
    suggestion_bowling_click(item){
      let item_name;

      if(item.type == 'tour'){
        item_name = item.tn
      }else{
        item_name = item.name
      }

      get_insert_history({word: item ? item_name : '',}).then(({data}) => {})

      // 手机键盘收起动画完成后才跳转
      clearTimeout(this.go_detail_or_result_timer)
      this.go_detail_or_result_timer = setTimeout(() => {
        this.set_goto_detail_matchid(item.mid);
        this.set_details_item(0);
        this.set_search_term(this.get_search_txt)
        this.go_detail_or_reslut(item)

        this.$root.$emit(this.emit_cmd.EMIT_CHANGE_SELECT_DIALOG, false)
      }, 200)
    },
    // 联赛跳转,去到详情页
    suggestion_league_click(item){
      this.default_method(item.leagueName, item)
    },
    // 队名跳转,去到详情页
    suggestion_team_click(item){
      this.default_method(item.teamName, item)
    },
    // 联赛 和 队名 默认跳转方法,去到详情页
    default_method_jump(name,item) {
      if ( !item ) return;

      if(item.mid){
        this.set_goto_detail_matchid(item.mid);
      }else{
        this.set_goto_detail_matchid(item.matchList[0].mid);
      }

      get_insert_history({word: item ? name : '',}).then(({data}) => {})

      // 手机键盘收起动画完成后才跳转
      clearTimeout(this.go_detail_or_result_timer)
      this.go_detail_or_result_timer = setTimeout(() => {
        this.set_details_item(0);
        this.set_search_term(this.get_search_txt)
        this.go_detail_or_reslut(item)

        this.$root.$emit(this.emit_cmd.EMIT_CHANGE_SELECT_DIALOG, false)
      }, 200)
    },
    // 跳转到 详情页 或者 赛果页面
    go_detail_or_reslut(item) {
      const menu_type =  _.get(this.get_current_menu, 'main')||this.get_menu_type
      if(menu_type == 28){
        this.$router.push({
          name: 'match_result',
          params: {
            mid: item.mid ? item.mid : item.matchList[0].mid,
            index: '0'
          },
          query:{
            search_term: this.get_search_txt
          }
        })
      }else{
        this.$router.push({
          name:'category',
          params: {mid: item.mid},
          query:{search_term: this.get_search_txt}
        })
      }
    }
  },
  destroyed() {
    clearTimeout(this.go_detail_or_result_timer)
    this.go_detail_or_result_timer = null
    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
};
</script>

<style lang="scss" scoped>
.suggestion {
  width: 100%;

  .title {
    display: flex;
    align-items: center;
    height: 0.2rem;
    margin: 0.1rem 0;
    margin-left: 0.16rem;

    img {
      width: 0.2rem;
      height: 0.2rem;
      margin-right: 0.07rem;
    }
  }

  .inputSuggestion {
    max-width: 768px;
    margin: 0 0.07rem;


    border-radius: 8px;

    li {
      height: 0.5rem;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.13rem;

      .team-name {
        font-size: 0.14rem;
        width: 2.2rem;

        .home, .away {

          line-height: 18px;
        }

        .middle {

          margin: 0 0.05rem;
        }
      }

      .score-time {

        text-align: right;

        .score {
          font-size: 0.14rem;
        }

        .time {
          font-size: 0.14rem;
        }

        > img {
          transform: rotate(90deg);
          margin-left: 0.23rem;
          position: relative;
          top: -0.02rem;
        }
      }

      &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 3.36rem;
        height: 0.01rem;
        transform: translateX(-50%);
      }
    }

    &:after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 3.36rem;
      height: 0.01rem;
      transform: translateX(-50%);
    }

    &.hotItem2:after {
      display: none;
    }
  }
}

.no-list {
  height: 4.5rem;

  &.black_no_data {
    background: #111111;
  }
}
</style>
