<script setup name="head-wrapper">
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
    }
})
const emit = defineEmits(['change'])

const selected = ref(null)

const set_userset_key = function (item, index) {
    if (props.active_key === 'index') {
        return index
    } else {
        return item[props.active_key]
    }
}

const is_active = function (item, index) {
    let selected_key;
    if (props.active_key === 'index') {
        selected_key = index
    } else {
        selected_key = item[props.active_key]
    }
    return selected.value == selected_key ? 'active' : ''
}

const ChangeSelectedTabId = function (event) {
    const {userset} = event.target.dataset;
    selected.value = userset
    emit('change', selected.value)
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