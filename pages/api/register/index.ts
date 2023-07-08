import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
const bcrypt = require('bcrypt')

// POST /api/register
// Required fields in body: username, password, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { username, password, email,imageUrl } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //TODO verify the email and username are unique?
    const result = await prisma.user.create({
        data: {
            name: username,
            password: hashedPassword,
            email: email,
            image: imageUrl
        },
    });

    res.json(result);
}
