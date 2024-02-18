<!--
 * @Author:
 * @Date:
 * @Description: 详情页  足球赛事分析 战绩 模块里边的 历史交战
-->
<template>
  <div class="recent_record" v-if="recent_record_data.length > 0 || if_the_selected.includes(true)">
    <div class="header">
      <span class="title ellipsis">{{ i18n_t('analysis_football_matches.recent_record') }}</span>
      <div class="tab-check-box"
           v-for="(item, index) in tab_check_box" :key="index+'box'"
           :class="{active:if_the_selected[index]}"
           @click="checkBox_click(index)"
      >
        {{item}}
      </div>
      <div class="tab-radio-button"
           v-for="(item, index) in tab_radio_button" :key="index+'tb'"
           :class="{active: radio_button_index == index,
                   'tab-radio-button0 tab-radio-1-no-l-border': index == 0,
                   'tab-radio-button2 tab-radio-1-no-r-border': index == 2
           }"
           @click="radioButton(item, index)"
      >
        {{item.name}}
      </div>
    </div>
    <template v-for="(item, index) in recent_record_data" :key="index+'team'">
      <div class="team-recent" >
        <div>
          <template v-if="index == 0">
            <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
            <team-img :type="0" :csid="lodash.get(get_detail_data,'csid')" :url="lodash.get(get_detail_data, 'mhlu[0]')" :fr="lodash.get(get_detail_data, 'frmhn[0]')" :size="22"></team-img>
            <team-img v-if="lodash.get(get_detail_data,'mhlu.length') > 1" :type="0" :csid="lodash.get(get_detail_data,'csid')" :url="lodash.get(get_detail_data,'mhlu[1]')" :fr="lodash.get(get_detail_data,'frmhn[1]')" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          </template>
          <template v-if="index == 1">
            <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
            <team-img :type="1" :csid="lodash.get(get_detail_data,'csid')" :url="lodash.get(get_detail_data, 'mhlu[0]')" :fr="lodash.get(get_detail_data, 'frmhn[0]')" :size="22"></team-img>
            <team-img v-if="lodash.get(get_detail_data,'malu.length') > 1" :type="1" :csid="lodash.get(get_detail_data,'csid')" :url="lodash.get(get_detail_data,'malu[1]')" :fr="lodash.get(get_detail_data,'frman[1]')" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          </template>
          <span class="team-name-limit ellipsis">{{ index == 0 ? lodash.get(get_detail_data,'mhn') : lodash.get(get_detail_data,'man') }}</span>
        </div>
        <div>
          <span v-for="(score,index) in item.records_list" :key="index">
            {{index == 0 ? score.success : index==1 ? score.flat : score.lose}}
            {{score.name}}
          </span>
        </div>
      </div>
      <!-- // :key='index' -->
      <public-form :liat_data="item.new_recent_record_data" :hm_index_name="index == 0 ? lodash.get(get_detail_data,'mhn') : lodash.get(get_detail_data,'man')"></public-form>
    </template>
  </div>
</template>

<script setup>
import {api_analysis} from "src/api/index.js";
import { onMounted, ref, reactive } from "vue";
// 详情页蓝色背景上的大型字母图标
import teamImg from "src/base-h5/components/details/team-img.vue";
// 详情页  足球赛事分析 战绩 模块里边的 公共列表
import publicForm from "src/base-h5/components/details/analysis-matches/components/public-form.vue";
import { computed } from "vue";
import { useRoute } from 'vue-router'
import { i18n_t } from "src/boot/i18n.js";
import lodash from "lodash"


const get_detail_data = ref({
        csid: '1',
        mid: '1',
    })
//国际化


// 无网络展示组件
// import no_data from "src/project/components/common/no-data";

  // components: {
  //   "public-form": public_form,
  //   "no-data": no_data,
  //   "team-img": team_img,
  // },
  const tab_index = ref(-1)
  const radio_button_index = ref(0)
  const progress_bar = ref(false)
  const tab_radio_button = ref([
    // TODO: 国际化 后续修改调整
    {name: `${i18n_t('analysis_football_matches.near')}5`, index: 5},
    {name: `${i18n_t('analysis_football_matches.near')}10`, index: 10},
    {name: `${i18n_t('analysis_football_matches.near')}15`, index: 15},
  ])
  const if_the_selected = ref([false, false])
  const tab_check_box = ref([
    // TODO: 国际化 后续修改调整
    i18n_t('analysis_football_matches.same_game'),
    i18n_t('analysis_football_matches.same_host_guest')
  ])
  const flag = ref(0)
  const cps = ref(5)
  const recent_record_data = ref([])
  let arr_ = ref([])
  const no_data = ref(false)
  const route = useRoute()
onMounted(() => {
  get_list()
})
  
    // mhid   主队id   mhn 主队名称
    // maid   客队id   man 客队名称
  const match_id = computed(() => {
    // 赛事id TODO: 后续修改调整 route get_detail_data
    return route.params.mid || get_detail_data.value.mid
  })
  // 复选框 点击事件
  const checkBox_click = (index) => {
      if_the_selected.value[index] = !if_the_selected.value[index]
      for (let i=0; i < if_the_selected.value.length; i++) {
        if(if_the_selected.value[0] && if_the_selected.value[1]){
          flag.value = 3;
          break
        }else if(index==0 && if_the_selected.value[index] || index==1 && if_the_selected.value[0]){
          flag.value = 1;
          break
        }else if(index==1 && if_the_selected.value[index] || index==0 && if_the_selected.value[1]){
          flag.value = 2;
          break
        }else{
          flag.value = 0;
        }
      }
      get_list()
      // TODO: 后续修改调整
      $forceUpdate()
    }
  const radioButton = (item, index) => {
      radio_button_index.value = index
      cps.value = item.index
      get_list()
    }
    // 初始化获得数据
  const get_list = async () => {
    try {
      let parameter = {
        // 1940891  赛事ID
        mid: match_id.value,
        // 0 = 默认，1=同联赛, 2= 同主客
        flag: flag.value,
        // 显示数量： 5场，10场，15场。
        cps: cps.value
      }
      let {code , data} = await api_analysis.get_team_vs_other_team(parameter)
      if(code == 200 && data != null) {
        let grouped_collection = [
          {
            new_recent_record_data:[],
            // TODO: 国际化后续修改调整
            records_list:[
              {success: 0, name: i18n_t('analysis_football_matches.victory')},
              {flat: 0, name: i18n_t('analysis_football_matches.flat')},
              {lose: 0, name: i18n_t('analysis_football_matches.negative')},
            ]
          },
          {
            new_recent_record_data:[],
            records_list:[
              {success: 0, name: i18n_t('analysis_football_matches.victory')},
              {flat: 0, name: i18n_t('analysis_football_matches.flat')},
              {lose: 0, name: i18n_t('analysis_football_matches.negative')},
            ]
          }
        ] // host_team_id
        let host_team_id = data[0].teamGroup
        data.map( (data_item) => {
          if(host_team_id == data_item.teamGroup) {
            grouped_collection[0].new_recent_record_data.push(data_item)
          }else{
            grouped_collection[1].new_recent_record_data.push(data_item)
          }
        })
        let arr = [
              {success: 0, name: i18n_t('analysis_football_matches.victory')},
              {flat: 0, name: i18n_t('analysis_football_matches.flat')},
              {lose: 0, name: i18n_t('analysis_football_matches.negative')},
            ]
        processing_score(grouped_collection)
        recent_record_data.value= grouped_collection

        no_data.value = false
      } else {
        no_data.value = true
      }
    } catch (error) {
      no_data.value = true
      console.error(error);
    }
  }
    // 加工 胜 平 负的数量
  const processing_score = (data) => {
    data.forEach((main_item)=>{
      main_item.new_recent_record_data.forEach((item)=>{
        if(item.result == 4){
          main_item.records_list[0].success = ++main_item.records_list[0].success
        }else if(item.result == 3){
          main_item.records_list[2].lose = ++main_item.records_list[2].lose
        }else{
          main_item.records_list[1].flat = ++main_item.records_list[1].flat
        }
      })
    })
  }
</script>

<style lang="scss" scoped>
.recent_record {
  background-color: var(--q-analysis-text-color-1);
  margin-top: 0.1rem;

  .header {
    height: 0.4rem;
    padding-left: 0.24rem;
    border-top: 1px solid var(--q-analysis-bd-color-3);
    border-bottom: 1px solid var(--q-analysis-bd-color-3);
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    background-color: var(--q-gb-bg-c-15) !important;

    .title {

      font-size: 0.14rem;
      height: 0.2rem;
      line-height: 0.22rem;
      letter-spacing: 0;
      width: 0.985rem;
      font-weight: bold;
      color: var(--q-analysis-text-color-20);
      &:before {
        content: '';
        width: 0.03rem;
        height: 0.12rem;
        position: absolute;
        left: 0.16rem;
        top: 0.14rem;
        background: url($SCSSPROJECTPATH + "/image/svg/title_tag.svg") no-repeat center  !important;
        border-radius: 1.5px;
      }
    }

    .tab-check-box {
      width: 0.5rem;
      height: 0.2rem;
      line-height: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--q-gb-bg-c-15);
      border: 1px solid var(--q-analysis-bd-color-5);
      color: var(--q-analysis-text-color-14);

      border-radius: 0.04rem;

      font-size: 0.1rem;

      letter-spacing: 0;
      text-align: center;
      margin-right: 0.1rem;

      &.active, &.progress_bar {
        background: var(--q-analysis-text-color-31);
        color: var(--q-analysis-text-color-1);
        border: unset;
      }
    }

    .tab-radio-button {
      width: 0.4rem;
      height: 0.2rem;
      line-height: 1;
      display: flex;
      justify-content: center;
      align-items: center;


      font-size: 0.1rem;

      letter-spacing: 0;
      text-align: center;
      background: var(--q-gb-bg-c-15);
      color: var(--q-analysis-text-color-14);
      border: 1px solid var(--q-analysis-bd-color-5)!important;
      &.active {
        background: var(--q-gb-bg-c-13);
        color: var(--q-gb-t-c-14);
        border: 1px solid var(--q-analysis-bd-color-7)!important;
      }

      &.tab-radio-button0 {
        border-right: unset;
        border-radius: 0.04rem 0 0 0.04rem;
      }

      &.tab-radio-button2 {
        border-left: unset;
        border-radius: 0 0.04rem 0.04rem 0;
      }
    }
  }

  .team-recent {
    display: flex;
    justify-content: space-between;
    height: 0.4rem;
    align-items: center;
    padding: 0 0.15rem;
    background: var(--q-analysis-text-color-27);
    :deep(.team-img) {
      width: 0.2rem;
      height: 0.2rem;
      margin-right: 0.05rem;

      img {
        width: 0.2rem;
        height: 0.2rem;
        position: relative;
      }
    }

    .team-name-limit {
      height: 0.2rem;
      line-height: 0.2rem;
    }

    div {
      font-size: 0.12rem;

      letter-spacing: 0;
      line-height: 0.12rem;
      font-weight: bold;
      color: var(--q-analysis-text-color-20);
      &:nth-child(1) {
        display: flex;
        align-items: center;
        height: 0.2rem;
      }

      &:nth-child(2) {
        span {
          margin-left: 0.1rem;
          font-weight: unset;
        }
      }
    }
  }
  :deep(.public_form) {
    background-color: var(--q-analysis-text-color-1);
    .header {
      > div {
        color: var(--q-analysis-text-color-14);
      }
    }
    .team-item {
      border-bottom: 1px solid var(--q-analysis-text-color-24);
      background-color: var(--q-gb-bg-c-15);
      div {
        color: var(--q-analysis-text-color-20);
      }
      .col3 {
        .home.add_bold {
          color: var(--q-analysis-text-color-20);
        }
        .away.add_bold {
          color: var(--q-analysis-text-color-20);
        }
        .home {
          color: var(--q-analysis-text-color-32);
        }
      }
      .col4.end-btn {
        >span.results {
          color: var(--q-analysis-text-color-1);
        }
        >span.results.results_win {
          color: var(--q-analysis-text-color-6);
        }
        >span.results.results_flat {
          color: var(--q-analysis-text-color-8);
        }
        >span.results.results_lose {
          color: var(--q-analysis-text-color-7);
        }
      }
    }
    .team-item:nth-child(odd) {
      background-color: var(--q-analysis-text-color-27);
    }
  }
}
</style>
