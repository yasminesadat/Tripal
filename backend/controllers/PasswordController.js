const bcrypt = require("bcrypt");
const changePassword = (userModel) => async (req, res) => {
    try {
        console.log("first line");
        console.log("IM HERE TRYING TO CHANGE PASSWORD AS A ", userModel);
        const id = req.userId;
        const { oldPassword, newPassword } = req.body;

        // Find the user by ID in the specified model
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            // return res.status(400).json({ error: "Current password is incorrect" });
            throw new Error("Old Password is incorrect");

        }

        // Hash the new password and save it to the user model
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
module.exports = { changePassword };