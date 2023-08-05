<!--
 * @Author: Cronus
 * @Date: 2020-10-20 17:23:47
 * @Description: 冠军赛事投注项组件
-->
<template>
  <div class="ol-li-item flex items-center justify-between" :data-oid="ol_item.oid"
    :id="DOM_ID_SHOW && `list-${_.get(ol_item, 'oid')}`"
    v-if="odd_status !== 3"> <!--关盘 odd_status === 3 移除-->
    <div class="on">
      {{ol_item.on}}
    </div>

    <!--封盘-->
    <div class="icon-lock-wrapper" v-if="odd_status === 2">
      <img class="icon-lock" v-if="get_theme.includes('theme01')"
         src="image/wwwassets/bw3/common/match-icon-lock.svg" />
      <img class="icon-lock" v-if="get_theme.includes('theme02')"
         src="image/wwwassets/bw3/common/match-icon-lock-theme02.svg" />

    </div>
    <!--开盘|锁盘-->
    <div v-else class="odds" :class="{red:red_green_status === 1,green:red_green_status === -1,}">
      <span class="change-icon" v-show="red_green_status"
            :class="{'icon-red':red_green_status === 1,'icon-green':red_green_status === -1}">
      </span>
      {{get_odds_value(ol_item)}}
    </div>

  </div>
</template>

<script>
import odd_convert from "src/public/mixins/odds_conversion/odds_conversion.js";
import {mapGetters} from 'vuex'
export default {
  name: "odd_item_champion",
  mixins:[odd_convert],
  props:{
    ol_item:Object,
    hs:Number,        // 0:开, 1:封, 2:关, 11:锁
    csid:String|Number,
  },
  data(){
    return{
      //红升绿降状态
      red_green_status:0,
    }
  },
  created () {
    //红升绿降timeout
    this.timer_=0;
    // 设置是否显示投注项dom的id属性值
    this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
  },
  mounted(){},
  methods:{
    get_odds_value(ol_item,hsw){
      let ov = ol_item.ov;hsw='1';  //冠军玩法只支持欧赔
      let csid = this.csid;
      let r1 = this.compute_value_by_cur_odd_type(ov / 100000,null, hsw,null,csid);
      return r1 || 0;
    },
  },
  watch:{
    /**
     * @description: 监听赔率变化实现红升绿降
     * @param v1 新值
     * @param v0 旧值
     * @return undefined
     */
    'ol_item.ov'(v1,v0){
      let curr = Number(v1);
      let old = Number(v0);

      clearTimeout(this.timer_);
      if(curr > old){
        this.red_green_status = 1;
      }else if(curr < old){
        this.red_green_status = -1;
      }
      this.timer_ = setTimeout(() => {
        this.red_green_status = 0;
      },3000);
    },
  },
  computed:{
    ...mapGetters(['get_menu_type','get_theme']),
    /**
     * @description: 盘口状态 1.开盘，2封盘，3关盘 ，4 锁盘
     * @return number 1开盘 4锁盘正常显示  2 封盘显示锁,  3关盘显示短横线
     */
    odd_status(){
      if(!this.ol_item) return 3;
      return this.$common.odds.get_odds_active(this.ol_item.ms,this.hs,this.ol_item.os);
    },
  }
}
</script>

<style lang="scss" scoped>

.ol-li-item {
  width: 1.72rem;
  height: 0.4rem;
  padding: 0 0.1rem;
  margin-bottom: 0.02rem;
  border-radius: 0.04rem;
  overflow: hidden;

  &:nth-child(2n-1) {
    width: 1.73rem;
    margin-right: 0.02rem;
  }

  .on {
    max-width: 1.06rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .icon-lock-wrapper {
    line-height: 1;

    .icon-lock {
      width: 0.12rem;
    }
  }

  .odds {
    position: relative;
    font-weight: 600;

    &.red {
      color: var(--q-color-com-fs-color-9) !important;
    }

    &.green {
      color: var(--q-color-com-fs-color-10) !important;
    }

    .change-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -0.09rem;
      width: 0.06rem;
      height: 0.05rem;
      display: inline-block;
      margin-right: 0.03rem;
      background-repeat: no-repeat;
      background-size: contain;

      &.icon-green {
        background-image: var(--q-color-com-img-bg-18);
      }

      &.icon-red {
        background-image: var(--q-color-com-img-bg-19);
      }
    }
  }
}
</style>
