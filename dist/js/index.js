"use strict";window.onload=function(){var n=document.getElementById("btn");n.addEventListener("click",function(t){t.target,window.event.srcElement;n.style.backgroundColor="yellow",n.style.transform="rotate(360deg)";var e=setTimeout(function(){n.style.backgroundColor="#0080ff",n.style.transform="rotate(0deg)",clearTimeout(e),e=null},1e3)})};