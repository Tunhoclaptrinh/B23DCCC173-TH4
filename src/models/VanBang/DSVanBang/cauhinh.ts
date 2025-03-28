
export default () => {
  
  type FieldType = {
    id: string;
    name: string;
    type: 'String' | 'Number' | 'Date';
  };
  
  const LOCAL_STORAGE_KEY = 'vanbang_fields_config';
  
  const getFieldsConfig = (): FieldType[] => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Dân tộc', type: 'String' },
      { id: '2', name: 'Nơi sinh', type: 'String' },
    ];
  };
  
  const saveFieldsConfig = (fields: FieldType[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fields));
  };
  
  const addField = (fields: FieldType[], newField: Omit<FieldType, 'id'>): FieldType[] => {
    const fieldWithId = { ...newField, id: Date.now().toString() };
    const updatedFields = [...fields, fieldWithId];
    saveFieldsConfig(updatedFields);
    return updatedFields;
  };
  
  const updateField = (fields: FieldType[], id: string, updatedField: Partial<FieldType>): FieldType[] => {
    const updatedFields = fields.map(field => 
      field.id === id ? { ...field, ...updatedField } : field
    );
    saveFieldsConfig(updatedFields);
    return updatedFields;
  };
  
  const deleteField = (fields: FieldType[], id: string): FieldType[] => {
    const updatedFields = fields.filter(field => field.id !== id);
    saveFieldsConfig(updatedFields);
    return updatedFields;
  };
  
  return {
    // FieldType,
    getFieldsConfig,
    addField,
    updateField,
    deleteField
  };
};
