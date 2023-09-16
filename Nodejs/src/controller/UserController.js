import userService from '../services/userService'

let handleLogin = async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!'
        })
    } 
    
    let userData = await userService.handleUserLogin(email, password)

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user: {}
    })
}

let handleGetAllUsers = async (req,res) => {
    let id = req.query.id

    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Lỗi Id',
            users: []
        })
    }

    let users = await userService.getAllUsers(id)
    
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users: users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Không có id lấy cái mợ chi xóa"
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message)
}

let handleEditUser = async (req, res) => {
    let data1 = req.body
    let message = await userService.updateUserData(data1)
    return res.status(200).json({
        message
    })
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type)
        return res.status(200).json(data)
    } catch (error) {
        console.log("Get all code error: ", error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
module.exports = {
    handleLogin, handleGetAllUsers, handleCreateNewUser, handleEditUser, handleDeleteUser,getAllCode
}