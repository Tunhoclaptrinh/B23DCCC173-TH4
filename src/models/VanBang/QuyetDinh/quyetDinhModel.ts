import { useState, useEffect } from 'react';

interface QuyetDinh {
  id: string;
  soQd: string;
  ngayBanHanh: Date;
  trichYeu: string;
  soVanBangId: string;
  createdAt: Date;
  updatedAt: Date;
}

const initialMockQuyetDinh: QuyetDinh[] = [
  {
    id: 'decision-1',
    soQd: '123/QĐ-ĐH',
    ngayBanHanh: new Date('2025-03-01'),
    trichYeu: 'Tốt nghiệp đợt 1 năm 2025',
    soVanBangId: 'book-2025-1',
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-01')
  },
  {
    id: 'decision-2',
    soQd: '456/QĐ-ĐH',
    ngayBanHanh: new Date('2025-06-15'),
    trichYeu: 'Tốt nghiệp đợt 2 năm 2025',
    soVanBangId: 'book-2025-2',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-15')
  }
];

const useQuyetDinhModel = () => {
  const [danhSach, setDanhSach] = useState<QuyetDinh[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setDanhSach(initialMockQuyetDinh);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách quyết định');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    danhSach,
    loading,
    error
  };
};

export default useQuyetDinhModel;
