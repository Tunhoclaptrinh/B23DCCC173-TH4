import React, { useCallback, useState } from 'react';
import type { IColumn } from '@/components/Table/typing';
import { Table, Button, Space, Modal, message, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import useDSVanBangModel from '@/models/VanBang/DSVanBang/dsvanbang';

interface TableListProps {
  data: DiplomaBook[];
  loading: boolean;
  currentYear?: number;
  onEdit: (record: DiplomaBook) => void;
  onView: (record: DiplomaBook) => void;
  onDelete: (id: string) => Promise<boolean>;
  diplomas: Diploma[]; 
}

const TableList: React.FC<TableListProps> = ({ 
  data, 
  loading, 
  currentYear,
  onEdit, 
  onView, 
  onDelete,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDeleteConfirm = useCallback(async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa văn bằng này khỏi sổ?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      async onOk() {
        try {
          setConfirmLoading(true);
          await onDelete(id);
          message.success('Xóa văn bằng thành công');
        } catch (error) {
          message.error('Xóa văn bằng thất bại');
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  }, [onDelete]);


  // const { getDiplomaNumber, danhSach: diplomas } = useDSVanBangModel();
  
  const columns: IColumn<DiplomaBook>[] = [
    {
      title: 'Năm',
      dataIndex: 'year',
      key: 'year',
      width: 60,
      render: (year: number) => (
        <Tag color={year === currentYear ? 'green' : 'default'}>
          {year}
        </Tag>
      ),
    },
    {
      title: 'Số vào sổ',
      dataIndex: 'entryNumber',
      key: 'entryNumber',
      width: 50,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'diplomaNumber', 
      key: 'diplomaNumber',
      width: 80,
      // render: (id: string) => getDiplomaNumber(id),
    },
    {
      title: 'Ngày cấp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 50,
      render: (date: Date) => date?.toLocaleDateString() || '--',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => onView(record)}
            type="text"
            title="Xem chi tiết"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            type="text"
            title="Chỉnh sửa"
            disabled={record.year !== currentYear}
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteConfirm(record.id)}
            type="text"
            danger
            title="Xóa"
            loading={confirmLoading}
            disabled={record.year !== currentYear}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      scroll={{ x: 1300 }}
      bordered
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100']
      }}
    />
  );
};

export default TableList;
