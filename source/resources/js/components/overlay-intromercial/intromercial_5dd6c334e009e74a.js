/* jshint unused:false */

// Lifted from Modernizr
// Determines which transition end event to listen for (which is browser-based) by creating a fake element and checking for its transitions.
function whichTransitionEndEvent() {
	var t;
	var el = document.createElement("fakeelement");
	var transitions = {
		transition: "transitionend",
		OTransition: "oTransitionEnd",
		MozTransition: "transitionend",
		WebkitTransition: "webkitTransitionEnd"
	};

	for (t in transitions) {
		if (el.style[t] !== undefined) {
			return transitions[t];
		}
	}
}

const setWithExpiration = (key, value) => {
	const date = new Date();
	date.setTime(date.getTime() + 43200000);
	const item = {
		value,
		expiration: date.toGMTString(),
	};
	localStorage.setItem(key, JSON.stringify(item));
};

const getWithExpiration = (key) => {
	const item = JSON.parse(localStorage.getItem(key));
	if (!item) return null;
	if (new Date() > new Date(item.expiration)) {
		localStorage.removeItem(key);
		return null;
	}
	return item.value;
};

function readCookie(name) {
	var nameEq = name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === " ") {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEq) === 0) {
			return c.substring(nameEq.length, c.length);
		}
	}
	return null;
}

function dismissIntromercial() {
	var introElement = document.getElementById("intromercial-handle");
	var transitionEvent = whichTransitionEndEvent();
	var $body = document.getElementsByTagName("body")[0];
	var triggeredFunction = function() {
		introElement.removeEventListener(transitionEvent, triggeredFunction);
		introElement.style.display = "none";
		$body.style.overflow = "auto";
		$body.className = $body.className.replace(/ intromercial-off|intromercial-off/g,"");
	};
	introElement.addEventListener(transitionEvent, triggeredFunction);
	introElement.style.opacity = 0;
	$body.className = $body.className.replace("intromercial-on","intromercial-off");
	if (transitionEvent === undefined) {
		setTimeout(triggeredFunction, 100);
	}
}

function prepareIntromercial() {
	// console.log("Showing Intromercial");
	var $body = document.getElementsByTagName("body")[0];
	var intromercialHTML = "<section id=\"intromercial-handle\" class=\"hide intromercial-wrapper window-block\">" +
		"	<div class=\"intromercial-background window-block\" onClick=\"javascript:dismissIntromercial();\"></div>" +
		"	<div class=\"intromercial-container has-white-bg absolute\">" +
		"		<div class=\"intromercial-header\">" +
		"			<div class=\"ad-label font-size-10 font-gt-america text-center\">" +
		"				ADVERTISEMENT" +
		"			</div>" +
		"			<div class=\"close-icon absolute\" onClick=\"javascript:dismissIntromercial();\">" +
		"				<svg class=\"svg-ie\"><use  xlink:href=\"/resources/css/images/icons.svg#x\"></use></svg>" +
		"			</div>" +
		"		</div>" +
		"		<div class=\"intromercial-iframe\" style=\"overflow:hidden;\">" +
		"			<div id='div-gpt-ad-1443707360480-0'></div>" +
		"		</div>" +
		"	</div>" +
		"</section>";

	$body.insertAdjacentHTML("afterbegin", intromercialHTML);
	if (isAdobeSync()) {
		// request ad
		googletag.cmd.push(function() { googletag.display("div-gpt-ad-1443707360480-0"); });
	}
}

window.displayIntromercial = function () {
	const adSlotId = "div-gpt-ad-1443707360480-0";
	if (document.querySelector("#" + adSlotId + " iframe") != null && window.getComputedStyle(document.querySelector("#" + adSlotId)).display != "none") {
		var $intromercialWrapper = document.getElementById("intromercial-handle");
		if ($intromercialWrapper) {
			var $body = document.getElementsByTagName("body")[0];
			$body.style.overflow = "hidden";
			$body.className += " " + "intromercial-on";
			$intromercialWrapper.classList.remove("hide"); 
			setTimeout(dismissIntromercial, 30 * 1000);
			setWithExpiration("marketing_interruption","overlay");

		}
	}
}

function displayPopup() {
	prepareIntromercial();
}

function showIntormercial() {
	// this is true, then it will show intromercial
	var notAProtectedPage = (
		(document.location.href.indexOf("cm_mmc=email-_-rtb") === -1) &&
		(document.location.href.indexOf("cm_mmc=email-_-so") === -1) &&
		(document.location.href.indexOf("cm_mmc=cpc") === -1) &&
		(document.location.href.indexOf("hideIntromercial=true") === -1) &&
		(document.location.href.indexOf("voucher_code=") === -1)
	);

	// check for subscriber onboarding flow
	var isSubscriberOnboardingCookie = readCookie("_pc_pso") != null ? true : false;
	var isSubscriberOnboarding = document.location.pathname == "/" && isSubscriberOnboardingCookie;
	
	// is this meta tag present?
	// <meta name="intromercial" content="protected">
	// https://github.com/HBRGTech/hbr-resources/pull/555
	var meta = document.querySelector("meta[name='intromercial']");
	if ((!(meta && meta.content === "protected")) && notAProtectedPage && !isSubscriberOnboarding) {
		// console.log("No meta tag found");
		var checkcookie = getWithExpiration("marketing_interruption");
		// is cookie present?
		// console.log("Is the cookie present?: " + checkcookie);
		if (checkcookie===null) {
			displayPopup();
		}
	}
	console.info("intromercial has been generated");

	// Enables to measure the number of times the intromercial is displayed.
	_satellite.track("hbrIntromercialDisplay");
}

//generateIntromercial is the function called directly from primary-template.ftl
window.generateIntromercial = function() {
	window.googlefc = window.googlefc || {};
	window.googlefc.ccpa = window.googlefc.ccpa || {}
	window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

	// Queue the callback on the callbackQueue.
	googlefc.callbackQueue.push({
		"CONSENT_DATA_READY": function() {
			var callback = function(tcData, success) {

				var gdprApplies = tcData.gdprApplies;
				var eventStatus = tcData.eventStatus

				if(success === true && eventStatus === "tcloaded" && gdprApplies === true) {		
					
					// destructuring data
					var consents = tcData.purpose.consents;		
					// parsing the tcData
					var consentsArray = Object.values(consents);
					
					// removing duplicated
					var consentOuput = consentsArray.reduce(function(prev, cur) {
						if (prev.indexOf(cur) == -1) {
							prev.push(cur);
						}
						return prev;
					}, []);

					// remove the ourself to not get called more than once
					__tcfapi("removeEventListener", 2, function(success) {
						if(success) {
							console.info("Removing Listener");
						}
					}, tcData.listenerId);

					// validating consents
					// we're expecting to get all the reponses as true 
					// if we receive false or mixed response
					// by design we consider this as not consent
					if(consentOuput.length === 1 && consentOuput[0] === true) {
						showIntormercial();
					} else {
						console.error("intromercial has been blocked");
					}
				} 
				// in case we don't get the gdpr propertie
				if (tcData.hasOwnProperty("gdprApplies") && tcData.gdprApplies === void (0)) { 
					__tcfapi("addEventListener", 2, callback);
				} else {
					// for user outside of EU
					if (gdprApplies === false) showIntormercial();
				}
			}
			
			__tcfapi("addEventListener", 2, callback);
		}
	});
};
