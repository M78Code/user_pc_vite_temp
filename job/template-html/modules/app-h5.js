

import {placeholder_const , default_content,normalize_html_config} from  "../common-config.js"


 let config = {
     
 
     style1:{
        placeholder: placeholder_const.style1,
        content:`      .theme-1-root-loading #loading-root-main {
            color: rgba(23,156,255,0.5);
          }
          .theme-1_y0-root-loading #loading-root-main {
            color: rgba(23,156,255,0.5);
          }
          .theme-2-root-loading #loading-root-main {
            color: rgba(23,156,255,0.5);
          }
          .theme-2_y0-root-loading #loading-root-main {
            color: rgba(23,156,255,0.5);
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
      },
   



}



export  default  normalize_html_config(config)