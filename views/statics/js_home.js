	// Activate TabContainer
	$('#myTab a').click(function(e) {
	    e.preventDefault();
	    $(this).tab('show');
	})
	
	$('#myTab li a:first').tab('show');
	// Select first tab