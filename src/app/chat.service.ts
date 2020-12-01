import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class Message {
  constructor(public content: any,
    public sentBy: string) {
  }
}

export class Botmsg {
  constructor(public Reply: any) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  conversation = new BehaviorSubject<Message[]>([]);
  botmessage: any;

  constructor(private http: HttpClient) { }

  update(msg: Message) {
    this.conversation.next([msg]);
  }

  converse(msg: string) {
    return new Promise((resolve, reject) => {
      const url = 'https://2aa2d51088d3.ngrok.io/send-msg';
      const contentHeaders = new HttpHeaders();
      contentHeaders.append('Accept', 'application/json');
      contentHeaders.append('Content-Type', 'application/json');
      const userMessage = new Message(msg, 'user');
      this.update(userMessage);

      this.http.post<Botmsg>(url, { msg: msg }, { headers: contentHeaders }).subscribe(botmsg => {
        const botMessage = new Message(botmsg.Reply, 'bot');
        this.update(botMessage);
        this.setBotMessage(botmsg.Reply);
        resolve();
      },
        (err: HttpErrorResponse) => {
          console.log(err.error);
          reject();
        }
      )
    })
  };

  setBotMessage(botmessage:any): void {
    this.botmessage = botmessage;    
  }

  getBotMessage(): any {
    return this.botmessage;    
  }
}
