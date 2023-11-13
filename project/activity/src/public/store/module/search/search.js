/*
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 搜索功能数据操作使用
 */
export default {
    state: {
        related_keyword: "",    //联想关键字
        keyword: "",            //搜索关键字
        click_keyword:'',       //点击的关键字
        search_league_name:'',  //搜索联赛名
        search_isShow: false,   //是否显示搜索组件
        search_type:1,          //搜索类型  1组件搜索   2页面搜索
        search_csid: null,
    },
    getters: {
        //获取联赛关键字
        get_related_keyword(state) {
            return state.related_keyword
        },
        //搜索显示状态
        get_search_status(state) {
            return state.search_isShow
        },
        //搜索关键字
        get_search_keyword(state) {
            return state.keyword
        },
        //获取搜索点击的关键字
        get_click_keyword(state) {
            return state.click_keyword
        },
        //搜索的联赛名称
        get_search_league_name(state){
          return state.search_league_name
        },
        //搜索类型 1组件搜索 2页面搜索
        get_search_type(state) {
            return state.search_type
        },
        // 获取当前搜索出的是什么球种赛事
        get_search_csid(state) {
            return state.search_csid
        }
    },
    actions: {
        //保存搜索关键字
        set_search_keyword({ commit }, keyword) {
            commit("set_search_keyword", keyword);
        },
        //保存联想搜索关键字
        set_related_keyword({ commit }, related_keyword) {
            commit("set_related_keyword", related_keyword);
        },
        //保存显示搜索组件状态
        set_search_status({ commit }, search_wrap) {
            commit("set_search_status", search_wrap);
        },
        //保存搜索的联赛名
        set_click_keyword({ commit }, statu) {
            commit("set_click_keyword", statu);
        },
        //保存搜索类型
        set_search_type({ commit }, statu) {
            commit("set_search_type", statu);
        },
        // 保存搜索的是什么球种的赛事列表
        set_search_csid({ commit }, csid) {
            commit("set_search_csid", csid)
        }
    },
    mutations: {
        //保存搜索关键字
        set_search_keyword(state, keyword) {
            state.keyword = 'a'+_.random(1000,9999)+keyword
        },
        //保存联想搜索关键字
        set_related_keyword(state, related_keyword) {
            state.related_keyword = 'a'+_.random(1000,9999)+related_keyword
        },
        //保存搜索的联赛名
        set_click_keyword(state, data) {
            state.search_league_name = data
            state.click_keyword = 'a'+_.random(1000,9999)+data
        },
        //保存显示搜索组件状态
        set_search_status(state, data) {
            state.search_isShow = data
        },
        //保存搜索类型
        set_search_type(state, data) {
            state.search_type = data
        },
        //保存搜索的是什么球种的赛事列表
        set_search_csid(state, data) {
            state.search_csid = data
        },
    }
}
