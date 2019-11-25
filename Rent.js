var express = require("express");
var app = express();
var html = require("html");

var bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static("."));
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jin6899jin",
  database: "final_project"
});
con.connect(function(err){
  if(err){
    console.log(err);

  }
  else{
    console.log ("database successfully connected");
  }
});



app.get("/Register",function(req,res,html){
  //res.redirect("./Register.html")
  var userId= req.query.userId;
  var password=req.query.password;

  var sqlcmd ='select * from user_id where Userid = "';
  sqlcmd += String(userId);
  sqlcmd += '"';
  console.log(sqlcmd);
  con.query(sqlcmd, function(err,rows,fields){
    console.log(rows)
    if(rows.length == 0){
      console.log("does not exist")

      var sqlinsert = 'INSERT INTO user_id (Userid,pasword,login) VALUES ("';
      sqlinsert += String(userId) + '","';
      sqlinsert += String(password) + '","0");';

      con.query(sqlinsert, function(err,rows,fields){
        console.log(sqlinsert);
      });
      res.redirect("./Login.html")

    }
    else {
      res.send("False")
    }

});
});

app.get("/Login",function(req,res){
  var userId= req.query.userId;
  var password=req.query.password;
  var sqlcmd ='select * from user_id where Userid = "';
  sqlcmd += String(userId);
  sqlcmd += '" and pasword = "';
  sqlcmd += String(password);
  sqlcmd += '"';
  console.log(sqlcmd);
  con.query(sqlcmd, function(err,rows,fields){
    console.log(rows)
    if(rows.length == 0){
      console.log("error")
      res.send("False")
    }
    else {




      var sqlreset = 'UPDATE user_id Set login = 0 Where login = 1';

      con.query(sqlreset, function(err,rows,fields){
        console.log(sqlreset);
        /// ** add book to the record, print the book records to menu.html using ajax**

        var sqlinsert = 'UPDATE user_id Set login = 1 Where Userid ="';
        sqlinsert += String(userId) + '";';
        //sqlinsert += String(password) + '");';
        con.query(sqlinsert, function(err,rows,fields){
          console.log(sqlinsert);
        });
        res.redirect("./Menu.html")


      });




      //res.send("C:/Users/ALEX/Documents/DREXEL/CS275/Final_Project/Menu.html",{userId:userId});
      //console.log(userId)
      //window.location=("/Menu",{userId:userId});
    }

  });
  //res.redirect("./Login.html")
});

app.get("/Menu",function(req,res){
  var sqlcmd ='select * from user_id where login = 1';
  var userid = "";
  con.query(sqlcmd, function(err,rows,fields){
    console.log("result")
    console.log(rows)
    userid = rows[0].Userid
    //////////////////////////////////////////////////////////////
    var sqlselect = 'select userId,bookId,booktitle,location,DueDate from books where userId = "';
    sqlselect += userid + '";';
    con.query(sqlselect, function(err,rows,fields){
      console.log(sqlselect);
      console.log(rows);
      if(rows.length == 0){
        rows = [{userId:userid,bookId:'-1'}]
      }
      res.send(rows);
    });
/////////////////////////////////////////////////////////////////////////



  });


  //res.redirect("./Menu.html")
});

app.get("/Add",function(req,res){
  var query = req.query;
  var userId = query.userId;
  var booktitle = query.booktitle;
  var location = query.location;
  var dueDate = query.dueDate;

  var sqlinsert = 'INSERT INTO books (userId,booktitle,location,DueDate) VALUES ("';
  sqlinsert += String(userId) + '","';
  sqlinsert += String(booktitle) + '","';
  sqlinsert += String(location) + '","';
  sqlinsert += String(dueDate) + '");';
  con.query(sqlinsert, function(err,rows,fields){
    console.log("Book Added")

  });
});


app.get("/Remove",function(req,res){
  var query = req.query;
  var bookId = query.bookId;


  var sqlinsert = 'DELETE FROM books WHERE (bookId = "' ;
  sqlinsert += String(bookId) + '");';
  con.query(sqlinsert, function(err,rows,fields){
    console.log("Book Removed");

  });
});

app.get("/Edit",function(req,res){
  var query = req.query;
  var bookId = query.bookId;
  var booktitle = query.booktitle;
  var location = query.location;
  var dueDate = query.dueDate;

  var sqlinsert = 'UPDATE books SET booktitle = "' +
    String(booktitle) + '", location = "' +
    String(location) + '", DueDate = "' +
    String(dueDate) + '" WHERE (bookId = "' +
    String(bookId) + '");' ;
    console.log(sqlinsert);
  con.query(sqlinsert, function(err,rows,fields){
    console.log("Book Edited");

  });
});

app.get("/GetBook",function(req,res){
  var query = req.query;
  var bookId = query.bookId;

  var sqlinsert = 'SELECT * FROM books WHERE bookId = ' +
      bookId +';'
    console.log(sqlinsert);
  con.query(sqlinsert, function(err,rows,fields){
    console.log("Book Removed");
    res.send(rows);

  });
});

app.listen(8080,function(){

});
