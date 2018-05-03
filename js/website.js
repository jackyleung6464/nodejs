$(function(){
	console.log('jquery ready');
	var status 		= $('.status');
	var c_count 	= $('.c_count');
	var sys_msg 	= $('.sys_msg');
	var room_list 	= $('.room_list');
	var c_room_port	= 0;
	var room_socket;
    var login_token = '';

	var socket = io();
    socket.on("connect", function () {
        status.html("Connected.");
    });
    socket.on("disconnect", function () {
        status.html("Disconnected.");
    });
    socket.on('reconnect', function(){
        $('.room_content_box').html('');
    });
    socket.on("login_server_count", function (amount) {
		c_count.html(amount+" Connected");
    });
    socket.on("wellcome_login_connection", function(text) {
		sys_msg.html(text);
    });

    socket.on('login_token',function(token){
        login_token = token;
        $('.upload_ppt_box').slideDown(500);
        show_roomlist();
    });

    //---- room list
    socket.on('getback_room_list',function(list){
    	// console.log('room list: '+ list);
    	room_list.html('');
    	$.each( list, function( key, value ) {
		 room_list.append("<div class='room_block room_"+value+"'><span>Room "+value+"</span><span class='enter_room' data-port="+value+">Enter</span></div>");
		});
    });
    ///---- end room list

    $('.student_login').click(function(){
        show_roomlist();
    });

    $('.login_submit').click(function(){
        var username = $('#login_username').val();
        var password = $('#login_password').val();
        socket.emit('login',username,password);
    	
    });

    $(document).on('click','.enter_room',function(){
    	var dp = $(this).attr('data-port');
    	if(c_room_port == dp){
    		return;
    	}
        $('.room_content_box').html('');
    	c_room_port = dp;
    	if(room_socket != null){
    		room_socket.close();
    	}
    	room_socket = io("http://localhost:"+dp+"/");
    	init_room_socket(room_socket);
    	$('.room_block').removeClass('current_room');
    	$(this).parent().addClass('current_room');
    })

    
    function show_roomlist(){
        $('.login_box').slideUp(250);
        $('.room_list').slideDown(250);
        socket.emit('get_room_list');
    }

    function init_room_socket(room_socket){
        var room_content_box = $('.room_content_box');
    	room_socket.on('connect',function(){
    		$('.room_header_rtxt').html('Connected');
            room_socket.emit('get_history_msg');
    	}); 
        room_socket.on('boardcast_history_msg',function(msgs){
            $.each(msgs,function(index, value){
                if(value.message_type == 'String'){
                    room_content_box.append(gen_txtmsg(value.username,value.content));
                }
            });
            room_content_box.stop().animate({scrollTop: room_content_box.prop("scrollHeight")}, 500);
        });
    	room_socket.on('disconnect',function(text){
    		$('.room_header_rtxt').html('Disconnected');
    	});
    	room_socket.on("room_name", function (text) {
           $('.room_name').html(text);
        });
        room_socket.on("room_count", function (num) {
           $('.room_count').html(num);
        });
        room_socket.on("boardcast_txt_msg",function(msg,name){
        	room_content_box.append(gen_txtmsg(name,msg));
        	room_content_box.stop().animate({scrollTop: room_content_box.prop("scrollHeight")}, 500);
        });

        //--- init click event 
        $('.custom_input_enter').unbind("click").click(function(){
        	var custom_input_text = $('.custom_input_text');
        	var output = custom_input_text.html();
        	if(output.trim() != ''){
        		custom_input_text.html('');
        		room_socket.emit('txt_msg',output,login_token);
        	}
        	
        });
    }

    function gen_txtmsg(name,msg){
    	var txtmsg_html = '';
    	txtmsg_html +="<div class='chat_row'>";
		txtmsg_html += 	"<div class='chat_user'>"
		// txtmsg_html +=		"<span class='chat_number'>"+no+".</span>"
		txtmsg_html +=		"<span class='username'>"+name+"</span>"
		txtmsg_html +=	"</div>"
		txtmsg_html +=	"<div class='chat_msg'>"
		txtmsg_html +=	msg
		txtmsg_html +=	"</div>"
		txtmsg_html +="</div>";
    	return txtmsg_html
    }
})