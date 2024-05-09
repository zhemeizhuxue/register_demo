import { Button, Table, Space, Form, Input, Row, Col, Popconfirm } from "antd"
import { useEffect, useState } from "react"
import { history } from "umi"
import EditDrawer from './EditDrawer'
import './index.css'

const Home = () => {
  const [userList, setUserList] = useState([])
  const [listData, setListData] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    getUserList()
  }, [])

  // 从localStorage读取用户列表数据
  const getUserList = () => {
    const arr = JSON.parse(localStorage.getItem('userList'))
    setUserList(arr)
    setListData(arr)
  }
  // 点击查询
  const onFinish = (values) => {
    const { name } = values
    if (name) {
      const arr = userList.filter(item => item.name === name)
      setListData(arr)
    }
  }
  // 点击重置
  const onReset = () => {
    form.resetFields()
    setListData(userList)
  }
  // 点击删除
  const onDelete = (record) => {
    if (record) {
      const index = userList.findIndex(item => item.uuid === record.uuid)
      userList.splice(index, 1)
      localStorage.setItem('userList', JSON.stringify(userList))
      getUserList()
    }
  }
  // 点击跳转注册页面
  const goRegister = () => {
    history.push('/register')
  }

  const columns = [
    {
      title: 'uuid',
      dataIndex: 'uuid',
      key: 'uuid',
    },
    {
      title: '昵称',
      dataIndex: 'nick',
      key: 'nick',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => text === 'male' ? '男' : '女',
    },
    {
      title: '身份证号码',
      dataIndex: 'idCard',
      key: 'idCard',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditDrawer data={record} refresh={getUserList} />
          <Popconfirm
            title="确定删除这条数据吗？"
            onConfirm={() => { onDelete(record) }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="warp-box">
      <Form
        form={form}
        name="search"
        colon={false}
        className="search-form"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="name" label="姓名" >
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={16}>
            <div style={{ textAlign: 'right' }}>
              <Space size="small">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={onReset}>
                  重置
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Form>
      <div style={{ marginBottom: '12px' }}>
        <Button type="primary" onClick={goRegister} >注册</Button>
      </div>
      <Table
        dataSource={listData}
        columns={columns}
        rowKey='uuid'
      />
    </div>
  )
}

export default Home