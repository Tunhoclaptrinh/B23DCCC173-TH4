import React, { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const { Option } = Select;

const DiplomaInformationManagement: React.FC = () => {
    const { 
        diplomaInformations, 
        addDiplomaInformation, 
        diplomaBooks, 
        graduationDecisions, 
        diplomaFieldTemplates 
    } = useModel('DiplomaManagement.diploma-model');
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Dynamically generate form items based on field templates
    const DynamicFormFields = useMemo(() => {
        return diplomaFieldTemplates.map(template => {
            let formItem;
            switch(template.dataType) {
                case 'Date':
                    formItem = (
                        <Form.Item
                            key={template.id}
                            name={`additionalFields.${template.name}`}
                            label={template.name}
                            rules={[{ required: template.isRequired }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    );
                    break;
                case 'Number':
                    formItem = (
                        <Form.Item
                            key={template.id}
                            name={`additionalFields.${template.name}`}
                            label={template.name}
                            rules={[{ required: template.isRequired, type: 'number' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    );
                    break;
                default:
                    formItem = (
                        <Form.Item
                            key={template.id}
                            name={`additionalFields.${template.name}`}
                            label={template.name}
                            rules={[{ required: template.isRequired }]}
                        >
                            <Input />
                        </Form.Item>
                    );
            }
            return formItem;
        });
    }, [diplomaFieldTemplates]);

    // Handle add diploma information
    const handleSaveDiplomaInformation = (values: any) => {
        const diplomaInfoData = {
            id: uuidv4(),
            diplomaBookId: values.diplomaBookId,
            decisionId: values.decisionId,
            diplomaSerialNumber: values.diplomaSerialNumber,
            studentId: values.studentId,
            fullName: values.fullName,
            dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
            additionalFields: values.additionalFields || {}
        };

        addDiplomaInformation(diplomaInfoData);

        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Diploma Serial Number',
            dataIndex: 'diplomaSerialNumber',
            key: 'diplomaSerialNumber',
        },
        {
            title: 'Student ID',
            dataIndex: 'studentId',
            key: 'studentId',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
        },
        {
            title: 'Diploma Book',
            dataIndex: 'diplomaBookId',
            key: 'diplomaBookId',
            render: (bookId) => {
                const book = diplomaBooks.find(b => b.id === bookId);
                return book ? `${book.year} Book` : bookId;
            }
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
                Add Diploma Information
            </Button>

            <Table 
                columns={columns} 
                dataSource={diplomaInformations} 
                rowKey="id" 
            />

            <Modal
                title="Add New Diploma Information"
                visible={isModalVisible}
                footer={null}
                width={800}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveDiplomaInformation}
                >
                    <Form.Item
                        name="diplomaSerialNumber"
                        label="Diploma Serial Number"
                        rules={[{ required: true, message: 'Please input diploma serial number' }]}
                    >
                        <Input placeholder="Enter diploma serial number" />
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
                        name="decisionId"
                        label="Graduation Decision"
                        rules={[{ required: true, message: 'Please select graduation decision' }]}
                    >
                        <Select placeholder="Select Graduation Decision">
                            {graduationDecisions.map(decision => (
                                <Option key={decision.id} value={decision.id}>
                                    {decision.decisionNumber} - {decision.issuanceDate}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="studentId"
                        label="Student ID"
                        rules={[{ required: true, message: 'Please input student ID' }]}
                    >
                        <Input placeholder="Enter student ID" />
                    </Form.Item>

                    <Form.Item
                        name="fullName"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input full name' }]}
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                        rules={[{ required: true, message: 'Please select date of birth' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    {/* Dynamic Additional Fields */}
                    {DynamicFormFields}

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Diploma Information
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DiplomaInformationManagement;