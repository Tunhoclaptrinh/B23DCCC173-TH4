import React from 'react';
import { Form, Input, Button, Space, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
type FieldType = {
  id: string;
  name: string;
  type: 'String' | 'Number' | 'Date';
};

interface DiplomaFormProps {
  record: Diploma | null;
  type: 'view' | 'edit' | 'add';
  onSave: (values: Diploma, isCreate: boolean) => Promise<boolean>;
  onCancel: () => void;
}

const generateRandomDiplomaNumber = () => {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  return `VB-${randomNumber}`;
};



const fieldsConfig = JSON.parse(localStorage.getItem('vanbang_fields_config') || '[]');
// console.log(fieldsConfig)
const DiplomaForm: React.FC<DiplomaFormProps> = ({ 
  record, 
  type, 
  onSave, 
  onCancel 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        dateOfBirth: record.dateOfBirth ? moment(record.dateOfBirth) : null,
        createdAt: record.createdAt ? moment(record.createdAt) : null,
        updatedAt: record.updatedAt ? moment(record.updatedAt) : null,
      });
    } else {
      form.resetFields();
      if (type === 'add') {
        form.setFieldsValue({
          diplomaNumber: generateRandomDiplomaNumber()
        });
      }
    }
  }, [record, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const isCreate = type === 'add';
      const success = await onSave({
        ...values,
        dateOfBirth: values.dateOfBirth?.toDate(),
        createdAt: values.createdAt?.toDate(),
        updatedAt: values.updatedAt?.toDate(),
      } as Diploma, isCreate);
      if (success) {
        onCancel();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical">
      
      <Form.Item
        name="diplomaNumber"
        label="Số hiệu văn bằng"
      >
        <Input disabled={true} />
      </Form.Item>
      
      <Form.Item
        name="studentId"
        label="Mã sinh viên"
        rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
      >
        <Input disabled={type === 'view'} />
      </Form.Item>
      
      <Form.Item
        name="fullName"
        label="Họ và tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
      >
        <Input disabled={type === 'view'} />
      </Form.Item>
      
      <Form.Item
        name="dateOfBirth"
        label="Ngày sinh"
        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          disabled={type === 'view'} 
          format="DD/MM/YYYY"
        />
      </Form.Item>
      
      <Form.Item
        name="graduationDecisionId"
        label="Quyết định tốt nghiệp"
        rules={[{ required: true, message: 'Vui lòng nhập quyết định tốt nghiệp' }]}
      >
        <Input disabled={type === 'view'} />
      </Form.Item>
      
      
      <Form.Item
        name="createdAt"
        label="Ngày tạo"
        hidden={type === 'add'}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          disabled 
          format="DD/MM/YYYY HH:mm:ss"
          showTime
        />
      </Form.Item>
      
      <Form.Item
        name="updatedAt"
        label="Ngày cập nhật"
        hidden={type === 'add'}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          disabled 
          format="DD/MM/YYYY HH:mm:ss"
          showTime
        />
      </Form.Item>
      
{fieldsConfig?.map((item: FieldType) => {
        return (
          <Form.Item
            key={item.id}
            name={item.name}
            label={item.name}
            hidden={type === 'add'}
          >
            {item.type === 'Date' ? (
              <DatePicker 
                style={{ width: '100%' }}
                disabled={type === 'view'}
                format="DD/MM/YYYY"
              />
            ) : item.type === 'Number' ? (
              <InputNumber 
                style={{ width: '100%' }}
                disabled={type === 'view'}
              />
            ) : (
              <Input disabled={type === 'view'} />
            )}
          </Form.Item>
        );
      })}


      
      {type !== 'view' && (
        <Space style={{ float: 'right', marginTop: 16 }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {type === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
          </Button>
        </Space>
      )}
    </Form>
  );
};

export default DiplomaForm;
