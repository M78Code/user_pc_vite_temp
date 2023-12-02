<template>
    <div class="right-actions" v-if="props.isShow">
        <ul>
            <li v-for="(item, i) in list" :key="i" class="item" @click="handleClick(item)">
                <img :src="props.isCollect && item.label == 'collect' ? item.active : item.img" alt="" class="icon" v-if="item.img" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
    // 是否收藏
    isCollect: {
        type: Boolean,
        default: false,
    },
    // 是否显示
    isShow: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['handleType'])

const list = computed(() => {

    return [
        {label: 'animation', img: '/ouzhou-h5/image/detail/animation.png'},
        {label: 'score', img: '/ouzhou-h5/image/detail/score.png'},
        {label: 'collect', img: '/ouzhou-h5/image/detail/collect.png', active: '/ouzhou-h5/image/detail/collected.png'},
    ];
})

const handleClick = (item) => {
    switch (item.label) {
        // 切换动画
        case 'animation':
            emits('handleType', 'animation')
            break;
        // 切换比分
        case 'score':
            emits('handleType', 'score')
            break;
        // 收藏
        case 'collect':
            emits('handleType', 'collect')
            break;
        default:
            break;
    }
}

</script>

<style scoped lang="scss">
.right-actions {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
        width: 40px;
        height: 40px;
        margin-bottom: 1px;
        background: rgba(26, 26, 26, 0.49);
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
            height: 16px;
        }
    }
}
</style>