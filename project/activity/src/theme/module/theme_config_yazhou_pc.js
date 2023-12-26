import {
 
        LOCAL_COMMON_FILE_PREFIX,
        LOCAL_PROJECT_FILE_PREFIX,
      } from "project_path/src/core/index.js";
/**
 * 2021 亚洲版本 PC  活动 主题色专用
 * 项目标识：yazhou_pc
 */
// 主题橙色----日间版   theme01
// 主题橙色----夜间版  theme02
// 主题蓝色----日间版   theme01_y0
// 主题蓝色----夜间版  theme02_y0

// 公用变量
const theme_common = {
  /**文本颜色*/
  "activity-text-color": "#5e637e",
  "activity-text-color-2": "#333333",
  "activity-text-color-3": "#666",
  "activity-text-color-5": "#999",
  "activity-text-color-6": "#e7eaee",
  "activity-text-color-7": "#ff0602",
  "activity-text-color-8": "#fee4b5",
  "activity-text-color-9": "#fffcf4",
  "activity-text-color-10": "#3a3a3a",
  "activity-text-color-11": "#565656",
  "activity-text-color-12": "#000",
  "activity-text-color-13": "#de6f04",
  "activity-text-color-14": "#171616",
  "activity-text-color-15": "#ff8b00",
  "activity-text-color-blue": "#007dff",
  "activity-text-color-gray": "#5e637e",
  "activity-text-color-red": "#e93333",
  "activity-text-color-active": "#fff",
  /**背景颜色*/
  "activity-bg-color": "#fff",
  "activity-bg-color-4": "#e7eaee",
  "activity-bg-color-5": "#fcfcfc",
  "activity-bg-color-6": "#ff0602",
  "activity-bg-color-8": "#6b2200",
  "activity-bg-color-9": "lightyellow",
  "activity-bg-color-10": "#d8d8d8",
  "activity-bg-color-11": "rgba(0, 0, 0, 0.9)",
  "activity-bg-color-12": "rgba(255, 255, 255, 0.8)",
  "activity-bg-color-13": "#fff",
  "activity-bg-color-14": "#a9a9a9",
  "activity-bg-color-15": "#ff4040",

  /**边框颜色 */
  "activity-bd-color": "#fff",
  "activity-bd-color-5": "#e4e4e4",
  "activity-bd-color-6": "#d2d2d2",
  "activity-bd-color-7": "#999",
  "activity-bd-color-9": "#d9d9d9",

  /**渐变色 */
  "activity-bd-img-gradient":
    "linear-gradient(180deg, #ffffff 0%, #f3f3f3 77%, #fafdff 100%)",
  "activity-bd-img-gradient-4":
    "radial-gradient(at 50% 40%, #fff 2px, #a9a9a9 80%)",
  "activity-bd-img-gradient-5":
    "radial-gradient(at 50% 40%, #fff 2px, #ff4040 80%)",
  "activity-bd-img-gradient-6":
    "radial-gradient(at 50% 40%, #fff 2px, deepskyblue 80%)",
  "activity-bd-img-gradient-7":
    "radial-gradient(at 50% 40%, #fff 2px, yellow 80%)",
  "activity-bd-img-gradient-8":
    "linear-gradient(-88deg, #ffffff 0%, #f7f8f9 50%, #ffffff 100%)",
  "activity-bd-img-gradient-9":
    "linear-gradient(268deg, #b05500 0%, #f8c90d 31%, #fff8de 50%, #f8c600 80%, #aa4b00 100%)",

  /**阴影 */
  "activity-box-shadow": "0 1px 8px 0 rgba(0, 0, 0, 0.1)",
  "activity-box-shadow-2": "0 2px 40px 0 rgba(0, 0, 0, 0.1)",
  "activity-box-shadow-3": "lightyellow",
  "activity-box-shadow-4": "rgba(0, 0, 0, 0.3)",
  "activity-box-shadow-5":
    "inset 0px 1px 8px 0px rgba(189, 72, 72, 0.5), 0px 2px 4px 0px rgba(0, 0, 0, 0.27), 0px 2px 7px 0px rgba(0, 0, 0, 0.26), 0px 2px 14px 0px rgba(0, 0, 0, 0.05)",

  /**边框背景渐变色 */
  "activity-bd-img-gradient":
    "linear-gradient(180deg, #ffffff 0%, #f3f3f3 77%, #fafdff 100%)",
  "activity-bd-img-gradient-4":
    "radial-gradient(at 50% 40%, #fff 2px, #a9a9a9 80%)",
  "activity-bd-img-gradient-5":
    "radial-gradient(at 50% 40%, #fff 2px, #ff4040 80%)",
  "activity-bd-img-gradient-6":
    "radial-gradient(at 50% 40%, #fff 2px, deepskyblue 80%)",
  "activity-bd-img-gradient-7":
    "radial-gradient(at 50% 40%, #fff 2px, yellow 80%)",
  "activity-bd-img-gradient-8":
    "linear-gradient(-88deg, #ffffff 0%, #f7f8f9 50%, #ffffff 100%)",
  "activity-bd-img-gradient-9":
    "linear-gradient(268deg, #b05500 0%, #f8c90d 31%, #fff8de 50%, #f8c600 80%, #aa4b00 100%)",

  "activity-bg-margin-top": "0px",
  "activity-margin-top": "0px",

  "activity-text-shadow": "0 2px 4px #e50000, 0 -2px 3px #f0ff04",
  "activity-text-shadow-2": "0 2px 4px rgba(0, 0, 0, 0.5)",

  "activity-drop-shadow": "#ff4040",
  "activity-drop-shadow-2": "deepskyblue",
  "activity-drop-shadow-3": "yellow",
  
    'activity-number-bg': `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/common/number.png)`,
    'activity-get-lottery-bg': `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_lottery_bg.png)`,
    'public-bg-image2': `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/common/no_data_01.png)`,
};
// 主题差异化的
const theme_different = {
  "activity-text-color-4": {
    theme01: "#ff7000",
    theme01_y0: "#179CFF",
    theme02: "#ff7000",
    theme02_y0: "#4276FB",
  },
  "activity-text-color-16": {
    theme01: "#333333",
    theme01_y0: "#ffffff",
    theme02: "#333333",
    theme02_y0: "#ffffff",
  },

  "activity-bg-color-2": {
    theme01: "rgba(255, 112, 0, 0.1)",
    theme01_y0: "#F0F6FF",
    theme02: "rgba(255, 112, 0, 0.1)",
    theme02_y0: "#F0F6FF",
  },
  "activity-bg-color-3": {
    theme01: "#fec59e",
    theme01_y0: "#c3d5f5",
    theme02: "#fec59e",
    theme02_y0: "#c3d5f5",
  },
  "activity-bg-color-7": {
    theme01: "#f77000",
    theme01_y0: "#179CFF",
    theme02: "#f77000",
    theme02_y0: "#179CFF",
  },
  "activity-bd-color-2": {
    theme01: "#fec59e",
    theme01_y0: "#A4BEFE",
    theme02: "#fec59e",
    theme02_y0: "#A4BEFE",
  },
  "activity-bd-color-3": {
    theme01: "#d3d3d3",
    theme01_y0: "transparent",
    theme02: "#d3d3d3",
    theme02_y0: "transparent",
  },
  "activity-bd-color-4": {
    theme01: "#fec59e",
    theme01_y0: "#ddd",
    theme02: "#fec59e",
    theme02_y0: "#ddd",
  },
  "activity-bd-img-gradient-2": {
    theme01: "linear-gradient(180deg, #fff5eb 0%, #ffe3ca 100%)",
    theme01_y0: "linear-gradient(180deg, #FFFFFF 22%, #F7F8FF 100%)",
    theme02: "linear-gradient(180deg, #fff5eb 0%, #ffe3ca 100%)",
    theme02_y0: "linear-gradient(180deg, #FFFFFF 22%, #F7F8FF 100%)",
  },
  "activity-bd-img-gradient-3": {
    theme01: "linear-gradient(180deg, #fbb259 0%, #ff773f 99%)",
    theme01_y0: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
    theme02: "linear-gradient(180deg, #fbb259 0%, #ff773f 99%)",
    theme02_y0: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
  },

  /**tab标签背景渐变色 */
  "activity-tab-bg-img-active": {
    theme01: "linear-gradient(180deg, #ffe8bc 0%, #e79b40 99%)",
    theme01_y0: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
    theme02: "linear-gradient(180deg, #ffe8bc 0%, #e79b40 99%)",
    theme02_y0: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
  },

  "activity-bd-img-gradient-2": {
    theme01: "linear-gradient(180deg, #fff5eb 0%, #ffe3ca 100%)",
    theme01_y0: "linear-gradient(180deg, #FFFFFF 22%, #F7F8FF 100%)",
    theme02: "linear-gradient(180deg, #fff5eb 0%, #ffe3ca 100%)",
    theme02_y0: "linear-gradient(180deg, #FFFFFF 22%, #F7F8FF 100%)",
  },
  "activity-bd-img-gradient-3": {
    theme01: "linear-gradient(180deg, #fbb259 0%, #ff773f 99%)",
    theme01_y0: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
    theme02: "linear-gradient(180deg, #fbb259 0%, #ff773f 99%)",
    theme02_y0: "linear-gradient(180deg, #62B6FF 0%, #3D72FA 100%)",
  },

  /**背景图片 */
  "activity-bd-img-1": {
    theme01: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/title_bg.svg)`,
    theme01_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/title_bg_y0.svg)`,
    theme02: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/title_bg.svg)`,
    theme02_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/title_bg_y0.svg)`,
  },
  "activity-bd-img-2": {
    theme01: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/text-pre.png)`,
    theme01_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/text-pre_y0.svg)`,
    theme02: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/text-pre.png)`,
    theme02_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/text-pre_y0.svg)`,
  },
  "activity-bd-img-3": {
    theme01: `linear-gradient(0deg, #f7f8f8 0%, #e3e3e3 31%, #ffffff 100%)`,
    theme01_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/game_record.png)`,
    theme02: `linear-gradient(0deg, #f7f8f8 0%, #e3e3e3 31%, #ffffff 100%)`,
    theme02_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/game_record.png)`,
  },
  "activity-bd-img-4": {
    theme01: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_all_bonus.svg)`,
    theme01_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_all_bonus_y0.svg)`,
    theme02: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_all_bonus.svg)`,
    theme02_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_all_bonus_y0.svg)`,
  },
  "activity-bd-img-5": {
    theme01: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/waiting.svg)`,
    theme01_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/waiting_y0.svg)`,
    theme02: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/waiting.svg)`,
    theme02_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/waiting_y0.svg)`,
  },
  "activity-bd-img-6": {
    theme01: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/history_list_bg.svg)`,
    theme01_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/game_record.png)`,
    theme02: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/history_list_bg.svg)`,
    theme02_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/game_record.png)`,
  },

  /**按钮背景图 */
  "activity-btn-bg-img1": {
    theme01: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_box.svg)`,
    theme01_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_box_y0.svg)`,
    theme02: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_box.svg)`,
    theme02_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_box_y0.svg)`,
  },
  "activity-btn-bg-img2": {
    theme01: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_bonus_1.svg)`,
    theme01_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_bonus_1_y0.svg)`,
    theme02: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_bonus_1.svg)`,
    theme02_y0: `url(${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/get_bonus_1_y0.svg)`,
  },
};

// 未知的，代码内有用的
const theme_unknown = {
  "activity-bg-img-active": "", //没有找到
};

export default {
  ...theme_common,
  ...theme_different,
  ...theme_unknown,
};
