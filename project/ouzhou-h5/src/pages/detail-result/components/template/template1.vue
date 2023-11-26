<template>
  <div class="temp-simple">
    <div v-for="item in match_info" :key="item.hid" class="temp_grid">
      <div>{{item.hv}}</div>
      <div v-for="o in item.ol" :key="o.oid">{{ o.ov/100000 }}</div>
  </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";

const props = defineProps({
  match_info: {
    type: Array,
    default: () => []
  },
})




// 事件执行函数

const active = ref(1)




onMounted(() => {

});
</script>

<style lang="scss" scoped>
.temp_grid{
  display: grid;
    text-align: center;
    grid-template-columns: repeat(3, 1fr);
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
