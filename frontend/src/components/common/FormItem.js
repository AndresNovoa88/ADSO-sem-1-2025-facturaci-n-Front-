import { Form } from 'antd';

const FormItem = ({ label, name, rules, children }) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      {children}
    </Form.Item>
  );
};

export default FormItem;