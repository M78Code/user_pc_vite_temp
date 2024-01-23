<!--
 * @Date: 2021-09-29 19:55:25
 * @FilePath: /user-pc1/src/public/components/results/template/dota2.vue
 * @Description: 赛果 dota2
 * @Author: Echo
-->

<template>
  <div class="wrap-table">
    <div class="table-header">
      <div class="table-col cursor" @click="change_sort">
        <span>{{i18n_t('results.date')}}</span>
        <div class="sort icon" :class="{'up':is_sortUp}" ></div>
      </div>
      <!-- 联赛 -->
      <div class="table-col">{{i18n_t('results.league')}}</div>
      <!-- 赛事 -->
      <div class="table-col">{{i18n_t('results.competition')}}</div>
      <!-- 总分 -->
      <div class="table-col" >{{i18n_t('results.all_score')}}</div>
    </div>
    <load-data :state="load_data_state" color="light">
      <q-scroll-area
        ref="scrollArea"
        class="rule-scroll-area"
        :style="{height: '100%'}"
      >
        <div class="tbale-body">
          <template v-for="(item, index) in results_list" :key="item.tnameCode + index">
            <div
              class="table-tr-td"
              :class="{'active':index == activeIndex}"
              @click="get_tr_detail(item, index)"
             
            >
              <!-- 日期 -->
              <div class="table-col">
                <div class="browser" :class="{'del':index==activeIndex}" ></div>
                <div class="time-wrap">
                  <div>{{formatTime(item.matchTime, lang=='vi'?'hh:MM dd/mm/yyyy':'yyyy-mm-dd hh:MM')}}</div>
                  <div class="match-stage" :class="item.matchStatus==1?'roll':'cancel'" v-if="format_mmp(item.matchPeriodId, item.matchStatus)!=''">
                    {{format_mmp(item.matchPeriodId, item.matchStatus)}}
                  </div>
                </div>
              </div>
              <!-- 联赛 -->
              <div class="table-col">
                <img v-img="[lodash.get(item,'iconUrl')]" class="tournament-logo" alt="">
                <span class="ellipsis-line-2">{{item.tournamentName}}</span>
              </div>
              <!-- 赛事 -->
              <div class="table-col">
                <div class="ellipsis">{{item.homeName}}</div>
                <div class="ellipsis">{{item.awayName}}</div>
              </div>
              <!-- 局比分 -->
              <div class="table-col color-highlight">
                <div>{{lodash.get(item, "scoreResult.S1.home", item.matchStatus==1?'':'-')}}</div>
                <div>{{lodash.get(item, "scoreResult.S1.away", item.matchStatus==1?'':'-')}}</div>
              </div>
            </div>
            <div v-if="index == activeIndex" class="wrap-load" >
              <load-data :state="details_load" color="light">
                <template v-for="(list,i) in results_order_list"  :key="i">
                  <div class="table-tr-detail" v-if="list.posrList.length">
                    <div class="tr-detail-title">{{list.playName}}</div>
                    <div class="tr-detail-item">
                        <div v-for="(list2, j) in list.posrList" class="item" :key="j">
                          <span>{{list2.playOptionName}}</span>
                          <span :class="format_name(list2.scoreResult).class">{{format_name(list2.scoreResult)['name']}}</span>
                        </div>
                    </div>
                  </div>
                </template>
              </load-data>
            </div>
          </template>
        </div>
      </q-scroll-area>
    </load-data>
    <resize-observer @resize="on_resize" />
  </div>
</template>

<script>
import results from "src/core/match-results/match-results-mixin/index";
import resizeObserver from "src/base-pc/components/match-results/resize-observer/resize-observer.vue"
import loadData from "src/components/load_data/load_data.vue"
export default {
  mixins: [results],
  components:{
    resizeObserver,
    loadData
  },
  data(){
    return {
      show_arrow: false,//是否显示滚动按钮
      tabs_bar_left: 0,//滚动距离
      scroll_wrap_width: 0,//容器总宽度
      content_width: 0,//比分总宽度
      resize: null,
      timer:null //定时器
    }
  },
  props: {
    sportType: {
      type: String,
      default: '7'
    }
  },
  methods:{
    /**
    * @description: 截取各局比分
    * @param {Object} item 赛果数据
    * @return {}
    */
    format_score(item){
      let dict = this.snoke_score_data,//需要的比分字段
          msc = item.scoreResult,//数据比分
          arr = [],//各局比分
          home = 0,//主队总分
          away = 0,//客队总分
          mft = 0//总局数
      for (var k in dict) {
        if (!msc[dict[k]]) {
          arr.push({
            home: "",
            away: "",
          })
        } else{
          arr.push(msc[dict[k]])
          mft = k
          home += parseInt(msc[dict[k]].home)
          away += parseInt(msc[dict[k]].away)
        }
      }

      arr = arr.splice(0, mft)
      item.score_total = {
        home: home,
        away: away
      }
      item.socre_data = arr
      return item
    },

    /**
    * @description: 比分滚动
    * @param {String} arrow 滚动方向
    * @return {}
    */
    tabs_move(arrow){
      if (arrow == "left") {
        if(this.tabs_bar_left != 41){
          this.tabs_bar_left += 41;
        }
      } else {
        let scorll_widht = this.scroll_wrap_width - this.tabs_bar_left - 76
        if( scorll_widht < this.content_width){
          this.tabs_bar_left -= 41;
        }
      }
    },
    /**
    * @description: 监听窗口变化
    * @param {}
    * @return {}
    */
    on_resize(res){
      clearTimeout(this.resize)
      if(this.activeIndex!= -1 && this.results_list[this.activeIndex].socre_data){
         if (this.resize) {
          clearTimeout(this.resize)
          this.resize =null
          };
        this.resize = setTimeout(()=>{
          this.set_scroll()
        },200)
      }
    }
  },
  watch:{
    results_list:{
      handler(res){
        if(!res.length) return false
        //累加局比分
        res.forEach(item => {
          if(Object.keys(item.scoreResult).length){
            item = this.format_score(item)
          }
        })
      },
      immediate: true
    },
    results_order_list:{
      handler(res){
        if(this.activeIndex!= -1 && this.results_list[this.activeIndex].socre_data){
          this.set_scroll()
        }
      },
      immediate: true
    }
  },
   destroyed() {
      /**清除定时器 */
        if(this.timer) {
          clearTimeout(this.timer)
          this.timer =null
    }
    if (this.resize) {
      clearTimeout(this.resize);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-col {
  &:first-child {
    display: flex;
    align-items: center;
    width: 13%;
  }
  &:nth-child(2) {
    padding-left: 20px;
    width: 24.5%;
  }
  &:nth-child(3) {
    width: 41.16%;
    padding-left: 20px;
  }
  &:nth-child(4) {
    width: 20%;
    // padding-left: 20px;
  }
  &:nth-child(4),
  &:last-child {
    text-align: center;
  }
}

/* ************** 赛果详情 *************** -S */
.score-wrap {
  display: flex;
  height: 80px;
  border: 1px solid #d0d8de;
  border-top: none;
  .score-title {
    width: 13%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #d0d8de;
  }
  .score-details {
    display: flex;
    align-items: center;
    flex: 1;
    flex-wrap: nowrap;
    text-align: center;
    position: absolute;
    .score-details-item-wrap {
      height: 56px;
      .score-details-item {
        width: 41px;
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 12px;
        &:last-child {
          margin: 0;
        }
        &.item-label {
          color: #666;
        }
        &.item-both {
          color: var(--q-gb-t-c-2);
        }
      }
    }
  }
}
.table-tr-detail {
  .tr-detail-title {
    width: 36.5%;
  }
  .tr-detail-item {
    .item {
      &:nth-child(odd) {
        width: 50%;
      }
    }
  }
}
.score-scroll {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .tabs-icons {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 100%;
    background-color: #f5f7fa;
    cursor: pointer;
    z-index: 1;
    &.tabs-icons-left {
      .yb-icon-arrow {
        transform: rotate(180deg);
      }
    }
  }
}
/* ************** 赛果详情 *************** -E */
</style>

