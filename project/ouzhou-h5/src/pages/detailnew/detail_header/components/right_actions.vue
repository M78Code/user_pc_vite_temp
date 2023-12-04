<template>
    <div class="right-actions">
        <ul class="list">
            <li v-for="(item, i) in list" :key="i" class="item" @click="handleClick(item, index)">
                <img :src="props.isCollect && item.label == 'collect' ? item.active : item.img" alt="" class="icon" v-if="item.img" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { emit } from 'licia/fullscreen';
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/core';
import { computed, ref } from 'vue';
// import videos from "src/base-h5/components/details/components/videos2.vue";   // 详情页视频+动画直播区域
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
        default: 1
    },
    isVideo: {
        type: Boolean,
        default: false
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
// 是否时视频
const is_video = ref(props.isVideo);
// 选择的item
let select = computed(() =>  list.value[0].label);

const list = computed(() => {
    const res = [
        {label: 'animation', img: is_video.value ? `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/video.png` :  `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/animation.png`, value: 0},
        {label: 'score', img: `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/score.png`, value: 1},
        {label: 'collect', img: `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/collect_gray.png`, active: `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/collected.png`, value: 2},
    ];
    return res.filter(e => mapObj.value[props.status].includes(e.value));
})

/**
 * 回调
 * @param {*} item 
 * @param {*} index
 * @example
 * <right_actions @handleType="handle_type"/> 
 * 
 * handle_type(value) {
 *    switch(value) {
 *     // 点击动画
 *     case "animation":
 *      break; 
 *     // 点击视频
 *     case "video":
 *      break;
 *     // 点击比分
 *     case "score":
 *      break;
 *     // 点击收藏
 *     case "collect":
 *      break; 
*     }
 * }
 */
const handleClick = (item, index) => {
    switch (item.label) {
        // 切换动画
        case 'animation':
            // if (index == 0) {
            if (select == "animation") {
                emit('handleType', is_video.value ? 'animation' :'video')
                is_video.value = !is_video.value;
            }else {
                emit('handleType', 'animation')
            }
            // }
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

    select = item.label;
}

</script>

<style scoped lang="scss">
.detail {
    width: 100%;
    height: 245px;
}
.right-actions {
    height: 100%;
    top: 0px;
    position: absolute;
    right: 0;
    z-index: 999;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .list {
        padding-top: 30px;
    }
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