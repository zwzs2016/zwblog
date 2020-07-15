$(function(){
	//获取csrf,全局设置
	$(".top-content h1,.top-content h2").fadeIn('slow');
	function getCookie(name) {
		    var cookieValue = null;
		    if (document.cookie && document.cookie !== '') {
		        var cookies = document.cookie.split(';');
		        for (var i = 0; i < cookies.length; i++) {
		            var cookie = jQuery.trim(cookies[i]);
		            // Does this cookie string begin with the name we want?
		            if (cookie.substring(0, name.length + 1) === (name + '=')) {
		                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                break;
		            }
		        }
		    }
		    return cookieValue;
		}
		var csrftoken = getCookie('csrftoken');
		// var csrftoken = Cookies.get('csrftoken');
		function csrfSafeMethod(method) {
		    // these HTTPs methods do not require CSRF protection
		    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
		}
		$.ajaxSetup({
		    beforeSend: function(xhr, settings) {
		        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
		            xhr.setRequestHeader("X-CSRFToken", csrftoken);
		        }
		    }
		});

	//点击事件
	$("#imgout").click(function(){
			if($("#imgout").hasClass("imgin")){
					$("#imgout").removeClass("imgin").addClass("imgout");
				}
				else{
					$("#imgout").removeClass("imgout").addClass("imgin");
				}
			if($("#top-content").is(":hidden")){
				$(".top").animate({
				height:'200px'
				},'slow',function(){});
				$("#top-content").fadeIn('slow',function(){});
			}
			else{
			$(".top").animate({
			height:'0px'
			},'slow',function(){});
			$("#top-content").slideUp('slow',function(){});
			}
	});
	//classfamily
	
	//end
	//展示事件
		$("#classify1,#classify5").hover(function(){
			$("#showli2,#showli3,#showli4").stop().slideUp('slow');
		});

		$("#classify2").hover(function(){
			$("#top-content,#subject").hover(function(){
				$("#showli2").slideUp('slow');
			});
			$("#showli3,#showli4").stop().slideUp('slow');
			$("#showli2").hide().stop().slideDown('slow',function(){
			})
		},
		function(){
			$("#showli2").hover(function(){
				$("#showli2").show();
			},function(){
				$("#showli2").stop().slideUp('slow',function(){
				//complete
			});
			});
		});
		$("#classify3").hover(function(){
			$("#top-content,#subject").hover(function(){
				$("#showli3").slideUp('slow');
			});
			$("#showli2,#showli4").stop().slideUp('slow');
			$("#showli3").hide().stop().slideDown('slow',function(){
			})
		},
		function(){
			$("#showli3").hover(function(){
				$("#showli3").show();
			},function(){
				$("#showli3").stop().slideUp('slow',function(){
				//complete
			});
			})
		});
		$("#classify4").hover(function(){
			$("#top-content,#subject").hover(function(){
				$("#showli4").slideUp('slow');
			});
			$("#showli2,#showli3").stop().slideUp('slow');
			$("#showli4").hide().stop().slideDown('slow',function(){
			})
		},
		function(){
			$("#showli4").hover(function(){
				$("#showli4").show();
			},function(){
				$("#showli4").slideUp('slow',function(){
				//complete
			});
			})
		});

		//点击登录注销
		$("#loginimg").click(function(){
			window.location.href="http://127.0.0.1/login/";
		});
		$("#logoutimg").click(function(){
			$.ajax({
				url:'http://127.0.0.1/logout/',
				type:'post',
				aysc:true
			})
			.done(function(data){
				if(data==1){
					//console.log("logout ok");
					alert("您已注销登录,感谢来访");
				}else{
					//console.log("logouted");
					alert("您已注销过");
				}
			})
		});

		//web shortcut
		//w列表的num初始化
		var num=10;
		$(window).scroll(function() {
			//滚动平移
			// //console.log($(window).scrollTop());
			var is_hide=true;
			var before = $(document).scrollTop();
			var Bottom_distance=$(document).height()-$(document).scrollTop();
			//console.log(before);
			//console.log($(window).scrollTop());
			//console.log($(document).height()-$(document).scrollTop());
			var value=$(document).height() - $(window).height();
			//console.log(value);
			$(".subject-content .w").eq(num).css('opacity','0');
			$(".subject-content").map(function(){
					if (this.offsetHeight<this.scrollHeight) {
						//console.log("内容被隐藏");
						is_hide=true;
					}else{
						is_hide=false;
						//console.log("元素未被隐藏");
						$(".subject-content .spinner").hide();
						// $(".subject-content .w").eq(num-1).css('opacity','1');
						//console.log(is_hide);
					}
				})
			if($(document).scrollTop() >= $(document).height() - $(window).height()-1){
				//console.log('到达底部了');
				// $(".subject-content .spinner").show();
				if (is_hide==true) {
					
					$(".subject-content").css('max-height',"+=318");
					$(".subject-content .w").eq(num).css('opacity','1');
					// $(".subject-content .w").eq(num).fadeIn('slow');
					
					// $(".subject-content .w").eq(num).animate({
					// 	opacity:1
					// },'slow','linear',function(){
					// 	// $(this).css('visibility','visible');
					// })
					num++;
				}else{

				}
			}
			if(Bottom_distance<980 && is_hide==true){
				$(".subject-content .spinner").show();
			}else{
				$(".subject-content .spinner").hide();
			}
 
        if ($("html").scrollTop()==0){
            $(".scroll_ishide").fadeOut('slow',function(){});
            $(document).unbind('scroll');
        }
        if ($("html").scrollTop()>=13){
        	$(".scroll_ishide").fadeIn('slow',function(){});
        }
    });
    	$(".top-scroll").click(function(){
    		console.log("点击了");
    		$("html,body").animate({
    			scrollTop:0
    		},'slow');
    		//console.log('ok');

    	});
        //end
    	//subject-content平移动画
    	$(".subject-content").delay(300).animate({
    		left:'+=47',
    		opacity:'1'
    	},'slow',function(){});

    	//title点击 平滑之上
    	// $("#title").click(function(){

    	// })
    	//滚动条滚动

})