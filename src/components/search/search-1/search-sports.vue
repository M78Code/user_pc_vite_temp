<!-- @Description: 搜索球类 -->

<template>
    <div class="sports-wrap" @click.stop>
        <!-- 球类导航 -->
        <div class="sports-tab">
            <tab :is_show_line="true" :is_show_btn="true" :list="sports_list" :padding="10" @onclick="tab_click"
                :currentIndex="tab_index" ref="tab" />
        </div>
        <!-- 今日 -->
        <div class="item" @click="menu_click('today')"></div>
        <!-- 早盘 -->
        <div class="item" @click="menu_click('early')"></div>
        <!-- 串关 -->
        <div class="item" @click="menu_click('bet')"></div>
    </div>
</template>
  
<script>
import { defineComponent, ref, reactive } from 'vue'
import { TabWrapper } from "src/components/commont/tab"
// TODO: 
import { mapActions } from "vuex";
export default defineComponent({
    name: "searchSports",
    components: {
        Tab: TabWrapper
    },
    setup() {
        /** 当前球种索引 */
        const tab_index = ref(0)
        /** 当前球种索引 */
        const sports_list = reactive([])

        /**
         * @Description:切换球种
         * @param {number} index 球种索引
         * @return {undefined} undefined
         */
        function tab_click(obj) {
            tab_index.value = obj.index;
        }
        /**
         * @Description:切换菜单
         * @param {string} type 菜单类型
         * @return {undefined} undefined
         */
        function menu_click(type) {
            // TODO: 待完善store
            this.set_search_status(false)
            let sports = sports_list[tab_index.value]
        }
        return {
            tab_index,
            sports_list
        }
    },
    methods: {
        ...mapActions(['set_search_status']),

    }
})

</script>
  
<style lang="scss" scoped>
.sports-wrap {
    padding-top: 65px;

    .item {
        height: 30px;
        line-height: 30px;
        border-radius: 2px;
        color: #99a3b1;
        margin: 0 30px;
        margin-bottom: 5px;
        padding: 0 10px;
        cursor: pointer;

        &:hover {
            background-color: #262933;
            color: #FF7000;
        }
    }
}
</style>
  