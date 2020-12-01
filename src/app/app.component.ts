import { Component, DoCheck, OnInit } from '@angular/core';
import { ChatService, Message } from './chat.service';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import Speech from 'speak-tts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  messages: Observable<Message[]>;
  msg: string;
  speech: any;
  speechData: any;

  constructor(public chat: ChatService) {     
    this.textToSpeech();
  }

  ngOnInit() {
    this.messages = this.chat.conversation.asObservable().pipe(
      scan((acc, val) => acc.concat(val)));
  }

  
  sendMessage() {
    let msg = this.msg;
    this.msg = null;
    this.chat.converse(msg).then(() => {    
      console.log(this.chat.getBotMessage());
      this.speech.speak({
        text: this.chat.getBotMessage(),
      }).then(() => {
        console.log("Success !")
      }).catch(e => {
        console.error("An error occurred :", e)
      })
    })
  }

  textToSpeech() {
    this.speech = new Speech();

    if (this.speech.hasBrowserSupport()) {
      this.speech.init({
        'volume': 1,
        'lang': 'en-US',
        'rate': 1,
        'pitch': 1,
        'voice': 'Google UK English Female',
        'splitSentences': true,
        'listeners': {
          'onvoiceschanged': (voices) => {
            console.log("Event voiceschanged", voices)
          }
        }
      }).then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        this.speechData = data;
      }).catch(e => {
        console.error("An error occured while initializing : ", e)
      })
    }
  }

  record() {
    
  }

}

