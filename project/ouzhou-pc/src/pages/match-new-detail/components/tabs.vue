
<!--
 * @Author: cooper
 * @Date: 2023-07-05 15:13:55
 * @Description: tabs 组件，详细请查看搜索页面跟详情页面
-->
<template>
    <div class="match-search">
        <div class="search-top">
            <div class="btn-group">
                <div v-for="item in tab_options" :key="item.value" class="btn-group-item" @click="tab_click(item)">
                    <span :class="{ 'btn-group-item-ls': true, 'btn-group-item-ls-active': active_value == item.value }">{{
                        item.label
                    }}</span>
                </div>
            </div>
        </div>

    </div>
</template>
  
<script setup>
import { ref,watch } from "vue";
const props = defineProps({
    tab_options: {
        type: Array,
        default: () => []
    },
    modelValue: {
        type: String ||Number,
        
    }
})

const active_value = ref('')

watch(()=>props.modelValue,val=>{
    active_value.value = val
})
const emits = defineEmits(['update:modelValue'])

// 筛选点击
const tab_click = (item) => {
    console.log(item)
    active_value.value = item.value
    emits('update:modelValue', item.value)
}




</script>
  
<style lang="scss" scoped>
.match-search {
    .search-top {
        height: 50px;
        background-color: #ffffff;
        // border-radius: 4px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        border-bottom: 1px solid #FF7000;
    }

    .btn-group {
        border-radius: 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        .btn-group-item {
            font-size: 12px;
            // margin-right: 20px;
            padding: 4px 5px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .btn-group-item-ls {
                cursor: pointer;
                padding: 4px 10px;
                box-sizing: border-box;
                border-radius: 18px;
                border: 1px solid rgba(255, 255, 255, 0);
                margin-left: -1px;
                margin-right: -1px;
                display: inline-block;
            }

            .btn-group-item-ls-active {
                background-color: #FF7000;
                border: 1px solid #FF7000;
                color: #ffffff;
                font-weight: 500;
            }

            &:hover {
                .btn-group-item-ls {
                    border: 1px solid #FF7000;
                }
            }

        }
    }

}
</style>