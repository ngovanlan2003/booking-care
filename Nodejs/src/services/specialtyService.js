const { reject } = require("lodash")
const db = require("../models")

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.name || !data.imageBase64 
                || !data.descriptionHTML
                || !data.descriptionMarkdown
                 ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {
                await db.Specialties.create({
                    name:  data.name,
                    image: data.imageBase64,
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
const getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialties.findAll()
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

const getDetailSpecialtyById = (specialtyId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!specialtyId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {
                let data = await db.Specialties.findOne({
                    where: {
                        id: specialtyId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })
                if(data) {
                    let doctorSpecialty = []
                    if(location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: specialtyId
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }else {
                        // find by location
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: specialtyId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                   
                    data.doctorSpecialty = doctorSpecialty
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
    createSpecialty, getAllSpecialty, getDetailSpecialtyById
}