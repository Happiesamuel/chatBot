"use strict";
class Bot{
#form = document.querySelector(".form");
#ul = document.querySelector("ul");
#messages
#API = "https://api.openai.com/v1/chat/completions";
#API_KEY = "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";
#TIME = 500;
constructor(){
  this._removePreloader()
  this._toogleCancel()
 this.#form.addEventListener("click", this._getValue.bind(this))
}
_removePreloader(){
  const loads = document.querySelector(".pre");
  setTimeout(function () {
    loads.classList.add("disappear");
  }, 3500);
}
_toogleCancel(){
  const chat = document.querySelector("body").querySelector(".show__chat");
const totalBody = document.querySelector(".total__body");
const showChat = chat.querySelector(".chats");
const h1 = document.querySelector("h1");
const p = document.createElement("i");
const q = document.createElement("i");
p.classList.add("far");
p.classList.add("fa-message");
q.classList.add("fas");
q.classList.add("fa-xmark");
showChat.appendChild(p);
if (totalBody.classList.contains("none")) {
  chat.addEventListener("click", function (e) {
    if (e.target.classList.contains("fa-message")) {
      const click = e.target;
      if (!click) return;
      totalBody.classList.remove("none");
      h1.classList.add("hide");
      p.remove();
      showChat.appendChild(q);
      chat.classList.remove("animate__bounce");
    }
  });
}

chat.addEventListener("click", function (e) {
  if (e.target.classList.contains("fa-xmark")) {
    const click = e.target;
    if (!click) return;
    totalBody.classList.add("none");
    q.remove();
    chat.classList.add("animate__bounce");
    h1.classList.remove("hide");
    showChat.appendChild(p);
  }
});
}
_getQuery(que) {
  const click = que.value;
  const fakeMessages = "Hs Bot is typing...";
  if (!click) return;
  const clicks = click.trim();
  this._displayUserMessage(clicks);
  this._getJSON(this.#API, clicks);
  setTimeout(this._displayFakeMessage(fakeMessages),500);
  que.value = "";
}
_getValue(e){
      if (e.target.classList.contains("send")) {
        const que = e.target.closest(".form").querySelector(".query");
        this._getQuery(que);
      }
    }
_displayUserMessage(markup) {
      const c = document.createElement("li");
      const d = document.createElement("div");
      const e = document.createElement("div");
      const f = document.createElement("div");
      d.classList.add("outgoing__head");
      e.classList.add("icon");
      f.classList.add("li__message");
      d.innerHTML = "User";
      e.innerHTML = this._displayTime();
      f.textContent = markup;
      c.classList.add("chat");
      c.classList.add("outgoing");
    f.style.background = '#724ae8'
    f.style.color = '#fff'
      c.appendChild(f);
      f.appendChild(e);
      this.#ul.appendChild(c);
      this.#ul.scrollTo(0, this.#ul.scrollHeight);
    };
    _displayTime() {
      const now = Date.now();
      const k = new Intl.DateTimeFormat("en-us", {
        minute: "numeric",
        hour: "2-digit",
      }).format(now);
      return k;
    };
  _displayFakeMessage(f) {
      let html = `
        <li class="chat incoming">
            <div class="icon fa fa-robot"></div>
            <div class="li__message">${f}</div>
       </li>
        `;
    
      this.#ul.insertAdjacentHTML("beforeend", html);
      this.#ul.scrollTo(0, this.#ul.scrollHeight);
    };
    _displayBotMessage(e){
        this._deleteTyping();
        let html = `
       <li class="chat incoming">
       <div class="li__message" style="border-radius: 10px 10px 10px 0px">
       <div class="icon fa fa-robot"></div>
           ${e}
           <div class="icon">${this._displayTime()}</div>
           </div>
      </li>
       `;
        this.#ul.insertAdjacentHTML("beforeend", html)
      };
    _deleteTyping(){
      const ul = document.querySelector("ul");
        const pre = ul.querySelectorAll(".incoming");
        const a = Array.from(pre);
        a.forEach((x) => {
          const b = x.querySelector(".li__message");
          if (b.textContent === "Hs Bot is typing...") {
            b.closest(".incoming").remove();
          }
        });
      };
      
    async _getJSON(url, message) {
      try {
        const res = await Promise.race([
          fetch(url, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${this.#API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: `${message}` }],
            }),
          }),
          this._TIMEOUT(this.#TIME),
        ]);
    
        if (!res.ok) {
          throw new Error('Check your internet connections')
        } else {
          console.log(res);
    
          const data = await res.json();
          console.log(data);
          const [choices] = data.choices;
          this.#messages = choices.message.content;
          this._displayBotMessage(this.#messages);
        }
      } catch (err) {
        this._renderError(err.message);
      }
    };
  
_TIMEOUT(s){
  return new Promise((_, reject) => {
    setTimeout(function () {
      reject(new Error(`Request took too long after ${s} seconds`));
    }, s * 1000);
  });
};

_renderError(err) {
  const ul = document.querySelector("ul");
  const html = `
<div class="content ">
<div class="cancel__all">
    <div class="cancel">X</div>
</div>
<div class="story__content">${err}</div>
<div class="span fa fa-wifi"></div>
</div>
<div class="overlay "></div>
`;
 ul.insertAdjacentHTML("afterbegin", html);
 ul.querySelector(".cancel").addEventListener("click", function (handler) {
   ul.querySelector(".content").classList.add("hide");
   ul.querySelector(".overlay").classList.add("hide");
  });
 ul.querySelector(".cancel").addEventListener("click",this._deleteTyping);
 ul.querySelector(".overlay").addEventListener("click", function () {
   ul.querySelector(".content").classList.add("hide");
   ul.querySelector(".overlay").classList.add("hide");
  });
 ul.querySelector(".overlay").addEventListener("click", this._deleteTyping)
};
}
const bot = new Bot()