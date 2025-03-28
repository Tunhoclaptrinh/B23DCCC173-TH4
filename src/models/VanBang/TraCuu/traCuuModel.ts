import { useState } from 'react';
import { message, Form } from 'antd';
import useDSVanBangModel from '@/models/VanBang/DSVanBang/dsvanbang';
import useQuyetDinhModel from '@/models/VanBang/QuyetDinh/quyetDinhModel';

interface VanBangItem {
  id: string;
  soHieu: string;
  soVaoSo: number;
  msv: string;
  hoTen: string;
  ngaySinh: Date;
  quyetDinhId: string;
  quyetDinhSo: string;
  quyetDinhNgay: Date;
}

interface SearchParams {
  soHieu?: string;
  soVaoSo?: string;
  msv?: string;
  hoTen?: string;
  ngaySinh?: string;
}

const useTraCuuModel = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VanBangItem[]>([]);
  const [searchCount, setSearchCount] = useState<Record<string, number>>({});

  const { danhSach: dsVanBang } = useDSVanBangModel();
  const { danhSach: dsQuyetDinh } = useQuyetDinhModel();

  const handleSearch = (values: SearchParams) => {

    const filledParams = Object.values(values).filter(v => v).length;
    if (filledParams < 2) {
      message.error('Vui lòng nhập ít nhất 2 thông tin tìm kiếm');
      return;
    }

    try {
      setLoading(true);
      


      const combinedData = dsVanBang.map(vb => {
        const qd = dsQuyetDinh.find(q => q.id === vb.graduationDecisionId);
        return {
          id: vb.id,
          soHieu: vb.diplomaNumber,
          soVaoSo: vb.entryNumber,
          msv: vb.studentId,
          hoTen: vb.fullName,
          ngaySinh: vb.dateOfBirth,
          quyetDinhId: vb.graduationDecisionId,
          quyetDinhSo: qd?.soQd || '',
          quyetDinhNgay: qd?.ngayBanHanh || new Date()
        };
      });

      const filtered = combinedData.filter(item => {
        return (
          (!values.soHieu || item.soHieu.includes(values.soHieu)) &&
          (!values.soVaoSo || item.soVaoSo.toString().includes(values.soVaoSo)) &&
          (!values.msv || item.msv.includes(values.msv)) &&
          (!values.hoTen || item.hoTen.includes(values.hoTen)) &&
          (!values.ngaySinh || item.ngaySinh.toISOString().includes(values.ngaySinh))
        );
      });

      setData(filtered);
      
      if (filtered.length > 0) {
        const qdId = filtered[0].quyetDinhId;
        setSearchCount(prev => ({
          ...prev,
          [qdId]: (prev[qdId] || 0) + 1
        }));
      }
    } catch (error) {
      message.error('Lỗi khi tra cứu văn bằng');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    data,
    searchCount,
    handleSearch
  };
};

export default useTraCuuModel;
