var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const userNotFoundMessage = {
  "errormessage": "User not found!"
};

const userAlreadyPresent = {
  "errormessage": "User is already present!"
};

const userRegisteredSuccessfully = {
  "successmessage": "User is registered!"
};

var users = require('./models/users.js');

var app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/UserDetails');

app.get('/', function(request, response){
  response.send('Please use /api/users');
});

app.get('/api/users', function(request, response){
  users.getUsers(function(error, users){
    if(error){
      throw(error)
    }
    response.json(users);
  });
});

app.get('/api/users/:user_id', function(request, response){
  users.getUserById(request.params.user_id, function(error, user){
    if(error){
      throw(error)
    }
    response.json(user);
  });
});

app.post('/login', function(request, response){
  users.validateUserLogin(request.body.username, request.body.password, function(error, user){
    if(error){
      throw(error)
    }
    if(user == null){
      response.status(404).send(userNotFoundMessage);
    } else{
      response.status(200).send(user);
    }
  });
});

app.post('/register', function(request, response){
  users.registerUser(request.body.firstname, request.body.lastname, request.body.username, request.body.password, function(user){
      if(user == null){
        response.status(200).send(userRegisteredSuccessfully);
      } else{
        response.status(409).send(userAlreadyPresent);
      }
  });
});


app.listen(3000);

console.log('Server running on port 3000...');
