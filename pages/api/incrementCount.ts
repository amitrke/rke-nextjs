import { NextApiRequest, NextApiResponse } from 'next';
import { ref, runTransaction } from 'firebase/database';
import { getFirebaseDatabase } from '../../firebase/initFirebase';

const incrementCount = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    const database = getFirebaseDatabase();
    const countRef = ref(database, `counts/${req.query.id as string}`);

    const result = await runTransaction(countRef, (count) => {
        if (count === null) {
            return 1;
        }
        return count + 1;
    });

    return res.status(200).json({
        total: result.snapshot.val(),
    });
};

export default incrementCount;
