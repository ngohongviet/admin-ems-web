import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Modal, Form, Input, TimePicker, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined, ClockCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom'; // ✅ 1. Thêm cái này để chuyển trang

const Shift = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingId, setEditingId] = useState(null);
  
  const [form] = Form.useForm(); 
  const navigate = useNavigate(); // ✅ 2. Khởi tạo

  const apiUrl = 'https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/shifts';

  // ✅ 3. Hàm lấy Token an toàn (Giống trang Nhân viên)
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Hết phiên đăng nhập!');
      navigate('/');
      return null;
    }
    return token;
  };

  // --- 1. LẤY DANH SÁCH ---
  const fetchShifts = async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Dữ liệu Ca làm:", response.data);
      
      // Xử lý an toàn: Lấy mảng dữ liệu dù nó nằm ở đâu
      // Backend có thể trả về [..] hoặc { data: [..] }
      const realData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setData(realData); 

    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
         message.error('Token lỗi/Hết hạn. Vui lòng đăng nhập lại.');
         navigate('/');
      } else {
         message.error('Lỗi tải dữ liệu ca làm!');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // --- 2. THÊM / SỬA ---
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    // QUAN TRỌNG: Chuyển chuỗi "08:00" thành đối tượng Dayjs để TimePicker hiểu
    form.setFieldsValue({
        ...record,
        // Backend trả về 'shiftName', ta map vào form
        shiftName: record.shiftName || record.name, 
        startTime: record.startTime ? dayjs(record.startTime, 'HH:mm') : null,
        endTime: record.endTime ? dayjs(record.endTime, 'HH:mm') : null,
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const token = getToken();
      if (!token) return;

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // QUAN TRỌNG: Chuyển ngược từ TimePicker về chuỗi "HH:mm" để gửi lên Server
        const payload = {
            shiftName: values.shiftName,
            startTime: values.startTime ? values.startTime.format('HH:mm') : null,
            endTime: values.endTime ? values.endTime.format('HH:mm') : null,
        };

        if (editingId) {
            await axios.put(`${apiUrl}/${editingId}`, payload, config);
            message.success('Cập nhật thành công!');
        } else {
            await axios.post(apiUrl, payload, config);
            message.success('Thêm mới thành công!');
        }
        setIsModalOpen(false);
        fetchShifts();
      } catch (error) {
        console.error(error);
        message.error('Lỗi khi lưu! Kiểm tra lại dữ liệu.');
      }
    });
  };

  // --- 3. XÓA ---
  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) return;
    try {
        await axios.delete(`${apiUrl}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        message.success('Đã xóa ca làm!');
        fetchShifts();
    } catch (error) {
        message.error('Xóa thất bại!');
    }
  };

  const columns = [
    { 
      title: 'Tên Ca', 
      dataIndex: 'shiftName', 
      key: 'shiftName', 
      // Phòng hờ backend trả về tên biến khác (name hoặc shiftName)
      render: (text, record) => <b>{text || record.name}</b> 
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
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record._id)}>
             <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm ca làm</Button>
        </Space>
      </div>
      
      <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" />

      <Modal 
        title={editingId ? "Cập nhật Ca làm" : "Thêm Ca làm mới"} 
        open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}
        okText="Lưu" cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="shiftName" label="Tên Ca" rules={[{ required: true, message: 'Nhập tên ca!' }]}>
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

export default Shift;