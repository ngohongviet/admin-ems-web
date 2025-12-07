import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, List, Avatar, Input, Button, Badge, Typography, Space } from 'antd';
import { SendOutlined, UserOutlined, SearchOutlined, InfoCircleOutlined, PaperClipOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const Chat = () => {
  // --- 1. DỮ LIỆU GIẢ (MOCK DATA) ---
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Thu ngân', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1', unread: 13, status: 'online', msg: 'Ca tối nay ai trực thế?' },
    { id: 2, name: 'Pha chế', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2', unread: 25, status: 'offline', msg: 'Hết cà phê rồi nha' },
    { id: 3, name: 'Phục vụ', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3', unread: 22, status: 'online', msg: 'Khách bàn 5 gọi thêm món' },
    { id: 4, name: 'Nhân viên 1', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4', unread: 9, status: 'online', msg: 'Em xin nghỉ phép ạ' },
    { id: 5, name: 'Quản lý 2', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5', unread: 4, status: 'offline', msg: 'Gửi báo cáo cho anh chưa?' },
    { id: 6, name: 'Admin', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=6', unread: 0, status: 'online', msg: 'Hệ thống bảo trì lúc 12h' },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Chào bạn, ca làm việc hôm nay thế nào?', sender: 'other', time: '6:30 pm' },
    { id: 2, text: 'Mọi thứ vẫn ổn ạ. Khách hơi đông xíu.', sender: 'me', time: '6:34 pm' },
  ]);
  const [inputValue, setInputValue] = useState('');
  
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- 2. XỬ LÝ GỬI TIN NHẮN ---
  const handleSend = () => {
    if (inputValue.trim() === '') return;

    // 1. Thêm tin nhắn của mình
    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputValue('');

    // 2. Giả lập người kia trả lời sau 1 giây
    setTimeout(() => {
      const replyMessage = {
        id: messages.length + 2,
        text: 'Ok, đã nhận thông tin nhé! 👍',
        sender: 'other',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  // Lấy thông tin người đang chat
  const activeUser = conversations.find(c => c.id === activeChatId);

  return (
    <div style={{ height: '80vh', background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', display: 'flex' }}>
      
      {/* --- CỘT TRÁI: DANH SÁCH CHAT --- */}
      <div style={{ width: 300, borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16 }}>
           <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm..." style={{ borderRadius: 20 }} />
           <div style={{ marginTop: 10, fontWeight: 'bold' }}>Đoạn chat</div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <List
            itemLayout="horizontal"
            dataSource={conversations}
            renderItem={(item) => (
              <List.Item 
                style={{ 
                    padding: '12px 16px', 
                    cursor: 'pointer',
                    background: activeChatId === item.id ? '#e6f7ff' : 'transparent',
                    borderLeft: activeChatId === item.id ? '4px solid #1890ff' : '4px solid transparent'
                }}
                onClick={() => setActiveChatId(item.id)}
              >
                <List.Item.Meta
                  avatar={
                    <Badge count={item.unread} size="small" offset={[-5, 5]}>
                        <Avatar src={item.avatar} size="large" />
                    </Badge>
                  }
                  title={<span style={{ fontWeight: item.unread > 0 ? 'bold' : 'normal' }}>{item.name}</span>}
                  description={
                      <div style={{ 
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 180,
                          color: item.unread > 0 ? '#1890ff' : '#999'
                      }}>
                          {item.msg}
                      </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* --- CỘT PHẢI: KHUNG CHAT --- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar src={activeUser?.avatar} size="large" />
                <div>
                    <Title level={5} style={{ margin: 0 }}>{activeUser?.name}</Title>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: activeUser?.status === 'online' ? '#52c41a' : '#d9d9d9' }}></div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{activeUser?.status === 'online' ? 'Đang hoạt động' : 'Ngoại tuyến'}</Text>
                    </div>
                </div>
            </div>
            <InfoCircleOutlined style={{ fontSize: 20, color: '#999', cursor: 'pointer' }} />
        </div>

        {/* Nội dung tin nhắn */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#fafafa' }}>
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    style={{ 
                        display: 'flex', 
                        justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                        marginBottom: 20
                    }}
                >
                    {msg.sender === 'other' && <Avatar src={activeUser?.avatar} style={{ marginRight: 10 }} />}
                    
                    <div style={{ maxWidth: '60%' }}>
                        <div style={{ 
                            background: msg.sender === 'me' ? '#1890ff' : '#fff',
                            color: msg.sender === 'me' ? '#fff' : '#333',
                            padding: '10px 15px',
                            borderRadius: msg.sender === 'me' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            fontSize: 14
                        }}>
                            {msg.text}
                        </div>
                        <div style={{ fontSize: 10, color: '#999', marginTop: 5, textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                            {msg.time}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Khung nhập liệu */}
        <div style={{ padding: 16, background: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button icon={<PaperClipOutlined />} type="text" />
            <Input 
                placeholder="Nhập tin nhắn..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSend}
                style={{ borderRadius: 20 }}
            />
            <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={handleSend} />
        </div>

      </div>
    </div>
  );
};

export default Chat;