const bcrypt = require("bcrypt");
const changePassword = (userModel) => async (req, res) => {
    try {
        const id = req.userId;
        const { oldPassword, newPassword } = req.body;

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Old Password is incorrect");
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
module.exports = { changePassword };