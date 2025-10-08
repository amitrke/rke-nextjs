import { NextApiRequest, NextApiResponse } from 'next';
import { ref, get } from 'firebase/database';
import { getFirebaseDatabase } from '../../firebase/initFirebase';

const fetchCountAPI = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    const database = getFirebaseDatabase();
    const countRef = ref(database, `counts/${req.query.id as string}`);

    const snapshot = await get(countRef);

    return res.status(200).json({
        total: snapshot.val()
    });
}

export default fetchCountAPI;