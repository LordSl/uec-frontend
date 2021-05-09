const wrongCall = () => {
  console.log("方法未初始化")
}
export default {
  websocket: null,
  desKey: null,
  rsaKey: null,
  userName: null,
  roomName: null,
  joinLock: null,
  outCalls: {
    doSendSecure: wrongCall,//des加密后发送
    doSend: wrongCall,//明文发送
    doDoki: wrongCall,//发送心跳包
  },
  inCalls:{
    doNotice: wrongCall,//显示系统广播
    doShow: wrongCall,//显示解密后的密文
    doMessage: wrongCall,//显示消息提示
  }
}
