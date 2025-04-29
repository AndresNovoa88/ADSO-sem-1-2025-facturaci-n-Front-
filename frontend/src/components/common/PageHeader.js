// src/components/common/PageHeader.js
import { Breadcrumb, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const CustomPageHeader = ({ title, onBack, extra }) => {
  return (
    <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 24 }}>
      <Space size="middle" align="center">
        {onBack && <ArrowLeftOutlined onClick={onBack} style={{ cursor: 'pointer' }} />}
        <Typography.Title level={4} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
      </Space>
      {extra && <div style={{ float: 'right' }}>{extra}</div>}
    </div>
  );
};

export default CustomPageHeader;