

# 全局注入 SCSS 项目文件目录名字 使用方法
  

  全局顶层注入变量在   `app/job/output/css/variables.scss`
```
    $SCSSPROJECTPATH   : "/app-h5";
   改变    background-image: url($SCSSPROJECTPATH+"/image/svg/sports_rules.svg");
   为：   background-image: url( $SCSSPROJECTPATH +"/image/svg/sports_rules.svg");

```


 