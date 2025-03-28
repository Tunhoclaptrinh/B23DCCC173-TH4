import React, { useState } from 'react';
import { 
    Table, 
    Button, 
    Modal, 
    Form, 
    Input, 
    DatePicker, 
    Select, 
    message, 
    Popconfirm 
} from 'antd';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const { Option } = Select;

const GraduationDecisionManagement: React.FC = () => {
    const { 
        diplomaBooks, 
        graduationDecisions, 
        addGraduationDecision,
        deleteGraduationDecision,
        getDiplomaStatistics
    } = useModel('DiplomaManagement.diploma-model');
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isViewStatsModalVisible, setIsViewStatsModalVisible] = useState(false);
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
        message.success('Graduation Decision Added Successfully');
    };

    // Handle delete graduation decision
    const handleDeleteDecision = (decisionId: string) => {
        deleteGraduationDecision(decisionId);
        message.success('Graduation Decision Deleted Successfully');
    };

    // Get diploma statistics
    const diplomaStats = getDiplomaStatistics();

    const columns = [
        {
            title: 'Graduation Decision Title',
            key: 'graduationDecisionTitle',
            render: (text, record) => {
                // Format the title as "Decision Number - Issuance Date"
                const formattedDate = moment(record.issuanceDate).format('YYYY-MM-DD');
                return <strong>{`${record.decisionNumber} - ${formattedDate}`}</strong>;
            },
        },
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
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this graduation decision?"
                    onConfirm={() => handleDeleteDecision(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="link" danger>Delete</Button>
                </Popconfirm>
            ),
        }
    ];

    // Rest of the component remains the same as in the previous version
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Button 
                    type="primary" 
                    onClick={() => {
                        form.resetFields();
                        setIsModalVisible(true);
                    }}
                >
                    Add Graduation Decision
                </Button>
                <Button 
                    type="default" 
                    onClick={() => setIsViewStatsModalVisible(true)}
                >
                    View Diploma Statistics
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={graduationDecisions} 
                rowKey="id" 
            />

            {/* Modal content remains the same */}
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

            {/* Statistics Modal remains the same */}
            <Modal
                title="Diploma Statistics"
                visible={isViewStatsModalVisible}
                footer={null}
                onCancel={() => setIsViewStatsModalVisible(false)}
            >
                <div>
                    <p><strong>Total Diplomas:</strong> {diplomaStats.totalDiplomas}</p>
                    <p><strong>Total Books:</strong> {diplomaStats.totalBooks}</p>
                    <p><strong>Total Graduation Decisions:</strong> {diplomaStats.totalDecisions}</p>
                    <p><strong>Total Lookups:</strong> {diplomaStats.totalLookups}</p>
                    
                    <h3>Diplomas by Year:</h3>
                    <ul>
                        {Object.entries(diplomaStats.diplomasByYear).map(([year, count]) => (
                            <li key={year}>{year}: {count} diplomas</li>
                        ))}
                    </ul>
                </div>
            </Modal>
        </div>
    );
};

export default GraduationDecisionManagement;