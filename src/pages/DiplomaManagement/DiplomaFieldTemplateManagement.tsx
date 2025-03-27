import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

const DiplomaFieldTemplateManagement: React.FC = () => {
    const { 
        diplomaFieldTemplates, 
        addDiplomaFieldTemplate, 
        updateDiplomaFieldTemplate 
    } = useModel('DiplomaManagement.diploma-model');
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any>(null);
    const [form] = Form.useForm();

    // Handle add/edit diploma field template
    const handleSaveTemplate = (values: any) => {
        const templateData = {
            id: editingTemplate ? editingTemplate.id : uuidv4(),
            name: values.name,
            dataType: values.dataType,
            isRequired: values.isRequired || false,
            defaultValue: values.defaultValue
        };

        if (editingTemplate) {
            updateDiplomaFieldTemplate(templateData);
        } else {
            addDiplomaFieldTemplate(templateData);
        }

        setIsModalVisible(false);
        setEditingTemplate(null);
        form.resetFields();
    };

    // Handle edit
    const handleEdit = (template: any) => {
        setEditingTemplate(template);
        form.setFieldsValue(template);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Data Type',
            dataIndex: 'dataType',
            key: 'dataType',
        },
        {
            title: 'Required',
            dataIndex: 'isRequired',
            key: 'isRequired',
            render: (isRequired: boolean) => isRequired ? 'Yes' : 'No'
        },
        {
            title: 'Default Value',
            dataIndex: 'defaultValue',
            key: 'defaultValue',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" onClick={() => handleEdit(record)}>
                    Edit
                </Button>
            ),
        }
    ];

    return (
        <div>
            <Button 
                type="primary" 
                style={{ marginBottom: 16 }} 
                onClick={() => {
                    setEditingTemplate(null); 
                    form.resetFields();
                    setIsModalVisible(true);
                }}
            >
                Add Diploma Field Template
            </Button>

            <Table 
                columns={columns} 
                dataSource={diplomaFieldTemplates} 
                rowKey="id" 
            />

            <Modal
                title={editingTemplate ? "Edit Diploma Field Template" : "Add New Diploma Field Template"}
                visible={isModalVisible}
                footer={null}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingTemplate(null);
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveTemplate}
                >
                    <Form.Item
                        name="name"
                        label="Field Name"
                        rules={[{ required: true, message: 'Please input field name' }]}
                    >
                        <Input placeholder="Enter field name" />
                    </Form.Item>

                    <Form.Item
                        name="dataType"
                        label="Data Type"
                        rules={[{ required: true, message: 'Please select data type' }]}
                    >
                        <Select placeholder="Select Data Type">
                            <Option value="String">String</Option>
                            <Option value="Number">Number</Option>
                            <Option value="Date">Date</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="isRequired"
                        label="Is Required"
                        valuePropName="checked"
                    >
                        <Input type="checkbox" />
                    </Form.Item>

                    <Form.Item
                        name="defaultValue"
                        label="Default Value"
                    >
                        <Input placeholder="Enter default value (optional)" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingTemplate ? 'Update' : 'Add'} Field Template
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DiplomaFieldTemplateManagement;