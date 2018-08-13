;(function ($) {
    $.fn.extend({
        checkForm:function (options) {
            var $this=this,
                isOk=false,
                pwd;
                $(":text",$this).attr("autocomplete","off")
            var defaults={
                //提示信息
                tip_default:"不能为空",
                tip_success:"成功",
                tip_required:"不能为空",
                tip_user:"必须中文",
                tip_phone:"手机号码格式不正确",
                tip_pass:"两次密码不正确",
                tip_email:"邮箱格式不正确",
                tip_password:"应为6~12位数字",
                tip_file:"文件上传不能为空",
                tip_num:"必须为数字",
                //正则验证
                reg_num:/\d$/,
                reg_email:/^\w+\@[A-Za-z0-9]+\.[A-Za-z]{2,4}$/,
                reg_chinese:/^[\u4E00-\u9FA5]+$/,
                reg_phone:/^1[3458]{1}[0-9]{9}$/,
                reg_password:/\d{6,12}/,
                reg_file:/^\s*$/,
            }
            if(options){
                //合并参数
                $.extend(defaults,options)
            }
            $(":text,:password,:file",$this).each(function () {
                $(this).blur(function () {
                    var _valData=$(this).attr("check");
                    if (_valData){
                        var arr=_valData.split(" ");
                        for (var i=0;i<arr.length;i++){
                            check($(this),arr[i],$(this).val())
                        }
                    }
                })
            });
            var check=function (obj,_match,_val) {
                switch (_match){
                	 case "unempty":
		                return  _val.length>0?showMsg(obj,defaults.tip_success,true):showMsg(obj,defaults.tip_default,false);
		                break;
                    case 'email':
                        return chk(_val,defaults.reg_email)?showMsg(obj,defaults.tip_success,true):showMsg(obj,defaults.tip_email,false);
                         break;
                    case 'num':
                        return chk(_val,defaults.reg_num)?showMsg(obj,defaults.tip_success,true):showMsg(obj,defaults.tip_num,false);
                         break;
                    case 'password':
                        return chk(_val,defaults.reg_password)?showMsg(obj,defaults.tip_success,true):showMsg(obj,defaults.tip_password,false);
                         break;
                    case 'pass1':
                        return pwd=_val;
                         break;
                    case 'pass2':
                        return equalPass(_val,pwd)?showMsg(obj,defaults.tip_success,true):showMsg(obj,defaults.tip_pass,false);
                         break;
                    case 'file':
                        return chk(_val,defaults.reg_file)?showMsg(obj,defaults.tip_file,false):showMsg(obj,defaults.tip_success,true);
                         break;

                    default:
                        return true;
                }
            };
            var equalPass=function (_val1,_val2) {
                return _val1==_val2?true:false
            }
            var chk=function (str,reg) {
                return  reg.test(str)
            };
            var showMsg=function (obj,msg,mark) {
            	console.log(mark);
            	$(obj).next(".err").remove();
            	$(obj).next(".form-control-feedback").remove()
            	if(mark){
            		$(obj).parents('.form-group').attr("class",'form-group has-feedback has-success');
            		$(obj).after('<span class="form-control-feedback"><i class="fa fa-check"></i></span>')
            	}else{
            		$(obj).parents('.form-group').attr("class",'form-group has-feedback has-error');
            		$(obj).after('<span class="form-control-feedback"><i class="fa fa-remove"></i></span>')
	                var _html='<span class="err text-danger">*'+msg+'</span>';
	                $(obj).after(_html);
	                return mark;
            	}
              
            };
            function _submit() {
                $(":text,:password,:file",$this).each(function(){
                    var _validate=$(this).attr("check");
                    if(_validate){
                        var arr=_validate.split(" ");
                        for(var i=0;i<arr.length;i++){
                            check($(this),arr[i],$(this).val());
                            return isOk=check($(this),arr[i],$(this).val());
                        }
                    }
                })
            }
            //form 表单提交的时候
            if($this.is("form")){
                $this.submit(function () {
                    _submit();
                    console.log(isOk)
                    return isOk;
                })
            }else{
            	 _submit();
            	  return isOk;
            }
        },
    })
})(jQuery)
