<!-- @Description: 网络不给力，空空如也这些信息展示 -->
<template>
  <div class="no-data"
    :style="{ 'min-height': top_height + 'px', paddingTop: is_detail && top_height < 500 ? '.6rem' : '80px' }">
    <div class="empty-favorite-bg" 
    :style="compute_css_obj(lodash.get(arr[which], 'key'))">
    </div>
    <p>
      <!-- 有消息用消息 没有信息 用默认信息 -->
      {{ msg ? i18n_t(msg) : lodash.get(arr[which], 'txt') }}
    </p>
  </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useMittEmit, MITT_TYPES } from "src/core/mitt"
import { i18n_t, compute_css_obj } from "src/output/index.js";
import { useRoute } from "vue-router"

//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"



useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({
  which: {
    type: String,
    required: true
  },
  height: {
    required: true
  },
  msg: {
    type: String,
  },
  type_name: {
    type: String,
  },
  marginBottom: {
    type: String,
  },
  width: {
    type: String,
  },
  height: {
    type: String,
  },
  color: {
    type: String,
  },
  class: {
    type: String,
  }
})
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  --------------------

const arr_const = {
  collect: {
    key: "no-collect",
    // url2: "image/bw3/svg/no_shouc2.svg",
    txt: i18n_t('msg.msg_nodata_08'),// '暂无关注的赛事哦',
  },
  noWifi: {
    // url: "image/bw3/svg/nowifi.svg",
    key: "no-wifi",
    txt: i18n_t('msg.msg_nodata_09'),//'网络不给力',
  },
  noMatch: {
    keykey: "no-match",
    // url2: "image/bw3/png/noMatch2.png",
    txt: i18n_t('msg.msg_nodata_02'),//'空空如也~',
  },
  noMatchNew: {
    key: "no-match",
    // url2: "image/bw3/png/noMatch2_new.png",
    txt: i18n_t('msg.msg_nodata_02_new'),//'数组 对应 标题 提示文字 刷新',
  },
  noMessage: {
    key: "no-match",
    // url2: "image/bw3/png/noMatch2.png",
    txt: i18n_t('msg.msg_nodata_17'),//'暂无消息记录~',
  },
  nolive: {
    key: "no-live",
    // url2: "image/bw3/svg/no_livedata2.svg",
    txt: i18n_t('msg.msg_nodata_14'),//'暂无直播的赛事哦',
  }
}

const arr = ref(arr_const)
const top_height = ref(0)
const is_detail = ref(false)

const route = useRoute()
function init() {
  top_height.value = window.innerHeight - props.height;
  is_detail.value = route.name === 'category';
}
onMounted(init)

// 监听国际化语种变化,一旦变化修正国际化字符串
watch(
  () => i18n_t.locale,
  () => arr.value = arr_const
)

function refresh_data() {
  useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
    text: "footer-refresh"
  })
}

// onBeforeUnmount(() => {
//   // TODO: 暂不清楚$data用途
//   for (const key in $data) {
//     $data[key] = null
//   }
// })

</script>
    
<style lang="scss" scoped>
.no-data {
  border-bottom: 1px solid transparent;
  min-height: 100%;
  text-align: center;
  color: #a5a9b3;

  .empty-favorite-bg {
    width: 1.8rem;
    height: 1.61rem;
    margin: 0 auto;
    background-size: contain;
    background-repeat: no-repeat;
    user-select: none;
  }

  .title {
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;
    color: #666666;
    margin-bottom: 0rem;
  }

  .title-tint {
    margin-top: 0.03rem;
    font-size: 0.12rem;
    color: #999999;
  }

  .btn {
    display: inline-block;
    width: 1.2rem;
    height: 0.34rem;
    border: 1px solid transparent;
    border-radius: 0.17rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.14rem;
    margin: auto;
  }


  p {
    margin: 0.14rem;
    font-size: 0.14rem;
    color: #1a1a1a;

    span {
      display: inline-block;
      width: 1.4rem;
      height: 0.4rem;
      line-height: 0.4rem;
      border-radius: 0.05rem;
      color: #ffb001;
      border: 1px solid #ffb001;
    }
  }
}
</style>
  src/output/index.js