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
            <li v-for="(item,index) in list" :key="index" :class="{active:activeOn == item.val,disabled:item.disabled}" @click="changeActive(item,index,item.changeFun,item.isSort)">
                {{  item.name }}
                <template v-if="item.isSort">
                    <span>
                        <i v-for="(n,m) in sortJson" :key="m">
                            <img :src="`${activeOn}-${sortVal}` === `${index+1}-${n.val}`?n.activeImg:n.img" />
                        </i>
                    </span>
                </template>
            </li>
        </ul>
    </div>
</template>
<script setup>
    import {ref,watch} from "vue";
    import asc1 from "./img/asc1.svg";
    import asc2 from "./img/asc2.svg";
    import desc1 from "./img/desc1.svg";
    import desc2 from "./img/desc2.svg";
    import UserCtr from "src/core/user-config/user-ctr.js"
    const sortJson = [//排序数据
        {
            val:1,
            enVal:"asc",
            img:asc1,
            activeImg:asc2
        },
        {
            val:2,
            enVal:"desc",
            img:desc1,
            activeImg:desc2
        }
    ];
    const props = defineProps({
        list: {
            type: Array,
            default:[]
        },
        defaultVal:{
            type: [Number, String],
            default: 1
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
        console.log('valval',val)
        activeOn.value = val
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
        activeOn.value = item.val;
        callback(item.val,item);
        //监听改变
        UserCtr.set_menu_init_change()
    }
</script>
<style scoped lang="scss">
    .switch-nav{
        width: 100%;
        height: 0.24rem;
        position: relative;
        font-weight: 500;
        font-family: 'PingFang SC';
        ul{
            width: 100%;
            height: 100%;
            border-radius: 25px;    
            background: var(--q-gb-bg-c-18);
            display: flex;
            font-size: 12px;
            font-weight: 500;
            li{
                flex: 1;
                text-align: center;
                // color: var(--q-gb-bd-c-4);
                margin: 0.02rem;
                color: #AFB3C8;
                line-height: 0.2rem;
                &.active{
                    border-radius: 25px;
                    // background:var(--q-gb-bg-c-11); 
                    color: var(--q-gb-t-c-20);
                    background: var(--q-gb-bg-c-28);
                    box-shadow: 0px 2px 4px rgba(121, 129, 164, 0.2);
                }
            }
        }
    }
</style>
