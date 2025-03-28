import useQuyetDinhModel from '@/models/VanBang/QuyetDinh/quyetDinhModel';
import { PageContainer } from '@ant-design/pro-layout';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const QuyetDinhPage = () => {
  const { danhSach, loading } = useQuyetDinhModel();

  const columns: ColumnsType<any> = [
    {
      title: 'Số quyết định',
      dataIndex: 'soQd',
      key: 'soQd',
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngayBanHanh',
      key: 'ngayBanHanh',
      render: (date: Date) => date.toLocaleDateString(),
    },
    {
      title: 'Trích yếu',
      dataIndex: 'trichYeu',
      key: 'trichYeu',
    },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'soVanBangId',
      key: 'soVanBangId',
    },
  ];

  return (
    <PageContainer>
      <Table
        columns={columns}
        dataSource={danhSach}
        loading={loading}
        rowKey="id"
      />
    </PageContainer>
  );
};

export default QuyetDinhPage;
