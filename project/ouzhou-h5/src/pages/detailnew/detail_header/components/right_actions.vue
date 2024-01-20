<template>
    <div class="right-actions">
        <ul class="list">
            <li v-for="(item, i) in list" :key="i" class="item" @click="handleClick(item, index)">
                <div>
                    <img :src="props.isCollect && item.label == 'collect' ? item.active : item.img" alt="" :class="`${item.label}_icon`" class="icon" v-if="item.img" />
                    <p v-else class="score">
                        <span>{{ item.score[0] || 0 }}</span>
                        <span>:</span>
                        <span>{{ item.score[1] || 0 }}</span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { emit } from 'licia/fullscreen';
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import { computed, ref, watch } from 'vue';
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
    // 右侧显示状态1: 动画视频可以切换 2: 只显示动画 3：只显示视频 4：都不显示 
    status: {
        type: Number,
        default: 1
    },
    isVideo: {
        type: Boolean,
        default: false
    },
    rightActionsLabel: {
        type: String,
        default: 'animation'
    },
    // 详情
    detail: {
        type: Object,
        default: () => ({})
    }
});

const scoew_icon_list = ref({
    S1: {home: 0, away: 0}
})

// 比分
const point = ref([0,0]);

/**
 *@description // 比分板数据
 *@param {*}
 *@return {*}
 */
const set_scoew_icon_list = (new_value) => {
  if (new_value && new_value.msc) {
    for (let key in new_value.msc) {
      let score_key_arr = new_value.msc[key].split("|");
      let score_value_arr = score_key_arr[1].split(":");
      scoew_icon_list.value[score_key_arr[0]] = {
        home: score_value_arr[0],
        away: score_value_arr[1],
      };
    }
  }
};

watch(() => props.rightActionsLabel, (value) => {
    select.value = value;
    console.log(value, "valueoooooo");
    if (value == "video") {
        is_video.value = true;
    }
    if (value == "animation") {
        is_video.value = false;
    }
})

watch(() => props.detail, (value) => {
    // console.log(value, "value===");
    if (!value || !value.msc) {
        return;
    }
    const data = value?.msc_obj||set_scoew_icon_list(value);
    scoew_icon_list.value = data;
    const s1_data = value.msc.map(e => e.split('|')).reduce((pre, cur) => {
        pre[cur[0]] = cur[1].split(':');
        return pre;
    }, {});
    
    if (s1_data['S1']) {
        point.value = [s1_data['S1'][0], s1_data['S1'][1]]
    }else {
        point.value = [0, 0]

    }
    
}, {deep: true, immediate: true})

const emits = defineEmits(['handleType'])
// 展示的项,根据不同的值显示不同的actions
const mapObj = computed(() => {
    return  {
        1: [0,1,2],
        2: [0,1,2],
        3: [0,1,2],
        4: [2]
    }
})

const score_point = computed(() => {
    console.log(scoew_icon_list.value, "[scoew_icon_list.value");
    return [scoew_icon_list.value.S1.home, scoew_icon_list.value.S1.away]
})

// 是否时视频
const is_video = ref(props.isVideo);
// 选择的item

const list = computed(() => {
    const res = [
        {label: 'animation', img: is_video.value ? `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/video.png` :  `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/animation.png`, value: 0},
        // {label: 'score',  value: 1, score: [  scoew_icon_list.value['S1']?.home, scoew_icon_list.value['S1']?.away]},
        {label: 'score',  value: 1, img: `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/score.png`,score: [point.value[0], point.value[1]]},
        {label: 'collect', img: `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/collect_gray.png`, active: `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/collected.png`, value: 2},
    ];
    // 遍历过滤符合项
    let filter_list = res.filter((e) => {
        return mapObj.value[props.status].includes(e.value)
    });
    // 再次遍历，如果只显示视频或者动画
    // filter_list = filter_list.filter((e, i) => {
    //     console.log( props.status, i != 0,  "props.status != 1 & i != 0");
    //     return props.status != 1 & i != 0;
    // });
    // 只显示视频或者动画 删除动画，视频切换按钮
    if (props.status != 1) {
        filter_list.shift();
    }
    return filter_list;
})

let select = ref(list.value[0]?.label);

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
    // debugger
    switch (item.label) {
        // 切换动画
        case 'animation':
        case 'video':
            console.log(item.label, select.value, "value===");
            
            // if (index == 0) {
            if (select.value == "animation") {
                if (props.status != 1) {
                    return;
                }
                emits('handleType', is_video.value ? 'animation' :'video')
                is_video.value = !is_video.value;
                // select.value = is_video.value ? 'animation' :'video';
            }else {
                // if ()
                if (props.status == 3) {
                    return;
                }
                console.log(props.status, "props.status===");
                emits('handleType', 'animation')
                select.value = 'animation';
            }
            
            // }
            break;
        // 切换比分
        case 'score':
            emits('handleType', 'score')
            select.value = item.label;
            break;
        // 收藏
        case 'collect':
            emits('handleType', 'collect');
            select.value = item.label;
            break;
        default:
            break;
    }

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
    // width: 100%; // 不需要100%吧? 挡住其他ui事件了
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .list {
        // padding-top: 30px;
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
        .score_icon.icon, .animation_icon.icon {
            height: 18px;
        }
    }
}

.score {
    color: white;
    font-size: 12px;
    padding: 0px 3px;
    border-radius: 4px;
    border: 2px solid #ffffff;
}
</style>