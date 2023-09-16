import db, { sequelize } from '../models/index'
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }
    })
}



let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email);

            if(isExist) {
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: {email: email},
                    raw: true
                })
    
                if(user) {
                    let check = await bcrypt.compareSync(password, user.password)
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = "Oke"
                        delete user.password
                        userData.user = user
                    }else {
                        userData.errCode = 3
                        userData.errMessage = 'Lỗi mật khẩu'
                    }
                }
            }else {
                userData.errCode = 2
                userData.errMessage = "Lỗi email"
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email : userEmail}
            })

            if(user) {
                resolve(true)
            }else {
                resolve(false)
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if(userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                      exclude: ['password']
                   }
                })
            }
            if(userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email)
            if(check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "Email của bạn đã được sử dụng"
                })
            }else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    message: "ok"
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId}
        })

        if(!user) {
            resolve({
                errCode: 2,
                errMessage: "Người dùng không tồn tại"
            })
        }

        await db.User.destroy({where: {id: userId}})
        resolve({
            errCode: 0,
            errMessage: "Người dùng đã bị xóa =>>"
        })
    })
}

let updateUserData = (data1) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data1.id || !data1.roleId || !data1.positionId || !data1.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "Không truyền id lấy cái mợ chi xóa"
                })
            }
            let user = await db.User.findOne({
                where: {id: data1.id},
                raw: false
            })
            if(user) {
                user.firstName = data1.firstName
                user.lastName = data1.lastName
                user.address = data1.address
                user.roleId = data1.roleId
                user.positionId = data1.positionId
                user.gender = data1.gender
                user.phoneNumber = data1.phoneNumber
                user.image = data1.avatar

                await user.save()

                resolve({
                    errCode: 0,
                    message: "Sửa người dùng thành công"
                })
            }else {
                resolve({
                    errCode: 1,
                    errMessage: "Người dùng không có"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            }else {
                let res = {}
                let allCode = await db.Allcode.findAll({
                where: {type: typeInput}
                })
                res.errCode = 0
                res.data = allCode
                resolve(res)
            }
        } catch (error) {
            reject(error)
        }
    })
}



module.exports = {
    handleUserLogin, getAllUsers, createNewUser, deleteUser
    ,updateUserData, getAllCodeService
}
