import { useState, useEffect, useCallback } from 'react';
import { message, Modal } from 'antd';

const STORAGE_KEY = 'vanbang_data';

interface Diploma {
  id: string;
  entryNumber: number;
  diplomaNumber: string;
  studentId: string;
  fullName: string;
  dateOfBirth: Date;
  graduationDecisionId: string;
  diplomaBookId: string;
  fieldValues: any[];
  createdAt: Date;
  updatedAt: Date;
}

const initialMockDiplomas: Diploma[] = [
  {
    id: 'diploma-1',
    entryNumber: 1,
    diplomaNumber: 'VB-2023-0001',
    studentId: 'SV001',
    fullName: 'Nguyễn Văn A',
    dateOfBirth: new Date('2000-01-01'),
    graduationDecisionId: 'decision-1',
    diplomaBookId: 'book-2023',
    fieldValues: [],
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-10')
  },
  {
    id: 'diploma-2',
    entryNumber: 2,
    diplomaNumber: 'VB-2023-0002',
    studentId: 'SV002',
    fullName: 'Trần Thị B',
    dateOfBirth: new Date('2000-02-02'),
    graduationDecisionId: 'decision-1',
    diplomaBookId: 'book-2023',
    fieldValues: [],
    createdAt: new Date('2023-05-11'),
    updatedAt: new Date('2023-05-11')
  }
];
 
const useDSVanBangModel = () => {
  const [danhSach, setDanhSach] = useState<Diploma[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Diploma | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback((): Diploma[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockDiplomas));
        return initialMockDiplomas;
      }
      return JSON.parse(data).map((item: any) => ({
        ...item,
        dateOfBirth: new Date(item.dateOfBirth),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }));
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Không thể tải dữ liệu từ bộ nhớ cục bộ');
      return initialMockDiplomas;
    }
  }, []);

  const saveData = useCallback((data: Diploma[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('Error saving data:', err);
      setError('Không thể lưu dữ liệu vào bộ nhớ cục bộ');
      return false;
    }
  }, []);

  const handleDelete = useCallback((id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa văn bằng này?',
        okText: 'Xóa',
        cancelText: 'Hủy',
        async onOk() {
          try {
            setLoading(true);
            const data = loadData().filter(item => item.id !== id);
            if (saveData(data)) {
              setDanhSach(data);
              message.success('Xóa văn bằng thành công');
              resolve(true);
            } else {
              resolve(false);
            }
          } catch (err) {
            message.error('Xóa văn bằng thất bại');
            resolve(false);
          } finally {
            setLoading(false);
          }
        },
        onCancel() {
          resolve(false);
        }
      });
    });
  }, [loadData, saveData]);

  const saveDiploma = useCallback((values: Partial<Diploma>, isCreate: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        setLoading(true);
        const data = loadData();
        
        if (isCreate) {
          const newDiploma: Diploma = {
            ...values as Diploma,
            id: `diploma-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          data.push(newDiploma);
          message.success('Thêm văn bằng thành công');
        } else {
          const index = data.findIndex(item => item.id === values.id);
          if (index >= 0) {
            data[index] = {
              ...data[index],
              ...values,
              updatedAt: new Date()
            };
            message.success('Cập nhật văn bằng thành công');
          }
        }

        if (saveData(data)) {
          setDanhSach(data);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        message.error('Lưu văn bằng thất bại');
        resolve(false);
      } finally {
        setLoading(false);
      }
    });
  }, [loadData, saveData]);


  

  const getDiplomaNumber = (id: string) => {
    const diploma = danhSach.find(d => d.id === id);
    return diploma ? diploma.diplomaNumber : '--';
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = loadData();
        setDanhSach(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loadData]);

  return {
    danhSach,
    getDiplomaNumber,
    loading,
    error,
    currentRecord,
    setCurrentRecord,
    handleDelete,
    saveDiploma,
    initialMockDiplomas
  };
};

export default useDSVanBangModel;