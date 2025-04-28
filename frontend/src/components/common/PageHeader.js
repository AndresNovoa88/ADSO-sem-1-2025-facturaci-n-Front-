import { PageHeader } from 'antd';

const CustomPageHeader = ({ title, onBack, extra }) => {
  return (
    <PageHeader
      title={title}
      onBack={onBack}
      extra={extra}
      style={{ background: '#fff', marginBottom: 24 }}
    />
  );
};

export default CustomPageHeader;