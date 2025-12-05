const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ROLES = {
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
}

const ROLE_HIERARCHY = {
    [ROLES.USER]: 1,
    [ROLES.MODERATOR]: 2,
    [ROLES.ADMIN]: 3,
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select:false,
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.USER,
    },
    permissions : {
        type: String,
        trim: true,
        maxlength: 100,
    }
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10); 
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
})

userSchema.methods.comparePassword = async function (passwordFromUser) {
    return bcrypt.compare(passwordFromUser, this.password);
}

userSchema.methods.toJson = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.hasRole = function (requiredRole) {
    const userLevel = ROLE_HIERARCHY[this.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
}

userSchema.methods.canPerform = function (action) {
    const rolePermissions = {
        'can_create_game': [ROLES.USER, ROLES.EMPLOYEE, ROLES.ADMIN],
        'can_modify_game': [ROLES.EMPLOYEE, ROLES.ADMIN],
        'can_delete_game': [ROLES.EMPLOYEE, ROLES.ADMIN],
        'can_borrow_game': [ROLES.USER, ROLES.EMPLOYEE, ROLES.ADMIN],
        'can_return_game': [ROLES.USER, ROLES.EMPLOYEE, ROLES.ADMIN],
        'can_make_review': [ROLES.USER, ROLES.EMPLOYEE, ROLES.ADMIN],
        'can_modify_review': [ROLES.EMPLOYEE, ROLES.ADMIN],
        'can_delete-review': [ROLES.EMPLOYEE, ROLES.ADMIN],
        'can_modify_user': [ROLES.ADMIN],
        'can_delete_user': [ROLES.ADMIN],
        'can_get_user': [ROLES.EMPLOYEE, ROLES.ADMIN]
    };

    const permissions = rolePermissions[action] || [];
    return permissions.includes(this.role);
}

userSchema.statics.ROLES = ROLES;
userSchema.statics.ROLE_HIERARCHY = ROLE_HIERARCHY;

const User = mongoose.model('User', userSchema,'users');
module.exports = User;
  

