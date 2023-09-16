const { reject } = require("lodash")
const db = require("../models")

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if( !data.name || !data.address
                || !data.imageBase64 
                || !data.descriptionHTML
                || !data.descriptionMarkdown
                 ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {
                await db.Clinic.create({
                    name:  data.name,
                    image: data.imageBase64,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll()
            if(data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: "Success",
                data
            })
        } catch (error) {
            reject(error)
        }  
    })
}

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'address' ,'descriptionHTML', 'descriptionMarkdown']
                })
                if(data) {
                    let doctorClinic = []
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: inputId,
                        },
                        attributes: ['doctorId']
                    })
                    data.doctorClinic = doctorClinic
                }else {
                    data = {}
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Success',
                    data
                })
                

            }
        } catch (error) {
            reject(error) 
        }
    })
}

module.exports = {
    createClinic, getAllClinic, getDetailClinicById
}