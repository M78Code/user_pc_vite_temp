import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
const {
  //目标项目
  PROJECT_NAME,
  //项目启动文件入口目录名字
  ENTRY_DIR_NAME,
  //构建目录名字
  BUILD_DIR_NAME,
  //构建版本号
  BUILD_VERSION,
  //是否是开发环境
  IS_DEV,
  //打包构建输出目录
  BUILD_OUTDIR,
  //开发或生产环境服务的公共基础路径
  BUILD_BASE,

} = BUILD_VERSION_CONFIG;

 
const COMPUTE_ENTRY_CONFIG = ({ port }) => {
  if (!PROJECT_NAME) {
    console.error("目标项目必须设定 ----------");
    console.error("进程结束");
    process.exit(1);
  } else {
    console.log("---------目标项目---------", PROJECT_NAME);
    console.log("");
    console.log("");
    console.log("");
    // console.log("本地开发需要打开全路径：");
    // console.log(`http://localhost:${port}/project/${PROJECT_NAME}/index.html`);
    // console.log("");
    // console.log("");
    // console.log("");
    console.log(`相关目录：入口文件：  entries/${ENTRY_DIR_NAME}`);
    console.log(`相关目录：组件代码：  project/${PROJECT_NAME}`);
    console.log(`相关目录：静态素材：  public/${PROJECT_NAME}`);
    console.log("");
    console.log("");
    if(!IS_DEV){
      console.log(`相关目录：项目打包目录：  dist/${BUILD_DIR_NAME}`); 
      console.log(`相关目录：项目资源目录：  ${BUILD_OUTDIR}`); 
    }
  }
  return {
    project: PROJECT_NAME,
    outDir:BUILD_OUTDIR,
    base:BUILD_BASE,
   
 
  };
};


export default  COMPUTE_ENTRY_CONFIG