

 function init_window_env(){
  // console.error('window.env--------0');

  if(!window.env)
  {
    // console.error("window.env--------1"   );
    window.env = {config : JSON.parse(process.env.config),NODE_ENV:process.env.NODE_ENV,DEV:process.env.DEV,VUE_ROUTER_MODE:process.env.VUE_ROUTER_MODE,VUE_ROUTER_BASE:process.env.VUE_ROUTER_BASE};

    // console.error("window.env--------1---0",JSON.stringify(window.env)    );


    // 是否开启自动配置动态域名
    // 一般都是不开启
    //一旦开启   针对的是域名不可知的包网，其网站部署规则必须符合  api.根域名为其接口域名   自己负责自己的 运维 不再走我方提供的 可以切换的多域名CDN
    if(window.env.config.AUTO_API){
      /**
       * @description: 获取配置动态域名
       * @param {String} head_str 需要替换的域名头信息
       * @return {String} 动态域名
       */
      function get_api(head_str='api'){
        let hostname = location.host;
        let arr = hostname.split('.')
        if(arr.length>=3){
            let len = arr.length;
            hostname = `${location.protocol}//${head_str}.${arr[len-2]}.${arr[len-1]}`
        }
        return hostname;
      }
      // 配置域名地址信息
      for (const key in window.env.config.domain) {
        if(window.env.config.domain[key]){
          window.env.config.domain[key] = [get_api()]
        }
      }
      // 配置静态资源域名地址信息
      window.env.config.static_serve = [get_api('static')]
    }
  }else{

    // console.error("window.env--------2" ,JSON.stringify(window.env)  );
  }

 }



 export default  init_window_env
