<template>
    <div></div>
</template>

<script setup>
// 视频控制器，只做公共组件video页面的控制器
import { computed } from "vue";
const props = defineProps({
    params: {
        type: Object,
        default: () => ({
            play_type: null,
        })
    }
});
/** true 大屏 false 中屏 */
const is_full_screen = computed(() => props.params.play_type == 2);

</script>