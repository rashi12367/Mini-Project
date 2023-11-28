const express = require("express");
const hbs=require('hbs')
// const moment = require('moment');
const booking=require("./models/Booking")
const User = require('./models/User');
const path=require('path')
const bodyParser=require('body-parser');
require("./dbConnect")
const app = express();
const encoder=bodyParser.urlencoded()
app.set("views","./views")
app.set("view engine","hbs")
const partialPath=path.join(__dirname,"./views/partials")
hbs.registerPartials(partialPath)
const staticPath=path.join(__dirname,"./views/public")
app.use(express.static(staticPath))

maxSlotNumber = 100;
occupiedSlots = [];
availableSlots = [];

function generateRandomAvailableSlot(occupiedSlots, availableSlots, maxSlotNumber) {
    // Check if there are any available slots
    if (!availableSlots.length) {
      // If there are no available slots, create a new list of available slots
      for (let slotNumber = 1; slotNumber <= maxSlotNumber; slotNumber++) {
        if (!occupiedSlots.includes(slotNumber)) {
          availableSlots.push(slotNumber);
          occupiedSlots.push(slotNumber)
        }
      }
    }
  
    // Generate a random index into the list of available slots
    const randomIndex = Math.floor(Math.random() * availableSlots.length);
  
    // Return the random available slot number
    return availableSlots[randomIndex];
  }
  // function calculateFare(arrivalTime, departureTime) {
  //   // Convert arrival and departure times to moments
  //   const arrivalMoment = moment(arrivalTime);
  //   const departureMoment = moment(departureTime);
  
  //   // Calculate the parking duration in hours
  //   const duration = departureMoment.diff(arrivalMoment, 'hours');
  
  //   // Calculate the fare (assuming 50 INR per hour)
  //   let fare;
  //   if (isNaN(duration)) {
  //     // Handle invalid input
  //     console.error('Invalid input for calculateFare: arrivalTime:', arrivalTime, 'departureTime:', departureTime);
  //   } else {
  //     fare = duration * 50;
  //   }
  
  //   return fare;
  // }
  

app.get("/",async(req,res)=>{
    var data=await booking.find()
    res.render("index",{"data":data})
})

// app.get('/home', (req, res) => {
//   res.render('home.hbs'); // Render the about page
// });

app.get('/table', (req, res) => {
    res.render('index.hbs'); // Render the about page
});

app.get('/about', (req, res) => {
    res.render('about.hbs'); // Render the about page
});
  
app.get('/contact', (req, res) => {
    res.render('contact.hbs'); // Render the contact page
});

app.post('/contact', (req, res) => {
    // Process the form data from the request body
    const formData = req.body;
    const name = formData.firstName + ' ' + formData.lastName;
    const email = formData.emailAddress;
    const message = formData.message;
  
    // Send a response to the client
    res.send('Thank you for your contact. We will get back to you soon.');
});
  

app.get("/add",(req,res)=>{
    res.render("add")
})

app.post("/add",encoder,async(req,res)=>
{
    var data=new booking(req.body)
    data.slotNumber = generateRandomAvailableSlot(occupiedSlots, availableSlots, maxSlotNumber);
    // const arrivalTime = new Date(req.body.arrival_time);
    // const departureTime = new Date(req.body.departure_time);
    // const fare = calculateFare(arrivalTime, departureTime);
    // data.fare = fare;
    await data.save();
    res.redirect("/")
})

app.get("/delete/:_id",async(req,res)=>
{
    await booking.deleteOne({_id:req.params._id})
    res.redirect("/")
})

app.get("/update/:_id",async(req,res)=>{
    const data=await booking.findOne({_id:req.params._id})
    res.render("update",{data:data})
})

app.post("/update/:_id",encoder,async(req,res)=>
{
    var data=await booking.findOne({_id:req.params._id})
    // const arrivalTime = new Date(req.body.arrival_time);
    // const departureTime = new Date(req.body.departure_time);
    // const fare = calculateFare(arrivalTime, departureTime);
    data.registration_num=req.body.registration_num
    data.vehicle=req.body.vehicle
    data.arrival_date=req.body.arrival_date
    data.arrival_time=req.body.arrival_time
    data.departure_date=req.body.departure_date
    data.departure_time=req.body.departure_time
    data.city=req.body.city
    // data.fare = fare;

    await data.save();
    res.redirect("/")
})
// Server listen

app.listen(3052, () => console.log("Server listening to port 3052"));