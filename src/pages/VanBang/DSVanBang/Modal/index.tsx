import React from 'react';
import { Modal } from 'antd';
import DiplomaForm from '../Form';

interface DiplomaModalProps {
  visible: boolean;
  onCancel: () => void;
  record: Diploma | null;
  type: 'view' | 'edit' | 'add';
  onSave: (values: Diploma, isCreate: boolean) => Promise<boolean>;
}

const DiplomaModal: React.FC<DiplomaModalProps> = ({
  visible,
  onCancel,
  record,
  type,
  onSave,
}) => {
  const title = type === 'add' 
    ? 'Thêm văn bằng mới' 
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
      <DiplomaForm
        record={record}
        type={type}
        onSave={onSave}
        onCancel={onCancel}
      />
    </Modal>
  );
};

export default DiplomaModal;