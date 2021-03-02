<template>
  <div class="login-container">
    <van-form ref="loginForm"
              class="login-form">

      <div class="title-container">
        <h3 class="title">尊百福账单查询</h3>
      </div>

      <div class="field-container">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <van-field ref="userName"
                   v-model="loginForm.userName"
                   name="用户名"
                   placeholder="用户名" />
      </div>

      <div class="field-container">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <van-field :key="passwordType"
                   ref="password"
                   v-model="loginForm.password"
                   :type="passwordType"
                   name="密码"
                   placeholder="密码"
                   :right-icon="passwordType === 'password' ? 'closed-eye' : 'eye-o'"
                   field-icon-size="28px"
                   @click-right-icon="showPwd" />
      </div>
      <div class="verify-code-container">
        <van-field ref="verifyCode"
                   v-model="loginForm.verifyCode"
                   placeholder="验证码"
                   name="verifyCode"
                   type="text"
                   tabindex="3"
                   auto-complete="on"
                   @keyup.enter.native="handleLogin">
          <template #extra>
            <span class="verify-code">
              <img :src="verifyCodePic"
                   @click="onRefresh">
            </span>
          </template>

        </van-field>

      </div>
      <van-button :loading="loading"
                  type="info"
                  style="width:100%;margin-bottom:30px;"
                  @click.native.prevent="handleLogin">登录</van-button>

    </van-form>
  </div>
</template>

<script>
import { verifyCode } from 'login'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        userName: 'root',
        password: '123456',
        uuid: '',
        verifyCode: ''
      },
      verify: '',
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    verifyCodePic() {
      const objectUrl = 'data:image/png;base64,' + this.verify
      return objectUrl
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
  mounted() {
    this.onRefresh()
  },
  methods: {
    async onRefresh() {
      const codeRes = await verifyCode()
      this.verify = codeRes.data.base64Img
      this.loginForm.uuid = codeRes.data.uuid
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.loading = true
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        this.$router.push({ path: this.redirect || '/' })
        this.loading = false
      }).catch(() => {
        this.onRefresh()
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  .van-field {
    position: relative;
    display: inline-block;
    height: 47px;
    width: 85%;
    background: $bg;
    color: #fff;
    .van-field__control {
      color: $light_gray;
    }
    .van-field__right-icon {
      margin-right: -20px;
      margin-top: 4px;
    }
  }
  .van-icon {
    font-size: 20px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .field-container {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .verify-code-container {
    margin-bottom: 10px;
    .verify-code {
      position: absolute;
      right: 0;
      bottom: 0px;
    }
  }

  .svg-container {
    /* padding: 6px 5px 6px 15px; */
    display: flex;
    justify-content: center;
    align-items: center;
    color: $dark_gray;
    width: 30px;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 18px;
    top: 18px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
