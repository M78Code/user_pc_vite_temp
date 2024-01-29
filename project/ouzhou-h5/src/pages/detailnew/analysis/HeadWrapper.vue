<script setup name="head-wrapper">
import { ref } from "vue"
const props = defineProps({
    tab_list: {
        type: Array,
        default: () => []
    },
    active_key: {
        type: String,
        default: 'id'
    },
    tab_key: {
        type: String,
        default: 'name'
    },
    start_value:{
        type: [String,Number],
        default: 1
    }
})
const emit = defineEmits()

const use_index_as_key = props.active_key === 'index'

const set_userset_key = function (item, index) {
    return use_index_as_key ? index : item[props.active_key]
}

const is_active = function (item, index) {
    return props.start_value == set_userset_key(item, index) ? 'active' : ''
}

const ChangeSelectedTabId = function (event) {
    const { userset } = event.target.dataset;
    emit('change',userset)
    // emit('update:start_value', userset);
}
</script>

<template>
    <nav class="head-wrapper">
        <ul class="head-tab" @click="ChangeSelectedTabId($event)">
            <li class="head-tab-item" :class="is_active(item,index)"
                v-for="(item,index) of tab_list" :key="item.id" :data-userset="set_userset_key(item,index)">
                {{ item[tab_key] }}
            </li>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
.head-wrapper {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #E2E2E2;

    .head-tab {
        display: flex;
        justify-content: center;
        border-radius: .15rem;
        overflow: hidden;
        border: 1px solid #FF7000;
        background: #ffffff;

        &-item {
            height: .3rem;
            text-align: center;
            width: 1rem;
            line-height: .3rem;
            color: #484848;
            font: {
                size: .14rem;
                weight: 400;
            };
        }

        .active {
            color: #FFFFFF;
            background: #FF7000;
        }
    }
}
</style>