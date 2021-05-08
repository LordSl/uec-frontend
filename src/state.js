const incorrectCall = ()=>{
  console.log("方法未初始化")
}
export default {
  websocket: null,
  desKey: null,
  rsaKey: null,
  userName: null,
  roomName: null,
  joinLock: null,
  legalCall:{
    doSend:incorrectCall,
    doShow:incorrectCall,
    doMessage:incorrectCall,
  },
}
