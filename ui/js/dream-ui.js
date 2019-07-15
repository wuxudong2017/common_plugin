/*!
 *  DreamUI v1.0.2
 *  Copyright (C) 2019, ZhaoGang
 *  Released under the MIT license.
 */
!(function ( global, factory ) {

	if ( typeof define === "function" && define.amd ) { 
		define( "dreamui", [ "jquery" ], factory );
	} else if ( typeof module !== "undefined" && typeof exports === "object" ) {
		module.exports = factory( require( "jquery" ) );
	} else {
		global.UI = factory( global.jQuery );
	}

})( typeof window !== "undefined" ? window : this, function ( $ ) {

	"use strict";

	// 检测 jquery
	if ( typeof jQuery === "undefined" ) {
		throw new Error( "请在 DreamUI 前先引入 jQuery" );
	}
	var jqVersion = $.fn.jquery;
	// if ( ~~jqVersion.charAt( 0 ) < 3 ) {
	// 	throw new Error( "DreamUI 要求 jQuery 的版本不能低于 3.0.0【 当前 jQuery 版本：" + jqVersion + " 】" );
	// }

	// 存储 window 和 document 对象
	var $window = $( window ),
		$document = $( document );

	// IE11
	var UA = navigator.userAgent.toLowerCase();
	var IE11 = UA.match( "trident" );

	// jQuery 事件扩展
	function triggerEvent ( obj, eventType, event, param ) {
        var originalType = event.type;
        event.type = eventType;
        $.event.dispatch.call( obj, event, param );
        event.type = originalType;
    }

    // 用于实时监听输入框值的变化 
    // 排除了拼音输入时的干扰
    $.event.special.valueChange = {
        setup: function () {
            var spell = false;
            $( this ).on({
                compositionstart: function () {
                    spell = true;
                },
                compositionend: function () {
                    spell = false;
                    $( this ).trigger( "input" );
                },
                input: function ( event ) {
                    if ( !spell ) {
                        triggerEvent( this, "valueChange", event, $( this ).val() );
                    }
                }
            });
        }   
    };

    $.fn.extend({
    	valueChange: function ( callback ) {
    		return this.on( "valueChange", callback );
    	},

    	// 判断处于动画中 ( 仅适用于下面的 animation 动画 )
    	inAnimation: function () {
    		return $( this ).data( "extend-in-animation" ) || false;
    	},

    	// 动画扩展
    	animation: function ( _props, _duration, _easing, _callback ) {

			// 参数整合
			var arg = arguments,
				lastArg = arg[ arg.length - 1 ],
				props, 
				duration, 
				easing, 
				callback;
			props = _props;
			duration = $.isNumeric( _duration ) ? _duration : 400;
			easing = typeof _duration === "string" ? _duration : ( typeof _easing === "string" ? _easing : "ease" );
			callback = $.isFunction( lastArg ) ? lastArg : $.noop;
			var options = {
				props: props,
				duration: duration,
				easing: easing,
				callback: callback
			};

			// 时间曲线
			var easeMap = {
				linear: "(0.25, 0.25, 0.75, 0.75)",
			    ease: "(0.25, 0.1, 0.25, 1)",
			    easeIn: "(0.42, 0, 1, 1)",
			    easeOut: "(0, 0, 0.58, 1)",
			    easeInOut: "(0.42, 0, 0.58, 1)",
			    easeInQuad: "(0.55, 0.085, 0.68, 0.53)",
			    easeInCubic: "(0.55, 0.055, 0.675, 0.19)",
			    easeInQuart: "(0.895, 0.03, 0.685, 0.22)",
			    easeInQuint: "(0.755, 0.05, 0.855, 0.06)",
			    easeInSine: "(0.47, 0, 0.745, 0.715)",
			    easeInExpo: "(0.95, 0.05, 0.795, 0.035)",
			    easeInCirc: "(0.6, 0.04, 0.98, 0.335)",
			    easeInBack: "(0.6, -0.28, 0.735, 0.045)",
			    easeOutQuad: "(0.25, 0.46, 0.45, 0.94)",
			    easeOutCubic: "(0.215, 0.61, 0.355, 1)",
			    easeOutQuart: "(0.165, 0.84, 0.44, 1)",
			    easeOutQuint: "(0.23, 1, 0.32, 1)",
			    easeOutSine: "(0.39, 0.575, 0.565, 1)",
			    easeOutExpo: "(0.19, 1, 0.22, 1)",
			    easeOutCirc: "(0.075, 0.82, 0.165, 1)",
			    easeOutBack: "(0.175, 0.885, 0.32, 1.275)",
			    easeInOutQuad: "(0.455, 0.03, 0.515, 0.955)",
			    easeInOutCubic: "(0.645, 0.045, 0.355, 1)",
			    easeInOutQuart: "(0.57, 0, 0.35, 1)",
			    easeInOutQuint: "(0.86, 0, 0.07, 1)",
			    easeInOutSine: "(0.445, 0.05, 0.55, 0.95)",
			    easeInOutExpo: "(1, 0, 0, 1)",
			    easeInOutCirc: "(0.785, 0.135, 0.15, 0.86)",
			    easeInOutBack: "(0.68, -0.55, 0.265, 1.55)"
			};
			if ( easeMap[ options.easing ] ) {
				options.easing = "cubic-bezier" + easeMap[ options.easing ];
			}

			var transitionParam = [ "transitionDuration", "transitionProperty", "transitionTimingFunction", "transition" ];

			// 动画函数
			function Animation ( $target, options ) {

				// 添加动画标识
				$target.data( "extend-in-animation", true );

				// 存储行内设置的 transition
				var transitionCache = {};
				var target = $target.get( 0 );
				$.each(transitionParam, function ( item, name ) {
					transitionCache[ name ] = target.style[ name ];
				})

				// 判断动画是否结束
				var end = false;

				// 添加过渡属性
				$target.css({
					transitionDuration: options.duration + "ms",
					transitionProperty: Object.keys( options.props ).join(),
					transitionTimingFunction: options.easing
				});

				var timer = window.setTimeout(function () {
					window.clearTimeout( timer );

					// 设置动画
					$target.css( options.props ).on("transitionend", function () {
						end = true;
						if ( end ) {
							$target.off( "transitionend" ).css( transitionCache ).removeData( "extend-in-animation" );

							// 执行回调函数
							options.callback.call( $target );

							// 判断是否含有动画
							$target[ $target.queue().length > 1 ? "dequeue" : "clearQueue" ]();
						}
					});
				}, 0);
			}

			return this.each(function () {
				var $this = $( this );
				$this.queue(function () {
					Animation( $this, options );
				});
			})
		}
    });

	// 内部用到的图标
	var Icon = {
		decrease: function ( w, h, color ) {
			return '<svg viewBox="0 0 1024 1024" version="1.1" width="' + ( w || 16 ) + '" height="' + ( h || 16 ) + '"><path d="M768.440022 485.814618c0 14.475689-11.743462 26.185382-26.200732 26.185382l-460.467323 0c-14.458293 0-26.167986-11.70867-26.167986-26.185382l0 0c0-14.458293 11.70867-26.183336 26.167986-26.183336l460.467323 0C756.697583 459.631282 768.440022 471.356324 768.440022 485.814618L768.440022 485.814618z" fill="' + ( color || "#000" ) + '"></path></svg>';
		},
		increase: function ( w, h, color ) {
			return '<svg viewBox="0 0 1024 1024" version="1.1" width="' + ( w || 16 ) + '" height="' + ( h || 16 ) + '"><path d="M740.828151 485.179145 538.820344 485.179145 538.820344 283.185664c0-14.81645-11.989055-26.820855-26.820855-26.820855-14.769378 0-26.790156 12.004405-26.790156 26.820855l-0.013303 201.99348L283.200502 485.179145c-14.801101 0-26.820855 12.019755-26.820855 26.820855 0 14.81645 12.019755 26.819832 26.820855 26.819832l201.991434 0-0.013303 201.994504c0 14.800078 12.051477 26.821879 26.820855 26.821879 14.8318 0 26.820855-12.021801 26.820855-26.821879L538.820344 538.819832l201.979154 0c14.8318 0 26.820855-12.003382 26.820855-26.819832S755.631298 485.179145 740.828151 485.179145z" fill="' + ( color || "#000" ) + '"></path></svg>';
		},
		close: function ( w, h, color ) {
			return '<svg viewBox="0 0 1024 1024" version="1.1" width="' + ( w || 16 ) + '" height="' + ( h || 16 ) + '"><path d="M806.4 172.8l-633.6 633.6c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 32 12.8 44.8 0l633.6-633.6c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0z" fill="' + ( color || "#000" ) + '"></path><path d="M172.8 172.8c-12.8 12.8-12.8 32 0 44.8l633.6 633.6c12.8 12.8 32 12.8 44.8 0 12.8-12.8 12.8-32 0-44.8L217.6 172.8c-12.8-12.8-32-12.8-44.8 0z" fill="' + ( color || "#000" ) + '"></path></svg>';
		},
		info: function ( w, h ) {
			return '<svg viewBox="0 0 1024 1024" version="1.1" width="' + ( w || 30 ) + '" height="' + ( h || 30 ) + '"><path d="M513.46384 60.225663c-248.292969 0-449.584462 201.299679-449.584462 449.625394 0 248.296039 201.291492 449.594695 449.584462 449.594695 248.28069 0 449.63665-201.299679 449.63665-449.594695C963.099467 261.525342 761.744529 60.225663 513.46384 60.225663zM554.626331 714.465225c0 22.720468-18.416442 41.139979-41.136909 41.139979s-41.136909-18.419512-41.136909-41.139979L472.352513 453.586612c0-22.716374 18.416442-41.135886 41.136909-41.135886s41.136909 18.419512 41.136909 41.135886L554.626331 714.465225zM513.489422 372.423081c-25.719778 0-46.561455-20.845771-46.561455-46.557362 0-25.719778 20.841677-46.560432 46.561455-46.560432s46.561455 20.841677 46.561455 46.560432C560.050878 351.577311 539.2092 372.423081 513.489422 372.423081z" fill="#19b6f8"></path></svg>';
		},
		success: function ( w, h ) {
			return '<svg viewBox="0 0 1024 1024" version="1.1" width="' + ( w || 30 ) + '" height="' + ( h || 30 ) + '"><path d="M513.559007 60.225663c-248.299109 0-449.587532 201.299679-449.587532 449.625394 0 248.296039 201.288422 449.594695 449.587532 449.594695 248.27762 0 449.63358-201.299679 449.63358-449.594695C963.192587 261.525342 761.836627 60.225663 513.559007 60.225663zM766.338151 407.245168 485.919507 692.261527c-0.044002 0.045025-0.084934 0.092098-0.127913 0.137123s-0.090051 0.085958-0.134053 0.12996l-0.751107 0.763386c-6.256494 6.359848-14.548344 9.5454-22.967084 9.597589-0.061398 0.001023-0.121773 0.001023-0.183172 0.002047-0.161682 0-0.322341 0.004093-0.485047 0.002047-8.398274 0.068562-16.715707-2.979868-23.057135-9.217942L282.51591 540.491914c-12.999059-12.791327-12.775978-34.097586 0.49835-47.590901 13.281491-13.494339 34.58468-14.06739 47.576575-1.276063l130.36921 128.264269 256.507048-260.722046c12.797467-12.999059 34.100656-12.771885 47.591925 0.502443C778.555403 372.942921 779.129478 394.243039 766.338151 407.245168z" fill="#08ba61"></path></svg>';
		},
		warn: function ( w, h ) {
			return '<svg viewBox="0 0 1024 1024" version="1.1" width="' + ( w || 30 ) + '" height="' + ( h || 30 ) + '"><path d="M513.46384 60.225663c-248.291946 0-449.584462 201.299679-449.584462 449.624371 0 248.296039 201.292516 449.594695 449.584462 449.594695 248.28069 0 449.63665-201.299679 449.63665-449.594695C963.099467 261.525342 761.744529 60.225663 513.46384 60.225663zM473.683834 304.175721c2.690272-35.478026 40.597627-32.423457 40.597627-32.423457s34.488489-2.288113 39.011502 32.225959c0 0 8.162914 181.774997-15.904225 294.366308 0 0-3.746324 14.944364-23.107277 16.22145l0 0.275269c-20.751626-0.539282-24.692379-16.296151-24.692379-16.296151C465.521944 485.947647 473.683834 304.175721 473.683834 304.175721zM513.489422 747.984642c-25.719778 0-46.560432-20.840654-46.560432-46.560432 0-25.710568 20.840654-46.556339 46.560432-46.556339s46.561455 20.845771 46.561455 46.556339C560.050878 727.143988 539.2092 747.984642 513.489422 747.984642z" fill="#f39509"></path></svg>';
		},
		error: function ( w, h ) {
			return '<svg viewBox="0 0 1024 1024" version="1.1" width="' + ( w || 30 ) + '" height="' + ( h || 30 ) + '"><path d="M513.559007 60.225663c-248.291946 0-449.587532 201.299679-449.587532 449.625394 0 248.291946 201.295586 449.594695 449.587532 449.594695 248.284783 0 449.632557-201.303772 449.632557-449.594695C963.191564 261.525342 761.84379 60.225663 513.559007 60.225663zM678.729837 644.059712c12.798491 13.003152 12.217253 34.302247-1.272993 47.575552-13.490246 13.275351-34.800597 13.502525-47.590901 0.503467l-116.284423-118.191866-116.278283 118.187773c-12.798491 13.003152-34.093493 12.774955-47.590901-0.499373-13.497409-13.277398-14.063297-34.576493-1.279133-47.575552l117.065206-118.984928L348.433202 406.088832c-12.783141-12.999059-12.218276-34.298154 1.279133-47.576575 13.497409-13.274328 34.792411-13.501502 47.590901-0.49835l116.279307 118.187773 116.2834-118.190843c12.790304-12.999059 34.100656-12.771885 47.590901 0.502443 13.491269 13.274328 14.071484 34.573423 1.272993 47.576575L561.666678 525.07376 678.729837 644.059712z" fill="#d81e06"></path></svg>';
		},
		arrow: function ( w, h ) {
			return '<svg viewBox="0 0 1024 1024" version="1.1" width="' + ( w || 30 ) + '" height="' + ( h || 30 ) + '"><path d="M523.955 832.173l323.744-512c6.24-9.856 6.624-22.336 0.992-32.512-5.632-10.24-16.384-16.576-28.033-16.576h-647.328c-11.647 0-22.4 6.336-28.033 16.576-2.656 4.8-3.968 10.112-3.968 15.424 0 5.952 1.664 11.904 4.929 17.088l323.616 512c5.856 9.28 16.064 14.911 27.040 14.912s21.184-5.632 27.040-14.912z" fill="#000"></path></svg>';
		},
		arrowLine: function ( w, h ) {
			return '<svg viewBox="0 0 1024 1024" version="1.1" width="' + ( w || 30 ) + '" height="' + ( h || 30 ) + '"><path d="M948.560332 281.179984c-13.765515-13.833053-36.127825-13.833053-49.89334 0L511.991302 668.591431 125.313565 281.179984c-13.763468-13.798261-36.093033-13.798261-49.856501 0-13.799284 13.798261-13.799284 36.161594 0 49.993624l410.857439 411.674037c7.067976 7.085372 16.402575 10.521634 25.675776 10.331299 9.274224 0.191358 18.608823-3.245927 25.677822-10.331299l410.891208-411.708829c6.863315-6.89913 10.331299-15.940041 10.331299-24.979928S955.423647 288.078091 948.560332 281.179984z" fill="#000"></path></svg>'
		}
	};

	// 组件中用到的方法
	var Methods = {
		addZero: function ( str ) {
    		str = str + "";
			return str.length < 2 ? "0" + str : str;
		},
		datePicker: function ( value ) {

            // 时间对象
            var DateObj = new Date();
            var getNow = [ 
            	DateObj.getFullYear(),
            	DateObj.getMonth() + 1,
            	DateObj.getDate()
            ];
            var y = value ? value[ 0 ] : getNow[ 0 ],
                m = value ? value[ 1 ] : getNow[ 1 ], 
                d = value ? value[ 2 ] : getNow[ 2 ];

            // 判断当前月份第一天是星期几
            var firstday = new Date( y, m - 1, 1 ).getDay();

            // 判断闰年
            var leapYear = function ( y ) {
            	return ( y % 100 == 0 ) ? ( y % 400 == 0 ? 1 : 0 ) : ( y % 4 == 0 ? 1 : 0 );
            }

            // 每月天数数组
            var daysArray = [ 31, 28 + leapYear( y ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

            // 得到日期
            var days = "";
            for ( var i = 0; i < daysArray[ m - 1 ]; i++ ) {
                days += '<i class="ui-datepicker-days" data-day="' + ( i + 1 ) + '">' + ( i + 1 ) + '</i>';
            }

            // 对于月份的第一天不是星期一的情况, 在前面添加占位
            if ( firstday > 0 ) {
                days = new Array( firstday + 1 ).join( "front" ) + days;
            }

            // 补前空位
            var _str = "";
            var size = days.split( "front" ).length - 1;
            var num = ( m - 1 === 2 ) ? ( 28 + leapYear( y ) ) : ( m - 1 > 1 ) ? ( [ 1, 3, 5, 7, 8, 10, 12 ].indexOf( m - 1 ) > -1 ? 31 : 30 ) : 31;
            if ( size ) {
                for ( var i = num - size + 1; i < num + 1; i++ ) {
                    _str += '<i class="ui-datepicker-placeholder">' + i + '</i>';
                }
            }

            // 补后空位
            var str_ = "";
            for ( var i = 0, j = 42 - days.split( "class" ).length + 1 - size; i < j; i++ ) {
                str_ += '<i class="ui-datepicker-placeholder">' + ( i + 1 ) + '</i>';
            }

            return {
                days: _str + days.replace( /front/g, "" ) + str_,
                result: [ y, m, d ],
                today: getNow
            };
        },
        dialogShortcuts: function ( type, title, content ) {
        	UI.dialog({
				SHORTCUTS: {
					type: type,
					title: title,
					content: content
				}
			});
        },
        message: function ( type, arg ) {

			// 参数修整
			var size = arg.length,
				options = {};
			if ( !size ) {
				return;
			}
			if ( $.isPlainObject( arg[ 0 ] ) ) {
				options = arg[ 0 ];
			} else {
				options.content = arg[ 0 ];
			}

			// 默认配置
			var defaults = {
				autoClose: 2000,
				closable: false,
				afterClose: $.noop
			};
			var opt = $.extend( {}, defaults, options );

			// 添加提醒
			if ( !$( ".ui-message-container" ).length ) {
				$( "body" ).append( '<div class="ui-message-container"></div>' );
			}
			var $container = $( ".ui-message-container" );
			$container.append(
				'<div class="ui-message-wrapper">' + 
					'<div class="ui-message-icon">' + Icon[ type ]() + '</div>' + 
					'<div class="ui-message-content"></div>' + 
				'</div>'
			);

			var $wrapper = $container.children().last(),
				$icon = $wrapper.find( "svg" ),
				$content = $wrapper.find( ".ui-message-content" );

			$icon.attr({
				width: 18,
				height: 18
			});
			$content.text( opt.content );

			// 手动关闭
			if ( opt.closable ) {
				$content.after( '<div class="ui-message-close">' + Icon.close() + '</div>' ).next().click(function () {
					UI.message.close( $wrapper );
				});
			}

			// 存储 afterClose 事件
			// 便于在 close 方法中调用
			if ( $.isFunction( opt.afterClose ) ) {
				$wrapper.data( "ui-message-afterclose", opt.afterClose );	
			}

			// 计算宽度
			var wrapperWidth = 0;
            $wrapper.children().each(function () {
                wrapperWidth += $( this ).outerWidth( true );
            }).end().width( wrapperWidth + 5 );

            // 显示提醒
			$wrapper.addClass( "ui-message-show" ).on("animationend", function () {

				// 自动关闭
				if ( $.isNumeric( opt.autoClose ) && opt.autoClose > 1000 ) {
					var timer = window.setTimeout(function () {
						window.clearTimeout( timer );
						UI.message.close( $wrapper );
					}, ~~opt.autoClose);
				}
			})
			return $wrapper;
		},
		notice: function ( type, arg ) {

			// 参数修整
			var size = arg.length,
				options = {};
			if ( !size ) {
				return;
			}
			if ( $.isPlainObject( arg[ 0 ] ) ) {
				options = arg[ 0 ];
			} else {
				options.title = arg[ 0 ];
			}

			// 默认配置
            var defaults = {
                title: "",
                content: "",
                autoClose: 5000,
                closable: false,
                afterClose: $.noop
            };
            var opt = $.extend( {}, defaults, options );

            if ( !$( ".ui-notice-container" ).length ) {
                $( "body" ).append( '<div class="ui-notice-container"></div>' );
            }
            var $container = $( ".ui-notice-container" );
            $container.append(
                '<div class="ui-notice-wrapper">' + 
                    '<div class="ui-notice-icon">' + Icon[ type ]() + '</div>' + 
                    '<div class="ui-notice-box">' + 
                        '<p class="ui-notice-title"></p>' + 
                        '<p class="ui-notice-content"></p>' + 
                    '</div>' + 
                '</div>'
            );

            var $wrapper = $container.find( ".ui-notice-wrapper" ).last(),
            	$content = $container.find( ".ui-notice-content" );

            $wrapper.find( "svg" ).attr({
            	width: 18,
            	height: 18
            });
            $wrapper.find( ".ui-notice-box > p" ).first().html( opt.title );
            if ( !opt.content ) {
                $content.remove();
            } else {
                $content.html( opt.content );
            }

            // 手动关闭
            if ( opt.closable ) {
                $wrapper.append( '<div class="ui-notice-close">' + Icon.close() + '</div>' ).find( ".ui-notice-close" ).click(function () {
                	UI.notice.close( $wrapper );
                });
            } else {
                $wrapper.find( ".ui-notice-box" ).css( "width", "calc(100% - 30px)" );
            }

            // 存储 afterClose 事件
			// 便于在 close 方法中调用
			if ( $.isFunction( opt.afterClose ) ) {
				$wrapper.data( "ui-notice-afterclose", opt.afterClose );	
			}

            // 显示通知
            $wrapper.addClass( "ui-notice-show" ).on("animationend", function () {

                // 自动关闭
                if ( $.isNumeric( opt.autoClose ) && opt.autoClose > 1000 ) {
                    var timer = window.setTimeout(function () {
						window.clearTimeout( timer );
						UI.notice.close( $wrapper );
					}, ~~opt.autoClose);
                }
            });
            return $wrapper;
		},
		progress: function ( id ) {
			return '<div class="ui-progress-container" data-id="' + id + '">' +
				'<div class="ui-progress-box"><div></div></div>' +
				'<div class="ui-progress-result">等待</div>' +
			'</div>';
		},
		randomID: function () {
			return Math.random().toString( 36 ).substr( 2 );
		}
	};

	var UI = {
		version: "1.0.2",
		autoComplete: function ( selector, options ) {
			var defaults = {
				placeholder: "",
				width: "auto",
				id: "",
				name: "",
				clear: false,
				data: $.noop
			};
			var opt = $.extend( {}, defaults, options );

			return $( selector ).each(function () {
				var $this = $( this );

				// 添加组件
				$this.html(
					'<div class="ui-autocomplete-container">' +
						'<input type="text" autocomplete="off" spellcheck="false">' +
						'<div class="ui-autocomplete-wrapper ui-noselect"></div>' +
					'</div>'
				);

				var $container = $this.children(),
					$input = $container.children().first(),
					$wrapper = $input.next();

				// 设置组件宽度
				$container.outerWidth( opt.width );

				// 添加 clear 按钮
				if ( opt.clear ) {
					$container.append( '<div class="ui-autocomplete-clear">' + Icon.close( 10, 10, "#fff" ) + '</div>' );
					$input.css({
						width: "calc(100% - 36px)",
						paddingRight: "26px",
						minWidth: "164px"
					});
				}
				var $clear = $container.find( ".ui-autocomplete-clear" );
				$clear.hide();

				// 结果列表
				function result ( data ) {
					var list = "";
					$.each(data, function ( i, text ) {
						list += '<li data-text="' + text + '">' + text + '</li>';
					})
					return "<ul>" + list + "</ul>";
				}

				// 清空并隐藏结果列表
				function wrapperHide () {
					$wrapper.empty().hide();
				}

				// 请求结果
				function request ( value ) {

					// opt.data 函数中要将 $.ajax() 整体返回
					// 以便于此处通过 done 和 fail 方法调用
					opt.data( value ).done(function ( data ) {
						if ( Array.isArray( data ) && data.length ) {

							// 有数据则显示结果列表
							// 后台返回的 data 必须是数组形式
							$wrapper.html( result( data ) ).show();

						} else {
							wrapperHide();
						}
					}).fail(function ( error ) {
						console.error( error );
						wrapperHide();
					})
				}

				$input.attr({
					id: opt.id,
					name: opt.name,
					placeholder: opt.placeholder
				}).on({
					focus: function () {
						var inputValue = $input.val();

						// 当输入框获得焦点时
						// 如果输入框已经有值
						// 则自动发送请求
						if ( inputValue ) {
							request( inputValue );
							$clear.show();
						}
					},

					// 调用 DreamUI 提供的 valueChange 扩展
					// 检测输入框值的变化
					valueChange: function ( event, value ) {
						if ( !value ) {
							wrapperHide();
							$clear.hide();
						} else {
							request( value );
							$clear.show();
						} 
					}
				});

				// 清空输入框内容
				$clear.click(function () {
					$input.val( "" ).focus();
					$clear.hide();
					wrapperHide();
				})

				// 选择结果
				$wrapper.on("click", "li", function () {
					$input.val( $( this ).attr( "data-text" ) );
					wrapperHide();
				})

				// 点击非目标区域隐藏结果列表
				$document.on("click contextmenu", function ( event ) {
					if ( !$container.is( event.target ) && !$container.has( event.target ).length ) {
						wrapperHide();
					}
				})
			})
		},
		carousel: function ( selector, options ) {
    		var defaults = {
    			effect: "slide",
    			arrow: true,
    			dot: true,
    			autoPlay: 0,
    			duration: 700,
    			dotEventType: "click"
    		};
    		var opt = $.extend( {}, defaults, options ); 

    		$( selector ).each(function () {
    			var $this = $( this ),
    				$child = $this.children();
    			var size = $child.length;

    			// 给目标元素设置定位
    			if ( $this.css( "position" ) === "static" ) {
    				$this.css( "position", "relative" );
    			}

    			// 创建包裹层
    			$child.wrapAll(
    				'<div class="ui-carousel-container">' +
						'<div class="ui-carousel-wrapper"></div>' +
    				'</div>'
    			);

    			var $container = $this.find( ".ui-carousel-container" ).first(),
    				$wrapper = $this.find( ".ui-carousel-wrapper" ).first();
    			
    			var dis = 0;
    			if ( opt.effect === "slide" ) {
    				dis = 100 / ( size + 2 );
    				$wrapper
    					.addClass( "ui-carousel-slide" )

    					// slide 效果需要增添头尾
    					.prepend( $child.last().clone( true ) )
    					.append( $child.first().clone( true ) )

    					.css({
    						width: ( size + 2 ) * 100 + "%",
    						transform: "translateX(-" + dis + "%)"
    					}).children().each(function ( i ) {
    						$( this ).css({
	    						width: dis + "%",
	    						marginLeft: i * dis + "%"
	    					});
    					})
    			} else {
    				$wrapper.addClass( "ui-carousel-fade" );
    				$child.hide().first().show();
    			}

    			// 箭头
    			var $prev = $( "" ),
    				$next = $( "" );
    			if ( opt.arrow === true ) {

    				// 内置箭头
    				$this.append(
    					'<div class="ui-carousel-arrow">' +
    						'<i class="ui-carousel-arrow-prev"></i>' +
    						'<i class="ui-carousel-arrow-next"></i>' +
    					'</div>'
    				);
    				$prev = $this.find( ".ui-carousel-arrow-prev" ).first();
    				$next = $this.find( ".ui-carousel-arrow-next" ).first();
    			}
    			if ( Array.isArray( opt.arrow ) && opt.arrow.length === 2 ) {

    				// 自定义箭头
    				$prev = $( opt.arrow[ 0 ] );
    				$next = $( opt.arrow[ 1 ] );
    			}

    			// 按钮
    			var $dot = $( "" );
    			if ( opt.dot === true ) {

    				// 内置按钮
    				$this.append( '<div class="ui-carousel-dot">' + new Array( size + 1 ).join( "<i></i>" ) + '</div>' );
    				$dot = $this.find( ".ui-carousel-dot" ).first();
    			}
    			if ( typeof opt.dot === "string" ) {

    				// 自定义按钮
    				$dot = $( opt.dot );
    			}
    			$dot.children().first().addClass( "active" );

    			// 按钮状态
    			function dotState ( i ) {
    				$dot.children().eq( i ).addClass( "active" ).siblings().removeClass( "active" );
    			}

    			var animated = false, 
    				cacheIndex  = 0;

    			// show 效果
    			function showAnimate ( i ) {
    				$child.eq( i ).show().siblings().hide();
    				cacheIndex = i;
    				dotState( i );
    			}

    			// fade 效果
    			function fadeAnimate ( i ) {
    				if ( !animated ) {
    					animated = true;
    					dotState( i );
    					$child.eq( i ).fadeIn(opt.duration, function () {
    						animated = false;
    						cacheIndex = i;
    					}).siblings().fadeOut( opt.duration );
    				}
    			}

    			// slide 效果
    			function slideAimate ( i ) {
    				if ( !animated ) {
    					animated = true;
    					dotState( i === size ? 0 : i );

    					// 调用 DreamUI 提供的 animation 动画方法
    					$wrapper.animation({
    						transform: "translateX(-" + dis * ( i + 1 ) + "%)"
    					}, opt.duration, "easeInOutQuart", function () {
    						animated = false;
    						cacheIndex = i;
							if ( i === -1 ) {
								$wrapper.css( "transform", "translateX(-" + dis * size + "%)" );
								cacheIndex = size - 1;
							}
							if ( i === size ) {
								$wrapper.css( "transform", "translateX(-" + dis + "%)");
								cacheIndex = 0;
							}
    					});
    				}
    			}

    			// 切换
    			function play ( i ) {
    				switch ( opt.effect ) {
	    				case "show": showAnimate( i ); break;
	    				case "fade": fadeAnimate( i ); break;
	    				case "slide": slideAimate( i ); break;
	    				default: slideAimate( i ); break;
	    			}
    			}

    			// 按钮切换
	    		var eventType = opt.dotEventType.match( /(click|mouseenter)/ ) ? opt.dotEventType : "click";
	    		$dot.children().on(eventType, function () {
	    			if ( !$( this ).hasClass( "active" ) ) {
	    				play( $( this ).index() );
	    			}
	    		})

	    		// 箭头切换
	    		$prev.click(function () {
	    			!animated && cacheIndex--;
	    			if ( cacheIndex < 0 && opt.effect !== "slide" ) {
	    				cacheIndex = size - 1;
	    			}
	    			play( cacheIndex );
	    		})
	    		$next.click(function () {
	    			!animated && cacheIndex++;
	    			if ( cacheIndex > size - 1 && opt.effect !== "slide" ) {
	    				cacheIndex = 0;
	    			}
	    			play( cacheIndex );
	    		})

	    		// 自动播放
	    		if ( $.isNumeric( opt.autoPlay ) && opt.autoPlay > 2000 ) {
	    			function fn () {
	    				cacheIndex++;
						play( cacheIndex );
	    			}
					var autoplay = window.setInterval( fn, ~~opt.autoPlay );
					$this.on({
						mouseenter: function () {
							window.clearInterval( autoplay );
						},
						mouseleave: function () {
							autoplay = window.setInterval( fn, ~~opt.autoPlay );
						}
					});
				}
    		})
		},
		checkbox: function ( selector, options ) {
            var defaults = {
                data: [],
                vertical: false,
				change: $.noop
            };
            var opt = $.extend( {}, defaults, options );
            var change = $.isFunction( opt.change );

            // 传入的数据必须是数组形式
			if ( !Array.isArray( opt.data ) || !opt.data.length ) {
				return;
			}

			// 构建 checkbox 结构
			var checkbox = "";
			$.each(opt.data, function ( i, obj ) {
				var id = "ui-checkbox-id-" + Methods.randomID();
				checkbox += 
					'<div>' +
						'<label ' + 
							'for="' + id + '" ' + 
							'class="ui-checkbox' + ( obj.checked ? " ui-checkbox-checked" : "" ) + '"' + 
						'><i></i><span>' + obj.text + '</span>' +
						'</label>' +
						'<input' +
							' type="checkbox"' +
							' value="' + obj.value + '" ' +
							' id="' + id + '" ' +
							' name="' + ( obj.name || "" ) + '" ' + ( obj.checked ? "checked" : "" ) + 
							' style="display:none;">' +
					'</div>'
				;
			})
			checkbox = '<div class="ui-checkbox-container ui-noselect' + ( opt.vertical ? " ui-checkbox-vertical" : "" ) + '">' + checkbox + '</div>';

			return $( selector ).each(function () {
				var $this = $( this );

				// 将 checkbox 结构添加到目标容器内
				$this.html( checkbox );

				var $container = $this.children();

				// 如果目标容器在 form 内
				// 则监听 reset 事件
				// 以保证在执行 reset 事件时可以恢复复选框初始状态
				var $form = $container.parents( "form" );
				if ( $form.length ) {
					$form.last().on("reset", function () {
						$this.html( checkbox );
					})
				}

				// 复选框点击事件
				$this.on("click", ".ui-checkbox", function () {

					// 改变复选框的选中状态
					$( this ).toggleClass( "ui-checkbox-checked" );

					// 执行 change 事件
					if ( change ) {
						var values = [];
						$this.find( ".ui-checkbox-checked + input" ).each(function () {
							values.push( $( this ).val() );
						})
						opt.change( values );
					}
				})
			})
		},
		collapse: function ( selector, options ) {
            var defaults = {
                accordion: false,
                active: null
            };
            var opt = $.extend( {}, defaults, options );

            $( selector ).each(function () {
                var $this = $( this ),
                    $part = $this.children();
                $this.children().addClass( "ui-collapse-part" ).each(function () {
                    $( this ).children().first().addClass( "ui-collapse-title ui-noselect" ).next().addClass( "ui-collapse-content" );
                })

                var $title = $part.children( ".ui-collapse-title" ),
                    $content = $part.children( ".ui-collapse-content" );

                $content.html( '<div>' + $content.html() + '</div>' );
                $title.append( '<i class="ui-collapse-arrow">' + Icon.arrowLine( 16, 16 ) + '</i>' ).click(function () {
                    var _this = $( this ),
                        _content = _this.next(),
                        _siblings = _this.parent().siblings();
                    _this.toggleClass( "ui-collapse-arrow-animate" );
                    var height = _content.children().outerHeight( true );
                    _content.height( _content.hasClass( "ui-collapse-show" ) ? 0 : height ).toggleClass( "ui-collapse-show" );

                    // 手风琴模式
                    if ( opt.accordion ) {
                        _siblings.children( ".ui-collapse-content" ).height( 0 ).removeClass( "ui-collapse-show" );
                        _siblings.children( ".ui-collapse-title" ).removeClass( "ui-collapse-arrow-animate" );
                    }
                });

                // 默认打开指定的面板
                if ( Array.isArray( opt.active ) && opt.active.length ) {

                	// 如果开启了手风琴模式
                	// 则只打开数组中最后一个索引值对应的面板
                    var activeArray = opt.accordion ? [ opt.active.pop() ] : opt.active;

                    $.each(activeArray, function ( i, v ) {
                        var $title = $this.find( ".ui-collapse-title" ).eq( v ),
                        	$content = $title.next();
                        $title.addClass( "ui-collapse-arrow-animate" );
                        $content.addClass( "ui-collapse-show ui-collapse-no-transition" ).height( $content.children().outerHeight( true ) );
                        var timer = window.setTimeout(function () {
                        	$content.removeClass( "ui-collapse-no-transition" );
                        	window.clearTimeout( timer );
                        }, 13);
                    })
                }
            })
        },
		datePicker: function ( selector, options ) {
            var defaults = {
                format: "YYYY-MM-DD",
                width: 200,
                name: "",
                id: "",
                placeholder: "",
                selectYear: true,
                selectMonth: true,
                showButton: false,
                buttonClearCallback: $.noop,
                disabledDays: [],
                change: $.noop
            };
            var opt = $.extend( {}, defaults, options );

            // 格式化
            function dateFormat ( arr ) {
                return opt.format.replace( "YYYY", arr[ 0 ] ).replace( "MM", Methods.addZero( arr[ 1 ] ) ).replace( "DD", Methods.addZero( arr[ 2 ] ) );
            }

            $document.on("click contextmenu", function ( event ) {
            	var $date = $( ".ui-datepicker-container, .ui-datepicker-input" );
                if ( !$date.is( event.target ) && !$date.has( event.target ).length ) {
                    $date.not( ".ui-datepicker-input" ).remove();
                    $( ".ui-datepicker-input" ).removeClass( "active" );
                }
            })

            return $( selector ).each(function () {
                var $this = $( this );
                $this
                    .width( opt.width - 2 )
                    .addClass( "ui-datepicker-input ui-noselect" )
                    .html(
                    	'<input type="text" readonly autocomplete="off" placeholder="' + opt.placeholder + '" id="' + opt.id + '" name="' + opt.name + '">' +
                        '<i></i>'
                    ).find( "*" ).end().click(function () {
                    	$( ".ui-datepicker-input" ).removeClass( "active" );
                        $( ".ui-datepicker-container" ).remove();
                        $this.addClass( "active" );
                        var week = "";
                        [ "日", "一", "二", "三", "四", "五", "六" ].forEach(function ( v ) {
                        	week += "<i>" + v + "</i>";
                        })

                        var years = "";
                        for ( var i = 1900; i < 2101; i++ ) {
                        	years += "<i>" + i + "年</i>";
                        }
                        var months = "";
                        for ( var i = 1; i < 13; i++ ) {
                        	months += "<i>" + i + "月</i>";
                        }

                        var svg = Icon.arrowLine( 12, 12 );

                        var value = $this.data( "ui-datepicker-value" );
                        var datepicker = Methods.datePicker( value );
                        $( "body" ).append(
	                        '<div class="ui-datepicker-container ui-noselect">' + 
	                            '<div class="ui-datepicker-header">' + 
	                                '<div class="ui-datepicker-prev">' + 
	                                    '<i class="ui-datepicker-prev-year">' + svg + svg + '</i>' + 
	                                    '<i class="ui-datepicker-prev-month">' + svg + '</i>' + 
	                                '</div>' + 
	                                '<div class="ui-datepicker-result">' + 
	                                    '<span>' + datepicker.result[ 0 ] + '</span>年' + 
	                                    '<span>' + datepicker.result[ 1 ] + '</span>月' + 
	                                '</div>' + 
	                                '<div class="ui-datepicker-next">' + 
	                                    '<i class="ui-datepicker-next-month">' + svg + '</i>' + 
	                                    '<i class="ui-datepicker-next-year">' + svg + svg + '</i>' + 
	                                '</div>' + 
	                            '</div>' + 
	                            '<div class="ui-datepicker-week">' + week + '</div>' + 
	                            '<div class="ui-datepicker-box">' + datepicker.days + '</div>' + 
	                            '<div class="ui-datepicker-footer">' +
	                            	'<button info-ghost>清空</button>' + 
	                            	'<button info-ghost>今天</button>' +
	                            	'<button info-ghost>确定</button>' +
	                            '</div>' + 
	                            '<div class="ui-datepicker-years">' + years + '</div>' + 
	                            '<div class="ui-datepicker-months">' + months + '</div>' + 
	                        '</div>'
                        );
                        var $container = $( ".ui-datepicker-container" );
                        var left = $this.offset().left,
                        	top = $this.offset().top;
                        $container.css({
                        	marginTop: top + $this.outerHeight() + "px",
                        	marginLeft: left + "px"
                        });

                        var $input = $this.find( "input" );
                        var $prevYear = $container.find( ".ui-datepicker-prev-year" ),
	                        $nextYear = $container.find( ".ui-datepicker-next-year" ),
	                        $prevMonth = $container.find( ".ui-datepicker-prev-month" ),
	                        $nextMonth = $container.find( ".ui-datepicker-next-month" ),
	                        $box = $container.find( ".ui-datepicker-box" ),
	                        $years = $container.find( ".ui-datepicker-years" ),
	                        $months = $container.find( ".ui-datepicker-months" ),
	                        $week = $container.find( ".ui-datepicker-week" ),
	                        $footer = $container.find( ".ui-datepicker-footer" );
                        var $result = $container.find( ".ui-datepicker-result span" ), 
                        	$resultYear = $result.first(),
                        	$resultMonth = $result.last();
                        var result = [ 
                        	~~$resultYear.text(),
                        	~~$resultMonth.text(),
                        	null
                        ];

                        if ( opt.showButton ) {
                        	$footer.show().find( "button" ).first().click(function () {
                        		$input.val( "" );
                        		$this.removeData( "ui-datepicker-value" );
                        		$container.remove();
                        		if ( $.isFunction( opt.buttonClearCallback ) ) {
                        			opt.buttonClearCallback( $input.get( 0 ) );
                        		}
                        	}).next().click(function () {
                        		result = datepicker.today;
                        		doing( result[ 2 ] );
                        	}).next().click(function () {
                        		doing( ~~$box.find( ".active" ).text() );
                        	})
                        }

                        function setResult ( arr ) {
                        	$resultYear.text( arr[ 0 ] );
                        	$resultMonth.text( arr[ 1 ] );
                        	disabledDays();
                        }

                        // 禁用指定的日期
                        function disabledDays () {
                        	if ( Array.isArray( opt.disabledDays ) && opt.disabledDays.length ) {
                        		$.each(opt.disabledDays, function ( i, day ) {
                        			day = day.split( "-" );
                        			if ( day[ 0 ] == result[ 0 ] && ~~day[ 1 ] == result[ 1 ] ) {
                        				$box.find( '[data-day="' + ~~day[ 2 ] + '"]' ).attr( "class", "ui-datepicker-placeholder" );
                        			}
                        		})
                        	}
                        }
                        disabledDays();

                        // 日期高亮
                        $box.find( '[data-day="' + datepicker.result[ 2 ] + '"]' ).addClass( "active" ).siblings().removeClass( "active" );

                        // 选中日期
                        $box.on("click", ".ui-datepicker-days:not(.active)", function () {
                       		$( this ).addClass( "active" ).siblings().removeClass( "active" );
                        	if ( !opt.showButton ) {
                        		doing( ~~$( this ).text() );
                        	}
                        })
                        function doing ( v ) {
                        	$container.remove();
	                        $this.removeClass( "active" );
                        	if ( !v ) {
                        		return;
                        	}
                        	result[ 2 ] = v;
	                        $this.data( "ui-datepicker-value", result );
	                        $input.val( dateFormat( result ) );
	                        $( ".ui-datepicker-input" ).removeClass( "active" );
	                        if ( $.isFunction( opt.change ) ) {
	                            opt.change( result );
	                        }
                        }

                        function ymHide () {
                        	$years.add( $months ).hide();
                        	$container.find( ".ui-datepicker-opacity" ).removeClass( "ui-datepicker-opacity" );
                        }

                        // 切换年份
                        $prevYear.click(function () {
	                        result[ 0 ] = result[ 0 ] - 1;
	                        $box.html( Methods.datePicker( result ).days );
	                        setResult( result );
	                        ymHide();
                        })
                        $nextYear.click(function () {
	                        result[ 0 ] = result[ 0 ] + 1;
	                        $box.html( Methods.datePicker( result ).days );
	                        setResult( result );
	                        ymHide();
                        })
                        $resultYear.click(function () {
	                        $years.toggle();
	                        $months.hide();
	                        $box.add( $week )[ $years.is( ":hidden" ) ? "removeClass" : "addClass" ]( "ui-datepicker-opacity" );
                        })
                        $years.on("click", "i", function () {
	                        result[ 0 ] = parseInt( $( this ).text() );
	                        $box.html( Methods.datePicker( result ).days );
	                        setResult( result );
	                        ymHide();
                        })
                        
                        // 切换月份
                        $prevMonth.click(function () {
	                        result[ 1 ] = result[ 1 ] - 1;
	                        if ( result[ 1 ] === 0 ) {
	                            result[ 1 ] = 12;
	                            result[ 0 ] = result[ 0 ] - 1;
	                        }
	                        $box.html( Methods.datePicker( result ).days );
	                        setResult( result );
	                        ymHide();
                        })
                        $nextMonth.click(function () {
	                        result[ 1 ] = result[ 1 ] + 1;
	                        if ( result[ 1 ] === 13 ) {
	                            result[ 1 ] = 1;
	                            result[ 0 ] = result[ 0 ] + 1;
	                        }
	                        $box.html( Methods.datePicker( result ).days );
	                        setResult( result );
	                        ymHide();
                        })
                        $resultMonth.click(function () {
	                        $months.toggle();
	                        $years.hide();
	                        $box.add( $week )[ $months.is( ":hidden" ) ? "removeClass" : "addClass" ]( "ui-datepicker-opacity" );
	                    })
	                    $months.on("click", "i", function () {
	                        result[ 1 ] = parseInt( $( this ).text() );
	                        $box.html( Methods.datePicker( result ).days );
	                        setResult( result );
	                        ymHide();
                        })

                        // 不可以选择年份
                        if ( !opt.selectYear ) {
                        	$prevYear.add( $nextYear ).remove();
                        	$resultYear.addClass( "disabled" );
                        }
                        if ( !opt.selectMonth ) {
                        	$prevMonth.add( $nextMonth ).remove();
                       	 	$resultMonth.addClass( "disabled" );
                        }
                    })
            })
		},
		dialog: function () {

			// 对话框模板
			var DialogTmpl = 
				'<div class="ui-dialog-container">' +
					'<div class="ui-dialog-mask"></div>' +
					'<div class="ui-dialog-wrapper">' +
						'<div class="ui-dialog-header">' +
							'<span></span>' +
							'<i>' + Icon.close() + '</i>' +
						'</div>' +
						'<div class="ui-dialog-main">' +
							'<div></div>' +
						'</div>' +
						'<div class="ui-dialog-footer ui-noselect">' +
							'<div class="ui-dialog-cancel">' +
								'<span></span>' +
							'</div>' +
							'<div class="ui-dialog-ok">' +
								'<span></span>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>'
			;

			// 对话框默认配置
			var defaults = {
				title: "网页消息",
				content: "",
				contentBgColor: "#fff",
				iframeContent: null,
				videoContent: null,
				imageContent: null,
				fullscreen: false,
				draggable: false,
				maskClose: false,
				mask: true,
				closable: true,
				showTitle: true,
				bodyScroll: true,
				showButton: true,
				autoCloseEffect: true,
				parentsIframeLayer: 0,
				borderRadius: 6,
				autoClose: 0,
				width: 500,
				checkbox: null,
				ok: {
					text: "确定",
					waiting: false,
					waitingText: "确定",
					notClose: false,
					callback: $.noop
				},
				cancel: {
					text: "取消",
					show: true,
					callback: $.noop
				},
				afterOpen: $.noop,
				afterClose: $.noop,
				SHORTCUTS: null,
				WAITING: null,
				PROMPT: null
			};

			// 参数修整
			var arg = arguments;
			var size = arg.length;
			var options = {};
			if ( !size ) {
				return;
			} else if ( size === 1 ) {
				if ( $.isPlainObject( arg[ 0 ] ) ) {
					options = arg[ 0 ];
				} else {
					options.content = arg[ 0 ];
				}
			} else {
				options.title = arg[ 0 ];
				options.content = arg[ 1 ];
				options.width = arg[ 2 ];
			}
			var opt = $.extend( true, defaults, options );

			if ( opt.WAITING ) {
				opt.showTitle = false;
				opt.showButton = false;
				opt.width = "auto";
			}
			if ( opt.PROMPT && opt.PROMPT.title ) {
				opt.title = opt.PROMPT.title;
			}

			var isFullScreen = opt.fullscreen;
			var dialogWidth = opt.width;

			// 添加对话框
			var _parent;
			if ( !opt.parentsIframeLayer ) {
				$( "body" ).append( DialogTmpl );
			} else {
				_parent = window.parent;
				for ( var i = 0; i < opt.parentsIframeLayer - 1; i++ ) {
					_parent = _parent.parent;
				}
				$( "body", _parent.document ).append( DialogTmpl );
			}

			var $container = _parent ? $( "body > .ui-dialog-container:last-child", _parent.document ) : $( "body > .ui-dialog-container:last-child" ),
				$mask = $( ".ui-dialog-mask", $container ),
				$wrapper = $( ".ui-dialog-wrapper", $container ),
				$header = $( ".ui-dialog-header", $wrapper ),
				$title = $( "span", $header ),
				$close = $( "i", $header ),
				$main = $( ".ui-dialog-main", $wrapper ),
				$content = $( "div", $main ),
				$footer = $( ".ui-dialog-footer", $wrapper ),
				$ok = $( ".ui-dialog-ok", $footer ),
				$cancel = $( ".ui-dialog-cancel", $footer );
			var winWidth = $window.width(),
				winHeight = $window.height();
			var lowerWidth = !!( winWidth < 430 );

			// 当手动设置的 width 大于浏览器可视区域的宽度时
			// 将自动调整为浏览器可视区域的宽度
			if ( dialogWidth > winWidth || isFullScreen ) {
				dialogWidth = winWidth;
			}
			$wrapper.width( dialogWidth );
			if ( lowerWidth && !isFullScreen && !opt.WAITING ) {
				$wrapper.width( winWidth - 60 );
			}

			// 相关配置
			$title.text( opt.title );
			$wrapper.css( "borderRadius", opt.borderRadius + "px" );
			$main.css( "background", opt.contentBgColor );
			$content.html( opt.content );
			$( "span", $ok ).text( opt.ok.text );
			$( "span", $cancel ).text( opt.cancel.text );
			if ( !opt.bodyScroll ) {
				$( "body", _parent ? _parent.document : window.document ).addClass( "ui-body-noscroll" );
			}
			if ( !opt.showTitle ) {
				$header.remove();
			}
			if ( !opt.showButton ) {
				$footer.remove();
			}
			if ( !opt.cancel.show ) {
				$cancel.remove();
			}
			if ( !opt.closable ) {
				$close.remove();
				$title.css( "width", "calc(100% - 30px)" );
			}
			if ( !opt.mask ) {
				$mask.remove();
			}
			var dis = $header.outerHeight() + $footer.outerHeight();

			// 添加复选框
			var checkBoxHasChecked = false;
			if ( $.isPlainObject( opt.checkbox ) && !$.isEmptyObject( opt.checkbox ) && opt.showButton ) {
				$footer.prepend(
					'<div class="ui-dialog-checkbox">' +
						'<div></div>' +
						'<span>' + ( opt.checkbox.text || "" ) + '</span>' +
					'</div>'
				);
				var $checkbox = $( ".ui-dialog-checkbox", $footer );
				if ( opt.checkbox.checked ) {
					checkBoxHasChecked = true;
					$checkbox.addClass( "active" );
				}
				$checkbox.click(function () {
					$checkbox.toggleClass( "active" );
					if ( $.isFunction( opt.checkbox.change ) ) {
						var contains = $checkbox.hasClass( "active" );
						checkBoxHasChecked = contains;
						opt.checkbox.change( contains );
					}
				})
			}

			// 嵌入框架
			var iframeContent = opt.iframeContent;
			var isIframeContent = false;
			if ( $.isPlainObject( opt.iframeContent ) ) {
				var src = iframeContent.src,
					height = iframeContent.height;
				if ( !src || !height ) {
					return;
				}
				isIframeContent = true;
				if ( isFullScreen || height > winHeight - dis ) {
					height = winHeight - dis;
				}
				$main.css({
					padding: 0,
					height: height + "px"
				}).html( '<iframe src="' + src + '" frameborder="0" scrolling="auto"></iframe>' );
			}

			// 嵌入图片 ( 支持单张图片或多张图片的轮播图效果 )
			var imageContent = opt.imageContent;
			var isImageContent = false;
			if ( $.isPlainObject( imageContent ) ) {
				var src = imageContent.src,
					height = imageContent.height;
				if ( !src || !height ) {
					return;
				}
				isImageContent = true;
				if ( isFullScreen || height > winHeight - dis ) {
					height = winHeight - dis;
				}
				var size = src.length;
				var img = "";
				if ( Array.isArray( src ) ) {
					src.forEach(function ( v ) {
						img += '<img src="' + v + '" style="width:' + dialogWidth + 'px;height:' + height + 'px;" ondragstart="return false">'
					})
					img = 
						'<div class="ui-dialog-image-wrapper ui-dialog-noselect">' +
							'<div style="width:' + dialogWidth * size + 'px;">' + img + '</div>' +
							'<div class="ui-dialog-image-prev"></div>' +
							'<div class="ui-dialog-image-next"></div>' +
						'</div>'
					;
				} else {
					img = '<img src="' + src + '">';
				}
				$main.css({
					padding: 0,
					overflow: "hidden",
					height: height + "px"
				}).html( img );

				var $imageWrapper = $( ".ui-dialog-image-wrapper > div:first-child", $main ),
					$arrow = $( ".ui-dialog-image-prev, .ui-dialog-image-next", $main );

				var index = 0;
				var animated = false;

				if ( $arrow.length === 2 ) {
					$arrow.first().click(function () {
						if ( index && !animated ) {
							index--;
							animate( index );
						}
					}).next().click(function () {
						if ( index < size - 1 && !animated ) {
							index++;
							animate( index );
						}
					})
				}
				function animate ( i ) {
					animated = true;
					$imageWrapper.css( "transform", "translateX(" + -i * dialogWidth + "px)" ).on("transitionend", function () {
						animated = false;
						$imageWrapper.off( "transitionend" );
					})
				}
			}

			// 嵌入视频
			var videoContent = opt.videoContent;
			var isVideoContent = false;
			if ( $.isPlainObject( videoContent ) ) {
				var src = videoContent.src,
					height = videoContent.height,
					autoplay = videoContent.autoplay;
				if ( !src || !height ) {
					return;
				}
				isVideoContent = true;
				if ( isFullScreen || height > winHeight - dis ) {
					height = winHeight - dis;
				}
				$main.css({
					padding: 0,
					overflow: "hidden",
					background: "#000",
					height: height + "px"
				}).html( '<video src="' + src + '" width="' + dialogWidth + '" height="' + height + '" controls></video>' );
				if ( autoplay ) {
					$( "video", $main ).attr( "autoplay", true );
				}
			}

			// 当创建多个对话框时
			// 只显示一个遮罩层
			if ( $( ".ui-dialog-mask" ).length > 1 ) {
				$mask.remove();
			}

			// 存储 afterClose 事件
			// 便于在 close 方法中调用
			if ( $.isFunction( opt.afterClose ) ) {
				$container.data( "ui-dialog-afterclose", opt.afterClose );
			}

			// 全屏对话框
			if ( isFullScreen ) {
				$wrapper.css({
					borderRadius: 0,
					height: winHeight + "px",
				});
				$main.height( winHeight - dis - ( ( isVideoContent || isImageContent || isIframeContent ) ? 0 : 30 ) + "px" );
			}

			// 开启自动关闭功能时
			// 添加提示条
			if ( $.isNumeric( opt.autoClose ) && opt.autoClose > 2000 && opt.autoCloseEffect ) {
				$wrapper.append( '<div class="ui-dialog-autoclose"></div>' );
			}

			// 当内容区域的高度超出临界值时
			// 自动调整高度
			if ( $wrapper.height() > winHeight ) {
				$main.height( winHeight - dis );
			}

			// 快捷方式
			if ( $.isPlainObject( opt.SHORTCUTS ) && !$.isEmptyObject( opt.SHORTCUTS ) ) {
				$header.add( $cancel ).add( $content ).remove();
				$footer.css( "borderTop", "none" );
				$wrapper.width( lowerWidth ? w - 60 : 420 );
				$wrapper.addClass( "ui-dialog-shortcuts-mark" );
				$main.html(
					'<div>' +
						'<div class="ui-dialog-shortcuts">' +
							'<i>' + Icon[ opt.SHORTCUTS.type ]() + '</i>' +
								'<div>' +
									'<p>' + opt.SHORTCUTS.title + '</p>' +
									'<div>' + ( opt.SHORTCUTS.content || "" ) + '</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>'
				);
				$main.css( "minHeight", "90px" );
				if ( lowerWidth ) {
					$main.addClass( "ui-dialog-mobile-main" );
				}
			}

			// 请等待
			if ( opt.WAITING ) {
				$wrapper.addClass( "ui-dialog-waiting-wrapper" );
				var waitingText = "";
				if ( $.type( opt.WAITING ) === "string" ) {
					waitingText = opt.WAITING;
				}
				$main.html( '<div class="ui-dialog-waiting-box"></div><span>' + waitingText + '</span>' );
				if ( $.isFunction( opt.WAITING ) ) {
					opt.WAITING( $( ".ui-dialog-waiting-box + span" ) );
				}
			}

			// 可输入对话框
			if ( $.isPlainObject( opt.PROMPT ) && !$.isEmptyObject( opt.PROMPT ) ) {
				$wrapper.width( lowerWidth ? w - 60 : 350 );
				$main.css( "minHeight", 0 ).html( '<div class="ui-dialog-prompt"></div>' );
				var $inner = $( "div", $main );

				var input = opt.PROMPT.type !== "textarea" ? '<input type="' + opt.PROMPT.type + '" spellcheck="false">' : '<textarea spellcheck="false"></textarea>';
				$inner.append( input );

				var $input = $( "input, textarea", $main );
				$input.attr( "maxlength", opt.PROMPT.maxlength );
				if ( opt.PROMPT.placeholder ) { 
					$input.attr( "placeholder", opt.PROMPT.placeholder );
				}
				if ( opt.PROMPT.autofocus ) {
					$input.focus();
				}

				$ok.addClass( "ui-dialog-notclose" );
				$ok.click(function () {
					if ( $.isFunction( opt.PROMPT.callback ) ) {

						// 只要点击了确定按钮
						// 就先移除之前 (或许) 存在的反馈信息
						UI.dialog.prompt.errorFeedBack( false );

						// 执行回调函数
						opt.PROMPT.callback( $input.val(), $input, $ok );
					}
				})
			}

			// 相关事件
			if ( opt.maskClose ) {
				$mask.click(function () {
					UI.dialog.close( $container, _parent );
				})
			}
			$close.click(function () {
				UI.dialog.close( $container, _parent );
			})
			$cancel.click(function () {
				UI.dialog.close( $container, _parent );
				if ( $.isFunction( opt.cancel.callback ) ) {
					opt.cancel.callback( $cancel, checkBoxHasChecked );
				}
			})
			$ok.click(function () {
				if ( $.isFunction( opt.ok.callback ) && !opt.PROMPT ) {
					opt.ok.callback( $ok, checkBoxHasChecked );
				}

				// 三种情况下，点击确定按钮不会关闭对话框：
				// 1. 在确定按钮上设置了 waiting 属性；
				// 2. 在确定按钮上设置了 notClose 属性；
				// 3. 针对四种信息提示类弹框调用了 okNotClose() 方法。
				if ( !opt.ok.waiting && !opt.ok.notClose && !$ok.hasClass( "ui-dialog-notclose" ) ) {
					UI.dialog.close( $container, _parent );
				}

				// 设置了 waiting 属性
				// 在点击后会在按钮上出现 "加载中" 效果
				if ( opt.ok.waiting ) {
					$ok.prepend( "<i></i>" ).css({
						opacity: .5,
						pointerEvents: "none"
					});
					$( "span", $ok ).text( opt.ok.waitingText );
				}
			})

			// 可拖动
			if ( opt.draggable && !opt.fullscreen ) {
				$mask.remove();
				var height = parseFloat( $wrapper.height() );
				var top, left;

				// 置于最顶层
				$wrapper.mousedown(function () {
					$( ".ui-dialog-container-top" ).removeClass( "ui-dialog-container-top" );
					$container.addClass( "ui-dialog-container-top" );
				})
				
				$header.addClass( "ui-dialog-header-move" + ( IE11 ? "-ie" : "" ) ).mousedown(function ( event ) {
					event.preventDefault();
					$container.addClass( "ui-noselect" );
					$header.css( "cursor", "grabbing" );
					left = event.pageX - $wrapper.get( 0 ).offsetLeft;
					top = event.pageY - $wrapper.get( 0 ).offsetTop;
					$document.on("mousemove", function ( ev ) {
						var x = ev.pageX - left,
							y = ev.pageY - top;
						( x < dialogWidth / 2 ) && ( x = dialogWidth / 2 );
						( y < height / 2 ) && ( y = height / 2 );
						if ( x > winWidth - dialogWidth / 2 ) {
							x = winWidth - dialogWidth / 2;
						}
						if ( y > winHeight - height / 2 ) {
							y = winHeight - height / 2;
						}
						$wrapper.css({
							left: x + "px",
							top: y + "px"
						});
					})
				});
				$header.add( $document ).mouseup(function () {
					$header.get( 0 ).style.removeProperty( "cursor" );
					$container.removeClass( "ui-noselect" );
					$document.off( "mousemove" );
				})
			}

			$mask.addClass( "ui-dialog-mask-show" );
			$wrapper.addClass( "ui-dialog-wrapper-show" );
			$wrapper.on("animationend", function () {
				$wrapper.off( "animationend" );
				if ( $.isFunction( opt.afterOpen ) ) {
					opt.afterOpen();
				}
				var $auto = $( ".ui-dialog-autoclose", $wrapper );
				if ( $auto ) {
					$auto
						.css( "transitionDuration", ~~opt.autoClose + "ms" )
						.addClass( "ui-dialog-autoclose-active" )
						.on("transitionend", function () {
							UI.dialog.close( $container, _parent );
						});
				}
			});
			return $container;
		},
		drawer: function ( options ) {
            var defaults = {
            	width: 300,
                title: "",
				content: "",
				clearContent: false,
				closable: true,
				mask: true,
				maskClose: false,
				afterOpen: $.noop,
				afterClose: $.noop
            };
            var opt = $.extend( {}, defaults, options );

            var hasContainer = $( ".ui-drawer-container" ).length;
            if ( !hasContainer ) {
            	$( "body" ).append(
            		'<div class="ui-drawer-container">' +
            			'<div class="ui-drawer-mask"></div>' +
            			'<div class="ui-drawer-wrapper">' +
            				'<div class="ui-drawer-header"><span></span></div>' +
            				'<div class="ui-drawer-body"><div></div></div>' +
            			'</div>' +
            		'</div>'
            	);
            }

            var $container = $( ".ui-drawer-container" ),
            	$mask = $container.find( ".ui-drawer-mask" ),
            	$wrapper = $container.find( ".ui-drawer-wrapper" ),
            	$header = $container.find( ".ui-drawer-header" ),
            	$title = $header.find( "span" ),
            	$body = $container.find( ".ui-drawer-body > div" );
            var winWidth = $window.width();

            if ( String( opt.title ) ) {
	            $title.text( opt.title );
	        } else {
	            $header.remove();
	            $body.parent().css({
	            	height: "100%",
	            	top: 0
	            });
			}

			// 关闭按钮
			if ( opt.closable && !$header.children( "i" ).length ) {
				$header.append( "<i>" + Icon.close() + "</i>" );
	            $title.css( "width", "calc(100% - 61px)" );
			}

			if ( !opt.mask ) {
				$mask.remove();
			}
			if ( String( opt.content ) ) {
				$body[ opt.clearContent ? "html" : "append" ]( opt.content );
			}

            // 显示抽屉
            $container.show();
            $mask.addClass( "ui-drawer-mask-show" );
            $wrapper.width( opt.width > winWidth ? winWidth : opt.width ).addClass( "ui-drawer-wrapper-show" ).on("animationend", function () {
            	$wrapper.off( "animationend" );
            	if ( $.isFunction( opt.afterOpen ) ) {
            		opt.afterOpen( $title, $body );
            	}
            });

            // 关闭抽屉
            $header.find( "i" ).click(function () {
            	UI.drawer.close( opt.afterClose );
            })
            if ( opt.maskClose ) {
            	$mask.click(function () {
            		UI.drawer.close( opt.afterClose );
            	})
            }
		},
		email: function ( selector, options ) {
			var defaults = {
				email: [ "126.com", "139.com", "163.com", "gmail.com", "hotmail.com", "msn.com", "outlook.com", "qq.com", "sina.com", "sohu.com", "tom.com", "yahoo.com" ],
				placeholder: "",
				name: "",
				id: "",
				clear: false
			};
			var opt = $.extend( {}, defaults, options );

			return $( selector ).each(function () {
				var $this = $( this );
				$this.html(
					'<div class="ui-email-container">' +
						'<div class="ui-email-layer"></div>' +
						'<input type="text" spellcheck="false" maxlength="128" autocomplete="off">' +
						'<div class="ui-email-suffix ui-noselect"><i>' + Icon.arrowLine( 10, 10 ) + '</i><span></span><ul></ul></div>' +
					'</div>'
				);
				var $container = $this.children(),
					$layer = $container.children().first(),
					$input = $layer.next(),
					$suffix = $input.next(),
					$i = $this.find( "i" ),
					$span = $i.next(),
					$ul = $span.next();
				$layer.css( "lineHeight", $container.innerHeight() - 2 + "px" );
				$input.attr( "placeholder", opt.placeholder );

				// 添加 name 和 id 属性
				if ( opt.name ) {
					$input.attr( "name", opt.name );
				}
				if ( opt.id ) {
					$input.attr( "id", opt.id );
				}

				// 添加 clear 按钮
				if ( opt.clear ) {
					$container.append( '<div class="ui-email-clear">' + Icon.close( 10, 10, "#fff" ) + '</div>' );
					$input.css({
						width: "calc(100% - 159px)",
						paddingRight: "28px"
					});
				}
				var $clear = $container.find( ".ui-email-clear" );
				$clear.hide().click(function () {
					$input.val( "" ).focus();
					$clear.hide();
					$layer.html( "" );
				});

				// 输入框事件集合
				$input.on({
					valueChange: function ( event, value ) {
						$clear[ value ? "show" : "hide" ]();
						$layer.html( value );
					},
					focus: function () {
						$layer.hide();
						var value = $input.val();
						$.each(opt.email, function ( i, name ) {
							value = value.replace( "@" + name, "" );
						})
						$input.val( value );
						$layer.html( value );
					},
					blur: function () {
						$layer.show();
						var value = $input.val();
						value = value.replace( /[^\w-]/g, "" );
						$input.val( value ? value + $span.text() : "" );
						$layer.html( value || "" );
					}
				});

				if ( Array.isArray( opt.email ) && opt.email.length ) {
					var list = "";
					$.each(opt.email, function ( i, name ) {
						list += "<li><b>@</b>" + name + "</li>"
					})
					$ul.html( list ).hide();
					var $first = $ul.find( "li" ).first();
					$first.addClass( "active" );
					$span.html( $first.html() );
					$suffix.click(function () {
						$ul.toggle();
						$i.toggleClass( "active" );
					}).on("click", "li", function () {
						$( this ).addClass( "active" ).siblings().removeClass( "active" );
						var name = $( this ).text();
						$span.html( name );
						$input.val() && $input.val( $input.val().replace( /@(.*)/g, "" ) + name );
					});
				}

				// 监听 reset 事件
				var $form = $this.parents( "form" );
				if ( $form.length ) {
					$form.on("reset", function () {
						$layer.html( "" ).hide();
					})
				}

				$document.on("click contextmenu", function ( event ) {
					if ( !$suffix.is( event.target ) && !$suffix.has( event.target ).length ) {
						$ul.hide();
						$i.removeClass( "active" );
					}
				})
			})
		},
		inputNumber: function ( selector, options ) {
			var defaults = {
				defaultValue: 0,
				max: Infinity,
				min: -Infinity,
				step: 1,
				name: "",
				id: "",
				editable: false,
				disabled: false
			};
			var opt = $.extend( {}, defaults, options );

			function setValue ( target, value ) {
				var step = String( opt.step ),
					point = step.indexOf( "." );
				target.val( point > -1 ? value.toFixed( step.substr( point + 1 ).length ) : value );
			}

			return $( selector ).each(function () {
				var $this = $( this );
				$this.html(
					'<div class="ui-inputnumber-container ui-noselect">' +
						'<div class="ui-inputnumber-decrease"></div>' + 
						'<input type="text" autocomplete="off" spellcheck="false" max="Infinity" min="-Infinity" value=' + 
							( opt.defaultValue > opt.max || opt.defaultValue < opt.min ? 0 : opt.defaultValue ) + 
						'>' + 
						'<div class="ui-inputnumber-increase"></div>' + 
					'</div>'
				).data( "ui-inputnumber-options", opt );
				var $container = $this.children(),
					$content = $container.children(),
					$down = $content.eq( 0 ),
					$input = $content.eq( 1 ),
					$up = $content.eq( 2 );
				$down.html( Icon.decrease( 17, 17, "#666" ) );
				$up.html( Icon.increase( 17, 17, "#666" ) );
				$input.on({
					focus: function () {
						$container.addClass( "active" );
					},
					blur: function () {
						$container.removeClass( "active" );
						var value = parseFloat( $input.val() );
						if ( value < opt.min ) {
							value = opt.min;
						}
						if ( value > opt.max ) {
							value = opt.max;
						}
						if ( !$.isNumeric( $input.val() ) ) {
							value = 0;
						}
						setValue( $input, value );
					}
				});
				if ( !opt.editable ) {
					$input.off( "focus blur" ).attr( "readonly", true ).css( "pointerEvents", "none" );
				}
				if ( opt.disabled ) {
					$container.addClass( "ui-inputnumber-disabled" );
				}
				
				// 设置 name 和 id 属性
				if ( opt.name ) {
					$input.attr( "name", opt.name );
				}
				if ( opt.id ) {
					$input.attr( "id", opt.id );
				}

				var intervalTimer = null,
					timeoutTimer = null;
				var hold = false;
				function downFunc ( handle ) {
					if ( $container.hasClass( "ui-inputnumber-disabled" ) ) {
						return;
					}
					handle();
					hold = true;
					timeoutTimer = window.setTimeout(function () {
						if ( hold ) {
							intervalTimer = window.setInterval( handle, 100 );
						}
						window.clearTimeout( timeoutTimer );
					}, 1000);
				}
				function upFunc () {
					hold = false;
					window.clearInterval( intervalTimer );
					window.clearTimeout( timeoutTimer );
				}

				// 减少
				$down.mousedown(function () {
					downFunc( handle );
					function handle () {
						var value = $input.val();
						if ( !$.isNumeric( value ) ) {
							value = opt.defaultValue;
						}
						value = parseFloat( value );
						if ( value > opt.min ) {
							value -= parseFloat( opt.step );
						}
						if ( value < opt.min ) {
							value = opt.min;
						}
						setValue( $input, value );
					}
				})

				// 增加
				$up.mousedown(function () {
					downFunc( handle );
					function handle () {
						var value = $input.val();
						if ( !$.isNumeric( value ) ) {
							value = opt.defaultValue;
						}
						value = parseFloat( value );
						if ( value < opt.max ) {
							value += parseFloat( opt.step );
						}
						if ( value > opt.max ) {
							value = opt.max;
						}
						setValue( $input, value );
					}
				})
				$document.mouseup(function () {
					upFunc();
				})
			})
		},
		loading: function ( selector, options ) {
            var defaults = {
                text: "",
                onlyShowText: false,
                zoom: 1
            };
            var opt = $.extend( {}, defaults, options );

            return $( selector ).each(function () {
                var $this = $( this );

                // 同一元素内有且只能有一个 loading
                if ( $this.children( ".ui-loading-container" ).length ) {
                    return;
                }

                // 添加 loading
                $this.append(
                    '<div class="ui-loading-container ui-noselect">' + 
                        '<div class="ui-loading-wrapper">' + 
                        '<div class="ui-loading-box">' + 
                        	'<div class="ui-loading-ring"></div>' + 
                        '</div>' + 
                        '<div class="ui-loading-text"></div>' + 
                        '</div>' + 
                    '</div>'
                );

                var $container = $this.children( ".ui-loading-container" ),
                	$wrapper = $container.find( ".ui-loading-wrapper" ),
                	$box = $container.find( ".ui-loading-box" ),
                	$text = $container.find( ".ui-loading-text" );

                // 设置定位
                if ( !$this.is( "body" ) ) {
                    if ( $this.css( "position" ) === "static" ) {

                        // 存储行内的 position 样式
                        // 便于后期移除 loading 时恢复原有的 position
                        $this.data( "ui-loading-position", $this.get( 0 ).style.position ).css( "position", "relative" );
                    }
                } else {
                    $container.css( "position", "fixed" );
                }

                // 颜色和文字
                if ( opt.text ) {
                    $text.text( opt.text );

                    // 仅显示文字
                    if ( opt.onlyShowText ) {
                        $box.remove();
                        $text.css( "bottom", "20px" );
                    }
                } else {
                    $box.css( "marginTop", "12px" );
                    $text.remove();
                }

                // 缩放
                if ( $.isNumeric( opt.zoom ) && opt.zoom > 1 ) {
                    $wrapper.css( "transform", "scale(" + opt.zoom + ")" );
                }
            })
		},
		message: {
			info: function () { return Methods.message( "info", arguments ) },
			success: function () { return Methods.message( "success", arguments ) },
			warn: function () { return Methods.message( "warn", arguments ) },
			error: function () { return Methods.message( "error", arguments ) },
			close: function ( target ) {

				// 可关闭指定提醒或所有提醒
				$( target || ".ui-message-wrapper" ).addClass( "ui-message-hide" ).on("animationend", function () {

					// 关闭后执行 afterClose 回调函数
					var afterClose = $( this ).data( "ui-message-afterclose" );
					if ( afterClose ) {
						afterClose();
					}

					$( this ).remove();

					// 清理容器
					var size = $( ".ui-message-wrapper" ).length;
					if ( !size ) {
						$( ".ui-message-container" ).remove();
					}
				})
			}
		},
		notice: {
			info: function () { return Methods.notice( "info", arguments ) },
			success: function () { return Methods.notice( "success", arguments ) },
			warn: function () { return Methods.notice( "warn", arguments ) },
			error: function () { return Methods.notice( "error", arguments ) },
			close: function ( target ) {

				// 可关闭指定消息或所有消息
				$( target || ".ui-notice-wrapper" ).addClass( "ui-notice-hide" ).on("animationend", function () {

					// 关闭后执行 afterClose 回调函数
					var afterClose = $( this ).data( "ui-notice-afterclose" );
					if ( afterClose ) {
						afterClose();
					}

					$( this ).remove();

					// 清理容器
					var size = $( ".ui-notice-wrapper" ).length;
					if ( !size ) {
						$( ".ui-notice-container" ).remove();
					}
				})
			}
		},
		radio: function ( selector, options ) {
            var defaults = {
                data: [],
                vertical: false,
				change: $.noop
            };
            var opt = $.extend( {}, defaults, options );
            var change = $.isFunction( opt.change );

            // 传入的数据必须是数组形式
			if ( !Array.isArray( opt.data ) || !opt.data.length ) {
				return;
			}

			// 构建 radio 结构
			var radio = "";
			opt.data.forEach(function ( obj ) {
				var id = "ui-radio-id-" + Methods.randomID();
				radio += 
					'<div>' +
						'<label ' + 
							'for="' + id + '" ' + 
							'class="ui-radio' + ( obj.checked ? " ui-radio-checked" : "" ) + '"' + 
						'><i></i><span>' + obj.text + '</span>' +
						'</label>' +
						'<input' +
							' type="radio"' +
							' value="' + obj.value + '" ' +
							' id="' + id + '" ' +
							' name="' + ( obj.name || "" ) + '" ' + ( obj.checked ? "checked" : "" ) + 
							' style="display:none;">' +
					'</div>'
				;
			})
			radio = '<div class="ui-radio-container ui-noselect' + ( opt.vertical ? " ui-radio-vertical" : "" ) + '">' + radio + '</div>';

			return $( selector ).each(function () {
				var $this = $( this );

				// 将 radio 结构添加到目标容器内
				function setHTML () {
					$this.html( radio ).find( ".ui-radio-checked:not(:last)" ).removeClass( "ui-radio-checked" );
				}
				setHTML();

				var $container = $this.children();

				// 如果目标容器在 form 内
				// 则监听 reset 事件
				// 以保证在执行 reset 事件时可以恢复复选框初始状态
				var $form = $container.parents( "form" );
				if ( $form.length ) {
					$form.last().on( "reset", setHTML );
				}

				// 复选框点击事件
				$this.on("click", ".ui-radio", function () {

					// 改变复选框的选中状态
					$( this ).addClass( "ui-radio-checked" ).parent().siblings().find( "label" ).removeClass( "ui-radio-checked" );

					// 执行 change 事件
					if ( change ) {
						var values = [];
						$this.find( ".ui-radio-checked + input" ).each(function () {
							values.push( $( this ).val() );
						})
						opt.change( values );
					}
				})
			})
		},
		select: function ( selector, options ) {
            var defaults = {
                data: [],
                multiple: false,
                search: false,
                placeholder: "请选择",
                name: "",
                id: "",
				change: $.noop
            };
            var opt = $.extend( {}, defaults, options );
            var change = $.isFunction( opt.change );

            // 构建 select
			var select = "";
			var textArray = [];
			opt.data.forEach(function ( obj ) {
				textArray.push( obj.text );
				select += 
					'<li ' + 
						'data-text="' + obj.text + '" ' + 
						'data-value="' + obj.value + '" ' + 
						'class="ui-select' + ( obj.selected ? " ui-select-selected" : "" ) + '"' + 
					'><i></i><span>' + obj.text + '</span></li>'
				;
			})
			select = 
				'<div class="ui-select-container ui-noselect">' + 
					'<div class="ui-select-input ui-noselect">' + 
						'<input type="text" class="ui-noselect" spellcheck="false" placeholder="' + opt.placeholder + '" readonly>' + 
						'<i>' + Icon.arrow( 12, 12 ) + '</i>' + 
					'</div>' + 
					'<div class="ui-select-wrapper" style="display:none;">' + 
						'<ul>' + select + '</ul>' + 
					'</div>' + 
				'</div>'
			;

			return $( selector ).each(function () {
				var $this = $( this );
				$this.html( select ).height( 34 );

				var $container = $this.find( ".ui-select-container" ),
					$input = $container.find( "input" ),
					$inputOuter = $input.parent(),
					$wrapper = $container.find( ".ui-select-wrapper" ),
					$li = $container.find( "li" );

				// 创建原生的 select
				var _options = "";
				$li.each(function () {
					_options += '<option value="' + $( this ).attr( "data-value" ) + '"' + ( $( this ).hasClass( "ui-select-selected" ) ? "selected" : "" ) + '>' + $( this ).attr( "data-text" ) + '</option>';
				})
				$this.append( '<select name="' + opt.name + '" id="' + opt.id + '" style="display:none;">' + _options + '</select>' );
				var $option = $this.find( "option" );

				var $defaultSelected = $container.find( ".ui-select-selected" );
				if ( !opt.multiple ) {
					$defaultSelected.each(function ( i ) {
						if ( i ) {
							$( this ).removeClass( "ui-select-selected" );
						}
					})
					$input.val( $defaultSelected.attr( "data-text" ) );
				} else {
					$this.data( "ui-select-multiple", true );
					$option.parent().prop( "multiple", true );
					var selected = [];
					$defaultSelected.each(function () {
						selected.push( $( this ).attr( "data-value" ) );
					})
					$input.val( "已选择 " + selected.length + " 项" );
				}
				if ( opt.search ) {
					var has = false;
					$wrapper.prepend( '<input type="text" placeholder="请输入关键词">' );
					$wrapper.find( "input" ).on("valueChange", function ( event, value ) {
						if ( value ) {
							has = false;
							$li.hide();
							$.each(textArray, function ( i, v ) {
								if ( v.indexOf( value ) > -1 ) {
									has = true;
									$li.eq( i ).show();
								}
							})
							if ( !has && !$wrapper.find( "p" ).length ) {
								$wrapper.append( "<p>无匹配数据</p>" );
							}
							if ( has ) {
								$wrapper.find( "p" ).remove();
							}
						} else {
							has = false;
							$li.show();
							$wrapper.find( "p" ).remove();
						}
					})
				}

				$wrapper.on("click", "li", function () {
					var _this = $( this );
					var $targetOption = $option.eq( _this.index() );
					if ( opt.multiple ) {
						_this.toggleClass( "ui-select-selected" );
						if ( _this.hasClass( "ui-select-selected" ) ) {
							$targetOption.prop( "selected", true );
						} else {
							$targetOption.removeProp( "selected" );
						}
						if ( change ) {
							var selected = [];
							$container.find( ".ui-select-selected" ).each(function () {
								selected.push( $( this ).attr( "data-value" ) );
							})
							opt.change( selected );
							$input.val( "已选择 " + selected.length + " 项" );
						}
					} else {
						_this.addClass( "ui-select-selected" ).siblings().removeClass( "ui-select-selected" );
						var $selected = $wrapper.find( ".ui-select-selected" );
						if ( change ) {
							opt.change( $selected.attr( "data-value" ) );
						}
						$wrapper.hide().find( "input" ).val( "" );
						$input.val( $selected.attr( "data-text" ) );
						$inputOuter.removeClass( "active" );
						$li.show();
						$targetOption.prop( "selected", true );
					}
				})

				// 监听 reset 事件
				var $form = $this.parents( "form" );
				if ( $form.length ) {
					$form.on("reset", function () {
						$li.removeClass( "ui-select-selected" );
					})
				}

				$inputOuter.click(function () {
					$inputOuter.toggleClass( "active" );
					$( ".ui-select-wrapper" ).not( $wrapper ).hide();
					$wrapper.toggle();
					if ( $wrapper.is( ":hidden" ) ) {
						$wrapper.find( "input" ).val( "" ).end().find( "p" ).remove();
						$li.show();
					}
				})

				$document.on("click contextmenu", function ( event ) {
					if ( !$this.is( event.target ) && !$this.has( event.target ).length ) {
                        $wrapper.hide().find( "input" ).val( "" );
                        $inputOuter.removeClass( "active" );
                        if ( !$wrapper.find( ".ui-select-selected" ).length ) {
                        	$input.val( "" );
                        }
                        $li.show();
                        $wrapper.find( "p" ).remove();
					}
				})
			})
		},
		switch: function ( selector, options ) {
            var defaults = {
                showText: false,
				open: false,
				change: $.noop
            };
            var opt = $.extend( {}, defaults, options );
            var change = $.isFunction( opt.change );

            return $( selector ).each(function () {
            	var $this = $( this );
            	$this.html(
					'<div class="ui-switch-container ui-noselect">' + 
						'<div class="ui-switch-text">开</div>' + 
						'<div class="ui-switch-text active">关</div>' + 
						'<div class="ui-switch-dot"></div>' + 
					'</div>'
            	);
            	var $container = $this.find( ".ui-switch-container" ),
            		$text = $container.find( ".ui-switch-text" ),
            		$dot = $container.find( ".ui-switch-dot" );
            	var isOpen = false;
            	if ( !opt.showText ) {
            		$text.remove();
            	}
            	if ( opt.open ) {
            		$container.add( $dot ).addClass( "active" );
            		$text.toggleClass( "active" );
            		isOpen = true;
            	}
            	$container.click(function () {
            		$container.add( $text ).add( $dot ).toggleClass( "active" );
            		isOpen = !isOpen;
            		if ( change ) {
            			opt.change( isOpen );
            		}
            	})
            })
		},
		page: function ( selector, options ) {
            var defaults = {
                total: 1,
                pageSize: 1,
                currentPage: 1,
                simple: true,
                change: $.noop
            };
            var opt = $.extend( {}, defaults, options );

            var $tbodySelector = $( selector );
            var Index = 0;

            // 计算页数
            var perPage = "";
            var pages = opt.total / opt.pageSize;
            pages = pages >= 1 ? ( opt.total % opt.pageSize > 0 ? ~~pages + 1 : pages ) : pages; 
            if ( pages < 1 ) {
                pages = 1;
            }
            for ( var i = 1; i <= pages; i++ ) {
                perPage += '<i data-id=' + i + '>' + i + '</i>';
            }
            perPage = "<div>" + perPage + "</div>";

            var displayNone = !!( $tbodySelector.css( "display" ) === "none" );
            displayNone && $tbodySelector.show();

            $tbodySelector.empty().css( "overflow", "hidden" ).html(
                '<div class="ui-page-container ui-noselect">' + 
                    '<div class="ui-page-first">首页</div>' + 
                    '<div class="ui-page-prev">上一页</div>' + 
                    '<div class="ui-page-wrapper">' + perPage + '</div>' + 
                    '<div class="ui-page-next">下一页</div>' + 
                    '<div class="ui-page-last">尾页</div>' + 
                '</div>'
            );

            function doClass ( target ) {
                target.addClass( "active" ).siblings().removeClass( "active" );
            }

            var $pageBox = $tbodySelector.find( ".ui-page-wrapper div" );
            var $page = $pageBox.children();
            var pageWidth = $page.first().outerWidth( true );
            $page.first().addClass( "active" );
            $pageBox.width( pageWidth * pages ).on("click", "i", function () {
                var $this = $( this );
                var id = $this.attr( "data-id" );
                Index = id - 1;
                if ( !$this.is( ".active" ) ) {
                    $.isFunction( opt.change )&& opt.change( ~~id );
                    doClass( $this );
                }
                $tbodySelector.find( "input" ).val( Index + 1 );
            })
            if ( pages >= 10 ) {
            	$pageBox.parent().width( pageWidth * 10 );
            }

            // 偏移量
            function offset ( sign ) {
                if ( pages > 10 ) {
                    switch ( sign ) {
                        case "first":
                        	$pageBox.css( "marginLeft", 0 );
                        break;
                        case "last":
                        	$pageBox.css( "marginLeft", ( 10 - pages ) * pageWidth + "px" );
                        break;
                        case "prev": 
	                        var left = 0;
	                        if ( ( Index + 1 ) % 10 === 0 && Index > 0 ) {
	                            if ( Index >= 10 ) {
	                                left = -( Index + 1 - 10 );
	                            } else {
	                                left = 0;
	                            }
	                            $pageBox.css( "marginLeft", left * pageWidth + "px" );
	                        } else {
	                            if ( ~~( ( Index + 1 ) / 10 ) < ~~( pages / 10 ) ) {
	                                left = -( Index + 1 - ( Index + 1 ) % 10 );
	                                $pageBox.css( "marginLeft", left * pageWidth + "px" );
	                            }
	                        }
                        break;
                        case "next":
	                        if ( Index % 10 === 0 && Index < pages ) {
	                            var left = 0;
	                            if ( pages - Index >= 10 ) {
	                                left = -Index / 10 * 10;
	                            } else {
	                                left = -( pages - 10 );
	                            }
	                            $pageBox.css( "marginLeft", left * pageWidth + "px" );
	                        }
                        break;
                    }
                }
                $tbodySelector.find( "input" ).val( Index + 1 );
            }

            // 回调
            function callback ( id ) {
                opt.change( ~~id );
            }

            // 第一页
            $tbodySelector.find( ".ui-page-first" ).click(function () {
                if ( Index !== 0 ) {
                    doClass( $page.first() );
                    Index = 0;
                    offset( "first" );
                    callback( $page.first().attr( "data-id" ) );
                }
            })

            // 最后一页
            $tbodySelector.find( ".ui-page-last" ).click(function () {
                if ( Index !== pages - 1 ) {
                    doClass( $page.last() );
                    Index = pages - 1;
                    offset( "last" );
                    callback( $page.last().attr( "data-id" ) );
                }
            })

            // 前一页
            $tbodySelector.find( ".ui-page-prev" ).click(function () {
                if ( Index > 0 ) {
                    Index--;
                    offset( "prev" );
                    doClass( $page.eq( Index ) );
                    callback( $page.eq( Index ).attr( "data-id" ) );
                } 
            })

            // 后一页
            $tbodySelector.find( ".ui-page-next" ).click(function () {
                if ( Index < pages - 1 ) {
                    Index++;
                    doClass( $page.eq( Index ) );
                    offset( "next" );
                    callback( $page.eq( Index ).attr( "data-id" ) );
                }
            })

            // 页数检测
            function checkPage ( i ) { 
                $tbodySelector.find( "i" ).filter( '[data-id="' + i + '"]' ).trigger( "click" );
                if ( pages > 10 ) {
                    var p = ( ( i - 10 ) / 10 ) + "";
                    if ( p.indexOf( "." ) > -1 ) {
                        p = p.substring( p.indexOf( "." ) + 1 );
                    } else {
                        p = 0;
                    }
                    var left = 0;
                    if ( pages - Index >= 10 ) {
                        left = -Index / 10 * 10 + Number( p ) - 1; 
                        if ( p === 0 ) {
                        left = left + 10;
                        }
                        if ( left > -10 ) {
                        left = 0;
                        }
                    } else {
                        left = 10 - pages;
                    }
                    $pageBox.css( "marginLeft", left * pageWidth + "px" );
                }
            }

            // 当前页数
            var current = opt.currentPage;
            if ( current > pages ) {
                current = pages;
            }
            if ( opt.currentPage > 1 ) {
                checkPage( current );
            }

            // 显示直接跳转
            if ( !opt.simple ) {
                $tbodySelector.prepend(
                    '<div class="ui-page-total">' +
                        '共 <span>' + opt.total + '</span> 条' +
                    '</div>'
                );
                $tbodySelector.append('<div class="ui-page-to">跳至<input type="text" maxlength="4">页</div>')
                .find( "input" ).val( current ).valueChange(function ( e, v ) {
                    $( this ).val( v.replace( /[^0-9]/g, "" ) );
                }).on("focus", function () {
                    var _this = $( this );
                    $document.keyup(function ( event ) {
                        var code = event.keyCode;
                        if ( code == 108 || code == 13 ) {
                        var value = $.trim( _this.val() );
                        if ( !value ) {
                            return;
                        }
                        if ( value > pages ) {
                            value = pages;
                        }
                        if ( !$.isNumeric( Number( value ) ) ) {
                            value = 1;
                        }
                        _this.val( value );
                        checkPage( value );
                        }
                    })
                });
            }
            $tbodySelector.children().wrapAll( '<div class="ui-page-outer"></div>' );

            displayNone && $tbodySelector.hide();
		},
		table: function ( selector, options ) {
			var defaults = {
				data: {
                    thead: null,
                    tbody: null
                },
                height: "auto",
                theadHeight: 46,
                stripe: false,
                hoverHighLight: true,
                align: "left",
                autoNumber: null,
                selection: false,
                defaultSelectedAll: false
			};
			var opt = $.extend( {}, defaults, options );
			var theadData = opt.data.thead,
				tbodyData = opt.data.tbody;

			// 必须传入数据
			if ( !Array.isArray( theadData ) || 
				 !theadData.length || 
				 !Array.isArray( tbodyData ) || 
				 !tbodyData.length 
			) {
				return;
			}

			// 解析头部数据
			var labelArray = [];
			var header = "";
			theadData.forEach(function ( data ) {
				labelArray.push( data.label );
				header += 
					'<td data-label="' + data.label + '" ' +
						'data-sort="' + ( data.sort || "false" ) + '"' +
						'style="width:' + ( $.isNumeric( data.width ) ? data.width - 21 + "px" : "auto" ) +
					'"><div><span>' + data.title + '</span></div></td>';
			})
			header = '<table><tr>' + header + '</tr></table>';

			// 解析主体数据
			var body = "";
			var td;
			tbodyData.forEach(function ( data, i ) {
				td = "";
				labelArray.forEach(function ( v ) {
					td += '<td data-label="' + v + '" data-text="' + data[ v ] + '"><div>' + data[ v ] + '<div></td>';
				})
				body += '<tr data-index="' + i + '">' + td + '</tr>';
			})
			body = '<table>' + body + '</table>';

			// 最终结构
			var result = 
				'<div class="ui-table-container">' +
					'<div class="ui-table-thead">' + header + '</div>' +
					'<div class="ui-table-tbody">' + body + '</div>' +
				'</div>'
			;

			return $( selector ).each(function () {
				var $this = $( this );

				// 添加初始化数据结构
				$this.html( result );

				var $container = $this.children(),
					$thead = $container.children().first(),
					$tbody = $thead.next(),
					$theadTD = $thead.find( "td" ),
					$tbodyTable = $tbody.find( "table" ),
					$tbodyFirstTR_td = $tbodyTable.find( "tr:first-child td" );

				// 自动添加序号
				var autoNumber = opt.autoNumber;
				var $auto, $tbodyAuto;
				if ( $.isPlainObject( autoNumber ) && !$.isEmptyObject( autoNumber ) ) {
					$container.find( "tr" ).prepend( '<td class="ui-table-autonumber"></td>' );
					$auto = $container.find( ".ui-table-autonumber" );
					$tbodyAuto = $tbody.find( ".ui-table-autonumber" );
					$auto.width( autoNumber.width || 30 ).first().text( autoNumber.text ).addClass( "ui-table-autonumber-title" );
					$auto.not( ".ui-table-autonumber-title" ).each(function ( i ) {

						// 序号从 1 开始以升序设置
						$( this ).text( i + 1 );
					})
					if ( autoNumber.align ) {
						$auto.css( "textAlign", autoNumber.align );
					}
				}

				// 添加选择框
				if ( opt.selection ) {
					$container.find( "tr" ).prepend( '<td class="ui-table-select"><i></i></td>' );
					var $theadSelect = $thead.find( ".ui-table-select i" ),
						$tbodySelect = $tbody.find( ".ui-table-select" ),
						$theadSelectParent = $theadSelect.parent();
					var selectSize = $tbodySelect.length;
					$tbody.on("click", ".ui-table-select i", function () {
						$( this ).parent().toggleClass( "ui-table-selected" );

						// 判断是否已经全选
						var classType = selectSize === $tbody.find( ".ui-table-selected" ).length ? "addClass" : "removeClass";
						$theadSelect.parent()[ classType ]( "ui-table-selected" );
					})

					// 全选 / 全不选
					$theadSelect.click(function () {
						$theadSelectParent.toggleClass( "ui-table-selected" );
						var classType = $theadSelectParent.hasClass( "ui-table-selected" ) ? "addClass" : "removeClass";

						// 不使用缓存的 DOM 
						// 始终获取实时元素
						// 以防排序控制中替换元素后导致选择框事件无效
						$tbody.find( ".ui-table-select" )[ classType ]( "ui-table-selected" );
					})

					// 默认全选
					if ( opt.defaultSelectedAll ) {
						$theadSelectParent.add( $tbodySelect ).addClass( "ui-table-selected" );
					}
				}

				// 添加排序按钮
				$thead.find( '[data-sort="true"] div' ).append(
                    '<span class="ui-table-arrow">' +
                        '<i class="ui-table-sort-up"></i>' +
                        '<i class="ui-table-sort-down"></i>' +
                    '</span>'
                );

				// 表格实际高度是否超过了限定高度
				var over = ( $tbodyTable.height() - opt.height - opt.theadHeight ) > 0;

				// 标题区域的高度
				$thead.height( opt.theadHeight );
				$theadTD.height( opt.theadHeight - 1 ).css( "padding", "0 10px" );

				// 限定了高度
				if ( $.isNumeric( opt.height ) ) {
					$container.height( opt.height );
					$tbody.height( opt.height - opt.theadHeight );
					if ( over ) {
						$container.addClass( "ui-table-bodyscroll" );
						$tbodyTable.css( "width", "calc(100% + " + ( $thead.outerWidth() - $tbodyTable.outerWidth() ) + "px)" );
					}
				}

				// 计算单元格宽度
				function calcWidth () {
					var widthArray = [];
					$theadTD.each(function () {
						widthArray.push( $( this ).innerWidth() );
					})
					widthArray.forEach(function ( w, index ) {
						$tbodyFirstTR_td.eq( index ).innerWidth( w );
					})
				}
				calcWidth();

				// 针对表格外层容器宽度是 auto 或 100% 且横向全屏时
				// 缩放可视区域窗口大小时可以实时调整单元格宽度
				$window.on( "resize", calcWidth );

				// 斑马纹
				if ( opt.stripe ) {
					$tbody.addClass( "ui-table-stripe" );
				}

				// 对齐方式
				$container.addClass( "ui-table-align-" + opt.align );

				// 悬浮高亮
				if ( opt.hoverHighLight ) {
					$tbody.addClass( "ui-table-hoverhighlight" );
				}

				// 存储初始化状态下的表格主体结构
				var initHTML = $tbody.html();

				// 存储整个表格的初始结构
				$this.data( "ui-table-init", $this.find( "table" ).clone( true ) );

				// 排序操作
				var $sort = $( ".ui-table-arrow i" );
				var index;
				var htmlArray;
				$sort.click(function () {
					htmlArray = [];
					var $this = $( this ),
						$td = $this.parent().parent().parent();

					// 记录所属单元格的索引值
					index = $td.index();

					// 改变按钮状态
					$this.toggleClass( "active" ).siblings().removeClass( "active" );
					$td.siblings().find( ".active" ).removeClass( "active" );

					// 按钮激活状态下
					if ( $this.hasClass( "active" ) ) {

						// 将表格每一行的索引值和 outerHTML 存进数组
						$tbodyTable.find( "tr" ).each(function () {
							htmlArray.push( [ $( this ).find( "td" ).eq( index ).attr( "data-text" ), $( this ).get( 0 ).outerHTML ] );
						})

						// 比较函数 ( 仅支持数字和日期排序 )
						var first = htmlArray[ 0 ][ 0 ];
						function compare ( bool ) {
							if ( $.isNumeric( first ) ) {
								return function ( a, b ) {
									return bool ? ( a[ 0 ] - b[ 0 ] ) : ( b[ 0 ] - a[ 0 ] );
								}
							} else {
								return function ( a, b ) {
									var _a = Date.parse( a[ 0 ] ),
										_b = Date.parse( b[ 0 ] );
									return bool ? ( _a - _b ) : ( _b - _a );
								}
							}
						}

						// 排序
						htmlArray.sort( compare( !!$this.hasClass( "ui-table-sort-up" ) ) );

						// 根据排序结果生成表格
						var result = "";
						htmlArray.forEach(function ( html ) {
							result += html[ 1 ];
						})
						result = "<tbody>" + result + "</tbody>";
						$tbodyTable.html( result );

						// 重置自动序号
						resetAutoNumber();
					} else {

						// 恢复排序前的状态
						var $getSelected = $tbody.find( ".ui-table-selected" );
						var selected = []; 
						$getSelected.each(function () {
							selected.push( $( this ).parent().attr( "data-index" ) );
						})
						$tbodyTable.html( initHTML ).find( ".ui-table-select" ).removeClass( "ui-table-selected" );

						// 保证已选择的行正确
						selected.forEach(function ( i ) {
							$tbodyTable.find( ".ui-table-select" ).eq( i ).addClass( "ui-table-selected" );
						})
					}
				})

				// 重置自动序号
				function resetAutoNumber () {
					$tbodyTable.find( ".ui-table-autonumber" ).each(function ( i ) {
						$( this ).text( i + 1 );
					});
				}
			})
		},
		tabs: function ( selector, options ) {
			var defaults = {
				theme: "line",
				active: 0
			};
			var opt = $.extend( {}, defaults, options );

			$( selector ).each(function () {
                var $this = $( this );
                var $header = $this.children().first(),
                    $content = $header.next(),
                    $tab = $header.children();
				var active = opt.active > $tab.length ? $tab.length - 1 : opt.active;

				$header.addClass( "ui-tabs-header ui-noselect" ).append( '<div class="ui-tabs-line"></div>' );
				$content.addClass( "ui-tabs-content" );

				var $box = $content.children(),
					$line = $header.find( ".ui-tabs-line" );
				$box.hide().eq( active ).show();

				// 卡片主题
				if ( opt.theme === "card" ) {
					$header.addClass( "ui-tabs-card" );
					$line.remove();
				}

				// 线性主题样式
				function lineStyle ( i, bool ) {
					$line.stop().animate({
						width: $tab.eq( i ).innerWidth() + "px",
						left: (function () {
							var l = 0;
							$tab.each(function ( item ) {
								if ( item < i ) {
									l += $( this ).innerWidth();
								}
							})
     						return l + "px";
						})()
					}, bool ? 0 : 200); 
				}
				lineStyle( active, true );

				$tab.eq( active ).addClass( "ui-tabs-active" ).end().click(function () {
					var index = $( this ).index();
					$( this ).addClass( "ui-tabs-active" ).siblings().removeClass( "ui-tabs-active" );
					$box.eq( index ).show().siblings().hide();
					lineStyle( index );
				});
			})
		},
		top: function ( selector, duration ) {
			var $htmlbody = $( "html, body" );
			function top ( elem, time ) {
				var $elem = $( elem );

				// 若元素默认处于隐藏状态
				// 则监听 window 的 scroll 事件
				if ( $elem.is( ":hidden" ) ) { 
					function scrollFn () {
						var top = $window.scrollTop();
						if ( top > 300 ) {
							$elem.show();
						}
						if ( top === 0 ) {
							$elem.hide();
						}
					}
					$window.scroll( scrollFn );
				}

				// 点击按钮返回顶部
				$elem.click(function () {
					if ( !$htmlbody.is( ":animated" ) && $htmlbody.scrollTop() ) {
						$htmlbody.animate({
							scrollTop: 0
						}, time); 
					}
				})
			}

			// 默认滚动动画时长 400ms 
			var defaultDuration = 400;

			var isNum = $.isNumeric( selector );

			if ( selector && !isNum ) {
				top( $( selector ).last(), duration || defaultDuration );
			}
			if ( !selector || isNum ) {
				$( "body" ).append( '<div class="ui-top"><div></div></div>' );
				top( "body > .ui-top:last-child", isNum ? selector : defaultDuration );
			}
		},
		upload: function ( options ) {
			var defaults = {
				url: "",
				data: null,
				name: "file",
				progress: "",
				multiple: false,
				success: $.noop,
				error: $.noop
			};
			var opt = $.extend( {}, defaults, options );
			  
			// 添加文件选择框
			$( ".ui-upload-file" ).remove();
			$("<input>", {
				type: "file",
				style: "display:none",
				"class": "ui-upload-file"
			}).appendTo( "body" );
			var $file = $( ".ui-upload-file" ).last();

			// 可以多选
			if ( opt.multiple ) {
				$file.attr( "multiple", "multiple" );
			}
			
			var ajaxArray = [];

			$file.click().off( "change" ).on("change", function () {
				var files = [];
				$.each(this.files, function ( i, v ) {
					files.push( v );
				})
				var length = files.length;
				var Data = new FormData();
				
				// ajax 配置
				var ajaxOptions = {
					url: opt.url,
					type: "POST",
					cache: false, 
					processData: false,
					contentType: false
				};

				$.each(files, function ( i, v ) {
					Data.append( opt.name, v );
					ajaxOptions.data = Data;
					if ( opt.progress ) {
						var $progress = $( opt.progress );
						$progress.append( Methods.progress( i + 1 ) );
						var $container = $progress.find( '.ui-progress-container[data-id="' + ( i + 1 ) + '"]' ).not( ".ui-progress-pending, .ui-progress-over" ),
							$line = $container.find( ".ui-progress-box" ).children(),
							$text = $container.find( ".ui-progress-result" );
						ajaxOptions.xhr = function () {
							var XHR = $.ajaxSettings.xhr();
	                        if( XHR.upload ) {
	                            XHR.upload.addEventListener("progress",function ( event ) {                            
	                                var loaded = event.loaded;
	                                var total = event.total;
	                            	var percent = Math.floor( ( loaded / total ) * 100 ) + "%";
	                                $line.width( percent );
	                                $text.text( percent );
	                                $container.addClass( "ui-progress-pending" );
	                                if ( percent.replace( "%", "" ) === "100" ) {
	                                	$line.css( "backgroundColor", "#08ba61" );
	                                	$text.text( "完成" ).css( "color", "#08ba61" );
	                                	$container.addClass( "ui-progress-over" ).removeClass( "ui-progress-pending" );
	                                }
	                            }, false);
	                        }
	                        return XHR;
						}
					}
					ajaxArray.push( $.ajax( ajaxOptions ) );
				})

				if ( !ajaxArray.length ) {
					return;
				}
				$.when.apply( this, ajaxArray ).done(function () {
					if ( $.isFunction( opt.success ) ) {
						opt.success( arguments );
					}
				}).fail(function () {
					if ( $.isFunction( opt.error ) ) {
						opt.error( arguments );
					}
				});
				$file.remove();
			})
			if ( IE11 || UA.match( "edge" ) ) {
				$file.trigger( "change" );
			}
		}
	};

	// 获取自动完成的结果值
	UI.autoComplete.value = function ( $target ) {
		return $target.find( ".ui-autocomplete-container > input" ).val();
	}

	// 获取日期选择器的值
	UI.datePicker.value = function ( $target ) {
		return $target.data( "ui-datepicker-value" );
	}

	// 信息展示类弹框
	UI.dialog.info = function ( title, content ) { 
		Methods.dialogShortcuts( "info", title, content );
		return UI.dialog; 
	}
	UI.dialog.success = function ( title, content ) { 
		Methods.dialogShortcuts( "success", title, content ); 
		return UI.dialog; 
	}
	UI.dialog.warn = function ( title, content ) { 
		Methods.dialogShortcuts( "warn", title, content ); 
		return UI.dialog; 
	}
	UI.dialog.error = function ( title, content ) { 
		Methods.dialogShortcuts( "error", title, content ); 
		return UI.dialog; 
	}

	// 请等待
	UI.dialog.waiting = function ( text ) {
		UI.dialog({
			WAITING: text || "请等待"
		});
	}

	// 可输入对话框
	UI.dialog.prompt = function () {
		var arg = arguments;
		var defaults = {
			title: "",
		    placeholder: "",
		    autofocus: true,
		    maxlength: Infinity,
		    type: "text",
		    callback: $.noop
		};
		var obj = {};
		if ( $.isPlainObject( arg[ 0 ] ) ) {
			obj = arg[ 0 ];
		} else {
			obj.title = arg[ 0 ];
			var size = arg.length;
			if ( size === 2 ) {
				obj.callback = arg[ 1 ];
			}
			if ( size === 3 ) {
				obj.placeholder = arg[ 1 ];
				obj.callback = arg[ 2 ];
			}
		}
		var opt = $.extend( {}, defaults, obj );
		UI.dialog({
			PROMPT: opt
		});
		return UI.dialog;
	}

	// 可输入对话框的反馈信息
	UI.dialog.prompt.errorFeedBack = function ( text ) {
		var $prompt = $( ".ui-dialog-prompt" );
		if ( text ) {
			$prompt.prepend( "<p>" + text + "</p>" );
			$prompt.find( "input" ).focus();
		} else {
			$prompt.find( "p" ).remove();
		}
	}

	// 专门针对信息展示类弹框的阻止确定按钮关闭对话框的方法
	UI.dialog.okNotClose = function () {
		$( ".ui-dialog-ok" ).addClass( "ui-dialog-notclose" );
		return UI.dialog;
	}

	// 对话框的全局关闭方法
	UI.dialog.close = function ( target, context ) {
		var doc = ( context || window ).document;

		// 可关闭指定对话框或所有对话框
		var $target = $( target || ".ui-dialog-container", doc );
		
		if ( !$target.length ) {
			return;
		}

		$target.each(function () {
			var $this = $( this ),
				$wrapper = $( ".ui-dialog-wrapper", $this ),
				$mask = $( ".ui-dialog-mask", $this );

			$wrapper.addClass( "ui-dialog-wrapper-hide" );
			$wrapper.on("animationend", function () {

				// 关闭后执行 afterClose 回调函数
				var afterClose = $this.data( "ui-dialog-afterclose" );
				if ( afterClose ) {
					afterClose();
				}

				$this.remove();
				$( "body", doc ).removeClass( "ui-body-noscroll" );
			})

			$mask.addClass( "ui-dialog-mask-hide" );
		})
	}

	// 对话框的全局移除
	UI.dialog.remove = function ( target, context ) {
		var doc = ( context || window ).document;
		$( target || ".ui-dialog-container", doc ).remove();	
	}

	// 专门针对信息展示类弹框的确定按钮点击事件
	UI.dialog.ok = function ( callback ) {
		var $shortcutsOK = $( ".ui-dialog-shortcuts-mark .ui-dialog-ok" );
		var callbackFn = $.isFunction( callback );
		$shortcutsOK.click(function () {

			// 调用了 okNotClose 方法
			// 此时点击确定按钮将不会关闭对话框
			// 需手动在 callback 中调用 Dialog.close() 才能关闭
			if ( $shortcutsOK.hasClass( "ui-dialog-notclose" ) ) {

				// 确保只能点击一次
				// 防止事件重复执行
				$shortcutsOK.css( "pointerEvents", "none" );
				
				// 执行 callback
				callbackFn && callback( $shortcutsOK );
			} else {
					
				// 正常关闭并在关闭动画结束后执行 callback
				$( ".ui-dialog-shortcuts-mark" ).on("animationend", function () {
					callbackFn && callback();
				})
			}
		})
	}

	// 数字输入框取值和重置
	UI.inputNumber.value = function ( $target ) {
		return parseFloat( $target.find( "input" ).val() );
	}
	UI.inputNumber.reset = function ( $target ) {
		return $target.find( "input" ).val( $target.data( "ui-inputnumber-options" ).defaultValue );
	}

	// 获取下拉框的值
	UI.select.value = function ( $target ) {
		var isMultiple = $target.data( "ui-select-multiple" );
		var $tbodySelected = $target.find( ".ui-select-selected" );
		if ( isMultiple ) {
			var result = [];
			$tbodySelected.each(function () {
				result.push( $( this ).attr( "data-value" ) );
			})
			return result;
		} else {
			return $tbodySelected.attr( "data-value" );
		}
	}

	// 抽屉关闭方法
	UI.drawer.close = function ( callback ) {
		var $container = $( ".ui-drawer-container" );
		if ( $container.is( ":visible" ) ) {
			$( ".ui-drawer-mask" ).addClass( "ui-drawer-mask-hide" );
			$( ".ui-drawer-wrapper" ).addClass( "ui-drawer-wrapper-hide" ).on("animationend", function () {
				$( this ).off( "animationend" );
				$container.hide().children().removeClass( "ui-drawer-mask-show ui-drawer-mask-hide ui-drawer-wrapper-show ui-drawer-wrapper-hide" );
				if ( $.isFunction( callback ) ) {
					callback( $container.find( ".ui-drawer-header" ), $container.find( ".ui-drawer-body > div" ) );
				}
			});
		}
	}

	// 加载动画关闭方法
	UI.loading.close = function ( $target ) {
		var cachePosition = $target.data( "ui-loading-position" );
		cachePosition ? $target.css( "position", cachePosition ) : $target.get( 0 ).style.removeProperty( "position" );
		$target.children( ".ui-loading-container" ).remove();
	}

	// 判断开关的是否开启
	UI.switch.isOpen = function ( $target ) {
		return $target.children().hasClass( "active" );
	}

	// 获取单选框的值
	UI.radio.value = function ( $target ) {
		return $target.find( ".ui-radio-checked + input" ).val();
	}

	// 获取复选框的值
	UI.checkbox.value = function ( $target ) {
		var values = [];
		$target.find( ".ui-checkbox-checked + input" ).each(function () {
			values.push( $( this ).val() );
		})
		return values;
	}

	// 复选框的全选 / 全不选 / 反选
	UI.checkbox.all = function ( $target ) {
		$target.find( ".ui-checkbox" ).addClass( "ui-checkbox-checked" ).next().prop( "checked", true );
	}
	UI.checkbox.none = function ( $target ) {
		$target.find( ".ui-checkbox" ).removeClass( "ui-checkbox-checked" ).next().removeProp( "checked" );
	}
	UI.checkbox.reverse = function ( $target ) {
		$target.find( ".ui-checkbox" ).toggleClass( "ui-checkbox-checked" ).each(function () {
			var $this = $( this );
			if ( $this.hasClass( "ui-checkbox-checked" ) ) {
				$this.next().prop( "checked", true );
			} else {
				$this.next().removeProp( "checked" );
			}
		})
	}

	// 获取邮箱地址
	UI.email.value = function ( $target ) {
		return $target.find( "input" ).val();
	}

	// 获取表格选中项
	UI.table.selected = function ( $target ) {
		var result = [];
		$target.find( ".ui-table-tbody .ui-table-selected" ).each(function () {
			var obj = {};
			$( this ).siblings( "[data-label]" ).each(function () {
				obj[ $( this ).attr( "data-label" ) ] = $( this ).attr( "data-text" );
			})
			result.push( obj );
		})
		return result;
	}

	// 将表格导出为 Excel ( 导出功能依赖其它资源，此资源不属于 DreamUI )
	UI.table.toExcel = function ( $target, options ) {
		var defaults = {
			name: "Excel",
			keepSort: false
		};
		var opt = $.extend( {}, defaults, options );

		// 必须是通过 UI.table() 创建的表格 
		if ( !$target.children().hasClass( "ui-table-container" ) ) {
			return;
		}

		// toExcel 方法依赖一个外部文件
        // 必须引入这个文件才能执行导出操作
		if ( $.isFunction( window.TableExport ) && 
			 $.isFunction( window.saveAs ) && 
			 typeof window.XLSX === "object" 
		) {
			var id = Math.random().toString( 36 ).substr( 2 );

			// 根据 keepSort 属性决定导出表格的类型
			// true 的情况下导出最新状态下的表格（可保留排序状态）
			// false 的情况下导出原始表格
			var $cloneTable = opt.keepSort ? $target.find( "table" ).clone( true ) : $target.data( "ui-table-init" );

			// 整理表格
			$( "body" ).append( '<table id="ui-table-excel-' + id + '"><tbody></tbody></table>' );
			var $el = $( "#ui-table-excel-" + id );
			$cloneTable.each(function () {
				$( this ).find( ".ui-table-select, .ui-table-autonumber, .ui-table-arrow" ).remove();
				$( this ).find( "tr" ).appendTo( $el.children() );
			})
			
			$el.hide().find( "tr, td" ).removeAttr( "style class data-index data-label data-text data-sort" );

			// 执行导出操作
			TableExport($el.get( 0 ), {
                headers: true,
                footers: true,
                formats: [ "xlsx" ], 
                filename: opt.name,
                bootstrap: false,
                exportButtons: true,
                position: "bottom",
                ignoreRows: null,
                ignoreCols: null,
                trimWhitespace: true
			});
            $el.find( "caption button" ).click();
            $el.remove();
		}
	}

	!(function freezeUI ( obj ) {
		Object.freeze( obj );
		Object.keys( obj ).forEach(function ( v ) {
			if ( typeof obj[ v ] === "object" ) {
				freezeUI( obj[ v ] );
			}
		})
	})( UI );

	return UI;

});