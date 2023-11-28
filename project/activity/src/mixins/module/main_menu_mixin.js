/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 菜单数据处理
 */
export default {
  methods: {
    /**
     * @description: 设置sessionStorage存储菜单本地缓存
     * @param {Object} 菜单选中项数据
     * @return {Undefined} Undefined
     */    
    set_menu_record(menu_record){
      sessionStorage.setItem('menu_record',JSON.stringify(menu_record));
    },
    /**
     * @description: 获取sessionStorage存储菜单本地缓存
     * @param {Undefined} Undefined
     * @return {Object} 选中的菜单数据
     */
    get_menu_record(){
      let menu_record = sessionStorage.getItem('menu_record');
      if(!menu_record) return null;
      return JSON.parse(menu_record);
    },    
    /**
     * @description: 移除sessionStorage当前菜单本地缓存
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    remove_m_record(){
      sessionStorage.removeItem('menu_record');
    },
    /**
     * @description: 设置sessionStorage当前日期本地缓存
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    set_menu_date(menu_date){
      sessionStorage.setItem('menu_date_record',JSON.stringify(menu_date));
    },
    /**
     * @description: 获取sessionStorage当前日期菜单本地缓存
     * @param {Undefined} Undefined
     * @return {Object} 
     */
    get_menu_date(){
      let r = null;
      let d = sessionStorage.getItem('menu_date_record');
      if(d){
        r = JSON.parse(d);
      }
      return r;
    },
    /**
     * @description: 移除sessionStorage当前日期菜单本地缓存
     * @param {Undefined} Undefined
     * @return {Object} 
     */
    remove_menu_date(){
      sessionStorage.removeItem('menu_date_record');
    },


  },
}
