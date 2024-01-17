<script setup>
const props = {
  title:{
    type: String,
    default: ''
  },
  
}
</script>

<template>
  <section class="card">
    <nav class="card-title"></nav>
    <article class="cardbody">
      <slot name="body"></slot>
    </article>
  </section>
</template>


<style scoped lang="scss">

</style>