<!--
 * @Author: Cronus
 * @Date: 2021-01-01 18:42:46
 * @Description: 简版投注项
-->

<template>
  <div class="odd-item-w" :class="{
    'odd-item-w2':get_bet_list.includes(ol_item.oid),
    }" :data-oid="ol_item.oid" :data-result="ol_item.result">
    <div class="result-focus" v-if="ol_item.result == 4">
    </div>
    <div class="o-i-inner flex justify-center items-center">
      <div class="column justify-center items-center">
        <div class="on" :class="{onfocus:ol_item.result == 4 || ol_item.result == 5}" v-if="ol_item.on">
          {{ol_item.on}}
        </div>
        <div class="lock" v-if="match.mhs == 1">
          <img src="image/wwwassets/bw3/common/match-icon-lock.svg" class="icon-lock">
        </div>
        <div v-else 
          class="odds-value"
          :class="{
            focus:ol_item.result == 4 || ol_item.result == 5,
            result:ol_item.result !== ''
          }">
          {{get_odd_value(ol_item)}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"
import odds_conversion from "src/base-h5/vr/mixin/odds_conversion/odds_conversion.js"

export default {
  mixins:[odds_conversion],
  props:{
    ol_item:Object,
    hl_item:Object,
    match_invalid:Boolean,
    // mhs 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
    match:Object
  },
  methods:{
    get_odd_value(ol_item){
      let r = "";
      if(ol_item.result === "0" || ol_item.result === 0 || ol_item.result){
        r = i18n_t(`virtual_sports.result[${ol_item.result}]`);
      }
      else{
        r = this.odds_value;
      }
      return r;
    }
  },
  computed:{
    // ...mapGetters(['get_bet_list']),
    get_bet_list(){ return [] },
    /**
     * @description: 计算最终显示的赔率
     * @param {Undefined} Undefined
     * @return {number} 最终显示的赔率
     */
    odds_value(){
      let ov = this.ol_item.ov,
        hsw = this.hl_item ? this.hl_item.hsw : 0,
        csid = this.ol_item.csid;
      let r1 = this.compute_value_by_cur_odd_type(ov / 100000,null, hsw, csid);
      return r1 || '';
    },
  }
}
</script>

<style lang="scss" scoped>
.odd-item-w {
  height: 0.32rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  flex: 1;
  background: #F2F2F6;

  .result-focus, .o-i-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;

    .result {
      font-size: 0.14rem;
    }
  }

  .result-focus {
    z-index: 1;
  }

  .on {
    font-size: 0.1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #AFB3C8;
  }
  .odds-value {
    font-size: 0.1rem;
    color: #303442;
  }

  .lock {
    .icon-lock {
      width: 0.14rem;
      height: 0.14rem;
      display: block;
    }
  }

  &:before {
    content: ' ';
    display: block;
    width: 0.01rem;
    height: 0.24rem;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  &:after {
    content: ' ';
    display: block;
    width: 0.01rem;
    height: 0.24rem;
    position: absolute;
    right: 0;
  }

  &:first-child {
    &:before {
      display: none;
    }
  }

  &:last-child {
    &:after {
      display: none;
    }
  }
}

/* ************** 选中的样式 ************** -S */


/* ************** 选中的样式 ************** -EE */
</style>
