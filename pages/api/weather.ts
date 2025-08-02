import { NextApiRequest, NextApiResponse } from 'next';
import { getDocument } from '../../firebase/firestore';
import { Weather } from '../weather/[id]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const weather = await getDocument<Weather>({ path: `weather`, pathSegments: ['roorkee-in'] });
        res.setHeader('Cache-Control', 's-maxage=3600'); // Cache for 1 hour
        res.status(200).json(weather);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
}
