


 /**
* @Description 获取媒体索引
* @param {string} type
* @return {NUmber}  1 ：源视频 2：动画 3 ：演播室 4 ：主播 5：专题
*
*/
export const   get_media_icon_index=(type)=>{
   const media_icons = [
       'video',
       'animation',
       'studio',
       'anchor',
       'topic',
   ]
   return media_icons[type - 1] || media_icons.indexOf(type) + 1 || 1
}