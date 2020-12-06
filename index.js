const express = require('express');
var router = express.Router();
const data = require("./Lab3-timetable-data.json");//json file containing courses
const Storage = require('node-storage');//backend storage
const bcrypt = require ('bcrypt');
const saltRounds = 10;
const Joi = require('joi');
const app = express();



app.use(express.json());

var scheduleStore = new Storage('schedule');
var accountStore = new Storage('accounts');

const port = process.env.Port || 3000;//port number

app.use(express.static('static/frontend'));

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});


//makes courses with json file
var newData = JSON.stringify(data)
const courses = JSON.parse(newData);

//frontend
app.use('/', express.static('static'));

//console log for requests
app.use(function (req, res, next) {
  console.log(`${req.method} request for ${req.url}`);
  next();
})

////////////////////////////////////////////////////////////////////////////////////////////SCHEDULES///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//get all schedules
app.get('/api/schedule', (req, res) => {
  const result = [];

  for(schedule in scheduleStore.store) {
    result.push(schedule);
  }
  res.send(result);
});

//get courses of a schedule when given a name
app.get('/api/schedule/:id', (req, res) => {
  const result = [];
  result.push(scheduleStore.get(req.params.id))
  res.send(result);
});

//create schedule
app.post('/api/schedule/create', function (req, res) {
  const { error } = validateSchedule(req.body); //result.error
  if(error) return res.status(400).send(result.error.details[0].message);
  
  const schedule = {
    schedule: req.body.schedule,
    subject: req.body.subject,
    catalog_nbr: req.body.catalog_nbr,
    creator: req.body.creator,
    public: req.body.public,
    description: req.body.description
  }
  var existing = false;

  for(item in scheduleStore.store) {
    if(req.body.schedule == item){
      existing = true;
    }
  }

  if(!existing){
    scheduleStore.put(schedule.schedule,schedule);
    res.send(schedule);
  }
  else{
    res.send("course already exists");
  }
})

//add course to schedule
app.post('/api/schedule/', function (req, res) {
  const { error } = validateSchedule(req.body); //result.error
  if(error) return res.status(400).send(result.error.details[0].message);
  
  
  if(scheduleStore.get(req.body.schedule).subject!==" "){
    var schedule = {
      schedule: req.body.schedule,
      subject: scheduleStore.get(req.body.schedule).subject+","+req.body.subject,
      catalog_nbr: scheduleStore.get(req.body.schedule).catalog_nbr+","+req.body.catalog_nbr,
      creator: req.body.creator,
      public: req.body.public,
      description: scheduleStore.get(req.body.schedule).description
    }
  }
  else{
    var schedule = {
      schedule: req.body.schedule,
      subject: req.body.subject,
      catalog_nbr: req.body.catalog_nbr,
      creator: req.body.creator,
      public: req.body.public,
      description: req.body.description
    }
  }

  //courses.push(course);
  scheduleStore.put(schedule.schedule,schedule);
  res.send(schedule);
})



//delete all schedules
app.delete('/api/schedule/all', function (req, res) {
  for(schedule in scheduleStore.store) {
    scheduleStore.remove(schedule);
  }
  res.send("deleted");
});

//delete a schedule when given its name in url
app.delete('/api/schedule/:id', function (req, res) {
  scheduleStore.remove(req.params.id);
  res.send("deleted");
});

//delete a schedule when given its name
app.delete('/api/schedule/', function (req, res) {
  const { error } = validateInput(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);

  scheduleStore.remove(req.body.input);

  res.send("deleted");
});

////////////////////////////////////////////////////////////////////////////////////////////ACCOUNTS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//get all accounts
app.get('/api/account', (req, res) => {
  const result = [];

  for(account in accountStore.store) {
    result.push(account);
  }
  res.send(result);
});

//get details of a account when given a name
app.get('/api/account/:id', (req, res) => {
  const result = [];
  result.push(accountStore.get(req.params.id))
  res.send(result);
});

//get account when given email and password
app.get('/api/account/:id/:id2', (req, res) => {
  var accounts = [];
  var pass;
  var account;
  
  for(item in accountStore.store) {
    accounts.push(accountStore.get(item))
  }
  var found = false;

  for(i=0;i<accounts.length; i++) {
    if(accounts[i].email===req.params.id){
      pass = accounts[i].password;
      account = accounts[i];
      found = true;

    }
  }

  bcrypt.compare(req.params.id2, pass, function(err, result) {
    if (result) {
      found = true;
      res.send(account);
    }
    else{
      res.send("not found");
    }
  });
});


//create account
app.post('/api/account/create', function (req, res) {
  const { error } = validateAccount(req.body); //result.error
  if(error) return res.status(400).send(result.error.details[0].message);

  var accounts = [];
  
  for(item in accountStore.store) {
    accounts.push(accountStore.get(item))
  }

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const account = {
      email: req.body.email,
      name: req.body.name,
      password: hash,
      admin: req.body.admin,
      activated: req.body.activated,
    }
  
    var existing = false;
  
    for(i=0;i<accounts.length;i++) {
      if(accounts[i].email===req.body.email){
        existing = true;
      }
    }
  
  
    if(!existing){
      accountStore.put(account.name,account);
      res.send(account);
    }
    else{
      console.log("existing account found")
      res.send("account already exists")
    }
  });
})

//change details to account
app.post('/api/account', function (req, res) {
  const { error } = validateAccount(req.body); //result.error
  if(error) return res.status(400).send(result.error.details[0].message);
  
  if(req.body.password.length<20){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      var account = {
        email: req.body.email,
        name: req.body.name,
        password: hash,
        admin: req.body.admin,
        activated: req.body.activated,
      }
      accountStore.put(account.name,account);
      res.send(account);
    });
  }
  else{
    var account = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      admin: req.body.admin,
      activated: req.body.activated,
    }
    accountStore.put(account.name,account);
    res.send(account);
  }

})



//delete all accounts
app.delete('/api/account/all', function (req, res) {
  for(account in accountStore.store) {
    accountStore.remove(account);
  }
  res.send("deleted");
});

//delete a schedule when given its name in url
app.delete('/api/account/:id', function (req, res) {
  accountStore.remove(req.params.id);
  res.send("deleted");
});

//delete a account when given its name
app.delete('/api/account/', function (req, res) {
  const { error } = validateInput(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);

  accountStore.remove(req.body.input);

  res.send("deleted");
});



////////////////////////////////////////////////////////////////////////////////////////////COURSES///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//get all courses
router.get('/', (req, res) => {
  var queryParameter = req.query;
  var results = [];

  //used in get courses when given paramters in a query
  if(Object.keys(queryParameter).length==0){
    res.send(courses);
  }
  else if(Object.keys(queryParameter).length==1){
    for(course of courses){
      if(course.subject.toLowerCase().includes(queryParameter.subject.toLowerCase())){
        results.push(course);
      }
    }
    res.send(results);
  }

  else if(Object.keys(queryParameter).length==2){
    for(course of courses){
      if(course.subject.toLowerCase().includes(queryParameter.subject.toLowerCase())&& course.catalog_nbr.toString().toLowerCase().includes(queryParameter.catalog_nbr.toLowerCase())){
        results.push(course);
      }
    }
    res.send(results);
  }

  else if(Object.keys(queryParameter).length==3){
    for(course of courses){
      if(course.subject.toLowerCase().includes(queryParameter.subject.toLowerCase()) && course.catalog_nbr.toString().toLowerCase().includes(queryParameter.catalog_nbr.toLowerCase()) && course.course_info[0].ssr_component.toLowerCase().includes(queryParameter.ssr_component.toLowerCase())){
        results.push(course);
      }
    }
    res.send(results);
  }

});


//get one course using id
router.get('/:id/:id2', function (req, res) {

  const course = courses.find(c => c.subject.toString() === req.params.id && c.catalog_nbr.toString() === req.params.id2);
  if(!course) return res.status(404).send('Course not found');
  
  //courses.filter(course => course.subject.indexOf(req.params.id) !== -1);
  res.send(course);
});


//used for input sanitization
function validateSchedule(schedule){
  const schema = {
    schedule: Joi.string().required().min(1).max(20).regex(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/ , { invert: true }),
    subject: Joi.string().required().regex(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/ , { invert: true }),
    catalog_nbr: Joi.string().required().regex(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/ , { invert: true }),
    creator: Joi.string().required().regex(/[`!#$%^&*()_+\-=\[\]{};':"\\|<>\/?~]/ , { invert: true }),
    public: Joi.string().required().regex(/[`!#$%^&*()_+\-=\[\]{};':"\\|<>\/?~]/ , { invert: true }),
    description: Joi.string().required().regex(/[`#$%^&*()_+\-=\[\]{};':"\\|<>\/~]/ , { invert: true }),
  };

  return result = Joi.validate(schedule, schema);
}

function validateAccount(account){
  const schema = {
    name: Joi.string().required().regex(/[`!#$%^&*()_+\-=\[\]{};':"\\|<>\/?~]/ , { invert: true }),
    email: Joi.string().required().email().regex(/[`!#$%^&*()_+\-=\[\]{};':"\\|<>\/?~]/ , { invert: true }),
    password: Joi.string().required().regex(/[`!@#%^&*()_+\-=\[\]{};':"\\|.<>\?~]/ , { invert: true }),
    admin: Joi.string().required().regex(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/ , { invert: true }),
    activated: Joi.string().required().regex(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/ , { invert: true }),
  };

  return result = Joi.validate(account, schema);
}

//input validation
function validateInput(course){
  const schema = {
    input: Joi.string().alphanum().min(1).max(20).required().regex(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/ , { invert: true })
  };

  return result = Joi.validate(course, schema);
}

//router
app.use('/api/courses', router);


//port listener
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//unused methods
/*
//add new course
router.post('/', function (req, res) {
  const { error } = validateCourse(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);
  
  const course = {
    id: courses.length + 1, 
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
})


//put method using id
router.put('/:id', function (req, res) {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course){
    const course = {
      id: parseInt(req.params.id), 
      name: req.body.name
    }
    courses.push(course);
    res.send(course);
    return;
  }
  
  const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);

  course.name = req.body.name;
  res.send(course);
})

//delete method using id
router.delete('/:id', function (req, res) {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('Course not found');
  
  const index = courses.indexOf(course);
  courses.splice(index,1);

  res.send(course);
});*/