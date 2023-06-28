import React, {useEffect, useState} from 'react';
import {db} from "../firebase";

const useCollectFirestore = (collection, condition, order = 'asc') => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        let collectionRef = db.collection(collection).orderBy('createdAt', order);
        if (condition) {
            if (!condition?.compareValue || !condition?.compareValue?.length) {
                // reset documents data
                setDocuments([]);
                return;
            }

            collectionRef = collectionRef.where(
                condition.fieldName,
                condition.operator,
                condition.compareValue
            );
        }

        const unsubscribe = collectionRef.onSnapshot((snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            setDocuments(documents);
        });

        return unsubscribe;
    }, [collection, condition]);

    return documents;
};

export default useCollectFirestore;