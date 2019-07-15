     UI.message({
            type:'info',
            message:'Hello World555',
            iconClass:'iconClass',
            custonClass:'custonClass',
            duration:2000,
            showClose:true,
            onClose:function(){
                console.log('onclose')
            }
        })
        // UI.message.info({
        //     message:'Hello World',
        //     custonClass:'custonClass',
        //     duration:200000,
        //     showClose:true,
        //     onClose:function(){
        //         console.log('onclose')
        //     }
        // })

        // UI.message.error('message')
  UI.notify({
            type: 'success',
            message: '你死啦是否看见爱上的划分空间的哈桑复合大师',
            duration: 2000,
            showClose: true,
            onClose() {
                console.log('close')
            },
        })

//ppage
        UI.page({
            ele: '.kk',
            page: 1,
            pageSize: 10,
            total: 0,
            showTotal: false,
            totalTxt: "共{total}条",
            showSkip: false,
            showPN: true,
            prevPage: "上一页",
            nextPage: "下一页",
            backFun: function (page) {
                console.log(page)
             }
        })
  var a=  UI.switch({
            ele:'.mm',
            value:true,
            disabled:false,
            change:function(val){
                // console.log(val)
            }
        });
        $('.btn').click(function(){
            console.log(a.isOpen())
        })



