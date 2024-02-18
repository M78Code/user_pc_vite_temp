<!--
 * @Description: 搜索联想建议
-->
<template>
  <div class="suggestion">
    <!-- 滚球 -->
    <ul class="inputSuggestion" v-show="SuggestionList?.bowling && SuggestionList.bowling?.length > 0">
      <li class="hotItem" @click="suggestion_bowling_click(item)" v-for="(item, index) in SuggestionList?.bowling"
        :key="index + 'q'" :class="{ 'hotItem2': index == SuggestionList?.bowling.length - 1 }">
        <div class="team-name ellipsis">
          <!-- 搜索时，对应到的 文字 要高亮 -->
          <span class="home" v-html="red_color(item.mhn)"></span>
          <span class="middle">v</span>
          <!-- 搜索时，对应到的 文字 要高亮 -->
          <span class="away" v-html="red_color(item.man)"></span>
        </div>
        <div class="score-time">
          <span class="score" v-if="item.msc.S1">{{ lodash.get(item, "msc.S1.home", "0") }}-{{ lodash.get(item,
            "msc.S1.away", "0") }}</span>
          <span class="time" v-else>{{ (new Date(+item.mgt)).Format(i18n_t('time4')) }}</span>
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon.svg`" alt="">
        </div>
      </li>
    </ul>
    <!-- 队伍 -->
    <div v-if="SuggestionList.teamH5 && SuggestionList.teamH5.length > 0">
      <ul class="inputSuggestion">
        <li class="hotItem" v-for="(item, index) in SuggestionList.teamH5" :key="index"
          @click.stop="default_method_jump(item.name, item)"
          :class="{ 'hotItem2': index == SuggestionList?.teamH5.length - 1 }">
          <div class="team-name ellipsis">
            <!-- 搜索时，对应到的 文字 要高亮 -->
            <span class="home" v-html="red_color(item.mhn)"></span>
            <span class="middle">v</span>
            <span class="away" v-html="red_color(item.man)"></span>
          </div>
          <div class="score-time">
            <span class="score" v-if="item.msc.S1">{{ lodash.get(item, "msc.S1.home", "0") }}-{{ lodash.get(item,
              "msc.S1.away", "0") }}</span>
            <span class="time" v-else>{{ (new Date(+item.mgt)).Format(i18n_t('time4')) }}</span>
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon.svg`" alt="">
          </div>
        </li>
      </ul>
    </div>
    <!-- 联赛 -->
    <div v-for="(big_item, index) in SuggestionList.league" :key="index + 'ls'"
      v-show="SuggestionList.league && SuggestionList.league.length > 0">
      <!-- 标题比可以点击 @click.stop="default_method_jump(big_item.leagueName, big_item)" -->
      <div class="title">
        <!-- 联赛icon -->
        <img class="match_logo"
          :src="big_item.matchList[0] ? get_server_file_path(big_item.matchList[0].lurl) : compute_img_url('match-cup')"
          @error="league_icon_error" />
        <!-- 搜索时，对应到的 文字 要高亮 -->
        <span v-html="red_color(big_item.leagueName)"></span>
      </div>
      <ul class="inputSuggestion">
        <li class="hotItem" v-for="(item, index) in big_item.matchList" :key="index"
          @click.stop="default_method_jump(big_item.leagueName, item)"
          :class="{ 'hotItem2': index == big_item.matchList.length - 1 }">
          <div class="team-name ellipsis">
            <span class="home">{{ item.mhn }}</span>
            <span class="middle">v</span>
            <span class="away">{{ item.man }}</span>
          </div>
          <div class="score-time">
            <template v-if="get_menu_type == 28 && item.csid == 2">
              <span class="score">{{ lodash.get(item, "msc.S1.home", "0") }}-{{ lodash.get(item, "msc.S1.away", "0")
              }}</span>
            </template>
            <template v-else>
              <span class="score" v-if="item.msc.S1">{{ lodash.get(item, "msc.S1.home", "0") }}-{{ lodash.get(item,
                "msc.S1.away", "0") }}</span>
              <span class="time" v-else>{{ (new Date(+item.mgt)).Format(i18n_t('time4')) }}</span>
            </template>
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon.svg`" alt="">
          </div>
        </li>
      </ul>
    </div>

    <!-- 没有数据 组件 -->
    <no-data v-if="there_any_data" which='noMatch' height='500' class="no-list"></no-data>

  </div>
</template>

<script setup>
import { api_search } from 'src/api/'
const { insert_history } = api_search || {}
import NoData from 'src/base-h5/components/common/no-data.vue'// 无数据组件
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserCtr, MenuData, SearchData,compute_img_url, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import lodash from 'lodash'
const router = useRouter()
// 模糊搜索的数据源
const props = defineProps({
  SuggestionList: {
    type: [Object, Array],
    default: () => ([])
  },
})
const default_url = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match_cup.svg`  //默认图片地址
// 无联赛logo图标黑色版
const none_league_icon_black = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match_cup_black.svg`
const there_any_data = computed(() => {
  // 没有数据时，显示 无数据组件
  if (Array.isArray(props.SuggestionList)) {
    return Object.keys(props.SuggestionList).length <= 0
  }
  return props.SuggestionList.bowling?.length <= 0 && props.SuggestionList.league?.length <= 0 && props.SuggestionList.team?.length <= 0
})
// ...mapGetters([
const get_search_txt = SearchData.search_txt
const get_theme = UserCtr.theme;
const get_menu_type = MenuData.menu_type;

//定时器
let go_detail_or_result_timer;


//  文字特殊处理，颜色操作
function red_color(item) {
  const reg = new RegExp(get_search_txt, "ig");
  let i_color = 'var(--qq-gb-t-c-1)';
  return item.replace(reg, `<span style="color:${i_color}">${get_search_txt.toUpperCase()}</span>`)
}
//TODO ...mapMutations([
// // 详情页的赛事id
// '//set_goto_detail_matchid',
// // 详情页的玩法集
// '//set_details_item',


// 图标出错时
function league_icon_error($event) {
  $event.target.src =compute_img_url('match-cup')
  $event.target.onerror = null
}
// 滚球跳转
function suggestion_bowling_click(item) {
  let item_name;

  if (item.type == 'tour') {
    item_name = item.tn
  } else {
    item_name = item.name
  }

  insert_history({ word: item ? item_name : '', }).then(({ data }) => { })

  // 手机键盘收起动画完成后才跳转
  clearTimeout(go_detail_or_result_timer)
  go_detail_or_result_timer = setTimeout(() => {
    //set_goto_detail_matchid(item.mid);
    //set_details_item(0);
    SearchData.set_search_term(get_search_txt)
    go_detail_or_reslut(item)
    useMittEmit(MITT_TYPES.EMIT_CHANGE_SELECT_DIALOG, false)
  }, 200)
}
// // 联赛跳转,去到详情页
// function suggestion_league_click(item) {
//   default_method(item.leagueName, item)
// }
// // 队名跳转,去到详情页
// function suggestion_team_click(item) {
//   default_method(item.teamName, item)
// }
// 联赛 和 队名 默认跳转方法,去到详情页
function default_method_jump(name, item) {
  if (!item) return;

  if (item.mid) {
    //set_goto_detail_matchid(item.mid);
  } else {
    //set_goto_detail_matchid(item.matchList[0].mid);
  }

  insert_history({ word: item ? name : '', }).then(({ data }) => { })

  // 手机键盘收起动画完成后才跳转
  clearTimeout(go_detail_or_result_timer)
  go_detail_or_result_timer = setTimeout(() => {
    //set_details_item(0);
    SearchData.set_search_term(get_search_txt)
    go_detail_or_reslut(item)
    useMittEmit(MITT_TYPES.EMIT_CHANGE_SELECT_DIALOG, false)
  }, 200)
}
// 跳转到 详情页 或者 赛果页面
function go_detail_or_reslut(item) {
  if (get_menu_type.value == 28) {
    router.push({
      name: 'match_result',
      params: {
        mid: item.mid ? item.mid : item.matchList[0].mid,
        index: '0'
      },
      query: {
        search_term: get_search_txt
      }
    })
  } else {
    router.push({
      name: 'category',
      params: { mid: item.mid },
      query: { search_term: get_search_txt }
    })
  }
}

onBeforeUnmount(() => {
  clearTimeout(go_detail_or_result_timer)
  go_detail_or_result_timer = null
  // for (const key in this.$data) {
  //   this.$data[key] = null
  // }
})
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

        .home,
        .away {

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

        >img {
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