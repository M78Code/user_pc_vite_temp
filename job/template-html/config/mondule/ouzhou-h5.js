

import {placeholder_const , default_content} from  "../config.js"
export default {
     
    meta1:{
        placeholder: placeholder_const.meta1,
        content:    default_content.meta1
     },
     style1:{
        placeholder: placeholder_const.style1,
        content:`      .theme-1-root-loading #loading-root-main {
            color: rgba(255, 112, 0, 0.8);
          }
          .theme-1_y0-root-loading #loading-root-main {
            color: rgba(255, 112, 0, 0.8);
          }
          .theme-2-root-loading #loading-root-main {
            color: rgba(255, 112, 0, 0.8);
          }
          .theme-2_y0-root-loading #loading-root-main {
            color: rgba(255, 112, 0, 0.8);
          }
          html{
            font-size: 100px; height: 100%
          }
    `
     },
 
     script1:{
        placeholder: placeholder_const.script1,
        // 动态计算rem
        content: '<script src="%VITE_APP_LOCAL_COMMON_FILE_PREFIX%/other-assets/lib/js/rem.js"></script>'
     }





}