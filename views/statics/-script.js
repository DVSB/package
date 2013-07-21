
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
		$('.checkall').click(function(){
			
			var checkboxes = $('table').find(':checkbox');
			var isChecked = $('.checkall').prop('checked');
			
			checkboxes.prop('checked', function(){
				return isChecked;
			});
			
		});
		
		// checked rows in table is added to input(name=selected)
		// var selected = [];
		$(':checkbox').click(function(){ 
			
			var checked = $('table :checkbox:checked').closest('tr').find('td:nth-child(2)');
			
			$('input[name=selected]').val(checked.text());
		
			// TODO
			// toto treba prerobit
			// zaujmave nahodne spravanie
			// chceme vyfiltrovat z checked, ktore je 
			// ["9933b70a0140317b/11. Strapo - Daj peňáz (prod. Emeres).mp3", prevObject: jQuery.fn.jQuery.init[1], context:...
			// iba prvu polozku menu a vytvorit zoznam vsetkych zaskrtnutych itemov
			var pepek  = _.without(checked, 0, 1);
			
			for (var i=0; i<=pepek.length-1; i++){
				pepek[i] = pepek[i].innerText;
			}
			
			console.log(pepek);
			
		});
		
		
	});