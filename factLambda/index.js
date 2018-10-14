/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.20299574-7fb4-454d-ae3f-409772ca5fc5';

const SKILL_NAME = 'tips';
const GET_FACT_MESSAGE = "Tip: ";
const HELP_MESSAGE = 'Try ask things like how can I find climate stories to report.';
const HELP_REPROMPT = 'What can I help you with?';
const MORE_MESSAGE = 'Do you want to hear more?';
const PAUSE = '<break time="0.3s" />'
const STOP_MESSAGE = 'Hope it helped!';
const WHISPER = '<amazon:effect name="whispered" />'
const WELCOME_OUTPUT = 'Welcome to climate journalism tips. How can I help you?';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
const sevenTipsDetails = [
    'OK. One. Follow the money. Climate change is a story about hundreds of billions of dollars. You need to pay attention on. Where is that money for adaptation and mitigation? Who controls it? Who spends it? Who makes sure it does what it is meant to do? Who funds the NGOs and the politicians? Which companies stand to profit from action to address climate change? Who stands to lose? Another area for media attention is whether rich countries keep their promises to fund climate action in developing nations, and whether the money really is "new and additional" and not from existing aid budgets. There will also be big debates about how much climate finance should come from public funds and how much should come from the private sector (which would be unlikely to show interest in funding small-scale adaptation projects that are needed because they offer little chance of a return on any investment). Follow the money trail and you will find all the elements of a good story. There are some examples of reports from Fiji, and the Philippines that looked at delays in disbursements of Green Climate Fund (GCF) and policies on disbursements of GCF that will have positive contributions to tribal communities.',
    'Two. Wear climate change glasses and report from new angles. For every new policy, new invention, new anything, look through with your climate-change lenses and ask two questions; "How could X affect climate change?" and "How could climate change affect X?" You will find many new angles for your reporting. These angles include health, business, technology, food, culture, sport, tourism, religion, politics – in fact, almost everything else.',
    'Three. Localise the global. Every day scientists publish new research, policymakers make new announcements, environmental activists issue new demands and strange weather patterns occur. Even if these things happen far away, smart journalists can work out ways of relating these stories to their own local circumstances and audiences. Indonesia’s KBR (largest independent radio news agency) has a network of 600 local radio broadcast (commercial and community). Partnering with Green Radio 96.7 FM in Pekanbaru, KBR created a talk show program called “Mahogany” to discuss the environment and the role of humans can play in preserving nature. “Asia Calling” is another weekly program on current affairs that can be used effectively to communicate climate change to a wider audience.  Another example is the “Bumi Hijau TV” (bumihijau.tv) that produces and disseminates environmental programmes to more than 100 local television stations throughout Indonesia. Each year, they produce 150 documentaries on environment.',
    'Four. Follow the pack. Keep on top of the climate-change story by reading the work of other journalists who are covering it well (you will find some great international stories at IPS, Reuters AlertNet, The Guardian, The New York Times and the BBC but there are also many good reporters covering climate change for national media around the world). Use social media such as Facebook, Instagram154 or Twitter to find out what people are saying about climate change and to share your own stories. The Climate News Network offers stories that journalists can adapt for their own use.',
    'Five. Read journals. The most important and significant research appears in journals such as Nature Climate Change, Geophysical Research Letters, Nature, Science, PNAS, Climatic Change. You can keep track of new research by subscribing to the journal’s mailing list – through the free EurekAlert and AlphaGalileo press release services. Journal papers tend to be available only to paying subscribers but journalists can get copies by searching on Google Scholar (http://scholar.google.com) for a PDF file or by visiting the journal’s website for a given paper. The website will often display the email address of the lead author, who will usually be willing to send journalists a copy of the paper and answer questions. Another way to build up a good contact book of experts is to search the Internet for recent scientific papers on a particular topic (Google Scholar is a good tool as it reveals how many times a paper has been cited by later studies, indicating how important the research is).',
    'Six. Stay updated and keep track of information flows, international negotiations through networking or through editors and journalists’ forums such as The Conversations.',
    'Seven. Get connected. A journalist can never have too many sources. The good news with climate change is that this is something that affects everyone. Journalists can build large contact lists of sources from a broad variety of different sectors, both within and outside of their own countries. These include: policymakers, intergovernmental organisations, UN agencies, civil society organisations and research centres. Some of the best sources will not be from organisations but from the general public – such as farmers and fisherfolk, pastoralists and small business owners. Few people know more about the changing climate than those whose livelihoods it most closely affects. Journalists can join mailing lists such as Climate-L (http://www.iisd.ca/ email/subscribe.htm), through which thousands of climate specialists share their latest reports and information about events. For information on the UN climatechange negotiations journalists can subscribe to the Earth Negotiations Bulletin (http://www.iisd.ca/process/climate_atm.htm).',
    ];
const sevenTipsTitle = [
    'One. Follow the money. ',
    'Two. Wear climate change glasses and report from new angles. ',
    'Three. Localise the global. ',
    'Four. Follow the pack. ',
    'Five. Read journals. ',
    'Six. Stay updated and keep track of information flows. ',
    'Seven. Get connected. '
    ];

const localLanguageTips = 'Great question! According to the handbook of UNESCO, to overcome the language barrier in disseminating climate knowledge, journalists can translate and report climate change in local language using local knowledge, local terms and giving good examples. The following words and phrase types can typically can be localised rather than translated literally. First. Idioms, metaphors and cultural references – many phrases familiar to an English speaker will make no sense if translated literally into another language. These enable journalists to add local perspectives to stories that will feel more natural to audiences. Second. Names of places – many locations have different names or administrative jurisdictions depending on the languages. You can reference an atlas or an encyclopedia to ensure accuracy. And third. Names of organizations (and their acronyms) '
    
var cnt = 0;

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

var speechOutput = '';

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask',WELCOME_OUTPUT);
    },
    'SevenTipsIntent': function() {
      speechOutput = 'Great question! UNESCO has seven tips to help you find good climate stories. '
      this.response.speak(speechOutput);
      var tipList = sevenTipsTitle;
      for(var i  = 0; i < tipList.length; i++){
          speechOutput += tipList[i];
      }
      var more = "Do you want more details?";
      speechOutput += PAUSE + more;
      this.response.speak(speechOutput).listen(more);
      this.emit(':responseReady');
      
    },
    'GetDetailsIntent': function () {
        const factArr = sevenTipsDetails;
        cnt = 0;
        //const factIndex= Math.floor(Math.random() * factArr.length);
        if (cnt == factArr.length)
        {
            this.response.speak('That is all for the tips. Hope it helped!')
            this.emit(':responseReady');
        }
        const tip = factArr[cnt];
        cnt++;
        speechOutput = WHISPER + tip + PAUSE + MORE_MESSAGE;
        var more = MORE_MESSAGE;

        this.response.cardRenderer(SKILL_NAME, tip);
        this.response.speak(speechOutput).listen(more);
        this.emit(':responseReady');
    },
    'LocalLanguageIntent': function() {
        speechOutput = localLanguageTips + PAUSE + STOP_MESSAGE;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    // 'AMAZON.YesIntent': function () {
    //     this.emit('GetNewFactIntent');
    // },
    // 'AMAZON.NoIntent': function (){
    //     this.response.speak(STOP_MESSAGE);
    //     this.emit(':responseReady');
    // },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
