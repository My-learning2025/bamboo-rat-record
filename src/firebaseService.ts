import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Interface for Record Data
export interface RecordData {
    id?: string; // Firebase auto-generated document ID
    name: string; // รหัสหนูไผ่ เช่น A0001
    status: string; // สถานะ เช่น กำลังตั้งครรภ์, ไก่ปลาน้อม, กำลังผสมพันธุ์
    owner: string; // เจ้าของ
    breedingDate: string; // วันผสมพันธุ์
    birthDate: string; // วันเกิด
    separation_date: string; // วันที่แยกออกจากแม่
    estrus_date: string; // วันที่ดิ้นเอา (estrus)
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

// Collection name
const COLLECTION_NAME = 'bamboo_rat_records';

// Get all records
export const getAllRecords = async (): Promise<RecordData[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const records: RecordData[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            records.push({
                id: doc.id, // Firebase auto-generated document ID
                name: data.name,
                status: data.status,
                owner: data.owner,
                breedingDate: data.breedingDate,
                birthDate: data.birthDate,
                separation_date: data.separation_date,
                estrus_date: data.estrus_date,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            });
        });

        return records;
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error;
    }
};

// Add a new record
export const addRecord = async (recordData: Omit<RecordData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
        const now = Timestamp.now();
        const docData = {
            ...recordData,
            createdAt: now,
            updatedAt: now
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
        return docRef.id; // Return Firebase auto-generated document ID
    } catch (error) {
        console.error('Error adding record:', error);
        throw error;
    }
};

// Update a record
export const updateRecord = async (documentId: string, recordData: Partial<RecordData>): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, documentId);
        const updateData = {
            ...recordData,
            updatedAt: Timestamp.now()
        };

        await updateDoc(docRef, updateData);
    } catch (error) {
        console.error('Error updating record:', error);
        throw error;
    }
};

// Delete a record
export const deleteRecord = async (documentId: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, documentId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting record:', error);
        throw error;
    }
};

// Get records by owner
export const getRecordsByOwner = async (owner: string): Promise<RecordData[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('owner', '==', owner),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const records: RecordData[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            records.push({
                id: doc.id, // Firebase auto-generated document ID
                name: data.name,
                status: data.status,
                owner: data.owner,
                breedingDate: data.breedingDate,
                birthDate: data.birthDate,
                separation_date: data.separation_date,
                estrus_date: data.estrus_date,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            });
        });

        return records;
    } catch (error) {
        console.error('Error fetching records by owner:', error);
        throw error;
    }
};

// Get records by status - Remove this function as we no longer have status field
// This function is no longer needed as the new interface doesn't have status field

// Get records by status
export const getRecordsByStatus = async (status: string): Promise<RecordData[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('status', '==', status),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const records: RecordData[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            records.push({
                id: doc.id, // Firebase auto-generated document ID
                name: data.name,
                status: data.status,
                owner: data.owner,
                breedingDate: data.breedingDate,
                birthDate: data.birthDate,
                separation_date: data.separation_date,
                estrus_date: data.estrus_date,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            });
        });

        return records;
    } catch (error) {
        console.error('Error fetching records by status:', error);
        throw error;
    }
};

// Get one record by Firebase document ID
export const getOneRecord = async (documentId: string): Promise<RecordData | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id, // Firebase auto-generated document ID
                name: data.name,
                status: data.status,
                owner: data.owner,
                breedingDate: data.breedingDate,
                birthDate: data.birthDate,
                separation_date: data.separation_date,
                estrus_date: data.estrus_date,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching single record:', error);
        throw error;
    }
};
