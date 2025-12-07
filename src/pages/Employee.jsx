import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Modal, Form, Input, Select, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined, UserAddOutlined, PhoneOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ 1. Import cái này để chuyển trang

const Employee = () => {
  // --- STATE ---
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingId, setEditingId] = useState(null); 
  
  const [form] = Form.useForm(); 
  const navigate = useNavigate(); // ✅ 2. Khởi tạo navigate

  // --- API URL ---
  const apiUrl = 'https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/employees';
  
  // ✅ 3. Hàm lấy Token an toàn (Nếu không có thì đá về Login)
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
      navigate('/'); // Chuyển về trang Login
      return null;
    }
    return token;
  };

  // --- 1. LẤY DANH SÁCH (READ) ---
  const fetchEmployees = async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      console.log("🚀 Đang gọi API lấy danh sách...");
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Dữ liệu trả về:", response.data);
      
      // Xử lý an toàn: Backend trả về mảng trực tiếp hay nằm trong .data?
      const realData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setData(realData); 

    } catch (error) {
      console.error("❌ Lỗi API:", error);
      if (error.response && error.response.status === 401) {
        message.error('Hết hạn đăng nhập (401). Đang đăng xuất...');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        message.error('Lỗi tải dữ liệu! Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- 2. XỬ LÝ KHI BẤM NÚT "THÊM NHÂN VIÊN" ---
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // --- 3. XỬ LÝ KHI BẤM NÚT "SỬA" ---
  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // --- 4. XỬ LÝ LƯU (POST HOẶC PUT) ---
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const token = getToken();
      if (!token) return;

      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        if (editingId) {
            // === SỬA (PUT) ===
            console.log("🛠 Đang sửa ID:", editingId, values);
            await axios.put(`${apiUrl}/${editingId}`, values, config);
            message.success('Cập nhật thành công!');
        } else {
            // === THÊM (POST) ===
            // Tự tạo username từ email (Backend yêu cầu)
            const payload = { 
                ...values, 
                username: values.email.split('@')[0] 
            };
            console.log("➕ Đang thêm mới:", payload);
            await axios.post(apiUrl, payload, config);
            message.success('Thêm mới thành công!');
        }

        setIsModalOpen(false);
        form.resetFields();
        fetchEmployees(); // Load lại bảng ngay

      } catch (error) {
        console.error("❌ Lỗi khi lưu:", error);
        message.error('Có lỗi xảy ra! Kiểm tra lại dữ liệu nhập.');
      } finally {
        setLoading(false);
      }
    });
  };

  // --- 5. XỬ LÝ XÓA (DELETE) ---
  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) return;

    try {
        await axios.delete(`${apiUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Đã xóa nhân viên!');
        fetchEmployees(); 
    } catch (error) {
        console.error("❌ Lỗi khi xóa:", error);
        message.error('Xóa thất bại!');
    }
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    { title: 'Họ và Tên', dataIndex: 'name', key: 'name', render: (text) => <b>{text}</b> },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' }, 
    { title: 'Chức vụ', dataIndex: 'role', key: 'role', 
      render: (role) => <Tag color={role === 'manager' ? 'blue' : 'green'}>{role ? role.toUpperCase() : 'NV'}</Tag> 
    },
    { title: 'Chi nhánh', dataIndex: 'branchId', key: 'branchId' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record._id)} okText="Xóa" cancelText="Hủy">
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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm nhân viên</Button>
        </Space>
      </div>
      
      <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" />

      <Modal 
        title={editingId ? "Cập nhật thông tin" : "Thêm Nhân viên mới"} 
        open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại" cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item name="name" label="Họ và Tên" rules={[{ required: true, message: 'Nhập tên!' }]}><Input prefix={<UserAddOutlined />} /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}><Input prefix={<PhoneOutlined />} /></Form.Item>
          
          {/* Ẩn mật khẩu khi sửa để tránh ghi đè rỗng */}
          {!editingId && (
              <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}><Input.Password /></Form.Item>
          )}

          <Form.Item name="role" label="Chức vụ" rules={[{ required: true }]}><Select options={[{value:'manager', label:'Quản lý'}, {value:'employee', label:'Nhân viên'}]} /></Form.Item>
          <Form.Item name="branchId" label="Mã Chi nhánh (ID)" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;