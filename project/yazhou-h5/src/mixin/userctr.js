import { watch, onBeforeUnmount, ref } from "vue";
import { UserCtr } from 'src/core/'
const theme = ref(UserCtr.theme)//主题
const lang = ref(UserCtr.lang)//语言
const show_favorite_list = ref(UserCtr.show_favorite_list)//是否收藏
const user_info = ref(UserCtr.user_info || {}) //用户信息
const sort_type = ref(UserCtr.sort_type)    //排序	 int 类型 1 按热门排序 2 按时间排序

//用戶信息變化
const cancel = watch(UserCtr.user_version, () => {
    theme.value = UserCtr.theme;
    lang.value = UserCtr.lang;
    show_favorite_list.value = UserCtr.show_favorite_list;
    user_info.value = UserCtr.user_info;
    sort_type.value = UserCtr.sort_type;
})
onBeforeUnmount(() => cancel())

export {
    theme, lang, show_favorite_list, user_info, sort_type
}