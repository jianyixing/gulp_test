window.onload = function() {
    var btn = document.getElementById("btn");
    btn.addEventListener("click",function(ev){
        var targ = ev.target | window.event.srcElement;
        btn.style.backgroundColor = "yellow";
        btn.style.transform = 'rotate(360deg)';
        var timeflag1 = setTimeout(function(){
            btn.style.backgroundColor = "#0080ff";
            btn.style.transform = 'rotate(0deg)';
            clearTimeout(timeflag1);
            timeflag1 = null;
        },1000);
    });
}

