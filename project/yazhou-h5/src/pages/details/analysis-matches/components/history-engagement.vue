<!--
 * @Author:
 * @Date:
 * @Description: 详情页  足球赛事分析 战绩 模块里边的 历史交战
-->
<template>
  <div class="history_engagement" v-if="historical_engagement_data.length > 0 || if_the_selected.includes(true)">
    <div class="header">
      <span class="title ellipsis">{{ i18n_t('analysis_football_matches.historical_war') }}</span>
      <div class="tab-check-box"
           v-for="(item, index) in tab_check_box" :key="index"
           :class="{active:if_the_selected[index]}"
           @click="checkBox_click(index)"
      >
        {{item}}
      </div>
      <div class="tab-radio-button"
           v-for="(item, index) in tab_radio_button" :key="index+'tb'"
           :class="{active: radio_button_index == index,
                   'tab-radio-button0': index == 0,
                   'tab-radio-button2': index == 2
           }"
           @click="radio_button(item, index)"
      >
        {{item.name}}
      </div>
    </div>

    <public-form :liat_data="historical_engagement_data" :hm_index_name="get_detail_data.mhn"></public-form>

  </div>
</template>

<script setup>
// import {mapGetters} from "vuex";
import {api_analysis} from "src/api/index.js";
 // 详情页  足球赛事分析 战绩 模块里边的 公共列表
// import publicForm from "project_path/src/pages/details/analysis-matches/components/public-form.vue";
 // 无网络展示组件
// import noData from "project_path/src/components/common/no-data.vue";
import { ref, computed, onUnmounted, onMounted } from "vue";
import { useRoute } from 'vue-router'
import { i18n_t } from "src/boot/i18n.js";

  // components: {
  //   "public-form": public_form,
  //   "no-data": no_data,
  // },
  // 国际化

  const tab_index = ref(-1)
  const radio_button_index = ref(0)
  const isoptions = ref(false)
  const progress_bar = ref(false)
  const tab_radio_button = ref([
    {name: `${i18n_t('analysis_football_matches.near')}5`, index: 5 },
    {name: `${i18n_t('analysis_football_matches.near')}10`, index: 10 },
    {name: `${i18n_t('analysis_football_matches.near')}15`, index: 15 },
  ])
  const records_list = ref([
    {success: 0, name: i18n_t('analysis_football_matches.victory')},
    {flat: 0, name: i18n_t('analysis_football_matches.flat')},
    {lose: 0, name: i18n_t('analysis_football_matches.negative')},
  ])
  const if_the_selected = ref([false, false])
  const tab_check_box = ref([
    i18n_t('analysis_football_matches.same_game'),
    i18n_t('analysis_football_matches.same_host_guest')
  ])
  const flag = ref(0)
  const cps = ref(5)
  // 数据集合
  const historical_engagement_data = ref([])
  // 无数据
  const no_data = ref(false)
  // 路由
  const route = useRoute()

  onMounted(() => {
    get_list()
  })


  // 赛事id TODO:  get_detail_data 后续修改调整
  const match_id = computed(() => {
    route.params.mid || get_detail_data.mid
  })
  // computed: {
  //   ...mapGetters(["get_goto_detail_matchid", 'get_detail_data']),
  // },
  // 初始化获得数据
  const get_list = async () => {
    try {
      let parameter = {
        //  1940891  赛事ID match_id
        mid: route.params.mid || get_detail_data.mid,
        // 0 = 默认，1=同联赛, 2= 同主客
        flag: flag,
        // 显示数量： 5场，10场，15场。
        cps: cps
      }
      let {code , data} = await api_analysis.get_team_vs_history(parameter)
      if(code == 200 && data ) {
        records_list = [
          // TODO: 国际化修改后调整
          {success: 0, name: i18n_t('analysis_football_matches.victory')},
          {flat: 0, name: i18n_t('analysis_football_matches.flat')},
          {lose: 0, name: i18n_t('analysis_football_matches.negative')},
        ]
        data.forEach( (item) => {
          if(item.result == 4){
            records_list[0].success = ++records_list[0].success
          }else if(item.result == 3){
            records_list[2].lose = ++records_list[2].lose
          }else{
            records_list[1].flat = ++records_list[1].flat
          }
        })
        historical_engagement_data = data
        no_data.value = false
      } else {
        no_data.value = true
      }
    } catch (error) {
      no_data.value = true
      console.error(error);
    }
  }
  // 复选框 点击事件
  const checkBox_click = (index) => {
    if_the_selected[index] = !if_the_selected[index]
    for (let i=0; i < if_the_selected.length; i++) {
      if(if_the_selected[0] && if_the_selected[1]){
        flag = 3;
        break
      }else if(index==0 && if_the_selected[index] || index==1 && if_the_selected[0]){
        flag = 1;
        break
      }else if(index==1 && if_the_selected[index] || index==0 && if_the_selected[1]){
        flag = 2;
        break
      }else{
        flag = 0;
      }
    }
    // TODO:  后续修改调整
    // $forceUpdate()
    get_list()
  }
  const radio_button = (item, index) => {
    radio_button_index = index
    cps = item.index
    get_list()
    // TODO:  后续修改调整
    // $forceUpdate()
  }
  onUnmounted(() => {
    tab_index.value = -1
    radio_button_index.value = 0
    isoptions.value = false
    progress_bar.value = false
    tab_radio_button.value = [
      {name: `${i18n_t('analysis_football_matches.near')}5`, index: 5 },
      {name: `${i18n_t('analysis_football_matches.near')}10`, index: 10 },
      {name: `${i18n_t('analysis_football_matches.near')}15`, index: 15 },
    ]
    records_list.value = [
      {success: 0, name: i18n_t('analysis_football_matches.victory')},
      {flat: 0, name: i18n_t('analysis_football_matches.flat')},
      {lose: 0, name: i18n_t('analysis_football_matches.negative')},
    ]
    if_the_selected.value = [false, false]
    tab_check_box.value = [
      i18n_t('analysis_football_matches.same_game'),
      i18n_t('analysis_football_matches.same_host_guest')
    ]
    flag.value = 0
    cps.value = 5
    historical_engagement_data.value = []
    no_data.value = false
  })
</script>

<style lang="scss" scoped>
.history_engagement {
  .header {
    height: 0.4rem;
    padding-left: 0.24rem;
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    // background-color:var(--q-color-page-bg-color-2);
    .title {
      font-size: 0.14rem;
      height: 0.2rem;
      line-height: 0.22rem;
      letter-spacing: 0;
      font-weight: bold;
      width: 0.985rem;
      &:before {
        content: '';
        width: 0.03rem;
        height: 0.12rem;
        position: absolute;
        left: 0.16rem;
        top: 0.14rem;

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
      border-radius: 0.04rem;
      font-size: 0.1rem;
      letter-spacing: 0;
      text-align: center;
      margin-right: 0.1rem;
      &.active, &.progress_bar {
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

}
</style>
