<!--
 * @Author: ledron
 * @Date: 2020-02-16 18:18:18
 * @Description: 详情页  足球赛事分析 战绩 模块里边的 历史交战
-->
<template>
  <div class="recent_record" v-if="recent_record_data.length > 0 || if_the_selected.includes(true)">
    <div class="header">
      <span class="title ellipsis">{{ $root.$t('analysis_football_matches.recent_record') }}</span>
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
    <template v-for="(item, index) in recent_record_data" >
      <div class="team-recent" :key="index+'team'">
        <div>
          <template v-if="index == 0">
            <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
            <team-img :type="0" :csid="get_detail_data.csid" :url="get_detail_data.mhlu[0]" :fr="get_detail_data.frmhn[0]" :size="22"></team-img>
            <team-img v-if="get_detail_data.mhlu.length > 1" :type="0" :csid="get_detail_data.csid" :url="get_detail_data.mhlu[1]" :fr="get_detail_data.frmhn[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          </template>
          <template v-if="index == 1">
            <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
            <team-img :type="1" :csid="get_detail_data.csid" :url="get_detail_data.malu[0]" :fr="get_detail_data.frman[0]" :size="22"></team-img>
            <team-img v-if="get_detail_data.malu.length > 1" :type="1" :csid="get_detail_data.csid" :url="get_detail_data.malu[1]" :fr="get_detail_data.frman[1]" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          </template>
          <span class="team-name-limit ellipsis">{{ index == 0 ? get_detail_data.mhn : get_detail_data.man }}</span>
        </div>
        <div>
          <span v-for="(score,index) in item.records_list" :key="index">
            {{index == 0 ? score.success : index==1 ? score.flat : score.lose}}
            {{score.name}}
          </span>
        </div>
      </div>
      <public-form :liat_data="item.recent_record_data" :hm_index_name="index == 0 ? get_detail_data.mhn : get_detail_data.man" :key='index'></public-form>
    </template>
  </div>
</template>

<script>
import {api_result} from "src/project/api";
import {mapGetters} from "vuex";
import team_img from "src/project/components/details/team_img";   // 详情页蓝色背景上的大型字母图标
import public_form from "src/project/pages/details/analysis-matches/components/public_form.vue";  // 详情页  足球赛事分析 战绩 模块里边的 公共列表
import no_data from "src/project/components/common/no_data";  // 无网络展示组件

export default {
  name: "",
  components: {
    "public-form": public_form,
    "no-data": no_data,
    "team-img": team_img,
  },
  data() {
    return {
      tab_index: -1,
      radio_button_index: 0,
      progress_bar: false,
      tab_radio_button: [
        {name: `${this.$root.$t('analysis_football_matches.near')}5`, index: 5},
        {name: `${this.$root.$t('analysis_football_matches.near')}10`, index: 10},
        {name: `${this.$root.$t('analysis_football_matches.near')}15`, index: 15},
      ],
      if_the_selected: [false, false],
      tab_check_box: [
        this.$root.$t('analysis_football_matches.same_game'),
        this.$root.$t('analysis_football_matches.same_host_guest')
      ],
      flag: 0,
      cps: 5,
      recent_record_data: [],
      no_data: false
    }
  },
  computed: {
    // mhid   主队id   mhn 主队名称
    // maid   客队id   man 客队名称
    ...mapGetters(["get_goto_detail_matchid", 'get_detail_data']),
    // 赛事id
    match_id() {
      return this.$route.params.mid || this.get_detail_data.mid
    },
  },
  watch: {},
  methods: {
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
      this.get_list()
      this.$forceUpdate()
    },
    radioButton(item, index) {
      this.radio_button_index = index
      this.cps = item.index
      this.get_list()
    },
    // 初始化获得数据
    async get_list() {
      try {
        let parameter = {
          mid: this.match_id, // 1940891  赛事ID
          flag: this.flag,  // 0 = 默认，1=同联赛, 2= 同主客
          cps: this.cps // 显示数量： 5场，10场，15场。
        }
        let {code , data} = await api_result.get_team_vs_other_team(parameter)
        if(code == 200 && data != null) {
          let grouped_collection = [
            {
              recent_record_data:[],
              records_list:[
                {success: 0, name: this.$root.$t('analysis_football_matches.victory')},
                {flat: 0, name: this.$root.$t('analysis_football_matches.flat')},
                {lose: 0, name: this.$root.$t('analysis_football_matches.negative')},
              ]
            },
            {
              recent_record_data:[],
              records_list:[
                {success: 0, name: this.$root.$t('analysis_football_matches.victory')},
                {flat: 0, name: this.$root.$t('analysis_football_matches.flat')},
                {lose: 0, name: this.$root.$t('analysis_football_matches.negative')},
              ]
            }
          ],  host_team_id
          host_team_id = data[0].teamGroup
          data.forEach( (data_item, index, arr) => {
            if(host_team_id == data_item.teamGroup) {
              grouped_collection[0].recent_record_data.push(data_item)
            }else{
              grouped_collection[1].recent_record_data.push(data_item)
            }
          })
          this.processing_score(grouped_collection)
          this.recent_record_data = grouped_collection
          this.no_data = false
        } else {
          this.no_data = true
        }
      } catch (error) {
        this.no_data = true
        console.error(error);
      }
    },
    // 加工 胜 平 负的数量
    processing_score(data) {
      data.forEach((main_item)=>{
        main_item.recent_record_data.forEach((item)=>{
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
.recent_record {

  margin-top: 0.1rem;

  .header {
    height: 0.4rem;
    padding-left: 0.24rem;

    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    background-color: var(--q-color-page-bg-color-37) !important;

    .title {

      font-size: 0.14rem;
      height: 0.2rem;
      line-height: 0.22rem;
      letter-spacing: 0;
      width: 0.985rem;
      font-weight: bold;

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

        color: var(--q-color-com-bg-color-12);
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
    display: flex;
    justify-content: space-between;
    height: 0.4rem;
    align-items: center;
    padding: 0 0.15rem;

    ::v-deep.team-img {
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
}
</style>
