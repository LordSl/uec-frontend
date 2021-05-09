<template>
  <div id="login">


    <NoticeBoard ref="NB" v-show="NBVisi" @chHandler="chNBVisi"></NoticeBoard>

    <div id="bg">
    </div>

    <el-container id="top">
      <el-header id="head-zone" height="10%">
        <div style="display: flex;flex-direction: row;margin-top: 30px;margin-bottom: 30px;align-items: center;">
          <label class="name-label" style="margin-left: 10px"> 用户名</label>
          <el-input class="base-input" v-model="usernameInput" placeholder="请输入用户名"
                    style="margin-left: 20px"></el-input>
          <label class="name-label" style="margin-left: 30px"> 房间名</label>
          <el-input class="base-input" v-model="roomnameInput" placeholder="请输入房间名"
                    style="margin-left: 20px"></el-input>
        </div>
        <div style="align-self: flex-end;position: absolute;margin-top: 15px;">
          <el-button round class="round-button" v-on:click="connectReact" style="margin-right: 20px">连接</el-button>
          <el-button round class="round-button" v-on:click="lockReact" v-model="lockStr" style="margin-right: 20px">
            {{ lockStr }}
          </el-button>
          <el-button round class="round-button" v-on:click="leaveReact" style="margin-right: 20px">离开</el-button>
        </div>

      </el-header>

      <el-container>
        <el-aside id="aside-zone">
          <el-menu class="menu">
            <el-menu-item-group v-for="group in NBData" class="menu-group" :title="group.title">
              <el-menu-item v-for="item in group.items" v-on:click="noticeBoardReact(item)" class="menu-item">
                {{ item.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>

        </el-aside>

        <el-main id="main-zone">
          <div id="msg-box">
            <div v-for="item in this.chatMsgList" class="msg-item">
              <div v-if="item.position==='left'" class="msg-item-left">
                <el-avatar icon="el-icon-user-solid" class="user-avatar"></el-avatar>
                <label class="user-name">{{ item.name }}：</label>
                <div class="msg-item-text">{{ item.content }}</div>
              </div>
              <div v-else-if="item.position==='right'" class="msg-item-right">
                <el-avatar icon="el-icon-user-solid" class="user-avatar"></el-avatar>
                <label class="user-name">{{ item.name }}：</label>
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
            <el-button round class="round-button" v-on:click="sendReact"
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
import NoticeBoard from "./NoticeBoard";

export default {
  name: "login",
  components: {NoticeBoard},
  data() {
    return {
      lockStr: "上锁",
      textToSend: "",
      usernameInput: "",
      roomnameInput: "",
      chatMsgList: [],
      NBData: [
        {
          title: "UEC简介",
          items: [
            {
              name: "UEC是什么？",
              headLine: "关于UEC",
              context: "UEC是Untrusted Environment Based Communication Tool的缩写，旨在打造一个对用户单向透明的交流工具。UEC使用RSA+DES的加密方式，由用户自行分发密钥，从而实现了用户间的安全交流。服务器虽然参与了用户间的报文转发，但无法解读用户所发报文的具体内容，对服务器而言，用户间的交流就像是谜语，这也是UEC的中文名——谜语人计划的由来。"
            },
            {
              name: "我该如何使用UEC？",
              headLine: "使用方法",
              context: "在线下约定一个房间名，随便想一个用户名，填入左上角，点击连接进入房间。注意，房间名和用户名都是全局唯一的，请稍微想得复杂一点（这一部分以后会改进）。点击上锁后，你就不再对进入房间的人广播密钥，当一个房间的所有人都上锁时，这个房间也就成为了黑盒，外人无法进入，交流内容对外人均不可见。点击离开退出房间，当房间内所有人均离开时，房间自动解散。"
            },
            {
              name: "服务器不知道我在说什么吗？",
              headLine: "谜语人的原理",
              context: "世界上不存在绝对的安全，任何的安全都要建立在一定的条件之上。对现阶段的UEC而言，能保证的是房间以外的人（以及服务器）听不懂用户间的谜语。但是，要如何保证里面没有内鬼，就要靠用户自己了。尤其要注意的是，用户名和房间名是不会加密的，这就意味着通过窃听用户的网络请求，第三者可以尾随用户进入房间。UEC会忠实地广播每一条进入信息，请自行判断是否有尾行者闯入房间。"
            },
          ]
        },
        {
          title: "更新预告",
          items: [
            {
              name: "看！",
              headLine: "这里是标题",
              context: "这里是正文"
            },
            {
              name: "是鸽子",
              headLine: "这里是标题",
              context: "这里是正文"
            },
            {
              name: "咕咕咕...",
              headLine: "这里是标题",
              context: "这里是正文"
            },

          ]
        },
        {
          title: "UEC简介",
          items: [
            {
              name: "QQ",
              headLine: "非诚勿扰",
              context: "1720224284"
            },
            {
              name: "邮箱",
              headLine: "一般不看",
              context: "1720224284@qq.com"
            },
            {
              name: "GitHub",
              headLine: "欢迎留言",
              context: "https://github.com/LordSl/uec-frontend"
            },
          ]
        }
      ],
      NBVisi: false,
    }
  },

  mounted() {
    state.inCalls.doShow = this.showMessageReact
    state.inCalls.doMessage = this.$message
    state.outCalls.doSend = (jsonTextToSend) => {
      state.websocket.send(jsonTextToSend)
    }
    state.outCalls.doSendSecure = (textToSend) => {
      let message = {
        type: "speak",
        content: encryptByDES(textToSend, state.desKey),
        senderName: state.userName
      }
      state.websocket.send(JSON.stringify(message))
    }
    state.inCalls.doNotice = (textToNotice) => {
      this.chatMsgList.push({
        position: "right",
        name: "系统",
        content: textToNotice
      })
    }
    state.outCalls.doDoki = () => {
      if (state.websocket != null) {
        state.websocket.send(JSON.stringify(
          {
            type: "doki"
          }
        ))
        console.log("doki")
        setTimeout(state.outCalls.doDoki
          , 5000)
      }
    }
  },
  methods: {
    connectReact() {
      if (state.websocket != null) {
        state.inCalls.doMessage({
          message: "连接已存在，请勿重复点击",
          type: "warning"
        })
        return
      }

      state.userName = this.usernameInput
      console.log(state.userName)
      state.roomName = this.roomnameInput
      console.log(state.roomName)

      if (!(state.userName !== "" && state.userName !== "")) {
        state.inCalls.doMessage({
          message: "请正确输入用户名和房间",
          type: "warning"
        })
        return
      }


      state.websocket = new WebSocket("ws://123.57.200.185:8080/chat/" + state.roomName + "/" + state.userName)

      state.websocket.onerror = () => {
        WSResolver("error")(state)
      }

      state.websocket.onopen = () => {
        WSResolver("open")(state)
      }

      state.websocket.onclose = () => {
        WSResolver("close")(state)
      }

      state.websocket.onmessage = (event) => {
        console.log(event.data)
        let msg = JSON.parse(event.data)
        WSResolver(msg.type)(msg, state)
      }

    },

    showMessageReact(message) {
      this.chatMsgList.push(message)
    },

    sendReact() {
      if (state.desKey === null) {
        console.log("desKey not set")
        this.$message({
          message: "您尚未连接",
          type: "warning"
        })
      } else {
        state.outCalls.doSendSecure(this.textToSend)
        this.textToSend = ""
      }
    },

    lockReact() {
      if (state.joinLock === null) {
        state.joinLock = 1
        this.lockStr = "解锁"
      } else {
        state.joinLock = null
        this.lockStr = "上锁"
      }
    },

    leaveReact() {
      if (state.websocket === null) {
        this.$message({
          message: "您已断开连接，请勿重复点击",
          type: "warning"
        })
        return
      }
      state.websocket.close()
      this.chatMsgList = []
      state.websocket = null
      state.desKey = null
      state.rsaKey = null
    },

    noticeBoardReact(item) {
      console.log("看板变动")
      this.chNBVisi()
      this.$refs.NB.setHeadLine(item.headLine)
      this.$refs.NB.setContext(item.context)
    },

    chNBVisi() {
      this.NBVisi = this.NBVisi !== true;
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

function WSResolver(methodName) {
  const resolverTable = {
    "ask": askResolver,
    "answer": answerResolve,
    "speak": speakResolve,
    "open": openResolve,
    "close": closeResolve,
    "error": errorResolve,
    "notice": noticeResolve
  }
  return resolverTable[methodName]
}

const askResolver = (msg, state) => {
  if (state.desKey != null && state.joinLock === null) {
    let publicKey = msg.content
    let reply = {
      type: "answer",
      content: cryptico.encrypt(state.desKey, publicKey).cipher,
      senderName: msg.senderName
    }
    state.outCalls.doSend(JSON.stringify(reply))
  }
}

const answerResolve = (msg, state) => {
  if (msg.content === "master") {
    state.desKey = genDesKey(16)
    console.log("gen des " + state.desKey)
    state.inCalls.doMessage({
      message: "创建房间密钥",
      type: "success"
    })
    state.outCalls.doSendSecure("创建房间")
    state.outCalls.doDoki(state)
  } else {
    if (msg.senderName === state.userName) {
      state.desKey = cryptico.decrypt(msg.content, state.rsaKey).plaintext
      console.log("get des " + state.desKey)
      state.inCalls.doMessage({
        message: "成功加入房间",
        type: "success"
      })
      state.outCalls.doDoki(state)
    }
  }
}

const speakResolve = (msg, state) => {
  console.log(msg)
  if (state.desKey === null) console.log("desKey not set")
  else {
    let realMsg = {
      position: null,
      name: msg.senderName,
      content: decryptByDES(msg.content, state.desKey)
    }
    realMsg.position = msg.senderName === state.userName ? "left" : "right";
    state.inCalls.doShow(realMsg)
  }
}

const noticeResolve = (msg, state) => {
  console.log(msg)
  state.inCalls.doNotice(msg.content)
}

const errorResolve = (state) => {
  state.inCalls.doMessage({
    message: "连接错误，请刷新网页",
    type: "error"
  })
}

const openResolve = (state) => {
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
        state.outCalls.doSend(JSON.stringify(msg))
        console.log("gen rsa key and send")
        state.inCalls.doMessage({
          message: "发送密钥请求",
          type: "info"
        })
      } else {
        state.inCalls.doMessage({
          message: "您已创建房间 " + state.roomName,
          type: "success"
        })
      }
    }
    , 1000)
}

const closeResolve = (state) => {
  state.inCalls.doMessage({
    message: "连接关闭",
    type: "info"
  })
  setTimeout(
    () => {
      if (state.websocket === null)
        state.inCalls.doMessage({
          message: "您已离开房间",
          type: "success"
        })
    }
    , 1000)
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
  overflow-y: scroll;
}

#text-box {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.msg-item {
  display: flex;
  flex-direction: column;
}

.user-avatar {
  background-color: rgba(233, 233, 233, 0.8);
  margin: 5px;
}

.user-name {
  color: rgba(120, 180, 210, 0.8);
  position: relative;
  padding: 5px 0 5px 5px;
}

.msg-item-text {
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

.base-input {
  width: 12%;
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
