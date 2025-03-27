import { useState } from 'react';

// Diploma Book Interface
export interface DiplomaBook {
    id: string;
    year: number;
    startDate: string;
    endDate: string;
    currentEntryNumber: number;
}

// Graduation Decision Interface
export interface GraduationDecision {
    id: string;
    decisionNumber: string;
    issuanceDate: string;
    summary: string;
    diplomaBookId: string;
    totalLookups: number;
}

// Diploma Field Template Interface
export interface DiplomaFieldTemplate {
    id: string;
    name: string;
    dataType: 'String' | 'Number' | 'Date';
    isRequired: boolean;
    defaultValue?: string | number | Date;
}

// Diploma Information Interface
export interface DiplomaInformation {
    id: string;
    diplomaBookId: string;
    decisionId: string;
    bookEntryNumber: number;
    diplomaSerialNumber: string;
    studentId: string;
    fullName: string;
    dateOfBirth: string;
    additionalFields: Record<string, string | number | Date>;
}

// Diploma Lookup Record Interface
export interface DiplomaLookupRecord {
    id: string;
    diplomaId: string;
    lookupDate: string;
    lookupSource: string;
}

export default () => {
    // State management for diploma-related entities
    const [diplomaBooks, setDiplomaBooks] = useState<DiplomaBook[]>(() => {
        const storedBooks = localStorage.getItem('diplomaBooks');
        return storedBooks ? JSON.parse(storedBooks) : [];
    });

    const [graduationDecisions, setGraduationDecisions] = useState<GraduationDecision[]>(() => {
        const storedDecisions = localStorage.getItem('graduationDecisions');
        return storedDecisions ? JSON.parse(storedDecisions) : [];
    });

    const [diplomaFieldTemplates, setDiplomaFieldTemplates] = useState<DiplomaFieldTemplate[]>(() => {
        const storedTemplates = localStorage.getItem('diplomaFieldTemplates');
        return storedTemplates ? JSON.parse(storedTemplates) : [];
    });

    const [diplomaInformations, setDiplomaInformations] = useState<DiplomaInformation[]>(() => {
        const storedDiplomas = localStorage.getItem('diplomaInformations');
        return storedDiplomas ? JSON.parse(storedDiplomas) : [];
    });

    const [diplomaLookupRecords, setDiplomaLookupRecords] = useState<DiplomaLookupRecord[]>(() => {
        const storedLookups = localStorage.getItem('diplomaLookupRecords');
        return storedLookups ? JSON.parse(storedLookups) : [];
    });

    // Diploma Book Management
    const addDiplomaBook = (book: DiplomaBook) => {
        const updatedBooks = [...diplomaBooks, book];
        setDiplomaBooks(updatedBooks);
        localStorage.setItem('diplomaBooks', JSON.stringify(updatedBooks));
    };

    const updateDiplomaBook = (updatedBook: DiplomaBook) => {
        const updatedBooks = diplomaBooks.map(book => 
            book.id === updatedBook.id ? updatedBook : book
        );
        setDiplomaBooks(updatedBooks);
        localStorage.setItem('diplomaBooks', JSON.stringify(updatedBooks));
    };

    // Graduation Decision Management
    const addGraduationDecision = (decision: GraduationDecision) => {
        const updatedDecisions = [...graduationDecisions, decision];
        setGraduationDecisions(updatedDecisions);
        localStorage.setItem('graduationDecisions', JSON.stringify(updatedDecisions));
    };

    const incrementDecisionLookup = (decisionId: string) => {
        const updatedDecisions = graduationDecisions.map(decision => 
            decision.id === decisionId 
                ? { ...decision, totalLookups: (decision.totalLookups || 0) + 1 }
                : decision
        );
        setGraduationDecisions(updatedDecisions);
        localStorage.setItem('graduationDecisions', JSON.stringify(updatedDecisions));
    };

    // Diploma Field Template Management
    const addDiplomaFieldTemplate = (template: DiplomaFieldTemplate) => {
        const updatedTemplates = [...diplomaFieldTemplates, template];
        setDiplomaFieldTemplates(updatedTemplates);
        localStorage.setItem('diplomaFieldTemplates', JSON.stringify(updatedTemplates));
    };

    const updateDiplomaFieldTemplate = (updatedTemplate: DiplomaFieldTemplate) => {
        const updatedTemplates = diplomaFieldTemplates.map(template => 
            template.id === updatedTemplate.id ? updatedTemplate : template
        );
        setDiplomaFieldTemplates(updatedTemplates);
        localStorage.setItem('diplomaFieldTemplates', JSON.stringify(updatedTemplates));
    };

    // Diploma Information Management
    const addDiplomaInformation = (diplomaInfo: DiplomaInformation) => {
        // Ensure unique book entry number within the diploma book
        const book = diplomaBooks.find(b => b.id === diplomaInfo.diplomaBookId);
        if (book) {
            const nextEntryNumber = book.currentEntryNumber + 1;
            book.currentEntryNumber = nextEntryNumber;
            updateDiplomaBook(book);

            const updatedDiplomas = [...diplomaInformations, {
                ...diplomaInfo,
                bookEntryNumber: nextEntryNumber
            }];
            setDiplomaInformations(updatedDiplomas);
            localStorage.setItem('diplomaInformations', JSON.stringify(updatedDiplomas));
        }
    };

    // Diploma Lookup
    const searchDiplomas = (
        diplomaSerialNumber?: string, 
        bookEntryNumber?: number, 
        studentId?: string, 
        fullName?: string, 
        dateOfBirth?: string
    ) => {
        // Validation: At least two parameters must be provided
        const providedParams = [
            diplomaSerialNumber, 
            bookEntryNumber, 
            studentId, 
            fullName, 
            dateOfBirth
        ].filter(param => param !== undefined && param !== null);

        if (providedParams.length < 2) {
            throw new Error('Please provide at least two search parameters');
        }

        return diplomaInformations.filter(diploma => 
            (!diplomaSerialNumber || diploma.diplomaSerialNumber === diplomaSerialNumber) &&
            (!bookEntryNumber || diploma.bookEntryNumber === bookEntryNumber) &&
            (!studentId || diploma.studentId === studentId) &&
            (!fullName || diploma.fullName.toLowerCase().includes(fullName.toLowerCase())) &&
            (!dateOfBirth || diploma.dateOfBirth === dateOfBirth)
        );
    };

    // Record Diploma Lookup
    const recordDiplomaLookup = (diplomaId: string, source: string) => {
        const diplomaToLookup = diplomaInformations.find(d => d.id === diplomaId);
        if (diplomaToLookup) {
            // Create lookup record
            const lookupRecord: DiplomaLookupRecord = {
                id: `LOOKUP_${Date.now()}`,
                diplomaId,
                lookupDate: new Date().toISOString(),
                lookupSource: source
            };

            // Add lookup record
            const updatedLookups = [...diplomaLookupRecords, lookupRecord];
            setDiplomaLookupRecords(updatedLookups);
            localStorage.setItem('diplomaLookupRecords', JSON.stringify(updatedLookups));

            // Increment lookup count for associated graduation decision
            incrementDecisionLookup(diplomaToLookup.decisionId);
        }
    };

    return {
        // Expose all state and methods
        diplomaBooks,
        graduationDecisions,
        diplomaFieldTemplates,
        diplomaInformations,
        diplomaLookupRecords,
        
        // Diploma Book Methods
        addDiplomaBook,
        updateDiplomaBook,
        
        // Graduation Decision Methods
        addGraduationDecision,
        
        // Diploma Field Template Methods
        addDiplomaFieldTemplate,
        updateDiplomaFieldTemplate,
        
        // Diploma Information Methods
        addDiplomaInformation,
        
        // Lookup Methods
        searchDiplomas,
        recordDiplomaLookup
    };
};