<template>
  <div id="NoticeBoard">
    <div id="main" >
      <h1 class="headLine" v-text="headLine">
      </h1>
      <div class="context" v-text="context"></div>
      <el-button v-on:click="close" style="font-size: 30px;margin-top: 30px">已阅</el-button>
    </div>

  </div>

</template>

<script>
export default {
  name: "NoticeBoard",
  data() {
    return {
      headLine: "这里是标题",
      context: "这里是内容",
    }
  },
  methods: {
    setHeadLine(h) {
      this.headLine = h;
    },
    setContext(c) {
      this.context = c;
    },
    close(){
      console.log("关闭看板")
      this.$emit("chHandler")
    }
  }
}
</script>

<style>
#NoticeBoard{
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
}

#main{
  text-align: center;
  background-color: aliceblue;
  opacity: 0.6;
  margin: 10% 20% 10% 20%;
  overflow-y: auto;
  border-radius: 10px;
  max-height: 45%;
  padding: 0 50px 50px 50px;
  font-size: 30px;
}

</style>
