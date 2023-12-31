import axios from "../axios"

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login/'
    , { email: userEmail, password: userPassword }
    )
}

const getAllUser = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    return axios.post("/api/create-new-user", data)
}

const deleteUser = (id) => {
    return axios.delete("/api/delete-new-user", {
        data: {id}
    })
}

const editUserService = (inputData) => {
    return axios.put("/api/edit-new-user", inputData)
}

const getAllCodeService = (inputData) => {
    return axios.get(`/api/allcode?type=${inputData}`)
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`)
}

const saveDetailDoctor = (data) => {
    return axios.post("/api/save-infor-doctors", data)
}

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post("/api/bulk-create-schedule", data)
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getEtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientAppointment = (data) => {
    return axios.post("/api/patient-book-appointment", data)
}


const postVerifyBookAppointment = (data) => {
    return axios.post("/api/verify-book-appointment", data)
}
const createNewSpecialty = (data) => {
    return axios.post("/api/create-new-specialty", data)
}

const getAllSpecialty = () => {
    return axios.get('/api/get-specialty')
}

const getDetailSpecialty = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}

const createNewClinic = (data) => {
    return axios.post("/api/create-new-clinic", data)
}

const getAllClinic = () => {
    return axios.get('/api/get-clinic')
}

const getDetailClinic = (clinicId) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${clinicId}`)
}

const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}

const postSendRemedy = (data) => {
    return axios.post("/api/send-remedy", data)
}
 

export {handleLoginApi, getAllUser, createNewUserService, deleteUser, editUserService
    ,getAllCodeService, getTopDoctorHomeService,
    getAllDoctors, saveDetailDoctor, getDetailInforDoctor,
    saveBulkScheduleDoctor, getScheduleDoctorByDate,
    getEtraInforDoctorById, getProfileDoctorById,
    postPatientAppointment, postVerifyBookAppointment,
    createNewSpecialty, getAllSpecialty, getDetailSpecialty,
    createNewClinic, getAllClinic, getDetailClinic,
    getAllPatientForDoctor, postSendRemedy
}