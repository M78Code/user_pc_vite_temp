<template>
    <div class="announcement_page">
      <header></header>
      <headerSelect :announcement_headle_info="announcement_headle_info"></headerSelect>
      <section>
        <!-- <div class="title">General Sports Explanation</div> -->
        <q-scroll-area style="height: 100%;">

        </q-scroll-area>
      </section>
    </div>
  </template>
   
  <script setup>
    import { ref ,reactive,onMounted} from 'vue'
    import headerSelect from "src/base-h5/components/personal/components/header_select.vue"

  const announcement_headle_info = reactive([
    {
      name:'Football',
      id:"1"
    },
    {
      name:'Basketball',
      id:"1"
    },
    {
      name:'tennis',
      id:"1"
    },
    {
      name:'Badminton',
      id:"1"
    },
    {
      name:'Badminton',
      id:"1"
    },
    {
      name:'Badminton',
      id:"1"
    },
  ]);
  </script>
   
  <style scoped lang="scss">
  .announcement_page{
    height: 100%;
    background: #E2E2E2;
    
  }
  
  </style>
  