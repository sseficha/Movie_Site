var express = require("express");
var mongoose = require("mongoose");
var request = require("request");
var bodyParser = require("body-parser");
var session = require("express-session");
var Movie = require("./models/movies.js");
var User = require("./models/users.js");
var helpers = require("./helpers.js");
var format_data = helpers.format_data;

var app = express();
app.use(bodyParser.urlencoded({extended:true}));	//gia req.body
app.use(express.static("public"));

app.use(session({
	resave: false,
	saveUninitialized: false,
  	secret: "my_secret_123",
  	cookie:{
  		maxAge: 2 * 60 * 60 * 1000}
}));


// var parsedData;
var dcount=0;







 app.listen(3000, function(){
     console.log("Server started....");
 })

 mongoose.connect("mongodb://localhost:27017/movie_database",{ useNewUrlParser: true });





app.get("/logout",function(req,res){
	req.session.destroy(function(){
		console.log("session destroyed............");
		res.redirect("/login");
	})

});



app.get("/login",function(req,res){


	res.render("login.ejs");
});



app.get("/home",function(req,res){
	if(!(req.session && req.session.userId))
	{
		res.redirect("/login");
	}
	
		var id=req.session.userId;

		User.findById(id, function(err,user){
			if(user == null)
				console.log("NO SUCH USER FOUND");
			else
			{
				Movie.find({}).sort({downloads:-1}).lean().exec(function(err, docs){
						var top=[];
						for(var i=0;i<5;i++){
							top.push(docs[i]);
						}
						for(var i=0;i<5;i++){
							if(top[i]==null)
								top[i]="empty"		//////////////////// diorthose to 
						}
					res.render("home.ejs",{data : top});
				});

			}
		});
	


});










app.post("/login",function(req,res){
	var username=req.body.username;
	var password=req.body.password;
	User.findOne({username: username, password: password},function(err, user){
		if(user==null)
		{
			res.send("no such user");
		}
		else
		{
			req.session.userId = user._id;
			console.log("USER LOGGED IN: "+username);
			res.redirect("/home")
		}
	});
});






app.post("/signup",function(req,res){
	var username=req.body.username;
	var password=req.body.password;
	User.findOne({username: username},function(err, user){
		if(user==null)
		{
			User.create({username: username, password: password},function(err, saved_user){
				if(err)
				{
					console.log("ERROR CREATING NEW USER");
				}
				else
				{
					console.log(saved_user);
					req.session.userId = saved_user._id;
					res.redirect("/home");
				}
			});
		}
		else
		{
			console.log("USERNAME TAKEN");
		}
	});
});

// User.create({
// 	username: "me",
// 	password: 123
// },function(err,user){
// 	if(err)
// 		console.log(err);
// 	else
// 	{
// 		console.log("SAVED USER");
// 		console.log(user);
// 	}
	
// });

app.get("/home/:title",function(req,res){
	if(!(req.session && req.session.userId))
	{
		res.redirect("/login");
	}
	var title=req.params.title;
	var url="https://yts.am/api/v2/list_movies.json?query_term=";
	url=url+title;
	request(url,function(error,response,body){
	if(!error && response.statusCode==200)
	{

		var data=JSON.parse(body);
		var parsedData=format_data(data);
		var ids=[];
		for(var i=0;i<parsedData.length;i++)
		{
			ids.push(parsedData[i].id);
		}
		Movie.find().where('id').in(ids).exec(function (err, records) {
			if(records.length!=0)
			{
				for(var i=0;i<parsedData.length;i++)
			{
				for(var j=0;j<records.length;j++)
				{
					if(records[j].id == parsedData[i].id)
					{
						parsedData[i].downloads=records[j].downloads;
					}
				}
			}
			}
			res.send(parsedData);

  		});	
		
	}
	});

});






var movie_data;

app.get("/search/:id",function(req,res){
	if(!(req.session && req.session.userId))
	{
		res.redirect("/login");
	}
		var url="https://yts.am/api/v2/movie_details.json?movie_id=";
		url=url+req.params.id;
		request(url,function(error,response,body){
			if(!error && response.statusCode==200)
			{
				var data=JSON.parse(body);
				movie_data=helpers.format_data_one(data);
			}
			Movie.findOne({id:movie_data.id},function(err,doc){
				if(doc!=null)
				{
					movie_data.downloads=doc.downloads;
				}
				var url="https://yts.am/api/v2/movie_suggestions.json?movie_id=";
				url=url+movie_data.id;
				request(url,function(error,response,body){
					if(!error && response.statusCode==200)
					{
						var body2=JSON.parse(body);
						var sug_data=helpers.format_data_sug(body2);
					}
					res.render("searched_movie.ejs",{data:movie_data, sug_data:sug_data});
				});
			});
		});
});



app.post("/add_history",function(req,res){
	
	var movie_to_be_saved = movie_data;
	var id=req.session.userId;
	if(movie_to_be_saved.downloads == 0)
		movie_to_be_saved.downloads=1;
	Movie.findOne({ id: movie_to_be_saved.id }, function (err,movie) {
		if(movie==null)
		{	
			Movie.create(movie_to_be_saved,function(err,saved_movie){
			    if(err)
			        console.log("COULDNT SAVE MOVIE");
			    else
			    {
			    	saved_movie.downloads=1;
			        console.log("SAVED MOVIE!");
			        console.log(saved_movie);
			        User.findOneAndUpdate({_id : id}  , { $push: {moviesHistory: saved_movie} } , function(err,doc){
						if(err)
							console.log("ERROR UPDATING USER MOVIE HISTORY");
						else
						{
							console.log("pushed to history");
						}
					});
					// res.redirect("/home");
		    	}
			});
		}
		else
		{
			console.log("MOVIE ALREADY IN DB!");
			var n = movie.downloads;
			n=n+1;
			movie.downloads=n;
			movie.save();
			User.findOneAndUpdate({_id : id}  , { $push: {moviesHistory: movie} } , function(err,doc){
				console.log("pushed to history");
			});

			// res.redirect("/home");

		}

	});
	
});


app.get("/history",function(req,res){
	var id=req.session.userId;
	User.findById(id, function(err,user){	
		var history=user.moviesHistory;
		history=history.toObject();
		res.render("history.ejs",{data: history});

	});


});



// var movieSchema = new mongoose.Schema({
//    title: String,
//    year: Number
// });

// var Movie=mongoose.model("Movie",movieSchema);

// Movie.create({
    
// },function(err,movie){
//    if(err)
//         console.log(err);
//     else
//     {
//         console.log("SAVED!");
        
//     }
// });