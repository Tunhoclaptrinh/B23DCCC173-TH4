import { Card, Table, Form, Input, DatePicker, Button, Space, message } from 'antd';
import useTraCuuModel from '@/models/VanBang/TraCuu/traCuuModel';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const TraCuuPage = () => {
  const { form, loading, data, handleSearch } = useTraCuuModel();

  const columns: ColumnsType<any> = [
    {
      title: 'Số hiệu',
      dataIndex: 'soHieu',
      key: 'soHieu',
    },
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      key: 'soVaoSo',
    },
    {
      title: 'MSV',
      dataIndex: 'msv',
      key: 'msv',
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      render: (date: Date) => date?.toLocaleDateString() || '--',
    },
    {
      title: 'Quyết định số',
      dataIndex: 'quyetDinhSo',
      key: 'quyetDinhSo',
    },
    {
      title: 'Ngày quyết định',
      dataIndex: 'quyetDinhNgay',
      key: 'quyetDinhNgay',
      render: (date: Date) => date?.toLocaleDateString() || '--',
    },
  ];

  const onFinish = (values: any) => {
    if (values.ngaySinh) {
      values.ngaySinh = dayjs(values.ngaySinh).format('YYYY-MM-DD');
    }
    handleSearch(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Card title="Tra cứu văn bằng">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <Form.Item name="soHieu" label="Số hiệu">
            <Input placeholder="Nhập số hiệu văn bằng" />
          </Form.Item>
          <Form.Item name="soVaoSo" label="Số vào sổ">
            <Input placeholder="Nhập số vào sổ" />
          </Form.Item>
          <Form.Item name="msv" label="MSV">
            <Input placeholder="Nhập mã sinh viên" />
          </Form.Item>
          <Form.Item name="hoTen" label="Họ tên">
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          <Form.Item name="ngaySinh" label="Ngày sinh">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </div>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
            >
              Tra cứu
            </Button>
            <Button
              htmlType="button"
              onClick={onReset}
              icon={<ReloadOutlined />}
            >
              Làm mới
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default TraCuuPage;
