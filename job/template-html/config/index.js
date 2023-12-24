

import BUILD_VERSION_CONFIG from "../../output/version/build-version.js";
let { PROJECT_NAME, IS_PC } = BUILD_VERSION_CONFIG;
 import activity_config from  "./mondule/activity.js"
 import app_h5_config from  "./mondule/app-h5.js"
 import ouzhou_h5_config from  "./mondule/ouzhou-h5.js"
 import ouzhou_pc_config from  "./mondule/ouzhou-pc.js"
import {default_all_placeholder_obj}from  "./config.js"
 




// project/ouzhou-pc/index.html
// project/ouzhou-h5/index.html
// project/yazhou-pc/index.html
// project/yazhou-h5/index.html
// project/new-pc/index.html
// project/app-h5/index.html
// project/activity/index.html
// project/animation/index.html
// project/template-project/index.html
// 这几个入口文件  这些自动生成 ， 不要在 project/*/index.html 改代码


 


export const html_config=   {
     'activity':activity_config,
     'app-h5':app_h5_config,
     'ouzhou-h5':ouzhou_h5_config,
     'ouzhou-pc':ouzhou_pc_config,
     'default-key':default_all_placeholder_obj
}

export  const config_key = PROJECT_NAME