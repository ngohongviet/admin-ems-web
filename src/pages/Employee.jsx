import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, ReloadOutlined, UserAddOutlined } from '@ant-design/icons';
import axios from 'axios';

const Employee = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // --- STATE QUẢN LÝ POPUP (MODAL) ---
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [form] = Form.useForm(); 

  // --- HÀM 1: GỌI API LẤY DANH SÁCH (GET) ---
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Gọi API thật
      const response = await axios.get('https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Dữ liệu về:", response.data);
      // Lưu ý: Nếu dữ liệu nằm trong response.data.data thì sửa lại thành setData(response.data.data)
      setData(response.data); 
      message.success('Đã tải xong dữ liệu!');

    } catch (error) {
      console.error(error);
      // Tạm thời dùng dữ liệu giả nếu API lỗi (để không bị trắng trang khi demo)
      message.error('Lỗi tải dữ liệu (Có thể do CORS). Đang hiển thị dữ liệu mẫu.');
      setData([
        { _id: '1', fullName: 'Nguyễn Văn A (Mẫu)', email: 'a@test.com', role: 'Quản lý', branchId: 'CN01' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm này ngay khi mở trang
  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- HÀM 2: XỬ LÝ KHI BẤM NÚT "LƯU" (POST) ---
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem('token');
        
        // Gọi API Thêm mới
        await axios.post('https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/employees', values, {
            headers: { Authorization: `Bearer ${token}` }
        });

        message.success('Thêm nhân viên thành công!');
        setIsModalOpen(false); // Đóng popup
        form.resetFields(); // Xóa trắng form
        fetchEmployees(); // Tải lại danh sách để thấy người mới

      } catch (error) {
        console.error(error);
        message.error('Lỗi khi thêm nhân viên!');
      }
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  // --- CẤU HÌNH CỘT BẢNG ---
  const columns = [
    { 
      title: 'Họ và Tên', 
      dataIndex: 'fullName', // <--- Nhớ kiểm tra lại tên biến này trong Console
      key: 'fullName', 
      render: (text) => <b>{text}</b> 
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Chức vụ', dataIndex: 'role', key: 'role', 
      render: (role) => <Tag color="blue">{role ? role.toUpperCase() : 'NV'}</Tag> 
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
      
      {/* Bảng dữ liệu */}
      <Table 
        columns={columns} 
        dataSource={data} 
        loading={loading} 
        rowKey="_id" // MongoDB dùng _id
      />

      {/* --- POPUP (MODAL) --- */}
      <Modal 
        title="Thêm Nhân viên mới" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          
          <Form.Item name="fullName" label="Họ và Tên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input prefix={<UserAddOutlined />} placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}>
            <Input.Password placeholder="Nhập mật khẩu..." />
          </Form.Item>

          <Form.Item name="role" label="Chức vụ" rules={[{ required: true, message: 'Chọn chức vụ!' }]}>
            <Select placeholder="Chọn chức vụ">
              <Select.Option value="manager">Quản lý</Select.Option>
              <Select.Option value="employee">Nhân viên</Select.Option>
            </Select>
          </Form.Item>

          {/* Ô nhập Branch ID tạm thời */}
          <Form.Item name="branchId" label="Mã Chi nhánh" rules={[{ required: true, message: 'Nhập mã chi nhánh!' }]}>
             <Input placeholder="Ví dụ: 654ab..." />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default Employee;