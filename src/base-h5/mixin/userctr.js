import { watch, onBeforeUnmount, ref } from "vue";
import { UserCtr, useMittOn, MITT_TYPES } from 'src/output'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
const theme = ref(UserCtr.theme)//主题
const lang = ref(UserCtr.lang)//语言
const show_favorite_list = ref(UserCtr.show_favorite_list)//是否收藏
const user_info = ref(UserCtr.user_info || {}) //用户信息
const sort_type = ref(UserCtr.sort_type)    //排序	 int 类型 1 按热门排序 2 按时间排序
const standard_edition = ref(UserCtr.standard_edition)//标准版本2  简易版1
const resources_obj = ref(UserCtr.resources_obj)//商户配置的广告信息
const match_mids = ref(MatchMeta.match_mids) // 当前页面赛事列表 mids
const set_menu_init = ref(UserCtr.set_menu_init) // 当前页面赛事列表 mids

//用戶信息變化
const cancel = watch(() => UserCtr.user_version, () => {
    show_favorite_list.value = UserCtr.show_favorite_list;
    user_info.value = UserCtr.user_info;
    sort_type.value = UserCtr.sort_type;
    resources_obj.value = UserCtr.resources_obj
    set_menu_init.value = UserCtr.set_menu_init
})
//有 触发mitt的 可以不用更新版本号
const mitt_list = [
    cancel,
    useMittOn(MITT_TYPES.EMIT_LANG_CHANGE, function () {
        lang.value = UserCtr.lang
    }).off,
    useMittOn(MITT_TYPES.EMIT_THEME_CHANGE, function () {
        theme.value = UserCtr.theme;
    }).off,
    useMittOn(MITT_TYPES.EMIT_STANDARD_EDITION_CHANGE, (v) => {
        standard_edition.value = v
    }).off,
    //通知收藏变化了
    useMittOn(MITT_TYPES.EMIT_FAVORITE_CHANGE_CMD, (v) => {
        show_favorite_list.value = v
    }).off
]

// onBeforeUnmount(() => {
//     mitt_list.forEach(i => i())
// })

export {
    theme, lang, show_favorite_list, user_info, sort_type, standard_edition, resources_obj, match_mids,set_menu_init
}