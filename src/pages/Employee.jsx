import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Modal, Form, Input, Select, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined, UserAddOutlined, PhoneOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const Employee = () => {
  // --- STATE ---
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  // State này dùng để biết đang "Thêm mới" hay "Sửa"
  // Nếu null -> Thêm mới. Nếu có ID -> Đang sửa ID đó.
  const [editingId, setEditingId] = useState(null); 
  
  const [form] = Form.useForm(); 

  // --- API URL & TOKEN ---
  const apiUrl = 'https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/employees';
  
  // --- 1. LẤY DANH SÁCH (READ) ---
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Kiểm tra cấu trúc dữ liệu trả về (có thể là response.data hoặc response.data.data)
      setData(Array.isArray(response.data) ? response.data : []); 
      // message.success('Đã tải dữ liệu!'); // Tắt cái này cho đỡ spam thông báo
    } catch (error) {
      console.error(error);
      message.error('Lỗi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- 2. XỬ LÝ KHI BẤM NÚT "THÊM NHÂN VIÊN" ---
  const handleAdd = () => {
    setEditingId(null); // Đặt về null để biết là thêm mới
    form.resetFields(); // Xóa trắng form cũ
    setIsModalOpen(true);
  };

  // --- 3. XỬ LÝ KHI BẤM NÚT "SỬA" ---
  const handleEdit = (record) => {
    setEditingId(record._id); // Lưu lại ID người đang được sửa
    form.setFieldsValue(record); // Điền thông tin cũ vào form
    setIsModalOpen(true);
  };

  // --- 4. XỬ LÝ LƯU (CHIA RA POST HOẶC PUT) ---
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        if (editingId) {
            // === TRƯỜNG HỢP SỬA (UPDATE - PUT) ===
            // Khi sửa thì KHÔNG gửi password lên (trừ khi backend xử lý riêng)
            // Backend của bạn dùng ID trên URL để sửa
            await axios.put(`${apiUrl}/${editingId}`, values, config);
            message.success('Cập nhật thành công!');
        } else {
            // === TRƯỜNG HỢP THÊM MỚI (CREATE - POST) ===
            // Tự tạo username từ email
            const payload = { ...values, username: values.email.split('@')[0] };
            await axios.post(apiUrl, payload, config);
            message.success('Thêm mới thành công!');
        }

        setIsModalOpen(false);
        form.resetFields();
        fetchEmployees(); // Tải lại bảng ngay lập tức

      } catch (error) {
        console.error(error);
        message.error('Có lỗi xảy ra! (Kiểm tra lại quyền hoặc dữ liệu nhập)');
      } finally {
        setLoading(false);
      }
    });
  };

  // --- 5. XỬ LÝ XÓA (DELETE) ---
  const handleDelete = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${apiUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Đã xóa nhân viên!');
        fetchEmployees(); // Tải lại bảng sau khi xóa
    } catch (error) {
        message.error('Xóa thất bại!');
    }
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    { 
      title: 'Họ và Tên', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text) => <b>{text}</b> 
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' }, 
    { title: 'Chức vụ', dataIndex: 'role', key: 'role', 
      render: (role) => {
        let color = role === 'admin' ? 'red' : (role === 'manager' ? 'blue' : 'green');
        return <Tag color={color}>{role ? role.toUpperCase() : 'NV'}</Tag>;
      }
    },
    { title: 'Chi nhánh', dataIndex: 'branchId', key: 'branchId' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* Nút Sửa: Gọi hàm handleEdit */}
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          
          {/* Nút Xóa: Dùng Popconfirm để hỏi trước khi xóa */}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa luôn"
            cancelText="Hủy"
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
        <h2>Quản lý Nhân viên</h2>
        <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchEmployees}>Tải lại</Button>
            {/* Sửa onClick thành handleAdd */}
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm nhân viên
            </Button>
        </Space>
      </div>
      
      <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" />

      {/* --- MODAL DÙNG CHUNG CHO CẢ THÊM VÀ SỬA --- */}
      <Modal 
        title={editingId ? "Cập nhật thông tin" : "Thêm Nhân viên mới"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          
          <Form.Item name="name" label="Họ và Tên" rules={[{ required: true, message: 'Nhập tên!' }]}>
            <Input prefix={<UserAddOutlined />} placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="user@ems.com" />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT!' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="09..." />
          </Form.Item>

          {/* Chỉ hiện ô nhập Password khi đang THÊM MỚI. Khi Sửa thì ẩn đi để tránh ghi đè pass rỗng */}
          {!editingId && (
              <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}>
                <Input.Password placeholder="Nhập mật khẩu..." />
              </Form.Item>
          )}

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