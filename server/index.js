const express = require('express');
var router = express.Router();
const data = require("./Lab3-timetable-data.json");//json file containing courses


const Storage = require('node-storage');//backend storage
const bcrypt = require ('bcrypt');
const saltRounds = 10;
const Joi = require('joi');
var stringSimilarity = require('string-similarity');
const app = express();
const jwt = require('jsonwebtoken');

var cors = require('cors')
app.use(cors())
app.options('*', cors())

app.use(express.json());

var scheduleStore = new Storage('schedule');
var accountStore = new Storage('accounts');
var reviewsStore = new Storage('reviews');
var pageStore = new Storage('pages');

const port = process.env.Port || 3000;//port number

app.use(express.static('static/frontend'));

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});


//makes courses with json file
var newData = JSON.stringify(data)
var courses = JSON.parse(newData);
/*
var courses = courseStore.get('courses');
console.log(courses[0])*/

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
    result.push(scheduleStore.get(schedule));
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
app.post('/api/schedule/create', authenticateToken,function (req, res) {
  const { error } = validateSchedule(req.body); //result.error
  if(error) return res.status(400).send(result.error.details[0].message);
  
  const schedule = {
    schedule: req.body.schedule,
    subject: req.body.subject,
    catalog_nbr: req.body.catalog_nbr,
    creator: req.body.creator,
    public: req.body.public,
    description: req.body.description,
    lastMod: new Date().getTime(),
    lastModString:new Date().toLocaleString()
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
app.post('/api/schedule/', authenticateToken,function (req, res) {
  const { error } = validateSchedule(req.body); //result.error
  if(error) return res.status(400).send(result.error.details[0].message);
  
  if(scheduleStore.get(req.body.schedule).description!==req.body.description && req.body.description!== " "){
    var schedule = {
      schedule: req.body.schedule,
      subject: scheduleStore.get(req.body.schedule).subject,
      catalog_nbr: scheduleStore.get(req.body.schedule).catalog_nbr,
      creator: req.body.creator,
      public: scheduleStore.get(req.body.schedule).public,
      description: req.body.description,
      lastMod: new Date().getTime(),
      lastModString:new Date().toLocaleString()
    }
  }

  else if(scheduleStore.get(req.body.schedule).public!==req.body.public && req.body.public!== " "){
    var schedule = {
      schedule: req.body.schedule,
      subject: scheduleStore.get(req.body.schedule).subject,
      catalog_nbr: scheduleStore.get(req.body.schedule).catalog_nbr,
      creator: req.body.creator,
      public: req.body.public,
      description: scheduleStore.get(req.body.schedule).description,
      lastMod: new Date().getTime(),
      lastModString:new Date().toLocaleString()
    }
  }

  else if(scheduleStore.get(req.body.schedule).subject!==" "){///////////////////////////////fix
    var catnums = scheduleStore.get(req.body.schedule).catalog_nbr.split(",");
    var subjects = scheduleStore.get(req.body.schedule).subject.split(",");
    var found = false;
    for(var i=0;i< subjects.length;i++){
      if(catnums[i]==req.body.catalog_nbr&&subjects[i]==req.body.subject){
        found = true;
      }
    }
    if(!found){
      var schedule = {
        schedule: req.body.schedule,
        subject: scheduleStore.get(req.body.schedule).subject+","+req.body.subject,
        catalog_nbr: scheduleStore.get(req.body.schedule).catalog_nbr+","+req.body.catalog_nbr,
        creator: req.body.creator,
        public: scheduleStore.get(req.body.schedule).public,
        description: scheduleStore.get(req.body.schedule).description,
        lastMod: new Date().getTime(),
        lastModString:new Date().toLocaleString()
      }
    }
    
    else{
      var schedule = {
        schedule: req.body.schedule,
        subject: scheduleStore.get(req.body.schedule).subject,
        catalog_nbr: scheduleStore.get(req.body.schedule).catalog_nbr,
        creator: req.body.creator,
        public: scheduleStore.get(req.body.schedule).public,
        description: scheduleStore.get(req.body.schedule).description,
        lastMod: new Date().getTime(),
        lastModString:new Date().toLocaleString()
      }
    }
  }
  else{
    var schedule = {
      schedule: req.body.schedule,
      subject: req.body.subject,
      catalog_nbr: req.body.catalog_nbr,
      creator: req.body.creator,
      public: scheduleStore.get(req.body.schedule).public,
      description: scheduleStore.get(req.body.schedule).description,
      lastMod: new Date().getTime(),
      lastModString:new Date().toLocaleString()
    }
  }
  //courses.push(course);
  scheduleStore.put(schedule.schedule,schedule);
  res.send(schedule);
})

//remove course to schedule
app.post('/api/schedule/remove', authenticateToken,function (req, res) {
  const { error } = validateSchedule(req.body); //result.error
  if(error) return res.status(400).send(result.error.details[0].message);
  var catnums = scheduleStore.get(req.body.schedule).catalog_nbr.split(",");
  var subjects = scheduleStore.get(req.body.schedule).subject.split(",");
  var found = false;
  for(var i=0;i< subjects.length;i++){
    if(catnums[i]==req.body.catalog_nbr&&subjects[i]==req.body.subject){
      found = true;
      catnums.splice(i,1);
      subjects.splice(i,1);

    }
  }
  if(scheduleStore.get(req.body.schedule).subject!==" "){
    if(found){
      var schedule = {
        schedule: req.body.schedule,
        subject: subjects.join(),
        catalog_nbr: catnums.join(),
        creator: req.body.creator,
        public: scheduleStore.get(req.body.schedule).public,
        description: scheduleStore.get(req.body.schedule).description,
        lastMod: new Date().getTime(),
        lastModString:new Date().toLocaleString()
      }
    }
  }
  else{
    var schedule = {
      schedule: req.body.schedule,
      subject: req.body.subject,
      catalog_nbr: req.body.catalog_nbr,
      creator: req.body.creator,
      public: scheduleStore.get(req.body.schedule).public,
      description: scheduleStore.get(req.body.schedule).description,
      lastMod: new Date().getTime(),
      lastModString:new Date().toLocaleString()
    }
  }

  scheduleStore.put(schedule.schedule,schedule);
  res.send(schedule);
})

//delete all schedules
app.delete('/api/schedule/all', authenticateToken,function (req, res) {
  for(schedule in scheduleStore.store) {
    scheduleStore.remove(schedule);
  }
  res.send("deleted");
});

//delete a schedule when given its name in url
app.delete('/api/schedule/:id', authenticateToken,function (req, res) {
  scheduleStore.remove(req.params.id);
  res.send("deleted");
});

//delete a schedule when given its name
app.delete('/api/schedule/', authenticateToken,function (req, res) {
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
app.get('/api/account/:id', authenticateToken, (req, res) => {
  const result = [];
  result.push(accountStore.get(req.params.id))
  res.send(result);
});

//get account when given email and password
app.post('/api/account/login', (req, res) => {
  var accounts = [];
  var pass;
  var account;
  
  for(item in accountStore.store) {
    accounts.push(accountStore.get(item))
  }
  var found = false;

  for(i=0;i<accounts.length; i++) {
    if(accounts[i].email===req.body.email){
      pass = accounts[i].password;
      account = accounts[i];
      found = true;

    }
  }

  bcrypt.compare(req.body.password, pass, function(err, result) {
    if (result) {
      found = true;


      const user = {
        name: account.name,
        admin: account.admin,
      }


      const accessToken = jwt.sign(user, '8c14e9e532ee85716f59d11e696b705aecc52e75e56f0964aece2484bedf1b63bce460f88f2cb37c193a744f793f0190c63666283588612418c04713ff563701')


      res.send([accessToken,account]);
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
app.post('/api/account', authenticateToken,function (req, res) {
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
app.delete('/api/account/all', authenticateToken,function (req, res) {
  for(account in accountStore.store) {
    accountStore.remove(account);
  }
  res.send("deleted");
});

//delete a schedule when given its name in url
app.delete('/api/account/:id', authenticateToken,function (req, res) {
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

  else if(Object.keys(queryParameter).length==3){
    if(queryParameter.subject){
      queryParameter.subject = queryParameter.subject.toLowerCase();
      queryParameter.subject = queryParameter.subject.split(" ").join("")
    }
    if(queryParameter.catalog_nbr){
      queryParameter.catalog_nbr = queryParameter.catalog_nbr.toLowerCase();
    }
    if(queryParameter.ssr_component){
      queryParameter.ssr_component = queryParameter.ssr_component.toLowerCase();
    }
    console.log(queryParameter.subject);
    for(course of courses){
      if(queryParameter.subject.length>3){
        if(stringSimilarity.compareTwoStrings(course.subject.toLowerCase(), queryParameter.subject)>0.4 && course.catalog_nbr.toString().toLowerCase().includes(queryParameter.catalog_nbr) && course.course_info[0].ssr_component.toLowerCase().includes(queryParameter.ssr_component)){
          results.push(course);
        }
      }
      else{
        if(course.subject.toLowerCase().includes(queryParameter.subject) && course.catalog_nbr.toString().toLowerCase().includes(queryParameter.catalog_nbr) && course.course_info[0].ssr_component.toLowerCase().includes(queryParameter.ssr_component)){
          results.push(course);
        }
      }
    }
    res.send(results);
  }

});

//add courses to database
router.get('/create', (req, res) => {
  //courseStore.put('courses',coursesfromJSON);
  //res.send(courseStore.get('courses'));

});

//get one course using id
router.get('/:id/:id2', function (req, res) {

  const course = courses.find(c => c.subject.toString() === req.params.id && c.catalog_nbr.toString() === req.params.id2);
  if(!course) return res.status(404).send('Course not found');
  
  //courses.filter(course => course.subject.indexOf(req.params.id) !== -1);
  res.send(course);
});

////////////////////////////////////////////////////////////////////////////////////////////REVIEWS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//get review when given a name
app.get('/api/review/:id', (req, res) => {
  const result = [];
  if(reviewsStore.get(req.params.id)){
    result.push(reviewsStore.get(req.params.id))
  }
  res.send(result);
});

//create review
app.post('/api/review/create', authenticateToken,function (req, res) {
  //const { error } = validateAccount(req.body); //result.error
  //if(error) return res.status(400).send(result.error.details[0].message);

  if(reviewsStore.get(req.body.subject+req.body.catalog_nbr)){
    var reviews = reviewsStore.get(req.body.subject+req.body.catalog_nbr).review;
    var names = reviewsStore.get(req.body.subject+req.body.catalog_nbr).names;
    var times = reviewsStore.get(req.body.subject+req.body.catalog_nbr).times;
    var hidden = reviewsStore.get(req.body.subject+req.body.catalog_nbr).hidden;
  }
  else{
    var reviews = [];
    var names = [];
    var times = [];
    var hidden = [];
  }

  reviews.push(req.body.review);
  names.push(req.body.name);
  times.push(new Date().toLocaleString());
  hidden.push(false);

  var review = {
    review: reviews,
    names: names,
    times: times,
    hidden: hidden,
  }
  reviewsStore.put(req.body.subject+req.body.catalog_nbr,review)

  res.send(reviewsStore.get(req.body.subject+req.body.catalog_nbr));
})

//create review
app.post('/api/review/hidden', authenticateToken,function (req, res) {
  //const { error } = validateAccount(req.body); //result.error
  //if(error) return res.status(400).send(result.error.details[0].message);
  var reviews = reviewsStore.get(req.body.subject+req.body.catalog_nbr).review;
  var names = reviewsStore.get(req.body.subject+req.body.catalog_nbr).names;
  var times = reviewsStore.get(req.body.subject+req.body.catalog_nbr).times;
  var hidden = reviewsStore.get(req.body.subject+req.body.catalog_nbr).hidden;

  for(var i = 0; i< reviews.length;i++){
    if(reviews[i]==req.body.review && names[i]== req.body.name && times[i]==req.body.time){
      console.log("asdasdnaklfjgasoikgoaishgaoigoai")
      hidden[i]=!hidden[i];
    }
  }

  var review = {
    review: reviews,
    names: names,
    times: times,
    hidden: hidden,
  }
  reviewsStore.put(req.body.subject+req.body.catalog_nbr,review)

  res.send(reviewsStore.get(req.body.subject+req.body.catalog_nbr));
})
////////////////////////////////////////////////////////////////////////////////////////////pages///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//get page text
app.get('/api/page/:id', (req, res) => {
  res.send([pageStore.get(req.params.id)]);
});

//update page text
app.post('/api/page/create', function (req, res) {
  pageStore.put(req.body.page,req.body.text)

  res.send(reviewsStore.get(req.body.page));
})













////////////////////////////////////////////////////////////////////////////////////////////Validation///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    password: Joi.string().required().regex(/[`!@#%^&*()_+\-=\[\]{};':"\\|<>\?~]/ , { invert: true }),
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

function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null){
    return res.sendStatus(401);
  }
  jwt.verify(token, '8c14e9e532ee85716f59d11e696b705aecc52e75e56f0964aece2484bedf1b63bce460f88f2cb37c193a744f793f0190c63666283588612418c04713ff563701', (err,user)=>{
    if(err) return res.send(403);
    req.user = user;
    next()
  })
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