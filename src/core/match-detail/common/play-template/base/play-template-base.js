 




 


//本身这里的 可以用单个 scss 变量文件 引入 
//玩法卡片的 样式 配置
export const default_play_card_config={
    // 两个玩法卡片之间的 间距 4像素 样式  比如  4px  类名具体用 内边距还是外边距还是上下边距 自己实现，这里只看类名
    card_space_class:'detail-play-card-space-4' ,
    //卡片圆角大小 边框样式  粗细 对应的样式    border-radius
    card_border_class :"detail-play-card-border-case-1"
}

/**
 * 单个 投注项 内部显示布局 ，
 * 外框是 玩法那边管的
 * 这样 投注项组件就不用每个模板都写
 */

export const ol_item_layout = {
  //"投注项显示，赔率显示 ，投注项在上，赔率在下 ，整体居中"
  type1: 1,
  //"投注项不显示 ，赔率显示 ,  赔率居中 ，整体居中"
  type2: 2,
  //"投注项显示 ，赔率显示 ， 投注项在左，赔率在右  ，整体居中"
  type3: 3,
  //"投注项显示 ，赔率显示 ， 投注项在左，赔率在右  ，整体两端对齐"
  type4: 4,
};


// 默认布局配置
export const default_layout_config = {
    // 每行多少列 ,只管赔率列  ，不含可能的固定的投注项列
    column_number: 2,
    // 每一列是否补齐占位 ，无数据也显示 空框框
    column_patch: false,
    //当前卡片非 特殊投注项的 展示类型 
    common_ol_layout_type: ol_item_layout.type1,
    //是否有 特殊投注项
    has_special_ol: false,
    //特殊投注项个数
    special_ol_num: 0,
    //特殊投注项展示类型  ol_item_layout
    special_ol_layout_type: ol_item_layout.type1,
    //显示列头部标题
    show_column_head_title:false,
    //显示行头部标题
    show_row_head_title:false
  
  };
  
  // 默认样式配置
  export   const default_style_config = {
    //玩法卡片根节点样式 ,多个就 空格 隔开
    card_root_class: "xasx  new-pc ",
    ol_item_class: "",
  };
  
  
   