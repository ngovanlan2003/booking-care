import db from '../models/index'
import CRUDService from '../services/CRUDService'

let getHomePage = async (req, res) => {
   try {
      let data = await db.User.findAll()
      return res.render('homePage.ejs', {
         data: JSON.stringify(data)
      })
   } catch (e) {
      console.log(e);
   }
}

let getAbout = (req, res) => {
   return res.render("About.ejs")
}

let getCRUD = (req, res) => {
   return res.render("crud.ejs")
}

let postCRUD = async (req, res) => {
   let message = await CRUDService.createNewUser(req.body)
   return res.send("Post CRUD")
}

let displayGetCRUD = async (req, res) => {
   let data = await CRUDService.getAllUser()
   return res.render("displayCRUD.ejs", {
      data
   })
}

let getEditCRUD = async (req, res) => {
   let userId = req.query.id
   if(userId) {
      let userData = await CRUDService.getUserInfoById(userId)
      
      return res.render("EditCRUD.ejs", 
      {userData})
   }else {
      return res.send("User Not Found")
   }
}


let putCRUD = async (req, res) => {
   let data1 = req.body
   let data = await CRUDService.updateUserData(data1)
   return res.render("displayCRUD.ejs", {data} )
}

let deleteCRUD = async (req, res) => {
   if(id) {
      let id = req.query.id
      await CRUDService.deleteUserById(id);
      return res.send("Delete success baby!")
   }else {
      return res.send('User Not Found')
   }
}

module.exports = { 
   getHomePage, getAbout, getCRUD,
   postCRUD, 
   displayGetCRUD, getEditCRUD,
   putCRUD,
   deleteCRUD
}

