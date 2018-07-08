// THIS IS ROUTES FILE FOR USER RELATED ROUTES //

const user_routes = require('express').Router();
const dbcon = require('../dbconnection');
var passport = require('passport');







//GET All Customers
user_routes.get('/cus', (req, res) => {
    console.log('user_routes called')
    dbcon.query("SELECT * FROM customer", (err, results) => {
        if (err) {
            console.log(err)
        }
        var all_cus_arr = []
        all_cus_arr = JSON.stringify(results)
        console.log(all_cus_arr)
        res.send(all_cus_arr)

    })
})

//GET Customer by ID
user_routes.get('/cus/:id', (req, res) => {
    console.log('user_routes called')
    var id = req.body.id
    dbcon.query("SELECT * FROM customer WHERE cus_id=?",id, (err, results) => {
        if (err) {
            console.log(err)
        }
        var user_data_arr = []
        user_data_arr = JSON.stringify(results)
        //console.log(user_data_arr)
        res.send(user_data_arr)

    })
})

//GET All Pilots
user_routes.get('/pil', (req, res) => {
    console.log('user_routes called')
    dbcon.query("SELECT * FROM drone_pilot", (err, results) => {
        if (err) {
            console.log(err)
        }
        var all_pil_arr = []
        all_pil_arr = JSON.stringify(results)
        console.log(all_pil_arr)
        res.send(all_pil_arr)

    })
})

//GET Pilot by ID
user_routes.get('/pil/:id', (req, res) => {
    console.log('user_routes called')
    var id = req.body.id
    dbcon.query('SELECT * FROM drone_pilot WHERE pil_id=?',id, (err, results) => {
        if (err) {
            console.log(err)
        }
        var user_data_arr = []
        user_data_arr = JSON.stringify(results)
        console.log(user_data_arr)
        res.send(user_data_arr)

    })
})

//GET All Owners
user_routes.get('/own', (req, res) => {
    console.log('user_routes called')
    dbcon.query("SELECT * FROM drone_owner", (err, results) => {
        if (err) {
            console.log(err)
        }
        var all_own_arr = []
        all_own_arr = JSON.stringify(results)
        console.log(all_own_arr)
        res.send(all_own_arr)

    })
})

//GET Owner by ID
user_routes.get('/own/:id', (req, res) => {
    console.log('user_routes called')
    var id = req.body.id
    dbcon.query("SELECT * FROM drone_owner WHERE own_id=?",id, (err, results) => {
        if (err) {
            console.log(err)
        }
        var user_data_arr = []
        user_data_arr = JSON.stringify(results)
        //console.log(user_data_arr)
        res.send(user_data_arr)

    })
})

//GET All Admins
user_routes.get('/admin', (req, res) => {
    console.log('user_routes called')
    dbcon.query("SELECT * FROM admin", (err, results) => {
        if (err) {
            console.log(err)
        }
        var all_admin_arr = []
        all_admin_arr = JSON.stringify(results)
        console.log(all_admin_arr)
        res.send(all_admin_arr)

    })
})

//GET Admin by ID
user_routes.get('/admin/:id', (req, res) => {
    console.log('user_routes called')
    var id = req.body.id
    dbcon.query("SELECT * FROM admin WHERE adm_id=?",id, (err, results) => {
        if (err) {
            console.log(err)
        }
        var user_data_arr = []
        user_data_arr = JSON.stringify(results)
        //console.log(user_data_arr)
        res.send(user_data_arr)

    })
})

//POST New Pilot
user_routes.post('/pil/new',(req,res)=>{
    var fname = req.body.firstname
    var lname = req.body.lastname
    var dob = req.body.dob
    var age = req.body.age    
    var sex = req.body.sex
    var nic = req.body.nic
    var mobile_no = req.body.mobile_no
    var fixed_no = req.body.fixed_no
    var email = req.body.email
    var fb_link = req.body.fb_link
    var username = req.body.username
    var password = req.body.password
    var con_password = req.body.con_password

    console.log(fname)

    var data_arr = [username,password,fname,lname,dob,age,sex,nic,mobile_no,fixed_no,email,fb_link]
    var sql1 = "INSERT INTO drone_pilot(username ,password ,f_name ,l_name ,dob ,age ,sex ,nic ,mobile_no ,fixed_no ,email ,fb_link) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)"
    // var sql2 = "SELECT LAST_INSERT_ID() as user_id"
    dbcon.query(sql1,data_arr,function(err,results){
            if (err) throw err;

            dbcon.query('SELECT LAST_INSERT_ID() as user_id', function(err,results){
                if (err) throw err;
                const user_id = results[0];
                console.log(user_id);
                // req.login(user_id, function(err){
                //     res.redirect('/')
                //     res.send(" get user id ok");
                // });
                // // res.json({
                //     id: user_id
                req.login(user_id,function(err){
                res.redirect('/')
                })
                });
                
                
            });
        });
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });
  
  passport.deserializeUser(function(user_id, done) {
      done(null, user_id);

  });

//   function authenticationMiddleware () {  
// 	return (req, res, next) => {
// 		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

// 	    if (req.isAuthenticated()) return next();
// 	    res.redirect('/login')
// 	}
// }

//pilot login

user_routes.post('/user/login',passport.authenticate(
    'local',{
        successRedirect: '/pil_main_page',
        failureRedirect: '/login'
    }
));


module.exports = user_routes
