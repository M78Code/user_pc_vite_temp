<!--
 * @Description: 虚拟体育 淘汰赛页面 只需要传个 tid 联赛id进来
-->
<template>
  <div class="elimination-rank" :class="{'vi-lang': lang == 'vi'}">
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
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/virtual-sports/finals.svg`" alt="">
        </div>
        <div class="finals-team">
          <span>{{ list_data[0].awayName }}</span>
        </div>
      </div>
      <q-inner-loading :showing="visible">
        <img alt class="loading-static-animation" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/loading-more.svg`"/>
      </q-inner-loading>
    </div>
    <!-- 没有数据 组件 -->
    <no-data v-if="no_data" which='noMatch' height='500' class="no-list"/>

  </div>
</template>
<script>
import knockout_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/knockout-mixin.js";
import no_data from "project_path/src/pages/vr/components/common/vr-sport-no-data.vue";
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js'
export default {
  mixins:[knockout_mixin],
  name:'knockout',
  components: {
    "no-data": no_data
  },
  setup() {
    return {
      LOCAL_PROJECT_FILE_PREFIX,
    }
  },
}
</script>

<style lang="scss" scoped>
.elimination-rank {

  min-height: 3.2rem;

  background-color: var(--q-gb-bg-c-34);

  width: 98vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
        color: var(--q-gb-t-c-1);
        font-size: 0.14rem;
        font-weight: 400;
        i {
          border-bottom: 0.05rem solid var(--q-gb-bd-c-16);
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

        background-color: var(--q-gb-bg-c-28);
        
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
            color: var(--q-gb-t-c-18);
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
              border-bottom: 0.01rem solid var(--q-gb-bd-c-10);
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
                font-family: "PingFang SC";
                color: var(--q-gb-t-c-12);
                font-size: 0.12rem;
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
                color: var(--q-gb-t-c-12);
                font-family: 'DIN';
                font-size: 0.12rem;
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
        background-color: var(--q-gb-bg-c-28);
        color: var(--q-gb-t-c-21);
        font-family: 'PingFang SC';
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .name{
          font-size: 0.12rem;
          font-weight: 400;
        }
        .number {
          color: var(--q-gb-t-c-18);
          font-size: 0.16rem;
          font-weight: 600;
        }
      }
    }
		/*  战队信息 */
  }






  .main-finals {
    width: 100%;
    height: 1.22rem;
    // background-color: #F2F2F6;
    border-radius: .08rem;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    // padding: 0 0.1rem;
    margin-top: 0.24rem;

    .finals-team {
      width: 1.375rem;
      height: 0.8rem;

      border: 0.005rem;
      border-radius: 0.08rem;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      background-color: var(--q-gb-bg-c-28);
      
      span {
        // width: .56rem;
        // height: .20rem;
        display: block;
        color: var(--q-gb-t-c-18);
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        font-weight: 400;

        line-height: 14px;
      }
    }

    .middle {
      width: .76rem;
      height: .122rem;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      > img {
        width: 100%;
        // height: .5438rem;
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
src/core/vr/mixin/pages/virtual/virtual-sports_part/knockout_mixin.js