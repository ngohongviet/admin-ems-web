import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Button, Avatar, Upload, message, Row, Col, Typography } from 'antd';
import { UserOutlined, UploadOutlined, EnvironmentOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Profile = () => {
  const [loading, setLoading] = useState(false);

  // --- TAB 1: THÔNG TIN CÁ NHÂN ---
  const PersonalInfo = () => {
    const onFinish = (values) => {
      setLoading(true);
      // Giả lập gọi API mất 1 giây
      setTimeout(() => {
        setLoading(false);
        message.success('Cập nhật thông tin thành công!');
      }, 1000);
    };

    return (
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: 'Phan Mỹ Linh',
          address: 'Văn phòng công ty',
          email: 'admin@workio.com.vn',
          city: 'Thành phố Hồ Chí Minh, Việt Nam',
          role: 'Admin'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
            <div style={{ position: 'relative', marginRight: 20 }}>
                <Avatar size={100} src="https://api.dicebear.com/7.x/people/svg?seed=Linh" />
                <Upload showUploadList={false}>
                    <Button 
                        type="primary" 
                        shape="circle" 
                        icon={<UploadOutlined />} 
                        size="small" 
                        style={{ position: 'absolute', bottom: 0, right: 0 }} 
                    />
                </Upload>
            </div>
            <div>
                <Title level={4} style={{ margin: 0 }}>Phan Mỹ Linh</Title>
                <div style={{ color: '#888' }}>Administrator</div>
            </div>
        </div>

        <Row gutter={24}>
            <Col span={12}>
                <Form.Item name="name" label="Tên">
                    <Input prefix={<UserOutlined />} size="large" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="address" label="Địa chỉ làm việc">
                    <Input prefix={<EnvironmentOutlined />} size="large" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="email" label="Email">
                    <Input prefix={<MailOutlined />} size="large" disabled /> 
                </Form.Item>
            </Col>
             <Col span={12}>
                <Form.Item name="city" label="Tỉnh / Thành phố">
                    <Input prefix={<EnvironmentOutlined />} size="large" />
                </Form.Item>
            </Col>
             <Col span={24}>
                <Form.Item name="role" label="Chức vụ">
                    <Input prefix={<SafetyCertificateOutlined />} size="large" disabled />
                </Form.Item>
            </Col>
        </Row>

        <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ minWidth: 120 }}>
                Save
            </Button>
        </div>
      </Form>
    );
  };

  // --- TAB 2: ĐỔI MẬT KHẨU ---
  const ChangePassword = () => {
    const onFinish = (values) => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        }, 1000);
    };

    return (
       <Form layout="vertical" onFinish={onFinish}>
            <Title level={5} style={{ marginBottom: 20 }}>Thay đổi mật khẩu</Title>
            
            <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true }]}>
                <Input.Password size="large" placeholder="••••••••" />
            </Form.Item>

            <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 6 }]}>
                <Input.Password size="large" placeholder="••••••••" />
            </Form.Item>
            
            <Form.Item 
                name="confirmPassword" 
                label="Xác nhận mật khẩu" 
                dependencies={['newPassword']}
                rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu không khớp!'));
                        },
                    }),
                ]}
            >
                <Input.Password size="large" placeholder="••••••••" />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 10 }}>
                <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ minWidth: 120 }}>
                    Save
                </Button>
            </div>
       </Form>
    );
  };

  // --- CẤU TRÚC TAB ---
  const items = [
    { key: '1', label: 'Thông tin cá nhân', children: <PersonalInfo /> },
    { key: '2', label: 'Mật khẩu', children: <ChangePassword /> },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
       <Title level={3} style={{ marginBottom: 20 }}>Hồ sơ cá nhân</Title>
       <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Tabs defaultActiveKey="1" items={items} />
       </Card>
    </div>
  );
};

export default Profile;