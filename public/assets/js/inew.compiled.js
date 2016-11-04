var reached = 0;
$(document).ready(function(){
	inew.index();
		$('[data-toggle="tooltip"]').tooltip();
		/*$('.replyButt').each(function(){
			$(this).hover(function(){
				$(this).tooltip('show');
			});
		});
		$('.reportButt').each(function(){
			$(this).hover(function(){
				$(this).tooltip('show');
			});
		});*/
});
$(window).load(function(){
	$('div.loader').fadeOut();
});
$('div.chat-msgbox').scroll(function(){
	if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight){
		if(reached==0){
			reached=1;
			$('.load-more').show();
		}
	}
});
var inew = {
	index : function(){
		$('a.refresh').click(function(){
			$(".chatloadhere").children().slideUp(200, function() { $(this).children().remove(); });
			$('div.load-more').hide();
			inew.index.lastid=0;
			inew.index.firstid=0;
			inew.index.doneAll=0;
			inew.index.working=false;
			$('div.loader').fadeIn();
			inew.getmsg();
			$('div.loader').fadeOut();
			reached=0;
		});
		var working = false,
			lastid = 0,
			doneAll = 0,
			firstid = 0;

		//formation
		$('form.sendchat').submit(function(ep){
			var msg = $('input[name="msg"]').val();
			if(msg.length == 0){
				alert('Please enter a message');
				return false;
			}
			if(msg.length < 2){
				alert('Please enter a longer message');
				return false;
			}
			ep.preventDefault();
			/*msg = $('input[name="replto"]').val() + $('input[name="msg"]').val();
			var patt = new RegExp(/\@reply\_(.*?)\:/g);
			if(patt.test(msg)){
				$('input[name="msg"]').val($('input[name="replto"]').val() + $('input[name="msg"]').val());
			}*/
			if(working){
				return false;
			}
			else {
				if($('input[name="replto"]').val().length > 0){
					$('input[name="msg"]').val($('input[name="replto"]').val() + $('input[name="msg"]').val());
					msg = $('input[name="msg"]').val();
				}
				working = true;
				var tempID = Math.floor(Math.random()*32767),
					userInfo = {
						msg_id		: 'tempmsg-'+tempID,
						name		: $('input[name="name"]').val(),
						social_id		: $('input[name="social_id"]').val(),
						social_type		: $('input[name="social_type"]').val(),
						email		: $('input[name="email"]').val(),
						points		: $('input[name="points"]').val(),
						acctype		: $('input[name="acctype"]').val(),
						avatar		: $('input[name="avatar"]').val(),
						time		: Math.round(new Date().getTime() / 1000),
						text		: msg.replace(/</g,'&lt;').replace(/>/g,'&gt;'),
						msgType		: 'normal',
						more		: 0
					}
				inew.addMessage(userInfo);
		        $.ajaxSetup({
		           headers: { 'X-CSRF-Token' : $('meta[name=csrf-token]').attr('content') }
		        });
				$.ajax({
					cache : false,
					url : 'sendchat/now',
					type : 'post',
					data : { msg : escape(msg)},
					dataType : 'jsonEntity',
					success : function(res){
						if(res.status!=1){
							alert(res.text);
							console.log(res);
							$('#msg-'+userInfo.msg_id).slideUp();
						}
					}
				});
				$('input[name="msg"]').val('').focusout();
				working = false;
				$('input[name="msg"], button[type="submit"]').val('Please wait 5 seconds to send a chat again...').prop('disabled',true);
				$('button.replyer').fadeOut().remove();
				$('input[name="replto"]').prop('value','');
				setTimeout(function(){
					$('input[name="msg"], button[type="submit"]').val('').prop('disabled',false);
					$('input[name="msg"]').focus();
				},5000);

			}

			return false;
		});

		(function getChatsFunction(){
			inew.getmsg(getChatsFunction);
		})();
		(function TimeoutFunction(){
			inew.liveTime(TimeoutFunction);
		})();
	},
	//add messages
	addMessage : function(userInfo){
		$('[data-toggle="tooltip"]').tooltip();
		var ex = $("div.msg-"+userInfo.msg_id),
			msg = userInfo.text;
		if(ex.length) ex.remove();
		switch(userInfo.msgType){
			case 'normal' : 
			var x = '<div style="padding:2px" id="msg-'+userInfo.msg_id+'">';
					x = x+'<div class="msgcomp msg-"'+userInfo.msg_id+' style="width: 100%;padding: 5px;margin: 5px 0px 0px 0px;border: 1px solid #bdc3c7;display:block">';
					x = x+'<div class="media">';
					x = x+'<div class="pull-left">';
					if(userInfo.social_type == "FACEBOOK"){
					x = x+'<a href="https://www.facebook.com/'+userInfo.social_id+'" target="_blank"><img class="media-object" src="'+userInfo.avatar+'" width="50px" height="50px"></a>';
						x = x+'<center><i style="font-color:#3498db" class="fa fa-facebook-official" aria-hidden="true"></i></center>';
					}
					else{
					x = x+'<a href="https://twitter.com/'+userInfo.email+'" target="_blank"><img class="media-object" src="'+userInfo.avatar+'" width="50px" height="50px"></a>';
						x = x+'<center><i style="font-color:#2ecc71" class="fa fa-twitter" aria-hidden="true"></i></center>';
					}
					x = x+'</div>';
					x = x+'<div class="media-body">';
					if(userInfo.social_type == "FACEBOOK"){
					x = x+'<h4 class="media-heading pull-left" style="line-height: 13px;margin-top: 3px"><a target="_blank" href="https://www.facebook.com/'+userInfo.social_id+'" style="color: #333;font-weight: bolder;vertical-align: middle;">'+userInfo.name+'</a> ';
					}
					else{
					x = x+'<h4 class="media-heading pull-left" style="line-height: 13px;margin-top: 3px"><a target="_blank" href="https://twitter.com/'+userInfo.email+'" style="color: #333;font-weight: bolder;vertical-align: middle;">'+userInfo.name+'</a> ';
					}
						if(userInfo.acctype == 111){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[OWNER]</span>';
						}
						else if(userInfo.acctype == 1){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[CO-OWNER]</span>';
						}
						else if(userInfo.acctype == 2){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[HEAD ADMIN]</span>';
						}
						else if(userInfo.acctype == 3){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[ADMIN]</span>';
						}
						else if(userInfo.acctype == 4){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[HEAD MOD]</span>';
						}
						else if(userInfo.acctype == 5){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[SENIOR MOD]</span>';
						}
						else if(userInfo.acctype == 6){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[MOD]</span>';
						}
						else if(userInfo.acctype == 7){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[HEAD DJ]</span>';
						}
						else if(userInfo.acctype == 8){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[FEMALE DJ]</span>';
						}
						else if(userInfo.acctype == 9){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[MALE DJ]</span>';
						}
						else if(userInfo.acctype == 10){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[DEVELOPER]</span>';
						}
						else if(userInfo.acctype == 11){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[PREMIUM]</span>';
						}
						else if(userInfo.acctype == 12){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[SPONSOR]</span>';
						}
						else if(userInfo.acctype == 13){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[PARTNER SITE]</span>';
						}
						else if(userInfo.acctype == 14){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[NEWBIE]</span>';
						}
						else if(userInfo.acctype == 15){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[CHATTES OF THE MONTH]</span>';
						}
						else if(userInfo.acctype == 16){
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[FRIENDZONE FM TAMBAYER]</span>';
						}
						else{
							x = x +'<span class="ranking" style="font-size:9px;vertical-align: middle;">[MEMBER]</span>';
						}
					x = x +'</h4>';
					var report = ($('input[name="social_id"]').val() != userInfo.social_id) ? x = x+'<i class="fa fa-flag reportButt pull-right" aria-hidden="true" data-toggle="tooltip" data-placement="left" title="Report '+userInfo.name+' to Admin" onclick="inew.sumreport(\''+userInfo.social_id+'\',\''+userInfo.name+'\')" style="cursor:pointer"></i>' : '';
					var reply = ($('input[name="social_id"]').val() != userInfo.social_id) ? x = x+'<i class="fa fa-share-square replyButt pull-right" aria-hidden="true" data-toggle="tooltip" data-placement="left" title="Reply to '+userInfo.name+'" onclick="inew.sumreply(\''+userInfo.name+'\')" style="cursor:pointer"></i>' : '';
					x = x+'<i class="fa fa-clock-o pull-right" data-unix-time="'+userInfo.time+'" aria-hidden="true"></i>';
					x = x +'<span class="pull-right tfm-time" data-unix-time="'+userInfo.time+'" style="font-size:9px">Just Now</span>';
					x = x +'<div style="clear:both"></div>';
					x = x+'<span class="msg" style="font-size: 12px">'+inew.replaceReply(unescape(msg).replace(/</g,'&lt;').replace(/>/g,'&gt;'))+'</span>';
					x = x+'</div>';
					x = x+'</div>';
					x = x+'</div>';
				x = x+'</div>';
			break;
			case 'announcement':
			var x = '<div style="padding:2px" id="msg-'+userInfo.msg_id+'">';
					x = x+'<div class="msgcomp msg-"'+userInfo.msg_id+' style="width: 100%;padding: 5px;margin: 5px 0px 0px 0px;border: 1px solid #bdc3c7;display:block">';
						x = x+'';
						x = x+'<div class="alert alert-success" style="margin:0px;text-align:center;padding:5px">';
						x = x+'<h3 style="font-size:15px;margin:0px 0px 10px 0px;padding:0px;font-weight:bolder"><i class="fa fa-bullhorn" aria-hidden="true"></i> ANNOUNCEMENT <i class="fa fa-bullhorn" aria-hidden="true"></i></h3>';
						x = x+'<hr />';
						x = x+'<span style="font-size:13px;text-style:italic">'+userInfo.text+'</span><br>';
						x = x+'<hr />';
						x = x+'<span style="font-size:9px;font-weight:bolder">Announced By '+userInfo.name+'</span>';
						x = x+'</div>';
					x = x+'</div>';
				x = x+'</div>';
			break;
		}
		if(userInfo.more==0){
			$('div.chatloadhere').prepend(x);
		}else{
			$('div.chatloadhere').append(x);

		}
		$('#msg-'+userInfo.msg_id).hide().slideDown(200);
	},
	//announcement
	addAnnc : function(name){
		x = '<div class="modal fade bs-example-modal-sm" id="annc-modal" tabindex="-1" role="dialog" aria-labelledby="report-modal">';
		x = x +'<div class="modal-dialog">';
		x = x +'<div class="modal-content">';
		x = x +'<div class="modal-header">';
		x = x +'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
		x = x +'<h4 class="modal-title" id="myModalLabel">Announcement</b></h4>';
		x = x +'';
		x = x +'</div>';
		x = x +'<div class="modal-body">';
			x = x +'<form class="anncForm">';
			x = x +'<div class="form-group">';
				x = x +'<label for="content-text">Message :</label>';
				x = x +'<textarea name="msg" class="form-control" style="width:100%;resize:none" rows="5" required></textarea>';
			x = x +'</div>';
			x = x +'<button type="submit" class="btn btn-default pull-right">ANNOUNCE</button>';
			x = x +'<div style="clear:both"></div>';
			x = x +'</form>';
		x = x +'</div>';
		x = x +'</div>';
		x = x +'</div>';
		x = x +'</div>';
		x = x +'</div>';
		x = x +'</div>';
		$('body').append(x);
		$('#annc-modal').modal('show');
		$('form.anncForm').submit(function(){
			var msg = $('textarea[name="msg"]').val().replace(/</g,'&lt;').replace(/>/g,'&gt;');
			var tempID = Math.floor(Math.random()*32767);
			var userInfo = {
				msg_id		: 'tempmsg-'+tempID,
				name		: name,
				time		: Math.round(new Date().getTime() / 1000),
				text		: msg,
				msgType		: 'announcement',
				more		: 0
			}
			$.ajax({
				type : 'POST',
				url : 'announcement',
				data : { msg : msg },
				dataType : 'JSON',
				success : function(res){
					if(res.status==1){
						$('#annc-modal').modal('hide');
						$('#annc-modal').on('hidden.bs.modal', function (e) {
							$(this).remove();
							inew.addMessage(userInfo);
						});
					}else{
						console.log(res);
					}
				}
			});
			return false
		});
		/**/
	},
	// report to admin
	sumreport : function(social_id,name){
		x = '<div class="modal fade bs-example-modal-sm" id="report-modal" tabindex="-1" role="dialog" aria-labelledby="report-modal">';
		x = x +'<div class="vertical-alignment-helper">';
		x = x +'<div class="modal-dialog modal-sm vertical-align-center">';
		x = x +'<div class="modal-content">';
		x = x +'<div class="modal-header">';
		x = x +'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
		x = x +'<h4 class="modal-title" id="myModalLabel">Report <b>'+name+'</b></h4>';
		x = x +'';
		x = x +'</div>';
		x = x +'<div class="modal-body">';
			x = x +'<form class="reportForm">';
			x = x +'<div class="checkbox">';
			x = x +'<label for="input-reasons" style="font-weight:bolder">Reason :</label><br>';
			x = x +'<label><input type="radio" name="reasons[]" value="Chat Spamming" required> Chat Spamming</label><br>';
			x = x +'<label><input type="radio" name="reasons[]" value="Abusing Power"> Abusing Power</label><br>';
			x = x +'<label><input type="radio" name="reasons[]" value="Saying Badwords"> Saying Badwords</label><br>';
			x = x +'<label><input type="radio" name="reasons[]" value="Annoying"> Annoying</label><br>';
			x = x +'<label><input type="radio" name="reasons[]" value="Others"> Others :</label>';
				x = x +'<input class="form-control" name="others" style="display:none">';
			x = x +'</div>';
			x = x +'<button type="submit" class="btn btn-sm btn-success pull-right">REPORT</button>';
			x = x +'<button type="button" class="btn btn-sm btn-danger pull-right" data-dismiss="modal" aria-label="Close">CANCEL</button>';
			x = x +'<div style="clear:both"></div>';
			x = x +'</form>';
		x = x +'</div>';
		x = x +'</div>';
		x = x +'</div>';
		x = x +'</div>';
		x = x +'</div>';
		$('body').append(x);
		$('#report-modal').modal('show');
		$('input[name="reasons[]"]').change(function(){
			if($('input[name="reasons[]"]:checked').val() == "Others"){
				$('input[name="others"]').slideDown();
			}else {
				$('input[name="others"]').slideUp();
			}
		});
		$('form.reportForm').submit(function(){
			$('div.modal-body').fadeOut();
			var data;
			if($('input[name="reasons[]"]:checked').val() == "Others"){
				data = { reason : $('input[name="others"]').val(), reported_id : social_id }
			}else{
				data = { reason : $('input[name="reasons[]"]:checked').val(), reported_id : social_id }
			}
			$.ajax({
				type : 'POST',
				url : 'report',
				data : data,
				dataType : 'JSON',
				success : function(res){
					if(res.status==1){
						setTimeout(function(){
							if($('input[name="reasons[]"]:checked').val() == "Others"){
							$('div.modal-body').fadeIn().html('<div class="alert alert-success">Your report for <b>'+name+'</b> has been sent. <b>Reason : '+$('input[name="others"]').val().replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</b></div>');
							}else {
							$('div.modal-body').fadeIn().html('<div class="alert alert-success">Your report for <b>'+name+'</b> has been sent. <b>Reason : '+$('input[name="reasons[]"]:checked').val().replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</b></div>');
							}
						},500);
					}
					else if(res.status==2){

					}else{
						console.log(res);
					}
				}
			});

			return false;
		});
		$('#report-modal').on('hidden.bs.modal', function (e) {
		  $(this).remove();
		});
	},
	//reply
	sumreply : function(name){
		if(!$('button.replyer').length){
			$('input[name="replto"]').prop('value','@reply_'+name+': ');
			$('span.addreplyer').append('<button class="btn btn-default replyer" type="button" data-toggle="tooltip" data-placement="top" title="Click to remove reply" style="display:none">'+name+'</button>');
		}else {
			alert('You already have set a person to reply with.');
			return falase;
		}
		//$('input[name="msg"]').val('@reply_'+name+':' + $('input[name="msg"]').val());
		$('button.replyer').fadeIn();
		$('input[name="msg"]').focus();
		//alert(name);
		$('button.replyer').click(function(){
			$(this).fadeOut().remove();
			$('input[name="replto"]').val('');
			$('input[name="replto"]').prop('value','');
		});
	},
	replaceReply : function(text){
		return text.replace(/\@reply\_(.*?)\:/g,'<span class="reply"><a href="#">$1 </a></span> ');
	},
	//get messages
	getmsg : function(getChatsFunction){
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			cache : false,
			type : 'POST',
			url : '/getchats',
			data : 'id='+inew.index.lastid,
			dataType : 'JSON',
			success : function(res){
					if(res.msg){
						//console.log(res.msg[0].msg_id);
						inew.index.firstid = res.msg[0].msg_id;
						for(var i=0; i < res.msg.length; i++){
							if(inew.index.doneAll){
								if(res.msg[i].social_id != $('input[name="social_id"]').val() ){
									//$('div.chat-msgbox').append(res.msg[i].text+"<br>");
									inew.addMessage(res.msg[i]);
									inew.index.lastid = res.msg[i].msg_id;
								}
							} else {
								inew.addMessage(res.msg[i]);
								inew.index.lastid = res.msg[i].msg_id;
							}
						}
						inew.index.doneAll = 1;
					}
					else{
						console.log(res);
					}
			}
		});
		setTimeout(getChatsFunction,5000);
	},
	getMoreMsg : function(lastid){
		$('div.load-more').html('LOADING...');
		$.ajax({
			type : 'POST',
			url : '/getmorechats',
			data : 'id='+lastid,
			dataType : 'JSON',
			success : function(res){
					if(res.msg){
						for(var i=0; i < res.msg.length; i++){
								inew.addMessage(res.msg[i]);
								inew.index.firstid = res.msg[i].msg_id;
						}
						inew.index.doneAll = 1;
					}
					else{
						console.log(res);
					}
					if(inew.index.firstid==1){
						$('div.load-more').html('NO MORE MESSAGE TO LOAD').prop('onclick','');
					}else{
						$('div.load-more').html('LOAD MORE MESSAGE');
					}
					//setTimeout(function(){
						//$('div.chat-msgbox').animate({ scrollTop: $('div.chat-msgbox')[0].scrollHeight },100);
					//},500);
			}
		});
	},
	//timer
	liveTime: function(selfTimeout) {
	
		$('.tfm-time').each(function() {
		
			var msgTime = $(this).attr('data-unix-time');
			
			var time = Math.round(new Date().getTime() / 1000) - msgTime;

			var day = Math.round(time / (60 * 60 * 24));
			var week = Math.round(day / 7);
			var remainderHour = time % (60 * 60 * 24);
			var hour = Math.round(remainderHour / (60 * 60));
			var remainderMinute = remainderHour % (60 * 60);
			var minute = Math.round(remainderMinute / 60);
			var second = remainderMinute % 60;
			
			var currentTime = new Date(msgTime*1000);
			var currentHours = ( currentTime.getHours() > 12 ) ? currentTime.getHours() - 12 : currentTime.getHours();
			var currentHours = ( currentHours == 0 ) ? 12 : currentHours;
			var realTime = currentHours+':'+currentTime.getMinutes();
			var timeOfDay = ( currentTime.getHours() < 12 ) ? "AM" : "PM";

			if(day > 7) {
				var timeAgo = currentTime.toLocaleDateString();
			} else if(day>=2 && day<=7) {
				var timeAgo =  day+' days ago';
			} else if(day==1) {
				var timeAgo =  'Yesterday '+realTime+' '+timeOfDay;
			} else if(hour>1) {
				var timeAgo =  hour+' hours ago';
			} else if(hour==1) {
				var timeAgo =  'about an hour ago';
			} else if(minute==1) {
				var timeAgo =  'about a minute ago';
			} else if(minute>1) {
				var timeAgo =  minute+' minutes ago';
			} else if(second>1) {
				var timeAgo =  second+' seconds ago';
			} else {
				var timeAgo =  'few seconds ago';
			}
			
			//$(this).prop('title',timeAgo);
			$(this).html(timeAgo);
		});
		setTimeout(selfTimeout,5000);
	}
}