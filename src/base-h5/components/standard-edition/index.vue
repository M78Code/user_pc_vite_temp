<template>
    <div class="standard-edition">
        <div class="flex">
            <div>专业版</div>
            <div></div>
            <img src="" alt="">
            <div @click="set_standard_edition(1)">使用</div>
        </div>
        <div class="flex">
            <div>新手版</div>
            <div></div>
            <div>
                <img src="" alt="">
            </div>
            <div @click="set_standard_edition(2)">使用</div>
        </div>
    </div>
</template>
<script setup>
import UserCtr from 'src/core/user-config/user-ctr.js'
const emits = defineEmits(['change'])
function set_standard_edition(v) {
    UserCtr.set_standard_edition(v)
    emits('change', v);
}
</script>