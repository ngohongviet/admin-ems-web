import React, { useState, useEffect } from 'react';
import { Card, Col, Row, List, Avatar, Select, Typography, Tag, Popover, Button, Badge } from 'antd';
import { UserOutlined, ShopOutlined, ClockCircleOutlined, BellOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';

const { Title, Text } = Typography;

const Dashboard = () => {
  // --- 1. STATE CHỨA DỮ LIỆU THẬT ---
  const [stats, setStats] = useState({
    employeeCount: 0,
    branchCount: 0,
    shiftCount: 0
  });

  // --- 2. DỮ LIỆU GIẢ CHO BIỂU ĐỒ ---
  const barData = [
    { name: 'T2', partTime: 4, fullTime: 2 },
    { name: 'T3', partTime: 3, fullTime: 4 },
    { name: 'T4', partTime: 6, fullTime: 3 },
    { name: 'T5', partTime: 5, fullTime: 4 },
    { name: 'T6', partTime: 7, fullTime: 5 },
    { name: 'T7', partTime: 9, fullTime: 6 },
    { name: 'CN', partTime: 10, fullTime: 7 },
  ];

  const pieData = [
    { name: 'Sáng', value: 400 },
    { name: 'Chiều', value: 300 },
    { name: 'Tối', value: 300 },
    { name: 'Full-time', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const lineData = [
    { name: '5/25', late: 1 },
    { name: '6/25', late: 4 },
    { name: '7/25', late: 3 },
    { name: '8/25', late: 6 },
    { name: '9/25', late: 4 },
    { name: '10/25', late: 5 },
  ];

  const topEmployees = [
    { name: 'Nguyễn Thị Lan', id: '00001', hours: 208 },
    { name: 'Trần Văn B', id: '00002', hours: 206 },
    { name: 'Lê Thị C', id: '00003', hours: 200 },
  ];

  const todayShifts = [
    { name: 'Nguyễn Thị Hoa', id: '00001', shift: 'Ca 1', status: 'Đúng giờ', color: 'green' },
    { name: 'Nguyễn Thị Lan', id: '00002', shift: 'Ca 2', status: 'Đi muộn', color: 'orange' },
    { name: 'Nguyễn Thị Cúc', id: '00003', shift: 'Ca 1', status: 'Vắng', color: 'red' },
  ];

  // --- 3. DỮ LIỆU THÔNG BÁO GIỐNG FIGMA ---
  const notifications = [
    {
      id: 1,
      title: 'Chat',
      description: 'Thu ngân: Có 2 tin nhắn mới',
      time: '2 hours ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      unread: false,
    },
    {
      id: 2,
      title: 'Ca làm',
      description: 'Nguyễn Thị Lan đã đăng ký ca làm mới',
      time: '3 hours ago',
      avatar: null, // Dùng icon mặc định
      type: 'shift',
      unread: true,
    },
    {
      id: 3,
      title: 'Ca làm',
      description: 'Nguyễn Thị Lan đã hủy đăng ký ca làm',
      time: '3 hours ago',
      avatar: null,
      type: 'shift',
      unread: true,
    },
    {
      id: 4,
      title: 'Lịch làm việc',
      description: 'Đã cập nhật lịch làm việc mới',
      time: '2 days ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
      unread: false,
    },
     {
      id: 5,
      title: 'Chat',
      description: 'Pha chế: Cần xin nghỉ phép',
      time: '3 days ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      unread: false,
    },
  ];

  // --- 4. GỌI API LẤY SỐ LIỆU ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = 'https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1';

        const [empRes, branchRes, shiftRes] = await Promise.all([
          axios.get(`${baseUrl}/employees`, { headers }),
          axios.get(`${baseUrl}/branches`, { headers }),
          axios.get(`${baseUrl}/shifts`, { headers })
        ]);

        setStats({
          employeeCount: empRes.data.length || 0,
          branchCount: branchRes.data.length || 0,
          shiftCount: shiftRes.data.length || 0
        });

      } catch (error) {
        console.error("Lỗi lấy data:", error);
      }
    };
    fetchStats();
  }, []);

  // Custom Label cho Donut Chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // --- NỘI DUNG POPOVER THÔNG BÁO ---
  const notificationContent = (
    <div style={{ width: 300 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text strong>THÔNG BÁO</Text>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
            <List.Item.Meta
              avatar={
                item.avatar ? <Avatar src={item.avatar} /> : 
                <Avatar style={{ backgroundColor: '#52c41a' }}>L</Avatar> // Giả lập avatar chữ L màu xanh
              }
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.title}</span>
                    {item.unread && <Badge status="success" />} 
                </div>
              }
              description={
                <div>
                    <div style={{ fontSize: 12, color: '#333' }}>{item.description}</div>
                    <div style={{ fontSize: 10, color: '#999' }}>{item.time}</div>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Button type="link">Xem thêm</Button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 0 }}>
      {/* HEADER VỚI CHUÔNG THÔNG BÁO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Title level={4} style={{ margin: 0 }}>Tổng quan hệ thống</Title>
            <Select defaultValue="Tất cả chi nhánh" style={{ width: 150 }} options={[{ value: 'all', label: 'Tất cả chi nhánh' }]} />
        </div>
        
        {/* POPOVER BỌC CÁI CHUÔNG */}
        <Popover content={notificationContent} trigger="click" placement="bottomRight">
            <Badge count={2} size="small"> {/* Số 2 đỏ đỏ trên cái chuông */}
                <BellOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
            </Badge>
        </Popover>
      </div>

      {/* 3 CARD THỐNG KÊ */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div style={{ background: '#E6F7FF', padding: 12, borderRadius: '50%' }}><UserOutlined style={{ fontSize: 24, color: '#1890FF' }} /></div>
                <div>
                    <Text type="secondary">Tổng Nhân viên</Text>
                    <Title level={3} style={{ margin: 0 }}>{stats.employeeCount}</Title>
                </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div style={{ background: '#FFF0F6', padding: 12, borderRadius: '50%' }}><ShopOutlined style={{ fontSize: 24, color: '#EB2F96' }} /></div>
                <div>
                    <Text type="secondary">Số Chi nhánh</Text>
                    <Title level={3} style={{ margin: 0 }}>{stats.branchCount}</Title>
                </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div style={{ background: '#E6FFFB', padding: 12, borderRadius: '50%' }}><ClockCircleOutlined style={{ fontSize: 24, color: '#13C2C2' }} /></div>
                <div>
                    <Text type="secondary">Ca làm việc</Text>
                    <Title level={3} style={{ margin: 0 }}>{stats.shiftCount}</Title>
                </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* BIỂU ĐỒ */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={10}>
            <Card title="Thống kê Ca làm (Tuần)" bordered={false} style={{ borderRadius: 10, height: '100%' }}>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="partTime" fill="#3b4dcf" name="Part-time" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="fullTime" fill="#24e3c9" name="Full-time" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </Col>
        <Col span={7}>
            <Card title="Phân bố ca làm" bordered={false} style={{ borderRadius: 10, height: '100%' }}>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" label={renderCustomizedLabel} labelLine={false}>
                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend layout="vertical" align="left" verticalAlign="middle" iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </Col>
        <Col span={7}>
            <Card title="Xu hướng đi trễ" bordered={false} style={{ borderRadius: 10, height: '100%' }}>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={10} />
                        <YAxis hide />
                        <Tooltip />
                        <Line type="monotone" dataKey="late" stroke="#ffc107" strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </Col>
      </Row>

      {/* DANH SÁCH */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={10}>
            <Card title="Nhân viên xuất sắc" bordered={false} style={{ borderRadius: 10 }}>
                <List itemLayout="horizontal" dataSource={topEmployees} renderItem={(item) => (
                    <List.Item actions={[<a key="view">Chi tiết</a>]}>
                        <List.Item.Meta avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`} />} title={item.name} description={<span style={{ color: '#1890ff' }}>ID: {item.id}</span>} />
                        <div>
                            <div style={{ fontSize: 12, color: '#999' }}>Tổng giờ</div>
                            <div style={{ fontWeight: 'bold' }}>{item.hours}h</div>
                        </div>
                    </List.Item>
                )} />
            </Card>
        </Col>
        <Col span={14}>
            <Card title="Trạng thái chấm công hôm nay" bordered={false} style={{ borderRadius: 10 }}>
                 <List itemLayout="horizontal" dataSource={todayShifts} renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />} title={item.name} description={`Mã NV: ${item.id}`} />
                        <div style={{ marginRight: 50 }}>{item.shift}</div>
                        <Tag color={item.color}>{item.status}</Tag>
                        <a style={{ marginLeft: 20 }}>Xem</a>
                    </List.Item>
                )} />
            </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;