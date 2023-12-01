<template>
  <Layout/>
</template>

<script>
import { defineComponent } from "vue";
import Layout from "project/activity/src/layouts/layout.vue";
import apiDomain from "project/activity/src/mixins/apiDomain/apiDomain.js";
 


export default defineComponent({
  name: "App",
  mixins:[apiDomain],
  components: {
    Layout,
  },
  created () {
    console.error(this);
     this.test_init()  ;
  },
  methods: {
    test_init() {

     let online_obj={
      gr:'COMMON',
      token:"92132a64802bf5afd27dc5cce25ccea8174ebf29",
      lang:'zh',
      pb:"1",
      best_api:"https://api.lkjklkyi.com"
     }


     let final_obj= online_obj

     for( let i in final_obj){
      sessionStorage.setItem(i, final_obj[i])
     }


 
      
    }
  },
});
</script>
