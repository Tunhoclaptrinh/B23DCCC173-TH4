import React, { useState } from 'react';
import { 
    Form, 
    Input, 
    Button, 
    Table, 
    Card, 
    DatePicker, 
    Select,
    Typography,
    Descriptions
} from 'antd';
import { useModel } from 'umi';

const { Title } = Typography;
const { Option } = Select;

const DiplomaLookup: React.FC = () => {
    const { 
        searchDiplomas, 
        diplomaFieldTemplates, 
        diplomaBooks, 
        graduationDecisions,
        recordDiplomaLookup 
    } = useModel('DiplomaManagement.diploma-model');
    
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDiploma, setSelectedDiploma] = useState(null);
    const [form] = Form.useForm();

    const handleSearch = () => {
        form.validateFields()
            .then(values => {
                const results = searchDiplomas(
                    values.diplomaSerialNumber,
                    values.bookEntryNumber ? parseInt(values.bookEntryNumber) : undefined,
                    values.studentId,
                    values.fullName,
                    values.dateOfBirth?.format('YYYY-MM-DD')
                );
                setSearchResults(results);
                setSelectedDiploma(null);
            });
    };

    const handleViewDetails = (diploma) => {
        // Record lookup for the specific diploma
        recordDiplomaLookup(diploma.id, 'Diploma Lookup Page');
        setSelectedDiploma(diploma);
    };

    const columns = [
        { 
            title: 'Diploma Serial Number', 
            dataIndex: 'diplomaSerialNumber', 
            key: 'diplomaSerialNumber' 
        },
        { 
            title: 'Book Entry Number', 
            dataIndex: 'bookEntryNumber', 
            key: 'bookEntryNumber' 
        },
        { 
            title: 'Full Name', 
            dataIndex: 'fullName', 
            key: 'fullName' 
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button onClick={() => handleViewDetails(record)}>
                    View Details
                </Button>
            )
        }
    ];

    const renderAdditionalFields = () => {
        if (!selectedDiploma) return null;

        return diplomaFieldTemplates.map(template => {
            const value = selectedDiploma.additionalFields?.[template.name];
            return value ? (
                <Descriptions.Item key={template.id} label={template.name}>
                    {value}
                </Descriptions.Item>
            ) : null;
        }).filter(Boolean);
    };

    return (
        <Card title="Diploma Lookup">
            <Form form={form} layout="vertical">
                <Form.Item name="diplomaSerialNumber" label="Diploma Serial Number">
                    <Input placeholder="Enter diploma serial number" />
                </Form.Item>
                
                <Form.Item name="bookEntryNumber" label="Book Entry Number">
                    <Input type="number" placeholder="Enter book entry number" />
                </Form.Item>
                
                <Form.Item name="studentId" label="Student ID">
                    <Input placeholder="Enter student ID" />
                </Form.Item>
                
                <Form.Item name="fullName" label="Full Name">
                    <Input placeholder="Enter full name" />
                </Form.Item>
                
                <Form.Item name="dateOfBirth" label="Date of Birth">
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                
                <Button type="primary" onClick={handleSearch}>
                    Search Diplomas
                </Button>
            </Form>

            <Table 
                style={{ marginTop: 16 }}
                columns={columns} 
                dataSource={searchResults} 
                rowKey="id"
            />

            {selectedDiploma && (
                <Card style={{ marginTop: 16 }}>
                    <Title level={4}>Diploma Details</Title>
                    <Descriptions bordered>
                        <Descriptions.Item label="Diploma Serial Number">
                            {selectedDiploma.diplomaSerialNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label="Student ID">
                            {selectedDiploma.studentId}
                        </Descriptions.Item>
                        <Descriptions.Item label="Full Name">
                            {selectedDiploma.fullName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">
                            {selectedDiploma.dateOfBirth}
                        </Descriptions.Item>
                        <Descriptions.Item label="Book Entry Number">
                            {selectedDiploma.bookEntryNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label="Diploma Book">
                            {diplomaBooks.find(b => b.id === selectedDiploma.diplomaBookId)?.year} Book
                        </Descriptions.Item>
                        <Descriptions.Item label="Graduation Decision">
                            {graduationDecisions.find(d => d.id === selectedDiploma.decisionId)?.decisionNumber}
                        </Descriptions.Item>
                        
                        {renderAdditionalFields()}
                    </Descriptions>
                </Card>
            )}
        </Card>
    );
};

export default DiplomaLookup;