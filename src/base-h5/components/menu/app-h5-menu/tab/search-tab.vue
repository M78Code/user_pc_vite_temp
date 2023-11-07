<!--
 * @Author: rise
 * @Date: 2023-10-20 16:27:18
 * @LastEditors: rise
 * @LastEditTime: 2023-11-03 14:04:11
 * @Description:  
-->
<template>
    <div class="search-tab-wap" v-show="!Array.isArray(menu_lv2) && [401,1016,1013,1011,1012].includes(+menu_lv2?.mi)">
    <!-- <div class="search-tab-wap"> -->
        <div class="search-tab-content">
            <ul class="search-tab-content-ul">
                <li :class="{ active: activeOn === item.val }" v-for="(item, index) in dataList" :key="index"
                    @click="changeTab(item.val,index,$event)">
                    <img v-show="item.img" :src="item.img" />
                    {{ item.name }}
                </li>
            </ul>
            <div class="search-tab-content-img" @click="searchClick">
                <img :src="search" />
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from "vue";
import search from "./img/search.svg";
import {scrollMenuEvent} from "../utils";
import { useMittEmit, MITT_TYPES } from "src/core/index.js";
import {  menu_lv2 } from 'src/base-h5/mixin/menu.js'
const props = defineProps({
    dataList: {
        type: Array,
        default: [
            {
                name: "全部",
                val: 0,
                img: ""
            },
            {
                name: "欧冠",
                val: 1,
                img: ""
            },
            {
                name: "英超",
                val: 2,
                img: ""
            },
            {
                name: "意甲",
                val: 3,
                img: ""
            },
            {
                name: "西甲",
                val: 4,
                img: ""
            },
            {
                name: "法甲",
                val: 5,
                img: ""
            },
            {
                name: "中超",
                val: 6,
                img: ""
            }
        ]
    },
    defaultVal: {
        type: Number,
        default: 0
    }
});
const activeOn = ref(props.defaultVal || 0);//默认值
/**
 * 选中事件
 * @param {*} val 
 */
const changeTab = (val,i,event) => {
    console.log(`${props.dataList[val].name}-${val}`)
    if(activeOn.value === val)return;
    activeOn.value = val;
    event && scrollMenuEvent(event,".search-tab-content-ul",".active");
}

/**
 * 搜索足球事件
 */
const searchClick = () => {
    // console.log(`搜索足球`)
    useMittEmit(MITT_TYPES.EMIT_CHANGE_SEARCH_FILTER_SHOW, {
      open: true,
    });
    // emit('searchHandle')

}
</script>
<style lang="scss" scoped>
.search-tab-wap {
    width: 100%;
    height: 0.32rem;
    overflow: hidden;
    padding: 0 0.05rem;
    position: relative;

    .search-tab-content {
        width: 100%;
        height: 0.32rem;
        line-height: 0.32rem;
        display: flex;

        ul {
            flex: 1;
            width: 100%;
            overflow: hidden;
            overflow-x: auto;
            display: flex;
            &::-webkit-scrollbar {
                display: none;
            }
            li {
                width: 0.6rem;
                height: 100%;
                flex-shrink: 0;
                text-align: center;
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                color: #7981A4;
                &:first-child {
                    width: 0.4rem;
                }

                &.active {
                    color: var(--q-gb-t-c-1);
                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 400;
                }

                img {
                    width: 0.18rem;
                    height: 0.18rem;
                    vertical-align: middle;
                    margin-top: -2px;
                }

                span {
                    font-size: 12px;
                    color: #7981A4;
                }
            }
        }

        .search-tab-content-img {
            width: 0.38rem;
            text-align: center;

            img {
                width: 0.18rem;
                height: 0.18rem;
                vertical-align: middle;
                margin-top: -2px;
            }
        }
    }
}</style>
  