<template>
    <div>
      <div class="flex flex-center">
        列表数据
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent ,ref ,reactive,onMounted,watch,computed} from 'vue'
  import { api_match } from "src/api/index.js";
  import { menu_data } from "src/project-ouzhou/pages/menu_list/config/menu_data"
  import { use_init_menu } from "src/project-ouzhou/pages/menu_list/config/menu_list_config"
  
  export default defineComponent({
    name: 'menuList',
    setup(){
        let menu_list = reactive();
        let menu_id_data = reactive();
        let age = ref(10)
        let { menu_1_base } = use_init_menu()

        function get_menu_list(){
            api_match.handle_menu_id_list().then((res)=>{
                if(res.data){
                    menu_list =  menu_data
                }
            }).catch(()=>{
                menu_list = menu_data
                console.error('报错了',menu_list)
            })
        }

        function init_menu_data(){
        }
        watch(() => age.value,(cur,per)=>{
            console.error('per',per)
        })
        onMounted(async ()=>{
           await get_menu_list()
           console.error('menu_1_base',menu_1_base)
        })
        return {
            menu_list,
            menu_id_data,
            age,
            menu_1_base,
            get_menu_list,
            init_menu_data
        }
    }
  })
  </script>
  
<style>

</style>