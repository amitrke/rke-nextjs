import { doc, DocumentReference, getFirestore } from "firebase/firestore";
import { initApp } from "./initFirebase";
import { collection, addDoc } from "firebase/firestore";

const app = initApp();
const db = getFirestore(app);

type FirestoreParams = {
    path: string;
    pathSegments?: string[];
}

export type FirestoreWriteParams<T> = FirestoreParams & {
    data: T
}

export const write = async <T>(params: FirestoreWriteParams<T>): Promise<DocumentReference> => {
    const docRef = await addDoc(collection(db, params.path), params.data);
    console.log("Document written with ID: ", docRef.id);
    return docRef;
}

const read = () => {

}
