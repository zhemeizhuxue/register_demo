import { useState } from 'react'
import { Button, Drawer, Form, Input, Select } from 'antd'

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
const { Option } = Select;

const EditDrawer = (props) => {
  const { data = {}, refresh } = props
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm()

  const onOpen = () => {
    setOpen(true)
    form.setFieldsValue(data)
  }
  const onClose = () => {
    form.resetFields();
    setOpen(false)
  }
  // 点击修改
  const onFinish = (values) => {
    const userList = JSON.parse(localStorage.getItem('userList'))
    const params = {
      ...data,
      ...values
    }
    const index = userList.findIndex(item => item.uuid === params.uuid)
    userList[index] = params
    localStorage.setItem('userList', JSON.stringify(userList))
    setOpen(false)
    refresh()
  };

  return (
    <>
      <Button type="link" size="small" onClick={onOpen}>修改</Button>
      <Drawer title="修改用户信息" onClose={onClose} open={open} width={500}>
        <Form
          {...formItemLayout}
          form={form}
          name="update"
          onFinish={onFinish}
          scrollToFirstError
          colon={false}
          autoComplete='off'
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
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              修改
            </Button>
            <Button type="default" style={{ marginLeft: '10px' }} onClick={onClose}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default EditDrawer