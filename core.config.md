# 不要在代码中写入环境相关的判断 只能根据环境加载 不同配置文件 设定好
## 暂时先用 const {config}= useGlobelConfig()来获取整个配置
### 自己用了配置先记录下来 到时候合并
{
    platform:{
      name:"pc",
      isPc:true,
      isMobile:flase
    } , // 用UA来判断运行平台或者配置
    zhuge_config: {
      //诸葛埋点相关
      js_url: "https://updata.yaohuakuo.com/zhuge.js?v=",
      zhuge_run: false,
      mid: [],
      app_key: "c41f8b7cb97640838d90a73a0f077a43",
    },
    axios:{
        timeout:15000,

    }
};
