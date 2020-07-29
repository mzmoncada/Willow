app.post('/0.2/getuserdetails', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    var first_name = data['first name'];
    var last_name = data['last name'];
    storeUserDetails(messenger_id,first_name,last_name);
    var sql = "SELECT * FROM users_details WHERE id="+messenger_id;
    console.log(sql);
    let formated_data = new Object();
    formated_data.success = "true";
    formated_data.messages = [];
    con.query(sql, function (err, results) {
        console.log("1st query execution..");
        if (err) throw err;
        console.log(results);
        if (typeof results != "undefined" && results != null && results.length != null && results.length > 0) {
            results.forEach(function (row, index, _arr) {
                var text = "Name: "+row.first_name+" "+row.last_name+"\nScore: "+row.score+"\nLevel: "+row.level;
                formated_data.messages.push({"text":text});
            });
        }
        else {
            formated_data.messages.push({"text":"Data does not exist."});
        }
        console.log(formated_data);
        res.send(JSON.stringify(formated_data));
    });
});


app.post('/', function (req, res) {
    var data=req.body;
    var session = data.session.substr(data.session.lastIndexOf("/")+1);
    var intent = data.queryResult.intent.displayName;
    var messenger_id = data.originalDetectIntentRequest.payload.data.recipient.id;
    console.log(intent);
    console.log(session);
    console.log(messenger_id);
    var sql = "INSERT IGNORE INTO users SET id = "+messenger_id;
    con.query(sql, function (err, results) {
        console.log("1st query execution..");
        if (err) throw err;
        console.log(results);
    });
    var field_val = data.queryResult.queryText;
    var email = data.queryResult.parameters.email!=null?data.queryResult.parameters.email[0]:null;
    var times_per_day = data.queryResult.parameters.number!=null?data.queryResult.parameters.number[0]:null;
    var field = "";
    switch (intent) {
        case "MOD 3.5":
            field = "event_to_remember";
            break;
        case "MOD 4":
            field = "additional_details";
            break;
        case "MOD 5A":
            field = "feeling";
            field_val = "Positively";
            break;
        case "MOD 5B":
            field = "feeling";
            field_val = "Negatively";
            break;
        case "MOD7":
            field = "emotions";
            break;
        case "MOD8":
            field = "thoughts_at_that_time";
            break;
        default:
            break;
    }
    console.log(email,times_per_day,field,field_val);
    if (email!=null) {
        sql = "UPDATE users SET email = '"+email+"' WHERE id="+messenger_id;
    }
    else if (times_per_day!=null) {
        sql = "UPDATE users SET times_per_day = '"+times_per_day+"' WHERE id="+messenger_id;
    }
    else if (field!="" && field_val!="" && field_val!=null) {
        sql = "INSERT INTO records (user_id,session_id,"+field+") VALUES ("+messenger_id+",'"+session+"','"+field_val+"') ON DUPLICATE KEY UPDATE "+field+"='"+field_val+"'";
    }
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("2nd query execution..");
        if (err) throw err;
        console.log(results);
    });
    res.send("");
});