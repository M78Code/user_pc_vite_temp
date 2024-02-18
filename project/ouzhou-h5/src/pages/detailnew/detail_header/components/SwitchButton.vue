<template>
  <div class="component switch-button detail-header-scope">
    <div class="container">
      <div class="image">
        <img :src="image" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  image:{
    required:true,
    type: String
  }
})
</script>

<style lang="scss" scoped>
.component.switch-button{
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  background-color: #1A1A1A7D; // #TODO: css var
  .container{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.image{
  width: 0.16rem;
  img{
    width: 100%;
    object-fit: contain;
  }
}
</style>