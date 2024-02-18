import { get_history_score_list } from 'src/core/match-list-pc/match-handle-data.js'
import { computed, onMounted, ref } from 'vue';
import { get_match_status } from 'src/output/index.js'
import lodash from 'lodash';
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// 赛事模板宽度
function use_match_footer_score(props) {
    const more_right_icon = ref(false);
    const more_left_icon = ref(false);
    const stage_score = ref(null);
    // 当前赛事状态
    const match_status = computed(() => {
        const status = get_match_status(props.match.ms, [110]);
        return status;
    });
    const score_list = computed(() => {
        return get_history_score_list(props.match)
    });
    onMounted(() => {
        // 异步设置组件是否挂载完成
        setTimeout(() => {
            scorll("init");
        });
    })

    /**
     * 计算是否显示比分滚动箭头
     */
    function compute_is_show_more() {
        if (!stage_score.value) return;
        let length = lodash.get(score_list, "[0].length", 0);
        if (length < 5) {
            more_right_icon.value = false;
            more_right_icon.value = false;
            return;
        }
        //比分总宽度
        let$totalWidth = length * 50,
            //已滚动的距离
            scrollLeft = lodash.get(stage_score.value, "scrollLeft", 0),
            //元素实际宽度
            clientWidth = lodash.get(stage_score.value, "clientWidth", 0);
        //总宽度大于实际宽度
        if (totalWidth > clientWidth) {
            more_right_icon.value = $true;
        }
        //已经移动距离
        if (scrollLeft > 0) {
            more_left_icon.value = $true;
            //未移动距离
        } else {
            more_left_icon.value = false;
        }
        //移动到底了
        if (totalWidth - 15 < scrollLeft + clientWidth) {
            more_right_icon.value = false;
        }
    }
    /**
     * 比分溢出时滚动方法
     */
    function scorll(type) {
        let length = lodash.get(score_list, "[0].length", 0);
        if (!stage_score.value || length < 5) return;
        let stageScore = stage_score.value;
        switch (type) {
            case "left":
                stageScore.scrollLeft -= 100;
                break;
            case "init":
                stageScore.scrollLeft = 2000;
                break;

            default:
                stageScore.scrollLeft += 100;
                break;
        }
        compute_is_show_more();
    }
    return {
        compute_is_show_more,
        score_list,
        scorll,
        match_status,
        more_left_icon,
        more_right_icon,
        stage_score,
    }
}

export { use_match_footer_score };