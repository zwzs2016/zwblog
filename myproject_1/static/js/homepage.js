$(document).ready(function(){
	//hide
	$(".sharecontent").hide();
	//end
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
	//look share
	$(document).on('click','#title',function(){
		var title=$(this).text();
		var sharefamily=$(this).prev().text();
		var nickname=$(this).parent().next().next().children("div:nth-of-type(1)").children("span").text();
		console.log(title);
		// console.log(nickname);
		$(".w").fadeOut('fast',function(){
			$(".sharecontent").css('background-color','#fff').fadeIn('slow');
		});
		$.ajax({
			url:'http://127.0.0.1/look_homepage/',
			type:'post',
			data:{
				"title":title,
				"nickname":nickname,
				"sharefamily":sharefamily
			},
			asyc:true,
			timeout:3000
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
				// $(".wordcontent h5").text(data.leaveword[1])
	    		// $("html,body").animate({
	    		// 	scrollTop:0
	    		// },'slow');
	    		// console.log('ok');
			}
		})
		.always(function(){
			console.log("留言数据");
			lookword(title);
		})
	});
	//end

	//search_content click
	$("#search img").hover(function(){
		$("#search input").animate({
			width:'142px'
		},'slow',function(){
			$(this).attr('placeholder','标题或笔名...');
		});
	},function(){

	});
	//end

	//search _click
	$("#search img").click(function(){
		search();
	});
	$("#search input").keydown(function(event){
		if(event.which==13){
			search();
		}
	});
	//end

	//dzan_click
	$(document).on('click','#dzan',function(){
		var title=$(this).parent().parent().prev().prev().children("a").text();
		var nickname=$(this).parent().prev().prev().children("span").text();
		var url='http://127.0.0.1/share/sharelike/';
		if(nickname=='旺享'){url='http://127.0.0.1/homemsglike/'}
		console.log(title,nickname);
		var that=$(this);
		var imgsrc=that.attr('src').slice(-12);
		$.ajax({
				url:url,
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

	//homemsg_dzan_click

	//end

	//followimg_click
	$("#follow").click(function(){
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
					alert('已经关注过了');
				}
				else{
					alert('您还未登录!');
				}
			})
		}
	});
	//end
})

//search function
function search(){
	var searchtext=$("#search input").val();
		console.log(searchtext);
		if(searchtext!=''){
			$.ajax({
				url:'http://127.0.0.1/search/',
				post:'get',
				data:{
					"searchtext":searchtext
				},
				asyc:true
			})
			.done(function(data){
				if(data==-1){
					alert('您还未登录');
					return false;
				}
				console.log(data);
				if(data==1){
					window.location.href='http://127.0.0.1/';
				}else{
					alert('换个标题或减少字数试试');
				}
			})
			.always(function(){
				$("#search input").attr('placeholder','');
				$("#search input").animate({
					width:0
				},'slow',function(){});
			})
		}else{
			$("#search input").attr('placeholder','');
			$("#search input").animate({
				width:0
			},'slow',function(){});
		}
}
//end


//functions;;;;
//lookword_function
	function lookword(sharetitle){
		var sharetitle=sharetitle;
		console.log(sharetitle);
		$.ajax({
		url:'http://127.0.0.1/share/showword/',
		type:'post',
		data:{
			"sharetitle":sharetitle
		},
		aysc:true
		})
		.done(function(data){
			console.log(data);
			$(".wordcontent").empty();
			var i;
			if(data!=0){
					for(i=0;i<data.leaveword.length;i++){
					console.log(i);
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