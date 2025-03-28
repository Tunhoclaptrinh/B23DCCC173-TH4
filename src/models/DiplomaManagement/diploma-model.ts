import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Existing Interfaces (kept from original code)
export interface DiplomaBook {
    id: string; 
    year: number;
    startDate: string;
    endDate: string;
    currentEntryNumber: number;
}

export interface GraduationDecision {
    id: string;
    decisionNumber: string;
    issuanceDate: string;
    summary: string;
    diplomaBookId: string; // Foreign key to DiplomaBook
    totalLookups: number;
}

export interface DiplomaFieldTemplate {
    id: string;
    name: string;
    dataType: 'String' | 'Number' | 'Date';
    isRequired: boolean;
    defaultValue?: string | number | Date;
}

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

export interface DiplomaLookupRecord {
    id: string;
    diplomaId: string;
    lookupDate: string;
    lookupSource: string;
}

export default () => {
    // State management for diploma-related entities (kept from original code)
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

    // Existing methods from original code (kept intact)
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

    const addDiplomaInformation = (diplomaInfo: DiplomaInformation) => {
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

    const searchDiplomas = (
        diplomaSerialNumber?: string, 
        bookEntryNumber?: number, 
        studentId?: string, 
        fullName?: string, 
        dateOfBirth?: string
    ) => {
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

    const recordDiplomaLookup = (diplomaId: string, source: string) => {
        const diplomaToLookup = diplomaInformations.find(d => d.id === diplomaId);
        if (diplomaToLookup) {
            const lookupRecord: DiplomaLookupRecord = {
                id: `LOOKUP_${Date.now()}`,
                diplomaId,
                lookupDate: new Date().toISOString(),
                lookupSource: source
            };

            const updatedLookups = [...diplomaLookupRecords, lookupRecord];
            setDiplomaLookupRecords(updatedLookups);
            localStorage.setItem('diplomaLookupRecords', JSON.stringify(updatedLookups));

            incrementDecisionLookup(diplomaToLookup.decisionId);
        }
    };

    // New Methods for Enhanced Functionality

    // Delete Methods
    const deleteDiplomaBook = (bookId: string) => {
        const updatedBooks = diplomaBooks.filter(book => book.id !== bookId);
        setDiplomaBooks(updatedBooks);
        localStorage.setItem('diplomaBooks', JSON.stringify(updatedBooks));
    };

    const deleteGraduationDecision = (decisionId: string) => {
        const updatedDecisions = graduationDecisions.filter(decision => decision.id !== decisionId);
        setGraduationDecisions(updatedDecisions);
        localStorage.setItem('graduationDecisions', JSON.stringify(updatedDecisions));
    };

    const deleteDiplomaFieldTemplate = (templateId: string) => {
        const updatedTemplates = diplomaFieldTemplates.filter(template => template.id !== templateId);
        setDiplomaFieldTemplates(updatedTemplates);
        localStorage.setItem('diplomaFieldTemplates', JSON.stringify(updatedTemplates));
    };

    const deleteDiplomaInformation = (diplomaId: string) => {
        const updatedDiplomas = diplomaInformations.filter(diploma => diploma.id !== diplomaId);
        setDiplomaInformations(updatedDiplomas);
        localStorage.setItem('diplomaInformations', JSON.stringify(updatedDiplomas));
    };

    // Advanced Search Methods
    const advancedDiplomaSearch = (
        criteria: Partial<DiplomaInformation>,
        startDate?: string,
        endDate?: string
    ) => {
        return diplomaInformations.filter(diploma => {
            const matchesCriteria = Object.entries(criteria).every(([key, value]) => 
                diploma[key as keyof DiplomaInformation] === value
            );

            const withinDateRange = (!startDate || diploma.dateOfBirth >= startDate) &&
                                    (!endDate || diploma.dateOfBirth <= endDate);

            return matchesCriteria && withinDateRange;
        });
    };

    // Aggregation Methods
    const getDiplomaStatistics = () => {
        return {
            totalDiplomas: diplomaInformations.length,
            totalBooks: diplomaBooks.length,
            totalDecisions: graduationDecisions.length,
            totalLookups: diplomaLookupRecords.length,
            diplomasByYear: diplomaInformations.reduce((acc, diploma) => {
                const book = diplomaBooks.find(b => b.id === diploma.diplomaBookId);
                if (book) {
                    acc[book.year] = (acc[book.year] || 0) + 1;
                }
                return acc;
            }, {} as Record<number, number>)
        };
    };

    // Bulk Import Methods
    const bulkImportDiplomas = (diplomas: DiplomaInformation[]) => {
        const updatedDiplomas = [...diplomaInformations, ...diplomas];
        setDiplomaInformations(updatedDiplomas);
        localStorage.setItem('diplomaInformations', JSON.stringify(updatedDiplomas));
    };

    const bulkImportGraduationDecisions = (decisions: GraduationDecision[]) => {
        const updatedDecisions = [...graduationDecisions, ...decisions];
        setGraduationDecisions(updatedDecisions);
        localStorage.setItem('graduationDecisions', JSON.stringify(updatedDecisions));
    };

    // Export Methods
    const exportDiplomaData = () => {
        return {
            diplomaBooks,
            graduationDecisions,
            diplomaFieldTemplates,
            diplomaInformations,
            diplomaLookupRecords
        };
    };

    const importDiplomaData = (data: ReturnType<typeof exportDiplomaData>) => {
        setDiplomaBooks(data.diplomaBooks);
        setGraduationDecisions(data.graduationDecisions);
        setDiplomaFieldTemplates(data.diplomaFieldTemplates);
        setDiplomaInformations(data.diplomaInformations);
        setDiplomaLookupRecords(data.diplomaLookupRecords);

        // Update localStorage
        localStorage.setItem('diplomaBooks', JSON.stringify(data.diplomaBooks));
        localStorage.setItem('graduationDecisions', JSON.stringify(data.graduationDecisions));
        localStorage.setItem('diplomaFieldTemplates', JSON.stringify(data.diplomaFieldTemplates));
        localStorage.setItem('diplomaInformations', JSON.stringify(data.diplomaInformations));
        localStorage.setItem('diplomaLookupRecords', JSON.stringify(data.diplomaLookupRecords));
    };

    return {
        // Existing exports
        diplomaBooks,
        graduationDecisions,
        diplomaFieldTemplates,
        diplomaInformations,
        diplomaLookupRecords,
        
        // Existing methods
        addDiplomaBook,
        updateDiplomaBook,
        addGraduationDecision,
        addDiplomaFieldTemplate,
        updateDiplomaFieldTemplate,
        addDiplomaInformation,
        searchDiplomas,
        recordDiplomaLookup,

        // New delete methods
        deleteDiplomaBook,
        deleteGraduationDecision,
        deleteDiplomaFieldTemplate,
        deleteDiplomaInformation,

        // New search and aggregation methods
        advancedDiplomaSearch,
        getDiplomaStatistics,

        // Bulk import/export methods
        bulkImportDiplomas,
        bulkImportGraduationDecisions,
        exportDiplomaData,
        importDiplomaData
    };
};