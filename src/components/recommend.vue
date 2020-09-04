<template>
  <div class="content">
    <div v-if="!dialogShow" class="content-wrap">
      <div class="logo"></div>
      <div class="wrap">
        <input type="text" v-model="name" placeholder="姓名" maxlength="10"/>
      </div>
      <div class="wrap">
        <input type="text" v-model="phone" placeholder="手机号" maxlength="11"/>
      </div>
      <div class="wrap">
        <input type="text" class="c-input" v-model="code" placeholder="验证码" maxlength="4"/>
        <span v-if="codeSt == 1" class="blue-btn dis">{{ codeText }}</span>
        <span v-else class="blue-btn" @click="getCode">{{ codeText }}</span>
      </div>
      <div class="r-tit"><span>推荐人(选填)</span></div>
      <div class="wrap">
        <input type="text" v-model="recommenderName" placeholder="推荐人姓名" maxlength="10"/>
      </div>
       <div class="wrap">
        <input type="text" v-model="recommenderPhone" placeholder="推荐人手机号" maxlength="11"/>
      </div>

      <span v-if="buttonSt" class="sub-btn" @click="submitFn">提交</span>
      <span v-else class="sub-btn dis">提交</span>

      <p class="msg-error" v-if="error != ''">{{ error }}</p>
    </div>

    <div class="dialog-box" v-else>
      <div class="d-main" v-if="success">
        <i class="s-icon"></i>
        <span>恭喜您，注册成功！</span>
      </div>
      <div class="d-main" v-if="exist">
        <i class="w-icon"></i>
        <span>您已经注册过松赞会员！</span>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'recommend',
  data  ()  {
    return  {
      name: '',
      phone: '',
      code: '',
      codeText: '获取验证码',
      codeSt: 0,
      recommenderName: '',
      recommenderPhone: '',
      buttonSt: false,
      dialogShow: false,
      success: false,
      exist: false,
      error: '',
      checkPhone: /^1[34578]\d{9}$/
    }
  },
  watch:{
    'error':function(){
      let _this = this
      if(_this.error != ''){
        setTimeout(function(){
          _this.error = ''
        }, 1000)
      }
    },
    'code':function(){
      let _this = this
      if(_this.code.length == 4){
        this.buttonSt = true
      }
    }
  },
  methods: {
    getCode () {
      let _this = this
      // 校验输入的手机号
      if(!this.checkPhone.test(this.phone)){
        this.error = '请您正确填写注册手机号'
        return false
      }
      // 发送按钮倒计时
      let time = 60
      _this.codeSt = 1
      _this.codeText = `已发送(${time}s)`
      let timer = setInterval(function(){
        time--
        _this.codeText = `已发送(${time}s)`
        if(time == 0){
          clearInterval(timer)
          _this.codeText = `重新发送`
          _this.codeSt = 2
        }
      },1000)
      window.Axios.get('http://localhost:8085/api/member/register/captcha/' + this.phone).then(function (response) {
        if(response.data.code == 0){
          _this.error = '验证码已发送成功'
        }else{
          _this.error = '验证码发送失败'
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    submitFn () {
      // 手机号校验
      let _this = this
      if(!this.checkPhone.test(this.phone)){
        this.error = '请您正确填写注册手机号'
        return false
      }
      if(((this.recommenderName!=''&&this.recommenderName!=undefined)||(this.recommenderPhone!=''&&this.recommenderPhone!=undefined))&&!this.checkPhone.test(this.recommenderPhone)){
         this.error = '请您正确填写推荐人手机号'
        return false
      }
      // 提交参数
      let params = {
        name: this.name,
        phone: this.phone,
        smsCode: this.code,
        recommenderName: this.recommenderName,
        recommenderPhone: this.recommenderPhone
      }
      window.Axios.post('/api/member/register',params).then(function (response) {
        console.log(response);
        if(response.data.code == 0) {
          _this.dialogShow = true
          _this.success = true
        }else if(response.data.code == 300) {
          _this.dialogShow = true
          _this.exist = true
        }else if(response.data.code == 800) {
            _this.error = '验证码错误,请重试'
        }else {
          _this.error = '注册失败，请稍后重试'
        }
      }).catch(function (error) {
          _this.error = '注册失败，请稍后重试'
      });
    }
  }
}
</script>

<style lang="less" scoped>
  .msg-error {
    width: 505px;
    margin: 0 auto;
    text-align: left;
    color: red;
    line-height: 30px;
    font-size: 24px;
    padding-top: 20px;
    border-radius: 10px;
  }
  .content {
    .content-wrap{
      padding-top: 150px;
      box-sizing: border-box;
      background: url('../assets/images/bg-1.jpg') no-repeat bottom center #3464b5;
      background-size: 100% auto;
      min-height: 100vh;
    }
    .logo{
      width: 126px;
      height: 126px;
      display: block;
      margin: 0 auto 65px;
      background: url('../assets/images/logo.png') no-repeat center center;
      background-size: 100% auto;
    }
    .r-tit{
      padding: 50px 0 30px;
      color: #fff;
      span{
        display: inline-block;
        font-size: 28px;
        border-bottom: 1px solid #cbdcf3;
        line-height: 45px;
      }
    }
    .wrap{
      border-bottom: 1px solid #cbdcf3;
      overflow: hidden;
      padding-bottom: 1px;
      width: 505px;
      margin: 0 auto 30px;
    }
    input {
      width: 505px;
      height: 80px;
      font-size: 28px;
      line-height: 80px;
      color: #666;
      border: 0;
      box-sizing: border-box;
      outline: none;
      background: none;
      color: #fff;
      &::-moz-placeholder { color: #fff; }
      &::-webkit-input-placeholder { color:#fff; }
      &:-ms-input-placeholder { color:#fff; }
    }
    .c-input{
      width: 250px;
      float: left;
    }
    .blue-btn{
      width: 160px;
      height: 50px;
      line-height: 55px;
      text-align: center;
      color: #fff;
      border-radius: 8px;
      background: #3e5ab5;
      float: right;
      font-size: 20px;
      margin-top: 15px;
      &.dis{
        background: #a1a3a6;
      }
    }
    .sub-btn{
      display: block;
      width: 505px;
      text-align: center;
      line-height: 80px;
      border-radius: 40px;
      background: #3a54a7;
      color: #fff;
      font-size: 30px;
      margin: 50px auto 0;
      &.dis{
        background: #a1a3a6;
      }
    }
  }
  .dialog-box{
    .d-main{
      text-align: center;
      padding-top: 240px;
      font-size: 37px;
      color: #9d9d9d;
      i{
        width: 153px;
        height: 153px;
        display: block;
        margin: 0 auto 35px;
      }
      .s-icon{
        background: url('../assets/images/s_icon.png') no-repeat center center;
        background-size: 100% auto;
      }
      .w-icon{
        background: url('../assets/images/w_icon.png') no-repeat center center;
        background-size: 100% auto;
      }
    }
  }
</style>
