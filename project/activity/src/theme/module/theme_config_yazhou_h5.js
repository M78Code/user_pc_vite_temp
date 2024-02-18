import {
 
  LOCAL_COMMON_FILE_PREFIX,
  LOCAL_PROJECT_FILE_PREFIX,
} from "project_path/src/core/index.js";
/**
 * 2021 亚洲版本 H5  活动 主题色专用  
 * 项目标识：yazhou_h5
 */
// 主题橙色----日间版   theme01
// 主题橙色----夜间版  theme02
// 主题蓝色----日间版   theme01_y0
// 主题蓝色----夜间版  theme02_y0
// 公用变量
const theme_common = {
  // 渐变背景图和背景图片
  "com-img-bg-117": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/waiting.svg)`,
  "com-img-bg-117": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/waiting.svg)`,
  "com-img-bg-118": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/history_list_bg.png)`,
  "com-img-bg-119": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/title-bg.svg)`,
  "com-img-bg-120": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/waiting_y0.svg)`,
  "com-img-bg-121": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/smaller_y0.png)`,
  "com-img-bg-122": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/slot_machine_bg.jpg)`,
  "com-img-bg-124": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/title-bg_y0.png)`,
  "com-img-bg-125": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/title-bg_y0.svg)`,
  "com-img-bg-131": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/maintain_main/maintain_bg.jpg)`,
  "com-img-bg-148": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/activity-header_slot.png)`,
  "com-img-bg-149": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/bg.png)`,
  "com-img-bg-150": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/bg2.png)`,
  "com-img-bg-151": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/star_bg.png)`,
  "com-img-bg-152": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/ring.png)`,
  "com-img-bg-153": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/star.png)`,
  "com-img-bg-154": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/danshan1.png)`,
  "com-img-bg-155": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/danshan2.png)`,
  "com-img-bg-156": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/quanshan1.png)`,
  "com-img-bg-157": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/quanshan2.png)`,
  "com-img-bg-158": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/bitmap.png)`,
  "com-img-bg-159": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/synthesis_bg.png)`,
  "com-img-bg-160": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/dialog_bg.png)`,
  "com-img-bg-161": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/diamond_active.png)`,
  "com-img-bg-162": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/gold_active.png)`,
  "com-img-bg-163": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/silver_active.png)`,
  "com-img-bg-164": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/luck-title.png)`,
  "com-img-bg-165": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/lucky/gift_bg.png)`,
  "com-img-bg-166": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/numbers/0.png)`,
  "com-img-bg-167": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/slider_bg.png)`,
  "com-img-bg-168": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/slider_btn.png)`,
  "com-img-bg-210": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/numbers/1.png)`,
  "com-img-bg-211": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/numbers/2.png)`,
  "com-img-bg-212": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/numbers/3.png)`,
  "com-img-bg-213": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/numbers/4.png)`,
  "com-img-bg-214": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/numbers/5.png)`,
  "com-img-bg-215": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/numbers/6.png)`,
  "com-img-bg-216": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/numbers/7.png)`,
  "com-img-bg-217": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/numbers/8.png)`,
  "com-img-bg-218": `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/slot_machine/numbers/9.png)`,
};



// 主题差异化的 
const theme_different = {
  "activity-text-color-4": {
    theme01: "#ff7000",
    theme01_y0: "#179CFF",
    theme02: "#ff7000",
    theme02_y0: "#4276FB",
  },
  "activity-bg-color-7": {
    theme01: "#f77000",
    theme01_y0: "#179CFF",
    theme02: "#f77000",
    theme02_y0: "#179CFF",
  },
  "img-bg-99": {
    theme01: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/smaller.png)`,
    theme02: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/smaller.png)`,
    theme01_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/smaller_y0.png)`,
    theme02_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/smaller_y0.png)`,
  },
};
// 未知的，代码内有用的  
const theme_unknown = {
  "activity-text-gray": "",
  "bg-image-url3": "",
  "bg-image-url51": "",
  "check-wrap-active-color": "",
  "match-bg-color11": "",
  "match-bg-color13": "",
  "match-icon-color1": "",
  "menu-bg-image1": "",
  "theme-bg-details_loading": "",
  "theme-bg-menu-toggle-btn": "",
  "y0-bg-color20_1": "",
  "y0-btn-hover": "",
  "yb-bg-color1": "",
  "yb-text-color1": "",
};


export default {
  ...theme_common,
  ...theme_different,
  ...theme_unknown,

}