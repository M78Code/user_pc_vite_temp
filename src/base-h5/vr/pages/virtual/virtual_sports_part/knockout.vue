<!--
 * @Author: ledron
 * @Date: 2020-12-30 18:13:55
 * @Description: 虚拟体育 淘汰赛页面 只需要传个 tid 联赛id进来
-->
<template>
  <div class="elimination-rank" :class="{'vi-lang': get_lang == 'vi'}">
    <!-- 积分榜tab -->
    <div class="row justify-center tabs-bar">
      <div v-for="(item, index) in tabs" :key="index"
           :class="{ progress_bar: tab_index >= index}"
           @click="tabClick(item, index)"
      >
        <span>{{item.name}}</span>
        <i></i>
      </div>
    </div>
    <!-- 赛事 -->
    <div class="gam_report" v-if="!no_data">
      <div class="match-item" v-for="(item,index) in list_data" :key="index">
        <template v-if="list_data[0].list">
          <div class="left_contend">
            <template v-for="(troops, index) in item.list" :key="index">
              <div class="team" >
                <div class="number">{{ String.fromCharCode(+troops.ranking_index +65) }}</div>
                <div class="name">
                  <div class="ellipsis yb-absolute-fit">{{ troops.homeName }}</div>
                </div>
                <div class="score">{{ troops.homeScore[0] || '-'}}</div>
                <div class="score">{{ troops.homeScore[1] || '-' }}</div>
                <div class="score">{{ troops.homeScore[2] || '-'}}</div>
              </div>
              <div class="team" v-if="tab_index>=0">
                <div class="number" style="opacity: 0">{{ +troops.ranking_index + 1 }}</div>
                <div class="name">
                  <div class="ellipsis yb-absolute-fit">{{ troops.awayName }}</div>
                </div>
                <div class="score">{{ troops.awayScore[0] || '-'}}</div>
                <div class="score">{{ troops.awayScore[1] || '-'}}</div>
                <div class="score">{{ troops.awayScore[2] || '-'}}</div>
              </div>
            </template>
          </div>
          <div class="row align_items right_side_win">
            <div class="left-line">
              <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/rectangle_113.png`"/>
            </div>
            <div class="final flex flex-center">
              <div class="name" v-if="tabs[tab_index+1]">
                {{ tabs[tab_index+1].name }}
              </div>
              <div class="number">{{String.fromCharCode(+index +65)}}</div>
            </div>
          </div>
        </template>
      </div>
      <div class="main-finals" v-if="list_data.length == 1 && !list_data[0].list">
        <div class="finals-team">
          <!-- <img  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/wwwassets/bw3/svg/finals.svg`" alt=""> -->
          <img  :src="`/${project_name}image/svg/finals.svg`" alt="">
          <span>{{ list_data[0].homeName }}</span>
        </div>
        <div class="middle">
          <!-- <img src="image/wwwassets/bw3/images/v-s-finals.png" alt=""> -->
          <img  :src="`/${project_name}image/svg/v-s-finals.svg`" alt="">
          <span>VS</span>
        </div>
        <div class="finals-team">
          <!-- <img  src="image/wwwassets/bw3/svg/finals.svg" alt=""> -->
          <img  :src="`/${project_name}/image/svg/finals.svg`" alt="">
          <span>{{ list_data[0].awayName }}</span>
        </div>
      </div>
      <q-inner-loading :showing="visible">
        <img alt class="loading-static-animation" src="image/wwwassets/bw3/svg/loading-more.svg"/>
      </q-inner-loading>
    </div>
    <!-- 没有数据 组件 -->
    <no-data v-if="no_data" which='noMatch' height='500' class="no-list"/>

  </div>
</template>

<script>
import { LOCAL_PROJECT_FILE_PREFIX,calc_win, project_name, i18n_t } from 'src/output/index.js'
import { api_v_sports } from "src/base-h5/vr/api";
import no_data from "src/base-h5/vr/components/common/no_data.vue";

export default {
  name: "knockout",
  components: {
    "no-data": no_data
  },
  props:{
    tid: Number|String,
    current_match: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      tabs: [
        {name: i18n_t('virtual_sports.top_16'), key: 'Q8'},
        {name: i18n_t('virtual_sports.quarter_finals'), key: 'Q4'},
        {name: i18n_t('virtual_sports.semifinals'), key: 'SEMIFINAL'},
        {name: i18n_t('virtual_sports.finals'), key: 'FINAL'}
      ],
      // tab_index: -1,
      tab_index: -1,
      visible: false,
      no_data: false,
      list_data: [],
      check_if_there_tab: []  //  判断tab 选项卡是不是有数据
    }
  },
  computed: {
    // ...mapGetters(['get_lang']),
    get_lang(){return 'zh'}
  },
  watch: {
    'current_match': {
      handler: 'get_list',
      immediate: true
    }
  },
  created() {
    this.list_data = [{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065700105539587","awayScore":["3"],"homeName":"阿根挺少年队","homeNameCode":"125065699660943363","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":0},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125019543669067779","awayScore":["1"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065700134899720","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":1}]},{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699941961731","awayScore":["2"],"homeName":"阿拉维预备","homeNameCode":"125065699677720578","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":2},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699195375619","awayScore":["2"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065699178598404","homeScore":["0"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":3}]},{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065700524969987","awayScore":["2"],"homeName":"卡利阿美利加","homeNameCode":"125065700814376965","homeScore":["0"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":4},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699711275012","awayScore":["0"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065699199569922","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":5}]},{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699145043971","awayScore":["1"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125019543769731075","homeScore":["0"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":6},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065700139094019","awayScore":["1"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065700533358594","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":7}]}]
  },
  setup() {
    return {
      LOCAL_PROJECT_FILE_PREFIX
    }
  },
  methods: {
    tabClick(item, i) {
      console.log("this.list_data+++===", this.list_data);
      if(this.tab_index == i) return
      // 判断选项卡里边有没有数据
      if (!Object.keys(this.check_if_there_tab).includes(item.key)) {
        this.$toast(i18n_t('virtual_sports.no_data') + i18n_t(`${item.name}`), 1000)
        return
      }
      this.knockout_list_filter(i)
      this.tab_index = i
    },
    async get_list() {
      try {
        this.visible = true
        this.tab_index = -1
        let params = {
          tid: this.tid,
          batchNo: this.current_match.batchNo,
          lod: this.current_match.lod || 1,
          mmp: this.current_match.mmp,
          beginTime: this.current_match.mgt,
        }
        console.log(params);
        // this.json_list  调试用的, data 才是真实数据
        let {code, data} = await api_v_sports.get_match_sorce(params)
        this.visible = false
        this.check_if_there_tab = data
        // this.check_if_there_tab = this.json_list
        if (code == 200) {
          if(Object.keys(data).length > 0) {
            // if(Object.keys(this.json_list).length > 0) {
            this.tab_index = Object.keys(data).length - 1
            this.no_data = false
            this.knockout_list_filter(this.tab_index)
          } else {
            this.no_data = true
          }
        }
      } catch (error) {
        this.no_data = false
        this.visible = false
        console.error(error);
      }
    },
    // 数据格处理
    knockout_list_filter(filter_index) {
      let arr = this.check_if_there_tab[this.tabs[filter_index].key], index = 0;

      // 加工每一轮的比分
      this.processing_score(arr)

      // 清除 list_data 的数据
      this.list_data =[]
      if (arr.length >= 2) {
        for (let i = 0, len = arr.length; i < len; i += 2) {
          this.list_data[index] = {}
          this.list_data[index].list = [...arr.slice(i, 2 + i)]
          index++
        }
      } else {
        this.list_data = [...arr]
      }
      console.log("this.list_data---knockout+++=====", JSON.stringify(this.list_data))
    },
    // 加工每一轮的比分
    processing_score(arr) {
      arr.forEach((item, i) => {
        item.ranking_index = i
        // 如果是数组，并且 里边分数数组长度超过两个，代表里边有 逗号
        if(!Array.isArray(item.homeScore) && item.homeScore.indexOf(',')){
          item.homeScore = item.homeScore.split(",");
        }
        if(!Array.isArray(item.awayScore) && item.awayScore.indexOf(',')){
          item.awayScore = item.awayScore.split(",");
        }
      })
    }
  },
  destroyed () {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
};
</script>

<style lang="scss" scoped>
.elimination-rank {

  min-height: 3.2rem;

  width: 98vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  // background-color: red;
  border-radius: 0.05rem;

  &.vi-lang {
    .tabs-bar {
      div {
        font-size: 0.12rem;
      }
    }
  }

  .tabs-bar {
    width: 100%;
    height: 0.44rem;
    margin: 0.11rem 0.03rem 0.15rem 0.03rem;

    // background-color: goldenrod;
    // background-color: orangered !important;
    // border: 1px solid paleturquoise;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    > div {
      // flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      font-size: 0.14rem;

      // margin: 0 0.02rem;

      width: 24%;

      // background-color: yellow;
      i {
        width: 100%;
        height: 0.04rem;
        border-bottom: 0.05rem solid #ccc;
      }
      
      &.progress_bar {
        color: #179CFF;
        i {
          border-bottom: 0.05rem solid #179CFF;
        }
      }
    }
  }
	/*  赛事 */
  .gam_report {
    position: relative;
    min-height: 150px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // background-color: palegoldenrod;
    
  }

  .match-item {
    width: 100%;
    // background-color: yellow;
    display: flex;
    align-items: center;
    margin-bottom: 0.2rem;

    &:nth-last-child(1) {

    }

    .right_side_win {
      position: relative;
      top: -0.05rem;
      flex: 1;
      height: 0.89rem;
			/*  右边线条 */
      .left-line {
        width: 0.42rem;
        height: 0.89rem;
        display: flex;
        align-items: center;
        position: relative;

        &:before {
          content: '';
          width: 55%;
          height: 100%;

          border-radius: 0 0.08rem 0.08rem 0;
          border-left: none;
          position: relative;
        }

        &:after {
          content: '';
          width: 45%;
          height: 1px;

          position: absolute;
          right: 0;
        }
      }
			/*  决赛 */
      .final {
        position: absolute;
        right: 0;
        font-size: 0.12rem;

        width: 1rem;
        height: 0.8rem;
        flex-direction: column;
        border-radius: 0.08rem;

        &::after {
          content: "";
          pointer-events: none;
          position: absolute;
          left: 0;
          top: 0;
          width: 200%;
          height: 200%;
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
          -webkit-transform-origin: left top;
          transform-origin: left top;
          border: 1px solid;
          border-radius: 0.08rem;
          overflow: hidden;
        }

        .number {

          font-size: 0.2rem;
        }
      }
    }

    .left_contend{

      // background-color: yellowgreen;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    

      .team {
        position: relative;
        display: flex;
        width: 2.2rem;
        height: 0.4rem;
        align-items: center;

        // background-color: paleturquoise;


        font-size: 0.13rem;

        &::after {
          content: "";
          pointer-events: none;
          position: absolute;
          left: 0;
          top: 0;
          width: 200%;
          height: 200%;
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
          -webkit-transform-origin: left top;
          transform-origin: left top;
          border: 1px solid;
          border-bottom: 0;
          border-radius: 0.08rem 0.08rem 0 0;
          overflow: hidden;
        }

        &:nth-of-type(odd) {
// background-color: pink;
          border-bottom: 0.01rem solid #ccc;

          &:nth-child(2n){
            background-color: red;
          }

        }

        &:nth-child(2n) {
          position: relative;
          margin-bottom: 0.08rem;

          &::before {
            content: "";
            pointer-events: none;
            position: absolute;
            left: 0;
            top: 0;
            width: 200%;
            height: 200%;
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
            -webkit-transform-origin: left top;
            transform-origin: left top;
            border: 1px solid;
            border-top: 0;
            border-radius: 0 0 0.08rem 0.08rem;
            overflow: hidden;
          }

          &::after {
            content: '';
            width: auto;
            height: 1px;

            position: absolute;
            top: -0.01rem;
            left: -0.69rem;
          }
        }

        .number {
          position: relative;
          z-index: 10;
          width: 0.3rem;
          padding-left: 0.1rem;

          top: 0.19rem;
          left: -0.02rem;

          font-size: 0.2rem;
        }

        .name {
          width: 0.9rem;
          height: 100%;
          line-height: 0.32rem;

          .ellipsis {

            font-size: 0.13rem;
          }
        }

        .score {
          width: 0.28rem;
          text-align: center;

          font-size: 0.12rem;

          line-height: 0.14rem;
        }
      }

    }

		/*  战队信息 */

  }

  .main-finals {
    display: flex;
    padding: 0 0.1rem;
    margin-top: 0.55rem;

    .finals-team {
      position: relative;
      width: 1.4rem;
      height: 0.8rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      border-radius: 0.08rem;

      &::after {
        content: "";
        pointer-events: none;
        position: absolute;
        left: 0;
        top: 0;
        width: 200%;
        height: 200%;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        -webkit-transform-origin: left top;
        transform-origin: left top;
        border: 1px solid;
        border-radius: 0.08rem;
        overflow: hidden;
      }

      img {
        width: 0.3rem;
        height: 0.3rem;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 0.13rem;

        line-height: 14px;
      }
    }

    .middle {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 0.76rem;
      position: relative;

      > img {
        width: 0.7rem;
        height: 0.7rem;
        position: absolute;
        top: -0.38rem;
      }

      > span {
        font-family: DIN-BoldItalic;
        font-size: 0.2rem;

        text-align: center;
        line-height: 14px;
        position: relative;
        top: 0.06rem;
      }

      &:after {
        content: '';
        width: 100%;
        height: 1px;

        position: relative;
        top: -0.17rem;
      }

      &:before {
        content: '';
        width: 1px;
        height: 0.1rem;

        position: relative;
        top: -0.03rem;
      }
    }
  }

  .q-inner-loading {

  }

  .no-list {
    padding: 20px 0 20px 0 !important;
  }
}
</style>
