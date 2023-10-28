<template>
    <div class="switch" :class="{ 'switch-on': value === 'rightVal' }" @click="toggle">
        <div class="switch-toggle"></div>
        <div class="switch-content">
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
})
const emit = defineEmits(["update:value"]);

const toggle = () => {
    emit('update:value', props.value === 'leftVal' ? 'rightVal' : 'leftVal')
}
</script>
  
<style scoped>
.switch {
    display: inline-block;
    position: relative;
    width: 1.04rem;
    height: 0.28rem;
    border-radius: 0.14rem;
    background-color: #7981a4;
    cursor: pointer;
}


.switch-toggle {
    position: absolute;
    top: 0.02rem;
    left: 0.02rem;
    width: 0.5rem;
    height: 0.24rem;
    border-radius: 0.14rem;
    background-color: #fff;
    transition: transform 0.4s;
}

.switch-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.28rem;

    >div {
        width: 50%;
        text-align: center;
        position: relative;
        z-index: 1;
        color: var(--q-gb-bg-c-10);
        font-size: 0.12rem;

        &.active {
            color: #7981a4;
        }
    }
}

.switch-on .switch-toggle {
    transform: translateX(0.5rem);
}</style>