frappe.ModuleEditor =  class {
	constructor(wrapper, frm, disable) {
		this.frm = frm;
		this.wrapper = wrapper;
		this.disable = disable;
		let user_modules = this.frm.doc.allowed_modules?this.frm.doc.allowed_modules.map(a => a.module):[];
		this.multicheck = frappe.ui.form.make_control({
			parent: wrapper,
			df: {
				fieldname: "allowed_modules",
				fieldtype: "MultiCheck",
				select_all: true,
				columns: 3,
				get_data: () => {
					return frappe.xcall('frappe.core.doctype.user.user.get_all_modules').then(modules => {
						return modules.map(module => {
							return {
								label: __(module),
								value: module,
								checked: user_modules.includes(module)
							};
						});
					});
				},
				on_change: () => {
					this.set_modules_in_table();
					this.frm.dirty();
				}
			},
			render_input: true
		});

		let original_func = this.multicheck.make_checkboxes;
		this.multicheck.make_checkboxes = () => {
			original_func.call(this.multicheck);
			
		};
	}
	set_enable_disable() {
		$(this.wrapper).find('input[type="checkbox"]').attr('disabled', this.disable ? true : false);
	}
	show() {
		let user_modules = this.frm.doc.allowed_modules.map(a => a.module);
		this.multicheck.selected_options = user_modules;
		this.multicheck.refresh_input();
		this.set_enable_disable();
	}
	set_modules_in_table() {
		let modules = this.frm.doc.allowed_modules || [];
		let checked_options = this.multicheck.get_checked_options();
		modules.map(module_doc => {
			if (!checked_options.includes(module_doc.module)) {
				frappe.model.clear_doc(module_doc.doctype, module_doc.name);
			}
		});
		checked_options.map(module => {
			if (!modules.find(d => d.module === module)) {
				let module_doc = frappe.model.add_child(this.frm.doc, "Block Module", "allowed_modules");
				module_doc.module = module;
			}
		});
	}
	get_modules() {
		return {
			checked_modules: this.multicheck.get_checked_options(),
			unchecked_modules: this.multicheck.get_unchecked_options()
		};
	}
};