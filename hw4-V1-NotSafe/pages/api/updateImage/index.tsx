import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// POST /api/updateImage
// Required fields in body: username,mail,imageUrl
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { email,imageUrl } = req.body;
    const userInDatabase = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });  

    if (!userInDatabase) {
        res.status(404).send({ message: "User isn't exist" });
    }
    else {
       const user =  await prisma.user.update({
            where: { email: email },
            data: { image: imageUrl },
          });
          
          res.status(200).send({message: "Success"});
    }

}