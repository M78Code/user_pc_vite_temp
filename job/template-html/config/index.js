

import BUILD_VERSION_CONFIG from "../../output/version/build-version.js";
let { PROJECT_NAME, IS_PC } = BUILD_VERSION_CONFIG;



let  config_h5 ={
     
     meta:{
        placeholder:'[[[[[meta]]]]]',
        content:   `
        <meta name="msapplication-tap-highlight" content="no" />
    
        <meta name="apple-mobile-web-app-capable" content="no" />
        <meta name="hid-api" content="%VITE_APP_hidApi%" />
        <!-- <meta name="apple-mobile-web-app-capable" content="yes" /> -->
        <!-- uc强制竖屏 -->
        <meta name="screen-orientation" content="portrait" />
        <!-- QQ强制竖屏 -->
        <meta name="x5-orientation" content="portrait" />
        <!-- UC强制全屏 -->
        <meta name="full-screen" content="yes" />
        <!-- QQ强制全屏 -->
        <meta name="x5-fullscreen" content="true" />
        <!-- UC应用模式 -->
        <meta name="browsermode" content="application" />
        <!-- QQ应用模式 -->
        <meta name="x5-page-mode" content="app" />
        <!-- windows phone 点击无高光  -->
        <meta name="msapplication-tap-highlight" content="no" />
        `
     }


}


let  config_pc ={
    meta:{
        placeholder:'[[[[[meta]]]]]',
        content: ""
    },
}


export const html_config=   {
    config_h5,
    config_pc
}

export  const config_key = 'config_h5'