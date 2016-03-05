// ############################## Helper functions ##############################

// Shows slides. We're using jQuery here - the **$** is the jQuery selector function, which takes as input either a DOM element or a CSS selector string.
function showSlide(id) {
  // Hide all slides
	$(".slide").hide();
	// Show just the slide we want to show
	$("#"+id).show();
}

// Get random integers.
// When called with no arguments, it returns either 0 or 1. When called with one argument, *a*, it returns a number in {*0, 1, ..., a-1*}. When called with two arguments, *a* and *b*, returns a random value in {*a*, *a + 1*, ... , *b*}.
function random(a,b) {
	if (typeof b == "undefined") {
		a = a || 2;
		return Math.floor(Math.random()*a);
	} else {
		return Math.floor(Math.random()*(b-a+1)) + a;
	}
}

// Add a random selection function to all arrays (e.g., <code>[4,8,7].random()</code> could return 4, 8, or 7). This is useful for condition randomization.
Array.prototype.random = function() {
  return this[random(this.length)];
}

function shuffle (a)
{
    var o = [];

    for (var i=0; i < a.length; i++) {
	o[i] = a[i];
    }

    for (var j, x, i = o.length;
	 i;
	 j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// ############################## Configuration settings ##############################

var condition = 0;
var startTime = Date.now();
var endTime;

//####     Behavioral Intentions List ######

var beh_ints = ['Take showers that are 5 minutes or less',
'Use public transportation or carpool',
'Unplug appliances and chargers (e.g. TV, cell phone, computer) at night',
'Buy green products instead of regular products (e.g., dishwashing detergent), even though they cost more',
'Attend rallies, public events or town hall meetings to voice my support for solving enviornmental problems',
'Write letters, email, phone or otherwise contact elected official to urge them to take action on environmental issues (e.g. habitat loss, air pollution)'
];
beh_ints = shuffle(beh_ints);

var totalTrialsBeh = beh_ints.length;

//####     Environmental Attitudes scale ######

var env_atts = ['I feel that it is important to maintain the environment for future generations.',
'I feel a responsibility to reduce my personal contribution to climate change.',
'The so-called "global warming crisis" facing humanity has been greatly exaggerated',
'I am in favor of national policies and regulations that decrease fossil fuel burning, even if they increase energy and electricity costs today.'
];
env_atts = shuffle(env_atts);

var totalTrialsEnvAtts = env_atts.length;

//Legacy Motives scale

var leg_mot = ['I care what future generations think of me',
'I have important skills I can pass along to others',
'I am well liked by my friends',
'Others would say I have made unique contributions to my community or society',
'It is important to me to leave a positive legacy',
'I feel a sense of responsibility to future generations',
'I feel a connection to future generations',
'I feel it is important for me to leave a positive mark on society'];
leg_mot = shuffle(leg_mot);
var totalTrialsLegMot = leg_mot.length;

// Build trials array
var numTrialsExperiment = totalTrialsEnvAtts + totalTrialsBeh + totalTrialsLegMot + 5
var trials = [];

///instructions_2
trials.push(trial = {sentence: "",
	trial_number_block: 0,
	trial_type: "instructions_2"});

//manipulation block
if (condition == "1"){
	trials.push(trial = {sentence: "",
	trial_number_block: 0,
	trial_type: "manipulation_block"});
}

//behavioral intentions instructions
trials.push(trial = {sentence: "",
	trial_number_block: 0,
	trial_type: "beh_int_ins"});

//behavioral intentions instructions 2
trials.push(trial = {sentence: "",
	trial_number_block: 0,
	trial_type: "beh_int_ins2"});

	trials.push(trial = {sentence: "",
		trial_number_block: 0,
		trial_type: "beh_int_ins3"});

// first build behavioral intentions question trials
for (i = 0; i < totalTrialsBeh; i++) {
	trial = {
		sentence: beh_ints[i],
		trial_number_block: i +1,
		trial_type: "beh_int_trial"
	}

	trials.push(trial);
}

trials.push(trial = {sentence: "",
	trial_number_block: 0,
	trial_type: "env_att_instructions"});

// add environmental attitudes question trials after
for (i = 0; i < totalTrialsEnvAtts; i++) {
	trial = {
		sentence: env_atts[i],
		trial_number_block: i +1,
		trial_type: "env_att"
	}

	trials.push(trial);
}

trials.push(trial = {sentence: "",
	trial_number_block: 0,
	trial_type: "legacy_motives"});

for (i = 0; i < totalTrialsLegMot; i++) {
		trial = {
			sentence: leg_mot[i],
			trial_number_block: i +1,
			trial_type: "legacy_motives2"
		}

		trials.push(trial);
	}

	trials.push(trial = {sentence: "",
		trial_number_block: 0,
		trial_type: "demographics_slide"});

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");



// ############################## The main event ##############################
var experiment = {

    // The object to be submitted.
data: {
  trial_number_block: [],
  trial_type: [],
	condition: [],
	sentence: [],
	rating: [],
	legacy_essay: [],
	children:[],
	environmentalist: [],
	sex: [],
	year: [],
	race: [],
	grandparent: [],
	totalHiddenTime: [],
	startTime: [],
	endTime: [],
	totalTime: [],
	purpose:[],
    },

    // end the experiment
    end: function() {
	showSlide("finished");
	setTimeout(function() {
	    turk.submit(experiment.data)
	}, 1500);
    },

    // LOG RESPONSE
    log_response: function() {

	var response_logged = false;


	//Array of radio buttons
	var radio = document.getElementsByName("judgment");

	// Loop through radio buttons
	for (i = 0; i < radio.length; i++) {
	    if (radio[i].checked) {
		experiment.data.rating.push(radio[i].value);
		response_logged = true;
	    }
	}


	if (response_logged) {
	   nextButton_Beh.blur();
	   nextButton_env_att.blur();
		 nextButton_leg.blur();

	    // uncheck radio buttons
	    for (i = 0; i < radio.length; i++) {
		radio[i].checked = false
	    }
	    experiment.next();
	} else {
	    $("#testMessage_beh").html('<font color="red">' +
				   'Please make a response!' +
				   '</font>');
	    $("#testMessage_env_att").html('<font color="red">' +
				   'Please make a response!' +
				   '</font>');
			$("#testMessage_leg").html('<font color="red">' +
		 				   'Please make a response!' +
		 				   '</font>');
	}
    },


    // The work horse of the sequence - what to do on every trial.
    next: function() {

	// Allow experiment to start if it's a turk worker OR if it's a test run
	if (window.self == window.top | turk.workerId.length > 0) {

	  $("#testMessage_beh").html(''); 	// clear the test message
		$("#testMessage_env_att").html('');
		$("#testMessage_leg").html('');
		$("#progress").attr("style","width:" +
			    String(100 * (1 - (trials.length-1)/numTrialsExperiment)) + "%")

 //style="width:progressTotal%"

	    // Get the current trial - <code>shift()</code> removes the first element
	    // select from our scales array and stop exp after we've exhausted all the domains
	    var trial_info = trials.shift();

	    //If the current trial is undefined, call the end function.

	    if (typeof trial_info == "undefined") {
			return experiment.debrief_slide();
	    }


	    // check which trial type you're in and display correct slide
	    if (trial_info.trial_type == "beh_int_trial") {
	    	$("#beh_int").html(trial_info.sentence);  //add sentence to html
	    	 showSlide("beh_int_slide");              //display slide
			} else if (trial_info.trial_type == "instructions_2") {
 				 showSlide("instructions_2");
		  } else if (trial_info.trial_type == "manipulation_block") {
				 showSlide("manipulation");
			} else if (trial_info.trial_type == "beh_int_ins") {
 				 showSlide("beh_int_ins");
			} else if (trial_info.trial_type == "beh_int_ins2") {
					showSlide("beh_int_ins2");
			} else if (trial_info.trial_type == "beh_int_ins3") {
						showSlide("beh_int_ins3");
	    } else if (trial_info.trial_type == "env_att_instructions") {
	    	showSlide("env_att_slide");
			} else if (trial_info.trial_type == "legacy_motives") {
				showSlide("legacy_motives_slide");
			} else if (trial_info.trial_type == "legacy_motives2") {
			$("#leg_mot").html(trial_info.sentence);
				showSlide("legacy_motives_slide2");
	    } else if (trial_info.trial_type == "env_att"){
			$("#env_att").html(trial_info.sentence);
	    	showSlide("env_att_slide2");
	    } else if (trial_info.trial_type == "demographics_slide"){
				slowSlide("demographics_slide")
			}


//note: for testing, comment this section out to see outputs
	    // log the sentence for each trial
		experiment.data.sentence.push(trial_info.sentence);
		experiment.data.trial_type.push(trial_info.trial_type)
		experiment.data.trial_number_block.push(trial_info.trial_number_block)
	}
    },


    //	go to demographics slide
    debrief_slide: function() {
	showSlide("debrief_slide");
    },


    // submitcomments function
    submit_comments: function() {
	endTime = Date.now();
	totalTime = endTime - startTime;
	experiment.data.legacy_essay.push(document.getElementById("legacy_essay").value);
	experiment.data.children.push($("input[name=children]:checked").val());
	experiment.data.race.push($("input[name=race]:checked").val());
	experiment.data.grandparent.push($("input[name=grandparent]:checked").val());
	experiment.data.environmentalist.push($("input[name=environmentalist]:checked").val());
	experiment.data.sex.push($("input[name=sex]:checked").val());
	experiment.data.year.push(document.getElementById("year").value);
	experiment.data.condition.push(condition);
	experiment.data.totalHiddenTime.push(totalHiddenTime);
	experiment.data.startTime.push(startTime);
	experiment.data.endTime.push(endTime);
	experiment.data.totalTime.push(totalTime);
	experiment.data.purpose.push(document.getElementById("purpose").value);
	experiment.end();
    }
}


var visible = "visible";
var switchTime = "noswitch";
var totalHiddenTime = 0;

// Automatically registers whether user has switched tabs...
(function() {
  document.hidden = hidden = "hidden";

  // Standards:
  if (hidden in document) {
    document.addEventListener("visibilitychange", onchange);
  } else if ((hidden = "mozHidden") in document) {
    document.addEventListener("mozvisibilitychange", onchange);
  } else if ((hidden = "webkitHidden") in document) {
    document.addEventListener("webkitvisibilitychange", onchange);
  } else if ((hidden = "msHidden") in document) {
    document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  } else if ('onfocusin' in document) {
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  } else {
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
  }
})();

function onchange (evt) {
  var v = 'visible', h = 'hidden',
  evtMap = {
    focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
  };
  evt = evt || window.event;
  if (evt.type in evtMap) {
    document.body.className = evtMap[evt.type];
  } else {
    document.body.className = evt.target.hidden ? "hidden" : "visible";
  }

  if(document.body.className === "hidden"){
		switchTime = Date.now();
	} else {
		totalHiddenTime += Date.now() - switchTime;
	}
};
