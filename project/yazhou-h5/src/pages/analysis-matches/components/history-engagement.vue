<!--
 * @Author: ledron
 * @Date: 2020-02-16 18:18:18
 * @Description: 详情页  足球赛事分析 战绩 模块里边的 历史交战
-->
<template>
  <div class="history_engagement" v-if="historical_engagement_data.length > 0 || if_the_selected.includes(true)">
    <div class="header">
      <span class="title ellipsis">{{ $root.$t('analysis_football_matches.historical_war') }}</span>
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
           @click="radioButton(item, index)"
      >
        {{item.name}}
      </div>
    </div>
    <!--<div class="team-recent ellipsis">
      <span class="ellipsis">{{ get_detail_data.mhn }}</span>
      <span>{{$root.$t(`analysis_football_matches.record_clashes[${tab_radio_button[radio_button_index].index}]`)}}</span>
      <span class="ellipsis">{{ get_detail_data.man }}</span>
    </div>
    <div class="success_or_failure">
      <span class="flex justify_content align_items"
            :style="{flex:[index == 0 ? item.success : index==1 ? item.flat : item.lose]}"
            v-for="(item, index) in records_list" :key="index + 'i'"
      >
        <div>
          <span>{{index == 0 ? item.success : index==1 ? item.flat : item.lose}}</span>
          {{item.name}}
        </div>
      </span>
    </div>-->
    <public-form :liat_data="historical_engagement_data" :hm_index_name="get_detail_data.mhn"></public-form>
    <!-- 没有数据 组件 -->
<!--    <no-data v-if="no_data" which='noMatch' height='500' class="no-list"></no-data>-->
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {api_result} from "src/project/api";
import public_form from "src/project/pages/details/analysis-matches/components/public_form.vue";  // 详情页  足球赛事分析 战绩 模块里边的 公共列表
import no_data from "src/project/components/common/no_data";  // 无网络展示组件

export default {
  name: "",
  components: {
    "public-form": public_form,
    "no-data": no_data,
  },
  data() {
    return {
      tab_index: -1,
      radio_button_index: 0,
      isoptions : false,
      progress_bar: false,
      tab_radio_button: [
        {name: `${this.$root.$t('analysis_football_matches.near')}5`, index: 5 },
        {name: `${this.$root.$t('analysis_football_matches.near')}10`, index: 10 },
        {name: `${this.$root.$t('analysis_football_matches.near')}15`, index: 15 },
      ],
      records_list: [
        {success: 0, name: this.$root.$t('analysis_football_matches.victory')},
        {flat: 0, name: this.$root.$t('analysis_football_matches.flat')},
        {lose: 0, name: this.$root.$t('analysis_football_matches.negative')},
      ],
      if_the_selected: [false, false],
      tab_check_box: [
        this.$root.$t('analysis_football_matches.same_game'),
        this.$root.$t('analysis_football_matches.same_host_guest')
      ],
      flag: 0,
      cps: 5,
      historical_engagement_data: [],
      no_data: false
    }
  },
  computed: {
    ...mapGetters(["get_goto_detail_matchid", 'get_detail_data']),
    // 赛事id
    match_id() {
      return this.$route.params.mid || this.get_detail_data.mid
    },
  },
  watch: {},
  methods: {
    // 初始化获得数据
    async get_list() {
      try {
        let parameter = {
          mid: this.match_id, //  1940891  赛事ID
          flag: this.flag,  // 0 = 默认，1=同联赛, 2= 同主客
          cps: this.cps // 显示数量： 5场，10场，15场。
        }
        let {code , data} = await api_result.get_team_vs_history(parameter)
        if(code == 200 && data ) {
          this.records_list = [
            {success: 0, name: this.$root.$t('analysis_football_matches.victory')},
            {flat: 0, name: this.$root.$t('analysis_football_matches.flat')},
            {lose: 0, name: this.$root.$t('analysis_football_matches.negative')},
          ]
          data.forEach( (item) => {
            if(item.result == 4){
              this.records_list[0].success = ++this.records_list[0].success
            }else if(item.result == 3){
              this.records_list[2].lose = ++this.records_list[2].lose
            }else{
              this.records_list[1].flat = ++this.records_list[1].flat
            }
          })
          this.historical_engagement_data = data
          this.no_data = false
        } else {
          this.no_data = true
        }
      } catch (error) {
        this.no_data = true
        console.error(error);
      }
    },
    // 复选框 点击事件
    checkBox_click(index) {
      this.if_the_selected[index] = !this.if_the_selected[index]
      for (let i=0; i < this.if_the_selected.length; i++) {
        if(this.if_the_selected[0] && this.if_the_selected[1]){
          this.flag = 3;
          break
        }else if(index==0 && this.if_the_selected[index] || index==1 && this.if_the_selected[0]){
          this.flag = 1;
          break
        }else if(index==1 && this.if_the_selected[index] || index==0 && this.if_the_selected[1]){
          this.flag = 2;
          break
        }else{
          this.flag = 0;
        }
      }
      this.$forceUpdate()
      this.get_list()
    },
    radioButton(item, index) {
      this.radio_button_index = index
      this.cps = item.index
      this.get_list()
      this.$forceUpdate()
    }
  },
  created() {
    this.get_list()
  },
  destroyed() {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
};
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
    // background-color: var(--q-color-page-bg-color-37);
    background-color:var(--q-color-page-bg-color-2);

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

      &.active {


        //border: unset;
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
    margin: 0.17rem 0 0.1rem;
    padding: 0 0.15rem 0 0.24rem;
    text-align: center;
    position: relative;

    span {

      font-size: 0.12rem;

      font-weight: bold;

      &:nth-child(1) {
        width: 1.1rem;
        float: left;
      }

      &:nth-child(3) {
        float: right;
        width: 0.95rem;
      }

      &:nth-child(2) {


        margin: 0 0.1rem;
        position: absolute;
        font-weight: unset;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .success_or_failure {
    display: flex;
    justify-content: center;
    height: 0.3rem;
    margin: 0 0.15rem 0.15rem;

    > span {
      min-width: 0.4rem !important;
      font-size: 0.12rem;
      transition: all 0.2s;
      flex: 1;
      @include webkit(transform, skew(-13deg));

      > div {
        @include webkit(transform, skew(13deg));

        > span {

        }
      }

      &:nth-child(1) {

      }

      &:nth-child(2) {

        margin: 0 0.03rem;
      }

      &:nth-child(3) {

      }
    }
  }
}
</style>
