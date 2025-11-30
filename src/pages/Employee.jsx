import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, ReloadOutlined, UserAddOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';

const Employee = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [form] = Form.useForm(); 

  // --- HÀM GỌI API ---
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Dữ liệu về:", response.data);
      // Backend trả về mảng trực tiếp hay nằm trong .data? 
      // Thường là response.data.data hoặc response.data
      setData(response.data); 
      message.success('Đã tải xong dữ liệu!');

    } catch (error) {
      console.error(error);
      // GIỮ NGUYÊN PHẦN NÀY ĐỂ DEMO KHÔNG BỊ TRẮNG TRANG KHI LỖI CORS
      message.error('Đang hiển thị dữ liệu mẫu (Do lỗi kết nối/CORS).');
      setData([
        { _id: '1', name: 'Nguyễn Văn A (Mẫu)', email: 'a@test.com', role: 'manager', branchId: 'Head Office', phone: '0987654321' },
        { _id: '2', name: 'Trần Thị B (Mẫu)', email: 'b@test.com', role: 'employee', branchId: 'West Branch', phone: '0123456789' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- HÀM THÊM MỚI ---
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem('token');
        
        // Tự động tạo username từ email (để đỡ phải nhập)
        const payload = {
            ...values,
            username: values.email.split('@')[0] // Lấy phần trước @ làm username
        };

        await axios.post('https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/employees', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        message.success('Thêm nhân viên thành công!');
        setIsModalOpen(false);
        form.resetFields();
        fetchEmployees();

      } catch (error) {
        console.error(error);
        message.error('Lỗi khi thêm! (Kiểm tra lại CORS hoặc quyền Admin)');
      }
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  // --- CẤU HÌNH CỘT (ĐÃ SỬA name thay vì fullName) ---
  const columns = [
    { 
      title: 'Họ và Tên', 
      dataIndex: 'name', // ✅ Đã sửa cho khớp với seed.ts
      key: 'name', 
      render: (text) => <b>{text}</b> 
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' }, // ✅ Thêm cột SĐT
    { title: 'Chức vụ', dataIndex: 'role', key: 'role', 
      render: (role) => {
        let color = role === 'admin' ? 'red' : (role === 'manager' ? 'geekblue' : 'green');
        return <Tag color={color}>{role ? role.toUpperCase() : 'NV'}</Tag>;
      }
    },
    { title: 'Chi nhánh', dataIndex: 'branchId', key: 'branchId' },
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
        <h2>Quản lý Nhân viên</h2>
        <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchEmployees}>Tải lại</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Thêm nhân viên
            </Button>
        </Space>
      </div>
      
      <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" />

      <Modal 
        title="Thêm Nhân viên mới" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          
          {/* ✅ Sửa name="fullName" thành name="name" */}
          <Form.Item name="name" label="Họ và Tên" rules={[{ required: true, message: 'Nhập tên!' }]}>
            <Input prefix={<UserAddOutlined />} placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="user@ems.com" />
          </Form.Item>

          {/* ✅ Thêm ô nhập SĐT */}
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT!' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="09..." />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password placeholder="Nhập mật khẩu..." />
          </Form.Item>

          <Form.Item name="role" label="Chức vụ" rules={[{ required: true }]}>
            <Select placeholder="Chọn chức vụ">
              <Select.Option value="manager">Quản lý (Manager)</Select.Option>
              <Select.Option value="employee">Nhân viên (Employee)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="branchId" label="Mã Chi nhánh (ID)" rules={[{ required: true }]}>
             <Input placeholder="Nhập ID chi nhánh..." />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default Employee;