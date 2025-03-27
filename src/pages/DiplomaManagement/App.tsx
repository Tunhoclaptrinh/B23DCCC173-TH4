import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const DiplomaBookManagement: React.FC = () => {
    const { diplomaBooks, addDiplomaBook, updateDiplomaBook } = useModel('DiplomaManagement.diploma-model');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBook, setEditingBook] = useState<any>(null);
    const [form] = Form.useForm();

    // Handle add/edit diploma book
    const handleSaveBook = (values: any) => {
        const bookData = {
            id: editingBook ? editingBook.id : uuidv4(),
            year: values.year.year(), // Extract year from DatePicker
            startDate: values.startDate.format('YYYY-MM-DD'),
            endDate: values.endDate.format('YYYY-MM-DD'),
            currentEntryNumber: editingBook ? editingBook.currentEntryNumber : 0
        };

        if (editingBook) {
            // Edit existing book
            updateDiplomaBook(bookData);
        } else {
            // Add new book
            addDiplomaBook(bookData);
        }

        setIsModalVisible(false);
        setEditingBook(null);
        form.resetFields();
    };

    // Handle edit
    const handleEdit = (book: any) => {
        setEditingBook(book);
        form.setFieldsValue({
            year: moment().year(book.year),
            startDate: moment(book.startDate),
            endDate: moment(book.endDate)
        });
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Current Entry Number',
            dataIndex: 'currentEntryNumber',
            key: 'currentEntryNumber',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                </>
            ),
        }
    ];

    return (
        <div>
            <Button 
                type="primary" 
                style={{ marginBottom: 16 }} 
                onClick={() => {
                    setEditingBook(null); 
                    form.resetFields();
                    setIsModalVisible(true);
                }}
            >
                Add Diploma Book
            </Button>

            <Table 
                columns={columns} 
                dataSource={diplomaBooks} 
                rowKey="id" 
            />

            <Modal
                title={editingBook ? "Edit Diploma Book" : "Add New Diploma Book"}
                visible={isModalVisible}
                footer={null}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingBook(null);
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveBook}
                >
                    <Form.Item
                        name="year"
                        label="Year"
                        rules={[{ required: true, message: 'Please select the year' }]}
                    >
                        <DatePicker 
                            picker="year" 
                            style={{ width: '100%' }} 
                            placeholder="Select Year"
                        />
                    </Form.Item>

                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select start date' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            placeholder="Select Start Date"
                        />
                    </Form.Item>

                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true, message: 'Please select end date' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            placeholder="Select End Date"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingBook ? 'Update' : 'Add'} Diploma Book
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DiplomaBookManagement;