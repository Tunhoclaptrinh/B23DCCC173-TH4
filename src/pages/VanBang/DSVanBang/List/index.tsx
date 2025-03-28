import React, { useCallback, useState } from 'react';
import type { IColumn } from '@/components/Table/typing';
import { Table, Button, Space, Modal, message } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';


interface TableListProps {
  data: Diploma[];
  loading: boolean;
  onEdit: (record: Diploma) => void;
  onView: (record: Diploma) => void;
  onDelete: (id: string) => Promise<boolean>;
}

const TableList: React.FC<TableListProps> = ({ 
  data, 
  loading, 
  onEdit, 
  onView, 
  onDelete 
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleDeleteConfirm = useCallback(async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa văn bằng này?',
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

  const columns: IColumn<Diploma>[] = [
    {
      title: 'Số vào sổ',
      dataIndex: 'entryNumber',
      key: 'entryNumber',
      sorter: true,
      width: 150,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'diplomaNumber',
      key: 'diplomaNumber',
      width: 150,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 150,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: 150,
      render: (date: Date) => date?.toLocaleDateString() || '--',
    },
    {
      title: 'Quyết định tốt nghiệp',
      dataIndex: 'graduationDecisionId',
      key: 'graduationDecisionId',
      width: 150,
    },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'diplomaBookId',
      key: 'diplomaBookId',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
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
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteConfirm(record.id)}
            type="text"
            danger
            title="Xóa"
            loading={confirmLoading}
          />
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: data.length
    }));
  }, [data]);

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{
        ...pagination,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: (page, pageSize) => {
          setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize || prev.pageSize,
          }));
        },
      }}
      scroll={{ x: 1300 }}
      bordered
    />
  );
};

export default TableList;