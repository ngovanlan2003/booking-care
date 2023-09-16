import actionTypes from './actionTypes';
import { getAllCodeService, createNewUserService, getAllUser,
     deleteUser, editUserService, getTopDoctorHomeService, getAllDoctors,
     saveDetailDoctor, getAllSpecialty, getAllClinic} from '../../services/userService';
import { toast } from "react-toastify"

export const fetchGenderStart =  () => {
    return  async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START
            })
            let res = await getAllCodeService("GENDER")
            if(res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data))
            }else {
                dispatch(fetchGenderFailed())
            }
        } catch (error) {
            dispatch(fetchGenderFailed())
            console.log(error)
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})


export const fetchPositionStart =  () => {
    return  async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("POSITION")
            if(res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data))
            }else {
                dispatch(fetchPositionFailed())
            }
        } catch (error) {
            dispatch(fetchPositionFailed())
            console.log(error)
        }
    }
}

export const fetchRoleStart =  () => {
    return  async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("ROLE")
            if(res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data))
            }else {
                dispatch(fetchRoleFailed())
            }
        } catch (error) {
            dispatch(fetchRoleFailed())
            console.log(error)
        }
    }
}

export const createNewUser = (data) => {
    return  async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data)
            if(res && res.errCode === 0) {
                dispatch(saveUserSuccess())
                dispatch(fetchAllUsersStart())
                toast.success("Bạn đã thêm người dùng thành công!!!")
            }else {
                dispatch(saveUserFailed())
            }
        } catch (error) {
            dispatch(saveUserFailed())
            console.log(error)
        }
    }
}

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const fetchAllUsersStart =  () => {
    return  async (dispatch, getState) => {
        try {
            let res = await getAllUser("ALL")
            
            if(res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse()))
            }else {
                dispatch(fetchAllUsersFailed())
            }
        } catch (error) {
            dispatch(fetchAllUsersFailed())
            console.log(error)
        }
    }
}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
})

export const deleteAUser = (userId) => {
    return  async (dispatch, getState) => {
        try {
            let res = await deleteUser(userId)
            if(res && res.errCode === 0) {
                dispatch(deleteUserSuccess())
                dispatch(fetchAllUsersStart())
                toast.success("Bạn đã xóa người dùng thành công!!!")
            }else {
                dispatch(deleteUserFailed())
            }
        } catch (error) {
            toast.error("Xóa không được cu ơi!!!")
            dispatch(deleteUserFailed())
            console.log(error)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const EditAUser = (data) => {
    return  async (dispatch, getState) => {
        try {
            let res = await editUserService(data)
            if(res && res.errCode === 0) {
                dispatch(editUserSuccess())
                dispatch(fetchAllUsersStart())
                toast.success("Bạn đã sửa người dùng thành công!!!")
            }else {
                dispatch(editUserFailed())
            }
        } catch (error) {
            toast.error("Sửa không được cu ơi!!!")
            dispatch(editUserFailed())
            console.log(error)
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('')
            if(res && res.errCode == 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                })
            }else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
                })
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
            })
        }
    }
   
}

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors()
            if(res && res.errCode == 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                })
            }else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
                })
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
            })
        }
    }
   
}

export const saveDetailtDoctors = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctor(data)
            if(res && res.errCode == 0) {
                toast.success("Save infor doctor success!")
                dispatch({
                    type: actionTypes.SAVE_DETAITL_DOCTORS_SUCCESS,
                })
            }else {
                toast.error("Save infor doctor faild!")
                dispatch({
                    type: actionTypes.SAVE_DETAITL_DOCTORS_FAILED,
                })
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: actionTypes.SAVE_DETAITL_DOCTORS_FAILED,
            })
        }
    }
   
}

export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("TIME")
            if(res && res.errCode == 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                })
            }else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
                })
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
            })
        }
    }
   
}

export const getRequiredDoctorInfor =  () => {
    return  async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START
            })
            let resPrice = await getAllCodeService("PRICE")
            let resPayment = await getAllCodeService("PAYMENT")
            let resProvince = await getAllCodeService("PROVINCE")
            let resSpecialty = await getAllSpecialty()
            let resClinic = await getAllClinic()

            if(resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
                && resClinic && resClinic.errCode === 0
                ) {
                    let data = {
                        resPrice: resPrice.data,
                        resPayment: resPayment.data,
                        resProvince: resProvince.data,
                        resSpecialty: resSpecialty.data,
                        resClinic: resClinic.data
                    }
                dispatch(fetchRequiredDoctorInforSuccess(data))
            }else {
                dispatch(fetchRequiredDoctorInforFailed())
            }
        } catch (error) {
            dispatch(fetchRequiredDoctorInforFailed())
            console.log("RequiredDoctorInfor")
        }
    }
}

export const fetchRequiredDoctorInforSuccess = (data) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: data
})

export const fetchRequiredDoctorInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED
})