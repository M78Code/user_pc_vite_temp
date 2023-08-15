<!--
 * @Author:
 * @Date: 
 * @Description: 投注记录页无数据时展示去投注的界面
-->
<template>
  <div class="settle-void" @touchmove.prevent>
    <div class="main">
      <div class="img-s" :class="{'img-s2': store_theme.theme.includes('theme02')}"></div>
      <div class="text-s">
        <p style="line-height: 0.18rem">{{ calc_text }}</p>
        <p @click="go_bet" class="go-bet">
          {{get_main_item == 2 ? $root.$t('msg.msg_nodata_19') : $root.$t('msg.msg_nodata_05')}}
        </p>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { computed, defineComponent } from 'vue'
import store from 'src/store-redux/index.js'
import { i18n } from "src/boot/i18n.js"
import { useI18n } from "vue-i18n";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"

let { themeReducer, cathecticReducer } = store.getState()
let store_cathectic = cathecticReducer
let store_theme = themeReducer
// const { t } = useI18n()
const props = defineProps({
  is_early: {
    type: Boolean,
    defalut: false,
  },
  is_limit: {
    type: Boolean,
    defalut: false,
  },
})
const calc_text = computed(() => {
  if (props.is_limit) {
    return 'msg.msg_nodata_22' //t('msg.msg_nodata_22')
  }
  if (store_cathectic.main_item == 0) {
    return props.is_early ? 'msg.msg_nodata_15' : 'msg.msg_nodata_12'// t('msg.msg_nodata_15') : t('msg.msg_nodata_12')
  } else {
    if (props.is_early) {
      return 'msg.msg_nodata_16'//  t('msg.msg_nodata_16')
    } else {
      return get_main_item == 2 ? 'msg.msg_nodata_18' : 'msg.msg_nodata_13'//t('msg.msg_nodata_18') : t('msg.msg_nodata_13')
    }
  }
})
//页面跳转逻辑
const go_bet = () => {
  useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, false)
}
</script>

<style lang="scss" scoped>
.settle-void {
  width: 100%;
  display: flex;
  flex: 1;
}

.main {
  width: 1.65rem;
  height: 3.6rem;
  margin: auto;
}

.img-s {
  width: 1.65rem;
  height: 1.65rem;
  background: var(--q-color-com-img-bg-83) no-repeat center / contain;
}

.img-s2 {
  background: var(--q-color-com-img-bg-84) no-repeat center / contain;
}

.text-s {
  width: 100%;
  height: 0.42rem;
  line-height: 0.42rem;
  font-size: 0.14rem;
  color: var(--q-color-fs-color-146);
  letter-spacing: 0;
  text-align: center;
}

.go-bet {
  background: var(--q-color-linear-gradient-bg-22);
  border-radius: 4px;
  color: #fff;
  margin-top: 0.1rem;
}
</style>
