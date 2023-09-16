import doctorService from '../services/doctorService'

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if(!limit) limit = 10
    try {
        let response = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Lấy bác sĩ lỗi rồi cu ơi..."
        })
    }
}


let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors()
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error get all doctors'
        })
    }
}

let postInfoDoctor = async (req, res) => {
    try {
        let responve = await doctorService.saveDetailtInforDoctor(req.body)
        return res.status(200).json(responve)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error get all doctors'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let data = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try {
        let data = await doctorService.getExtraInforDoctorById(req.query.doctorId)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let data = await doctorService.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let data = await doctorService.sendRemedy(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

module.exports = {
    getTopDoctorHome, getAllDoctors, postInfoDoctor, getDetailDoctorById,
    bulkCreateSchedule, getScheduleByDate, getExtraInforDoctorById, 
    getProfileDoctorById, getListPatientForDoctor, sendRemedy
}