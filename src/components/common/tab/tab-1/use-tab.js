import { nextTick, computed, ref, watchEffect, watch, onMounted, onBeforeUnmount } from "vue";


export default function use_tab(item_wrap_dom, { line_width = 100, is_drag, children = ".tab-item", active = 0 }) {
    const left = ref(0) //下划线left
    const width = ref(0) //下划线宽度
    const item_wrap_left = ref(0) //item包裹left
    const item_wrap_width = ref(0) //item包裹宽度
    const item_total_width = ref(0) //所有item的宽度
    const sizes = ref([]) //下划线初始大小
    let is_mousedown = false;//是否按下
    let clientX;
    let last_left;
    let timer, init_timer;  //定时器
    watchEffect(() => {
        clearTimeout(init_timer) && setTimeout(() => {
            init_func()
        }, 300)
    })
    watch(active, () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (!sizes.value[final_index.value]) return;
            left.value = lodash.get(sizes.value, `${active?.value}.left`);
            width.value = lodash.get(sizes.value, `${active?.value}.width`);
            // 固定下划线宽度
            if (line_width) {
                left.value = left.value + (width.value - line_width) / 2;
                width.value = line_width;
            }
        });
    }, { immediate: true })
    const hand_cilck_move = (left) => {
        if (!is_drag) return
        let max_left = 0 - (item_total_width.value - item_wrap_width.value + 50)
        if (left >= 0) {
            left = 0
        } else if (left < max_left) {
            left = max_left
        }
        item_wrap_left.value = left
    }
    /**
    * @Description:鼠标移入选项
    * @param {number} index 移入选项的索引
    * @return {undefined} undefined
    */
    const tabs_enter = (index) => {
        tabs_hover(index, 'in')
    }

    /**
     * @Description:鼠标移出选项
     * @param {number} index 移出选项的索引
     * @return {undefined} undefined
     */
    const tabs_leave = (index) => {
        tabs_hover(index, 'out')
    }

    /**
     * @Description:鼠标移入移出操作
     * @param {number} index 选项的索引
     * @param {string} type  类型 in 移入  out 移出
     * @return {undefined} undefined
     */
    const tabs_hover = lodash.debounce((index, type) => {
        // 顶部导航栏的任务中心不展示下划线
        let _index;
        if (type == 'in') {
            if (lodash.get(sizes.value, `[${index}]`)) {
                left.value = lodash.get(sizes.value, `${index}.left`)
                width.value = lodash.get(sizes.value, `${index}.width`)
            }
        }
        if (type == 'out') {
            if (lodash.get(sizes.value, `[${active?.value}]`)) {
                left.value = lodash.get(sizes.value, `${active?.value}.left`)
                width.value = lodash.get(sizes.value, `${active?.value}.width`)
            }
        }
        // 固定下划线宽度
        if (line_width) {
            left.value = left.value + (width.value - line_width) / 2
            width.value = line_width
        }
    })

    /**
 * @Description:左边按钮是否显示
 * @return {boolean}
 */
    const left_btn_show = computed(() => {
        return item_wrap_left.value < 0;
    })

    /**
     * @Description:右边按钮是否显示
     * @return {boolean}
     */
    const right_btn_show = computed(() => {
        let total_up = item_total_width.value > item_wrap_width.value
        let wrap_left_up = item_wrap_left.value > (item_wrap_width.value - item_total_width.value - 50)
        return total_up && wrap_left_up;
    })
    /**
 * @Description 鼠标移动事件
 * @param {object} e 鼠标事件
 * @param {undefined} undefined
*/
    function mousemove(e) {
        if (!this.is_mousedown || item_wrap_width.value > item_total_width.value) {
            return
        }
        let left = this.last_left + (e.clientX - this.clientX)
        if (left > 0) {
            left = 0
        }
        // 最大偏移量
        let max_left = 0 - (item_total_width.value - item_wrap_width.value + 50)
        if (left < max_left) {
            left = max_left
        }
        item_wrap_left.value = left
    }


    /**
     * @Description:初始化  设置选项初始宽高
     * @return {undefined} undefined
     */
    const init_func = () => {
        if (item_wrap_dom.value) return
        //父
        let _wrap = lodash.get(item_wrap_dom, 'parentElement')
        let dom = lodash.get(item_wrap_dom, 'children', [])
        sizes.value = []
        for (let i = 0; i < dom.length; i++) {
            if (!children || (children && dom[i].className.includes(children))) {
                let { offsetLeft = 0, clientWidth = 0 } = dom[i];
                sizes.value.push({
                    left: offsetLeft + props.padding,
                    width: clientWidth - props.padding * 2,
                });
            }
        }
        if (sizes.value.length > 0) {
            let current_index = active?.value == -1 ? 0 : active?.value;
            left.value = lodash.get(sizes.value, `${current_index}.left`, 0);
            width.value = lodash.get(sizes.value, `${current_index}.width`, 0);
            item_wrap_width.value = _wrap.clientWidth;
            item_total_width.value =
                sizes.value[sizes.value.length - 1].left +
                sizes.value[sizes.value.length - 1].width;
        } else {
            width.value = 0;
        }
        // 固定下划线宽度
        if (line_width) {
            left.value = left.value + (width.value - line_width) / 2;
            width.value = line_width;
        }
    }
    /**
 * @Description 鼠标按下
 * @param {object} e 鼠标事件
 * @param {undefined} undefined
*/
    const mousedown = (e) => {
        clientX = e.clientX
        last_left = item_wrap_left.value
        is_mousedown = true
    }

    /**
     * @Description 鼠标弹起
     * @param {undefined} undefined
    */
    const mouseup = () => {
        is_mousedown = false
    }
    // 鼠标事件监听
    if (is_drag) {
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
    }
    window.addEventListener("resize", init_func)
    onBeforeUnmount(() => {
        clearTimeout(timer)
        clearTimeout(init_timer)
        window.removeEventListener("resize", init_func)
        tabs_hover.cancel()
        // 鼠标事件取消监听
        if (is_drag) {
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mouseup", mouseup);
        }
    })
    return {
        tabs_enter,
        tabs_leave,
        hand_cilck_move,
        mousedown,
        mouseup,
        left,
        item_wrap_left,
        init: init_func,
        left_btn_show,
        right_btn_show,
    }
}