<!--
 * @Description: 投注栏位提示
-->

<template>
    <div class="yb_px14  items-center yb_fontsize12">
        <div>{{item.tid_name}} <span>@{{ format_odds(item.oddFinally, item.sportId) }}</span></div>
        <div>{{item.playName}} </div>
        <div>{{ item.home }} VS {{ item.away }}</div>
    </div>
</template>


<script setup>
import { ref} from 'vue';
import lodash_ from 'lodash'
import { format_odds } from "src/output/index.js"

const props = defineProps({
    item: { },
    conflict_tips: {
        type: String,
        default: '',
    }
})


</script>

<style scoped lang="scss">  

.yb_fontsize12{
    margin-bottom: 6px;
    //border-bottom: 1px solid #ccc;
    background-color: var(--q-gb-t-c-7);
    border-radius: 12px;
    padding: 0.12rem;
    span{
        float: right;
    }
}
</style>