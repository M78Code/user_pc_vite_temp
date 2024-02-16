<!--
 * @Author: jamison pmtyjamison@itcom888.com
 * @Date: 2023-11-03 18:26:34
 * @LastEditors: jamison pmtyjamison@itcom888.com
 * @LastEditTime: 2023-11-07 16:36:42
 * @FilePath: \user-pc-vite\src\base-h5\components\setting-filter\components\switch.vue
 * @Description: 
-->
<template>
    <div class="switch" :class="{ 'switch-on': value === 'rightVal' }" @click="toggle">
        <div class="switch-toggle"></div>
        <div class="switch-content" :class="{'disabled' : disabled }">
            <div class="left-val" :class="{ 'active': value === 'leftVal' }">{{ leftVal }}</div>
            <div class="right-val" :class="{ 'active': value === 'rightVal' }">{{ rightVal }}</div>
        </div>
    </div>
</template>
  
<script setup>
const props = defineProps({
    value: {
        type: String,
        default: 'leftVal'
    },
    leftVal: {
        type: String,
        required: true,
        default: ''
    },
    rightVal: {
        type: String,
        required: true,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})
const emit = defineEmits(["change_value"]);

const toggle = () => {
    if(props.disabled) return
    emit('change_value')
}
</script>
  
<style scoped lang="scss">
.switch {
    display: inline-block;
    position: relative;
    width: 1.04rem;
    height: 0.28rem;
    border-radius: 0.14rem;
    background-color: var(--q-gb-bg-c-30);
    cursor: pointer;
}


.switch-toggle {
    position: absolute;
    top: 0.02rem;
    left: 0.02rem;
    width: 0.5rem;
    height: 0.24rem;
    border-radius: 0.14rem;
    background-color: var(--q-gb-bg-c-28);
    transition: transform 0.4s;
}

.switch-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.28rem;

    &.disabled {
        background-color: #eee;
    }

    div {
        width: 50%;
        text-align: center;
        position: relative;
        z-index: 1;
        color: var(--q-gb-t-c-31);
        font-size: 0.12rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.active {
            //color: #7981a4;
            color: var(--q-gb-t-c-10);
        }
    }
}

.switch-on .switch-toggle {
    transform: translateX(0.5rem);
}</style>