<!--
 * @Description: 图片缓存 加载组件
-->
<template v-if="show_image">
  <!-- 有缓存图片优先使用缓存图片 @error="league_icon_error" -->
  <img class="team-icon row no-wrap" loading="lazy" decoding="async" :src="image_src" @error="league_icon_error" />
</template>
 
<script setup>
import lodash from 'lodash'
import { onMounted, ref, watch, nextTick } from "vue";
import UserCtr from 'src/core/user-config/user-ctr.js'
import { get_server_file_path } from "src/core/file-path/file-path.js";
// 默认联赛图标
import { none_league_icon, none_league_icon_black, default_league_icon, home_default_avatar, away_default_avatar } from 'src/base-h5/core/utils/local-image'

const props = defineProps({
  // 赛种 id
  csid: {},
  // 图片路径
  path: "",
  //    类型
  type: "",
})

//显示图片
const show_image = ref(false)
// 图片最终路径
const image_src = ref("")
// 图片 默认路径
const default_url = ref("")
// 图片 全路径
const full_path = ref("")
// 主题
const theme = ref("day")

//图标出错 与 记录
const img_error_map = ref({})

onMounted(() => {
  //设置 默认 图片
  set_default_icon();
  check_image_load();
})

watch(() => props.path, () => {
  check_image_load();
})

/**
 * @description: 图标出错时
 * @param {Object} $event 错误事件对象
 */
const league_icon_error = ($event) => {
  image_src.value = load_img_default_by_type(props.type);
  $event.target.onerror = null
}
//  设置主题
const set_default_icon = (val = "night") => {
  // 主题
  theme.value = val;
  // 默认联赛图标
  image_src.value = theme == "night" ? none_league_icon_black : none_league_icon;
}
const check_image_load = () => {
  // 当是数组时显示数组第一个元素
  let path = lodash.isArray(props.path)?lodash.get(props.path,'[0]'):props.path;
  let params = { key: path, csid: props.csid, type: props.type };
  // 检查是否 加载 过 是否 ok  { 0: 第一次加载, 1:加载过 而且成功, -1: 加载过但是已确认 出错 }
  let status = check_if_loaded_img(params);
  // 返回默认图片
  default_url.value = load_img_default_by_type(props.type);
  // 获取图片完整网络路径
  full_path.value = get_server_file_path(path, props.csid);
  // -1   加载过但是已确认 出错
  //0  未加载
  // image_src.value = default_url.value;
  image_src.value = full_path.value;
  show_image.value = true;
  // return
  // 第一次加载   0
  if (!status) {
    load_image_first_time(params);
  } else if (status == -1) {  //  加载过但是已确认 出错 -1
    image_src.value = default_url.value;
    show_image.value = true;
  } else { // 加载过 而且成功 1
    // image_src.value = full_path.value;
    image_src.value = get_img_cache_obj(path);
    show_image.value = true;
  }
}
//  首次加载图片
const load_image_first_time = (params) => {
  //   url= "https://image.girltui.com/group1/M00/00/27/CgURt17qYq-AGLDAAAAcppGYnrQ4571.png"
  let myImage = new Image(100, 200);
  myImage.onload = (event) => {
    // console.log("内存内创建的 图片 加载成功 ------------------");
    // 设置key对应缓存的图片路径
    set_img_cache_obj(props.path, event)
    image_src.value = full_path.value;
    show_image.value = true;
    load_img_success(params);
    nextTick (() => {
      myImage = null;
    });
  };
  myImage.onerror = () => {
    // console.log("内存内创建的 图片 加载 失败 ------------------");
    image_src.value = default_url.value;
    show_image.value = true;
    load_img_error(params);
    nextTick (() => {
      myImage = null;
    });
  };
  // myImage.src = full_path.value;
}
/**
 * 根据类型 返回默认图片
 */
const load_img_default_by_type = (type) => {
  let url = "";
  switch (type) {
    case "away":
      url = away_default_avatar;
      break;
    case "home":
      url = home_default_avatar;
      break;
    case "league":
      url = default_league_icon;
      break;
    default:
      url = default_league_icon;
      break;
  }
  return url;
}
// 检查是否 加载 过 是否 ok
const check_if_loaded_img = (params) => {
  let { key, type, csid } = params;
  // -1   加载过但是已确认 出错
  //0  未加载
  // 1  加载过 而且成功
  return img_error_map.value[`${csid || ""}_${key}`] || 0;
}
// 图片加载错误
const load_img_error = (params) => {
  let { key, type, csid = 0 } = params;
  img_error_map.value[`${csid || ""}_${key}`] = -1;
}
// 图片加载成功 是 1
const load_img_success = (params) => {
  let { key, type, csid = 0 } = params;
  img_error_map.value[`${csid || ""}_${key}`] = 1;
}
/**
 * @description: 获取key对应缓存的图片路径
 * @param {String} key  图片路径
 * @return {String} 返回缓存的路径
 */
const get_img_cache_obj = (key) => {
  // 没有图片缓存的路径就返回空字符串
  let res = '';
  // 判断是否有图片缓存的路径
  if(key && window.img_cache_obj && window.img_cache_obj[props.csid+'_'+key]){
    // 获取图片缓存的路径
    res = window.img_cache_obj[props.csid+'_'+key];
  }
  return res;
}
/**
 * @description: 设置key对应缓存的图片路径
 * @param {String} key  图片路径
 * @param {String} event  dom event事件
 */
const set_img_cache_obj = (key,event) => {
  // 判断src属性是否有图片路径
  if(key && event && event.currentTarget && event.currentTarget.src) {
    // 判断图片缓存对象是否为空,为空时设置空对象
    if(!window.img_cache_obj){
      // 初始化window.img_cache_obj空对象
      window.img_cache_obj = {};
    }
    // 设置缓存的图片,图片的key为球种csid + '_' +图片路径
    window.img_cache_obj[props.csid+'_'+key] = event.currentTarget.src;
  }
}
 
</script>
 
<style scoped lang="scss">
.team-icon {
  width: 0.18rem;
  height: 0.18rem;
  margin-right: 0.06rem;
  flex-shrink: 0;
  justify-content: center;
}
</style>