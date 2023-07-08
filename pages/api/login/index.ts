import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// POST /api/login
// Required fields in body: username,password
// This request is POST and not GET because in GET there is no option to add body AFAIK - TODO DELETE?
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body;
    const userInDatabase = await prisma.user.findFirst({
        where: {
            name: username,
        },
    });
    const imageUrl = userInDatabase?.image ?? "";

    if (!userInDatabase) {
        res.status(404).send({ message: "User isn't exist" });
    }
    else if (await bcrypt.compare(password, userInDatabase.password)) {
        const userForToken = {
            username: userInDatabase.name,
            id: userInDatabase.id,
            email: userInDatabase.email
        }

        const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 10 }) //TODO change from 10 secs

        res
            .status(200)
            .send({ token, name: userInDatabase.name, email: userInDatabase.email, imageUrl})
    }
    else {
        res.status(401).send({ message: "Incorrect password" });
    }

}