
	// Security warning

	// This is not server-side Javascript, this files is loaded via standard browser
	// Do not put here ANY server-side information!

	$(document).ready(function() {
		
		
		// if clicked on TR, is checkbox checked/unchecked
		$('tr').click(function(event) {
			if (event.target.type !== 'checkbox') {
				$(':checkbox', this).trigger('click');
			}
		});
		
		
		// on click on .checkall checked all checkboxes
		$('.checkall').click(function () {
			
			var checkboxes = $('table').find(':checkbox');
			var isChecked = $('.checkall').prop('checked');
			
			checkboxes.prop('checked', function(){
				return isChecked;
			});
			
		});
		
		
		
	});