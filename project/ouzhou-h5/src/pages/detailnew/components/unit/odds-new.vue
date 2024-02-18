<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 红升绿降的展示
-->
<template>
  <div :class="['odds_new',{'odds-new2':ol_data.result != undefined,'odds-new-ky':project_name == 'app-h5'}]" :id="DOM_ID_SHOW && `list-${lodash.get(ol_data, 'oid')}`"   >
    <template v-if="ol_data.result == undefined">
      <span v-if="odds_value() < 1.01 && get_cur_odd == 'EU'">
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock.svg`" alt="" style=" width: 0.12rem"/>
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
// import odd_convert from "src/base-h5/mixins/odds_conversion/odds_conversion.js";
import lodash from "lodash";
import { project_name } from "src/output/index.js"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { i18n_t } from "src/boot/i18n.js";
import { compute_value_by_cur_odd_type } from "src/output/index.js"

export default defineComponent({
  // #TODO mixins
  // mixins:[odd_convert],
  props: ['ol_data','item_data'],
  name: 'odds_new',
  setup(props, evnet) {
    let component_data = reactive({
      clear_status_timeout: null,
      cacheData: [],
      status: '',
      DOM_ID_SHOW: '',
    });
    // #TODO vuex
    // computed: {
    // ...mapGetters(['get_cur_odd','get_bet_list']),
    const get_cur_odd = computed(() => {
      return "";
    });
    const get_bet_list = computed(() => {
      return "";
    });
     //输、赢、无效···
    const calc_text = computed(() => {
      let n = Number(props.ol_data.result)
      if ([0, 1, 2, 3, 4, 5, 6].includes(n)){
        return i18n_t(`virtual_sports.result[${n}]`)
      } else {
        return i18n_t(`virtual_sports.result[0]`)
      }
    })
    watch(
      () => props.ol_data,
      (n) => {
        if(Math.ceil(Number(n.ov /1000)) > Math.ceil(Number(component_data.cacheData /1000))){
          component_data.status = 10;
          component_data.cacheData = n.ov;
        }
        else if(Math.ceil(Number(n.ov /1000)) < Math.ceil(Number(component_data.cacheData /1000))){
          component_data.status = -10;
          component_data.cacheData = n.ov;
        }
        else{
          component_data.status = '';
        }

        clearTimeout(component_data.clear_status_timeout);
        // 三秒后清除相关符号
        component_data.clear_status_timeout = setTimeout(() => {
          component_data.status = '';
        }, 3000);
      },
      {
        deep: true
      }
    );
    onMounted(() => {
      // 延时器
      component_data.clear_status_timeout = null;
      // 赋值中间变量值，保证能够顺利红升绿降;
      component_data.cacheData = props.ol_data.ov;
      // 设置是否显示投注项dom的id属性值
      // component_data.DOM_ID_SHOW =  window.BUILDIN_CONFIG.LOCAL_FUNCTION_SWITCH.DOM_ID_SHOW;
      // #TODO
      component_data.DOM_ID_SHOW = "DOM_ID_SHOW";
    });
    const odds_value = () => {
      if(props.ol_data.result || props.ol_data.result == 0){
        let result_ = props.ol_data.result
        return i18n_t(`virtual_sports.result.${result_}`)
      }else{
        let r = '';
        let r1 = compute_value_by_cur_odd_type(
          props.ol_data.ov,
          props.ol_data._hpid,
          props.item_data._hsw,
          props.ol_data.csid
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
      clearTimeout(component_data.clear_status_timeout);
    })
    return {
      ...toRefs(component_data),
      get_cur_odd,
      get_bet_list,
      odds_value,
      calc_text,
      lodash,
      project_name
    }
  }
})
</script>

<style lang="scss" scoped>
.odds_new {
  width: 100%;
  color: #303442; // var(--q-detials-color-6);
  font-size: 0.14rem; //todo app-h5
  font-weight: 700;
  letter-spacing: 0;
}
.odds-new-ky {
  flex:1
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