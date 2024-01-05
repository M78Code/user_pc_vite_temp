/*
 * @Description: 赛马动态排行
 */
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"

export default {
  name:'dynamic_ranking_timer',
  props:{
    team_list:Array,
    match:Object,
  },
  data(){
    return {
      team_obj :null,
      change_effect:true,
      team_list_sort:null,
    }
  },
  computed: {
    sub_menu_type(){return VR_CTR.state.curr_sub_menu_type},
  },
  watch:{
    'match.upd_data':{
      handler(new_, old_){
        this.upd_list_sort(new_);
      },
      immediate:true
    },
    'team_list':{
      handler(new_, old_){
        // 传进来的初始team只有2条然后更新为6条，会导致赛马类列表只展示2条，所以特殊处理下
        if(new_.length > 2){
          this.init_fn()
        }
      },
      immediate:true
    },
    // 切换菜单时列表数据初始化，否则赛马切换赛狗的定位get_list_i_top值有问题
    'sub_menu_type':{
      handler(new_, old_){
        this.team_list_sort = null;
      },
    },
  },
  mounted(){
    // this.init_fn()
  },
  methods: {
    init_fn(){
      let obj = {};
      let list = [];
      this.team_list.forEach((item,i) => {
        obj[(i+1)+''] = item;
      });
      this.team_obj = obj;

      for (let i = 1; i < 7; i++) {
        list.push({id:i,name:obj[i]})
      }
      this.set_new_poi_to_old(list);
      if(this.match.upd_data){
          this.upd_list_sort(this.match.upd_data)
      }
    },
    /**
     * @description: 更新排名列表
     * @param {*} new_ 需要更新的新排名数据
     */
    upd_list_sort(new_){
      if(new_){
          if((!this.team_obj) && this.team_list){
            let obj = {};
            this.team_list.forEach((item,i) => {
              obj[(i+1)+''] = item;
            });
            this.team_obj = obj;
          }
          try {
            let new_obj = JSON.parse(new_);
            let list_ = [];
            let id = '';
            for (let i = 1; i < 7; i++) {
              id = Number(new_obj['ranking'+i]);
              list_.push({id:id,name:this.team_obj[id]})
            }
            this.set_new_poi_to_old(list_);
          } catch (error) {
            console.error(error);
          }
        }
    },
    get_list_i_top(i){
      let item = this.team_list_sort[i];
      let single_distance = .48;
      single_distance += .08;
      return item.sort_i * single_distance;
    },
    /**
     * 设置排名
     */
    set_new_poi_to_old(new_list){
     new_list = new_list.filter((item) => item.name != undefined)
      // console.log('new_list===虚拟', new_list);
      if(!this.team_list_sort){
        this.team_list_sort = new_list.map((i_t,i) => {
          return {
            ...i_t,
            sort_i:i
          }
        });
      }
      else{
        this.team_list_sort.forEach(source => {
          let s_i = 0;
          new_list.forEach((n,i0) => {
            if(n.name == source.name){
              s_i = i0;
            }
          });
          source.sort_i = s_i;
        });
      }
      // console.log('this.team_list_sort===虚拟', this.team_list_sort);
    },
  }
}