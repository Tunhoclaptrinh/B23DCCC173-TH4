import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useDiplomaModel, { DiplomaInfo, DiplomaField } from '../../models/DiplomaManagement/diploma-model';
import DiplomaForm from '../../components/Form/DoplomaForm';

const DiplomaManagementPage: React.FC = () => {
  const { 
    diplomaInfos, 
    diplomaFields, 
    actions: { 
      addDiplomaInfo, 
      configureFields 
    } 
  } = useDiplomaModel();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFieldConfigModalVisible, setIsFieldConfigModalVisible] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState<DiplomaInfo | undefined>(undefined);
  const [newFields, setNewFields] = useState<DiplomaField[]>([]);

  const columns = [
    {
      title: 'Entry Number',
      dataIndex: 'entry_number',
      key: 'entry_number',
    },
    {
      title: 'Diploma Serial',
      dataIndex: 'diploma_serial',
      key: 'diploma_serial',
    },
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      key: 'student_id',
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      render: (date: Date) => date.toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: DiplomaInfo) => (
        <div>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setSelectedDiploma(record);
              setIsFormVisible(true);
            }}
          >
            Edit
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            style={{ marginLeft: 8 }}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  const handleDelete = (record: DiplomaInfo) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this diploma record?',
      onOk() {
        // TODO: Implement actual deletion logic
        message.success('Diploma record deleted successfully');
      }
    });
  };

  const handleAddDiploma = (diplomaInfo: DiplomaInfo) => {
    addDiplomaInfo(diplomaInfo)
      .then(() => {
        message.success('Diploma information added successfully');
        setIsFormVisible(false);
      })
      .catch(error => {
        message.error('Failed to add diploma information');
        console.error(error);
      });
  };

  const handleFieldConfiguration = () => {
    configureFields(newFields)
      .then(() => {
        message.success('Fields configured successfully');
        setIsFieldConfigModalVisible(false);
      })
      .catch(error => {
        message.error('Failed to configure fields');
        console.error(error);
      });
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: 16 
      }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setSelectedDiploma(undefined);
            setIsFormVisible(true);
          }}
        >
          Add Diploma
        </Button>
        <Button 
          onClick={() => setIsFieldConfigModalVisible(true)}
        >
          Configure Additional Fields
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={diplomaInfos} 
        rowKey="id"
      />

      <DiplomaForm 
        visible={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        onSubmit={handleAddDiploma}
        initialData={selectedDiploma}
        additionalFields={diplomaFields}
      />

      {/* Field Configuration Modal */}
      <Modal
        title="Configure Additional Fields"
        visible={isFieldConfigModalVisible}
        onOk={handleFieldConfiguration}
        onCancel={() => setIsFieldConfigModalVisible(false)}
      >
        {/* TODO: Add field configuration form */}
      </Modal>
    </div>
  );
};

export default DiplomaManagementPage;