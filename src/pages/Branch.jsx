import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined, ShopOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Branch = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingId, setEditingId] = useState(null); 
  
  const [form] = Form.useForm(); 
  const navigate = useNavigate();

  const apiUrl = 'https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/branches';

  // --- HÀM LẤY TOKEN AN TOÀN ---
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
  const fetchBranches = async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Dữ liệu chi nhánh:", response.data);
      
      const realData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setData(realData);

    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
         message.error('Token hết hạn, vui lòng đăng nhập lại.');
         navigate('/');
      } else {
         message.error('Lỗi tải danh sách chi nhánh!');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // --- 2. THÊM / SỬA ---
  const handleAdd = () => { setEditingId(null); form.resetFields(); setIsModalOpen(true); };
  const handleEdit = (record) => { setEditingId(record._id); form.setFieldsValue(record); setIsModalOpen(true); };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const token = getToken();
      if (!token) return;

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Backend yêu cầu tọa độ (location), ta fake tạm để không lỗi
        const payload = {
            ...values,
            location: { latitude: 10.762, longitude: 106.660, radius: 100 }
        };

        if (editingId) {
            await axios.put(`${apiUrl}/${editingId}`, payload, config);
            message.success('Cập nhật thành công!');
        } else {
            await axios.post(apiUrl, payload, config);
            message.success('Thêm mới thành công!');
        }
        setIsModalOpen(false); 
        fetchBranches();
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
        message.success('Đã xóa chi nhánh!');
        fetchBranches();
    } catch (error) {
        message.error('Xóa thất bại!');
    }
  };

  // --- CỘT BẢNG ---
  const columns = [
    { 
      title: 'Tên Chi Nhánh', 
      // Lưu ý: Nếu cột này trống, hãy thử đổi 'branchName' thành 'name'
      dataIndex: 'branchName', 
      key: 'branchName', 
      render: (text) => <b style={{ color: '#1890ff' }}>{text || 'Chưa đặt tên'}</b> 
    },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa chi nhánh này?" onConfirm={() => handleDelete(record._id)}>
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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm chi nhánh</Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" />
      
      <Modal 
        title={editingId ? "Cập nhật" : "Thêm mới"} 
        open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}
        okText="Lưu" cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          {/* Quan trọng: Backend dùng branchName hay name? Ta cứ để branchName theo seed data */}
          <Form.Item name="branchName" label="Tên Chi nhánh" rules={[{ required: true, message: 'Nhập tên!' }]}>
            <Input prefix={<ShopOutlined />} placeholder="Ví dụ: Trụ sở chính" />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Nhập địa chỉ!' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Branch;