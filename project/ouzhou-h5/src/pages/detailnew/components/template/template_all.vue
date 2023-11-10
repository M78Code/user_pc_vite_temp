
<template>
    <!-- 公共模板 -->
  <div v-if="[10].includes(match_info.hpt)" class="temp-simple">
    <div class="temp_grid" :style="{ gridTemplateColumns: columnTotal(item) }">
       <div v-for="o in match_info.hl[0].ol" :key="o.oid" class="temp">
    <div>{{ o.ott }} <span>{{ o.on }}</span></div>
    <div>{{ o.ov/100000 }}</div>
  </div>
    </div>

  </div>
  <div v-else class="temp-simple">
    <div v-for="item in match_info.hl" :key="item.hid" >
    <div class="temp_grid" :style="{ gridTemplateColumns: columnTotal(item) }">
       <div v-for="o in item.ol" :key="o.oid" class="temp">
    <div>{{ o.ott }} <span>{{ o.on }}</span></div>
    <div>{{ o.ov/100000 }}</div>
  </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";

const props = defineProps({
  match_info: {
    type: Object,
    default: () => {}
  },
})


const columnTotal = (item) => {
  let total;
  const {match_info} = props
  if (match_info.title.length > 0&&match_info.hpt!==0) {
    if (match_info.hpt===10) {
      total = 3
    }else{
      total = match_info.title.length
    }
  } else {
    total = 2
  }
  return `repeat(${total}, 1fr)`
}




// 事件执行函数

const active = ref(1)




onMounted(() => {

});
</script>

<style lang="scss" scoped>
.temp{
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
.temp_grid{
  display: grid;
    text-align: center;
    &>div{
     height: 45px;
     line-height: 45px;
    //  border-top: 1px solid #E2E2E2;
     border-right: 1px solid #E2E2E2;
     border-bottom: 1px solid #E2E2E2;
    }
    &>div:last-child{
      border-right: none;
    }
}
.temp-simple{
  &>div:first-child{
    border-top: 1px solid #E2E2E2;
  }

}
</style>

