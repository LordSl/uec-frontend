<template>
  <div id="login">

    <div id="bg">
    </div>

    <el-container id="top">
      <el-header id="head-zone" height="10%">
        <div>
          <label class="name-label"> 用户名</label>
          <el-input class="base-input" v-model="usernameInput" placeholder="请输入用户名"></el-input>
          <label class="name-label" style="margin-left: 30px"> 房间名</label>
          <el-input class="base-input" v-model="roomnameInput" placeholder="请输入房间名"></el-input>
        </div>
        <div style="align-self: flex-end;position: absolute">
          <el-button round class="round-button" v-on:click="connect" style="margin: 15px 20px 15px 0;">连接</el-button>
          <el-button round class="round-button" v-on:click="lock" v-model="lockStr" style="margin: 15px 20px 15px 0;">{{lockStr}}</el-button>
          <el-button round class="round-button" v-on:click="close" style="margin: 15px 20px 15px 0;">离开</el-button>
        </div>

      </el-header>

      <el-container>
        <el-aside id="aside-zone">
          <el-menu class="menu">
            <el-menu-item-group class="menu-group" title="UEC简介">
              <el-menu-item class="menu-item">UEC是什么？</el-menu-item>
              <el-menu-item class="menu-item">我该如何使用UEC？</el-menu-item>
              <el-menu-item class="menu-item">服务器不知道我在说什么吗？</el-menu-item>
            </el-menu-item-group>
          </el-menu>

          <el-menu class="menu">
            <el-menu-item-group class="menu-group" title="更新预告">
              <el-menu-item class="menu-item">看！</el-menu-item>
              <el-menu-item class="menu-item">是鸽子</el-menu-item>
              <el-menu-item class="menu-item">咕咕咕...</el-menu-item>
            </el-menu-item-group>
          </el-menu>

          <el-menu class="menu">
            <el-menu-item-group class="menu-group" title="与作者联系">
              <el-menu-item class="menu-item">QQ</el-menu-item>
              <el-menu-item class="menu-item">邮箱</el-menu-item>
              <el-menu-item class="menu-item">GitHub</el-menu-item>
            </el-menu-item-group>
          </el-menu>

        </el-aside>

        <el-main id="main-zone">
          <div id="msg-box">
            <div v-for="item in this.chatMsgList" class="msg-item">
              <div v-if="item.position==='left'" class="msg-item-left">
                <el-avatar icon="el-icon-user-solid" class="user-avatar"></el-avatar>
                <label class="user-name">{{item.name}}：</label>
                <div class="msg-item-text">{{ item.content }}</div>
              </div>
              <div v-else-if="item.position==='right'" class="msg-item-right">
                <el-avatar icon="el-icon-user-solid" class="user-avatar"></el-avatar>
                <label class="user-name">{{item.name}}：</label>
                <div class="msg-item-text">{{ item.content }}</div>
              </div>
            </div>
          </div>
          <div id="text-box">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入要发送的消息"
              v-model="textToSend">
            </el-input>
            <el-button round class="round-button" v-on:click="send"
                       style="margin: 15px 20px 15px 80%;align-self: flex-end">发送
            </el-button>
          </div>

        </el-main>


      </el-container>

    </el-container>

  </div>
</template>

<script>
import state from "../state";

export default {
  name: "login",
  data() {
    return {
      lockStr:"上锁",
      textToSend: "",
      usernameInput: "",
      roomnameInput: "",
      chatMsgList: [
      ]
    }
  },

  mounted() {
    state.legalCall.doShow = this.showMessage
    state.legalCall.doMessage = this.$message
    state.legalCall.doSend = (textToSend) =>{
      let message = {
        type: "speak",
        content: encryptByDES(textToSend, state.desKey),
        senderName: state.userName
      }
      state.websocket.send(JSON.stringify(message))
    }
  },
  methods: {
    connect() {
      if(state.websocket!=null){
        state.legalCall.doMessage({
          message:"连接已存在，请勿重复点击",
          type:"warning"
        })
        return
      }

      state.userName = this.usernameInput
      console.log(state.userName)
      state.roomName = this.roomnameInput
      console.log(state.roomName)

      if(!(state.userName!==""  && state.userName!=="")){
        state.legalCall.doMessage({
          message:"请正确输入用户名和房间",
          type:"warning"
        })
        return
      }


      state.websocket = new WebSocket("ws://localhost:8080/chat/" + state.roomName + "/" + state.userName)

      //连接发生错误的回调方法
      state.websocket.onerror = () => {
        getResolver("error")(state)
      }

      //连接成功建立的回调方法
      state.websocket.onopen = () => {
        getResolver("open")(state)
      }

      //连接关闭的回调方法
      state.websocket.onclose = () => {
        getResolver("close")(state)
      }

      //接收到消息的回调方法
      state.websocket.onmessage = (event) => {
        console.log(event.data)
        let msg = JSON.parse(event.data)
        getResolver(msg.type)(msg, state)
      }

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = () => {
        state.websocket.close()
      }

    },
    showMessage(message) {
      this.chatMsgList.push(message)
    },

    //发送消息
    send() {
      if (state.desKey === null){
        console.log("desKey not set")
        this.$message({
          message:"您尚未连接",
          type:"warning"
        })
      }
      else {
        state.legalCall.doSend(this.textToSend)
      }
    },

    lock() {
      if(state.joinLock===null)  {
        state.joinLock = 1
        this.lockStr = "解锁"
      }
      else {
        state.joinLock = null
        this.lockStr = "上锁"
      }
    },

    //关闭连接
    close() {
      if(state.websocket===null){
        this.$message({
          message:"您已断开连接，请勿重复点击",
          type:"warning"
        })
        return
      }
      if(state.desKey!=null) state.legalCall.doSend("离开房间")
      state.websocket.close()
      this.chatMsgList = []
      state.websocket = null
      state.desKey = null
      state.rsaKey = null
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

function getResolver(methodName) {
  const resolverTable = {
    "ask": ask,
    "answer": answer,
    "speak": speak,
    "open": open,
    "close": close,
    "error": error,
  }
  return resolverTable[methodName]
}

const ask = (msg, state) => {
  if (state.desKey != null && state.joinLock===null) {
    let publicKey = msg.content
    let reply = {
      type: "answer",
      content: cryptico.encrypt(state.desKey, publicKey).cipher,
      senderName: msg.senderName
    }
    state.websocket.send(JSON.stringify(reply))
  }
}

const answer = (msg, state) => {
  if (msg.content === "master") {
    state.desKey = genDesKey(16)
    console.log("gen des " + state.desKey)
    state.legalCall.doMessage({
      message:"创建房间密钥",
      type:"success"
    })
    state.legalCall.doSend("创建房间")
  } else {
    if (msg.senderName === state.userName) {
      state.desKey = cryptico.decrypt(msg.content, state.rsaKey).plaintext
      console.log("get des " + state.desKey)
      state.legalCall.doMessage({
        message:"成功加入房间",
        type:"success"
      })
      state.legalCall.doSend("进入房间")
    }
  }
}

const speak = (msg, state) => {
  console.log(msg)
  if (state.desKey === null) console.log("desKey not set")
  else {
    let realMsg = {
      position: null,
      name: msg.senderName,
      content: decryptByDES(msg.content, state.desKey)
    }
    realMsg.position = msg.senderName === state.userName ? "left" : "right";
    state.legalCall.doShow(realMsg)
  }
}

const error = (state) => {
  state.legalCall.doMessage({
    message:"连接错误，请刷新网页",
    type:"error"
  })
}

const open = (state) => {
  setTimeout(
    () => {
      if (state.desKey === null) {
        state.rsaKey = cryptico.generateRSAKey(Math.random().toString(), 1024)
        let publicKey = cryptico.publicKeyString(state.rsaKey)
        let msg = {
          type: "ask",
          content: publicKey,
          senderName: state.userName
        }
        state.websocket.send(JSON.stringify(msg))
        console.log("gen rsa key and send")
        state.legalCall.doMessage({
          message:"发送密钥请求",
          type:"info"
       })
      }
      else {
        state.legalCall.doMessage({
          message:"您已创建房间 "+state.roomName,
          type:"success"
        })
      }
    }
    , 1000)
}

const close = (state) => {
  state.legalCall.doMessage({
    message:"连接关闭",
    type:"info"
  })
  setTimeout(
  ()=>{
    if(state.websocket===null)
      state.legalCall.doMessage({
        message:"您已离开房间",
        type:"success"
      })
  }
  ,1000)
}
</script>

<style>
#login {
  width: 100%;
  height: 100%;
  position: fixed;
}

#bg {
  width: 100%;
  height: 100%;
  position: fixed;
  opacity: 90%;
  background-image: url('../../static/bg2.png');
  background-position: top;
  background-attachment: fixed;
  background-size: cover;
}

#top {
  position: fixed;
  width: 100%;
  height: 100%;
}

#head-zone {
  background-color: rgba(233, 233, 233, 0.5);
  margin: 10px 15px 0 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}


#aside-zone {
  background-color: rgba(233, 233, 233, 0.5);
  margin: 10px 0 20px 10px;
  border-radius: 10px;
}

#main-zone {
  background-color: rgba(233, 233, 233, 0.5);
  margin: 10px 15px 20px 10px;
  border-radius: 10px;
}

.round-button {
  font-family: 阿里汉仪智能黑体, serif;
  font-size: 30px;
  height: 60px;
  width: 120px;
}

#msg-box {
  display: flex;
  flex-direction: column;
  background-color: rgba(233, 233, 233, 0.4);
  border-radius: 10px;
  height: 70%;
  max-height: 600px;
  overflow-y:scroll;
}

#text-box {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.base-input {
  width: 200px;
  margin: 30px 10px 30px 10px;
}

.msg-item {
  display: flex;
  flex-direction: column;
}

.user-avatar{
  background-color: rgba(233,233,233,0.8);
  margin: 5px;
}

.user-name{
  color: rgba(120,180,210,0.8);
  position: relative;
  padding: 5px 0 5px 5px;
}

.msg-item-text{
  padding: 5px 0 5px 5px;
}

.msg-item-left {
  border-radius: 5px;
  background-color: rgba(50, 50, 130, 0.75);
  margin: 10px 10px 10px 10px;
  padding: 5px 5px 5px 5px;
  width: max-content;
  font-family: 阿里汉仪智能黑体, serif;
  font-size: 30px;
  color: aliceblue;;
  align-self: flex-start;
  display: flex;
  flex-direction: row;
}

.msg-item-right {
  border-radius: 5px;
  background-color: rgba(50, 50, 130, 0.75);
  margin: 10px 10px 10px 10px;
  padding: 5px 5px 5px 5px;
  width: max-content;
  font-family: 阿里汉仪智能黑体, serif;
  font-size: 30px;
  color: aliceblue;
  align-self: flex-end;
  /*flex-end是靠右,flex-start靠左*/
  display: flex;
  flex-direction: row;
}

.name-label {
  font-family: 阿里汉仪智能黑体, serif;
  font-size: 25px;
}

.menu {
  background-color: rgba(233, 233, 233, 0);
  border: 1px;
}

.menu-group {
  margin: 10px;
  background-color: rgba(233, 233, 233, 0);
  border-radius: 5px;
  font-family: 阿里汉仪智能黑体, serif;
}

.menu-item {
  margin: 0 10px 10px 10px;
  background-color: rgba(233, 233, 233, 0.4);
  border-radius: 5px;
  font-size: 17px;
}

.menu-item:last-of-type {
  padding-bottom: 10px;
}

</style>
