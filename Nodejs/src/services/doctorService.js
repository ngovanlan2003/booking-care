import db from '../models/index'
require('dotenv').config
import _, { reject } from 'lodash'
import emailService from '../services/emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: {roleId: 'R2'},
                order:  [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {roleId: "R2"},
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let invalid = true
    let element = ''
    let arr = [
        'doctorId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPrice', 'selectedPayment',  'selectedProvince',
        'nameClinic', 'addressClinic', 'note' , 'specialtyId'
    ]

    for(let i = 0; i < arr.length; i++) {
        if(!inputData[arr[i]]) {
            invalid = false
            element = arr[i]
            break;
        }
    }
    return {
        invalid: invalid,
        element: element
    }
}

let saveDetailtInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData)
            if(checkObj.invalid === false) {
                resolve({ 
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            }else {
                //upser to markdown
                if(inputData.action === "CREATE") {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                }else if(inputData.action === "EDIT")  {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: {doctorId: inputData.doctorId},
                        raw: false
                    })
                    if(doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save()
                    }
                }

                //upsert to doctor_infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })

                if(doctorInfor) {
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId
                    doctorInfor.clinicId = inputData.clinicId
                    await doctorInfor.save()
                }else {
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId : inputData.selectedPrice,
                        provinceId : inputData.selectedProvince,
                        paymentId : inputData.selectedPayment,
                        nameClinic : inputData.nameClinic,
                        addressClinic : inputData.addressClinic,
                        note : inputData.note,
                        specialtyId : inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!"
                })
            }else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown, 
                            attributes: ["description","contentHTML", "contentMarkdown"]
                        },
                        
                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    
                        {
                            model: db.Doctor_Infor, 
                            attributes: {
                                exclude: ["id", "doctorId"]
                            },
                            include: [
                                {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if(data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if(!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if(!data.arrSchedule || !data.doctorId || !data.formatDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing param!"
                })
            }else {
                let schedule = data.arrSchedule
                if(schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                } 

                let existing = await db.Schedule.findAll({
                    where: {doctorId: data.doctorId, date: data.formatDate},
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })


                //so sánh thèn nào không trùng nhau thì xuống dưới mới thêm vào dùng lodash
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date
                })
                

                if(toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing error param"
                })
            }else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']},
                        {model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName']},
                    ],
                    raw: false,
                    nest: true                                                                                                                                                                                             
                })

                if(!data) {
                    data = []
                }

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
           reject(e) 
        }
    })
}

let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing error param"
                })
            }else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    attributes: {
                        exclude: ["id", "doctorId"]
                    },
                    include: [
                        {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
                    ],
                    raw: false,
                    nest: true
                })
                if(!data) {
                    data = []
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing error param"
                })
            }else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown, 
                            attributes: ["description","contentHTML", "contentMarkdown"]
                        },
                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                        {
                            model: db.Doctor_Infor, 
                            attributes: {
                                exclude: ["id", "doctorId"]
                            },
                            include: [
                                {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if(!data) {
                    data = []
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing error param"
                })
            }else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, 
                            as: "patientData",
                            attributes: ["email","firstName", "address", "gender"],
                            include: [
                                {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,  
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing error param"
                })
            }else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })

                if(appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }

                // send email remedy
                await emailService.sendAttachment(data)

                resolve({
                    errCode: 0,
                    errMessage: "Success send email bill"
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    getTopDoctorHome, getAllDoctors, saveDetailtInforDoctor, getDetailDoctorById,
    bulkCreateSchedule, getScheduleByDate, getExtraInforDoctorById,getProfileDoctorById,
    getListPatientForDoctor, sendRemedy
}