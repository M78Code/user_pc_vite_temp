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
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" class="icon-lock">
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
// #TODO VUEX
// import { mapGetters } from "vuex";
// import odds_conversion from "src/base-h5/mixins/odds_conversion/odds_conversion.js"
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "virtual_sports_odd_item",
  // #TODO MIXINS
  // mixins:[odds_conversion],

  props:{
    ol_item:Object,
    hl_item:Object,
    match_invalid:Boolean,
    // mhs 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
    match:Object
  },
  data() {
    return {
      LOCAL_PROJECT_FILE_PREFIX
    }
  },

  setup(props, evnet) {
    const get_odd_value = (ol_item) => {
      let r = "";
      if(ol_item.result === "0" || ol_item.result === 0 || ol_item.result){
        // #TODO EMIT
        // r = i18n_t(`virtual_sports.result[${ol_item.result}]`);
      }
      else{
        r = odds_value;
      }
      return r;
    };
    // #TODO VUEX GETTERS
    // ...mapGetters(['get_bet_list']),
    const get_bet_list = computed(() => {
      return ""
    });
    /**
     * @description: 计算最终显示的赔率
     * @param {Undefined} Undefined
     * @return {number} 最终显示的赔率
     */
    const odds_value = computed(() => {
      let ov = ol_item.ov,
        hsw = hl_item ? hl_item.hsw : 0,
        csid = ol_item.csid;
      let r1 = compute_value_by_cur_odd_type(ov, ov._hpid, hsw, csid);
      return r1 || '';
    })
    return {
      get_odd_value,
      odds_value,
      get_bet_list,

    }
  }
});
</script>

<style lang="scss" scoped>
.odd-item-w {
  width: 0.58rem;
  height: 0.56rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

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
    font-size: 0.12rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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