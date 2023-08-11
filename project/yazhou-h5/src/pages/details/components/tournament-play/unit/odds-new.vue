<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 红升绿降的展示
-->
<template>
  <div :class="['odds_new',{'odds-new2':ol_data.result != undefined}]" :id="DOM_ID_SHOW && `list-${_.get(ol_data, 'oid')}`">
    <template v-if="ol_data.result == undefined">
      <span v-if="odds_value() < 1.01 && get_cur_odd == 'EU'">
        <img src="image/wwwassets/bw3/common/match-icon-lock.svg" alt="" style=" width: 0.12rem"/>
      </span>
      <span v-else class="odds" :class="[{'red_text': status == 10, 'green_text': status == -10,'white_text':get_bet_list.includes(ol_data.id_) }]">
        <span>{{ odds_value() }}</span>
        <span class='change-icon' :class="{'icon-red':status == 10,'icon-green':status == -10}"></span>
      </span>
    </template>
    <template v-else>
      {{calc_text}}
    </template>
  </div>
</template>

<script>
// #TODO vuex 
// import { mapGetters } from "vuex";
// #TODO mixins 
import odd_convert from "src/public/mixins/odds_conversion/odds_conversion.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  // #TODO mixins 
  mixins:[odd_convert],
  props: ['ol_data','item_data'],
  name: 'odds_new',
  setup(props, evnet) {
    const data = reactive({

    });
    // #TODO vuex 
    // computed: {
    // ...mapGetters(['get_cur_odd','get_bet_list']),
    watch(
      () => props.ol_data,
      (n) => {
        if(Math.ceil(Number(n.ov /1000)) > Math.ceil(Number(cacheData /1000))){
          status = 10;
          cacheData = n.ov;
        }
        else if(Math.ceil(Number(n.ov /1000)) < Math.ceil(Number(cacheData /1000))){
          status = -10;
          cacheData = n.ov;
        }
        else{
          status = '';
        }

        clearTimeout(clear_status_timeout);
        // 三秒后清除相关符号
        clear_status_timeout = setTimeout(() => {
          status = '';
        }, 3000);
      },
      {
        deep: true
      }
    );
    onMounted(() => {
      // 延时器
      clear_status_timeout = null;
      // 赋值中间变量值，保证能够顺利红升绿降;
      cacheData = ol_data.ov;
      // 设置是否显示投注项dom的id属性值
      DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
    });
    const odds_value = () => {
      if(ol_data.result || ol_data.result == 0){
        let result_ = ol_data.result
        // #TODO $root 
        return $root.$t(`virtual_sports.result.${result_}`)
      }else{
        let r = '';
        let r1 = compute_value_by_cur_odd_type(
          ol_data.ov / 100000,
          null,
          item_data.hsw,
          false,
          ol_data.csid
        )
        if(r1){
          r = r1;
        }else{
          r = 0;
        }
        return r;
      }
    };
    onUnmounted(() => {
      clearTimeout(clear_status_timeout);
    })
    return {
      ...toRefs(data),
      odds_value
    }
  }
})
</script>

<style lang="scss" scoped>
.odds_new {
  width: 100%;

  font-size: 0.16rem;

  letter-spacing: 0;
}

.odds {
  position: relative;
}

.change-icon {
  width: 0.06rem;
  position: absolute;
  right: -0.12rem;
  top: calc(50% - 0.03rem);
  height: 0.06rem;
  margin-right: 0.02rem;
  background-repeat: no-repeat;
  background-size: contain;

  &.icon-green {
    background-image: var(--q-color-com-img-bg-18);
  }

  &.icon-red {
    background-image: var(--q-color-com-img-bg-19);
  }
}
</style>
