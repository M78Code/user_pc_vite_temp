<template>
     <img v-if="ol_item?.os == 2 || compute_value_by_cur_odd_type(ol_item.ov, ol_item._hpid, ol_item._hsw, MatchDetailCalss.params.sportId) == 0 || ol_item?._hs == 1 " class="lock" :src="odd_lock_ouzhou" alt="lock"/>
</template>
<script setup>
import {compute_value_by_cur_odd_type, MatchDetailCalss} from "src/output/index.js"
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";
const props = defineProps({
  ol_item: {
        type: Object,
        default: () => ({})
    }
})
</script>
<style scoped>
 
</style>