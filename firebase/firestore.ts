import { AddPrefixToKeys, arrayUnion, deleteDoc, doc, DocumentData, DocumentReference, getDoc, getDocs, getFirestore, onSnapshot, query, QueryConstraint, QuerySnapshot, updateDoc } from "firebase/firestore";
import { initApp } from "./initFirebase";
import { collection, addDoc } from "firebase/firestore";

const app = initApp();
const db = getFirestore(app);

type FirestoreParams = {
    path: string;
    pathSegments?: string[];
    converter?: any;
    queryConstraints?: QueryConstraint[];
}

type FirestoreSubscribe<T> = FirestoreParams & {
    updateCB: (updatedList: T[]) => void,
    unsubscribe?: () => void,
}

export type FirestoreWriteParams<T> = FirestoreParams & {
    data: any;
    existingDocId?: string;
}

export type FirestoreAppendToArrayParams<T> = FirestoreParams & {
    arrayAttribute: string
    newArrayItem: T
    existingDocId?: string
}

export const write = async <T>(params: FirestoreWriteParams<T>): Promise<DocumentReference> => {
    const docRef = params.existingDocId ? doc(db, params.path, params.existingDocId) : await addDoc(collection(db, params.path), params.data);
    if (params.existingDocId) {
        await updateDoc(docRef, params.data);
    }
    console.debug("Document written with ID: ", docRef.id);
    return docRef;
}

export const arrayAppend = async <T>(params: FirestoreAppendToArrayParams<T>): Promise<DocumentReference> => {
    const docRef = doc(db, params.path, params.existingDocId);

    await updateDoc(docRef, {
        [params.arrayAttribute]: arrayUnion(params.newArrayItem)
    });
    console.debug("Document array updated");
    return docRef;
}

export const deleteDocument = async (params: FirestoreParams) => {
    await deleteDoc(doc(db, params.path));
}

export const queryOnce = async<T>(params: FirestoreParams): Promise<Array<T>> => {
    if (!params.queryConstraints) params.queryConstraints = []
    const q = query(collection(db, params.path), ...params.queryConstraints);
    if (params.converter) {
        q.withConverter(params.converter);
    }
    const querySnapshot = await getDocs(q);
    const resp: Array<T> = [];
    querySnapshot.forEach((doc) => {
        const item = doc.data();
        item['id'] = doc.id;
        item['path'] = doc.ref.path;
        resp.push(<T>item)
    });
    return resp;
}

export const subscribeToCollectionUpdates = <T>(params: FirestoreSubscribe<T>) => {
    if (!params.queryConstraints) params.queryConstraints = []
    const q = query(collection(db, params.path), ...params.queryConstraints);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items:T[] = [];
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            item['id'] = doc.id;
            items.push(<T>item);
        });
        params.updateCB(items);
    });
    params.unsubscribe = unsubscribe;
}

export const getDocument = async<T>(params: FirestoreParams): Promise<T | undefined> => {
    const docSnap = await getDoc(doc(db, params.path, params.pathSegments[0]));
    if (docSnap.exists()) {
        return <T>docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}
