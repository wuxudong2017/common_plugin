$.fn.extend({
    mySlide:function(oppts) {
        var defaultOpts = {
            picEl: $(this).find("div").first(),
            libEl: $(this).find("div").last(),
            libs: true,
            arrows: true,
            autoPlay: false,
            time: 3000,
            speed: 400,
            effect: "effect"
        }
        var options = $.extend(defaultOpts, oppts), dialog = {};
        dialog.init = function () {
            var $timer = null,
                $slideLi = options.picEl.find("li"),
                $maxNum = $slideLi.length,
                $index = 0,
                $moveVal = "",
                //控制类
                $oCtrl = options.libEl,
                $libs = options.libs,
                $libsHTML = "",
                $libsList=null,
                $arrow = options.arrows,
                $effect = options.effect,
                //移动模式
                $moveMode1 = {},
                $moveMode2 = {},
                $moveMode3 = {},
                //自动滚动
                $autoPlay=options.autoPlay,
                $playTime=options.time,
                $playSpeed=options.speed;
            //建立小圆点
            if ($libs) {
                createLibs()
            }
            function createLibs() {
                for (var i = 0; i < $maxNum; i++) {
                    $libsHTML += '<span class="libs"></span>'
                }
                $oCtrl.append($libsHTML);
                $libsList = $oCtrl.children('.libs');
                $libsList.first().addClass("active")
            }

            //建立箭头
            if ($arrow) {
                createArrow()
            }
            function createArrow() {
                $oCtrl.append('<span class="arrow prev"></span><span class="arrow next"></span>')
            }
            //判断移动方式
            if ($effect == "left") {
               $moveVal=$slideLi.children('img').width(),
                $moveMode1 = {
                    left: $moveVal
                }
                $moveMode2 = {
                    left: -$moveVal
                }
                $moveMode3 = {
                    left: 0
                }
                initLi()
                picMove()
            }else if($effect=="top"){
                $moveVal=$slideLi.children('img').height(),
                $moveMode1 = {
                    top: $moveVal
                }
                $moveMode2 = {
                    top: -$moveVal
                }
                $moveMode3 = {
                    top: 0
                }
                initLi()
                picMove()
            }else{
                $moveMode1 = {
                    opacity: 0
                }
                $moveMode2 = {
                    opacity: 0
                }
                $moveMode3 = {
                    opacity: 1
                }
                initLi()
                picMove()
            }
            //初始化li布局,开始全部都在最左边
            function initLi() {
                    $slideLi.each(function (index, el) {
                       if(index>0){
                           $(el).css($moveMode1)
                       }
                    })
                }
                //向上一个移动
            function movePrev() {
                $slideLi.eq($index).stop().animate($moveMode2,$playSpeed);
                ++$index;
                $index%=$maxNum;
                $slideLi.eq($index).css($moveMode1).stop().animate($moveMode3,$playSpeed);
                if($libs){
                    libsChange($index)
                }

            }
            //向下一个移动
            function moveNext(){
                $slideLi.eq($index).stop().animate($moveMode1,$playSpeed);
                --$index;
                $index<0?$index=$maxNum-1:$index;
                $slideLi.eq($index).css($moveMode2).stop().animate($moveMode3,$playSpeed);
                if($libs){
                    libsChange($index)
                }
            }
            //libs下小圆点变化
            function libsChange(val){
               $libsList.removeClass('active').eq(val).addClass('active')
            }
            //自动移动
            if($autoPlay){
                autoPlay()
                //按钮事件,当鼠标滑入的时候停止自动轮播,先暂停自动轮播才能切换
                $oCtrl.hover(function(){
                    clearInterval($timer)
                },function(){
                    clearInterval($timer);
                    autoPlay()
                })
            }
            function picMove(){
                $oCtrl.on("click","span",function(){
                    if($(this).attr("class")=="arrow prev"){
                            moveNext()
                    }else if($(this).attr("class")=="arrow next"){
                            movePrev()
                    }else{
                        var $this=$(this).index();
                        //向上一个移动
                        if($this<$index){
                           $slideLi.eq($index).stop().animate($moveMode1,$playSpeed)
                            $slideLi.eq($this).css($moveMode2)
                        }else if($this>$index){
                            //向下一个移动
                            $slideLi.eq($index).stop().animate($moveMode2,$playSpeed)
                            $slideLi.eq($this).css($moveMode1)
                        }
                        $index=$this
                        $slideLi.eq($index).stop().animate($moveMode3, $playSpeed)
                        libsChange($this)
                    }
                })
            }
            function  autoPlay(){
                clearInterval($timer);
                $timer=setInterval(function(){
                        movePrev()
                },$playTime)
            }
        }
        return dialog.init()
    }
})