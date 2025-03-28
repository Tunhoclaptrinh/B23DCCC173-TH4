import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useDSVanBangModel from '@/models/VanBang/DSVanBang/dsvanbang';
import TableList from './List';
import DiplomaModal from './Modal';

const DSVanBang: React.FC = () => {
  const {
    danhSach,
    loading,
    handleDelete,
    saveDiploma,
  } = useDSVanBangModel();

  const [currentRecord, setCurrentRecord] = useState<Diploma | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'add'>('view');
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddNew = () => {
    setCurrentRecord(null);
    setModalType('add');
    setModalVisible(true);
  };

  return (
    <Card
      title="Danh sách văn bằng"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
        >
          Thêm văn bằng
        </Button>
      }
    >
      <TableList
        data={danhSach}
        loading={loading}
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

      <DiplomaModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        record={currentRecord}
        type={modalType}
        onSave={saveDiploma}
      />
    </Card>
  );
};

export default DSVanBang;