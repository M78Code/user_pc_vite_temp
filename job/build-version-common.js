import NODE_ENV_CONFIG from "./output/node-env/index.js"
  const RESOLVE_PROJECT_FN = (PROJECT) => {
  //数字对应的项目
  const PROJECT_MAP = {
    // project_1: "-", //亚洲版 H5（旧版）
    // project_2: "-", //亚洲版 PC（旧版）
    project_3: "yazhou-h5", //亚洲版 H5（新版)
    project_4: "yazhou-pc", //亚洲版 PC（新版)
    project_5: "app-h5", // 复刻版 H5 - KYAPP
    project_6: "new-pc", // 亚洲版 pc 202310 新平坦化版本
    project_7: "ouzhou-pc", // 欧洲版-PC
    project_8: "ouzhou-h5", // 欧洲版-H5
    activity: "activity", // 活动
    animation: "animation", // 动画
  };
  //布局名字
  const PROJECT_NAME = PROJECT_MAP[PROJECT];
  //所有资源项目级别目录
  const ALL_PROJECT = Object.values(PROJECT_MAP);
  //删除布局资源数组
  const NEED_DELETE_PROJECT = ALL_PROJECT.filter((x) => x != PROJECT_NAME);
  return {
    PROJECT_NAME,
    NEED_DELETE_PROJECT,
  };
};



  const  RESOLVE_ENV_FN =(ENVSTR)=>{
//参数内环境和代码内环境映射
const ENVSTR_MAP = {
    dev: "local_dev",
    test: "local_test",
    geli: "idc_lspre",
    mini: "idc_ylcs",
    shiwan: "idc_sandbox",
    online: "idc_online",
  };
  
  //当前环境
  const CURRENT_ENV = ENVSTR_MAP[ENVSTR];
  // oss
  const OSS_FILE_MAP = {
    dev: "dev.json",
    test: "test.json",
    geli: "lspre.json",
    mini: "mini.json",
    shiwan: "play.json",
    online: "prod.json",
  };
  //oss文件名字
  const OSS_FILE_NAME = OSS_FILE_MAP[ENVSTR]
  return {
    CURRENT_ENV,
    OSS_FILE_NAME,
  };
}

 
 const format_date=(value)=>{
    let time = new Date(parseInt(value));
    let y = time.getFullYear();
    let m = (time.getMonth() + 1 + "").padStart(2, 0);
    let d = (time.getDate() + "").padStart(2, 0);
    let h = (time.getHours() + "").padStart(2, 0);
    let mm = (time.getMinutes() + "").padStart(2, 0);
    let s = (time.getSeconds() + "").padStart(2, 0);
    return `${y}-${m}-${d}-${h}-${mm}-${s}`;
  }


  

export const RESOLVE_BUILD_VERSION_COMMON_FN=(config)=>{
    const VERSION_STR = format_date(new Date().getTime());
    //是否是开发环境
    const IS_DEV = NODE_ENV_CONFIG.IS_DEV 
    //构建版本号
    const BUILD_VERSION=  IS_DEV ? "" : VERSION_STR
    //构建目录名字
    const BUILD_DIR_NAME =config.BUILD_DIR_NAME
    //打包构建输出目录
    const BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/${BUILD_VERSION}` 
    //开发或生产环境服务的公共基础路径
    const BUILD_BASE = IS_DEV ? '/' : `/${BUILD_VERSION}/`
    return {
        ...RESOLVE_PROJECT_FN(config.PROJECT),
        ...RESOLVE_ENV_FN(config.ENVSTR),
        ...NODE_ENV_CONFIG,
        BUILD_DIR_NAME,
        BUILD_VERSION,
        BUILD_OUTDIR ,
        BUILD_BASE


    }
}