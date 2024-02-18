


import {placeholder_const , default_content,normalize_html_config} from  "../common-config.js"


 let config = {
     
    meta1:{
        placeholder: placeholder_const.meta1,
        content:    ''
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
 
 
  




}

export  default  normalize_html_config(config)