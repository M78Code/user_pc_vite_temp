import { SessionStorage } from "src/core/";
import { ref } from 'vue'
import { debounce } from "lodash";
const history_key = 'SearchHistory'
class SearchClass {
    search_txt = ''; // 上一次搜索文本
    cur_csid = '1'; // 联赛的id
    search_term = SessionStorage.get(history_key, []) // 搜索 去到 详情页的记录
    update_time = ref(Date.now())
    update = debounce(() => {
        this.update_time = Date.now()
    })
    set_search_txt(search_txt) {
        this.search_txt = search_txt;
        this.update()
    }
    set_cur_csid(v) {
        this.cur_csid = v;
        this.update()
    }
    set_search_term(v) {
        this.search_term = v;
        SessionStorage.set(history_key, v);
        this.update()
    }
}
const _SearchClass = new SearchClass()
export default _SearchClass;
