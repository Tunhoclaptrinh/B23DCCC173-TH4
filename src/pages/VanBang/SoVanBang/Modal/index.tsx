import React from 'react';
import { Modal } from 'antd';
import DiplomaBookForm from '../Form';

interface DiplomaBookModalProps {
  visible: boolean;
  onCancel: () => void;
  record: DiplomaBook | null;
  type: 'view' | 'edit' | 'add';
  currentYearBook?: { year: number; nextEntryNumber: number };
  onSave: (values: DiplomaBook, isCreate: boolean) => Promise<boolean>;
}

const DiplomaBookModal: React.FC<DiplomaBookModalProps> = ({
  visible,
  onCancel,
  record,
  type,
  currentYearBook,
  onSave,
}) => {
  const title = type === 'add' 
    ? `Thêm văn bằng vào sổ năm ${currentYearBook?.year}` 
    : type === 'edit' 
      ? 'Chỉnh sửa văn bằng' 
      : 'Chi tiết văn bằng';

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <DiplomaBookForm
        record={record}
        type={type}
        currentYearBook={currentYearBook}
        onSave={onSave}
        onCancel={onCancel}
      />
    </Modal>
  );
};

export default DiplomaBookModal;