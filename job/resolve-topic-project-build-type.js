/**
 * 
 * TOPIC项目-主题项目
 * http://doc-web.sportxxxkd1.com/#/main/detail?type=doc&id=658002a20005654fb90abad1
 * 域名类似：topic.ss.com/topic-key/layout-key/content-key
 * 域名规则：topic.根域/主题键/布局键/（内容键 ： 不一定有，根据情况来）
 * 
 * 
 * 其他 非 user-pc-vite 项目内的 topic 项目 无  LOCAL_COMMON_FILE_PREFIX  ，只有  LOCAL_PROJECT_FILE_PREFIX
 * 
 * 主题项目构建类型标识  和      是否需要 BUILD_VERSION 版本素材隔离 的 配置 对应关系
 * TOPIC_PROJECT_BUILD_TYPE_KEY 和   NEED_BUILD_VERSION 的 配置 对应关系
 * 
 * 【【 TOPIC_PROJECT_BUILD_TYPE_KEY= "TOPIC_PROJECT_BUILD_TYPE_1"   NEED_BUILD_VERSION=true   】】  
 * 【【 TOPIC_PROJECT_BUILD_TYPE_KEY= "TOPIC_PROJECT_BUILD_TYPE_2"   NEED_BUILD_VERSION=fale   】】  
 * 【【 TOPIC_PROJECT_BUILD_TYPE_KEY= "TOPIC_PROJECT_BUILD_TYPE_3"   NEED_BUILD_VERSION=false  】】  
 * 【【 TOPIC_PROJECT_BUILD_TYPE_KEY= "TOPIC_PROJECT_BUILD_TYPE_4"   NEED_BUILD_VERSION=true   】】  
 * 【【 TOPIC_PROJECT_BUILD_TYPE_KEY= "TOPIC_PROJECT_BUILD_TYPE_5"   NEED_BUILD_VERSION=true   】】  
 * 【【 TOPIC_PROJECT_BUILD_TYPE_KEY= "TOPIC_PROJECT_BUILD_TYPE_6"   NEED_BUILD_VERSION=true   】】  
 * 【【 TOPIC_PROJECT_BUILD_TYPE_KEY= "TOPIC_PROJECT_BUILD_TYPE_7"   NEED_BUILD_VERSION=false  】】
 * 【【 TOPIC_PROJECT_BUILD_TYPE_KEY= "TOPIC_PROJECT_BUILD_TYPE_8"   NEED_BUILD_VERSION=true   】】
 * 【【 TOPIC_PROJECT_BUILD_TYPE_KEY= "TOPIC_PROJECT_BUILD_TYPE_9"   NEED_BUILD_VERSION=true   】】
 * 【【 TOPIC_PROJECT_BUILD_TYPE_KEY= "TOPIC_PROJECT_BUILD_TYPE_10"   NEED_BUILD_VERSION=true  】】
 * 
 * 
 */





let  all_resolve_fn={}


all_resolve_fn.resolve_topic_project_build_type_1=(config,params,result)=>{
    const {
        //主题项目布局标识  
        TOPIC_PROJECT_LAYOUT_KEY , 
        //主题项目内容标识 
        TOPIC_PROJECT_CONTENT_KEY ,
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
  
        } = config

        let {
            BUILD_DIR_NAME,
            BUILD_VERSION,
            PROJECT_NAME
      
      
           } =params


    
    // 场景标识  TOPIC_PROJECT_BUILD_TYPE_1
    //  场景一： 所有素材最终在单次打包的版本目录下 ，区分版本
    //          需要全素材版本隔离
    //          如果确认只会有一个版本可以采用这种方案

    result.BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/${BUILD_VERSION}/`
    // BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 

    result.BUILD_BASE = `/${BUILD_DIR_NAME}/${BUILD_VERSION}/` 
     
    // //本地项目内文件  公用的 不带项目标识专用目录的 
    result.LOCAL_COMMON_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${BUILD_VERSION}`  
    // //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
    result.LOCAL_PROJECT_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${BUILD_VERSION}/${PROJECT_NAME}`  



    //html path  打包后的 html 文件 原地址  
    result.BUILD_HTML_FILE_RAW_PATH = `./${result.BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    result.BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/index.html` 
    

    //原 public 下的 静态素材   打包后的   原地址  
    result.BUILD_STATIC_DIR_PATH = `./${result.BUILD_OUTDIR}`
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    result.BUILD_STATIC_DIR_TARGET_PATH = `./dist${result.LOCAL_COMMON_FILE_PREFIX}/`
    
 
    //运维传输目录 
    result.BUILD_YUNWEI_COPY_ROOT_DIR = `./dist/${BUILD_DIR_NAME}/`


}




all_resolve_fn.resolve_topic_project_build_type_2=(config,params,result)=>{
    const {
        //主题项目布局标识  
        TOPIC_PROJECT_LAYOUT_KEY , 
        //主题项目内容标识 
        TOPIC_PROJECT_CONTENT_KEY ,
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
  
        } = config

        let {
            BUILD_DIR_NAME,
            BUILD_VERSION,
            PROJECT_NAME
      
      
           } =params


    
    // 场景标识  TOPIC_PROJECT_BUILD_TYPE_2
    //  场景一： 所有素材最终在单次打包的目录下 ，不区分版本
    //          需要全素材版本隔离
    //          如果确认只会有一个版本可以采用这种方案

  

    result.BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}`
    // BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 

    result.BUILD_BASE =     `/${BUILD_DIR_NAME}/` 
     
    // //本地项目内文件  公用的 不带项目标识专用目录的 
    result.LOCAL_COMMON_FILE_PREFIX =   `/${BUILD_DIR_NAME}`  
    // //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
    result.LOCAL_PROJECT_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${PROJECT_NAME}`  

    //html path  打包后的 html 文件 原地址  
    result.BUILD_HTML_FILE_RAW_PATH = `./${result.BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    result.BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/index.html` 

 
    //原 public 下的 静态素材   打包后的   原地址  
    result.BUILD_STATIC_DIR_PATH = `./${result.BUILD_OUTDIR}`
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    result.BUILD_STATIC_DIR_TARGET_PATH =`./dist${result.LOCAL_COMMON_FILE_PREFIX}/`
    
 

    //运维传输目录 
    result.BUILD_YUNWEI_COPY_ROOT_DIR = `./dist/${BUILD_DIR_NAME}/`


}






all_resolve_fn.resolve_topic_project_build_type_3=(config,params,result)=>{
    const {
        //主题项目布局标识  
        TOPIC_PROJECT_LAYOUT_KEY , 
        //主题项目内容标识 
        TOPIC_PROJECT_CONTENT_KEY ,
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
  
        } = config
  
        let {
            BUILD_DIR_NAME,
            BUILD_VERSION,
            PROJECT_NAME
      
      
           } =params
  
  
        
    // 场景标识  TOPIC_PROJECT_BUILD_TYPE_3  只有布局差异 
    
    //  场景：  js 和 css素材在单次打包的目录下 ，不做版本隔离 ，
    //           删除单个布局版本打包的静态素材，
    //           拷贝提升原代码内的这个项目的静态素材到  外层（topic.根域/activity/）公用  ，不区分版本号 ，不做静态素材版本隔离 
    //           如果确认有多个版本 并且符合上述 特征 可以采用这种方案
    //  打包后 所有 项目级别  BUILD_OUTDIR   目录下的 静态素材（原public 目录下 拷贝过来的 ） 需要删除
    //  打包完成后 需要 拷贝 原public 目录下的这个项目的静态素材 到 dist/activity/activity/内

  
  

    result.BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/` 
    //BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 

    result.BUILD_BASE =   `/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/` 
  
  
   //本地项目内文件  公用的 不带项目标识专用目录的 
   result.LOCAL_COMMON_FILE_PREFIX =   `/${BUILD_DIR_NAME}`  
   //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
   result.LOCAL_PROJECT_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${PROJECT_NAME}`  
  
  
    //html path  打包后的 html 文件 原地址  
    result.BUILD_HTML_FILE_RAW_PATH = `./${result.BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    result.BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/index.html` 
  

     
    //原 public 下的 静态素材   打包后的   原地址  
    result.BUILD_STATIC_DIR_PATH = `./${result.BUILD_OUTDIR}`
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    result.BUILD_STATIC_DIR_TARGET_PATH = `./dist${result.LOCAL_COMMON_FILE_PREFIX}/`
    


    //运维传输目录 
    result.BUILD_YUNWEI_COPY_ROOT_DIR = `./dist/${BUILD_DIR_NAME}/`
  }
  
  
  
  
  all_resolve_fn.resolve_topic_project_build_type_4=(config,params,result)=>{
    const {
        //主题项目布局标识  
        TOPIC_PROJECT_LAYOUT_KEY , 
        //主题项目内容标识 
        TOPIC_PROJECT_CONTENT_KEY ,
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
  
        } = config
  
        let {
            BUILD_DIR_NAME,
            BUILD_VERSION,
            PROJECT_NAME
      
      
           } =params
  
  
        
    // 场景标识  TOPIC_PROJECT_BUILD_TYPE_4  只有布局差异 
  
    //  场景：  js 和 css素材在单次打包的目录下 ，不做版本隔离 ，
    //           删除单个布局版本打包的静态素材，
    //           拷贝提升原代码内的这个项目的静态素材到  外层（topic.根域/activity/版本号/）公用  ，区分版本号 ，做静态素材版本隔离 
    //           如果确认有多个版本 并且符合上述 特征 可以采用这种方案
    //  打包后 所有 项目级别  BUILD_OUTDIR   目录下的 静态素材（原public 目录下 拷贝过来的 ） 需要删除
    //  打包完成后 需要 拷贝 原public 目录下的这个项目的静态素材 到  dist/${BUILD_DIR_NAME}/ 内

  
  

    result.BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/` 
    //BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 

    result.BUILD_BASE =   `/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/` 
  
  
   //本地项目内文件  公用的 不带项目标识专用目录的 
   result.LOCAL_COMMON_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${BUILD_VERSION}`  
   //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
   result.LOCAL_PROJECT_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${BUILD_VERSION}/${PROJECT_NAME}`  
  
  
  
    //html path  打包后的 html 文件 原地址  
    result.BUILD_HTML_FILE_RAW_PATH = `./${result.BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    result.BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/index.html` 
  
  
     
    //原 public 下的 静态素材   打包后的   原地址  
    result.BUILD_STATIC_DIR_PATH = `./${result.BUILD_OUTDIR}`
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    result.BUILD_STATIC_DIR_TARGET_PATH = `./dist${result.LOCAL_COMMON_FILE_PREFIX}/`
    


    //运维传输目录 
    result.BUILD_YUNWEI_COPY_ROOT_DIR = `./dist/${BUILD_DIR_NAME}/`

  
  }
  
  
  
  
  
  
  
  
  all_resolve_fn.resolve_topic_project_build_type_5=(config,params,result)=>{
    const {
        //主题项目布局标识  
        TOPIC_PROJECT_LAYOUT_KEY , 
        //主题项目内容标识 
        TOPIC_PROJECT_CONTENT_KEY ,
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
  
        } = config
  
        let {
            BUILD_DIR_NAME,
            BUILD_VERSION,
            PROJECT_NAME
      
      
           } =params
  
  
  
  
    // 场景标识  TOPIC_PROJECT_BUILD_TYPE_5  只有布局差异 
  
    //  场景：  js 和 css素材在单次打包的目录下 ， 做版本隔离 ，
    //           删除单个布局版本打包的静态素材，
    //           拷贝提升原代码内的这个项目的静态素材到  外层（topic.根域/activity/）公用  ，不区分版本号 ，不做静态素材版本隔离 
    //           如果确认有多个版本 并且符合上述 特征 可以采用这种方案
    //  打包后 所有 项目级别  dist/activity/activity/${TOPIC_PROJECT_LAYOUT_KEY}/${BUILD_VERSION}/   目录下的 静态素材（原public 目录下 拷贝过来的 ） 需要删除
    //  打包完成后 需要 拷贝 原public 目录下的这个项目的静态素材 到 dist/activity/activity/2023-12-18-18-11-48/ 内

  
  

    result.BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${BUILD_VERSION}/` 
    //BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 

    result.BUILD_BASE =   `/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${BUILD_VERSION}/`  
  
  
   //本地项目内文件  公用的 不带项目标识专用目录的 
   result.LOCAL_COMMON_FILE_PREFIX =   `/${BUILD_DIR_NAME}`  
   //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
   result.LOCAL_PROJECT_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${PROJECT_NAME}`  
  
  
  
    //html path  打包后的 html 文件 原地址  
    result.BUILD_HTML_FILE_RAW_PATH = `./${result.BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    result.BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/index.html` 
  


      
     
    //原 public 下的 静态素材   打包后的   原地址  
    result.BUILD_STATIC_DIR_PATH = `./${result.BUILD_OUTDIR}`
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    result.BUILD_STATIC_DIR_TARGET_PATH = `./dist${result.LOCAL_COMMON_FILE_PREFIX}/`
    


    //运维传输目录 
    result.BUILD_YUNWEI_COPY_ROOT_DIR = `./dist/${BUILD_DIR_NAME}/`
    
  
  }
  
  
  
  
  
  
  all_resolve_fn.resolve_topic_project_build_type_6=(config,params,result)=>{
    const {
        //主题项目布局标识  
        TOPIC_PROJECT_LAYOUT_KEY , 
        //主题项目内容标识 
        TOPIC_PROJECT_CONTENT_KEY ,
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
  
        } = config
  
        let {
            BUILD_DIR_NAME,
            BUILD_VERSION,
            PROJECT_NAME
      
      
           } =params
  
  
  
  
    // 场景标识  TOPIC_PROJECT_BUILD_TYPE_6 只有布局差异 
  
    //  场景：  js 和 css素材在单次打包的目录下 ， 做版本隔离 ，
    //           删除单个布局版本打包的静态素材，
    //           拷贝提升原代码内的这个项目的静态素材到  外层（topic.根域/activity/版本号/）公用  ，区分版本号 ，做静态素材版本隔离 
    //           如果确认有多个版本 并且符合上述 特征 可以采用这种方案
    //  打包后 所有 项目级别  dist/activity/activity/${TOPIC_PROJECT_LAYOUT_KEY}/${BUILD_VERSION}/   目录下的 静态素材（原public 目录下 拷贝过来的 ） 需要删除
    //  打包完成后 需要 拷贝 原public 目录下的这个项目的静态素材 到 dist/activity/activity/2023-12-18-18-11-48/ 内

  
  

    result.BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${BUILD_VERSION}/` 
    //BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 

    result.BUILD_BASE =   `/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${BUILD_VERSION}/`  
  
  
   //本地项目内文件  公用的 不带项目标识专用目录的 
   result.LOCAL_COMMON_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${BUILD_VERSION}`  
   //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
   result.LOCAL_PROJECT_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${BUILD_VERSION}/${PROJECT_NAME}`  
  
    //html path  打包后的 html 文件 原地址  
    result.BUILD_HTML_FILE_RAW_PATH = `./${result.BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    result.BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/index.html` 
  
  
  
      
    //原 public 下的 静态素材   打包后的   原地址  
    result.BUILD_STATIC_DIR_PATH = `./${result.BUILD_OUTDIR}`
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    result.BUILD_STATIC_DIR_TARGET_PATH = `./dist${result.LOCAL_COMMON_FILE_PREFIX}/`
    


    //运维传输目录 
    result.BUILD_YUNWEI_COPY_ROOT_DIR = `./dist/${BUILD_DIR_NAME}/`
    
  
  
  }
  
  
  
  




















all_resolve_fn.resolve_topic_project_build_type_7=(config,params,result)=>{
    const {
        //主题项目布局标识  
        TOPIC_PROJECT_LAYOUT_KEY , 
        //主题项目内容标识 
        TOPIC_PROJECT_CONTENT_KEY ,
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
  
        } = config

        let {
            BUILD_DIR_NAME,
            BUILD_VERSION,
            PROJECT_NAME
      
      
           } =params


        
    // 场景标识  TOPIC_PROJECT_BUILD_TYPE_7

    //  场景：  js 和 css素材在单次打包的目录下 ，不做版本隔离 ，
    //           删除单个布局版本打包的静态素材，
    //           拷贝提升原代码内的这个项目的静态素材到  外层（topic.根域/activity/）公用  ，不区分版本号 ，不做静态素材版本隔离 
    //           如果确认有多个版本 并且符合上述 特征 可以采用这种方案
    //  打包后 所有 项目级别  dist/activity/activity/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/   目录下的 静态素材（原public 目录下 拷贝过来的 ） 需要删除
    //  打包完成后 需要 拷贝 原public 目录下的这个项目的静态素材 到 dist/activity/activity/内

  
 

    result.BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/` 
    //BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 

    result.BUILD_BASE =   `/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/` 


   //本地项目内文件  公用的 不带项目标识专用目录的 
   result.LOCAL_COMMON_FILE_PREFIX =   `/${BUILD_DIR_NAME}`  
   //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
   result.LOCAL_PROJECT_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${PROJECT_NAME}`  


    //html path  打包后的 html 文件 原地址  
    result.BUILD_HTML_FILE_RAW_PATH = `./${result.BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    result.BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/index.html` 


      
      
    //原 public 下的 静态素材   打包后的   原地址  
    result.BUILD_STATIC_DIR_PATH = `./${result.BUILD_OUTDIR}`
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    result.BUILD_STATIC_DIR_TARGET_PATH = `./dist${result.LOCAL_COMMON_FILE_PREFIX}/`
    


    //运维传输目录 
    result.BUILD_YUNWEI_COPY_ROOT_DIR = `./dist/${BUILD_DIR_NAME}/`

}




all_resolve_fn.resolve_topic_project_build_type_8=(config,params,result)=>{
    const {
        //主题项目布局标识  
        TOPIC_PROJECT_LAYOUT_KEY , 
        //主题项目内容标识 
        TOPIC_PROJECT_CONTENT_KEY ,
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
  
        } = config

        let {
            BUILD_DIR_NAME,
            BUILD_VERSION,
            PROJECT_NAME
      
      
           } =params


        
    // 场景标识  TOPIC_PROJECT_BUILD_TYPE_8

    //  场景：  js 和 css素材在单次打包的目录下 ，不做版本隔离 ，
    //           删除单个布局版本打包的静态素材，
    //           拷贝提升原代码内的这个项目的静态素材到  外层（topic.根域/activity/版本号/）公用  ，区分版本号 ，做静态素材版本隔离 
    //           如果确认有多个版本 并且符合上述 特征 可以采用这种方案
    //  打包后 所有 项目级别  dist/activity/activity/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/   目录下的 静态素材（原public 目录下 拷贝过来的 ） 需要删除
    //  打包完成后 需要 拷贝 原public 目录下的这个项目的静态素材 到 dist/activity/activity/2023-12-18-18-11-48/ 内

  
 

    result.BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/` 
    //BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 

    result.BUILD_BASE =   `/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/` 


   //本地项目内文件  公用的 不带项目标识专用目录的 
   result.LOCAL_COMMON_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${BUILD_VERSION}`  
   //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
   result.LOCAL_PROJECT_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${BUILD_VERSION}/${PROJECT_NAME}`  



    //html path  打包后的 html 文件 原地址  
    result.BUILD_HTML_FILE_RAW_PATH = `./${result.BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    result.BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/index.html` 

    //原 public 下的 静态素材   打包后的   原地址  
    result.BUILD_STATIC_DIR_PATH = `./${result.BUILD_OUTDIR}`
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    result.BUILD_STATIC_DIR_TARGET_PATH = `./dist${result.LOCAL_COMMON_FILE_PREFIX}/`
    


    //运维传输目录 
    result.BUILD_YUNWEI_COPY_ROOT_DIR = `./dist/${BUILD_DIR_NAME}/`

}
















 

all_resolve_fn.resolve_topic_project_build_type_9=(config,params,result)=>{
    const {
        //主题项目布局标识  
        TOPIC_PROJECT_LAYOUT_KEY , 
        //主题项目内容标识 
        TOPIC_PROJECT_CONTENT_KEY ,
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
  
        } = config

        let {
            BUILD_DIR_NAME,
            BUILD_VERSION,
            PROJECT_NAME
      
      
           } =params




    // 场景标识  TOPIC_PROJECT_BUILD_TYPE_9

    //  场景：  js 和 css素材在单次打包的目录下 ， 做版本隔离 ，
    //           删除单个布局版本打包的静态素材，
    //           拷贝提升原代码内的这个项目的静态素材到  外层（topic.根域/activity/）公用  ，不区分版本号 ，不做静态素材版本隔离 
    //           如果确认有多个版本 并且符合上述 特征 可以采用这种方案
    //  打包后 所有 项目级别  dist/activity/activity/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/   目录下的 静态素材（原public 目录下 拷贝过来的 ） 需要删除
    //  打包完成后 需要 拷贝 原public 目录下的这个项目的静态素材 到 dist/activity/activity/2023-12-18-18-11-48/ 内

  
 

    result.BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/${BUILD_VERSION}/` 
    //BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 

    result.BUILD_BASE =   `/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/${BUILD_VERSION}/`  


   //本地项目内文件  公用的 不带项目标识专用目录的 
   result.LOCAL_COMMON_FILE_PREFIX =   `/${BUILD_DIR_NAME}`  
   //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
   result.LOCAL_PROJECT_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${PROJECT_NAME}`  



    //html path  打包后的 html 文件 原地址  
    result.BUILD_HTML_FILE_RAW_PATH = `./${result.BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    result.BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/index.html` 


        //原 public 下的 静态素材   打包后的   原地址  
        result.BUILD_STATIC_DIR_PATH = `./${result.BUILD_OUTDIR}`
        //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
        result.BUILD_STATIC_DIR_TARGET_PATH = `./dist${result.LOCAL_COMMON_FILE_PREFIX}/`
        

    
        //运维传输目录 
        result.BUILD_YUNWEI_COPY_ROOT_DIR = `./dist/${BUILD_DIR_NAME}/`
}


















all_resolve_fn.resolve_topic_project_build_type_10=(config,params,result)=>{
    const {
        //主题项目布局标识  
        TOPIC_PROJECT_LAYOUT_KEY , 
        //主题项目内容标识 
        TOPIC_PROJECT_CONTENT_KEY ,
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
  
        } = config

        let {
            BUILD_DIR_NAME,
            BUILD_VERSION,
            PROJECT_NAME
      
      
           } =params




    // 场景标识  TOPIC_PROJECT_BUILD_TYPE_10

    //  场景：  js 和 css素材在单次打包的目录下 ， 做版本隔离 ，
    //           删除单个布局版本打包的静态素材，
    //           拷贝提升原代码内的这个项目的静态素材到  外层（topic.根域/activity/版本号/）公用  ，区分版本号 ，做静态素材版本隔离 
    //           如果确认有多个版本 并且符合上述 特征 可以采用这种方案
    //  打包后 所有 项目级别  dist/activity/activity/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/   目录下的 静态素材（原public 目录下 拷贝过来的 ） 需要删除
    //  打包完成后 需要 拷贝 原public 目录下的这个项目的静态素材 到 dist/activity/activity/2023-12-18-18-11-48/ 内

  
 

    result.BUILD_OUTDIR=`dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/${BUILD_VERSION}/` 
    //BUILD_BASE： 开发或生产环境服务的公共基础路径，用于 js 和 css 

    result.BUILD_BASE =   `/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/${BUILD_VERSION}/`  


   //本地项目内文件  公用的 不带项目标识专用目录的 
   result.LOCAL_COMMON_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${BUILD_VERSION}`  
   //本地项目内文件  单个项目 专用的 带 项目 专用目录的 
   result.LOCAL_PROJECT_FILE_PREFIX =   `/${BUILD_DIR_NAME}/${BUILD_VERSION}/${PROJECT_NAME}`  

    //html path  打包后的 html 文件 原地址  
    result.BUILD_HTML_FILE_RAW_PATH = `./${result.BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`
    //html path  打包后的 html 文件 需要拷贝 到的 目标地址
    result.BUILD_HTML_FILE_TARGET_PATH = `./dist/${BUILD_DIR_NAME}/${TOPIC_PROJECT_LAYOUT_KEY}/${TOPIC_PROJECT_CONTENT_KEY}/index.html` 



    //原 public 下的 静态素材   打包后的   原地址  
    result.BUILD_STATIC_DIR_PATH = `./${result.BUILD_OUTDIR}`
    //原 public 下的 静态素材   打包后的  文件 需要拷贝 到的 目标地址
    result.BUILD_STATIC_DIR_TARGET_PATH = `./dist${result.LOCAL_COMMON_FILE_PREFIX}/`
    


    //运维传输目录 
    result.BUILD_YUNWEI_COPY_ROOT_DIR = `./dist/${BUILD_DIR_NAME}/`


}







/**
 * 解析主题项目构建类型标识
 * @param config 
 * @param params 
 * @returns 
 */
export const resolve_topic_project_build_type=(config,params)=>{
    const {
        //主题项目构建类型标识
        TOPIC_PROJECT_BUILD_TYPE_KEY
        } = config
        let arr=  TOPIC_PROJECT_BUILD_TYPE_KEY.split("_")
        let num =  arr[arr.length-1]
        let result={}
        all_resolve_fn[`resolve_topic_project_build_type_${num}`](config,params,result)
        return result 
}
