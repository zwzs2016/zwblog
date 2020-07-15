$(function(){
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

	$("#myInput").keydown(function(event){ 
        var username=$("#text1").val();
        var psd=$("#myInput").val();
        if(username!=null && psd!=null){   
            var res=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            if(username.match(res)!=null){
                $("#saveForm").attr('type','button');
                $("#saveForm").addClass("saveForm");
            }
    }
        if(event.which==13){
            saveForm();
        }
    })
        $("#saveForm").click(function(){
            saveForm();
        });

        //saveForm_click
        function saveForm(){
            var username=$("#text1").val();
            var psd=$("#myInput").val();
            if($("#saveForm").attr("type")=="button"){
                $.ajax({
                type:"post",
                url:"http://127.0.0.1/loginok/",
                data:{
                "username":username,
                "psd":psd,
                },
                timeout:3000,
                asyc:true
        })
        .done(function(data){
            if(data==1){
                window.location.href="../";
            }
            else if(data==-2){
                alert("账号未激活");
            }
            else if(data==-1){
                alert("没有此用户,请您核实后重试");
            }
            else{
                $("input[name='password']").addClass("psdinvalid1"); 
                $('#psdimg').animate({
                        opacity: 1
                      }, 2500, function() {
                        // Animation complete.
                      });
                console.log("0");
                return false;
            }
        })
            }
        }
        //end  
});