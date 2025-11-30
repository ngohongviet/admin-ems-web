import React, { useState } from 'react';
import {
  DesktopOutlined,
  TeamOutlined,
  ShopOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom'; // Import thêm cái này

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

// Đổi key thành đường dẫn để dễ chuyển trang
const items = [
  getItem('Thống kê', '/dashboard', <DesktopOutlined />),
  getItem('Quản lý Nhân viên', '/employees', <TeamOutlined />),
  getItem('Quản lý Chi nhánh', '/branches', <ShopOutlined />),
  getItem('Cá nhân', '/profile', <UserOutlined />),
  getItem('Đăng xuất', 'logout', <LogoutOutlined />),
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  const navigate = useNavigate(); // Hàm dùng để chuyển trang

  // Xử lý khi bấm menu
  const onMenuClick = (e) => {
    if (e.key === 'logout') {
        navigate('/'); // Về trang Login
    } else {
        navigate(e.key); // Chuyển đến trang tương ứng
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: 'white', lineHeight: '32px', fontWeight: 'bold' }}>
           EMS ADMIN
        </div>
        <Menu 
            theme="dark" 
            defaultSelectedKeys={['/dashboard']} 
            mode="inline" 
            items={items} 
            onClick={onMenuClick} // Bắt sự kiện bấm
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, textAlign: 'right', paddingRight: 20 }}>
           <span style={{ marginRight: 10, fontWeight: 'bold' }}>Xin chào, Admin!</span>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, marginTop: 16, borderRadius: 8 }}>
            
            {/* QUAN TRỌNG: Outlet là cái lỗ để nhét nội dung các trang con vào */}
            <Outlet />

          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>EMS System ©2025 Created by Viet</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;