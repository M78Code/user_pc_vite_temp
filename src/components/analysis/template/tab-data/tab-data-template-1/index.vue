<template>
  <div class="datum">
    <div class="tab" v-if="match.csid=='1'">
      <!-- 基本面 -->
      <span :class="{'active':tabIndex==1}" @click="tabClick(1)">{{$root.$t('analysis.Fundamentals')}}</span>
      <!-- 盘面 -->
      <span :class="{'active':tabIndex==2}" @click="tabClick(2)">{{$root.$t('analysis.Disk')}}</span>
      <!-- 技术面 -->
      <span :class="{'active':tabIndex==3}" @click="tabClick(3)">{{$root.$t('analysis.Technical_side')}}</span>
    </div>
    <!-- 基本面 -->
    <template v-if="tabIndex == 1">
      <base-panel 
      :match="match" 
      :baseData="baseData" 
      :tournamentTypeFinish="tournamentTypeFinish"
      :vs_info="vs_info" 
      :team_vs_history="team_vs_history" 
      :team_vs_other_team="team_vs_other_team"
      :team_vs_other_team_result="team_vs_other_team_result"
      :team_vs_history_result="team_vs_history_result"
      @selectedFn="selectedFn"
      @get_all_vsInfo="get_all_vsInfo"/>
    </template>

    <!-- 盘面 -->
    <template v-if="tabIndex == 2 && match.csid=='1'">
      <div class="panel disk analysis_disk">
        <!-- 盘路走势 -->
        <div class="panel-title">{{$root.$t('analysis.Turning_trend')}}</div>
        <div>
          <div class="match-info">
            <div class="team">
              <img v-img="([_.get(match,'mhlu[0]'),_.get(match,'frmhn[0]')])" class="logo" alt/>
              <span>{{match.mhn}}</span>
            </div>
          </div>
          <div class="d-header d-tr">
            <!-- 总 -->
            <div class="d-td border_r">
              <div class="match_total">&nbsp;</div>
              <div class="match_total">{{$root.$t('vsport.gtab2')}}</div>
            </div>
            <!-- 赢盘 -->
            <div class="d-td">{{$root.$t('analysis.win_plate')}}</div>
            <!-- 走盘 -->
            <div class="d-td">{{$root.$t('analysis.Move_plate')}}</div>
            <!-- 输盘 -->
            <div class="d-td">{{$root.$t('analysis.Lose_plate')}}</div>
            <!-- 赢盘率 -->
            <div class="d-td border_r">{{$root.$t('analysis.Win_rate')}}</div>
            <!-- 大球 -->
            <div class="d-td">{{$root.$t('analysis.big_ball')}}</div>
            <!-- 大球率 -->
            <div class="d-td">{{$root.$t('analysis.Big_ball_rate')}}</div>
            <!-- 小球 -->
            <div class="d-td">{{$root.$t('analysis.small_ball')}}</div>
            <!-- 小球率 -->
            <div class="d-td">{{$root.$t('analysis.small_ball_rate')}}</div>
          </div>
          <div class="d-body d-tr" v-for="(item,index) in _.get(baseData,'1.matchHistoryBattleDetailDTOList')" :key="index">
            <!-- 总   主   客 -->
            <div class="d-td">
              <div class="match_num_total">
                {{item.postionFlag==1?$root.$t('analysis.total_all')
            :(item.postionFlag==2?$root.$t('analysis.main'):$root.$t('analysis.customer'))}}
              </div>
              <div class="match_num_total">{{parseInt(item.handicapResultWin) + parseInt(item.handicapResultEqual) + parseInt(item.handicapResultLose)}}</div>
            </div>
            <div class="d-td">{{item.handicapResultWin}}</div>
            <div class="d-td">{{item.handicapResultEqual}}</div>
            <div class="d-td">{{item.handicapResultLose}}</div>
            <div class="d-td">{{(item.handicapResultWinRate*100).toFixed(2)}}%</div>
            <div class="d-td">{{item.overunderResultWin}}</div>
            <div class="d-td">{{(item.overunderResultWinRate*100).toFixed(2)}}%</div>
            <div class="d-td">{{item.overunderResultLose}}</div>
            <div class="d-td">{{(item.overunderResultLoseRate*100).toFixed(2)}}%</div>
          </div>
          <div class="d-body d-tr">
            <div class="d-td color_83838a">{{$root.$t("analysis.last10games")}}</div>
            <div class="d-td match_status">
              <span 
                class="result-item"
                :class="result_filter('cls',item)"
                v-for="(item,index) in _.get(baseData, '1.handicapResultList')"
                :key="index"
                >{{result_filter('resultLabel', item)}}</span>
            </div>
            <div class="d-td match_status">
              <span
                class="result-item"
                :class="result_filter('cls',item)"
                v-for="(item,index) in _.get(baseData, '1.overunderResultList')"
                :key="index"
                >{{result_filter('overunderLabel', item)}}</span>
            </div>
          </div>
        </div>

        <div class="away">
          <div class="match-info">
            <div class="team">
              <img v-img="([_.get(match,'malu[0]'),_.get(match,'frman[0]')])" class="logo" alt/>
              <span>{{match.man}}</span>
            </div>
          </div>
          <div class="d-header d-tr">
            <!-- 总 -->
            <div class="d-td border_r">
              <div class="match_total">&nbsp;</div>
              <div class="match_total">{{$root.$t('vsport.gtab2')}}</div>
            </div>
            <!-- 赢盘 -->
            <div class="d-td">{{$root.$t('analysis.win_plate')}}</div>
            <!-- 走盘 -->
            <div class="d-td">{{$root.$t('analysis.Move_plate')}}</div>
            <!-- 输盘 -->
            <div class="d-td">{{$root.$t('analysis.Lose_plate')}}</div>
            <!-- 赢盘率 -->
            <div class="d-td border_r">{{$root.$t('analysis.Win_rate')}}</div>
            <!-- 大球 -->
            <div class="d-td">{{$root.$t('analysis.big_ball')}}</div>
            <!-- 大球率 -->
            <div class="d-td">{{$root.$t('analysis.Big_ball_rate')}}</div>
            <!-- 小球 -->
            <div class="d-td">{{$root.$t('analysis.small_ball')}}</div>
            <!-- 小球率 -->
            <div class="d-td">{{$root.$t('analysis.small_ball_rate')}}</div>
          </div>
          <div class="d-body d-tr" v-for="(item,index) in _.get(baseData,'2.matchHistoryBattleDetailDTOList')" :key="index">
            <!-- 总   主   客 -->
            <div class="d-td">
              <div class="match_num_total">
                {{item.postionFlag==1?$root.$t('analysis.total_all')
            :(item.postionFlag==2?$root.$t('analysis.main'):$root.$t('analysis.customer'))}}
              </div>
              <div class="match_num_total">{{parseInt(item.handicapResultWin) + parseInt(item.handicapResultEqual) + parseInt(item.handicapResultLose)}}</div>
            </div>
            <div class="d-td">{{item.handicapResultWin}}</div>
            <div class="d-td">{{item.handicapResultEqual}}</div>
            <div class="d-td">{{item.handicapResultLose}}</div>
            <div class="d-td">{{(item.handicapResultWinRate*100).toFixed(2)}}%</div>
            <div class="d-td">{{item.overunderResultWin}}</div>
            <div class="d-td">{{(item.overunderResultWinRate*100).toFixed(2)}}%</div>
            <div class="d-td">{{item.overunderResultLose}}</div>
            <div class="d-td">{{(item.overunderResultLoseRate*100).toFixed(2)}}%</div>
          </div>
          <!-- 近10场 -->
          <div class="d-body d-tr">
            <div class="d-td color_83838a">{{$root.$t("analysis.last10games")}}</div>
            <div class="d-td match_status">
              <!-- 输赢 -->
              <span 
                class="result-item"
                :class="result_filter('cls',item)"
                v-for="(item,index) in _.get(baseData, '2.handicapResultList')"
                :key="index"
                >{{result_filter('resultLabel', item)}}</span>
            </div>
            <div class="d-td match_status">
              <!-- 大小 -->
              <span
                class="result-item"
                :class="result_filter('cls',item)"
                v-for="(item,index) in _.get(baseData, '2.overunderResultList')"
                :key="index"
                >{{result_filter('overunderLabel', item)}}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- 技术面 -->
    <template v-if="tabIndex == 3 && match.csid=='1'">
      <div class="panel disk technical">
        <!-- 教练数据 -->
        <div class="panel-title">{{$root.$t('analysis.Coach_data')}}</div>
        <div class="home" v-for="(item,index) in _.get(baseData,'sThirdMatchCoachDTOMap.1')" :key="`sThirdMatchCoachDTOMap${index}`">
          <div class="match-info">
            <div class="team">
              <img v-img="([_.get(match,'mhlu[0]'),_.get(match,'frmhn[0]')])" class="logo" alt/>
              <span>{{item.coachName}}</span>
            </div>
          </div>
          <div class="d-header d-tr">
            <!-- 年龄 -->
            <div class="d-td">{{$root.$t('analysis.age')}}</div>
            <!-- 战术分格 -->
            <div class="d-td">{{$root.$t('analysis.Tactical_division')}}</div>
            <!-- 场均得分 -->
            <div class="d-td">{{$root.$t('analysis.Points_per_game')}}</div>
            <!-- 出站 -->
            <div class="d-td">{{$root.$t('analysis.Go_to_war')}}</div>
          </div>
          <div class="d-body d-tr">
            <div class="d-td">{{getAge(item.coachBirthdate)}}</div>
            <div class="d-td">{{item.coachStyle}}</div>
            <div class="d-td">{{item.score}}</div>
            <div class="d-td">{{item.coachGameCount}}</div>
          </div>
        </div>

        <div class="away" v-for="(item,index) in _.get(baseData,'sThirdMatchCoachDTOMap.2')" :key="`sThirdMatchCoachDTOMap-2${index}`">
          <div class="match-info">
            <div class="team">
              <img v-img="([_.get(match,'malu[0]'),_.get(match,'frman[0]')])" class="logo" alt/>
              <span>{{item.coachName}}</span>
            </div>
          </div>
          <div class="d-header d-tr">
            <!-- 年龄 -->
            <div class="d-td">{{$root.$t('analysis.age')}}</div>
            <!-- 战术分格 -->
            <div class="d-td">{{$root.$t('analysis.Tactical_division')}}</div>
            <!-- 场均得分 -->
            <div class="d-td">{{$root.$t('analysis.Points_per_game')}}</div>
            <!-- 出站 -->
            <div class="d-td">{{$root.$t('analysis.Go_to_war')}}</div>
          </div>
          <div class="d-body d-tr">
            <div class="d-td">{{getAge(item.coachBirthdate)}}</div>
            <div class="d-td">{{item.coachStyle}}</div>
            <div class="d-td">{{item.score}}</div>
            <div class="d-td">{{item.coachGameCount}}</div>
          </div>
        </div>
        
      </div>
    </template>
  </div>
</template>

<script setup>

import { ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)

import { MSelectFullVersionWapper as basePanel } from 'src/components/analysis/template/m-select/index.js'
import { api_analysis } from 'src/public/api/index'

const route = useRoute();
const tabIndex = ref(1); // 当前 tab 所在下标
const baseData = ref({}); //基本面数据
const vs_info = ref([]); //杯赛积分
const team_vs_history = ref([]); // 基本面---历史交战数据
const team_vs_other_team = ref({}); // 近期战绩---格式化后的主客队比赛数据
const params = ref({}); // 接口请求参数
const team_vs_other_team_result = ref({}); //近期战阵主客胜平负次数
const team_vs_history_result = ref({}); //历史战阵主客胜平负次数
const tournamentTypeFinish = ref(false); //联赛数据加载完成//联赛数据加载完成

loadArticle()
window.addEventListener('beforeunload', close_win)

/**
 * @Description 加载文章,优先读缓存
*/
const loadArticle = () => {
  let articleCache = localStorage.getItem('_article_obj');
  if (articleCache) {
    let article = JSON.parse(articleCache)
    if (article && article.id == route.params.id) {
      articleDetail.value = article
      setReadCounts.value()
    }
  }
  //无缓存则调用api
  if (!articleDetail.value.id) {
    get_article()
  }
}
/**
 * @Description 设置最新阅读数
*/
const setReadCounts = () => {
  if (route.params.count) {
    let count = Number(route.params.count)
    if (!count) return
    articleDetail.value.readCounts = route.params.count;
  }
}
const close_win = () => {
  if (articleDetail.value.id) {
    let end_tiem = new Date().getTime()
    let info = {
      "文章ID": articleDetail.value.id,
      "页面停留时长": parseInt((end_tiem - start_article_tiem.value) / 1000)
    }
    window.opener.postMessage({ name: 'close_win', info }, '*')
  }
}
/**
 * @Description 获取文章详情
*/
const get_article = () => {
  // matchId文章id type2猜你喜欢详情
  const params = {
    matchId: route.params.id,//Number(
    type: 2,
  }
  api_analysis.getArticlePB(params).then(res => {
    const _data = _.get(res, 'data.data');
    const _code = _.get(res, 'data.code');

    if (_code == 200 && !_.isEmpty(_data)) {
      let _item = typeof (_data) == 'string' ? JSON.parse(_data) : _.cloneDeep(_data);
      // 替换图片域名
      let domain = this.get_file_path('getArticle').replace('getArticle', '')
      if (_item.articleContent) {
        _item.articleContent = _item.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER\//g, domain)
      }
      // 格式化时间
      _item.updateTime = formatDate(_item.updateTime)
      document.getElementById('loading-root-ele').style.visibility = 'hidden';
      articleDetail.value = _item
      setReadCounts()
    } else { console.debug('fail') }
  }).catch((e) => {
    console.error(e)
  })
}
/**
 * 处理时间戳
 */
const formatDate = (date) => {
  let _date = ''
  if (date) {
    if ((new Date() - parseInt(date)) >= 86400000) {
      _date = `${new Date(parseInt(date)).getMonth() + 1}月 ${new Date(parseInt(date)).getDate()}日`
    } else if ((new Date() - parseInt(date)) >= 3600000) {
      _date = `${Math.floor((new Date() - parseInt(date)) / 3600000)}小时前`
    } else {
      _date = `${Math.floor((new Date() - parseInt(date)) / 60000)}分钟前`
    }
  }
  return _date;
}
onUnmounted(() => {
  window.removeEventListener('beforeunload', close_win)
})

</script>

<style lang="scss" scoped>
.wrap {
  margin: 20px;
  display: flex;
  justify-content: center;
  height: 100vh;
  padding-bottom: 20px;
}

.article_detail {
  background: var(--qq--analysis-bg-color-1);
  border: 1px solid var(--qq--analysis-bd-color-4);
  border-radius: 8px;
  height: 100%;
  padding: 15px 38px;
  margin-bottom: 20px;

  p {
    margin-bottom: 16px;
  }

  .article_title {
    font-size: 16px;
    color: var(--qq--analysis-text-color-10);
    font-weight: 600;
  }

  .author {
    color: var(--qq--analysis-text-color-11);

    .author_name {
      font-weight: 500;
    }

    .time {
      margin: 0 30px 0 10px;
    }
  }

  .article {
    ::v-deep {
      * {
        max-width: 100%;
        color: var(--qq--analysis-text-color-10);
      }

      p {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: var(--qq--analysis-text-color-2);
        letter-spacing: 0;
        text-align: justify;
        line-height: 24px;
      }

      img {
        max-width: 100%;
      }
    }

  }
}

/*  内容区 */
.rule-scroll-area {
  flex: 1;
}</style>