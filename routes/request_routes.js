

// THIS IS ROUTES FILE FOR FR RELATED ROUTES //
const request_routes = require('express').Router();
const dbcon = require('../dbconnection')


function get_last_req_id() {
	return new Promise(function (resolve, reject) {
		dbcon.query('SELECT req_id as id FROM request ORDER BY req_id DESC LIMIT 1', (err, rows) => {
			console.log("in qry " + rows[0].id)
			if (rows[0].id > 0) {
				resolve(rows[0].id)
				console.log("in qry resolve " + rows[0].id)
			} else {
				reject("erro in promise")
			}

		});

	})
};

// POST- New  flying Request
request_routes.post('/new', (req, res) => {
	console.log('data recieved to back end')

	var req_type = req.body.req_type
	var district = req.body.district
	var town = req.body.town
	var area = req.body.area
	var date = req.body.date
	var time_from = req.body.time_from
	var time_to = req.body.time_to
	var cus_id = null
	var map_area = null
	var start_time = null
	var end_time = null
	var total_fly_time = null
	var quality_category = req.body.quality_categoty
	var max_flight_time = req.body.max_flight_time
	var drone_recieved = "pending";
	var media_recieved = "pending";
	var media_confirmed = "pending";
	var completed = "pending"
	var cus_id = "45"	// cus_id must get using sessions
	var own_id = null
	var pil_id = null
	var dro_id = null
	var new_req_id 



	// Updating request table

	var req_data = [req_type, district, town, area, date, time_from,time_to, cus_id, map_area,start_time,end_time,total_fly_time,quality_category,max_flight_time]
	console.log(req_data)
	var sql1 = "INSERT INTO request(req_type, district, town, area, date, time_from,time_to, cus_id, map_area,start_time,end_time,total_fly_time,quality_category,max_flight_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	dbcon.query(sql1, req_data, (err, result) => {
		if (err) {
			console.log("Error in query request")
		} else {
			console.log("Number of records inserted to request: " + result.affectedRows);
		}
	});

	//Updating req_status table

	var status_data = [drone_recieved, media_recieved, media_confirmed, completed]
	var sql2 = "INSERT INTO req_status(drone_recieved,media_recieved,media_confirmed,completed) VALUES(?,?,?,?)"
	dbcon.query(sql2, status_data, (err, result) => {
		if (err) {
			console.log("Error in query req_status" + err)
		} else {
			console.log("Number of records inserted to req_status: " + result.affectedRows);
		}
	})


	//Updating req_assigned table

	var assigned_data = [cus_id, own_id, pil_id, dro_id]
	var sql3 = "INSERT INTO req_assigned(cus_id,own_id,pil_id,dro_id) VALUES(?,?,?,?)"
	dbcon.query(sql3, assigned_data, (err, result) => {
		if (err) {
			console.log("Error in query req_assigned" + err)
		} else {
			console.log("Number of records inserted to req_assigned: " + result.affectedRows);
		}
	})


})

//GET All requests
request_routes.get("/all",authenticationMiddleware(),(req, res) => {

	console.log(req.user);
	console.log(req.isAuthenticated());

	dbcon.query("SELECT * FROM request", (err, results) => {
		if (err) {
			console.log(err)
		}
		var result_data = []
		result_data = JSON.stringify(results)
		res.send(result_data)

	})



})

//GET All pending requests
request_routes.get("/all_pending", (req, res) => {
	console.log("GET All pending requests recieved to back end")
	dbcon.query("SELECT * FROM request WHERE req_id IN (SELECT req_id FROM req_assigned WHERE own_id IS NULL)", (err, results) => {
		if (err) {
			console.log(err)
		}
		console.log(JSON.stringify(results))
		res.send(results)
	})
})

//GET one request by ID
request_routes.get("/:id", (req, res) => {
	var req_id =  req.params.id
	console.log("bakend route id  : "+ req_id)
	dbcon.query("SELECT * FROM request WHERE req_id=?",req_id, (err, results) => {
		if (err) {
			console.log(err)
		}

		var result_data = []
		result_data = JSON.stringify(results)
		res.send(result_data)	
		console.log("bakend route id  : "+ req_id)
		console.log("data in backend : "+ result_data)
		

	})

	

})
function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}

module.exports = request_routes;



