


import { useState, useEffect } from 'react';
import { DichVu, NhanVien } from '@/services/DichVu/typings';

const initialEmployee: NhanVien = {
  employee_id: 1,
  name: 'John Doe',
  age: 30,
  sokhach: 5,
  lichLamViec: {
    Monday: [{ start: "09:00", end: "17:00" }],
    Tuesday: [{ start: "09:00", end: "17:00" }],
    Wednesday: [{ start: "09:00", end: "17:00" }],
    Thursday: [{ start: "09:00", end: "17:00" }],
    Friday: [{ start: "09:00", end: "17:00" }],
    Saturday: [{ start: "09:00", end: "12:00" }],
    Sunday: [],
  },
  dichVuIds: [1, 2],
};

const danhSachDichVu: DichVu[] = [
  {
    dichvu_id: 1,
    name: "Cắt tóc nam cơ bản",
    price: 150000,
    description: "Cắt tóc theo kiểu dáng phổ thông, nhanh chóng.",
    thoiGianThucHien: 30,
  },
  {
    dichvu_id: 2,
    name: "Cắt tóc nam tạo kiểu",
    price: 250000,
    description: "Tạo kiểu tóc nam theo yêu cầu, tư vấn kiểu tóc phù hợp.",
    thoiGianThucHien: 45,
  },
  {
    dichvu_id: 3,
    name: "Gội đầu dưỡng sinh",
    price: 120000,
    description: "Gội đầu thư giãn, massage da đầu, sử dụng dầu gội thảo dược.",
    thoiGianThucHien: 60,
  },
  {
    dichvu_id: 4,
    name: "Uốn tóc nam",
    price: 400000,
    description: "Uốn tóc tạo kiểu xoăn, sóng, sử dụng sản phẩm chất lượng.",
    thoiGianThucHien: 90,
  },
    {
    dichvu_id: 5,
    name: "Nhuộm tóc nam",
    price: 350000,
    description: "Nhuộm tóc màu sắc thời trang, đa dạng lựa chọn.",
    thoiGianThucHien: 120,
  },
  {
    dichvu_id: 6,
    name: "Cạo mặt, massage",
    price: 180000,
    description: "Cạo mặt sạch sẽ, massage thư giãn da mặt.",
    thoiGianThucHien: 45,
  },
    {
    dichvu_id: 7,
    name: "Hấp tóc phục hồi",
    price: 200000,
    description: "Hấp tóc giúp tóc mềm mượt, phục hồi hư tổn.",
    thoiGianThucHien: 60,
  },
     {
    dichvu_id: 8,
    name: "Tỉa râu tạo dáng",
    price: 100000,
    description: "Tỉa râu gọn gàng, tạo dáng râu theo yêu cầu.",
    thoiGianThucHien: 30,
  }
];

// Để sử dụng trong React component, ví dụ:
// <Table dataSource={danhSachDichVu} columns={columns} rowKey="dichvu_id" />

export default () => {
  const [employee, setEmployee] = useState<NhanVien>(initialEmployee);
  const [danhSachDichVuState, setDanhSachDichVuState] = useState<DichVu[]>(danhSachDichVu);

  useEffect(() => {
    localStorage.setItem('employee', JSON.stringify(employee));
  }, [employee]);

  const getEmployee = (): NhanVien => {
    const employeeString = localStorage.getItem('employee');
    if (employeeString) {
      return JSON.parse(employeeString) as NhanVien;
    }
    return initialEmployee;
  };

  const updateEmployee = (newEmployee: NhanVien) => {
    setEmployee(newEmployee);
  };

  const addDichVu = (newDichVu: DichVu) => {
    setDanhSachDichVuState([...danhSachDichVuState, { ...newDichVu, dichvu_id: Date.now() }]);
  };

  const updateDichVu = (updatedDichVu: DichVu) => {
    setDanhSachDichVuState(
      danhSachDichVuState.map((dichVu) =>
        dichVu.dichvu_id === updatedDichVu.dichvu_id ? updatedDichVu : dichVu
      )
    );
  };

  const deleteDichVu = (dichvu_id: number) => {
    setDanhSachDichVuState(danhSachDichVuState.filter((dichVu) => dichVu.dichvu_id !== dichvu_id));
  };

  return {
    employee,
    danhSachDichVu: danhSachDichVuState,
    getEmployee,
    updateEmployee,
    addDichVu,
    updateDichVu,
    deleteDichVu,
  };
};
