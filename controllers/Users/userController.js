import mongoose from "mongoose";
import User from "../../models/User/User.js";


const userController = {
    getProfile: async (req, res) => {
        const { id } = req.params;
        const userId = new mongoose.Types.ObjectId(!id ? req.userInfo?._id : id);

        const data = await User.aggregate(
            [].concat(
                { $match: { _id: userId } },
                {
                    $project: Object.assign(
                        {
                            username: 1,
                            avatar: 1,
                            savedFiles: 1,
                        },
                    )
                }
            )
        )

        return data.length === 0
            ? res.sendStatus(204)
            : res.status(200).json({
                data: data[0],
                message: "get info successfully"
            })
    }
}

export default userController;