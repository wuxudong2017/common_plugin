; (function (global, factory) {
    // amd 判断
    if (typeof define === 'function' && define.amd) {
        define('UI', ['jquery'], factory)
    } else if (typeof module !== "undefined" && typeof exports === "object") {
        module.exports = factory(require('jquery'));
    } else {
        global.UI = factory(global.jQuery)
    }



}(typeof window !== 'undefined' ? window : this, function ($) {
    if (typeof jQuery === 'undefined') throw new Error('请先引入jQuery');
    var jqVersion = $.fn.jquery;
    // if(jqVersion.charAt(0)<3) throw new Error('jQuery 版本不迸发低于3')
    var $window = $(window),
        $document = $(document);
    $body = $('body')
    var Methods = {
        // message 消息提示框
        message: function (type, arg) {
            // 初始化配置
            var defaultOption = {
                type: 'info',
                message: '',
                custonClass: '',
                duration: 2000,
                showClose: false,
            }, size = arg.length; options = {};
            if (!size) return;
            if (arg[0] instanceof Object) {
                options = arg[0]
            } else {
                options.message = arg[0]
            }
            if (type) { options.type = type; }

            var opt = $.extend({}, defaultOption, options);
            // 创建弹窗
            if (!$('.ui_message').length) {
                $body.append('<div class="ui_message ' + opt.custonClass + '"></div>');
            }
            var $wrap = $('.ui_message')
            var $container = $('<div class="ui_message_container '
                + opt.type + '"><div class="ui_message_icon"><i class="iconfont icon-' + opt.type + '"></i></div><div class="ui_message_con">'
                + opt.message + '</div></div>')
            $wrap.append($container);
            // 设置宽度
            var wrapperWidth = 0;
            $container.children().each(function (index, el) {
                wrapperWidth += $(el).outerWidth(true);
            }).end().width(wrapperWidth + 30)
            // 手动关闭
            if (opt.showClose) {
                var $close = $('<div class="ui_message_close"><i class="iconfont icon-close-fill"></i></div>')
                $container.append($close);
                $close.bind('click', function () {
                    UI.message.close($close.parents('.ui_message_container'))
                })
            }
            // 存储 close 函数
            if (typeof opt.onClose == 'function') {
                $container.data('ui-message-onClose', opt.onClose)
            }
            // 定时自动关闭
            if (typeof opt.duration == 'number' && opt.duration > 1000) {
                var time = setTimeout(function () {
                    clearTimeout(time)
                    UI.message.close($container)
                }, opt.duration)
            }
        },
        notify: function (type, arg) {
            var defaultOption = {
                type: 'info',
                title: '提示',
                message: '提示消息',
                duration: 2000,
                showClose: true,
                onClose() {

                },
                position: 'top-right'
            }, size = arg.length, options = {};
            if (!size) return;
            if (arg[0] instanceof Object) {
                options = arg[0]
            } else {
                options.message = arg[0]
            }
            var opt = $.extend({}, defaultOption, options);
            if (type) {
                opt.type = type
            }
            $wrap = $('<div class="ui_notify" style="right:0"><div class="' + opt.type + '">' +
                '<div class="group"><div class="icon"><i class="iconfont icon-' + opt.type + '"></i></div><h2 class="title">' + opt.title + '</h2> <div class="content"><p>' + opt.message + '</p></div>'
                + '</div></div>');
            $body.append($wrap);
            $container = $('.ui_notify');
            if (opt.showClose) {
                var $close = $('<div class="ui_notify_close"><i class="iconfont icon-close-fill"></i></div>');
                $container.children().append($close)
            }
            var pos = opt.position.split('-');
            $container.each(function (index, el) {
                var h = $(el).outerHeight();
                $(el).css({
                    top: ((h + 10) * index) + 'px'
                })
                // 手动关闭
                var $close = $(el).find('.ui_notify_close');
                if ($close) {
                    $close.bind('click', function () {
                        UI.notify.close($close.parents('.ui_notify'))
                    })
                }
                // 定时自动关闭
                if (typeof opt.duration == 'number' && opt.duration > 0) {
                    var time = setTimeout(function () {
                        clearTimeout(time)
                        UI.notify.close($(el))
                    }, opt.duration)
                }

            })
            // 存储 close 函数
            if (typeof opt.onClose == 'function') {
                $container.data('ui-notify-onClose', opt.onClose)
            }
        },
        msgbox:function(type,arg){
            var defaultOption = {
                type:'info',
                title:'提示',
                content:"确定操作吗?",
                showCancelButton:true,
                showConfirmButton:true,
                shwoModal:true,
                callback:function(action,instance){
    
                }
              },size = arg.length; options = {};
              if (!size) return;
              if (arg[0] instanceof Object) {
                  options = arg[0]
              } else {
                  options.content = arg[0];
                if(typeof arg[1]=='string' ){
                    options.title = arg[1]
                }else{
                    options = arg[1]
                }
                if(arg[2] instanceof Object){
                    options = $.extend({},options,arg[2])
                }else{
                    throw new Error('配置信息为对象')
                }
            }
              if (type) { options.class = type; }
              var opt = $.extend({},defaultOption,options);
              var $wrap = $('<div class="msgbox_wrap"></div>');
              var $container = $('<div class="msgbox_box  '+opt.type+'"></div>') ;
              var $title = $('<div class="msgbox_header"><div class="msgbox_title">'+opt.title+'</div><span class="msgbox_close"><i class="iconfont icon-close-fill"></i></span></div>')
              var $content = $('<div class="msgbox_content"> <i class="iconfont icon-'+opt.type+'"></i> '+opt.content+'</div>')
              var $footer = $('<div class="msgbox_footer"></div>');
              var $cancel  = $('<button class="btn btn-default btn-small">取消</button>');
              var $sure = $('<button class="btn btn-primary btn-small">确定</button>');
              
              $cancel.bind('click',function(){
                  $wrap.remove();
                  if(opt.shwoModal){
                      $('.v-modal').remove()
                  }
                  setTimeout(() => {
                    opt.callback('cancel',$wrap)
                }, 1);
              })
              $sure.bind('click',function(){
                  $wrap.remove();
                  if(opt.shwoModal){
                    $('.v-modal').remove()
                }
                  setTimeout(() => {
                      opt.callback('confirm',$wrap)
                  }, 1);
              });
              if(opt.showCancelButton){
                $footer.append($cancel)
              }
              if(opt.showConfirmButton){
                  $footer.append($sure)
              }
              $wrap.append($container.append($title).append($content).append($footer));
              if(!$('.msgbox_wrap').length){
                  $('body').append($wrap)
              }
              if(opt.shwoModal){
                  $('body').append('<div class="v-modal"></div>')
              }
              var $btnClose = $('.msgbox_close');
              $btnClose.bind('click',function(){
                $wrap.remove();
                if(opt.shwoModal){
                    $('.v-modal').remove()
                }
                setTimeout(() => {
                    opt.callback('cancel',$wrap)
                }, 1);
              })
        }
    }
    var UI = {
        message: function () {
            return Methods.message.call(this, null, arguments)
        },
        checkbox: function (options) {
            if (!options.ele) throw new Error('请确定节点');
            var $this = $(options.ele);
            var defaults = {
                data: [],
                change() { }
            };
            var opt = $.extend({}, defaults, options);
            if (!opt.data instanceof Array) return;
            var str = ""
            $.each(opt.data, function (index, item) {
                str += '<label for="checkbox" class="ui_checkbox ' +
                    (item.checked ? 'is_checked' : ' ')
                    + '"><input type="checkbox" name="' +
                    (item.name) + '" ' +
                    (item.checked ? 'checked' : '') + '  value="' +
                    (item.value)
                    + '"   class="ui_checkbox_origin"><span class="check_icon"></span><span class="check_label">' + item.label + '</span></label>'
            });
            $this.each(function () {
                var $this = $(this)
                $this.html(str);
                var child = $this.children();
                var $form = $(this).parents('form');
                // 表单重置
                if ($form.length > 0) {
                    $form.on('reset', function () {
                        child.each(function (index, el) {
                            $(el).removeClass('is_checked');
                            $('input[type="checkbox"]', el).removeAttr('checked')
                        })
                    })
                }
                child.each(function (index, el) {
                    $(el).on('click', function () {
                        $(this).toggleClass('is_checked');
                        if ($(this).hasClass('is_checked')) {
                            $('input', this).attr('checked', true);
                        } else {
                            $('input', this).removeAttr('checked')
                        }
                        opt.change(el)
                    })
                });
            })
            var init = {
                getVal: function () {
                    var arr = [];
                    $('input[type="checkbox"]', $this).each(function (index, el) {
                        if ($(el).attr('checked')) {
                            arr.push($(el).val())
                        }
                    });
                    return arr
                },
            }
            return init
        },
        radio: function (options) {
            if (!options.ele) throw new Error('请确定节点');
            var $this = $(options.ele);
            if (!options.ele) throw new Error('请确定节点');
            var $this = $(options.ele);
            var defaults = {
                data: [],
                change() { }
            };
            var opt = $.extend({}, defaults, options);
            if (!opt.data instanceof Array) return;
            var str = ""
            $.each(opt.data, function (index, item) {
                str += '<label for="radio" class="ui_radio ' + (item.checked ? 'is_checked' : '') + ' ">' +
                    '<input type="radio"  class="ui_radio_original" name="' + (item.name) + '" value="' + (item.value) + '"' + (item.checked ? 'checked' : ' ') + ' ><span class="ui_radio_input"><span class="ui_radio_icon"></span></span><span class="ui_radio_label">' + (item.label) + '</span></label>'
            });
            $this.each(function () {
                var $this = $(this)
                $this.html(str);
                var child = $this.children();
                var $form = $(this).parents('form');
                // 表单重置
                if ($form.length > 0) {
                    $form.on('reset', function () {
                        child.each(function (index, el) {
                            $(el).removeClass('is_checked');
                            $('input[type="checkbox"]', el).removeAttr('checked')
                        })
                    })
                }
                child.each(function (index, el) {
                    $(el).click(function () {
                        $(this).addClass('is_checked').siblings().removeClass('is_checked');
                        if ($(this).hasClass('is_checked')) {
                            $(this).find('input').attr('checked', true);
                            $(this).siblings().find('input').removeAttr('checked')
                        }
                    })
                });
            })
            var init = {
                getVal: function () {
                    var arr = '';
                    $('input[type="radio"]', $this).each(function (index, el) {
                        if ($(el).attr('checked')) {
                            arr = $(el).val()
                        }
                    });
                    return arr
                },
            }
            return init
        },
        notify: function (options) {
            return Methods.notify.call(this, null, arguments)
        },
        // 分页
        page: function (options) {
            
            var defaultOption = {
                page: 1,
                pageSize: 10,
                total: 0,
                showTotal: false,
                totalTxt: "共{total}条",
                showSkip: false,
                showPN: true,
                prevPage: "上一页",
                nextPage: "下一页",
                backFun: function (page) { }
            };

            if (!options.ele) throw new Error('请先选中节点');
            var ele = options.ele
            function Plugin(ele, options) {
                this.settings = $.extend({}, defaultOption, options);
                this.element = $(ele);
                this.pageNum = 1;
                this.pageList = [];
                this.init()
            }
            Plugin.prototype = {
                init: function () {
                    
                    if (this.settings.total >= 0) {
                        this.viewHtml();
                        this.clickBtn();
                        this.element.addClass('page_container')
                    }
                },
                creatHtml: function (i) {
                    if (i == this.settings.page) {
                        this.pageList.push('<span class="active" data-page=' + i + '>' + i + '</span>')
                    } else {
                        this.pageList.push('<span data-page=' + i + '>' + i + '</span>')
                    }
                },
                viewHtml: function () {
                    var settings = this.settings;
                    var pageTatol = Math.ceil(settings.total / settings.pageSize);
                    var pageArr = [];
                    this.pageNum = settings.page;
                    this.element.empty();
                    if (settings.showTotal) {
                        pageArr.push('<div class="page_total">' + settings.totalTxt.replace(/\{(\w+)\}/gi, settings.total) + '</div>')
                    }
                    pageArr.push('<div class="page_number">');
                    this.pageList = [];
                    if (settings.showPN) {
                        settings.page == 1 ? this.pageList.push('<span class="span-disabled" data-page="prev">' + settings.prevPage + '</span>') : this.pageList.push('<span data-page="prev">' + settings.prevPage + '</span>')
                    }
                    if (pageTatol <= 6) {
                        for (var i = 1; i < pageTatol + 1; i++) {
                            this.creatHtml(i)
                        }
                    } else {
                        if (settings.page < 5) {
                            for (var i = 1; i <= 5; i++) {
                                this.creatHtml(i)
                            }
                            this.pageList.push('<span data-page="none">...</span><span data-page=' + pageTatol + '>' + pageTatol + '</span>')
                        } else if (settings.page > pageTatol - 4) {
                            this.pageList.push('<span data-page="1">1</span><span data-page="none">...</span>');
                            for (var i = pageTatol - 4; i <= pageTatol; i++) {
                                this.creatHtml(i)
                            }
                        } else {
                            this.pageList.push('<span data-page="1">1</span><span data-page="none">...</span>');
                            for (var i = settings.page - 2; i <= Number(settings.page) + 2; i++) {
                                this.creatHtml(i)
                            }
                            this.pageList.push('<span data-page="none">...</span><span data-page=' + pageTatol + '>' + pageTatol + '</span>')
                        }
                    }
                    if (settings.showPN) {
                        settings.page == pageTatol ? this.pageList.push('<span class="span-disabled" data-page="next">' + settings.nextPage + '</span>') : this.pageList.push('<span data-page="next">' + settings.nextPage + '</span>')
                    }
                    pageArr.push(this.pageList.join(''));
                    pageArr.push('</div>');
                    if (settings.showSkip) {
                        pageArr.push('<div class="page_skip">跳至 <input type="text" /> 页  <span data-page="go">确定</span></div>')
                    }
                    this.element.append(pageArr.join(''));
                    if (settings.showSkip) {
                        this.element.children(".page_skip").children("input").val(settings.page)
                    }
                },
                clickBtn: function () {
                    var that = this;
                    var settings = this.settings;
                    var ele = this.element;
                    var pageTatol = Math.ceil(settings.total / settings.pageSize);
                    this.element.off('click', "span");
                    this.element.on('click', "span", function () {
                        var pageText = $(this).data("page");
                        switch (pageText) {
                            case "prev":
                                settings.page = settings.page - 1 >= 1 ? settings.page - 1 : 1;
                                pageText = settings.page;
                                break;
                            case "next":
                                settings.page = Number(settings.page) + 1 <= pageTatol ? Number(settings.page) + 1 : pageTatol;
                                pageText = settings.page;
                                break;
                            case "none":
                                return;
                            case "go":
                                var p = parseInt(ele.children(".page_skip").children("input").val());
                                if (/^[0-9]*$/.test(p) && p >= 1 && p <= pageTatol) {
                                    settings.page = p;
                                    pageText = p
                                } else {
                                    return
                                }
                                break;
                            default:
                                settings.page = pageText
                        }
                        if (pageText == that.pageNum) {
                            return
                        }
                        that.pageNum = settings.page;
                        that.viewHtml();
                        settings.backFun(pageText)
                    });
                    this.element.on('keyup', "input", function (event) {
                        if (event.keyCode == 13) {
                            var p = parseInt(ele.children(".page_skip").children("input").val());
                            if (/^[0-9]*$/.test(p) && p >= 1 && p <= pageTatol) {
                                settings.page = p;
                                that.pageNum = p;
                                that.viewHtml();
                                settings.backFun(p)
                            } else {
                                return
                            }
                        }
                    })
                }
            }
            new Plugin(ele,options)
        },
        switch:function(options){
            if(!options.ele) throw new Error('请选择节点');
            var defaultOption={
                value:false,
                text:false,
                disabled:true,
                change:function(){

                }
            }
            var opt = $.extend({},defaultOption,options);
            if(! opt.change instanceof Function) throw new Error('change 必须是函数')
            $this = $(opt.ele);
            if(opt.disabled){
                $this.css({
                     cursor:'not-allowed'
                 })
             }
            $this.addClass('ui_switch');
             if(opt.value){
                $this.addClass('is_true')
             };
            $this.html('<div class="point"></div>');
 
             let a=   $this.on('click',function(){
                 if(!opt.disabled){
                     $(this).toggleClass('is_true');
                     opt.value = !opt.value;
                     opt.change(opt.value);
                 }
             })
            var obj = {
                isOpen:function(){
                    return $this.hasClass('is_true')
                }
            }
            return obj
          
        },
        // 下拉选择框
        select:function(options){
            if(!options.ele) throw new Error('请选择节点');
            var defaultOption = {
                multiple:false,
                disabled:false,
                filterable:true,
                name:'selectName',
                data:[],
                change:function(){
                },
                clearable:true
            };
            if (!options.ele) throw new Error('请确定节点');
            var $this = $(options.ele);
            var opt = $.extend({}, defaultOption, options);
            if (!opt.data instanceof Array) return;
            var str = '<select class="ui_select_origin" name="'+opt.name+'">';
            var $container = $('<div class="ui_select_container"></div>');
            var $input = $('<div class="input_box"><input type="text" autocomplete="off" readonly placeholder="请选择"><i class="icon"></i></div>')
            var $list = $('<ul class="list"></ul>')
            var item = '';
            $.each(opt.data,function(index,el){
                str+='<option value="'+el.value+'" '+(el.selected?'selected':' ')+'>'+el.label+'</option>';
                item+= '<li class="'+(el.selected?'is_select': ' ')+'" data-value="'+el.value+'"  data-label="'+el.label+'">'+el.label+'</li>'
                if(el.selected){
                    $input.children().first().val(el.label)
                }
            });
            str+='</select>';
            $this.html(str);
            $list.html(item)
            $container.append($input).append($list);
            $this.append($container);
            var $opt = $('option',$this);
            $input.bind('click',function(){
                if (event.stopPropagation) {   
                    // 针对 Mozilla 和 Opera   
                    event.stopPropagation();   
                }else if (window.event) {   
                    // 针对 IE   
                    window.event.cancelBubble = true;   
                }
                $list.show()
            })
             $('li',$list).each(function(index,el){
                $(el).on('click',function(event){
                  
                    var val = $(this).data('value');
                    $('select option[value="'+val+'"]',$this).attr('selected',true).siblings('option').removeAttr('selected')
                    $(this).addClass('is_select').siblings().removeClass('is_select');
                    $list.hide();
                    $input.children().first().val($(this).data('label'))
                })
            });
            // 点击其他区域隐藏列表
            $(document).click(function(){
               $list.hide()
            })
        },
        // 弹窗
        msgbox:function(){
            return Methods.msgbox.call(this, null, arguments)
        }

    }
    $.each(['success', 'warning', 'info', 'error'], function (index, el) {
        UI.message[el] = function () {
            return Methods.message(el, arguments)
        };
        UI.notify[el] = function () {
            return Methods.notify(el, arguments)
        };
    });
    $.each(['alert', 'confirm', 'prompt'], function (index, el) {
        UI.msgbox[el] = function () {
            return Methods.msgbox(el, arguments)
        };

    })

    UI.message['close'] = function (target) {
        $(target || '.ui_message_container').animate({
            opacity: 0,
            marginTop: '-60px'
        }, 400, function () {
            var onClose = $(this).data('ui-message-onClose')
            if (onClose) { onClose(); }
            $(this).remove();
            var size = $('.ui_message_container').length;
            if (!size) { $('.ui_message').remove() }
        })
    }
    UI.notify['close'] = function (target) {
        $(target || '.ui_notify').animate({
            opacity: 0,
            top: '-100px '
        }, 400, function () {
            var onClose = $(this).data('ui-notify-onClose')
            if (onClose) { onClose(); }
            $(this).remove();
            var $container = $('.ui_notify')
            $container.each(function (index, el) {
                var h = $(el).outerHeight();
                $(el).css({
                    top: ((h + 10) * index) + 'px'
                })
            })
        })
    }
    $(function () {
        // check 样式显示
        $('label.ui_checkbox').each(function (index, el) {
            var $this = $(this);
            var checkbox = $this.find('input[type="checkbox"]')
            if (checkbox.length == 1) {
                var label = $('input', $this).attr('label')
                $this.append('<span class="check_icon"></span><span class="check_label">' + label + '</span>');
            }
            if (checkbox.attr('checked')) {
                $this.addClass('is_checked')
            }
            $(el).on('click', function () {
                $(this).toggleClass('is_checked');
                if ($(this).hasClass('is_checked')) {
                    $('input', this).attr('checked', true);
                } else {
                    $('input', this).removeAttr('checked')
                }
            })
        })
        // radio 样式显示
        $('label.ui_radio').each(function (index, el) {
            var $this = $(this);
            var checkbox = $this.find('input[type="radio"]');
            if (checkbox.length == 1) {
                var $wrap = $('<span class="ui_radio_input"></span>');
                checkbox.after($wrap.append('<span class="ui_radio_icon"></span>'))
                var label = $('input', $this).attr('label');
                $this.append('<span class="ui_radio_label">' + label + '</span>');
            }
            if (checkbox.attr('checked')) {
                $this.addClass('is_checked')
            };
            $(el).click(function(){
                $(this).addClass('is_checked').siblings().removeClass('is_checked');
                $(this).children('input').attr('checked',true);
                $(this).siblings().children('input').removeAttr('checked')
            })
        });

    })






    return UI
}))