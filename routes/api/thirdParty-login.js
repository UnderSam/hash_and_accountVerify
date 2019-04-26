const express = require('express');
const router = express.Router();
var db = require('./connection');
var request = require('request');
var config = require("../../config/config.js");
var port = 3000;

var githubOAuth = require('github-oauth')({
  githubClient: config.GITHUB_KEY,
  githubSecret: config.GITHUB_SECRET,
  baseURL: 'http://localhost:' + port,
  loginURI: '/auth/github',
  callbackURI: '/auth/github/callback'
})

router.get("/auth/github", function(req, res){
  console.log("started oauth");
  return githubOAuth.login(req, res);
});

router.get("/auth/github/callback", function(req, res){
  console.log("received callback");
  return githubOAuth.callback(req, res);
});

githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
})

githubOAuth.on('token', function(token, serverResponse) {
  let access_token = token['access_token'];
  let auth_url = 'https://api.github.com/user?access_token='+access_token;
  var options = {
  	uri:auth_url,
  	headers: { // github require request must have user agent headers.
			        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
					"Accept-Language":"en-US,en;q=0.9",
					"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
					"Connection":"keep-alive"
	},
	json: true // Automatically parses the JSON string in the response.
  };
  console.log('auth url :'+ auth_url);
  request(options, function (error, response, body) {
	   // Print the error if one occurred
	  console.log('error:', error);
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  console.log('body:', body); // Print the HTML for the Google homepage.
	  if(response.statusCode==200){
	  	serverResponse.end(JSON.stringify(body));
	  }
	  else{
	  	serverResponse.end(error);
	  }
	});
})