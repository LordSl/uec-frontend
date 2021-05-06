<template>
  <div id="home">
    <label for="username">username</label>
    <input id="username" type="text" v-model="username"/>
    <br>
    <label for="roomname">roomname</label>
    <input id="roomname" type="text" v-model="roomName"/>
    <br>
    <label for="content">content</label>
    <input id="content" type="text" v-model="content"/>
    <br>
    <button v-on:click=connect>CONNECT</button>
    <button v-on:click=send>SEND MESSAGE</button>
    <button v-on:click=close>CLOSE</button>
    <div id="message" v-html="msg"></div>
  </div>
</template>

<script>
import state from "../state";

export default {
  data() {
    return {
      username: null,
      roomName: null,
      content: null,
      msg: ''
    }
  },
  mounted() {
  },
  methods: {
    connect() {
      state.userName = this.username
      console.log(state.userName)
      state.roomName = this.roomName
      console.log(state.roomName)
      state.websocket = new WebSocket("ws://localhost:8080/chat/" + state.roomName + "/" + state.userName)

      let doShow = this.showMessage

      //连接发生错误的回调方法
      state.websocket.onerror = () => {
        getResolver("error")(state,doShow)
      }

      //连接成功建立的回调方法
      state.websocket.onopen = () => {
        getResolver("open")(state,doShow)
      }

      //连接关闭的回调方法
      state.websocket.onclose = () => {
        getResolver("close")(state,doShow)
      }

      //接收到消息的回调方法
      state.websocket.onmessage = (event) => {
        console.log(event.data)
        let msg = JSON.parse(event.data)
        getResolver(msg.type)(msg,state,doShow)
      }

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = () => {
        state.websocket.close()
      }

    },
    showMessage(message) {
      this.msg += message + '<br/>'
    },

    //发送消息
    send() {
      if (state.desKey == null) console.log("desKey not set")
      else {
        let message = {
          "type": "speak",
          "content": encryptByDES(document.getElementById('content').value, state.desKey)
        }
        state.websocket.send(JSON.stringify(message))
      }
    },

    //关闭连接
    close() {
      state.websocket.close()
    },

  },

}

function encryptByDES(message, key) {
  let keyHex = CryptoJS.enc.Hex.parse(key)
  let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Iso10126
  })
  return encrypted.ciphertext.toString()
}

function decryptByDES(ciphertext, key) {
  let keyHex = CryptoJS.enc.Hex.parse(key)
  let decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Iso10126
  })
  return CryptoJS.enc.Utf8.stringify(decrypted)
}

function genDesKey(num) {
  let library = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let key = ""
  for (let i = 0; i < num; i++) {
    let randomPoz = Math.floor(Math.random() * library.length)
    key += library.substring(randomPoz, randomPoz + 1)
  }
  return key
}

function getResolver(methodName){
  const resolverTable = {
    "ask": ask,
    "answer": answer,
    "speak": speak,
    "open":open,
    "close":close,
    "error":error,
  }
  return  resolverTable[methodName]
}

const ask = (msg,state,doShow) => {
  if (state.desKey != null) {
    let publicKey = msg.content
    let reply = {
      "type": "answer",
      "content": cryptico.encrypt(state.desKey, publicKey).cipher,
      "senderName": msg.senderName
    }
    state.websocket.send(JSON.stringify(reply))
  }
}

const answer = (msg,state,doShow) => {
  if(msg.content==="master") {
    state.desKey = genDesKey(16)
    console.log("gen des " + state.desKey)
  }
  else {
    if (msg.senderName === state.userName) {
      state.desKey = cryptico.decrypt(msg.content, state.rsaKey).plaintext
      console.log("get des " + state.desKey)
    }
  }
}

const speak = (msg,state,doShow) => {
    if (state.desKey == null) console.log("desKey not set")
    else {
      let realMsg = {
        "type": "speak",
        "content": decryptByDES(msg.content, state.desKey)
      }
      doShow(JSON.stringify(realMsg))
    }
}

const error = (state,doShow) =>{
  doShow("error")
}

const open = (state,doShow) =>{
  doShow("open")
  setTimeout(
    () => {
      if (state.desKey === null) {
        state.rsaKey = cryptico.generateRSAKey(Math.random().toString(), 1024)
        let publicKey = cryptico.publicKeyString(state.rsaKey)
        let msg = {
          "type": "ask",
          "content": publicKey,
          "senderName": state.userName
        }
        state.websocket.send(JSON.stringify(msg))
        console.log("gen rsa key and send")
      }
    }
    , 1000)
}

const close = (state,doShow) =>{
  doShow("close")
}

</script>

<style>

</style>
