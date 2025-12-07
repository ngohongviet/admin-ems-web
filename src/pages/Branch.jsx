import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined, ShopOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const Branch = () => {
  // --- STATE ---
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  // State để xác định đang Thêm hay Sửa
  const [editingId, setEditingId] = useState(null); 
  
  const [form] = Form.useForm(); 

  const apiUrl = 'https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/branches';

  // --- 1. LẤY DANH SÁCH (READ) ---
  const fetchBranches = async () => {
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
      message.error('Lỗi tải danh sách chi nhánh!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // --- 2. XỬ LÝ KHI BẤM "THÊM MỚI" ---
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // --- 3. XỬ LÝ KHI BẤM "SỬA" ---
  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue(record); // Điền dữ liệu cũ vào form
    setIsModalOpen(true);
  };

  // --- 4. XỬ LÝ LƯU (POST/PUT) ---
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Chuẩn bị dữ liệu gửi đi (Payload)
        // Lưu ý: Backend yêu cầu field 'location', ta thêm mặc định để không bị lỗi
        const payload = {
            ...values,
            // Nếu form không nhập tọa độ, ta để mặc định (vì UI chưa có bản đồ)
            location: { 
                latitude: 10.762622, 
                longitude: 106.660172, 
                radius: 100 
            }
        };

        if (editingId) {
            // === SỬA (PUT) ===
            await axios.put(`${apiUrl}/${editingId}`, payload, config);
            message.success('Cập nhật thành công!');
        } else {
            // === THÊM (POST) ===
            await axios.post(apiUrl, payload, config);
            message.success('Thêm mới thành công!');
        }

        setIsModalOpen(false);
        fetchBranches(); // Tải lại bảng

      } catch (error) {
        console.error(error);
        message.error('Lỗi khi lưu! (Kiểm tra lại dữ liệu nhập)');
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
        message.success('Đã xóa chi nhánh!');
        fetchBranches();
    } catch (error) {
        message.error('Xóa thất bại!');
    }
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    { 
      title: 'Tên Chi Nhánh', 
      dataIndex: 'branchName', // ✅ Đã sửa từ 'name' thành 'branchName' cho khớp Backend
      key: 'branchName', 
      render: (text) => <b style={{ color: '#1890ff' }}>{text}</b> 
    },
    { 
      title: 'Địa chỉ', 
      dataIndex: 'address', 
      key: 'address' 
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* Nút Sửa */}
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          
          {/* Nút Xóa */}
          <Popconfirm 
            title="Bạn có chắc chắn muốn xóa?" 
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
        <h2>Quản lý Chi nhánh</h2>
        <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchBranches}>Tải lại</Button>
            {/* Sửa onClick thành handleAdd */}
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm chi nhánh
            </Button>
        </Space>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={data} 
        loading={loading} 
        rowKey="_id"
      />

      {/* --- MODAL --- */}
      <Modal 
        title={editingId ? "Cập nhật Chi nhánh" : "Thêm Chi nhánh mới"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" name="form_branch">
          
          {/* ✅ Sửa name thành branchName cho khớp với Backend */}
          <Form.Item name="branchName" label="Tên Chi nhánh" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input prefix={<ShopOutlined />} placeholder="Ví dụ: Head Office" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
            <Input.TextArea placeholder="Nhập địa chỉ chi tiết..." rows={3} />
          </Form.Item>

          {/* Ẩn phần Manager ID đi nếu chưa cần thiết hoặc để nhập tùy ý */}
          {/* <Form.Item name="managerId" label="Mã Quản lý"><Input /></Form.Item> */}

        </Form>
      </Modal>
    </div>
  );
};

export default Branch;