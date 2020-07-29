var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dataFile = require('./data');
const mysql = require("mysql");
const querystring = require('querystring');
const axios = require('axios');
var port = process.env.PORT || 8080;
var con = mysql.createConnection({host: "db4free.net", user: "sakilppo", password: "sreejit@123", database: "morganwil"});
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// points declaration
var base = 100;
var journalizingPoints = 5;
var meditatingPoints = 10;
var learningPoints = 5;

//global response object
let formated_data = new Object();

var reminderStatus;
var reminderMessage = new Array();

var randomIndex;

var total_user_visits;

app.post('/0.2/webhook', function (req, res) {
    var data=req.body;console.log(data);
    var messenger_id = data['messenger user id'];
    var action = data.action;
    storeUserDetails(messenger_id,data['first name'],data['last name'],data['ref'],res, function(){
        CreateUserAnalysis(messenger_id, function(){
            getReminderMessages(function(){
                formated_data = {};
                formated_data.success = "True";
                if(action == "storeUserEmail")
                {
                    getReminderStatus(messenger_id, function(){
                        var sql = "UPDATE users_details SET email_id = "+ con.escape(data.userEmail)+" WHERE id="+messenger_id;
                        console.log(sql);
                        con.query(sql, function (err, results) {
                            console.log("Store email query execution..");
                            if (err) throw err;
                            console.log(results);
                            formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                            console.log(formated_data);
                            sendResponse(res);
                        });
                    });
                }
                else if(action == "ending")
                {
                    getReminderStatus(messenger_id, function(){
                        formated_data.messages = [];
                        var sql = "SELECT email_id FROM users_details WHERE id = "+messenger_id;
                        console.log(sql);
                        con.query(sql, function (err, results) {
                            console.log("Email validation query execution..");
                            if (err) throw err;
                            console.log(results);
                            if (typeof results != "undefined" && results != null && results.length != null && results.length > 0) {
                                results.forEach(function (row, index, _arr) {
                                    if(typeof row.email_id == "undefined" || row.email_id == null || row.email_id.length == 0 || row.email_id.length == null)
                                    {
                                        formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                                        formated_data.redirect_to_blocks = [];
                                        formated_data.redirect_to_blocks.push("getEmail");
                                        console.log(formated_data);
                                        sendResponse(res);
                                    }
                                    else {
                                        randomFunction(dataFile.data.endingText.length,function(){
                                            var text = dataFile.data.endingText[randomIndex];
                                            formated_data.messages.push({"text":  text,"quick_replies": [{"title":"Start Over","block_names": ["InterestCheck"]}],"quick_reply_options": {"process_text_by_ai": true}});
                                            formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                                            console.log(formated_data);
                                            sendResponse(res);
                                        });  
                                    }
                                });
                            }
                        });              
                    });
                }
                else if(action == "checkReminderRejection")
                {
                    getReminderStatus(messenger_id, function(){
                        var sql = "SELECT reminder_rejection FROM users_details WHERE id = "+messenger_id;
                        var reminder_rejection;
                        console.log(sql);
                        con.query(sql, function (err, results) {
                            console.log("Select reminder rejection query execution..");
                            if (err) throw err;
                            console.log(results);
                            results.forEach(function (row, index, _arr) {
                                reminder_rejection = row.reminder_rejection;
                                reminder_rejection = reminder_rejection + 1;
                                if(reminder_rejection >= 3 ){
                                    changeUserStatus(messenger_id, data, function(){
                                        formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                                        console.log(formated_data);
                                        sendResponse(res);
                                    });
                                } 
                                else{
                                    var sql = "UPDATE users_details SET reminder_rejection = "+ con.escape(reminder_rejection)+" WHERE id="+messenger_id;
                                    console.log(sql);
                                    con.query(sql, function (err, results) {
                                        console.log("Updating reminder rejection count query execution..");
                                        if (err) throw err;
                                        console.log(results);
                                        formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                                        console.log(formated_data);
                                        sendResponse(res);
                                    }); 
                                }    
                            });
                        });
                    });
                }
                else if(action == "askReminderRejection"){
                    getReminderStatus(messenger_id, function(){
                        formated_data.messages = [];
                        var text = "What do you want me to do ?";
                        var buttons = [{"type": "show_block","block_names": ["ReminderTomorrow"],"title": "Check in with me tomorrow"},{"type": "show_block","block_names": ["ReminderFewDays"],"title": "Check in with me in a few days"},{"type": "show_block","block_names": ["ChangeUserStatus"],"title": "Unsubscribe me"}];
                        formated_data.messages.push({"attachment": {"type": "template","payload": {"template_type": "button","text": text,"buttons": buttons,}}});
                        formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                        console.log(formated_data);
                        sendResponse(res); 
                    });
                }
                else if(action == "getCauseDetail")
                {
                    getReminderStatus(messenger_id, function(){
                        formated_data.messages = [];
                        if(data.primaryEmotion == "Poor (1-3)")
                        {
                            var block_name = "Poor_1";
                        }
                        else{
                            var block_name = "Great_1";
                        }
                        var text = "What about "+ data.topicCause +" caused you to feel this way? (i.e events or behaviors) ";
                        formated_data.messages.push({"text":  text,"quick_replies": [{"title":"Go back","block_names": [block_name]}],"quick_reply_options": {"process_text_by_ai": false,"text_attribute_name": "causeDetail"}});
                        formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                        console.log(formated_data);
                        sendResponse(res);
                    });
                }
                else if(action == "saveDailyJournal")
                {
                    getReminderStatus(messenger_id, function(){
                        created = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        sql = "INSERT INTO `daily_journal`(`user_id`, `primary_emotion`, `detailed_emotion`, `topic_cause`, `story`, `dayRate`, `timestamp`) VALUES ("+ messenger_id +","+ con.escape(data.primaryEmotion) +","+ con.escape(data.detailedEmotion) +","+ con.escape(data.topicCause) +","+ con.escape(data.causeDetail) +","+ con.escape(data.dayRate) +",'"+ created +"')";
                        console.log(sql);
                        con.query(sql, function (err, results) {
                            console.log("Save daily Journal query execution..");
                            if (err) throw err;
                            console.log(results);
                            UpdateUserAnalysis(messenger_id, "daily_journal_visits");
                                scoreAndLevel(messenger_id, journalizingPoints, function(){
                                    getTotalVisits(messenger_id, function(){
                                        formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                                        formated_data.redirect_to_blocks = [];
                                        if(total_user_visits % 3 == 0 && total_user_visits != 0)
                                            formated_data.redirect_to_blocks.push("AskForFeedback");
                                        else
                                            formated_data.redirect_to_blocks.push("Ending");
                                        console.log(formated_data);
                                        sendResponse(res); 
                                    });                
                                });
                                sendAlertToFrnd(messenger_id,data['first name']);
                            
                        });
                    });
                }
                else if(action == "saveDreamJournal")
                {
                    getReminderStatus(messenger_id, function(){
                        let scoreInfo = new Object();
                        created = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        sql = "INSERT INTO `dream_journal`(`user_id`, `dream_type`, `dream_story`, `dream_rate`, `timestamp`) VALUES ("+ messenger_id +","+ con.escape(data.dreamType) +","+ con.escape(data.dreamStory) +","+ con.escape(data.dreamRate) +",'"+ created +"')";
                        console.log(sql);
                        con.query(sql, function (err, results) {
                            console.log("Save dream journal execution..");
                            if (err) throw err;
                            console.log(results);
                            UpdateUserAnalysis(messenger_id, "dream_journal_visits");
                                scoreAndLevel(messenger_id, journalizingPoints, function(){
                                    getTotalVisits(messenger_id, function(){
                                        scoreInfo = getScoreInfo(messenger_id, function(){
                                            console.log(scoreInfo);
                                            formated_data.messages = [];
                                            var text = "You just earned "+ journalizingPoints +"XP points. You are "+ scoreInfo.scoreRequired +" XP points away from level "+ scoreInfo.nextLevel;
                                            formated_data.messages.push({"text":  text});
                                            formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                                            formated_data.redirect_to_blocks = [];
                                            if(total_user_visits % 3 == 0 && total_user_visits != 0)
                                                formated_data.redirect_to_blocks.push("AskForFeedback");
                                            else
                                                formated_data.redirect_to_blocks.push("Ending");
                                            console.log(formated_data);
                                            sendResponse(res);
                                        });
                                    });    
                                });
                            
                        });
                    });
                }
                else if(action == "saveGratitudeJournal")
                {
                    getReminderStatus(messenger_id, function(){
                        let scoreInfo = new Object();
                        created = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        sql = "INSERT INTO `gratitude_journal`(`user_id`, `gratitude_story`, `gratitude_rate`, `timestamp`) VALUES ("+ messenger_id +","+ con.escape(data.gratitudeStory) +","+ con.escape(data.gratitudeRate) +",'"+ created +"')";
                        console.log(sql);
                        con.query(sql, function (err, results) {
                            console.log("Save gratitude journal execution..");
                            if (err) throw err;
                            console.log(results);
                            UpdateUserAnalysis(messenger_id, "gratitude_journal_visits");
                                scoreAndLevel(messenger_id, journalizingPoints, function(){
                                    getTotalVisits(messenger_id, function(){
                                        scoreInfo = getScoreInfo(messenger_id, function(){
                                            console.log(scoreInfo);
                                            formated_data.messages = [];
                                            var text = "You just earned "+ journalizingPoints +" XP points. You are "+ scoreInfo.scoreRequired +" XP points away from level "+ scoreInfo.nextLevel;
                                            formated_data.messages.push({"text":  text});
                                            formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5], "pointsEarned" : journalizingPoints, "scoreRequired" : scoreInfo.scoreRequired, "nextLevel" : scoreInfo.nextLevel};
                                            formated_data.redirect_to_blocks = [];
                                            if(total_user_visits % 3 == 0 && total_user_visits != 0)
                                                formated_data.redirect_to_blocks.push("AskForFeedback");
                                            else
                                                formated_data.redirect_to_blocks.push("Ending");
                                            console.log(formated_data);
                                            sendResponse(res);
                                        }); 
                                    });          
                                });
                            
                        });
                    });
                }
                else if(action == "askForFeedback")
                {
                    getReminderStatus(messenger_id, function(){
                        formated_data.messages = [];
                        randomFunction(dataFile.data.askForFeedbackText.length,function(){
                            var text = dataFile.data.askForFeedbackText[randomIndex];
                            var buttons = [{"type": "show_block","block_names": ["GetFeedbackThumbs"],"title": "Yes"},{"type": "show_block","block_names": ["Ending"],"title": "No"}];
                            formated_data.messages.push({"attachment": {"type": "template","payload": {"template_type": "button","text": text,"buttons": buttons,}}});
                            formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                            console.log(formated_data);
                            sendResponse(res);
                        });
                    });
                }
                else if(action == "saveFeedback")
                {
                    getReminderStatus(messenger_id, function(){
                        sql = "INSERT INTO `user_feedbacks`(`user_id`, `feedback`, `thumbs`) VALUES ("+ messenger_id +","+ con.escape(data.feedBack) +","+ con.escape(data.feedbackThumbs) +")";
                        console.log(sql);
                        con.query(sql, function (err, results) {
                            console.log("Save feedback query execution..");
                            if (err) throw err;
                            console.log(results);
                            formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                            console.log(formated_data);
                            sendResponse(res);      
                        });
                    });
                }
                else if(action == "getDailyJournal")
                {
                    getReminderStatus(messenger_id, function(){
                        var sql = "SELECT * FROM `daily_journal` WHERE user_id="+messenger_id+" LIMIT 5";
                        console.log(sql);
                        formated_data.messages = [];
                        formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                        con.query(sql, function (err, results) {
                            console.log("Get daily journal history query execution..");
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
                            sendResponse(res);
                        });
                    });
                }
                else if(action == "getDreamJournal")
                {
                    getReminderStatus(messenger_id, function(){
                        var sql = "SELECT * FROM `dream_journal` WHERE user_id="+messenger_id+" LIMIT 5";
                        console.log(sql);
                        formated_data.messages = [];
                        formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                        con.query(sql, function (err, results) {
                            console.log("Get dream journal history query execution..");
                            if (err) throw err;
                            console.log(results);
                            if (typeof results != "undefined" && results != null && results.length != null && results.length > 0) {
                                results.forEach(function (row, index, _arr) {
                                    var text = "Dream Type: "+row.dream_type+"\n\nDream Story: "+row.dream_story+"\n\nDream Rate: "+row.dream_rate+"\n\nTime Logged: "+row.timestamp;
                                    formated_data.messages.push({"text":text});
                                });
                            }
                            else {
                                formated_data.messages.push({"text":"You have no story yet!"});
                            }
                            console.log(formated_data);
                            sendResponse(res);
                        });
                    });
                }
                else if(action == "getGratitudeJournal")
                {
                    getReminderStatus(messenger_id, function(){
                        var sql = "SELECT * FROM `gratitude_journal` WHERE user_id="+messenger_id+" LIMIT 5";
                        console.log(sql);
                        formated_data.messages = [];
                        formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                        con.query(sql, function (err, results) {
                            console.log("Get gratitude journal history query execution..");
                            if (err) throw err;
                            console.log(results);
                            if (typeof results != "undefined" && results != null && results.length != null && results.length > 0) {
                                results.forEach(function (row, index, _arr) {
                                    var text = "Gratitude Story: "+row.gratitude_story+"\n\nGratitude Rate: "+row.gratitude_rate+"\n\nTime Logged: "+row.timestamp;
                                    formated_data.messages.push({"text":text});
                                });
                            }
                            else {
                                formated_data.messages.push({"text":"You have no story yet!"});
                            }
                            console.log(formated_data);
                            sendResponse(res);
                        });
                    });
                }
                else if(action == "getUserDetails")
                {
                    getReminderStatus(messenger_id, function(){
                        var sql = "SELECT * FROM users_details WHERE id="+messenger_id;
                        var reminder;
                        var status;
                        var toDoMessage;
                        console.log(sql);
                        formated_data.messages = [];
                        con.query(sql, function (err, results) {
                            console.log("Get user details query execution..");
                            if (err) throw err;
                            console.log(results);
                            if (typeof results != "undefined" && results != null && results.length != null && results.length > 0) {
                                results.forEach(function (row, index, _arr) {
                                    status = row.reminder_status;
                                    if(status == 1)
                                    {
                                        reminder = "on",
                                        toDoMessage = "stop"
                                    }
                                    else if(status == 0){
                                        reminder = "off",
                                        toDoMessage = "get"
                                    }
                                    var text = "Name: "+row.first_name+" "+row.last_name+"\nScore: "+row.score+"\nLevel: "+row.level+"\nReminders: "+reminder;
                                    formated_data.messages.push({"text":text});
                                    formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5], "reminders" : status, "toDoMessage": toDoMessage};
                                });
                            }
                            else {
                                formated_data.messages.push({"text":"Data does not exist."});
                                formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                            }
                            console.log(formated_data);
                            sendResponse(res);
                        });
                    });
                }
                else if(action == "getScoreAndLevel")
                {
                    getReminderStatus(messenger_id, function(){
                        let scoreInfo = new Object();
                        formated_data.messages = [];
                        scoreInfo = getScoreInfo(messenger_id, function(){
                            console.log(scoreInfo);
                            var text = "You're level " + scoreInfo.level + " and are " + scoreInfo.scoreRequired + "XP from level " + scoreInfo.nextLevel + "! Keep it up! What are you interested in doing today? Say 'Menu' at any time to come back here.";
                            var buttons = [{"type": "show_block","block_names": ["JournalOptions"],"title": "Journaling (5 XP)"},{"type": "show_block","block_names": ["GuidedMedLink"],"title": "Meditating (10 XP)"},{"type": "show_block","block_names": ["TimeToBed"],"title": "Sleep Coach (5 XP)"}];
                            formated_data.messages.push({"attachment": {"type": "template","payload": {"template_type": "button","text": text,"buttons": buttons}}});
                            formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                            console.log(formated_data);
                            sendResponse(res);
                        }); 
                    });
                }
                else if(action == "changeUserStatus")
                {
                    changeUserStatus(messenger_id, data, function(){
                        sendResponse(res);
                    });
                }
                else if(action == "storeUserDetails" && data.ref != undefined && data.ref != ''){}
                else if(action == "MsgToFriend"){
                    sendResponse(res);
                    MsgToFriend(messenger_id, data['first name'], data.msgForFrnd);
                }
                else{
                    // getReminderStatus(messenger_id, function(){
                    //     formated_data.set_attributes = {"broadcastFlag" : "on", "reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                    //     sendResponse(res);
                    // })
                    sendPayload(res, action, messenger_id);
                }
            });
        });
    }); 
});

function sendResponse(res){
    console.log(formated_data);
    res.send(JSON.stringify(formated_data));
}

function getReminderStatus(messenger_id, callbackFunction){
    var sql = "SELECT reminder_status FROM users_details WHERE id = "+messenger_id;
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("Select reminder status query execution..");
        if (err) throw err;
        console.log(results);
        results.forEach(function (row, index, _arr) {
            reminderStatus = row.reminder_status;
        });
        callbackFunction();
    });
}

function getReminderMessages(callbackFunction){
    randomFunction(dataFile.data.reminderMessagesText.length,function(){
        reminderMessage[0] = dataFile.data.reminderMessagesText[randomIndex];
        var i=1;
        var myRandomIndex = randomIndex;
        while(i<6){
            myRandomIndex ++;
            if(myRandomIndex == dataFile.data.reminderMessagesText.length)
                myRandomIndex = 0;
            reminderMessage[i] = dataFile.data.reminderMessagesText[myRandomIndex];
            i++;
        }
        console.log(reminderMessage);
        callbackFunction();
    });
}


function changeUserStatus(messenger_id, data, callbackFunction){
    getReminderStatus(messenger_id, function(){
        var newStatus;
        var reminder_rejection;
        var reminder;
        if(reminderStatus == 1)
        {
            newStatus = 0;
            reminder_rejection = null;
            reminder = "off";
        }
        else if(reminderStatus == 0){
            newStatus = 1;
            reminder_rejection = 0;
            reminder = "on";
        }
        var sql2 = "UPDATE users_details SET reminder_status = "+ con.escape(newStatus)+", reminder_rejection = "+con.escape(reminder_rejection)+" WHERE id="+messenger_id;
        console.log(sql2);
        con.query(sql2, function (err, results) {
            console.log("Update reminder status query execution..");
            if (err) throw err;
                console.log(results);
            formated_data.set_attributes = {"reminderStatus" : newStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5], "reminder" : reminder};
            console.log(formated_data);
            callbackFunction();
        });  
    });
}

function scoreAndLevel(messenger_id, points, callbackFunction){
    var sql = "SELECT * FROM users_details WHERE id = "+messenger_id;
    var score;
    var level;
    var sql2;
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("Get score and level query execution..");
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
        console.log("Update score and level query execution..");
        if (err) throw err;
            console.log(results);
        callbackFunction();
        });
    });
    return;
}

function storeUserDetails(messenger_id,first_name,last_name,ref,res, callbackFunction){
    ref = querystring.parse(ref);console.log(ref.referrer);
    if(ref.referrer != undefined && ref.referrer != '')
        var sql = "INSERT IGNORE INTO users_details (`id`, `first_name`, `last_name`, `referrer`) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE first_name = VALUES(first_name), last_name = VALUES(last_name), referrer = VALUES(referrer)";
    else
        var sql = "INSERT IGNORE INTO users_details (`id`, `first_name`, `last_name`) VALUES (?,?,?) ON DUPLICATE KEY UPDATE first_name = VALUES(first_name), last_name = VALUES(last_name)";
    console.log(sql);
    con.query(sql, [messenger_id,first_name,last_name,ref.referrer], function (err, results) {
        console.log("Store id query execution..");
        if (err) throw err;
        console.log(results);    
        if(ref.referrer != undefined && ref.referrer != '') {
            CreateUserAnalysis(messenger_id, function(){
                getReminderMessages(function(){
                    getReminderStatus(messenger_id, function(){
                    formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
                    formated_data.messages = [];
                    let text = "Congrats you are now accountability partner of "+ref.name;
                    formated_data.messages.push({"text":text});console.log(formated_data);
                    res.send(JSON.stringify(formated_data));
                    });
                });
            });
        }
        else
            callbackFunction();
    });
}

function getScoreInfo(messenger_id, callbackFunction){
    var sql = "SELECT * FROM users_details WHERE id = "+messenger_id;
    var score;
    var level;
    console.log(sql);
    let scoreInfo = new Object();
    con.query(sql, function (err, results) {
        console.log("Get score and level query execution..");
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

function randomFunction(arraySize, callbackFunction){
    var min=0; 
    var max=arraySize;  
    var random =Math.floor(Math.random() * (+max - +min)) + +min;
    randomIndex = random; 
    callbackFunction();
}

function sendAlertToFrnd(messenger_id, name) {
    today = new Date().toISOString().substring(0, 10);
    var sql = "SELECT 1 FROM `daily_journal` WHERE `user_id` = ? AND `timestamp` LIKE '"+today+"%'";
    con.query(sql, [messenger_id], function (err, results) {
        console.log("Fetching today's journal count");
        if (err) throw err;
        console.log(results);
        if (results.length >= 3) {
            sql = "SELECT id FROM users_details WHERE referrer = ?";
            con.query(sql, [messenger_id], function (err, results) {
                console.log("Fetching accountability partners...");
                if (err) throw err;
                console.log(results);
                results.forEach(function (row, index, _arr) {
                    console.log(row.id);
                    axios.post('https://api.chatfuel.com/bots/58c32dc0e4b017a29c6bd4f9/users/'+row.id+'/send?chatfuel_token=vnbqX6cpvXUXFcOKr5RHJ7psSpHDRzO1hXBY8dkvn50ZkZyWML3YdtoCnKH7FSjC&chatfuel_message_tag=NON_PROMOTIONAL_SUBSCRIPTION&chatfuel_block_name=FriendAlert&partnerName='+name,'',{headers:{'Content-Type': 'application/json'}})
                    .then(response => {
                        console.log("Chatfuel API respone: ");
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                });
            })
        }
    })
}

function MsgToFriend(messenger_id, name, msg) {
    if (msg != '' && msg != null){
        sql = "SELECT referrer FROM users_details WHERE id = ?";
        con.query(sql, [messenger_id], function (err, results) {
            console.log("Fetching accountability partners...");
            if (err) throw err;
            console.log(results);
            results.forEach(function (row, index, _arr) {
                console.log(row.referrer);
                axios.post('https://api.chatfuel.com/bots/58c32dc0e4b017a29c6bd4f9/users/'+row.referrer+'/send?chatfuel_token=vnbqX6cpvXUXFcOKr5RHJ7psSpHDRzO1hXBY8dkvn50ZkZyWML3YdtoCnKH7FSjC&chatfuel_message_tag=NON_PROMOTIONAL_SUBSCRIPTION&chatfuel_block_name=FriendMsg&partnerName='+name+'&msgBody='+querystring.escape(msg),'',{headers:{'Content-Type': 'application/json'}})
                .then(response => {
                    console.log("Chatfuel API respone: ");
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
            });
        })
    }
}

function CreateUserAnalysis(messenger_id, callbackFunction){
    var sql = "INSERT IGNORE INTO user_analysis SET user_id = "+messenger_id;   
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("Create user analysis query execution..");
        if (err) throw err;
        console.log(results);
        callbackFunction();
    }); 
}

function UpdateUserAnalysis(messenger_id, typeOfVisit){
    var sql = "UPDATE user_analysis SET total_visits = total_visits+1, "+ typeOfVisit + "=" + typeOfVisit +"+1 "+" WHERE user_id="+messenger_id;
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("Update user analysis query execution..");
        if (err) throw err;
        console.log(results);
    }); 
}

function getTotalVisits(messenger_id, callbackFunction){
    var sql = "SELECT total_visits FROM user_analysis WHERE user_id = "+messenger_id;   
    console.log(sql);
    con.query(sql, function (err, results) {
        console.log("get users total visits query execution..");
        if (err) throw err;
        console.log(results);
        results.forEach(function (row, index, _arr) {
            total_user_visits = row.total_visits;
            callbackFunction();
        });
    }); 
}

function sendPayload(res, action, messenger_id) {console.log('Action: '+action);
    formated_data = {};
    formated_data.success = "True";
    formated_data.messages = [];
    var randomIndex = Math.floor(Math.random() * dataFile.data[action].text.length);
    var text = dataFile.data[action].text[randomIndex];
    var quick_replies = dataFile.data[action].quick_replies;
    var quick_reply_options = dataFile.data[action].quick_reply_options;
    getReminderStatus(messenger_id, function(){
        formated_data.messages.push({"text": text,"quick_replies": quick_replies,"quick_reply_options": quick_reply_options});
        formated_data.set_attributes = {"reminderStatus" : reminderStatus, "reminderMessage0" : reminderMessage[0], "reminderMessage1" : reminderMessage[1], "reminderMessage2" : reminderMessage[2], "reminderMessage3" : reminderMessage[3], "reminderMessage4" : reminderMessage[4], "reminderMessage5" : reminderMessage[5]};
        console.log(JSON.stringify(formated_data));
        sendResponse(res);
    });
}

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);