import bcrypt from 'bcryptjs';
// import { Promise } from 'sequelize';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve('oke tạo thành công')
        } catch (e) {
            reject(e);
        }
    })
   
}

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

let getAllUser =  () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            });
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
                raw: true
            })

            if(user) {
                resolve(user)
            }else {
                resolve({})
            }
        } catch (error) {
            reject(error)
        }
    })
}

let updateUserData = (data1) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data1.id}
            })
            if(user) {
                user.firstName = data1.firstName
                user.lastName = data1.lastName
                user.address = data1.address

                await user.save()
                let data = await db.User.findAll()
                resolve(data)
            }else {
                resolve()
            }
            
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: id }})
            if(user) {
                await user.destroy()
            }
            resolve()
        }catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createNewUser,
    getAllUser, getUserInfoById, updateUserData,
    deleteUserById
}