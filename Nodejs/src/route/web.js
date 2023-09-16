import express from 'express'
import homeController from '../controller/homeController'
import UserController from '../controller/UserController'
import doctorController from '../controller/doctorController'
import patientController from '../controller/patientController'
import specialtyController from '../controller/specialtyController'
import clinicController from '../controller/clinicController'

let router = express.Router()

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage)
    router.get("/about", homeController.getAbout)
    router.get("/crud", homeController.getCRUD)
    router.post("/post-crud", homeController.postCRUD)
    router.get("/get-crud", homeController.displayGetCRUD)
    router.get("/edit-crud", homeController.getEditCRUD)
    router.post("/put-crud", homeController.putCRUD)
    router.post("/delete-crud", homeController.deleteCRUD)

    router.post('/api/login', UserController.handleLogin)
    router.get('/api/get-all-users', UserController.handleGetAllUsers)
    router.post("/api/create-new-user", UserController.handleCreateNewUser)
    router.put("/api/edit-new-user", UserController.handleEditUser)
    router.delete("/api/delete-new-user", UserController.handleDeleteUser)
    router.get("/api/allcode", UserController.getAllCode)


    router.get("/api/top-doctor-home", doctorController.getTopDoctorHome)
    router.get("/api/get-all-doctors", doctorController.getAllDoctors)
    router.post("/api/save-infor-doctors", doctorController.postInfoDoctor)
    router.get("/api/get-detail-doctor-by-id", doctorController.getDetailDoctorById)
    router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule)
    router.get("/api/get-schedule-doctor-by-date", doctorController.getScheduleByDate)
    router.get("/api/get-extra-infor-doctor-by-id", doctorController.getExtraInforDoctorById)
    router.get("/api/get-profile-doctor-by-id", doctorController.getProfileDoctorById)

    router.get("/api/get-list-patient-for-doctor", doctorController.getListPatientForDoctor)
    router.post("/api/send-remedy", doctorController.sendRemedy)
    

    router.post("/api/patient-book-appointment", patientController.postBookAppointment)
    router.post("/api/verify-book-appointment", patientController.postVerifyBookAppointment)
    
    router.post("/api/create-new-specialty", specialtyController.createSpecialty)
    router.get("/api/get-specialty", specialtyController.getAllSpecialty)
    router.get("/api/get-detail-specialty-by-id", specialtyController.getDetailSpecialtyById)

    router.post("/api/create-new-clinic", clinicController.createClinic)
    router.get("/api/get-clinic", clinicController.getAllClinic)
    router.get("/api/get-detail-clinic-by-id", clinicController.getDetailClinicById)
    return app.use("/", router)
}

module.exports = initWebRoutes