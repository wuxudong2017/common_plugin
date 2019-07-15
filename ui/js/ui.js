; (function (global, factory) {
    // amd 判断
    if (typeof define === 'function' && define.amd) {
        define('UI', ['jquery'], factory)
    } else if (typeof module !== "undefined" && typeof exports === "object") {
        module.exports = factory(require('jquery'));
    } else {
        globalThis.UI = factory(global.jQuery)
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
                message: 'hello World',
                duration: 2000,
                showClose: true,
                onClose() {
                    console.log('close')
                },
                position: 'to-right'
            }, size = arg.length, options = {};
            if (!size) return;
            if (arg[0] instanceof Object) {
                options = arg[0]
            } else {
                throw new Error('参数格式不正确')
            }
            if (type) {
                opt.type = type
            }
            var opt = $.extend({}, defaultOption, options);
            $wrap = $('<div class="ui_notify" style="right:0"><div class="' + opt.type + '">' +
                '<div class="icon"><i class="iconfont icon-' + opt.type + '"></i></div>' +
                '<div class="group"><h2 class="title">' + opt.title + '</h2> <div class="content"><p>' + opt.message + '</p></div>'
                + '</div></div>');
            $body.append($wrap);
            $container = $('.ui_notify');
            if (opt.showClose) {
                var $close = $('<div class="ui_notify_close"><i class="iconfont icon-close-fill"></i></div>');
                $container.children().append($close)
            }
            
            $container.each(function (index, el) {
                var h = $(el).outerHeight();
                console.log(h)
                $(el).css({
                    top:(h*index)+'px'
                })
                // 手动关闭
                var $close = $(el).find('.ui_notify_close');
                if ($close) {
                    $close.bind('click', function () {
                        UI.notify.close($close.parents('.ui_notify'))
                    })
                }
            })
            // 存储 close 函数
            if (typeof opt.onClose == 'function') {
                $container.data('ui-notify-onClose', opt.onClose)
            }
            // 定时自动关闭
            if (typeof opt.duration == 'number' && opt.duration > 1000) {
                var time = setTimeout(function () {
                    clearTimeout(time)
                    UI.message.close($container)
                }, opt.duration)
            }


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
                    '<span class="ui_radio_input"><span class="ui_radio_icon"></span><input type="radio"  class="ui_radio_original" name="' + (item.name) + '" value="' + (item.value) + '"' + (item.checked ? 'checked' : ' ') + ' ></span><span class="ui_radio_label">' + (item.label) + '</span></label>'
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
        }
    }
    $.each(['success', 'warning', 'info', 'error'], function (index, el) {
        UI.message[el] = function () {
            return Methods.message(el, arguments)
        };
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
        },
            UI.notify['close'] = function (target) {
                $(target || '.ui_notify').animate({
                    opacity: 0,
                    top:'-100px '
                }, 400, function () {
                    var onClose = $(this).data('ui-notify-onClose')
                    if (onClose) { onClose(); }
                    $(this).remove();
                    var size = $('.ui_notify').length;
                    if (!size) { $('.ui_notify').remove() }
                })
            }
    });
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

                checkbox.wrap($wrap.append('<span class="ui_radio_icon"></span>'))
                var label = $('input', $this).attr('label');
                $this.append('<span class="ui_radio_label">' + label + '</span>');
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

    })






    return UI
}))