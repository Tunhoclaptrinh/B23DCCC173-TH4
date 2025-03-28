import React, { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Popconfirm, message } from 'antd';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const { Option } = Select;

const DiplomaInformationManagement: React.FC = () => {
    const { 
        diplomaInformations, 
        addDiplomaInformation, 
        deleteDiplomaInformation,
        searchDiplomas,
        advancedDiplomaSearch,
        exportDiplomaData,
        importDiplomaData,
        diplomaBooks, 
        graduationDecisions, 
        diplomaFieldTemplates 
    } = useModel('DiplomaManagement.diploma-model');
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [searchForm] = Form.useForm();
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState(diplomaInformations);

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
        message.success('Diploma Information Added Successfully');

        setIsModalVisible(false);
        form.resetFields();
    };

    // Handle delete diploma information
    const handleDelete = (diplomaId: string) => {
        deleteDiplomaInformation(diplomaId);
        message.success('Diploma Information Deleted Successfully');
        setTableData(diplomaInformations);
    };

    // Handle search
    const handleSearch = (values: any) => {
        const searchCriteria = {
            diplomaSerialNumber: values.diplomaSerialNumber,
            studentId: values.studentId,
            fullName: values.fullName,
            diplomaBookId: values.diplomaBookId,
            decisionId: values.decisionId
        };

        // Remove undefined values
        Object.keys(searchCriteria).forEach(key => 
            searchCriteria[key] === undefined && delete searchCriteria[key]
        );

        const results = advancedDiplomaSearch(searchCriteria);
        setTableData(results);
        setIsSearchModalVisible(false);
        message.success(`Found ${results.length} diploma(s)`);
    };

    // Export diploma information
    const handleExport = () => {
        const data = exportDiplomaData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'diploma_information_export.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        message.success('Diploma Information Exported Successfully');
    };

    // Import diploma information
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target?.result as string);
                importDiplomaData(jsonData);
                setTableData(diplomaInformations);
                message.success('Diploma Information Imported Successfully');
            } catch (error) {
                message.error('Failed to import diploma information');
            }
        };
        
        if (event.target.files && event.target.files.length > 0) {
            fileReader.readAsText(event.target.files[0]);
        }
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
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this diploma information?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="link" danger>Delete</Button>
                </Popconfirm>
            ),
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Button 
                        type="primary" 
                        style={{ marginRight: 8 }} 
                        onClick={() => {
                            form.resetFields();
                            setIsModalVisible(true);
                        }}
                    >
                        Add Diploma Information
                    </Button>
                    <Button 
                        type="default" 
                        style={{ marginRight: 8 }} 
                        onClick={() => setIsSearchModalVisible(true)}
                    >
                        Search Diplomas
                    </Button>
                    <Button 
                        type="default" 
                        style={{ marginRight: 8 }} 
                        onClick={handleExport}
                    >
                        Export Data
                    </Button>
                    <input 
                        type="file" 
                        accept=".json" 
                        style={{ display: 'none' }} 
                        id="import-file"
                        onChange={handleImport}
                    />
                    <label htmlFor="import-file">
                        <Button type="default" component="span">
                            Import Data
                        </Button>
                    </label>
                </div>
            </div>

            <Table 
                columns={columns} 
                dataSource={tableData} 
                rowKey="id" 
            />

            {/* Add Diploma Information Modal */}
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

            {/* Search Diplomas Modal */}
            <Modal
                title="Search Diplomas"
                visible={isSearchModalVisible}
                footer={null}
                width={600}
                onCancel={() => setIsSearchModalVisible(false)}
            >
                <Form
                    form={searchForm}
                    layout="vertical"
                    onFinish={handleSearch}
                >
                    <Form.Item
                        name="diplomaSerialNumber"
                        label="Diploma Serial Number"
                    >
                        <Input placeholder="Enter diploma serial number" />
                    </Form.Item>

                    <Form.Item
                        name="diplomaBookId"
                        label="Diploma Book"
                    >
                        <Select placeholder="Select Diploma Book" allowClear>
                            {diplomaBooks.map(book => (
                                <Option key={book.id} value={book.id}>
                                    {book.year} Book
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="studentId"
                        label="Student ID"
                    >
                        <Input placeholder="Enter student ID" />
                    </Form.Item>

                    <Form.Item
                        name="fullName"
                        label="Full Name"
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        name="decisionId"
                        label="Graduation Decision"
                    >
                        <Select placeholder="Select Graduation Decision" allowClear>
                            {graduationDecisions.map(decision => (
                                <Option key={decision.id} value={decision.id}>
                                    {decision.decisionNumber} - {decision.issuanceDate}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DiplomaInformationManagement;