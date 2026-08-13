import { getResumesCollection } from "@/utils/mongo";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email parameter is required' });
        }

        const collection = await getResumesCollection();
        const data = await collection.findOne({ userEmail: email });

        // Clean up mongo _id just to prevent react serialization warning in other places
        if (data && data._id) {
            data._id = data._id.toString();
        }

        return res.status(200).json({
            success: true,
            data: data || null
        });

    } catch (error) {
        console.error('Resume GET API helper failed:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
