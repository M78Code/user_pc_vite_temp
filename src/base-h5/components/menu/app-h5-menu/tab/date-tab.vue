<!--
 * @Author: rise
 * @Date: 2023-10-20 16:27:18
 * @LastEditors: rise
 * @LastEditTime: 2023-10-25 16:33:42
 * @Description:  
-->
<template>
  <div class="date-tab-wap">
      <div class="date-tab-content">
          <ul class="date-tab-content-ul">
              <li :class="{ active: activeOn === index }" v-for="(item, index) in dataList" :key="index"
                  @click="changeTabMenu(index,$event)">
                  {{ item.name }}
              </li>
          </ul>
      </div>
  </div>
</template>

<script setup>
import { ref  } from "vue";
import { scrollMenu } from "../utils";
const emits = defineEmits(['changeTab'])
const props = defineProps({
  defaultVal: {
      type: Number,
      default: 0
  },
  dataList: {
      type: Array,
      default: []
  },

});
const activeOn = ref(props.defaultVal || 0);//默认值
/**
* 选中事件
* @param {*} val 
*/
const changeTabMenu = (i,event) => {
  if(activeOn.value === i)return;
  activeOn.value = i;
  
  scrollMenu(event,".date-tab-content-ul",".active");
  emits('changeTab',props.dataList[i].val);
}
emits('changeTab',activeOn.value);
</script>
<style lang="scss" scoped>
.date-tab-wap {
  width: 100%;
  height: 0.32rem;
  overflow: hidden;
  padding: 0 0.05rem;
  position: relative;
  .date-tab-content {
      width: 100%;
      height: 0.32rem;
      line-height: 0.32rem;
      ul {
          width: 100%;
          overflow: hidden;
          overflow-x: auto;
          display: flex;
          &::-webkit-scrollbar {
              display: none;
          }
          li {
              width: 0.58rem;
              height: 100%;
              flex-shrink: 0;
              text-align: center;
              // &:first-child {
              //     width: 0.4rem;
              // }
              &.active {
                  color: var(--q-gb-t-c-1);
                  position: relative;
                  &::after{
                    content: "";
                    position: absolute;
                    width: 60%;
                    height: 1px;
                    background-color: var(--q-gb-t-c-1);
                    bottom: 1px;
                    left: 50%;
                    margin-left: -30%;
                  }
              }
              span {
                  font-size: 12px;
                  color: #7981A4;
              }
          }
      }
  }
}</style>
