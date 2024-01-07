<!--
 * @Author: rise
 * @Date: 2023-10-22 17:03:22
 * @LastEditors: rise
 * @LastEditTime: 2023-11-03 10:48:01
 * @Description:  
-->
<template>
    <div class="switch-nav">
        <ul>
            <li v-for="(item,index) in list" :key="index" 
                :class="{active:activeOn == item.val,disabled:item.disabled,isSort:item.isSort}" 
                @click="changeActive(item,index,item.changeFun,item.isSort)">
                <span :class="{text:item.isSort}">{{  item.name }}</span>
                <template v-if="item.isSort">
                    <span class="icon" 
                        :style="compute_css_obj({key:(activeOn == index+1) ? 'h5-sort-arrows-active' : 'h5-sort-arrows'})">
                    </span>
                </template>
            </li>
        </ul>
    </div>
</template>
<script setup>
    import { compute_css_obj } from "src/output/index.js";
    import {ref,watch} from "vue";
    import UserCtr from "src/core/user-config/user-ctr.js"
    let is_debounce_disable=false
    const props = defineProps({
        list: {
            type: Array,
            default:[]
        },
        defaultVal:{
            type: [Number, String],
            default: 1
        },
        debounce:{
            type:Number,//不允许快速切换 导致页面卡顿或者性能消耗
            default: 1500,//默认1.5秒 才能 再次切换回来
         }
        });
    const activeOn = ref(props.defaultVal);//选中值
    const sortVal = ref(1);//排序code
    /**
     * @description 监听传送过来的值发生改变
     * @param {props.defaultVal} number
     * @return 
     */
    watch(()=>props.defaultVal,(val)=>{
        activeOn.value = val;
        sortVal.value = val;
    },{immediate:true})
    /**
     * 点击事件
     * @param {*} val  值0 1
     * @param {*} callback  执行方法
     * @param {*} sort  排序值
     */
    const changeActive = (item,i,callback,sort) => {
        // if(sort){
        //     if(activeOn.value !== val) sortVal.value=1;
        //     // sortVal.value = sortVal.value === 0?1:sortVal.value === 1?2:1;
        //     sortVal.value = sortVal.value === 1?2:1;
        //     activeOn.value = val;
        //     const enVal = sortJson.filter((item)=>{return item.val === sortVal.value })?.[0].enVal;
        //     return callback(val,enVal);
        // }
        if(activeOn.value === item.val||item.disabled)return;
        // if(activeOn.value === item.val||item.disabled||is_debounce_disable)return;
        // is_debounce_disable=true //不允许快速切换 导致页面卡顿或者性能消耗
        activeOn.value = item.val;
        callback(item.val,item);
        //监听改变
        UserCtr.set_menu_init_change()
        // setTimeout(() => {
        //     is_debounce_disable=false
        // },Number(props.debounce)?props.debounce:0);
    }
</script>
<style scoped lang="scss">
    .switch-nav{
        width: 100%;
        height: 0.24rem;
        position: relative;
        font-weight: 500;
        font-family: 'PingFang SC';
        background: var(--q-gb-bd-c-5);
        padding:0.02rem;
         border-radius: 25px;  
        ul{
            width: 100%;
            height: 100%;
            display: flex;
            font-size: 12px;
            font-weight: 500;
            border-radius: 0.25rem;
            li{
                flex: 1;
                text-align: center;
                color: var(--q-gb-t-c-19);
                line-height: 0.2rem;
                width: 50%;
                
                &.active{
                    border-radius: 0.25rem;
                    // background:var(--q-gb-bg-c-11); 
                    color: var(--q-gb-t-c-23);
                    background: var(--q-gb-bg-c-28);
                    box-shadow: 0px 2px 4px rgba(121, 129, 164, 0.2);
                }
                .isSort{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .text{
                    display: inline-block;
                   transform: translateX(0.03rem); 
                }
                .icon{
                    display: inline-block;
                    width: 0.14rem;
                    height: 0.12rem;
                }
            }
        }
    }
</style>
