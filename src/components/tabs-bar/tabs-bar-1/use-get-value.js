import { ref, reactive, toRefs, computed ,onMounted,watch} from "vue";
import { useRoute } from 'vue-router'
import lodash from 'lodash'

export const useGetValue = ({ handicap_this }) => {
  const state = reactive({
   
  });

  const currentIndex = ref(0)
  const tabs = ref(0)
  const isRouterAlive = ref(0)

  const route = useRoute()
   //是否详情
  const is_details = computed(() => {
    return ['details','virtual_details'].includes(route.name)
  });
   // 获取玩法集菜单长度
  const category_list_length = computed(() => {
    return lodash.get(handicap_this,'category_list.length',0)
  });


  // watch: {
  //   // 监听玩法集菜单id变化
  //   get_tabs_active_id(val){
  //     if(_.get(this.handicap_this,'category_list')){
  //       let index = _.findIndex(this.handicap_this.category_list,(item)=>item.id == this.get_tabs_active_id)
  //       this.currentIndex =  index == -1 ? 0 : index
  //     }
  //   },
  //   // 监听玩法集菜单长度变化
  //   category_list_length(val){
  //     if(_.get(this.handicap_this,'category_list')){
  //       let index = _.findIndex(this.handicap_this.category_list,(item)=>item.id == this.get_tabs_active_id)
  //       this.currentIndex =  index == -1 ? 0 : index
  //     }
  //   }
  // }

 
  onMounted(()=>{
   
  })


  return {
    currentIndex,
    tabs,
    isRouterAlive,
    is_details,
    category_list_length
  };
};
