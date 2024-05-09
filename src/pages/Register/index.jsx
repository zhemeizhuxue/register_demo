import { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Popconfirm,
  message
} from 'antd';
import { generateUUID, generateCaptcha, getRandomColor } from '@/utils'
import { history } from 'umi'
import './index.css'

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
//真实姓名正则
const nameRegex = /^[\u4e00-\u9fa5]{2,10}$/;
//身份证正则
const cardRegex = /^[1-9]\d{5}(18|19|(\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[\dXx]$/;
//手机号正则
const phoneRegex = /^1[3-9][0-9]{9}$/;

const Register = () => {
  const [form] = Form.useForm()
  const [verifCode, setVerifCode] = useState('')

  useEffect(() => {
    createCaptcha()
  }, [])

  // 创建图形验证码
  const createCaptcha = () => {
    const canvas = document.getElementById('captchaCanvas');
    const context = canvas.getContext('2d');
    const captcha = generateCaptcha();
    setVerifCode(captcha)
    // 设置画布样式
    context.fillStyle = '#f5f5f5';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 24px Arial';
    context.fillStyle = '#333';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    // 绘制验证码文本
    context.fillText(captcha, canvas.width / 2, canvas.height / 2);
    // 绘制干扰线
    for (let i = 0; i < 6; i++) {
      context.strokeStyle = getRandomColor();
      context.beginPath();
      context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      context.stroke();
    }
    return captcha;
  }

  // 点击注册
  const onFinish = (values) => {
    const uuid = generateUUID()
    const params = {
      ...values,
      uuid
    }
    delete params.confirm
    delete params.verific
    const userList = JSON.parse(localStorage.getItem('userList'))
    if (Array.isArray(userList) && userList.length > 0) {
      const flag = userList.some(item => item.phone === params.phone)
      if (flag) {
        message.info('该手机号已经注册过了！')
      } else {
        userList.push(params)
        localStorage.setItem('userList', JSON.stringify(userList));
        message.success('恭喜你，注册成功！')
        history.push('/')
      }
    } else {
      const arr = []
      arr.push(params)
      localStorage.setItem('userList', JSON.stringify(arr));
      message.success('恭喜你，注册成功！')
      history.push('/')
    }
  };
  // 点击取消
  const confirm = () => {
    form.resetFields();
    //解决表单重置后把验证码也清空的bug
    // setTimeout(() => {
    //   createCaptcha()
    // }, 0)
    history.push('/')
  };

  return (
    <div className='box'>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        autoComplete='off'
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="nick"
          label="昵称"
          rules={[
            {
              required: true,
              message: '请输入昵称!',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder='请输入昵称' />
        </Form.Item>
        <Form.Item
          name="name"
          label="真实姓名"
          rules={[
            {
              required: true,
              message: '请输入姓名!',
            },
            () => ({
              validator(_, value) {
                if (value && !nameRegex.test(value)) {
                  return Promise.reject(new Error('请输入正确格式！'))
                }
                return Promise.resolve()
              }
            })
          ]}
        >
          <Input placeholder='请输入姓名' />
        </Form.Item>
        <Form.Item
          name="gender"
          label="性别"
          rules={[
            {
              required: true,
              message: '请选择性别!',
            },
          ]}
        >
          <Select placeholder="请选择">
            <Option value="male">男</Option>
            <Option value="female">女</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="idCard"
          label="身份证号码"
          rules={[
            {
              required: true,
              message: '请输入身份证号码!',
            },
            () => ({
              validator(_, value) {
                if (value && !cardRegex.test(value)) {
                  return Promise.reject(new Error('请输入正确格式！'))
                }
                return Promise.resolve()
              }
            })
          ]}
        >
          <Input placeholder='请输入身份证号码' />
        </Form.Item>
        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            {
              required: true,
              message: '请输入手机号!',
            },
            () => ({
              validator(_, value) {
                if (value && !phoneRegex.test(value)) {
                  return Promise.reject(new Error('请输入正确格式！'))
                }
                return Promise.resolve()
              }
            })
          ]}
        >
          <Input
            addonBefore="+86"
            style={{
              width: '100%',
            }}
            placeholder='请输入手机号'
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder='请输入密码' />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请再次输入密码!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入密码不相同，请检查!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder='请再次输入密码' />
        </Form.Item>
        <Form.Item
          name="verific"
          label="验证码"
          rules={[
            {
              required: true,
              message: '请输入验证码!',
            },
            () => ({
              validator(_, value) {
                if (value && value !== verifCode) {
                  return Promise.reject(new Error('验证码不正确！'))
                }
                return Promise.resolve()
              }
            })
          ]}
        >
          <Input
            addonAfter={<canvas id="captchaCanvas" width="120" height="30" className='canvas-box' onClick={createCaptcha}></canvas>}
            placeholder='请输入验证码'
          />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
          <Popconfirm
            title="确定取消注册吗？"
            description="这将导致所填写内容清空"
            onConfirm={confirm}
            okText="确定"
            cancelText="取消"
          >
            <Button type="default" className='cancel-btn'>
              取消
            </Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Register