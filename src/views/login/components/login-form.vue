<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form class="form" :validation-schema="mySchema" autocomplete="off" v-slot="{errors}"
      ref="formCom">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field name="account" v-model="form.account" type="text" placeholder="请输入用户名" />
            <div class="error" v-if="errors.account"><i
                class="iconfont icon-warning" />{{errors.account}}</div>
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field name="password" v-model="form.password" type="password" placeholder="请输入密码" />
            <div class="error" v-if="errors.password"><i
                class="iconfont icon-warning" />{{errors.password}}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field name="mobile" v-model="form.mobile" type="text" placeholder="请输入手机号" />
            <div class="error" v-if="errors.mobile"><i
                class="iconfont icon-warning" />{{errors.mobile}}</div>
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field name="code" v-model="form.code" type="password" placeholder="请输入验证码" />
            <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{errors.code}}
            </div>
            <span class="code" @click="send"> {{time===0?'发送验证码':`${time}后可重发`}}</span>
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">

          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import schema from '@/utils/vee-validate-schema'
import { Form, Field } from 'vee-validate'
import { onUnmounted, reactive, ref, watch } from 'vue'
import Message from '@/components/library/Message.js'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '../api/index'

export default {
  name: 'LoginForm',
  components: { Form, Field },
  props: {},
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const isMsgLogin = ref(false)

    // 表单对象数据
    const form = reactive({
      isAgree: true,
      account: 'xiaotuxian001',
      password: null,
      mobile: null,
      code: null
    })

    // 校验规则对象
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }


    // 1.切换表单元素，还原数据和清除校验效果
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 还原数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 补充校验效果清除，Form组件提供resetForm()
      formCom.value.resetForm()
    })


    // 2.发送验证码
    const time = ref(0)
    const send = async () => {
      const valid = schema.mobile(form.mobile)   //校验手机
      if (valid === true) { //通过 发验证码，改成60秒
        if (time.value === 0) {
          await userMobileLoginMsg(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }

      } else {
        //格式不对调用Vee Form实例方法提示
        formCom.value.setFieldError('mobile', valid)
      }



    }

    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) { pause() }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })

    // 3.登陆校验
    const login = async () => {
      let data
      const valid = await formCom.value.validate()
      if (valid) {
        try {
          if (!isMsgLogin.value) {//账号
            data = await userAccountLogin(form)
          } else {//验证码
            data = await userMobileLogin(form)
          }
        } catch (e) {
          Message({ type: 'error', text: e.response.data.message || '登录失败' })
        }


        // 1.存入store 本地
        const { id, account, nickname, avatar, token, mobile } = data.result
        store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
        // +合并购物车
        store.dispatch('cart/mergeLocalCart').then(res => {
          // 2.提示
          Message({ type: 'success', text: '登录成功' })
          // 3.跳转 :从哪来的跳回哪
          router.push(route.query.redirectUrl || '/')
        }).catch()


      }
    }

    return { isMsgLogin, form, mySchema, formCom, login, send, time }
  }
}
</script>

<style scoped lang='less'>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
.error {
  color: @priceColor;
}
</style>
