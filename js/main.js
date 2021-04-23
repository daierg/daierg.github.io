//页面加载loading代码
	//获取浏览器页面可见高度和宽度
	var _PageHeight = document.documentElement.clientHeight,
		_PageWidth = document.documentElement.clientWidth;
	//计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
	var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0,
		_LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2 : 0;
	//在页面未加载完毕之前显示的loading Html自定义内容
	var _LoadingHtml = '<div id="loadingDiv" style="position:fixed;left:0;width:100%;height:' + _PageHeight +
		'px;top:0;background:#242943;opacity:1;filter:alpha(opacity=80);z-index:999999;"><div style="position: absolute; cursor: wait; left:calc(50% - 200px); top:calc(50% - 200px); width: 400px; height: 400px; line-height: 0; padding-left: 0; padding-right: 0; border: none; color: #242943; font-family:\'Microsoft YaHei\';"></div></div>';
	//呈现loading效果
	document.write(_LoadingHtml);

	//window.onload = function () {
	//    var loadingMask = document.getElementById('loadingDiv');
	//    loadingMask.parentNode.removeChild(loadingMask);
	//};

	//监听加载状态改变
	document.onreadystatechange = completeLoading;

	//加载状态为complete时移除loading效果
	function completeLoading() {
		if (document.readyState == "complete") {
			var loadingMask = document.getElementById('loadingDiv');
			loadingMask.parentNode.removeChild(loadingMask);
		}
	}
//页面加载loading代码结束

//蜘蛛丝
function async_load() {
           
	i.scrolling = "no";
	i.frameborder = "0";
	i.border = "0";
	i.setAttribute("frameborder", "0", 0);
	i.width = "400px";
	i.height = "60px";
	document.getElementById("banner").appendChild(i);
}

if (window.addEventListener) {window.addEventListener("load", async_load, false);}
else if (window.attachEvent) {window.attachEvent("onload", async_load);}
else {window.onload = async_load;}

! function() {
	//封装方法，压缩之后减少文件大小
	function get_attribute(node, attr, default_value) {
		return node.getAttribute(attr) || default_value;
	}
	//封装方法，压缩之后减少文件大小
	function get_by_tagname(name) {
		return document.getElementsByTagName(name);
	}
	//获取配置参数
	function get_config_option() {
		var scripts = get_by_tagname("script"),
			script_len = scripts.length,
			script = scripts[script_len - 1]; //当前加载的script
		return {
			l: script_len, //长度，用于生成id用
			z: get_attribute(script, "zIndex", -99), //z-index
			o: get_attribute(script, "opacity", 0.4), //opacity
			c: get_attribute(script, "color", "255,255,255"), //color
			n: get_attribute(script, "count", 400) //count
		};
	}
	//设置canvas的高宽
	function set_canvas_size() {
		canvas_width = the_canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, 
		canvas_height = the_canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	}

	//绘制过程
	function draw_canvas() {
		context.clearRect(0, 0, canvas_width, canvas_height);
		//随机的线条和当前位置联合数组
		var e, i, d, x_dist, y_dist, dist; //临时节点
		//遍历处理每一个点
		random_lines.forEach(function(r, idx) {
			r.x += r.xa, 
			r.y += r.ya, //移动
			r.xa *= r.x > canvas_width || r.x < 0 ? -1 : 1, 
			r.ya *= r.y > canvas_height || r.y < 0 ? -1 : 1, //碰到边界，反向反弹
			context.fillRect(r.x - 0.5, r.y - 0.5, 1, 1); //绘制一个宽高为1的点
			//从下一个点开始
			for (i = idx + 1; i < all_array.length; i++) {
				e = all_array[i];
				//不是当前点
				if (null !== e.x && null !== e.y) {
						x_dist = r.x - e.x, //x轴距离 l
						y_dist = r.y - e.y, //y轴距离 n
						dist = x_dist * x_dist + y_dist * y_dist; //总距离, m
					dist < e.max && (e === current_point && dist >= e.max / 2 && (r.x -= 0.03 * x_dist, r.y -= 0.03 * y_dist), //靠近的时候加速
						d = (e.max - dist) / e.max, 
						context.beginPath(), 
						context.lineWidth = d / 2, 
						context.strokeStyle = "rgba(" + config.c + "," + (d + 0.2) + ")", 
						context.moveTo(r.x, r.y), 
						context.lineTo(e.x, e.y), 
						context.stroke());
				}
			}
		}), frame_func(draw_canvas);
	}
	//创建画布，并添加到body中
	var the_canvas = document.createElement("canvas"), //画布
		config = get_config_option(), //配置
		canvas_id = "c_n" + config.l, //canvas id
		context = the_canvas.getContext("2d"), canvas_width, canvas_height, 
		frame_func = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(func) {
			window.setTimeout(func, 1000 / 45);
		}, random = Math.random, 
		current_point = {
			x: null, //当前鼠标x
			y: null, //当前鼠标y
			max: 50000
		},
		all_array;
	the_canvas.id = canvas_id;
	the_canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + config.z + ";opacity:" + config.o;
	get_by_tagname("body")[0].appendChild(the_canvas);
	//初始化画布大小

	set_canvas_size(), window.onresize = set_canvas_size;
	//当时鼠标位置存储，离开的时候，释放当前位置信息
	window.onmousemove = function(e) {
		e = e || window.event, current_point.x = e.clientX, current_point.y = e.clientY;
	}, window.onmouseout = function() {
		current_point.x = null, current_point.y = null;
	};
	//随机生成config.n条线位置信息
	for (var random_lines = [], i = 0; config.n > i; i++) {
		var x = random() * canvas_width, //随机位置
			y = random() * canvas_height,
			xa = 2 * random() - 1, //随机运动方向
			ya = 2 * random() - 1;
		random_lines.push({
			x: x,
			y: y,
			xa: xa,
			ya: ya,
			max: 15000 //沾附距离
		});
	}
	all_array = random_lines.concat([current_point]);
	//0.1秒后绘制
	setTimeout(function() {
		draw_canvas();
	}, 100);
}();
//蜘蛛丝结束

//返回顶部首屏隐藏  
    $(function () {
        showScroll();
        function showScroll() {
            $(window).scroll(function () {
                var scrollValue = $(window).scrollTop();
                	scrollValue > 800 ? $('.gotop').fadeIn() : $('.gotop').fadeOut();
            });
                $('#scroll').click(function () {
                    $("html,body").animate({
                        scrollTop: 0
                    }, 500);
                });
            }
        })   
//返回顶部首屏隐藏结束

//标签切换代码
	function setTab(name, cursel, n) {
		for (i = 1; i <= n; i++) {
			var menu = document.getElementById(name + i);
			var con = document.getElementById("con_" + name + "_" + i);
			menu.className = i == cursel ? "select" : "";
			con.style.display = i == cursel ? "block" : "none";
		}
	}
//标签切换代码结束

(function ($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.browser == 'edge' || skel.vars.mobile) ? function () {
		return $(this)
	} : function (intensity) {

		var $window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function () {

			var $t = $(this),
				on, off;

			on = function () {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function () {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function () {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			skel.on('change', function () {

				if (skel.breakpoint('medium').active)
					(off)();
				else
					(on)();

			});

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function () {
				$window.trigger('scroll');
			});

		return $(this);

	};

	$(function () {

		var $window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$banner = $('#banner');

		// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');

		$window.on('load pageshow', function () {
			window.setTimeout(function () {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Clear transitioning state on unload/hide.
		$window.on('unload pagehide', function () {
			window.setTimeout(function () {
				$('.is-transitioning').removeClass('is-transitioning');
			}, 250);
		});

		// Fix: Enable IE-only tweaks.
		if (skel.vars.browser == 'ie' || skel.vars.browser == 'edge')
			$body.addClass('is-ie');

		// Fix: Placeholder polyfill.
		$('form').placeholder();

		// Prioritize "important" elements on medium.
		skel.on('+medium -medium', function () {
			$.prioritize(
				'.important\\28 medium\\29',
				skel.breakpoint('medium').active
			);
		});

		// Scrolly.
		$('.scrolly').scrolly({
			offset: function () {
				return $header.height() - 2;
			}
		});

		// Tiles.
		var $tiles = $('.tiles > article');

		$tiles.each(function () {

			var $this = $(this),
				$image = $this.find('.image'),
				$img = $image.find('img'),
				$link = $this.find('.link'),
				x;

			// Image.

			// Set image.
			$this.css('background-image', 'url(' + $img.attr('src') + ')');

			// Set position.
			if (x = $img.data('position'))
				$image.css('background-position', x);

			// Hide original.
			$image.hide();

			// Link.
			if ($link.length > 0) {

				$x = $link.clone()
					.text('')
					.addClass('primary')
					.appendTo($this);

				$link = $link.add($x);

				$link.on('click', function (event) {

					var href = $link.attr('href');

					// Prevent default.
					event.stopPropagation();
					event.preventDefault();

					// Start transitioning.
					$this.addClass('is-transitioning');
					$wrapper.addClass('is-transitioning');

					// Redirect.
					window.setTimeout(function () {

						if ($link.attr('target') == '_blank')
							window.open(href);
						else
							location.href = href;

					}, 500);

				});

			}

		});

		// Header.
		if (skel.vars.IEVersion < 9)
			$header.removeClass('alt');

		if ($banner.length > 0 &&
			$header.hasClass('alt')) {

			$window.on('resize', function () {
				$window.trigger('scroll');
			});

			$window.on('load', function () {

				$banner.scrollex({
					bottom: $header.height() + 10,
					terminate: function () {
						$header.removeClass('alt');
					},
					enter: function () {
						$header.addClass('alt');
					},
					leave: function () {
						$header.removeClass('alt');
						$header.addClass('reveal');
					}
				});

				window.setTimeout(function () {
					$window.triggerHandler('scroll');
				}, 100);

			});

		}

		// Banner.
		$banner.each(function () {

			var $this = $(this),
				$image = $this.find('.image'),
				$img = $image.find('img');

			// Parallax.
			$this._parallax(0.275);

			// Image.
			if ($image.length > 0) {

				// Set image.
				$this.css('background-image', 'url(' + $img.attr('src') + ')');

				// Hide original.
				$image.hide();

			}

		});

		// Menu.
		var $menu = $('#menu'),
			$menuInner;

		$menu.wrapInner('<div class="inner"></div>');
		$menuInner = $menu.children('.inner');
		$menu._locked = false;

		$menu._lock = function () {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function () {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function () {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function () {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function () {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menuInner
			.on('click', function (event) {
				event.stopPropagation();
			})
			.on('click', 'a', function (event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
				$menu._hide();

				// Redirect.
				window.setTimeout(function () {
					window.location.href = href;
				}, 250);

			});

		$menu
			.appendTo($body)
			.on('click', function (event) {

				event.stopPropagation();
				event.preventDefault();

				$body.removeClass('is-menu-visible');

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function (event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
				$menu._toggle();

			})
			.on('click', function (event) {

				// Hide.
				$menu._hide();

			})
			.on('keydown', function (event) {

				// Hide on escape.
				if (event.keyCode == 27)
					$menu._hide();

			});

	});

})(jQuery);