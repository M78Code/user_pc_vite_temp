let compute_build_in_oss_by_current_env = require("./build-in-oss.js")
let current_env_build_in_oss=''
 let BUILD_VERSION =  process.env.NODE_ENV=='development'?'':   require('./version.js').BUILD_VERSION;

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
// 日志服务开关
const LOG = false;
// 自动化测试 标签id开关
let DOM_ID_SHOW = process.env.FRONT_WEB_ENV_AUTO_TEST=='1';
console.log("--------------------------开始构建--------------------------");
const path = require("path");
console.log('process.env.NODE_ENV-',process.env.NODE_ENV);
/**
 *几种启动命令 形式 说明
 * 方式一：  quasar  dev   env   tp      例如：   quasar  dev   t  1   此方式相对灵活  不用来回改配置文件
 * 参数位置 说明 ：
 * env： 目标环境  可选值  【 d ,t , l ,s , o】  //  d : 开发 ，t: 测试 ，l ：隔离 ，s: 试玩 ，o : 生产
 * tp：  目标项目  可选值  【 'bw3'】   // bw3: bw3项目
 * oid:  目标项目  可选值  【 t 】   // t: 投注项目dom开启id显示功能
 *
 * 方式二： 命令形式  npm run bw3   只设置项目 不设置环境 ， 环境自己指定
 *        同类命令  请查看 package.json  scripts 部分   比如要启动  新UI 版本 命令 npm run bw3  其他 同理
 *
 * 方式三： quasar  dev   最基本的  命令  ，自己代码内手动指定 目标环境 和 目标项目
 *
 * 方式四： npm run dev  兼容 老的 习惯性的 vue 项目命令
 */
// 命令行参数 c_env  c_tp
let c_env =  process.argv[2]? process.argv[2].trim():""
let c_tp =  process.argv[3]? process.argv[3].trim():""
let show_oid =  process.argv[4]? process.argv[4].trim():""
// 命令行参数 c_env  c_tp  转换真实 目标参数   r_c_env  r_c_tp
let r_c_env=''
let  r_c_tp='bw3'

switch (c_env) {
  case 'd': r_c_env='local_dev'; break;
  case 't': r_c_env='local_test'; break;
  case 'l': r_c_env='idc_lspre'; break;
  case 's': r_c_env='idc_sandbox'; break;
  case 'o': r_c_env='idc_online'; break;

  default: r_c_env=''; break;
}

// 设置投注项显示id属性开关
if(show_oid=='t'){
  DOM_ID_SHOW = true;
}
console.log( " 当前计算的  r_c_env     " ,r_c_env );
console.log( " 当前计算的  r_c_tp      " ,r_c_tp);
console.log( " 当前计算的  DOM_ID_SHOW      " ,DOM_ID_SHOW);


let current_env = "idc_pre";
// 局域网  开发环境
// current_env= 'local_dev'
// 局域网  压力测试环境
// current_env = "local_ylcs";
// 局域网  测试环境
current_env = "local_test";
//  IDC  预发布
// current_env = "idc_pre";
// IDC 试玩环境
// current_env = "idc_sandbox";
//  IDC  隔离预发布
// current_env = "idc_lspre";
//  IDC  生产环境
// current_env= 'idc_online'
// IDC 微型测试环境
// current_env = 'idc_ylcs'
// const env_dev_config = require("./zenv/index.js");
// const env_product_config = require("./zenv/module/product-env.js");
current_env = r_c_env|| process.env.FRONT_WEB_ENV || current_env;


current_env_build_in_oss= compute_build_in_oss_by_current_env(current_env)

console.log("当前环境代码内内置 写入的兜底 oss 如下： ");
console.log( 'current_env_build_in_oss-----',current_env_build_in_oss);


// 埋点Google Analytics GA_TRACKING_ID
let GA_TRACKING_ID = 'G-4HE1W63ZN2' // 生产环境
let hidApi = (current_env=='idc_online')?'https://www.googletagmanager.com/gtag/js?id='+GA_TRACKING_ID:'';
// 隔离环境时使用
if(current_env=='idc_lspre'){
  GA_TRACKING_ID = 'G-H3XWBEMYYL'
  hidApi = 'https://www.googletagmanager.com/gtag/js?id='+GA_TRACKING_ID
}

// 服务器变量 FRONT_WEB_H5_PROJECT_NAME  指定 构建项目目标
// 构建目标
let TARGET_PROJECT_NAME = "bw3"
// 企业信息
let COM_CONFIG = 'com';

// 是否自动设置域名相关的地址
let AUTO_API = process.env.AUTO_API || false;

// 获取局域网中的本机iP地址
let IPAddress = (() => {
  let ip = "";
  const interfaces = require("os").networkInterfaces();
  Object.keys(interfaces).forEach(devName => {
    const iface = interfaces[devName],
      found = iface.filter(
        alias =>
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
      );
    if (!ip && found.length) ip = found[0].address;
  });
  return ip;
})();
// 最终项目配置信息
let final_config = null;

const pro_config = require("./zenv/bw3.js");
const ComConfig = require("./zenv/com/com.js");
final_config = pro_config.initSet(current_env);
const html_info = ComConfig.get(COM_CONFIG);

// 配置模板
const TEMPLATE_NAME = final_config.pro_arr.TEMPLATE_NAME;
// 项目名称
const FINAL_TARGET_PROJECT_NAME = final_config.pro_arr.FINAL_TARGET_PROJECT_NAME;
// 设置父模板项目(基于父类模板)
const DEFAULT_VERSION_NAME = final_config.pro_arr.DEFAULT_VERSION_NAME;
// 项目样式资源包名称
const STYLE_DIR_NAME = final_config.pro_arr.STYLE_DIR_NAME;
// 项目ICON资源包名称
const ICON_DIR_NAME = final_config.pro_arr.ICON_DIR_NAME;


// 合并 所有内容
Object.assign(final_config, {
  TEMPLATE_NAME,
  FINAL_TARGET_PROJECT_NAME: FINAL_TARGET_PROJECT_NAME,
  DEFAULT_VERSION_NAME,
  LOG,
  DOM_ID_SHOW,
  FRONT_WEB_ENV: process.env.FRONT_WEB_ENV,
  API_DOMAIN_PREFIX: "api",
  ip: IPAddress,
  html_info:html_info,
  AUTO_API,
  // 埋点Google Analytics GA_TRACKING_ID
  GA_TRACKING_ID,
  TAG: process.env.TAG?process.env.TAG:'',
  hidApi,
  BUILD_VERSION,
  ENABLE_COLLECT_API: true // 这个配制键 和后台无关  ， 优先级大于 后台 接口配置  ，
});
// 增加额外项目信息
console.log(
  "********************************************************************************************************************"
);
console.log(JSON.stringify(final_config));
console.log(
  "********************************************************************************************************************"
);
let current_request_domain =
  process.env["FRONT_WEB_REQUEST_DOMAIN"] || final_config.domain[current_env];
console.log(" ");
console.log(" ");
console.log("------------读取当前配置环境------------------");
console.log("当前环境：  " + current_env);
console.log(
  "process.env.FRONT_WEB_H5_PROJECT_NAME：    " +
    (process.env.FRONT_WEB_H5_PROJECT_NAME ||
      "当前环境未设置 FRONT_WEB_H5_PROJECT_NAME")
);
console.log("------------读取服务器反代域名配置  开始------------------");
console.log("process.env.NODE_ENV:    " + process.env.NODE_ENV);
if (process.env.NODE_ENV != "development") {
  console.log(
    "当前环境属于生产环境，将重置 current_request_domain  为空，以适应单个项目多域名运维 "
  );
  current_request_domain = "";
}
console.log(
  "FRONT_WEB_REQUEST_DOMAIN:      " +
    (process.env.FRONT_WEB_REQUEST_DOMAIN ||
      "当前环境未设置 FRONT_WEB_REQUEST_DOMAIN")
);
console.log("------------读取服务器反代域名配置  结束------------------");
console.log("------------读取当前代码打包输出环境  开始------------------");
console.log(
  "process.env.FRONT_WEB_ENV：    " +
    (process.env.FRONT_WEB_ENV || "当前环境未设置 FRONT_WEB_ENV")
);
console.log("最终结果：当前环境：  " + current_env);
console.log("最终结果：当前请求域名：  " + current_request_domain);
console.log("------------读取当前代码打包输出环境  结束------------------");
console.log(
  "------------附加输出当前代码内 domain 配置  开始------------------"
);
console.log(final_config.domain);
console.log(
  "------------附加输出当前代码内 domain 配置  结束------------------"
);
console.log("请注意以下几点：");
console.log("一： 切换 环境配置 需要 重启 项目");
console.log("二： 更改 quasar.conf.js 中的配置不需要 重启 项目 ");
console.log(" ");
console.log(" ");
console.log("--------------祝大家工作愉快！------------------");
console.log("--------------祝大家心想事成！------------------");
console.log(" ");
console.log(" ");
console.log("------------------------------jinnian----------");
console.log("------------------------------前端团队--");
console.log(" ");
console.log(" ");
console.log("------------最终输出配置 开始------------------");
console.log(final_config);
console.log("------------最终输出配置 结束------------------");
console.log("------------查看当前服务器环境变量 开始------------------");
console.log(process.env);
console.log("------------查看当前服务器环境变量 结束------------------");
console.log("------------查看当前脚本命令参数 开始------------------");
console.log(process.argv);
console.log("------------查看当前脚本命令参数 结束------------------");


//  使用 方式
//  env: ctx.dev? final_config.env :final_config.build_env,
//  proxy: final_config.proxy
module.exports = function(ctx) {
  let ret = {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: ["i18n", "globals", "common"],
    //	preFetch	Boolean	Enable PreFetch Feature. 预加载 字辈路由  孙子辈的 不加载
    preFetch: true,
    //css	Array	Global CSS/Stylus/… files from /src/css/, except for theme files, which are included by default.
    css: [
      /**
      *'app.scss',//referringto/src/css/app.scss
      '~some-library/style.css'//referringtonode_modules/some-library/style.css
      */
      `${STYLE_DIR_NAME}/app.scss`,
      "global_public_css.scss"
    ],
    //extras	Array	What to import from @quasar/extras package. Example: [‘material-icons’, ‘roboto-font’, ‘ionicons-v4’]
    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons'
    ],

    // htmlVariables	Object	Add variables that you can use in index.template.html.
    // htmlVariables: {},
    //framework	Object/String	What Quasar components/directives/plugins to import,
    // what Quasar language pack to use, what Quasar icon set to use for Quasar components.
    // framework: {
    //   all: true, // --- includes everything; for dev only!
    //   config: {
    //     //https://quasar.dev/quasar-plugins/loading-bar
    //     loadingBar: {
    //       skipHijack: true
    //     }
    //   }
    // },
    // 按需引入组件
    framework:{
         // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],
      config: {},
      // directives: [
      //   'TouchSwipe',
      //   'Scroll',
      //   'TouchPan'
      // ],
      plugins: [

      ]
    },
    // vendor: {
    //   /* optional; @quasar/app v1.4.2+;
    //      disables vendor chunk: */
    //      disable: true,

    //   // add: [ 'src/plugins/my-special-plugin' ],
    //   remove: [
    //     'axios',
    //    'vue$',
    //   "@quasar/extras",
    //   "axios",
    //   "licia",
    //   "core-js",
    //   "lodash",
    //   "quasar",
    //   "url-search-params-polyfill",
    //   "vconsole",
    //   "vue-i18n",
    //   "vue-lazyload",
    //   "vuex-persistedstate"
    // ]
    // },
    // https://quasar.dev/options/animations
    //https://daneden.github.io/animate.css/
    // animations: "all", // --- includes all animations
    // animations: [],
    // <!-- src/index.template.html -->
    // <%= title %>
    //这里的 htmlWebpackPlugin.options 可以直接读取到  package.json 里面的 数值
    htmlVariables: {
      title: `${html_info.title}`,
      icon: `${html_info.icon}`,
      productName: `${html_info.productName}`,
      productDescription: `${html_info.productDescription}`,
      version: `${html_info.version}`,
      versionDate: `${new Date().toLocaleString()}`,
      BRANCH: process.env.BRANCH,
      TAG: process.env.TAG,
      BUILD_TAG: process.env.BUILD_TAG,
      // 增加埋点api配置
      hidApi ,
      current_env, // 当前环境
      BUILD_VERSION : BUILD_VERSION? `/${BUILD_VERSION}`:"",
      error_upload_url: 'https://information-api.sportxxxwo8.com/error_info', // 错误上报环境地址
      // 企业信息
      com: `${html_info.com}`,
      prodect_env: process.env.NODE_ENV,
      current_env_build_in_oss:   encodeURIComponent(JSON.stringify(current_env_build_in_oss))  ,
    },
    //Use this property to change the default names of some files of your website/app if you have to.
    // All paths must be relative to the root folder of your project.
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router',
    //   store: 'src/store',
    //   indexHtmlTemplate: 'src/index.template.html',
    //   registerServiceWorker: 'src-pwa/register-service-worker.js',
    //   serviceWorker: 'src-pwa/custom-service-worker.js',
    //   electronMainDev: 'src-electron/main-process/electron-main.dev.js',
    //   electronMainProd: 'src-electron/main-process/electron-main.js'
    // },
    build: {
      publicPath:BUILD_VERSION,
      distDir:"dist/spa/"+BUILD_VERSION,
      // publicPath: '',
      //scopeHoisting: true,//	Boolean	Default: true. Use Webpack scope hoisting for slightly better runtime performance.
      // vueCompiler: true, //Include vue runtime + compiler version, instead of default Vue runtime-only
      gzip: true, //	Boolean	Gzip the distributables. Useful when the web server with which you are serving the content does not have gzip.
      analyze: process.env.npm_lifecycle_event === 'analyze', //Show analysis of build bundle with webpack-bundle-analyzer. If using as Object, it represents the webpack-bundle-analyzer config Object.
      // extractCSS: false,
      // sourceMap:false,
      /**
       * env: Add properties to process.env that you can use in your website/app JS code.
       *  Each property needs to be JSON encoded. Example: { SOMETHING: ‘someValue’  }.
       */
      // process.env.hidApi
      // env: ctx.dev ? final_config.env : final_config.build_env, config:  final_config , hidApi,

      env: { config: JSON.stringify(final_config)},
      // env: final_config,
      //https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      chainWebpack(cfg) {
        // 全局挂载scss公共文件
        const oneOfsMap = cfg.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
          item
              .use('sass-resources-loader')
              .loader('sass-resources-loader')
              .options({
                // Provide path to the file with resources
                // 要公用的scss的路径
                resources: 'src/css/quasar.variables.scss'
              })
              .end()
        })

        // if (process.env.NODE_ENV !== 'development') {
        //   cfg
        //     .plugin('mini-css-extract')
        //     .init((MiniCssExtractPlugin, args) => {
        //       return new MiniCssExtractPlugin({
        //         ignoreOrder: true, // 打包时，忽略控制台提示css引入顺序冲突
        //         filename: '[name].[contenthash].css',
        //         chunkFilename: '[name].[contenthash].css'
        //       })
        //     })
        // }

        cfg.module.rule("images")
            .test(/\.(jpg|png|gif|svg)$/)
            .use("url-loader")
            .loader("url-loader")
            .options({
              esModule: false,
              name: 'images/[name].[hash:8].[ext]',
              limit: 1024
            })
            .end()

      },
      extendWebpack(cfg) {
        cfg.module.rules.push({}),
        cfg.optimization= {
          // 分割代码块，即抽离公共模块
          splitChunks: {
            chunks: 'all',
            minSize: 300000,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            // 缓存组
            cacheGroups: {
              // 由于第三方代码变动比较小，所以把所有第三方单独打包，利于缓存(在app.js修改一下代码,重新打包,不影响此包hash)
              vendors: {
                name: `chunk-vendors`,
                test: /[\\/]node_modules[\\/]/,
                priority: -10, // 设置打包权重，
                chunks: 'initial'
              },
              // // 合并多个 css 文件
              // styles: {
              //   name: 'styles',
              //   test: (m) => /css\/mini-extract/.test(m.type),
              //   chunks: 'all',
              //   minChunks: 1,
              //   enforce: true
              // },
              common: {// 组名为common可自定义
                  name: `chunk-common`,  // 定义抽离出的文件的名称
                  test: /[\\/]api[\\/]|[\\/]mixins[\\/]|[\\/]src[\\/]service[\\/]/,
                  minChunks: 2,
                  priority: 0,
                  chunks: 'initial', // 同步引入
                  reuseExistingChunk: true
              },
              base_info_manage: {
                name: 'base_info_manage',
                test: /[\\/]base_info_manage[\\/]/,
                minChunks: 2,
                priority: 0,
                maxSize: 102400
              },
              group_info_set: {
                name: 'group_info_set',
                test: /[\\/]base_info_manage[\\/]group_info_set[\\/]/,
                minChunks: 2,
                priority: 10,
              },
            }
          }
        },
        cfg.resolve.alias = {
          ...cfg.resolve.alias, // This adds the existing alias
          // Add your own alias like this
          public: path.resolve(__dirname, "./public"),
          api: path.resolve(__dirname, "./src/api"),
          mixins: path.resolve(__dirname, "./src/mixins"),
          router: path.resolve(__dirname, "./src/router"),
          store: path.resolve(__dirname, "./src/store"),
          utils: path.resolve(__dirname, "./src/public/utils"),
          //设置项目路径
          project_path: path.resolve(__dirname, "./src/project"),
          //设置模板路径
          // project_theme: path.resolve(__dirname, "./src/css/pro/"+DEFAULT_VERSION_NAME),
          project_theme: path.resolve(__dirname, "./src/css/pro/bw3"),
        };
      },
      // afterBuild() {
      // 打包后 可以直接 通过插件上传 Git ftp 等
      // },
      // vueRouterMode:'hash', // 默认 hash  history 模式需要服务端配合
      // htmlFilename:'index.html',	//String	Default is ‘index.html’.
      //productName	:'',//String	Default value is taken from package.json > productName field.
      // distDir:'',//Default is ‘dist/{ctx.modeName}’ // Applies to all Modes except for Cordova (which is forced to src-cordova/www).
      //https://webpack.js.org/configuration/devtool/
      //  devtool:'',//	String	Source map strategy to use.
      //https://github.com/webpack-contrib/terser-webpack-plugin/#minify
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_console: true, //移除console功能，
          pure_funcs: ["alert", "prompt", "confirm"], //移除无用方法
          dead_code: true, // 删除不可到达的代码
        }
      },
      scssLoaderOptions:{
        additionalData: `$is-prod: '${ctx.dev?'false':'true'}';`,
        // prependData: `$image-prefix: '${ctx.dev?'':'..'}';`
      }
      // stylusLoaderOptions	Object	Options to supply to stylus-loader.
      // scssLoaderOptions	Object	Options to supply to sass-loader for .scss files.
      // sassLoaderOptions	Object	Options to supply to sass-loader for .sass files.
      // lessLoaderOptions	Object	Options to supply to less-loader.
      //preloadChunks:"true",//	Boolean	Default is “true”. Preload chunks when browser is idle to improve user’s later navigation to the other pages.
      // 以下 配置 默认，不要更改
      /**
       * The following properties of build are automatically configured by Quasar CLI depending on dev/build
       * commands and Quasar mode. But if you like to override some (make sure you know what you are doing), you can do so:
       */
      // extractCSS	Boolean	Extract CSS from Vue files
      // sourceMap	Boolean	Use source maps
      // minify	Boolean	Minify code (html, js, css)
      // webpackManifest	Boolean	Improves caching strategy. Use a webpack manifest (runtime) file to avoid cache bust on vendor chunk changing hash on each build.
    },
    /**
     * Webpack dev server options. Some properties are overwritten based on the Quasar mode you’re using in order to ensure a correct config.
     *  Note: if you’re proxying the development server (i.e. using a cloud IDE), set the public setting to your public application URL.
     */
    devServer: {
      // https://webpack.js.org/configuration/dev-server/
      // https: true,
      /**
       * When you set devServer > https: true in your quasar.conf.js file,
       * Quasar will auto-generate a SSL certificate for you. However,
       *  if you want to create one yourself for your localhost, then check out this blog post by Filippo.
       * Then your quasar.conf.js > devServer > https should look like this:
       */
      // const fs = require('fs')
      // https: {
      //   key: fs.readFileSync('/path/to/server.key'),
      //   cert: fs.readFileSync('/path/to/server.crt'),
      //   ca: fs.readFileSync('/path/to/ca.pem'),
      // }
      // public:'',//	String	Public address of the application (for use with reverse proxies)
      host: IPAddress, //String	Local IP/Host to use for dev server
      // host: 'user-h5-baowang-one.local.com',
      open: true, // opens browser window automatically
      port: 8888,
      proxy: final_config.proxy
    },
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: `/${ICON_DIR_NAME}/image/common/icons/icon-128_128.png`,
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: `/${ICON_DIR_NAME}/image/common/icons/icon-192_192.png`,
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: `/${ICON_DIR_NAME}/image/common/icons/icon-256_256.png`,
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: `tatics/${ICON_DIR_NAME}/image/common/icons/icon-384_384.png`,
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: `/${ICON_DIR_NAME}/image/common/icons/icon-512_512.png`,
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack(cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'quasar-app'
      }
    }
  };
  // console.log(ret)
  return ret;
};
