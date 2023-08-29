import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Hãy nhập tên người dùng'],
        unique: [true, 'Tên đăng nhập đã tồn tại'],
        maxLength: [20, "Tên người dùng chứa tối đa 20 ký tự"],
        validate: [
            {
                validator: function (v) {
                    const hasLowercase = /[a-z]/.test(v);
                    const hasUppercase = /[A-Z]/.test(v);
                    return (hasLowercase || hasUppercase);
                },
                message: 'Tên người dùng phải chưa ít nhất 1 chữ cái'
            },
            {
                validator: function (v) {
                    return !/admin/i.test(v)
                },
                message: 'Tên người dùng không được chứa ký tự admin'
            },
            {
                validator: function (v) {
                    return !/\s$/.test(v);
                },
                message: 'Tên người dùng không được chứa dấu cách ở cuối'
            }
        ]
    },
    password: {
        type: String,
        required: [true, 'Hãy nhập mật khẩu'],
        minLength: [8, 'Mật khẩu phải chứa ít nhất 8 ký tự'],
        validate: {
            validator: function (v) {
                const hasNoSpace = !/\s/.test(v);
                return hasNoSpace;
            },
            message: 'Mật khẩu không hợp lệ vì có dấu cách'
        }
    },
    accessToken: {
        type: String,
    },

    refreshToken: {
        type: String,
    },
    
    createdAt: {
        type: Date,
    },

    lastActiveAt: {
        type: Date,
    },

});

const User = mongoose.model('user', userSchema);

export default User;