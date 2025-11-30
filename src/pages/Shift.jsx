import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, TimePicker } from 'antd';
import { PlusOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs'; // Thư viện xử lý giờ giấc

const Shift = () => {
  // --- STATE ---
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [form] = Form.useForm(); 

  // --- HÀM 1: LẤY DANH SÁCH CA LÀM ---
  const fetchShifts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/shifts', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Dữ liệu Ca làm:", response.data);
      setData(response.data); 
      message.success('Đã tải xong danh sách ca!');

    } catch (error) {
      console.error(error);
      message.error('Lỗi tải dữ liệu ca làm!');
      // Dữ liệu mẫu demo
      setData([
        { _id: '1', name: 'Ca Sáng', startTime: '08:00', endTime: '12:00' },
        { _id: '2', name: 'Ca Chiều', startTime: '13:00', endTime: '17:00' },
        { _id: '3', name: 'Ca Tối', startTime: '18:00', endTime: '22:00' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // --- HÀM 2: THÊM CA LÀM MỚI ---
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem('token');
        
        // Chuẩn bị dữ liệu: Chuyển đổi giờ từ TimePicker sang chuỗi "HH:mm" (Ví dụ: "08:00")
        const payload = {
            name: values.name,
            startTime: values.startTime.format('HH:mm'),
            endTime: values.endTime.format('HH:mm'),
        };

        // Gọi API
        await axios.post('https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/shifts', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        message.success('Thêm ca làm thành công!');
        setIsModalOpen(false);
        form.resetFields();
        fetchShifts(); 

      } catch (error) {
        console.error(error);
        message.error('Lỗi khi thêm ca làm!');
      }
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    { 
      title: 'Tên Ca', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text) => <b>{text}</b> 
    },
    { 
      title: 'Giờ Bắt Đầu', 
      dataIndex: 'startTime', 
      key: 'startTime',
      render: (text) => <Tag color="green">{text}</Tag>
    },
    { 
      title: 'Giờ Kết Thúc', 
      dataIndex: 'endTime', 
      key: 'endTime',
      render: (text) => <Tag color="orange">{text}</Tag>
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a style={{ color: 'blue' }}>Sửa</a>
          <a style={{ color: 'red' }}>Xóa</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản lý Ca làm việc</h2>
        <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchShifts}>Tải lại</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Thêm ca làm
            </Button>
        </Space>
      </div>
      
      <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" />

      {/* --- POPUP THÊM CA LÀM --- */}
      <Modal 
        title="Thêm Ca làm việc mới" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" name="form_shift">
          
          <Form.Item name="name" label="Tên Ca" rules={[{ required: true, message: 'Vui lòng nhập tên ca!' }]}>
            <Input prefix={<ClockCircleOutlined />} placeholder="Ví dụ: Ca Sáng" />
          </Form.Item>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true, message: 'Chọn giờ!' }]}>
              <TimePicker format="HH:mm" placeholder="08:00" />
            </Form.Item>

            <Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true, message: 'Chọn giờ!' }]}>
              <TimePicker format="HH:mm" placeholder="17:00" />
            </Form.Item>
          </Space>

        </Form>
      </Modal>
    </div>
  );
};

// Import Tag từ antd (nếu quên)
import { Tag } from 'antd'; 

export default Shift;