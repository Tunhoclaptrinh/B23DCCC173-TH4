import React, { useState } from 'react';
import { Card, Button, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useSoVanBangModel from '@/models/VanBang/SoVanBang/soVanBangModel';
import TableList from './List';
import DiplomaBookModal from './Modal';

const SoVanBang: React.FC = () => {
  const {
    danhSachSo,
    loading,
    handleDelete,
    saveDiplomaBook,
    currentYearBook,
    createNewYearBook
  } = useSoVanBangModel();

  const [currentRecord, setCurrentRecord] = useState<DiplomaBook | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'add'>('view');
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddNew = () => {
    setCurrentRecord(null);
    setModalType('add');
    setModalVisible(true);
  };

  return (
    <Card
      title={`Quản lý sổ văn bằng (Năm hiện tại: ${currentYearBook?.year || 'Chưa mở sổ'})`}
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() => createNewYearBook()}
          >
            Mở sổ năm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            disabled={!currentYearBook}
          >
            Thêm văn bằng vào sổ
          </Button>
        </Space>
      }
    >
      <TableList
        data={danhSachSo}
        loading={loading}
        currentYear={currentYearBook?.year}
        onEdit={(record) => {
          setCurrentRecord(record);
          setModalType('edit');
          setModalVisible(true);
        }}
        onView={(record) => {
          setCurrentRecord(record);
          setModalType('view');
          setModalVisible(true);
        }}
        onDelete={handleDelete}
      />

      <DiplomaBookModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        record={currentRecord}
        type={modalType}
        currentYearBook={currentYearBook}
        onSave={saveDiplomaBook}
      />
    </Card>
  );
};

export default SoVanBang;