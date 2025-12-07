import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log("🚀 Đang đăng nhập...");
      
      const response = await axios.post('https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/auth/login', {
        email: values.email,
        password: values.password
      });

      console.log("✅ Server trả về:", response.data);

      // --- SỬA LỖI: Lấy đúng accessToken trong data ---
      // Dựa vào ảnh bạn gửi: Token tên là accessToken và nằm trong obj data
      const token = response.data.data?.accessToken || response.data.accessToken || response.data.token;

      if (token) {
        console.log("🔑 ĐÃ LẤY ĐƯỢC TOKEN:", token);
        
        // Xóa sạch Token cũ và lưu Token mới
        localStorage.clear();
        localStorage.setItem('token', token);

        message.success('Đăng nhập thành công!');
        navigate('/dashboard'); 
      } else {
        console.error("❌ Vẫn không thấy Token đâu!", response.data);
        message.error('Lỗi: Server trả về thành công nhưng không có Token!');
      }

    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      message.error('Đăng nhập thất bại! Kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={3} style={{ color: '#1890ff' }}>EMS Admin</Title>
          <Text type="secondary">Quản lý nhân sự</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ 
            remember: true,
            email: 'admin@ems.com', 
            password: 'Admin@123' 
          }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item name="email" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;