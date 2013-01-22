
	// Security warning

	// This is not server-side Javascript, this files is loaded via standard browser
	// Do not put here ANY server-side information!

	$("document").ready(function() {

		$(".hideme").hide();
		
		// http://momentjs.com/docs/
		var today = moment().format("dddd, D. MMM YYYY");
		$("#today").text(today);




	});

	var showDueDays = function(date) {

	}

	var doo = function(todos) {
		for(var j = 0; j < todos.length; j++) {
			$("#todo" + j + "-duedate").hide();
		}
	}
