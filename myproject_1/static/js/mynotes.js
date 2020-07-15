$(function(){
	//document ready
		$(".fix_tips,.tips,.sharefamily,.search_content").hide();
		$(".subject-content w").show();	
	//end
	//get now time yyyy-MM-dd HH:mm:SS
	function getFormatDate(){
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var hour = nowDate.getHours()< 10 ? "0" + nowDate.getHours() : nowDate.getHours();
    var minute = nowDate.getMinutes()< 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
    var second = nowDate.getSeconds()< 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}
    //END

		$(document).ready(function(){
	});
		//触摸效果
	$(".subject-content>img").hover(function(){
		$(this).animate({
			opacity: 1,
			height:'+=20px',
			width:'+=20px',
			
		},'slow',function(){})
	},function(){
		$(this).animate({
			opacity: 0.5,
			height:'-=20px',
			width:'-=20px',
		},'slow',function(){})
	});
	//点击事件

	//getcsrf
	 // 点击事件
	 function subject(){
			if($(".top,#top-classify").is(":hidden")){

			}else{
				$(".top,#top-classify,.show-mid").fadeOut('slow');
				$("#subject").animate({
					top:"-=240px"
				},'slow',function(){});
				$(".top,#top-classify").slideUp('slow',function(){
				$(".subject-content>img,.subject-info").animate({
					top:'+=100px'
				},'slow',function(){});
				$("#subject").animate({
					top:'-240px',	
				},'slow',function(){
					$(".subject-info").fadeIn('slow',function(){});
				});
			});
			}
		}
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
		// console.log(csrftoken);
		// var csrftoken = Cookies.get('csrftoken');
		function csrfSafeMethod(method) {
		    // these HTTPs methods do not require CSRF protection
		    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
		}
		$.ajaxSetup({
			contentType:'application/x-www-form-urlencoded; charset=UTF-8',
		    beforeSend: function(xhr, settings) {
		        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
		            xhr.setRequestHeader("X-CSRFToken", csrftoken);
		        }
		    }
		});
		$("#imgbook").click(function(){
			$.ajax({
				type:"post",
				url:"http://127.0.0.1/islogin/",
				asyc:true
			})
			.done(function(data){
				if(data==1){
					console.log(data);
					$.ajax({
						type:"post",
						url:"http://127.0.0.1/mynotes/isnickname/",
						asyc:true
					})
					.done(function(data){
						console.log(data)
						if(data==0){
							subject();
						}else{
							//进入我的笔记
							console.log("entry mynotes");
							$(".subject,.subject-content img,.top,.top-classify,show-mid").fadeOut('slow',function(){
								$(".subject,.subject .mynotes").fadeIn('slow',function(){
									$("#settingimg,#news,#subbutton,#lamp,#handbook,#mynotesshare,#mynotessave,#spot,#record,#editor,#fontup,#fontdown").show();
								});
								$(".subject-content").hide();
							});
							$.ajax({
								url:'http://127.0.0.1/mynotes/isnotice/',
								type:'post',
								asyc:true
							})
							.done(function(data){
								console.log(data);
								})
							.always(function(data){
								if(data!=0){
								$("#spot").animate({
								opacity:1	
								},'slow',function(){});
								var text;
								$.each(data,function(i,item){
									$(".mynotes div textarea").css('font-size','22px');
									text+=item
									});
								$("#news").click(function(){
									$(".mynotes div textarea").css('color','#FF5733');
									
									if($(".mynotes div textarea").val().trim()=="<p>请输入您要 <b>编辑</b> 的内容</p><p><br></p>"){
										$(".mynotes div textarea").val(text.slice(9,-13));
										// console.log($(".mynotes div textarea").val())
										$("#spot").animate({
											opacity:0.1	
											},'slow',function(){});
									}else{
										$(".mynotes div textarea").val('<p>请输入您要 <b>编辑</b> 的内容</p><p><br></p>');
										$(".mynotes div textarea").css('color','#000');
									}
								});
								}
								else{
									
								}
							})
						}
					})
				}else{
					console.log("no login");
					//需要登录
					alert("您还未登录！");
				}
			})
		});
			//录入笔名
			$(".subject-info img").click(function(){
				var nickname=$("#nickname").val();
				console.log(nickname);
			$.ajax({
				type:"post",
				url:"http://127.0.0.1/mynotes/nickname/",
				data:{
					"nickname":nickname
				},
				timeout:3000,
				asyc:true
			})
			.done(function(data){
				if(data==1){
					$(".subject-info img").fadeOut('slow',function(){
						$(this).attr('src','http://192.168.43.168/img/nicknameok.png');
						$(this).fadeIn('slow',function(){
							$(".subject-info,#imgbook").delay(2000).fadeOut('slow',function(){
								window.location.href="http://127.0.0.1/mynotes/";
							});
						});
					});
				}else{
					console.log(data);
					//nickname存在
					alert("笔名已经存在!");
				}
			});
		});

		//setting
		$("#setting").click(function(){
			console.log($(this).css('left'));
			if($(this).css('left')!='12px'){
				$("#setting-content div span").fadeOut('200',function(){});
				$("#setting-content div img").fadeOut('200',function(){});
				$(this).animate({
				left:'12px'
				},'slow',function(){});
				$("#setting-content").animate({
					width:'0px'
				},'slow',function(){});
			}else{
				$(this).animate({
				left:'248px'
				},'slow',function(){});
				$("#setting-content div span").animate({
					'margin-left':'43px'
				},'fast',function(){});
				$("#setting-content div span").fadeIn('slow',function(){});
				$("#setting-content").animate({
					width:'283px'
				},'slow',function(){
					$("#setting-content div img").fadeIn('slow',function(){});
				});
			}
		});

		$("#setting-content div img").hover(function(){
			$(this).animate({
				width:'35px',
				height:'35px'
			},'slow',function(){});
		},function(){
			$(this).animate({
				width:'30px',
				height:'30px'
			},'slow',function(){});
		});

		$("#setting-content div img").click(function(){
			window.location.href="http://127.0.0.1/mynotes/";
		});
		//lamp点击
		$("#lamp").click(function(){
			console.log($("#subject").css('background-color'));
			if($("#subject").css('background-color')=='rgb(255, 249, 196)'){
				$("#subject").css('background-color','#000');
				$("#lamp").attr('src','http://192.168.43.168/img/lamp-off.png');
				$("#mynotesshare").attr('src','http://192.168.43.168/img/mynotes-share-off.png');
				$("#mynotessave").attr('src','http://192.168.43.168/img/mynotes-save-off.png');
			}else{
				$("#subject").css('background-color','#FFF9C4');
				$("#mynotesshare").attr('src','http://192.168.43.168/img/mynotes-share.png');
				$("#mynotessave").attr('src','http://192.168.43.168/img/mynotes-save.png');
				$("#lamp").attr('src','http://192.168.43.168/img/lamp.png');
			}
			
		});

		//handbook点击
		$("#handbook").click(function(){
			window.location.href="http://127.0.0.1/mynotes/handbook/";
		});

		//img_ok function
		function imgok(){
			// console.log("imgok");
		if($("#saved").css('top')=="413px"){
				$("#saved").animate({
					opacity:'1',
					top:'342px'
				},'fast',function(){
					$(this).delay(500).animate({
						opacity:0
					},'fast',function(){
						$(this).css('top','413px');
					});
				})
			}
		}
		//end

		//saved _click
		$("#mynotessave").click(function(){
			if($(".mynotes input").val().trim()==''){
				alert("请输入标题");
			}else{
			var title=$(".mynotes input").val();
			var content=$(".mynotes textarea").val();
			var createtime=getFormatDate();
			$.ajax({
				url:'http://127.0.0.1/mynotes/savenotes/',
				type:'post',
				data:{
					'type':'保存',
					'title':title,
					'content':content,
					'createtime':createtime
				},
				asyc:true
			})
			.done(function(data){
			if(data==1){
				$("#saved span").text('已保存');
				console.log('已保存');
				imgok();
			}
			else if(data==2){
				alert("已经分享相同的标题啦!");
				// $("#saved span").text('已经分享相同的标题啦!');
				// imgok();
			}
			else{
				console.log(data);
				alert("登录过期,请重新登录");
			}
			})
		}
		});
		//end

		//share_click
		var sharefamily;
		$("#mynotesshare").click(function(){
			var titletext=$("#mynotestitle").val();
			$(".tips button:nth-of-type(1)").text('准奏');
			console.log(titletext);
			if(titletext==''){
				alert('标题不能为空');
			}else{
				$(".sharefamily").css('top','198px');
				$(".fix_tips,.sharefamily").fadeIn('fast',function(){
					var top = $(document).scrollTop();
				    $(document).on('scroll',function (e) {
				    $(document).scrollTop(top);
				    });
				});
			}	
		});
		var sharefamily,type;
		$(".sharefamily button").click(function(){
			$(document).unbind("scroll");
			sharefamily=$(this).text().trim();
			console.log(sharefamily);
			$(".fix_tips,.sharefamily").fadeOut('fast',function(){
				$(".tips h4").text('确定分享吗?');
				$(".tips").css('top','242px');
				$(".fix_tips,.tips").fadeIn('fast',function(){
					var top = $(document).scrollTop();
				    $(document).on('scroll',function (e) {
				    $(document).scrollTop(top);
				    });
				});
			});
			$(".sharefamily").css('top','-1000px');
		});
		$(".tips button:nth-of-type(1)").click(function(){
			$(document).unbind("scroll");
			if(sharefamily=='知识' || sharefamily=='心情' || sharefamily=='美文'){
				type='分享';
			}
			else if(sharefamily=='语言' || sharefamily=='理学' || sharefamily=='文学'){
				type='学习';
			}
			else{
				type='记录';
			}
			// console.log(sharefamily,type);
			var title=$("#mynotestitle").val().trim();
			var sharecontent=$(".mynotes textarea").val();
			// console.log(sharecontent);
			var sharetime=getFormatDate();
			if($(this).text()=='准奏'){
			$.ajax({
				contentType:'application/x-www-form-urlencoded; charset=Unicode',
				url:'http://127.0.0.1/mynotes/sharenote/',
				type:'post',
				data:{
					"sharefamily":sharefamily,
					"type":type,
					"title":title,
					"sharecontent":sharecontent,
					"sharetime":sharetime
				},
				asyc:true
			})
			.done(function(data){
				$(".fix_tips,.tips").fadeOut('slow',function(){
					$(".tips h4").text('确定删除吗?');
				});
				if(data==1){
					$("#saved span").text('已分享');
					imgok();
				}
				else if(data==0){
					alert('已经存在分享标题')
				}
				else{
					alert('登录过期,请重新登录');
				}
			})
		}
		});
		$(".tips button:nth-of-type(2)").click(function(){
			$(document).unbind("scroll");
			$(".fix_tips,.tips").fadeOut('slow',function(){});
			$(".tips").css('top','-1000px');
		});
		
		//end
		//record_is_hide
		function record_is_hide(data){
			if($(".mynotes").is(":hidden")){
					$(".record_events").fadeOut('slow',function(){
						$(".mynotes,#subbutton").fadeIn('slow',function(){
							$(".record_events ul").empty();
						});
					});
				}else{
					$.each(data,function(index,item){
						var index=index;
						var item=item;
						// console.log(item[0]);
						$(".record_events ul").append('<li><h4>类型:'+item[0]+'</h4><h4 id="events_title">标题:'+item[1]+'</h4><h4>时间:'+item[3].slice(0,-6)+'</h4><img class="delimg" src="http://192.168.43.168/img/delete.png"></li>');
					});
					$(".mynotes,#subbutton").fadeOut('slow',function(){
						$(".record_events").fadeIn('slow',function(){});
					});

				}
		}
		//end
		
		//record_click
		function record(){
			$.ajax({
				url:'http://127.0.0.1/mynotes/record_events/',
				type:'post',
				asyc:true
			})
			.done(function(data){
				console.log(data);
				if(data==-1){
					alert("登录过期,请重新登录");
				}
				else if(data==0){
					alert('无记录');
				}
				else{
					record_is_hide(data);
				}
				
			})
			.fail(function(data){
				alert("请求失败");
			})
		}
		$("#record").click(function(){
			record();
		});
		//fontup_click
		$("#fontup").click(function(){
			$(".mynotes textarea").css('font-size',"+=2");
		});
		$("#fontdown").click(function(){
			$(".mynotes textarea").css('font-size',"-=2");
		});

		//record_events li_click
		/*$("#share_events li").click(function(){
			
		});*/
		$(document).on("click","#share_events li",function(){
			var title=$(this).children('#events_title').text().slice(3);
			console.log(title);
			$.ajax({
				url:'http://127.0.0.1/mynotes/editnotes/',
				type:'post',
				data:{
					"title":title
				},
				asyc:true
			})
			.done(function(data){
				// console.log(data);
				$("#mynotestitle").val(title);
				$(".mynotes div textarea").val(data);
				if($(".mynotes").is(":hidden")){
				$(".record_events").fadeOut('slow',function(){
					$(".mynotes,#subbutton").fadeIn('slow',function(){
						$(".record_events ul").empty();
					});
				});
				}else{
					$(".mynotes,#subbutton").fadeOut('slow',function(){
					$(".record_events").fadeIn('slow',function(){});
					});
				}
			})
		});
		//end

		//record delete_img
		$(document).on("click",".record_events .delimg",function(){
			$(".tips button:nth-of-type(1)").text('删除');
			if($(".fix_tips,.tips").is(":hidden")){
				$(".tips").css('top','242px');
				$(".fix_tips,.tips").fadeIn('slow',function(){
					var top = $(document).scrollTop();
				    $(document).on('scroll',function (e) {
				    $(document).scrollTop(top);
				    })
				});
			}else{
				$(".fix_tips,.tips").fadeOut('slow',function(){});
				$(".tips").css('top','-1000px');
			}
			title=$(this).prev().prev().text().slice(3);
			console.log('delete'+title);
			//tips button_click
			$(".tips button:nth-of-type(1)").click(function(){
				if($(this).text()=='删除'){
					$.ajax({
					url:'http://127.0.0.1/mynotes/deletenote/',
					type:'post',
					data:{
						"title":title
					},
					asyc:true
				})
				.done(function(data){
					console.log(data);
					if(data==1){
						$(".fix_tips,.tips").fadeOut('slow',function(){
						$(document).unbind("scroll");
						// });
						});
						$("#saved span").text('已删除');
						imgok();
					}
					else if(data==0){
						//没有title
					}
					else{
						alert("登录过期,请重新登录");
					}
				})
			}	
			});
			$(".tips button:nth-of-type(2)").click(function(){
				$(".fix_tips,.tips").fadeOut('slow',function(){
					$(document).unbind("scroll");
					// });
				});
			});
			//end
		});
		//end

		//editor_click
		$('#editor').click(function(){
			
			if ($('.subject .mynotes .w-e-toolbar').css('height')=='0px') {
				$('.subject .mynotes .w-e-toolbar').animate({
					height:'30.8px'
				},'slow',function(){
					$('.subject .mynotes .w-e-toolbar').css('visibility','visible');
					
				});
			}else{
				
				$('.subject .mynotes .w-e-toolbar').animate({
					height:'0px'
				},'slow',function(){
					$('.subject .mynotes .w-e-toolbar').css('visibility','hidden');
					
				});
			}
		})
		//end

})
