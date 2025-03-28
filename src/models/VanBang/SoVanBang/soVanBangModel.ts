import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';

const STORAGE_KEY = 'diploma_books';

interface DiplomaBook {
  id: string;
  year: number;
  entryNumber: number;
  createdAt: Date;
  updatedAt?: Date;
}

const useSoVanBangModel = () => {
  const [danhSachSo, setDanhSachSo] = useState<DiplomaBook[]>([]);
  const [currentYearBook, setCurrentYearBook] = useState<{
    year: number;
    nextEntryNumber: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
    }));
  }, []);

  const saveData = useCallback((data: DiplomaBook[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    try {
      const data = loadData();
      setDanhSachSo(data);
      
      const currentYear = new Date().getFullYear();
      const currentYearData = data.filter((item: DiplomaBook) => item.year === currentYear);
      const nextEntryNumber = currentYearData.length > 0
        ? Math.max(...currentYearData.map((item: DiplomaBook) => item.entryNumber)) + 1
        : 1;

      setCurrentYearBook({
        year: currentYear,
        nextEntryNumber
      });
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  const createNewYearBook = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const data = loadData();
    const existingYearBook = data.find((item: DiplomaBook) => item.year === currentYear);

    if (existingYearBook) {
      message.error(`Sổ văn bằng năm ${currentYear} đã tồn tại`);
      return;
    }

    setCurrentYearBook({
      year: currentYear,
      nextEntryNumber: 1
    });
    message.success(`Đã mở sổ văn bằng năm ${currentYear}`);
  }, [loadData]);

  const saveDiplomaBook = useCallback(async (values: DiplomaBook, isCreate: boolean) => {
    try {
      setLoading(true);
      const data = loadData();
      
      if (isCreate) {
        const newBook: DiplomaBook = {
          ...values,
          id: `book-${Date.now()}`,
          createdAt: new Date(),
        };
        data.push(newBook);
        
        setCurrentYearBook(prev => prev ? {
          ...prev,
          nextEntryNumber: prev.nextEntryNumber + 1
        } : null);
      } else {
        const index = data.findIndex(item => item.id === values.id);
        if (index >= 0) {
          data[index] = {
            ...data[index],
            ...values
          };
        }
      }

      saveData(data);
      setDanhSachSo(data);
      message.success(isCreate ? 'Thêm văn bằng vào sổ thành công' : 'Cập nhật văn bằng thành công');
      return true;
    } catch (error) {
      message.error('Lỗi khi lưu văn bằng');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadData, saveData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const data = loadData().filter((item: DiplomaBook) => item.id !== id);
      saveData(data);
      setDanhSachSo(data);
      return true;
    } catch (error) {
      message.error('Lỗi khi xóa văn bằng');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadData, saveData]);

  return {
    danhSachSo,
    loading,
    currentYearBook,
    createNewYearBook,
    handleDelete,
    saveDiplomaBook,
  };
};

export default useSoVanBangModel;
