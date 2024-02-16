<template>
    <ul>
        <li v-for="(item, i) in props.data" :key="i">
            
        </li>
    </ul>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Array,
        default: () => ([])
    }
})
</script>

<style lang="scss" scoped></style>