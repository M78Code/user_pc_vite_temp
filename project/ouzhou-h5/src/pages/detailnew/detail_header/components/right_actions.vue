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
    },
    // 右侧显示状态 0 -> 显示全部 1 -> 展示动画内 2 -> 展示比分 3 -> 只展示收藏
    status: {
        type: Number,
        default: 0
    }
});

const emits = defineEmits(['handleType'])
// 展示的项,根据不同的值显示不同的actions
const mapObj = computed(() => {
    return  {
        0: [0,1,2],
        1: [0,1,2],
        2: [0,1,2],
        3: [2]
    }
})

const list = computed(() => {
    const res = [
        {label: 'animation', img: '/ouzhou-h5/image/detail/animation.png', value: 0},
        {label: 'score', img: '/ouzhou-h5/image/detail/score.png', value: 1},
        {label: 'collect', img: '/ouzhou-h5/image/detail/collect.png', active: '/ouzhou-h5/image/detail/collected.png', value: 2},
    ];
    return res.filter(e => mapObj.value[props.status].includes(e.value));
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