import { UserMongoose } from "./user.js";
export const userMongoStore = {
    async getAllUsers() {
        const users = await UserMongoose.find().lean();
        return users;
    },
    async addUser(user) {
        try {
            let newUser = new UserMongoose(user);
            const userList = await this.getAllUsers();
            if (userList) {
                if (userList.length <= 0) {
                    newUser.admin = true;
                }
            }
            else
                newUser.admin = false;
            const userObj = await newUser.save();
            const u = await this.getUserById(userObj._id);
            return u;
        }
        catch (error) {
            console.error("Error adding user - " + error);
            return null;
        }
    },
    async getUserById(id) {
        if (id) {
            try {
                let user = await UserMongoose.findOne({ _id: id }).lean();
                if (user === undefined)
                    user = null;
                return user;
            }
            catch (error) {
                console.log("Error getting user by id: bad params");
                return null;
            }
        }
        console.log("Error getting user by id: no id provided");
        return null;
    },
    async getUserByEmail(userEmail) {
        if (userEmail) {
            try {
                let user = await UserMongoose.findOne({ email: userEmail }).lean();
                if (user === undefined)
                    user = null;
                return user;
            }
            catch (error) {
                console.log(userEmail);
                console.log("Error getting user by email: bad params");
                return null;
            }
        }
        console.log("Error getting user by email: no email provided");
        return null;
    },
    async deleteUserById(id) {
        try {
            await UserMongoose.deleteOne({ _id: id });
        }
        catch (error) {
            console.log("Error deleting user: bad id");
        }
    },
    async deleteAll() {
        await UserMongoose.deleteMany({});
    },
    async updateUser(id, updatedUserData) {
        try {
            await UserMongoose.updateOne({ _id: id }, { $set: { firstName: updatedUserData.firstName } });
            await UserMongoose.updateOne({ _id: id }, { $set: { lastName: updatedUserData.lastName } });
            await UserMongoose.updateOne({ _id: id }, { $set: { email: updatedUserData.email } });
            await UserMongoose.updateOne({ _id: id }, { $set: { password: updatedUserData.password } });
            const user = this.getUserById(id);
            console.log("User details after update: " + user);
            return user;
        }
        catch (error) {
            console.error("Error updating user - " + error);
            return null;
        }
    },
};
