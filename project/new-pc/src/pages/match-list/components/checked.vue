<template>
    <div :class="['checked',  checked ? 'checked-active':'']" @click="handle_check">
        <img v-show="checked" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/checked.svg`" alt="" class="checked-icon"/>
    </div>
</template>
<script setup>
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output";
import { ref, watch } from "vue";
const props = defineProps({
    is_checked: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['change_checked'])
const checked = ref(false);

watch(() => props.is_checked, (value) => {
    checked.value = value;
})

const handle_check = () => {
    checked.value = !checked.value;
    emits('change_checked', checked.value)
}
</script>

<style lang="scss" scoped>
.checked {
    display: flex;
    width: 12px;
    height: 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 2px;
    border: 1px solid #CBCED8;
    .checked-icon {
        width: 7px;
        height: 5px;
    }
}

.checked-active {
    border: none;
    background-color: #179CFF;
}
</style>