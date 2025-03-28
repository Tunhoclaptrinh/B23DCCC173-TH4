import { Table, Button, Modal, Form, Input, Select, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useModel } from 'umi';
const { Option } = Select;

  type FieldType = {
    id: string;
    name: string;
    type: 'String' | 'Number' | 'Date';
  };

const CauHinh = () => {
  const {
    getFieldsConfig,
    addField,
    updateField,
    deleteField
  } = useModel('VanBang.DSVanBang.cauhinh');
  
  const [form] = Form.useForm();
  const [fields, setFields] = useState<FieldType[]>(getFieldsConfig());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);


  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: FieldType) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa trường này?',
      onOk: () => {
        const newFields = deleteField(fields, id);
        setFields(newFields);
        message.success('Xóa thành công');
      },
    });
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingId) {
        const newFields = updateField(fields, editingId, values);
        setFields(newFields);
        message.success('Cập nhật thành công');
      } else {
        const newFields = addField(fields, values);
        setFields(newFields);
        message.success('Thêm mới thành công');
      }
      setIsModalOpen(false);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Tên trường',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: FieldType) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];


  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm trường
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={fields} 
        rowKey="id"
        bordered
      />

      <Modal
        title={editingId ? 'Chỉnh sửa trường' : 'Thêm trường mới'}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên trường"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
          >
            <Input placeholder="Nhập tên trường" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Kiểu dữ liệu"
            rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
          >
            <Select placeholder="Chọn kiểu dữ liệu">
              <Option value="String">String</Option>
              <Option value="Number">Number</Option>
              <Option value="Date">Date</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CauHinh;
