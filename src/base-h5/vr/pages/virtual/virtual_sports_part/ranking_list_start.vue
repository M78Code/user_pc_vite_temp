<!--
 * @Author: ladron
 * @Date: 2020-12-28 11:34:53
 * @Description: 赛狗类 排行榜页面  只需要传个 mid 赛事id进来
-->
<template>
  <div class="ranking_list_satrt">
    <template v-if="!no_data">
      <span class="navigation-title">{{ i18n_t('virtual_sports.leaderboard') }}</span>
      <div class="ranking-item hairline-border" v-for="(item, index) in ranking_data" :key="index">
      <div class="ranking-item-top">
        <div class="left ellipsis">
          <span class="virtual-num" :class="get_rank_background(item.number,get_curr_sub_menu_type)"></span>
          <span class="ellipsis">{{ item.name }}</span>
        </div>
        <div class="right">
          <span>{{ i18n_t('virtual_sports.vitality_performance') }}</span>
          <!-- <q-linear-progress :value="Number(item.form/100)" color="warning" class="q-mt-sm"/> -->
          <div class="virtual-progress-bg">
            <div class="virtual-progress-bar" :style="{width:`${item.form}%`}">
            </div>
          </div>
          <span>{{ item.form }}%</span>
        </div>
      </div>
      <div class="ranking-item-bottom">
        <div class="left">
          <span>{{ i18n_t('virtual_sports.results_previous') }}</span>
          <div v-for="(results, i) in item.forecast" :key="i">
            <span :class="results != 0 ? 'score-number' : 'score-x'">{{results != 0 ? results : 'X'}}</span>
          </div>
        </div>
        <div class="right">
          <span>{{i18n_t('virtual_sports.comprehensive_rating')}}</span>
          <q-rating
            style="min-width:.85rem"
            :value="Number(item.star)"
            size="3.5em"
            :icon="`img:${ $g_image_preffix }/image/bw3/svg/match-list/m-list-favorite.svg`"
            :icon-selected="get_theme.includes('y0') ? `img:${ $g_image_preffix 
            }/image/bw3/svg/match-list/m-list-favorite-s_y0.svg`: 
            `img:${ $g_image_preffix }/image/bw3/svg/match-list/m-list-favorite-s.svg`"
            readonly
          />
        </div>
      </div>
    </div>
    </template>
    <!-- 没有数据 组件 -->
    <no-data v-if="no_data" which='noMatch' height='500' class="no-list"></no-data>
  </div>
</template>

<script>
import { api_v_sports } from "src/base-h5/vr/api";
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"
import no_data from "src/base-h5/vr/components/common/no_data.vue"

export default {
  name: "ranking_list_start",
  components: {
    "no-data": no_data
  },
  props:{
    mid: {
      type: Number|String,
      default: null,
      require: true
    },
  },
  data() {
    return {
      ranking_data:[],
      no_data: false
    }
  },
  watch: {
    'get_current_mid': {
      handler: 'get_list',
      immediate: true
    },
  },
  methods: {
    /**
     *@description 计算类名
     *@param {Number} rank_i 编号
     *@param {Number} sportId 球类id
     *@return {String} 类名
     */
    get_rank_background(rank_i,sportId){
      let s_type = 'dog';//赛马horse或赛狗dog
      let virtual_sports_1= ''
      if(sportId == 1011){  // 赛马
        s_type = 'horse'
      }
      else if([1002, 1010, 1009].includes(+sportId)){ // 赛狗 摩托车
        s_type = 'dog'
      } else {
        return null
      }
      if([1010].includes(+sportId)){
        virtual_sports_1 = `motorcycle${rank_i}`
      }
      if([1009].includes(+sportId)){
        virtual_sports_1 = `dirt_motorcycle${rank_i}`
      }
      return `match-${s_type}${rank_i} ${virtual_sports_1}`;
    },
    async get_list() {
      try {
        let {code , data} = await api_v_sports.get_virtual_match_detail_count({mid: this.get_current_mid})
        if(code == 200 && data.length > 0) {
          this.ranking_data = data
          // this.results_filter(this.ranking_data)
        } else {
          this.no_data = true
        }
      } catch (error) {
        this.no_data = true
        console.error(error);
      }
    },
  },
  computed: {
    // ...mapGetters([
    //   "get_current_mid",
    //   "get_curr_sub_menu_type",
    //   "get_theme"
    // ]),
    get_current_mid(){
      return VR_CTR.get_current_mid();
    },
    get_curr_sub_menu_type(){
      return VR_CTR.get_curr_sub_menu_type()
    },
    get_theme(){
      return 'theme01';
    },
  },
  destroyed () {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
};
</script>

<style lang="scss" scoped>
.ranking_list_satrt {
  .navigation-title {
    font-size: 0.14rem;
    display: block;
    position: relative;
    padding-left: 0.21rem;
    font-weight: 500;
    margin-bottom: 0.04rem;
    border-radius: 0.08rem;
    height: 0.34rem;
    line-height: 0.34rem;

    &:before {
      content: "";
      width: 0.03rem;
      height: 0.14rem;
      position: absolute;
      left: 0.12rem;
      top: 50%;
      transform: translate3d(0, -50%, 0);

      border-radius: 1.5px;
    }

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
      border-radius: 0.16rem;
      overflow: hidden;
    }
  }

  .ranking-item {
    height: 0.7rem;
    padding: 0.15rem 0.12rem 0.15rem 0.13rem;
    box-sizing: border-box;
    font-size: 0.1rem;
    text-align: center;
    line-height: 0.16rem;
    border-radius: 0.08rem;
    margin-bottom: 0.08rem;

    > div {
      display: flex;
      justify-content: space-between;

      &.ranking-item-top {
        margin-bottom: 0.09rem;
        height: 0.16rem;

        .left {
          display: flex;
          align-items: center;

          > span {
            &:nth-child(1) {
              width: 0.16rem;
              height: 0.16rem;

              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 0.1rem;

              font-size: 0.1rem;
              text-align: center;
              line-height: 0.1rem;
              border-radius: 0.02rem;
              background-size: 100% 100%;
              background-repeat: no-repeat;
              background-position: center;
            }

            &:nth-child(2) {

              font-size: 0.14rem;

              font-weight: bold;
              line-height: 0.16rem;
            }
          }
        }

        .right {
          width: 1.78rem;
          display: flex;
          max-width: 1.96rem;
          min-width: 1.63rem;
          align-items: center;

          > span {
            min-width: fit-content;

            font-size: 0.12rem;

            text-align: center;
            line-height: 0.16rem;

            &:nth-child(1) {

              font-size: 0.1rem;

              text-align: center;
              line-height: 0.16rem;
            }
          }

          .virtual-progress-bg {
            width: 0.8rem;
            height: 0.04rem;
            margin: 0 0.1rem 0 0.08rem;
            border-radius: 0.06rem;

            .virtual-progress-bar {
              border-radius: 0.06rem;
              height: 100%;
              transition: all 0.2s;
            }
          }

          :deep(.text-warning) {
            width: 0.8rem;
            margin: 0 0.1rem 0 0.08rem;
            transition: all 0.3s linear;

            .absolute-full {
              height: 0.04rem;
            }
          }
        }
      }

      &.ranking-item-bottom {
        height: 0.16rem;

        .left {
          display: flex;
          min-width: fit-content;

          > span {
            margin-right: 0.08rem;
          }

          > div {

            font-size: 0.1rem;
            line-height: 0.16rem;

            span {
              margin: 0 0.02rem;
            }

            .score-x {
              color: #B0B8C2;
              font-size: 0.1rem;
            }
          }
        }

        .right {
          width: 1.78rem;
          max-width: 1.96rem;
          min-width: 1.63rem;
          display: flex;
          align-items: center;

          > span {
            margin-right: 0.05rem;
          }

          :deep(.q-rating) {
            > i {
              font-size: 0.12rem;
            }

            .q-rating__icon {
              width: 0.1rem;
              height: 0.1rem;

              margin-right: 0.05rem;

              &.q-rating__icon--active {

              }
            }

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
