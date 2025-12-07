import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { 
  UserOutlined, 
  DashboardOutlined, 
  ShopOutlined, 
  ClockCircleOutlined, 
  LogoutOutlined,
  MessageOutlined,
  CalendarOutlined,
  IdcardOutlined // ✅ 1. Thêm icon thẻ ID cho đẹp (hoặc dùng lại UserOutlined)
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom'; 

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: '#fff', lineHeight: '32px', fontWeight: 'bold' }}>
          EMS ADMIN
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={['/dashboard']}
          onClick={({ key }) => navigate(key)}
          items={[
            { key: '/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
            { key: '/employees', icon: <UserOutlined />, label: 'Nhân viên' },
            { key: '/branches', icon: <ShopOutlined />, label: 'Chi nhánh' },
            { key: '/shifts', icon: <ClockCircleOutlined />, label: 'Ca làm việc' },
            { key: '/schedule', icon: <CalendarOutlined />, label: 'Lịch làm việc' },
            { key: '/chat', icon: <MessageOutlined />, label: 'Chat nội bộ' }, 

            // ✅ 2. Thêm mục CÁ NHÂN vào cuối cùng
            { key: '/profile', icon: <IdcardOutlined />, label: 'Cá nhân' }, 
          ]} 
        />
      </Sider>
      
      <Layout>
        <Header style={{ padding: '0 20px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Header>
        
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
            {/* Chỗ này để nội dung trang con hiện ra */}
            <Outlet /> 
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;