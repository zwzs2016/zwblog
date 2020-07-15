$(document).ready(function(){
	$(".sharecontent,.search_content").hide();
	//csrf check
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
	//end

	//dzan_click
	$(document).on('click','#dzanimg',function(){
		var title=$(this).parent().parent().prev().prev().children("a").text();
		var nickname=$(this).parent().prev().prev().children("span").text();
		console.log(title,nickname);
		var that=$(this);
		var imgsrc=that.attr('src').slice(-12);
		$.ajax({
				url:'http://127.0.0.1/share/sharelike/',
				type:'post',
				data:{
					"title":title,
					"nickname":nickname
				},
				asyc:true
			})
			.done(function(data){
				if(data==1){
					var dannum=parseInt(that.next().text());
					console.log(dannum);
					if(that.attr('src').slice(-12)!='dzan-end.png'){
						that.attr('src','http://192.168.43.168/img/dzan-end.png');
						dannum+=1
						that.next().text(dannum);
					}else{
					// 	that.attr('src','http://192.168.43.168/img/dzan-start.png');
					// 	dannum-=1
					// 	that.next().text(dannum);
					}		
				}
				else if(data==0){
					alert('请勿重复操作');
				}
				else if(data==-1){
					alert('您还未登录');
				}
			})
			.fail(function(){
				alert('已崩溃');
			})
	});

	//look study
	$(document).on('click','#title',function(){
		var title=$(this).text();
		var nickname=$(this).parent().next().next().children("div:nth-of-type(1)").children("span").text();
		var sharefamily=$(this).prev().text();
		// console.log(title,nickname,sharefamily);
		$(".w").fadeOut('fast',function(){
			$(".sharecontent").css('background-color','#fff').fadeIn('slow');
		});
		$.ajax({
			url:'http://127.0.0.1/share/look_share/',
			type:'post',
			data:{
				"title":title,
				"nickname":nickname,
				"sharefamily":sharefamily
			},
			asyc:true
		})
		.done(function(data){
			if(data==0){
				alert('您还未登录');
				return false;
			}
			else if(data!=0){
				$(".sharecontent h2").text(title);
				$(".sharecontent div").html(data);
				$(".leaveword,.closeword,.goback").show();
				// $(".wordcontent h5").text(data.leaveword[1]);
			}
		})
		.always(function(){
			lookword(title);
		})
	});
	//end

	//lookword_function
	function lookword(sharetitle){
		var sharetitle=sharetitle;
		// console.log(sharetitle);
		$.ajax({
		url:'http://127.0.0.1/share/showword/',
		type:'post',
		data:{
			"sharetitle":sharetitle
		},
		aysc:true
		})
		.done(function(data){
			// console.log(data);
			var i;
			$(".wordcontent").empty();
			if(data!=0){
					for(i=0;i<data.leaveword.length;i++){
					// console.log(i);
					// $(".wordcontent p").text(data.leaveword[i]);
					// $(".wordcontent").fadeIn('slow',function(){
					// $(this).fadeOut('slow');
					// })
					$(".wordcontent").append('<div><p>'+data.leaveword[i]+'</p></div>');
					$(".wordcontent").fadeIn('slow');
				}
			}
		})
	}
	//end
	
	//followimg_click
	$(document).on('click','#follow',function(){
		$(this).attr('src','http://192.168.43.168/img/followed.png');
		var followimg=$(this).attr('src').slice(-12,-4);
		var nickname=$(this).parent().prev().prev().prev().children("span").text();
		console.log(followimg,nickname);
		if(followimg=='followed'){
			$.ajax({
				url:'http://127.0.0.1/follow/',
				type:'get',
				data:{
					"nickname":nickname
				},
				asyc:true
			})
			.done(function(data){
				if(data==1){
					alert('关注成功！');
				}
				else if(data==0){
					alert('已经关注过了!');
				}else{
					alert('您还未登录!');
				}
			})
		}
	});
	//end
})


