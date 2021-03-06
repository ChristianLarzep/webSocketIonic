import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import $ from 'jquery'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private serverUrl = null;
  private title = 'WebSockets chat';
  private stompClient;

  constructor(public navCtrl: NavController) {
    this.serverUrl="/myAPI/";
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(){
    let ws = new SockJS(this.serverUrl+'socket'); //endpoint that we added in the registerStompEndpoints() method in the server code.
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/chat", (message) => {// subscribe to the “/chat” channel, that is defined in the WebSocketConfiguration class in Java application.
        if(message.body) {
          $(".chat").append("<div class='message'>"+message.body+"</div>")
          console.log(message.body);
        }
      });
    });
  }

 /*
   Here we simply take the message submitted from the input in html file, and with the help of
   stompClient we send this message to the “/app/send/message” route defined in the
   WebSocketController in Java as a value of @MessageMapping in onReceivedMessage method;
   So, whenever the client send message to “/app/send/message” → this message at the same time
   is sent to all clients subscribed to the “/chat” channel.
 */
  sendMessage(message){
    this.stompClient.send("/app/send/message" , {}, message);
    $('#input').val('');
  }

}
