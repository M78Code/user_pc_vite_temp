import NODE_ENV_CONFIG from "../output/node-env/index.js"
import {format_date  } from "../util-and-config/util.js"
import {PROJECT_ENTRY_CONFIG} from  "../util-and-config/config.js"
import {import_js_data} from  "../util-and-config/write-folder-file.js"
const  DEV_TARGET_ENV_CONFIG= await import_js_data("./dev-target-env.js")
 
const {   DEV_IS_FOR_NEIBU_TEST ,DEV_IS_FOR_BD_DUIJIE } = DEV_TARGET_ENV_CONFIG


//jenkins env 变量  配置的  是否是用于内部测试  是：1 ，否：-1 
let ENV_IS_FOR_NEIBU_TEST= ( process.env.IS_FOR_NEIBU_TEST || "").trim();



//jenkins env 变量  配置的  是否开启BD对接   是：1 ，否：-1 
let ENV_IS_FOR_BD_DUIJIE= ( process.env.IS_FOR_BD_DUIJIE || "").trim();



//解析topic 项目配置 
import {resolve_topic_project_build_type} from "./resolve-topic-project-build-type.js"



/**
 * 计算是否启用 自测模式
 * @param {*} ENVSTR 
 * @returns 
 */
const COMPUTE_IS_FOR_NEIBU_TEST_FN=(ENVSTR)=>{

  //默认 环境 自测开关
const FOR_NEIBU_TEST_MAP = {
  dev: true,
  test: true,
  geli: false,
  mini: false,
  shiwan: false,
  online: false,
};
//代码内预设的环境自测启用情况
 
// 是否是用于内部测试  是：true ，否：false
let IS_FOR_NEIBU_TEST =    false
 
//如果构建参数内有自测参数 并且 值为1 则开启自测
 if(ENV_IS_FOR_NEIBU_TEST==1){
  IS_FOR_NEIBU_TEST =true
 }else{
  //如果构建参数内没有有自测参数
  if(NODE_ENV_CONFIG.IS_DEV){
    //本地开发
    IS_FOR_NEIBU_TEST =  DEV_IS_FOR_NEIBU_TEST   
  }else{
    //如果构建参数内有自测参数 并且 值不为1 则关闭自测
    if(ENV_IS_FOR_NEIBU_TEST){
      IS_FOR_NEIBU_TEST = false
    }else{
    //如果构建参数内没有有自测参数 , 则 使用 代码内预设的环境自测设置
    IS_FOR_NEIBU_TEST =FOR_NEIBU_TEST_MAP[ENVSTR]
    }

  }

 }

 return IS_FOR_NEIBU_TEST

}



 //数字对应的项目
 let  PROJECT_MAP = {}
//客户端主要项目
 let MAIN_PROJECT_ARR=[]
for(let key in PROJECT_ENTRY_CONFIG){
  let pm = PROJECT_ENTRY_CONFIG[key]['value']
  PROJECT_MAP[key] = pm

  if(PROJECT_ENTRY_CONFIG[key]['main_project']){
    MAIN_PROJECT_ARR.push(pm)
  }
}


/**
 * 项目标识解析
 * @param {*} ENVSTR 
 * @returns 
 */
  const RESOLVE_PROJECT_FN = (PROJECT) => {
  //项目 描述和配置 键  
  const PROJECT_ENTRY_CONFIG_KEY = PROJECT
  //布局名字
  const PROJECT_NAME = PROJECT_MAP[PROJECT];
  //布局元信息关键字
  const LAYOUT_META =  PROJECT_ENTRY_CONFIG[PROJECT]['layout_meta'];
  //所有资源项目级别目录
  const ALL_PROJECT = Object.values(PROJECT_MAP);
  //删除布局资源数组
  const NEED_DELETE_PROJECT = ALL_PROJECT.filter((x) => x != PROJECT_NAME);
  //public 目录下  除了项目 PROJECT_NAME 外 其他  二级目录  名称数组，这里的具体命名规范看文档
  const PUBLIC_STATIC_OTHER_DIR= [ 'other-assets']
  // 默认模版名称
  const DEFAULT_VERSION_NAME = ''
  //是客户端主要项目
  const IS_MAIN_PROJECT = MAIN_PROJECT_ARR.includes(PROJECT_NAME)
  //是否是客户端主要项目 的 PC 
  const IS_MAIN_PROJECT_PC = IS_MAIN_PROJECT &&( PROJECT_NAME.includes('pc'))
  //是否是客户端主要项目 的 h5 
  const IS_MAIN_PROJECT_H5 = IS_MAIN_PROJECT &&( PROJECT_NAME.includes('h5'))
  return {
    PROJECT_ENTRY_CONFIG_KEY,
    PROJECT_NAME,
    LAYOUT_META,
    DEFAULT_VERSION_NAME,
    NEED_DELETE_PROJECT,
    PUBLIC_STATIC_OTHER_DIR,
    MAIN_PROJECT_ARR,
    IS_MAIN_PROJECT ,
    IS_MAIN_PROJECT_PC,
    IS_MAIN_PROJECT_H5 
  };
};


/**
 * 环境解析
 * @param {*} ENVSTR 
 * @returns 
 */
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

 


/**
 * 计算是否启用 BD对接
 * @param {*} ENVSTR 
 * @returns 
 */
const  COMPUTE_IS_FOR_BD_DUIJIE_FN=( PROJECT , ENVSTR)=>{

   // 项目判断 



    //BD对接  配置
  let  project_bd_duijie=  PROJECT_ENTRY_CONFIG[PROJECT]['bd_duijie'] ;

  
  if(!project_bd_duijie){ return  false }   


  // 以下 情况 是项目 开启了 BD对接 则 执行环境判断 


  // 环境判断 

    // 是否开启BD对接  是：true ，否：false
    let IS_FOR_BD_DUIJIE =    false 


    
 

  //默认 环境 BD对接开关
  const FOR_BD_DUIJIE_MAP = {
    dev: false,
    test: false,
    geli: false,
    mini: false,
    shiwan: true,
    online: false,
  };
  //代码内预设的环境BD对接启用情况
   

   
  //如果构建参数内有BD对接参数 并且 值为1 则开启BD对接
   if(ENV_IS_FOR_BD_DUIJIE==1){
    IS_FOR_BD_DUIJIE =true
   }else{
    //如果构建参数内没有有BD对接参数
    if(NODE_ENV_CONFIG.IS_DEV){
      //本地开发
      IS_FOR_BD_DUIJIE =  DEV_IS_FOR_BD_DUIJIE   
    }else{
      //如果构建参数内有BD对接参数 并且 值不为1 则关闭BD对接
      if(ENV_IS_FOR_BD_DUIJIE){
        IS_FOR_BD_DUIJIE = false
      }else{
      //如果构建参数内没有有BD对接参数 , 则 使用 代码内预设的环境BD对接设置
      IS_FOR_BD_DUIJIE =FOR_BD_DUIJIE_MAP[ENVSTR]
      }
  
    }
  
   }



  
   return IS_FOR_BD_DUIJIE




}

  

export const RESOLVE_BUILD_VERSION_COMMON_FN=(config)=>{
  
   const  RESOLVE_PROJECT_OBJ  =RESOLVE_PROJECT_FN(config.PROJECT) 
   //布局名字
   const {  PROJECT_NAME } = RESOLVE_PROJECT_OBJ
 
  //是否需要 BUILD_VERSION 版本素材隔离
    const NEED_BUILD_VERSION = config.NEED_BUILD_VERSION
    const VERSION_STR =  NEED_BUILD_VERSION? format_date(new Date().getTime()):'';
    //是否是开发环境
    const IS_DEV = NODE_ENV_CONFIG.IS_DEV 
    //构建版本号
    const BUILD_VERSION=  IS_DEV ? "" : VERSION_STR
    //构建目录名字
    const BUILD_DIR_NAME =config.BUILD_DIR_NAME
    //是否是用于内部测试
    const IS_FOR_NEIBU_TEST  = COMPUTE_IS_FOR_NEIBU_TEST_FN(config.ENVSTR)
    //是否启用 BD对接
    const IS_FOR_BD_DUIJIE =  COMPUTE_IS_FOR_BD_DUIJIE_FN(config.PROJECT,config.ENVSTR)


     
    //打包构建输出目录
    let BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/`+`${BUILD_VERSION?BUILD_VERSION+'/':""}`
    //开发或生产环境服务的公共基础路径
    let BUILD_BASE = IS_DEV ? '/' : (   BUILD_VERSION?`/${BUILD_VERSION}/`:"/" )

    //本地项目内文件  公用的 不带项目标识专用目录的 
    let LOCAL_COMMON_FILE_PREFIX =  BUILD_VERSION ? `/${BUILD_VERSION}` :''
    //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
    let LOCAL_PROJECT_FILE_PREFIX =  BUILD_VERSION ? `/${BUILD_VERSION}/${PROJECT_NAME}` :`/${PROJECT_NAME}`

     //html path  打包后的 html 文件 原地址  
     let BUILD_HTML_FILE_RAW_PATH = `./${BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
     //html path  打包后的 html 文件 需要拷贝 到的 目标地址
     let BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/index.html` 

     

    //原 public 下的 静态素材   打包后的   原地址  
    let   BUILD_STATIC_DIR_PATH =     `./${BUILD_OUTDIR}`
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    let   BUILD_STATIC_DIR_TARGET_PATH =   `./dist/${BUILD_DIR_NAME}${ LOCAL_COMMON_FILE_PREFIX}/` 



    //运维传输目录 
    let  BUILD_YUNWEI_COPY_ROOT_DIR =    `./dist/${BUILD_DIR_NAME}/`


    //是否是主题类项目 域名规则  topic.aa.com/${PROJECT}/
    const {IS_TOPIC_PROJECT =false} = config
    // 主题 top 类的项目 生产 打包 需要再加一层  生产构建必须 有版本缓存 因此一定有 BUILD_VERSION

    if(!IS_DEV&& IS_TOPIC_PROJECT){

   if(!config.TOPIC_PROJECT_BUILD_TYPE_KEY){

    console.error('主题类项目必须设置 ：TOPIC_PROJECT_BUILD_TYPE_KEY');
   }else{

    let params={
      BUILD_DIR_NAME,
      BUILD_VERSION,
      PROJECT_NAME

     }
     // 解析主题项目构建类型标识
    let result =     resolve_topic_project_build_type(config, params)

    //BUILD_OUTDIR：打包构建输出目录  
    BUILD_OUTDIR= result.BUILD_OUTDIR
    //BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 
    BUILD_BASE =   result.BUILD_BASE
    //本地项目内文件  公用的 不带项目标识专用目录的 
    LOCAL_COMMON_FILE_PREFIX =  result.LOCAL_COMMON_FILE_PREFIX
    //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
    LOCAL_PROJECT_FILE_PREFIX =  result.LOCAL_PROJECT_FILE_PREFIX
    //html path  打包后的 html 文件 原地址  
    BUILD_HTML_FILE_RAW_PATH =  result.BUILD_HTML_FILE_RAW_PATH
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    BUILD_HTML_FILE_TARGET_PATH =  result.BUILD_HTML_FILE_TARGET_PATH



    //原 public 下的 静态素材   打包后的   原地址  
    BUILD_STATIC_DIR_PATH =  result.BUILD_STATIC_DIR_PATH  
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    BUILD_STATIC_DIR_TARGET_PATH =  result.BUILD_STATIC_DIR_TARGET_PATH   

 

    //运维传输目录 
    BUILD_YUNWEI_COPY_ROOT_DIR =   result.BUILD_YUNWEI_COPY_ROOT_DIR   



   }
  




}

   
    //原 public 下的 静态素材   打包后的 地址  是否 需要进行改变
const   BUILD_STATIC_DIR_NEED_CHANGE =  BUILD_STATIC_DIR_PATH != BUILD_STATIC_DIR_TARGET_PATH



    return {
       
        ...RESOLVE_ENV_FN(config.ENVSTR),
        ...NODE_ENV_CONFIG,
        ...RESOLVE_PROJECT_OBJ,
        IS_TOPIC_PROJECT,
        IS_FOR_NEIBU_TEST,
        IS_FOR_BD_DUIJIE,
        BUILD_DIR_NAME,
        BUILD_VERSION,
        BUILD_OUTDIR ,
        BUILD_BASE,
        LOCAL_COMMON_FILE_PREFIX,
        LOCAL_PROJECT_FILE_PREFIX,
        BUILD_HTML_FILE_RAW_PATH,
        BUILD_HTML_FILE_TARGET_PATH,
        BUILD_STATIC_DIR_PATH,
        BUILD_STATIC_DIR_TARGET_PATH,
        BUILD_STATIC_DIR_NEED_CHANGE,
        BUILD_YUNWEI_COPY_ROOT_DIR,
    
      



    }
}