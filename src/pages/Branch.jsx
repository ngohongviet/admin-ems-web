import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, ShopOutlined } from '@ant-design/icons';
import axios from 'axios';

const Branch = () => {
  // --- STATE ---
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // --- POPUP ---
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [form] = Form.useForm(); 

  // --- HÀM 1: LẤY DANH SÁCH CHI NHÁNH ---
  const fetchBranches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Gọi API lấy chi nhánh
      const response = await axios.get('https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/branches', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Danh sách Chi nhánh:", response.data);
      setData(response.data); 
      message.success('Đã tải xong danh sách chi nhánh!');

    } catch (error) {
      console.error(error);
      message.error('Lỗi tải danh sách chi nhánh!');
      // Dữ liệu giả để demo
      setData([
        { _id: 'CN01', name: 'Chi nhánh Quận 1', address: '123 Lê Lợi, HCM', managerId: 'NV01' },
        { _id: 'CN02', name: 'Chi nhánh Cầu Giấy', address: '456 Xuân Thủy, HN', managerId: 'NV02' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // --- HÀM 2: THÊM CHI NHÁNH MỚI ---
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem('token');
        
        // Gọi API Thêm Chi nhánh
        await axios.post('https://emsbackend-enh5aahkg4dcfkfs.southeastasia-01.azurewebsites.net/api/v1/branches', values, {
            headers: { Authorization: `Bearer ${token}` }
        });

        message.success('Thêm chi nhánh thành công!');
        setIsModalOpen(false);
        form.resetFields();
        fetchBranches(); // Tải lại bảng

      } catch (error) {
        console.error(error);
        message.error('Lỗi khi thêm chi nhánh!');
      }
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  // --- CẤU HÌNH CỘT CHO BẢNG CHI NHÁNH ---
  const columns = [
    { 
      title: 'Tên Chi Nhánh', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text) => <b style={{ color: '#1890ff' }}>{text}</b> 
    },
    { 
      title: 'Địa chỉ', 
      dataIndex: 'address', 
      key: 'address' 
    },
    { 
      title: 'Quản lý (Manager ID)', 
      dataIndex: 'managerId', 
      key: 'managerId'
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
        <h2>Quản lý Chi nhánh</h2>
        <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchBranches}>Tải lại</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
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

      {/* --- POPUP THÊM CHI NHÁNH --- */}
      <Modal 
        title="Thêm Chi nhánh mới" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" name="form_branch">
          
          <Form.Item name="name" label="Tên Chi nhánh" rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh!' }]}>
            <Input prefix={<ShopOutlined />} placeholder="Ví dụ: Chi nhánh Quận 1" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
            <Input.TextArea placeholder="Nhập địa chỉ chi tiết..." rows={3} />
          </Form.Item>

          <Form.Item name="managerId" label="Mã Quản lý (ID)" tooltip="ID của nhân viên làm quản lý">
            <Input placeholder="Nhập ID nhân viên quản lý (nếu có)" />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default Branch;