import { useState, useEffect } from 'react';

// Utility functions for localStorage
const LocalStorageUtils = {
  getItem: <T>(key: string, defaultValue: T): T => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  },
  
  setItem: <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Define TypeScript interfaces (same as previous model)
export interface DiplomaBook {
  id?: number;
  year: number;
  current_entry_num: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface GraduationDecision {
  id?: number;
  decision_number: string;
  issue_date: Date;
  summary?: string;
  diploma_book_id: number;
  created_at?: Date;
}

export interface DiplomaField {
  id?: number;
  diploma_info_id?: number;
  field_name: string;
  data_type: 'String' | 'Number' | 'Date';
  value_string?: string;
  value_number?: number;
  value_date?: Date;
  created_at?: Date;
}

export interface DiplomaInfo {
  id?: number;
  entry_number: number;
  diploma_serial: string;
  student_id: string;
  full_name: string;
  date_of_birth: Date;
  graduation_decision_id: number;
  diploma_book_id: number;
  created_at?: Date;
  additional_fields?: DiplomaField[];
}

export interface DiplomaLookupLog {
  id?: number;
  graduation_decision_id: number;
  lookup_count: number;
  lookup_date?: Date;
}

// Local storage keys
const STORAGE_KEYS = {
  DIPLOMA_BOOKS: 'diploma_books',
  GRADUATION_DECISIONS: 'graduation_decisions',
  DIPLOMA_INFOS: 'diploma_infos',
  DIPLOMA_FIELDS: 'diploma_fields',
  DIPLOMA_LOOKUP_LOGS: 'diploma_lookup_logs'
};

export default function useDiplomaModel() {
  // State with localStorage initialization
  const [diplomaBooks, setDiplomaBooks] = useState<DiplomaBook[]>(() => 
    LocalStorageUtils.getItem(STORAGE_KEYS.DIPLOMA_BOOKS, [])
  );
  
  const [graduationDecisions, setGraduationDecisions] = useState<GraduationDecision[]>(() => 
    LocalStorageUtils.getItem(STORAGE_KEYS.GRADUATION_DECISIONS, [])
  );
  
  const [diplomaInfos, setDiplomaInfos] = useState<DiplomaInfo[]>(() => 
    LocalStorageUtils.getItem(STORAGE_KEYS.DIPLOMA_INFOS, [])
  );
  
  const [diplomaFields, setDiplomaFields] = useState<DiplomaField[]>(() => 
    LocalStorageUtils.getItem(STORAGE_KEYS.DIPLOMA_FIELDS, [])
  );
  
  const [diplomaLookupLogs, setDiplomaLookupLogs] = useState<DiplomaLookupLog[]>(() => 
    LocalStorageUtils.getItem(STORAGE_KEYS.DIPLOMA_LOOKUP_LOGS, [])
  );

  // Update localStorage whenever state changes
  useEffect(() => {
    LocalStorageUtils.setItem(STORAGE_KEYS.DIPLOMA_BOOKS, diplomaBooks);
  }, [diplomaBooks]);

  useEffect(() => {
    LocalStorageUtils.setItem(STORAGE_KEYS.GRADUATION_DECISIONS, graduationDecisions);
  }, [graduationDecisions]);

  useEffect(() => {
    LocalStorageUtils.setItem(STORAGE_KEYS.DIPLOMA_INFOS, diplomaInfos);
  }, [diplomaInfos]);

  useEffect(() => {
    LocalStorageUtils.setItem(STORAGE_KEYS.DIPLOMA_FIELDS, diplomaFields);
  }, [diplomaFields]);

  useEffect(() => {
    LocalStorageUtils.setItem(STORAGE_KEYS.DIPLOMA_LOOKUP_LOGS, diplomaLookupLogs);
  }, [diplomaLookupLogs]);

  // Generate unique ID
  const generateUniqueId = (items: any[]) => {
    return items.length > 0 ? Math.max(...items.map(item => item.id || 0)) + 1 : 1;
  };

  // Function to get or create diploma book for current year
  const getCurrentOrCreateDiplomaBook = () => {
    const currentYear = new Date().getFullYear();
    let book = diplomaBooks.find(b => b.year === currentYear);
    
    if (!book) {
      // Create new diploma book for current year
      book = {
        id: generateUniqueId(diplomaBooks),
        year: currentYear,
        current_entry_num: 1,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Update state and localStorage
      const updatedBooks = [...diplomaBooks, book];
      setDiplomaBooks(updatedBooks);
      LocalStorageUtils.setItem(STORAGE_KEYS.DIPLOMA_BOOKS, updatedBooks);
    }
    
    return book;
  };

  // Function to add new graduation decision
  const addGraduationDecision = (decision: GraduationDecision) => {
    decision.id = generateUniqueId(graduationDecisions);
    decision.created_at = new Date();
    
    const updatedDecisions = [...graduationDecisions, decision];
    setGraduationDecisions(updatedDecisions);
    return decision;
  };

  // Function to add diploma info
  const addDiplomaInfo = (diplomaInfo: DiplomaInfo) => {
    // Get or create current year's diploma book
    const book = getCurrentOrCreateDiplomaBook();
    
    // Set entry number and book ID
    diplomaInfo.id = generateUniqueId(diplomaInfos);
    diplomaInfo.entry_number = book.current_entry_num;
    diplomaInfo.diploma_book_id = book.id!;
    diplomaInfo.created_at = new Date();

    // Update book's entry number
    const updatedBooks = diplomaBooks.map(b => 
      b.id === book.id 
        ? {...b, current_entry_num: b.current_entry_num + 1, updated_at: new Date()} 
        : b
    );
    setDiplomaBooks(updatedBooks);

    // Update diploma infos
    const updatedDiplomaInfos = [...diplomaInfos, diplomaInfo];
    setDiplomaInfos(updatedDiplomaInfos);

    return diplomaInfo;
  };

  // Function to update diploma info
  const updateDiplomaInfo = (updatedDiploma: DiplomaInfo) => {
    const updatedDiplomaInfos = diplomaInfos.map(diploma => 
      diploma.id === updatedDiploma.id ? updatedDiploma : diploma
    );
    setDiplomaInfos(updatedDiplomaInfos);
    return updatedDiploma;
  };

  // Function to delete diploma info
  const deleteDiplomaInfo = (diplomaId: number) => {
    const updatedDiplomaInfos = diplomaInfos.filter(diploma => diploma.id !== diplomaId);
    setDiplomaInfos(updatedDiplomaInfos);
  };

  // Function to add/configure diploma fields
  const configureFields = (fields: DiplomaField[]) => {
    // Add unique IDs to new fields
    const configuredFields = fields.map(field => ({
      ...field,
      id: generateUniqueId(diplomaFields)
    }));
    
    setDiplomaFields(configuredFields);
    return configuredFields;
  };

  // Function to log diploma lookups
  const logDiplomaLookup = (graduationDecisionId: number) => {
    const existingLog = diplomaLookupLogs.find(
      log => log.graduation_decision_id === graduationDecisionId
    );

    let updatedLogs;
    if (existingLog) {
      // Increment existing log
      updatedLogs = diplomaLookupLogs.map(log => 
        log.graduation_decision_id === graduationDecisionId
          ? {...log, lookup_count: log.lookup_count + 1, lookup_date: new Date()}
          : log
      );
    } else {
      // Create new log
      const newLog: DiplomaLookupLog = {
        id: generateUniqueId(diplomaLookupLogs),
        graduation_decision_id: graduationDecisionId,
        lookup_count: 1,
        lookup_date: new Date()
      };
      updatedLogs = [...diplomaLookupLogs, newLog];
    }

    setDiplomaLookupLogs(updatedLogs);
    return updatedLogs;
  };

  // Search function for diplomas
  const searchDiplomas = (params: Partial<DiplomaInfo>) => {
    return diplomaInfos.filter(diploma => {
      let matchCount = 0;
      
      if (params.diploma_serial && diploma.diploma_serial === params.diploma_serial) matchCount++;
      if (params.entry_number && diploma.entry_number === params.entry_number) matchCount++;
      if (params.student_id && diploma.student_id === params.student_id) matchCount++;
      if (params.full_name && diploma.full_name.toLowerCase().includes(params.full_name.toLowerCase())) matchCount++;
      if (params.date_of_birth && 
          new Date(diploma.date_of_birth).toDateString() === new Date(params.date_of_birth).toDateString()) 
        matchCount++;

      return matchCount >= 2;
    });
  };

  // Clear all data (for testing/reset)
  const clearAllData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    setDiplomaBooks([]);
    setGraduationDecisions([]);
    setDiplomaInfos([]);
    setDiplomaFields([]);
    setDiplomaLookupLogs([]);
  };

  return {
    diplomaBooks,
    graduationDecisions,
    diplomaInfos,
    diplomaFields,
    diplomaLookupLogs,
    actions: {
      getCurrentOrCreateDiplomaBook,
      addGraduationDecision,
      addDiplomaInfo,
      updateDiplomaInfo,
      deleteDiplomaInfo,
      configureFields,
      searchDiplomas,
      logDiplomaLookup,
      clearAllData
    }
  };
}