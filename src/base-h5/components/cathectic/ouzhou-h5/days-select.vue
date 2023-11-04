<template>
    <div class="fliter">
        <span @click.stop="showList = true">
            {{ list[_index].title }}
            <icon-wapper name="icon-triangle1" />
        </span>
        <q-slide-transition>
            <ul v-if="showList" @click.stop>
                <li v-for="(item, index) in list" :key="index" @click="change(index)">{{ item.title }}</li>
            </ul>
        </q-slide-transition>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import { IconWapper } from 'src/components/icon'
let showList = ref(false)
let _index = ref(0)
const list = ref([
    { title: '今天', val: 0 },
    { title: '7天', val: 3 },
    { title: '30天', val: 4 },
])

const emit = defineEmits(['changeDays'])
const change = (index) => {
    _index.value = index
    showList.value = false
    emit('changeDays', list.value[index].val)
}

</script>
<style lang="scss" scoped>
.fliter {
    margin-left: 0.1rem;
    line-height: 0.46rem;
    height: 0.5rem;
    font-size: 0.16rem;
    position: relative;

    i {
        font-size: 0.2rem;
    }

    ul {
        position: absolute;
        left: 0;
        top: 0.5rem;
        background: var(--q-gb-bg-c-15);
        width: 100%;

        li {
            font-size: 0.14rem;
            line-height: 2.5;
        }
    }
}
</style>