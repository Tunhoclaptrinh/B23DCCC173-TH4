import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const { Option } = Select;

const GraduationDecisionManagement: React.FC = () => {
    const { 
        diplomaBooks, 
        graduationDecisions, 
        addGraduationDecision 
    } = useModel('DiplomaManagement.diploma-model');
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Handle add graduation decision
    const handleSaveDecision = (values: any) => {
        const decisionData = {
            id: uuidv4(),
            decisionNumber: values.decisionNumber,
            issuanceDate: values.issuanceDate.format('YYYY-MM-DD'),
            summary: values.summary,
            diplomaBookId: values.diplomaBookId,
            totalLookups: 0 // Initialize lookup count
        };

        addGraduationDecision(decisionData);

        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Decision Number',
            dataIndex: 'decisionNumber',
            key: 'decisionNumber',
        },
        {
            title: 'Issuance Date',
            dataIndex: 'issuanceDate',
            key: 'issuanceDate',
        },
        {
            title: 'Summary',
            dataIndex: 'summary',
            key: 'summary',
        },
        {
            title: 'Diploma Book',
            dataIndex: 'diplomaBookId',
            key: 'diplomaBookId',
            render: (bookId) => {
                const book = diplomaBooks.find(b => b.id === bookId);
                return book ? `${book.year} Book` : bookId;
            }
        },
        {
            title: 'Total Lookups',
            dataIndex: 'totalLookups',
            key: 'totalLookups',
        }
    ];

    return (
        <div>
            <Button 
                type="primary" 
                style={{ marginBottom: 16 }} 
                onClick={() => {
                    form.resetFields();
                    setIsModalVisible(true);
                }}
            >
                Add Graduation Decision
            </Button>

            <Table 
                columns={columns} 
                dataSource={graduationDecisions} 
                rowKey="id" 
            />

            <Modal
                title="Add New Graduation Decision"
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveDecision}
                >
                    <Form.Item
                        name="decisionNumber"
                        label="Decision Number"
                        rules={[{ required: true, message: 'Please input decision number' }]}
                    >
                        <Input placeholder="Enter decision number" />
                    </Form.Item>

                    <Form.Item
                        name="issuanceDate"
                        label="Issuance Date"
                        rules={[{ required: true, message: 'Please select issuance date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="diplomaBookId"
                        label="Diploma Book"
                        rules={[{ required: true, message: 'Please select diploma book' }]}
                    >
                        <Select placeholder="Select Diploma Book">
                            {diplomaBooks.map(book => (
                                <Option key={book.id} value={book.id}>
                                    {book.year} Book
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="summary"
                        label="Summary"
                    >
                        <Input.TextArea rows={4} placeholder="Enter decision summary" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Graduation Decision
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default GraduationDecisionManagement;