import { get_search_result } from "src/api/module/search"
import { reactive } from "vue"
import search from "src/core/search-class/search.js"
import { api_search } from "src/api/index.js";

import lodash from "lodash";


export const store = reactive({
    keyword: '',
    show_type: 'init', /** 显示类型 */
    search_csid: 1,
    sports_list: [], /** 球种列表 */
    sports_tab_index: 0, /** 球种tab选中索引 */
    res_list: [],
    load_data_state: 'data'
})

export class mutations {
    // 搜索结果
    static get_search_result_handle() {
        search.get_search_result(store.keyword, store.search_csid).then(res => {
            console.log('search.get_search_result', res)
            const { state, list } = res
            store.res_list = list
            store.show_type = 'result'
            store.load_data_state = state
        })
    }
    // 获取球种
    static get_sports_list_handle() {
        let csid = ''
        api_search.get_search_sport().then(res => {
            if (lodash.get(res, 'code') == 200) {
                const list = lodash.get(res, 'data') || []
                // 根据商户过滤篮球赛事
                store.sports_list = list
                // 默认第一个 足球被禁用后 默认值不是1
                store.search_csid = (list[0] || {}).id
                if (csid) {
                    store.sports_list.forEach((item, index) => {
                        if (csid == item.id) {
                            set_sports_tab_index(index)
                        }
                    })
                }
            } else {
                store.sports_list = []
            }
        }).catch(err => {
            console.error(err);
            store.sports_list = []
        });
    }
    // 设置球种类型
    static set_sports_handle(index) {
        let index_ = index;
        if (typeof (index) == 'object') {
            index_ = index.index;
        }
        store.sports_tab_index = index_
        store.search_csid = store.sports_list[index_].id
    }

    static clear_handle() {
        store.keyword = ''
        store.show_type = 'init'
    }
}