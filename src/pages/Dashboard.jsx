import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, ShopOutlined, ClockCircleOutlined, RiseOutlined } from '@ant-design/icons';

const Dashboard = () => (
  <div>
    <h2 style={{ marginBottom: 20 }}>Tổng quan hệ thống</h2>
    
    <Row gutter={16}>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Tổng Nhân viên"
            value={45}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Số Chi nhánh"
            value={3}
            prefix={<ShopOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Ca làm việc"
            value={12}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Tỉ lệ đi làm"
            value={98.5}
            precision={1}
            suffix="%"
            prefix={<RiseOutlined />}
          />
        </Card>
      </Col>
    </Row>

    <div style={{ marginTop: 20, padding: 20, background: '#fff', borderRadius: 8 }}>
        <h3>Biểu đồ tăng trưởng (Demo)</h3>
        <div style={{ height: 200, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            [Khu vực hiển thị biểu đồ chấm công]
        </div>
    </div>
  </div>
);

export default Dashboard;