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
              <div class="team_box">
                <div class="left">
                  <div class="number">{{ String.fromCharCode(+troops.ranking_index +65) }}</div>
                </div>
                <div class="right">
                  <div class="team" >
                    <div class="name">
                      <div class="ellipsis yb-absolute-fit">{{ troops.homeName }}</div>
                    </div>
                    <div class="score-box">
                      <div class="score">{{ troops.awayScore[0] || '-'}}</div>
                      <div class="score">{{ troops.awayScore[1] || '-'}}</div>
                      <div class="score">{{ troops.awayScore[2] || '-'}}</div>
                    </div>
                  </div>
                  <div class="team" v-if="tab_index>=0">
                    <!-- <div class="number" style="opacity: 0">{{ +troops.ranking_index + 1 }}</div> -->
                    <div class="name">
                      <div class="ellipsis yb-absolute-fit">{{ troops.awayName }}</div>
                    </div>
                    <div class="score-box">
                      <div class="score">{{ troops.awayScore[0] || '-'}}</div>
                      <div class="score">{{ troops.awayScore[1] || '-'}}</div>
                      <div class="score">{{ troops.awayScore[2] || '-'}}</div>
                    </div>
                  </div>
                </div>
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
      <!-- <div class="main-finals"> -->
        <div class="finals-team">
          <span>{{ list_data[0].homeName }}</span>
        </div>
        <div class="middle">
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/finals.svg`" alt="">
        </div>
        <div class="finals-team">
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
import { api_v_sports } from "src/base-h5/vr/api";
import no_data from "src/base-h5/vr/components/common/no_data.vue";
import { LOCAL_PROJECT_FILE_PREFIX,calc_win, project_name, i18n_t } from 'src/output/index.js'

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
  // mounted() {
  //   this.tab_index = 0;
  //   this.list_data = [{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065700105539587","awayScore":["3"],"homeName":"阿根挺少年队","homeNameCode":"125065699660943363","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":0},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125019543669067779","awayScore":["1"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065700134899720","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":1}]},{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699941961731","awayScore":["2"],"homeName":"阿拉维预备","homeNameCode":"125065699677720578","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":2},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699195375619","awayScore":["2"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065699178598404","homeScore":["0"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":3}]},{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065700524969987","awayScore":["2"],"homeName":"卡利阿美利加","homeNameCode":"125065700814376965","homeScore":["0"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":4},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699711275012","awayScore":["0"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065699199569922","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":5}]},{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699145043971","awayScore":["1"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125019543769731075","homeScore":["0"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":6},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065700139094019","awayScore":["1"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065700533358594","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":7}]}]
  // },
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

  border-radius: 0.08rem;
  padding-bottom: 0.52rem;

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
    margin: 0.08rem 0.03rem 0.12rem 0.03rem;

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

      width: 24%;
      color: #AFB3C8;
      font-size: 0.14rem;
      font-weight: 500;
      i {
        width: 100%;
        height: 0.04rem;
        border-bottom: 0.05rem solid #F2F2F6;
      }
      
      &.progress_bar {
        color: #179CFF;
        font-size: 0.14rem;
        font-weight: 600;
        i {
          border-bottom: 0.05rem solid #179CFF;
        }
      }
    }
  }
	/*  赛事 */
  .gam_report {
    // position: relative;
    min-height: 150px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .match-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    // margin-bottom: 0.2rem;

    &:nth-child(n+2){
      margin-top: 0.12rem;
    }

    &:nth-last-child(1) {

    }

    .left_contend{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .team_box{
        width: 2.29rem;
        height: 0.8rem;
        border-radius: 0.08rem;
        display: flex;
        flex-direction: row;

        background-color: #F2F2F6;
        
        &:nth-child(n+2){
          margin-top: 0.12rem;
        }
        .left{
          width: 0.39rem;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          .number {
            color: #303442;
            font-size: 0.16rem;
            font-weight: 600;
          }
        }

        .right{
          width: 1.78rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .team {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            width: 100%;
            height: 100%;
            align-items: center;
            font-size: 0.13rem;

            > div {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
            }

            &:nth-of-type(odd) {
              border-bottom: 0.01rem solid #E4E6ED;
              &:nth-child(2n){
                background-color: red;
              }
            }

            &:nth-child(2n) {
              // position: relative;
              // margin-bottom: 0.08rem;
            }
            .name {
              width: 0.9rem;
              height: 100%;
              line-height: 0.32rem;
              .ellipsis {
                color: #303442;
                font-size: 0.14rem;
                font-weight: 400;
              }
            }
            .score-box{
              width: 0.84rem;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              .score {
                width: 0.28rem;
                text-align: center;
                color: #303442;
                font-size: 0.14rem;
                font-weight: 500;
              }
            }
          }
        }
      }
    }
    .right_side_win {
      // position: relative;
      // top: -0.05rem;
      // flex: 1;
      // height: 0.89rem;
			/*  右边线条 */
      .left-line {
        width: 0.44rem;
        height: 0.94rem;
        display: flex;
        align-items: center;
        img{
          width: 100%;
          height: 100%;
        }
      }
			/*  决赛 */
      .final {
        width: 0.82rem;
        height: 0.80rem;
        border-radius: 0.08rem;
        background-color: #F2F2F6;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .name{
          font-size: 0.14rem;
          font-weight: 500;
        }
        .number {
          font-size: 0.16rem;
          font-weight: 600;
        }
      }
    }
		/*  战队信息 */
  }






  .main-finals {
    width: 3.56rem;
    height: .64rem;
    background-color: #F2F2F6;
    border-radius: .08rem;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    // padding: 0 0.1rem;
    margin-top: 0.24rem;

    .finals-team {
      width: 1.42rem;
      height: 0.4rem;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
      span {
        // width: .56rem;
        // height: .20rem;
        display: block;
        color: #303442;
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        font-weight: 400;

        line-height: 14px;
      }
    }

    .middle {
      width: .64rem;
      height: .64rem;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      > img {
        width: .6309rem;
        height: .5438rem;
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
