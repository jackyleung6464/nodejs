class Port_room  {
	constructor(port_number,db_connection,userModel) {
      this.uuidv1       = require('uuid/v1');
  		this.port_number 	= port_number;
  		this.express 		  = require('express');
  		this.app 			    = this.express();
  		this.http 		    = require('http').Server(this.app);
  		this.io 			    = require('socket.io')(this.http);
  		this.room_count 	= 0;
      this.db_connection= db_connection;
      this.userModel    = userModel;

      let txt_schema    = require('./db/txt_schema.js');
      this.MessageModel = db_connection.model('Message', txt_schema);




  		this.start();

  	}

 	//--- getter 
  	get port(){
    	return this.port_number;
  	}
  	get room(){
  		return this;
  	}
  	//---end getter 

  	// function start 

  	start(){
    		this.http.listen(this.port_number, '::1', function () {});
    		console.log("Room Server"+this.port_number+" Start");
    		this.io.on('connection', (socket) => {
  	  		this.room_count++;
          console.log('Port:'+this.port_number+" has new connection");
          socket.emit('room_name',"Room: "+this.port_number);
          socket.emit('room_connect',"Connected");
          this.io.emit('room_count',this.room_count);

          socket.on('txt_msg',(msg,token) =>{
              //--- resend to all user
              this.getNameByToken(token).then((name)=>{
                this.boardcast_txt_msg(msg,name);
              });
          });

          socket.on('get_history_msg',()=>{
              console.log('get_history_msg');
              this.MessageModel.find({
                room:this.port_number
              }).limit(50).sort({create_at:1}).
              select('message_type content username').
              exec((err, msgs)=>{
                if(err){
                  console.log('Room : '+ this.port_number+" get history msg error");
                  return false;
                }
                if(msgs.length>0){
                  socket.emit('boardcast_history_msg',msgs);
                }
              });

          });

  		  	socket.on('disconnect', () => {
  		  		this.room_count = (this.room_count < 0) ? 0 : this.room_count-=1;
            console.log('Port:'+this.port_number+" has disconnection");
            this.io.emit('room_count',this.room_count);
  			});

  		});
  	}

    getNameByToken(token){
      return new Promise((resolve, reject) => {
        if(!token || token.length!=24){
          resolve('Student');
        }else{
          this.userModel.findOne({
                  _id:token
                }).select('displayname').exec(function(err,result){
                  if(err || !result){
                    console.log('getNameByToken error');
                    resolve('Student');
                  }else{
                    resolve(result.displayname);
                  } 
                });
        }
      });
    }

    boardcast_txt_msg(msg,displayname){
      this.save_msg2db(msg,displayname);
      this.io.emit('boardcast_txt_msg',msg,displayname);
    }
    

    save_msg2db(msg,name){
      let input_db_msg = new this.MessageModel({ 
        // _id          : this.uuidv1(),
        message_type : 'String',
        content      : msg,
        username     : name,
        room         : this.port_number
      });


      input_db_msg.save(function (err, msg_result) {
        if (err) {
          console.log('error to save msg');
         return console.error(err);  
        }
        console.log('Saved msg to db : '+msg);
      });
    }

    // async async_getNameByToken(token){
    //   let result = await this.getNameByToken(token);
    //   console.log(result);
    // }
}	


module.exports = Port_room;