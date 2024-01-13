

import {placeholder_const , default_content} from  "../config.js"
export default {
     
    meta1:{
        placeholder: placeholder_const.meta1,
        content:  ''
     },
     style1:{
        placeholder: placeholder_const.style1,
        content:`      .theme01-root-loading #loading-root-main {
            color: #ffb001;
          }
          .theme01_y0-root-loading #loading-root-main {
            color: #569ffd;
          }
          .theme02-root-loading #loading-root-main {
            color: #ffb001;
          }
          .theme02_y0-root-loading #loading-root-main {
            color: #569ffd;
          }
          .theme01, .theme01-root-loading {
            background-color: transparent !important;
          }
          .theme01_y0,
          .theme01_y0-root-loading {
            background-color: transparent !important;
          }
    
          .theme02,
          .theme02-root-loading {
            background-color: transparent !important;
          }
    
          .theme02_y0,
          .theme02_y0-root-loading {
            background-color: transparent !important;
          }
    `
     },
 
 
     script2:{
        placeholder: placeholder_const.script2,
        content: `
        <script>
        !(function () {
          var d = "STATSCOREWidgetsEmbederScript";
          if (!window.document.getElementById(d)) {
            (window.STATSCOREWidgets = {}),
              (window.STATSCOREWidgets.onLoadCallbacks = []),
              (window.STATSCOREWidgets.onLoad = function (d) {
                window.STATSCOREWidgets.onLoadCallbacks.push(d);
              });
            var n = window.document.createElement("script");
            (n.src = "https://wgt-s3-cdn.statscore.com/bundle/Embeder.js"),
              (n.async = !0),
              (n.id = d),
              n.addEventListener("error", function (d) {
                for (var n = 0; n < window.STATSCOREWidgets.onLoadCallbacks.length; n++)
                  window.STATSCOREWidgets.onLoadCallbacks[n](d);
              }),
              window.document.body.appendChild(n);
          }
        })();
        
     </script>
        `
     }




}