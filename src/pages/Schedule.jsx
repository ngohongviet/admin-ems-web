import React, { useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, List, Tag, Avatar, Typography, Space } from 'antd';
import { CalendarOutlined, ExportOutlined, UserOutlined, ClockCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Schedule = () => {
  // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  // Danh sách lịch làm việc giống hệt Figma
  const scheduleData = [
    {
      id: 1,
      shiftName: 'Ca 1',
      time: '06:00 - 12:00',
      employees: ['Nguyễn Ngọc Phát', 'Võ Văn Phú', 'Mai Thị Yến', 'Trần Văn A', 'Lê Thị B'],
      color: 'gold' // Màu vàng nhạt giống figma
    },
    {
      id: 2,
      shiftName: 'Ca 2',
      time: '12:00 - 18:00',
      employees: ['Nguyễn Ngọc Phát', 'Võ Văn Phú', 'Mai Thị Yến', 'Phạm Thị Thu Thảo'],
      color: 'orange'
    },
    {
      id: 3,
      shiftName: 'Ca 3',
      time: '18:00 - 22:00',
      employees: ['Nguyễn Ngọc Phát', 'Phạm Thị Thu Thảo'],
      color: 'purple'
    },
    {
      id: 4,
      shiftName: 'Full-time 1',
      time: '06:00 - 18:00',
      employees: ['Nguyễn Ngọc Phát', 'Võ Văn Phú'],
      color: 'cyan'
    },
  ];

  return (
    <div style={{ height: '100%' }}>
      {/* HEADER: BỘ LỌC */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Space size="large">
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>Lịch làm việc</Title>
            <Button icon={<ExportOutlined />}>Xuất CSV</Button>
        </Space>
      </div>

      <Card bordered={false} style={{ borderRadius: 8 }}>
        {/* THANH CÔNG CỤ TRÊN CÙNG */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
            <Space>
                <Select defaultValue="Bí đỏ Coffee" style={{ width: 150 }} options={[{ value: 'Bí đỏ Coffee', label: 'Bí đỏ Coffee' }]} />
                <DatePicker defaultValue={dayjs()} format="DD/MM/YYYY" style={{ width: 140 }} />
                <Select defaultValue="all" style={{ width: 120 }} options={[{ value: 'all', label: 'Tất cả ca' }]} />
            </Space>

            <Space>
                <Button>Hôm nay</Button>
                <Button icon={<LeftOutlined />} />
                <Button icon={<RightOutlined />} />
            </Space>
        </div>

        {/* BẢNG LỊCH LÀM VIỆC (Custom List) */}
        <div style={{ background: '#E6F7FF', padding: '10px 20px', borderRadius: '8px 8px 0 0', fontWeight: 'bold', display: 'flex' }}>
            <div style={{ width: '20%' }}>Ca làm việc</div>
            <div style={{ width: '25%' }}>Giờ làm việc</div>
            <div style={{ flex: 1 }}>Nhân viên</div>
        </div>

        <List
            itemLayout="horizontal"
            dataSource={scheduleData}
            renderItem={(item) => (
                <div style={{ 
                    display: 'flex', 
                    padding: '20px', 
                    borderBottom: '1px solid #f0f0f0',
                    alignItems: 'center',
                    background: '#fff'
                }}>
                    {/* Tên Ca */}
                    <div style={{ width: '20%' }}>
                        <Title level={5} style={{ margin: 0 }}>{item.shiftName}</Title>
                    </div>

                    {/* Giờ làm */}
                    <div style={{ width: '25%', fontSize: 16 }}>
                        <ClockCircleOutlined style={{ marginRight: 8, color: '#999' }} />
                        {item.time}
                    </div>

                    {/* Danh sách nhân viên (Tags) */}
                    <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {item.employees.slice(0, 3).map((emp, index) => ( // Chỉ hiện 3 người đầu
                            <Tag key={index} color={item.color} style={{ padding: '4px 10px', fontSize: 13, borderRadius: 15, border: 'none' }}>
                                <UserOutlined style={{ marginRight: 5 }} /> {emp}
                            </Tag>
                        ))}
                        
                        {/* Nếu quá 3 người thì hiện nút xem thêm */}
                        {item.employees.length > 3 && (
                            <Tag style={{ padding: '4px 10px', fontSize: 13, borderRadius: 15, cursor: 'pointer' }}>
                                +{item.employees.length - 3} Xem thêm
                            </Tag>
                        )}
                    </div>
                </div>
            )}
        />
      </Card>
    </div>
  );
};

export default Schedule;