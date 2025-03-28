import React from 'react';
import { Form, Input, Button, Space, DatePicker, InputNumber, Alert, Select, AutoComplete } from 'antd';
import moment from 'moment';
import useDSVanBangModel from '@/models/VanBang/DSVanBang/dsvanbang';

interface DiplomaBookFormProps {
  record: DiplomaBook | null;
  type: 'view' | 'edit' | 'add';
  currentYearBook?: { year: number; nextEntryNumber: number };
  onSave: (values: DiplomaBook, isCreate: boolean) => Promise<boolean>;
  onCancel: () => void;
}

const DiplomaBookForm: React.FC<DiplomaBookFormProps> = ({ 
  record, 
  type, 
  currentYearBook,
  onSave, 
  onCancel 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [selectedDiplomas, setSelectedDiplomas] = React.useState<any[]>([]);
  
  const { danhSach: diplomas } = useDSVanBangModel();

  React.useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        issueDate: record.issueDate ? moment(record.issueDate) : null,
      });
      if (record.diplomas) {
        setSelectedDiplomas(record.diplomas);
      }
    } else if (type === 'add' && currentYearBook) {
      form.setFieldsValue({
        year: currentYearBook.year,
        entryNumber: currentYearBook.nextEntryNumber,
      });
    } else {
      form.resetFields();
    }
  }, [record, form, type, currentYearBook]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const isCreate = type === 'add';
      
      const diplomaBookData = {
        ...values,
        issueDate: values.issueDate?.toDate(),
        diplomas: selectedDiplomas.map((d, index) => ({
          ...d,
          entryNumber: values.entryNumber + index,
          // diplomaNumber: `${values.year}-${String(values.entryNumber + index).padStart(4, '0')}`
        }))
      } as DiplomaBook;

      const success = await onSave(diplomaBookData, isCreate);
      if (success) {
        onCancel();
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredDiplomas = diplomas.filter(d => 
    !selectedDiplomas.some(sd => sd.id === d.id) && 
    (d.diplomaNumber?.includes(searchText) || 
     d.studentId?.includes(searchText) || 
     d.fullName?.includes(searchText))
  );

  const handleAddDiploma = (diplomaId: string) => {
    const diplomaToAdd = diplomas.find(d => d.id === diplomaId);
    if (diplomaToAdd) {
      setSelectedDiplomas([...selectedDiplomas, diplomaToAdd]);
      setSearchText('');
    }
  };

  const handleRemoveDiploma = (diplomaId: string) => {
    setSelectedDiplomas(selectedDiplomas.filter(d => d.id !== diplomaId));
  };

  return (
    <Form form={form} layout="vertical">
      {type === 'add' && currentYearBook && (
        <Alert
          message={`Đang thêm văn bằng vào sổ năm ${currentYearBook.year}. Số vào sổ tiếp theo: ${currentYearBook.nextEntryNumber}`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form.Item name="year" label="Năm" hidden>
        <InputNumber disabled />
      </Form.Item>

      <Form.Item
        name="entryNumber"
        label="Số vào sổ (bắt đầu)"
        rules={[{ required: true, message: 'Vui lòng nhập số vào sổ' }]}
      >
        <InputNumber 
          style={{ width: '100%' }} 
          disabled={type !== 'add'} 
          min={1}
        />
      </Form.Item>
      
      <Form.Item label="Danh sách văn bằng sẽ thêm vào sổ">
        <div style={{ marginBottom: 16 }}>
          <AutoComplete
            style={{ width: '100%' }}
            options={filteredDiplomas.map(d => ({
              value: d.id,
              label: `${d.diplomaNumber} - ${d.studentId} - ${d.fullName}`
            }))}
            value={searchText}
            onChange={setSearchText}
            onSelect={handleAddDiploma}
            placeholder="Tìm kiếm văn bằng theo số hiệu, mã SV hoặc tên"
          />
        </div>
        
        {selectedDiplomas.length > 0 && (
          <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: 16 }}>
            {selectedDiplomas.map((diploma, index) => (
              <div key={diploma.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index < selectedDiplomas.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div>
                  <strong>{diploma.diplomaNumber}</strong> - {diploma.studentId} - {diploma.fullName}
                  <div style={{ color: '#888', fontSize: 12 }}>
                    Sẽ được cấp số: {currentYearBook?.nextEntryNumber + index}
                  </div>
                </div>
                <Button 
                  type="text" 
                  danger 
                  onClick={() => handleRemoveDiploma(diploma.id)}
                  disabled={type === 'view'}
                >
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        )}
      </Form.Item>
      
      {type !== 'view' && (
        <Space style={{ float: 'right', marginTop: 16 }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button 
            type="primary" 
            onClick={handleSubmit} 
            loading={loading}
            disabled={selectedDiplomas.length === 0}
          >
            {type === 'add' ? 'Thêm vào sổ' : 'Lưu thay đổi'}
          </Button>
        </Space>
      )}
    </Form>
  );
};

export default DiplomaBookForm;
