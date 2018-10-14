/**
 * By Amine Ben Khalifa 2017
 * Code based on the a sample by Amazon that demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 *
 */
var max_res =50;
var url = 'http://export.arxiv.org/api/query?search_query=all:"climate"&start=0&max_results='+max_res+'&sortBy=lastUpdatedDate';

var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        
       /* if (event.session.application.applicationId !== “xxxx”) {
             context.fail("Invalid Application ID");
        }*/
        
 

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session, 
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
var justReadAnAbstract;
var papers= [];
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
    justReadAnAbstract = false;
    papers= [];
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("GetRecentPapersIntent" === intentName) {
        GetRecentPapersInSession(intent, session, callback);
        
    } else if ("GetNextEventIntent" === intentName) {
        if (justReadAnAbstract) {
            justReadAnAbstract = false;
            GetNo(intent, session, callback);
        } else {
            GetNextPaper(intent, session, callback);
        }
    } else if ("GetNoIntent" === intentName) {
        if (justReadAnAbstract) {
            handleSessionEndRequest(callback);
        } else {
            GetNo(intent, session, callback);
        }
    } else if ("AMAZON.HelpIntent" === intentName) {
        getHelpResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
            handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome to climate paper explorer";
    var speechOutput = "Welcome to climate paper explorer. " +
        "Please tell me what can I help you with";
    var cardText = "You can say things like, read most recent climate papers from archive";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "You can say things like, read most recent climate papers from archive";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, cardText, speechOutput, repromptText, shouldEndSession));
}


function getHelpResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome to climate paper explorer";
var speechOutput ="You can ask me to read the most \
recent papers from archive. I will start by reading the title of the first paper and then ask you if you want to listen to the abstract, \
you can answer yes for  the abstract, or answer no to go to the next paper. \
You can ask me to stop anytime. Keep in mind, If you found out that the abstract I am reading is not interesting,\
you can always ask me to go to the next paper, by saying 'Alexa, next'. So, tell me What can I help you with?";

    var cardText = "You can say things like, read most recent climate papers from archive";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "You can say things like, read most recent climate papers from archive";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, cardText, speechOutput, repromptText, shouldEndSession));
}


function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Okay, Check back tomorrow for more papers!";
    var cardText = speechOutput;
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, cardText, speechOutput, null, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */

function GetRecentPapersInSession(intent, session, callback) {
    var cardTitle = "Paper Title";
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var cardText="";
    sessionAttributes.index = 0;
    sessionAttributes.data = "";
    var req = request(url);
var feedparser = new FeedParser({'addmeta':false});

req.on('error', function (error) {
  console.log(error);
    cardTitle= 'Error';
  cardText= 'Sorry, Something went wrong, try again later';
  speechOutput= 'Sorry, Something went wrong, try again later';
  shouldEndSession= true;
      callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, cardText, speechOutput, repromptText, shouldEndSession));
});

req.on('response', function (res) {
  var stream = this; // `this` is `req`, which is a stream

  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'));
  }
  else {
    stream.pipe(feedparser);
  }
});

feedparser.on('error', function (error) {
  console.log(error);
  cardTitle= 'Error';
  cardText= 'Sorry, Something went wrong, try again later';
  speechOutput= 'Sorry, Something went wrong, try again later';
  shouldEndSession= true;
      callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, cardText, speechOutput, repromptText, shouldEndSession));
});


// main action
var aws = require('aws-sdk');
var nodemailer = require('nodemailer');
var ses = new aws.SES();
var mailOptions = {
    from: "ntrtung17@apcs.vn",
    subject: 'Your climate paper feed',
    html: '',
    to: "nhtduy@apcs.vn"
}

var transporter = nodemailer.createTransport({
    SES: ses
});

feedparser.on('readable', function () {
  // This is where the action is!
  var stream = this; // `this` is `feedparser`, which is a stream
  //var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;



  while (item = stream.read()) {
    //console.log(item);
    link = item["link"];
    // mailOptions.text = mailOptions.text + link + "\n";
    title = item["title"].replace(/\r?\n|\r/g, " ");
    // mailOptions.text = mailOptions.text + title + "\n";
    mailOptions.html = mailOptions.html +  '<b><a href="'+link+'">'+title+'</a></b><br>'
    abstract = item["description"].replace(/\r?\n|\r/g, " ");
    // mailOptions.text = mailOptions.text + abstract + "\n\n";
    mailOptions.html = mailOptions.html + '<p>'+abstract+'</p>'; 
    papers.push({"title":title,"abstract":abstract,"link":link})
  }
});

feedparser.on('end', function(){
    // send email
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error sending email");
            callback(err);
        } else {
            console.log("Email sent successfully");
            callback();
        }
    }); 

    session.attributes = sessionAttributes;
    speechOutput = "OK, I have emailed you 50 most recent papers. The newst one is: "+papers[sessionAttributes.index]['title']+". Would you like me to read the abstracts?";
    repromptText = "You can say things like, yes, next title, or no to end the session. Would you like me to read the abstracts?";
    cardTitle = papers[sessionAttributes.index]['title'];
    cardText = papers[sessionAttributes.index]['abstract'];
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, cardText, speechOutput, repromptText, shouldEndSession));


});




}

function GetNextPaper(intent, session, callback) {
    var cardTitle = "";
    var repromptText = "";
    var sessionAttributes = session.attributes;
    var shouldEndSession = false;
    var speechOutput = "";
    var cardText="";
    
    
    speechOutput = papers[sessionAttributes.index]['abstract'] + ", Would you like me to continue to the next paper?" ;
        repromptText = "You can say things like, yes or no. Would you like to continue to the next paper?";
    justReadAnAbstract = true;
    cardText = ""; //papers[sessionAttributes.index]['abstract'];

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle,cardText, speechOutput, repromptText, shouldEndSession));
 
}

function GetNo(intent, session, callback) {
    var cardTitle = "Paper Title";
    var repromptText = "";
    var sessionAttributes = session.attributes;
    var shouldEndSession = false;
    var speechOutput = "";
    var cardText =""

    sessionAttributes.index++;
    if (sessionAttributes.index < papers.length){
        speechOutput = papers[sessionAttributes.index]['title'] + ", Would you like me to read the abstract?";
        repromptText = "You can say things like, yes, next title, or no. Would you like me to read the abstract?";
        cardTitle = papers[sessionAttributes.index]['title'];
        cardText = papers[sessionAttributes.index]['abstract'];
    } else {
        speechOutput = "That was all, Check back tomorrow for more papers!";
        shouldEndSession = true;
    }


    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle,cardText, speechOutput, repromptText, shouldEndSession));
           
 
}




// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, cardText, output, repromptText, shouldEndSession) {
    if (title==""){
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
    } else {
          return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title:  title,
            content: cardText
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };  
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
