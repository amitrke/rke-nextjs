import { AddPrefixToKeys, arrayUnion, doc, DocumentData, DocumentReference, getDocs, getFirestore, query, QuerySnapshot, updateDoc } from "firebase/firestore";
import { initApp } from "./initFirebase";
import { collection, addDoc } from "firebase/firestore";

const app = initApp();
const db = getFirestore(app);

type FirestoreParams = {
    path: string;
    pathSegments?: string[];
    converter?: any;
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
        [params.arrayAttribute] : arrayUnion(params.newArrayItem)
    });
    console.debug("Document array updated");
    return docRef;
}

const read = () => {

}

export const queryOnce = async<T>(params: FirestoreParams):Promise<Array<T>> => {
    const q = query(collection(db, params.path));
    if (params.converter) {
        q.withConverter(params.converter);
    }
    const querySnapshot = await getDocs(q);
    const resp:Array<T> = [];
    querySnapshot.forEach((doc) => {
        const item = doc.data();
        item['id'] = doc.id;
        item['path'] = doc.ref.path;
        resp.push(<T>item)
    });
    return resp;
}
