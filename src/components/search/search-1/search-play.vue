<!--  @Description: 搜索玩法 -->

<template>
    <div class="play-wrap" @click.stop>

    </div>
</template>
  
<script setup>
const props = defineProps({
    show_type: {
        type: String,
        default: ''
    }
})
</script>
  
<style lang="scss" scoped>
.play-wrap {
    color: #fff;
    font-size: 30px;
}
</style>