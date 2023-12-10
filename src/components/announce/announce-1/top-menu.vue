<!-- @Description: 公告栏、体育规则 top菜单组件 -->
<template>
    <!-- top菜单内容 -->
    <div class="top-menu-content">
        <q-tabs class="fit rule-scroll-area" outside-arrows
        mobile-arrows>
            <q-tab class="cursor-pointer" v-for="(item, index) in data" :key="index" @click="tabs_click(item, index)">
                <div class="top-menu-title"
                    :class="{ active: tab_index == index, topmenutitles:tab_index == index, 'no-subtab': !item.subtab || item.subtab.length == 0 }">        
                    <div>{{ item.nen }}</div>
                </div>
                <!-- top菜单列表 -->
                <div class="top-menu-list" :class="tab_index == index && 'active'">
                    <div class="top-menu-li" v-for="(items, idx) in item.subtab" :key="idx"
                        :class="{ 'active': sub_index == idx }" @click.stop="sub_click(items, idx)">
                        <div class="point"></div>
                        <span class>{{ items.title }}</span>
                    </div>
                </div>
            </q-tab>
        </q-tabs>
    </div>
</template>
  
<script setup>
import { ref , onMounted} from 'vue'

const props = defineProps({
    data: {
        type: Array,
        default: [],
    }
})
onMounted(() => {
})
const emits = defineEmits(['tabs_click', 'sub_click'])
const showhot = ref(true)
/** 一级菜单选择索引 */
const tab_index = ref(0)
/** 二级菜单选择索引 */
const sub_index = ref(0)

/**
 * @Description:切换一级菜单
 * @Author Cable
 * @param:item  切换的一级菜单对象
 * @param:index  切换的一级菜单索引
 * @return:
 */
function tabs_click(item, index) {
    tab_index.value = index;
    sub_index.value = 0;
    emits("tabs_click", item, index);
}
/**
 * @Description:切换二级菜单
 * @Author Cable
 * @param:item  切换的二级菜单对象
 * @param:index  切换的二级菜单索引
 * @return:
 */
function sub_click(item, index) {
    sub_index.value = index;
    emits("sub_click", item);
}

</script>
  
<style lang="scss" scoped>
.top-menu-content {
    height: 48px;
    border-top: 1px solid var(--q-announce-left-menu-color-2);
    // background: var(--q-gb-bg-c-4);  #ffffff
    // color: var(--q-gb-t-c-8);  #8A8986 
    background:#ffffff;
    color:#8A8986 ;
    &:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 6px;
        top: 48px;
        right: 0;
        // background-color: var(--q-gb-bg-c-6);
        background-color:#E2E2E2;
    }
    :deep(.q-tab__indicator){
        display: none;
    }
    .top-menu-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        &.no-subtab {
            .q-icon {
                display: none;
            }
        }
        &.active {
            font-weight: 600;
            // color: var(--q-gb-t-c-5);  
            color:#1a1a1a;
        }
        &::before{
            content: '';
            width: 2px;
            height: 12px;
            background: #D9D9D9;
            position: absolute;
            right:  -18px;
            top: 18px;
            }
    }
    .top-menu-list {
        overflow: hidden;
        max-height: 0px;
        transition: max-height 0.15s;
        background: var(--q-gb-bg-c-11);

        &:hover {
            color: var(--q-gb-t-c-6);
            .point {
                background: var(--q-gb-bg-c-17);
            }
        }
        .top-menu-li {
            display: flex;
            align-items: center;
            height: 34px;

            &.active {
                font-weight: 600;
            }
        }
    }
}
.topmenutitles::after {
content: "";
width: 8px;
height: 8px;
border-radius: 50%;
position: absolute;
bottom: 0rem;
left: 50%;
top: 90%;
transform: translate(-50%, 0);
background: #ffb001;
}
:deep(.q-tabs__content){
    justify-content: start !important;
}
</style>
  