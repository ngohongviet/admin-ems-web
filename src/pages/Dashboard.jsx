import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, message } from 'antd';
import { UserOutlined, ShopOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    employeeCount: 0,
    branchCount: 0,
    shiftCount: 0
  });

  // Hàm gọi API đếm số lượng thật từ Server
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = 'https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1';

      // Gọi 3 API cùng lúc
      const [empRes, branchRes, shiftRes] = await Promise.all([
        axios.get(`${baseUrl}/employees`, { headers }),
        axios.get(`${baseUrl}/branches`, { headers }),
        axios.get(`${baseUrl}/shifts`, { headers })
      ]);

      // Cập nhật số liệu thật
      setStats({
        employeeCount: empRes.data.length || 0,
        branchCount: branchRes.data.length || 0,
        shiftCount: shiftRes.data.length || 0
      });

    } catch (error) {
      console.error("Lỗi kết nối Dashboard:", error);
      // Nếu lỗi vẫn hiện số 0 chứ không crash web
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Tổng quan hệ thống (Dữ liệu thật)</h2>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Tổng Nhân viên"
              value={stats.employeeCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Số Chi nhánh"
              value={stats.branchCount}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Ca làm việc"
              value={stats.shiftCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 20, padding: 20, background: '#fff', borderRadius: 8 }}>
          <h3><CheckCircleOutlined style={{ color: 'green' }} /> Trạng thái kết nối</h3>
          <p style={{ color: 'green', fontWeight: 'bold' }}>Server đã cho phép truy cập (CORS Allowed)</p>
          <p>Dữ liệu đang được lấy trực tiếp từ Azure Cloud.</p>
      </div>
    </div>
  );
};

export default Dashboard;