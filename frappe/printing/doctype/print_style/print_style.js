// Copyright (c) 2017, Frappe Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Print Style', {
	refresh: function(frm) {
		frm.add_custom_button(__('Print Settings'), () => {
			if (frappe.boot.agent){
				frappe.set_route('Form', 'Agent Print Settings', frappe.boot.agent);
			}else{
				frappe.set_route('Form', 'Print Settings');
			}
			
		})
	}
});
