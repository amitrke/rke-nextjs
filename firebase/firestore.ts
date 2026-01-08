import { arrayUnion, deleteDoc, doc, DocumentReference, getDoc, getDocs, getFirestore, onSnapshot, query, QueryConstraint, setDoc, updateDoc } from "firebase/firestore";
import { initApp } from "./initFirebase";
import { collection, addDoc } from "firebase/firestore";

const app = initApp();
const db = getFirestore(app);

// Type-safe wrapper for Firestore documents with id and path
export type FirestoreDocument<T> = T & {
    id: string;
    path?: string;
}

type FirestoreParams = {
    path: string;
    pathSegments?: string[];
    converter?: Record<string, unknown>;
    queryConstraints?: QueryConstraint[];
}

type FirestoreSubscribe<T> = FirestoreParams & {
    updateCB: (updatedList: T[]) => void,
    unsubscribe?: () => void,
}

export type FirestoreWriteParams = FirestoreParams & {
    data: Record<string, unknown>;
    existingDocId?: string;
    newDocId?: string;
}

export type FirestoreAppendToArrayParams<T> = FirestoreParams & {
    arrayAttribute: string
    newArrayItem: T
    existingDocId?: string
}

export const write = async (params: FirestoreWriteParams): Promise<DocumentReference> => {
    let docRef = params.existingDocId ? doc(db, params.path, params.existingDocId) : undefined;
    if (params.existingDocId) {
        await updateDoc(docRef, params.data);
    }
    if (params.newDocId) {
        docRef = await doc(db, params.path, params.newDocId);
        await setDoc(docRef, params.data);
    }
    if (!params.existingDocId && !params.newDocId) {
        docRef = await addDoc(collection(db, params.path), params.data);
    }
    return docRef;
}

export const arrayAppend = async <T>(params: FirestoreAppendToArrayParams<T>): Promise<DocumentReference> => {
    const docRef = doc(db, params.path, params.existingDocId);

    await updateDoc(docRef, {
        [params.arrayAttribute]: arrayUnion(params.newArrayItem)
    });
    return docRef;
}

export const deleteDocument = async (params: FirestoreParams): Promise<{ success: boolean; error?: string }> => {
    try {
        if (!params.pathSegments || params.pathSegments.length === 0) {
            return { success: false, error: 'pathSegments is required for deleteDocument' };
        }
        await deleteDoc(doc(db, params.path, ...params.pathSegments));
        return { success: true };
    } catch (error) {
        console.error('Failed to delete document:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export const queryOnce = async<T>(params: FirestoreParams): Promise<Array<FirestoreDocument<T>>> => {
    if (!params.queryConstraints) params.queryConstraints = []
    const q = query(collection(db, params.path), ...params.queryConstraints);
    const querySnapshot = await getDocs(q);
    const resp: Array<FirestoreDocument<T>> = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data() as T;
        const firestoreDoc: FirestoreDocument<T> = {
            ...data,
            id: doc.id,
            path: doc.ref.path
        };
        resp.push(firestoreDoc);
    });
    return resp;
}

export const subscribeToCollectionUpdates = <T>(params: FirestoreSubscribe<T>) => {
    if (!params.queryConstraints) params.queryConstraints = []
    const q = query(collection(db, params.path), ...params.queryConstraints);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: FirestoreDocument<T>[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as T;
            const firestoreDoc: FirestoreDocument<T> = {
                ...data,
                id: doc.id
            };
            items.push(firestoreDoc);
        });
        params.updateCB(items);
    });
    params.unsubscribe = unsubscribe;
}

export const getDocument = async<T>(params: FirestoreParams): Promise<T | undefined> => {
    const docSnap = await getDoc(doc(db, params.path, params.pathSegments[0]));
    if (docSnap.exists()) {
        return docSnap.data() as T;
    }
    // Return undefined if document doesn't exist
    return undefined;
}
