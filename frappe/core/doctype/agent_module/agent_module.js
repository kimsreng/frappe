// Copyright (c) 2021, Kimsreng and contributors
// For license information, please see license.txt

frappe.ui.form.on('Agent Module', {
	refresh: function(frm) {
		frappe.xcall('frappe.core.doctype.module_def.module_def.get_installed_apps').then(r => {
			frm.set_df_property('app_name', 'options', JSON.parse(r));
		});
	}
});
