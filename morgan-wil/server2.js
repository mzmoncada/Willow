var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const mysql = require("mysql");
var port = process.env.PORT || 8080;
var con = mysql.createConnection({host: "db4free.net", user: "sakilppo", password: "sreejit@123", database: "morganwil"});
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// points declaration
var base = 100;
var journalizingPoints = 5;
var meditatingPoints = 10;
var learningPoints = 5;

app.post('/0.2/storeuserdetails', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    storeUserDetails(messenger_id,data['first name'],data['last name']);
    let formated_data = new Object();
    formated_data.success = "true";
    formated_data.set_attributes = {"broadcastFlag" : "on"};
    console.log(formated_data);
    res.send(JSON.stringify(formated_data));
});

app.post('/0.2/storeuseremail', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    storeUserDetails(messenger_id,data['first name'],data['last name']);
    var sql = "UPDATE users_details SET email_id = "+ con.escape(data.userEmail)+" WHERE id="+messenger_id;
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("1st query execution..");
        if (err) throw err;
        console.log(results);
        let formated_data = new Object();
        formated_data.success = "true";
        formated_data.set_attributes = {"broadcastFlag" : "on"};
        console.log(formated_data);
        res.send(JSON.stringify(formated_data));
    });
});


app.post('/0.2/savestory', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    storeUserDetails(messenger_id,data['first name'],data['last name']);
    created = new Date().toISOString().slice(0, 19).replace('T', ' ');
    sql = "INSERT INTO `daily_journal`(`user_id`, `primary_emotion`, `detailed_emotion`, `topic_cause`, `story`, `timestamp`) VALUES ("+ messenger_id +","+ con.escape(data.primaryEmotion) +","+ con.escape(data.detailedEmotion) +","+ con.escape(data.topicCause) +","+ con.escape(data.causeDetail) +",'"+ created +"')";
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("1st query execution..");
        if (err) throw err;
        console.log(results);
        scoreAndLevel(messenger_id, journalizingPoints, function(){
            console.log("No error should come now!");
            let formated_data = new Object();
            formated_data.success = "true";
            formated_data.set_attributes = {"broadcastFlag" : "on"};
            console.log(formated_data);
            res.send(JSON.stringify(formated_data));
        });
    });
});

app.post('/0.2/saveDreamJournal', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    storeUserDetails(messenger_id,data['first name'],data['last name']);
    let scoreInfo = new Object();
    created = new Date().toISOString().slice(0, 19).replace('T', ' ');
    sql = "INSERT INTO `dream_journal`(`user_id`, `dream_type`, `dream_story`, `dream_rate`, `timestamp`) VALUES ("+ messenger_id +","+ con.escape(data.dreamType) +","+ con.escape(data.dreamStory) +","+ con.escape(data.dreamRate) +",'"+ created +"')";
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("1st query execution..");
        if (err) throw err;
        console.log(results);
        scoreAndLevel(messenger_id, journalizingPoints, function(){
            scoreInfo = getScoreInfo(messenger_id, function(){
                console.log(scoreInfo);
                let formated_data = new Object();
                formated_data.success = "true";
                formated_data.set_attributes = {"broadcastFlag" : "on", "pointsEarned" : journalizingPoints, "scoreRequired" : scoreInfo.scoreRequired, "nextLevel" : scoreInfo.nextLevel};
                console.log(formated_data);
                res.send(JSON.stringify(formated_data));
            });           
        });
    });
});



app.post('/0.2/savefeedback', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    storeUserDetails(messenger_id,data['first name'],data['last name']);

    sql = "INSERT INTO `user_feedbacks`(`user_id`, `feedback`) VALUES ("+ messenger_id +","+ con.escape(data.feedBack) +")";
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("1st query execution..");
        if (err) throw err;
        console.log(results);
        sql = "SELECT email_id FROM users_details WHERE id = "+messenger_id;
        console.log(sql);
        con.query(sql, function (err, results) {
            console.log("2nd query execution..");
            if (err) throw err;
            console.log(results);
            let formated_data = new Object();
            formated_data.success = "true";
            formated_data.set_attributes = {"broadcastFlag" : "on"};
            formated_data.redirect_to_blocks = [];
            if (typeof results != "undefined" && results != null && results.length != null && results.length > 0) {
                results.forEach(function (row, index, _arr) {
                    if(typeof row.email_id == "undefined" || row.email_id == null || row.email_id.length == 0 || row.email_id.length == null)
                        formated_data.redirect_to_blocks.push("getEmail");
                });
            }
            console.log(formated_data);
            res.send(JSON.stringify(formated_data));
        });        
    });
});



app.post('/0.2/getstory', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    storeUserDetails(messenger_id,data['first name'],data['last name']);
    var sql = "SELECT * FROM `daily_journal` WHERE user_id="+messenger_id+" LIMIT 5";
    console.log(sql);
    let formated_data = new Object();
    formated_data.success = "true";
    formated_data.messages = [];
    formated_data.set_attributes = {"broadcastFlag" : "on"};
    con.query(sql, function (err, results) {
        console.log("1st query execution..");
        if (err) throw err;
        console.log(results);
        if (typeof results != "undefined" && results != null && results.length != null && results.length > 0) {
            results.forEach(function (row, index, _arr) {
                var text = "Primary Emotion: "+row.primary_emotion+"\n\nDetailed Emotion: "+row.detailed_emotion+"\n\nTopic Cause: "+row.topic_cause+"\n\nStory: "+row.story;
                formated_data.messages.push({"text":text});
            });
        }
        else {
            formated_data.messages.push({"text":"You have no story yet!"});
        }
        console.log(formated_data);
        res.send(JSON.stringify(formated_data));
    });
});
app.post('/0.2/getuserdetails', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    storeUserDetails(messenger_id,data['first name'],data['last name']);
    var sql = "SELECT * FROM users_details WHERE id="+messenger_id;
    var statusFlag;
    var status;
    var toDoMessage;
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
                statusFlag = row.status;
                if(statusFlag == 1)
                {
                    status = "subscribed";
                    toDoMessage = "Unsubscribe";
                }
                else if(statusFlag == 0){
                    status = "unsubscribed";
                    toDoMessage = "Subscribe";
                }
                var text = "Name: "+row.first_name+" "+row.last_name+"\nScore: "+row.score+"\nLevel: "+row.level+"\nStatus: "+status;
                formated_data.messages.push({"text":text});
                formated_data.set_attributes = {"broadcastFlag" : "on", "status" : status, "toDoMessage": toDoMessage};
            });
        }
        else {
            formated_data.messages.push({"text":"Data does not exist."});
            formated_data.set_attributes = {"broadcastFlag" : "on"};
        }
        console.log(formated_data);
        res.send(JSON.stringify(formated_data));
    });
});

app.post('/0.2/GetScoreAndLevel', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    storeUserDetails(messenger_id,data['first name'],data['last name']);
    scoreInfo = getScoreInfo(messenger_id, function(){
        console.log(scoreInfo);
        let formated_data = new Object();
        formated_data.success = "true";
        formated_data.set_attributes = {"broadcastFlag" : "on", "level" : scoreInfo.level, "scoreRequired" : scoreInfo.scoreRequired, "nextLevel" : scoreInfo.nextLevel};
        console.log(formated_data);
        res.send(JSON.stringify(formated_data));
    });     
});

app.post('/0.2/changeuserstatus', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    storeUserDetails(messenger_id,data['first name'],data['last name']);
    var sql = "SELECT status FROM users_details WHERE id = "+messenger_id;
    var statusFlag;
    var newStatusFlag;
    var newStatus;
    console.log(sql);
    let formated_data = new Object();
    formated_data.success = "true";
    con.query(sql, function (err, results) {
        console.log("1st query execution..");
        if (err) throw err;
        console.log(results);
        results.forEach(function (row, index, _arr) {
            statusFlag = row.status;
        });
        if(statusFlag == 1)
        {
            newStatusFlag = 0;
            newStatus = "unsubscribed";
        }
        else if(statusFlag == 0){
            newStatusFlag = 1;
            newStatus = "subscribed";
        }
        var sql2 = "UPDATE users_details SET status = "+ con.escape(newStatusFlag)+" WHERE id="+messenger_id;
        console.log(sql2);
        con.query(sql2, function (err, results) {
        console.log("2nd query execution..");
        if (err) throw err;
            console.log(results);
        });
        formated_data.set_attributes = {"broadcastFlag" : "on", "status" : newStatus};
        console.log(formated_data);
        res.send(JSON.stringify(formated_data));
    });
});



function scoreAndLevel(messenger_id, points, callbackFunction){
    var sql = "SELECT * FROM users_details WHERE id = "+messenger_id;
    var score;
    var level;
    var sql2;
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("3rd query execution..");
        if (err) throw err;
        console.log(results);
        results.forEach(function (row, index, _arr) {
            score = row.score;
            level = row.level;
        });
        score = score + points;
        console.log("Score increased : "+ score);
        while(score>=((base*(level+1)*(level+2))/2)){
            level++;
            console.log("Level increased : "+ level);
        }
        sql2 = "UPDATE users_details SET score="+score+", level="+level+" WHERE id="+messenger_id;
        console.log(sql2);
        con.query(sql2, function (err, results) {
        console.log("4th query execution..");
        if (err) throw err;
            console.log(results);
        callbackFunction();
        });
    });
    return;
}

function storeUserDetails(messenger_id,first_name,last_name){
    var sql = "INSERT IGNORE INTO users_details SET id = "+messenger_id;
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("1st query execution..");
        if (err) throw err;
        console.log(results);
    });
    var sql2 = "UPDATE users_details SET first_name = "+ con.escape(first_name)+", last_name = "+ con.escape(last_name)+" WHERE id="+messenger_id;
    console.log(sql2);
    con.query(sql2, function (err, results) {
    console.log("2nd query execution..");
    if (err) throw err;
        console.log(results);
    });

}

function getScoreInfo(messenger_id, callbackFunction){
    var sql = "SELECT * FROM users_details WHERE id = "+messenger_id;
    var score;
    var level;
    console.log(sql);
    let scoreInfo = new Object();
    con.query(sql, function (err, results) {
        console.log("1st query execution..");
        if (err) throw err;
        console.log(results);
        results.forEach(function (row, index, _arr) {
            score = row.score;
            level = row.level;
        });
        scoreToReachNextLevel = (base*(level+1)*(level+2))/2;
        scoreRequired = scoreToReachNextLevel - score;
        nextLevel = level + 1;
        scoreInfo.scoreRequired = scoreRequired;
        scoreInfo.nextLevel = nextLevel;
        scoreInfo.level = level;
        console.log(scoreInfo);
        callbackFunction();
    });
    return scoreInfo;
}





// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);