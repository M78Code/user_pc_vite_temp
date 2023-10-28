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
              <li :class="{ active: ref_data.active_on == item.md }" v-for="(item, index) in ref_data.date_list" :key="index"
                  @click="changeTabMenu(item,$event)">
                  {{ item.title }}
              </li>
          </ul>
      </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref  } from "vue";
import { scrollMenu } from "../utils";
import { MenuData } from "src/core/index.js";

const props = defineProps({
  defaultVal: {
      type: Number,
      default: 0
  },
});

const ref_data = reactive({
    date_list: [],
    //默认值
    active_on: props.defaultVal || 0
})

onMounted(()=>{
    init()
})
// 设置菜单
const init = ()=> {
    let date = new Date()
    let time = date.getTime()
    let str = time
    let arr = [{title:'今日',md:''}]
    for(let i =1;i<7;i++){
        str += 86400000
        let after_time = new Date(str)
        let md_i = str + ''
        let md = md_i.substring(0,md_i.length-6)
        md += '000000'
        arr.push({title:after_time.getMonth()+1+'/'+after_time.getDate(),md})
    }
    ref_data.date_list = arr
}

/**
* 选中事件
* @param {*} val 
*/
const changeTabMenu = (item,event) => {
  if(ref_data.active_on === item.md) return;
  ref_data.active_on = item.md;
  // 设置日期
  MenuData.set_date_time(item.md)
  event && scrollMenu(event,".date-tab-content-ul",".active");
}
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
