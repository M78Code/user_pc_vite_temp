<!--
 * @Author: rise
 * @Date: 2023-10-20 16:27:18
 * @LastEditors: rise
 * @LastEditTime: 2023-10-30 15:29:52
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
  import { ref , watch } from "vue";
  import { scrollMenu } from "../utils";
  import { MenuData } from "src/core/index.js";
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
    // 设置日期
    MenuData.set_date_time(props.dataList[i].val)
    event && scrollMenu(event,".date-tab-content-ul",".active");
    // emits('changeTab',props.dataList[i].val);
  }
    //   emits('changeTab',activeOn.value);
    /**
     * 一级菜单切换  时间置空
     */
    watch(()=> MenuData.current_lv_1_menu_mi.value,() => {
        activeOn.value = 0;
        MenuData.set_date_time(props.dataList[0].val)
    })
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
                font-weight: 500;
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
  