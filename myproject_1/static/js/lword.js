$(document).ready(function(){
	//random
	function random(x,y) {
    //x上限，y下限     
    var x= x;
    var y = y;
    var rand = parseInt(Math.random() * (x - y + 1) + y);
}
	//end
	$(".leaveword,.wordcontent p,.recordword,.closeword,.fix_tips,.goback").hide();
	//img_ok function
		function imgok(){
			console.log("imgok");
		if($("#saved").css('top')=="264px"){
				$("#saved").animate({
					opacity:'1',
					top:'172px'
				},'slow',function(){
					$("#saved").animate({
						opacity:'0'
					},'slow',function(){
						$("#saved").css('top','264px');
					});
				})
			}
		}
	//end

	//leaveword_click
	$(".leaveword").click(function(){
		$(".recordword").css('top','22px');
		$(".recordword").fadeIn('slow');
		$(".fix_tips").show();
	});
	$(".recordword button:nth-of-type(1),.recordword button:nth-of-type(2)").click(function(){
		$(".recordword").fadeOut('fast');
		$(".fix_tips").hide();
	});
	$(".recordword button:nth-of-type(1)").click(function(){
		var content=$(".recordword textarea").val().trim();
		if(content==''){
			alert('留言不能为空');
			return false;
		}
		console.log(content);
		$.ajax({
			url:'http://127.0.0.1/share/leaveword/',
			type:'post',
			data:{
				"content":content
			},
			aysc:true
		})
		.done(function(data){
			console.log(data);
			if(data==-1){
				alert('您还未登录!');
				return false;
			}
			else if(data==0){
				alert('您已经留言!')
				return false;
			}
			else{
				imgok();
			}
		})
	});
	//end


	//closeword_click
	$(".closeword img").click(function(){
		if($(".wordcontent").is(":hidden")){
			$(".wordcontent").fadeIn('slow');
		}else{
			$(".wordcontent").fadeOut('slow');
		}
	})
	//end

	//goback_click
	$("#goback").click(function(){
		if($(".w").is(":hidden")){
			$(".sharecontent,.wordcontent,.leaveword,.closeword,.goback").fadeOut('fast',function(){
			$(".sharecontent").css('background-color','#FFF9C4');
			$(".w").fadeIn('fast');
			});
		}
	})
	//end
})



//
// share = ShareNote.objects.get(sharetitle=title, username_id=username_id)
//     share_id = share.id
//     leaveword=Leaveword.objects.filter(sharenote=share)
//     for l in leaveword:
//         contents['leaveword'].append(l.content)

// json.dumps(contents),content_type='application/json'
//