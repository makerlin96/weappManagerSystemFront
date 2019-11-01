<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">登 录</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
          name="username"
          size="detault"
          type="text"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          name="password"
          size="detault"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input
          ref="captcha"
          v-model="loginForm.captcha"
          placeholder="请输入验证码"
          prefix-icon="el-icon-circle-check"
          name="captcha"
          size="detault"
          style="width: 65%"
          @keyup.enter.native="handleLogin"
        />
        <el-image
          class="captcah-img"
          :src="captchaPath"
          @click="getCaptcha()"
        />
      </el-form-item>
      <el-button :loading="loading" size="detault" type="primary" class="login-btn" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
// import { getCaptchaImg } from '@/api/login'

export default {
  name: 'Login',
  data() {
    return {
      captchaPath: '',
      loginForm: {
        username: 'admin',
        password: '123456',
        captcha: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCaptcha()
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      this.captchaPath = process.env.VUE_APP_BASE_API + '/captcha?t=' + Math.random()
      // getCaptchaImg().then(res => {
      //   this.captchaPath = res.img
      // })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.getCaptcha()
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.login-container {
  min-height: 100%;
  width: 100%;
  background-image: url(~@/assets/images/login-bg.jpg);
  background-size: cover;
  overflow: hidden;

  .login-form {
    padding: 25px;
    background: #ffffff;
    position: relative;
    width: 360px;
    max-width: 100%;
    margin: 10% 10px 10px 62%;
    overflow: hidden;
    border-radius: 5px;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: #5f5f5f;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .captcah-img {
    width: 100px;
    height: 40px;
    margin-left: 8px;
    position: absolute;
    cursor: pointer;
  }
  .login-btn {
    width: 100%;
    margin: 20px 0px 10px 0px;
  }
}
</style>
