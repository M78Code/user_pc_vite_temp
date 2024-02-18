<!-- 

   H5 赛事拆分说明： 
    app：
      match-container-main-template1 :   通用 赛事容器  默认 
      match-container-main-template2 :   冠军
      match-container-main-template3 :   普通赛果
      match-container-main-template4 :   虚拟体育赛狗赛马赛果项
      match-container-main-template5 :   新手版
      match-container-main-template6 :   冠军赛果
    
    yazhou-h5：
      match-container-main-template1 :   通用 赛事容器  默认 
      match-container-main-template2 :   冠军
      match-container-main-template3 :   赛果
      match-container-main-template4 :   虚拟体育赛狗赛马赛果项

    ouzhou-h5:
      match-container-main-template1 :   通用 赛事容器  默认  
      match-container-main-template2 :   赛事筛选
      match-container-main-template3 :   赛果


  second 目录： 存放相关次要 玩法组件
      match-container-second-template1 :   yazhou-h5  次要玩法
      match-container-second-template2 :   app-h5    次要玩法

    -------------------------------------------------------------------------------------------

    mixins 目录： 存放 赛事主要逻辑
      champion.mixin： 冠军通用逻辑
      default.mixin：  赛事通用逻辑
      second.mixin：次要玩法通用逻辑
      virtual.mixin：  虚体体育通用逻辑

   

    规则说明：
        1. yazhou-h5 / app-h5 / ouzhou-h5 之间存在大量得公共逻辑，故  抽成 mixins；

        2. mixins 下不要存在根据 版本 PROJECT_NAME 相关判断；

        3. 需要 PROJECT_NAME 判断， 写在 当前组件下， 不要放在 mixins 里；
        
        4. 尽量只允许 组件内 获取 mixins 得方法或属性； 不要 在 mixins 里 去获取组件得方法或属性；

        5. 组件 setup 要获取 mixins 里得内容 通过 const { proxy } = getCurrentInstance()

    注： 
      后续 会继续对 赛果, 热门，次要玩法（每一种玩法），拆除出来
 -->




 


