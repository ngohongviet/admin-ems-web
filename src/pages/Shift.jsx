import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Modal, Form, Input, TimePicker, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined, ClockCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const Shift = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  // State để biết đang Thêm hay Sửa
  const [editingId, setEditingId] = useState(null); 
  const [form] = Form.useForm(); 

  const apiUrl = 'https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/shifts';

  // --- 1. LẤY DANH SÁCH ---
  const fetchShifts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Backend có thể trả về mảng trực tiếp hoặc trong .data
      setData(Array.isArray(response.data) ? response.data : []); 
    } catch (error) {
      console.error(error);
      message.error('Lỗi tải dữ liệu ca làm!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // --- 2. BẤM NÚT THÊM MỚI ---
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // --- 3. BẤM NÚT SỬA (QUAN TRỌNG: XỬ LÝ GIỜ) ---
  const handleEdit = (record) => {
    setEditingId(record._id);
    
    // Ant Design TimePicker bắt buộc dùng dayjs object, không nhận string "08:00"
    form.setFieldsValue({
        ...record,
        // Chuyển chuỗi "HH:mm" thành đối tượng thời gian
        startTime: record.startTime ? dayjs(record.startTime, 'HH:mm') : null,
        endTime: record.endTime ? dayjs(record.endTime, 'HH:mm') : null,
    });
    
    setIsModalOpen(true);
  };

  // --- 4. LƯU DỮ LIỆU (POST/PUT) ---
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Chuyển đổi ngược lại từ TimePicker (dayjs) sang chuỗi "HH:mm" để gửi cho Backend
        const payload = {
            shiftName: values.shiftName, // Backend dùng shiftName
            startTime: values.startTime ? values.startTime.format('HH:mm') : null,
            endTime: values.endTime ? values.endTime.format('HH:mm') : null,
            // Thêm giá trị mặc định cho các trường bắt buộc khác (nếu có)
            branchId: '654ab...', // Tạm thời hardcode hoặc bỏ qua nếu backend không bắt buộc
        };

        if (editingId) {
            // SỬA
            await axios.put(`${apiUrl}/${editingId}`, payload, config);
            message.success('Cập nhật thành công!');
        } else {
            // THÊM
            await axios.post(apiUrl, payload, config);
            message.success('Thêm mới thành công!');
        }

        setIsModalOpen(false);
        form.resetFields();
        fetchShifts(); 

      } catch (error) {
        console.error(error);
        message.error('Lỗi khi lưu! (Kiểm tra dữ liệu nhập)');
      }
    });
  };

  // --- 5. XÓA ---
  const handleDelete = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${apiUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Đã xóa ca làm!');
        fetchShifts();
    } catch (error) {
        message.error('Xóa thất bại!');
    }
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    { 
      title: 'Tên Ca', 
      dataIndex: 'shiftName', // ✅ Sửa thành shiftName cho khớp seed.ts
      key: 'shiftName', 
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
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm 
            title="Bạn có chắc muốn xóa?" 
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa" cancelText="Hủy"
          >
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
            {/* Sửa onClick thành handleAdd */}
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm ca làm
            </Button>
        </Space>
      </div>
      
      <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" />

      {/* --- POPUP --- */}
      <Modal 
        title={editingId ? "Cập nhật Ca làm" : "Thêm Ca làm mới"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" name="form_shift">
          
          {/* ✅ Sửa name thành shiftName */}
          <Form.Item name="shiftName" label="Tên Ca" rules={[{ required: true, message: 'Vui lòng nhập tên ca!' }]}>
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