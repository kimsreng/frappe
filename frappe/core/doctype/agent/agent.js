// Copyright (c) 2021, Kimsreng and contributors
// For license information, please see license.txt
frappe.provide("agent.registration");

frappe.ui.form.on('Agent', {
	onload: function (frm) {
		if (frm.is_new()) {
			if (!agent.registration.password.indicator) {
				var wrapper = frm.fields_dict.password_strength.wrapper;
				$('<span style="float:none" class="password-strength-indicator indicator"></span>').appendTo(wrapper);
				agent.registration.password.indicator = $(wrapper).find('.password-strength-indicator');
			}


		} else {
			frm.set_df_property("generate_password", "hidden", 1);
			frm.set_df_property("password_strength", "hidden", 1);
		}
	},
	generate_password: function (frm) {
		frappe.call("agent.agent.generate_password").then(r => {
			frm.doc.user_password = r.message;
			frm.fields_dict.user_password.refresh();
			frm.trigger("user_password");
		});
	},
	refresh: function () {
		agent.registration.password.refresh();
	},
	user_password: function (frm) {
		if (frm.doc.user_password) {
			agent.registration.password.get_password_strength(frm.doc.user_password);
		}
	},
	agent_name: function (frm) {
		if (frm.doc.__islocal) {
			let parts = frm.doc.agent_name.split(" ");
			let abbr = $.map(parts, function (p) {
				return p ? p.substr(0, 1) : null;
			}).join("");
			frm.set_value("abbr", abbr);
			frappe.call({
				method: "agent.agent.check_agent_exist",
				args:{
					agent: frm.doc.agent_name
				}
			});
		}
	},
	abbr: function(frm){
		frappe.call({
			method: "agent.agent.check_abbr_exist",
			args:{
				abbr: frm.doc.abbr
			}
		});
	}
});

agent.registration.password = {
	refresh: function () {
		this.indicator.html("").addClass("hidden");
	},
	get_password_strength: function (value) {
		var me = this;
		frappe.call({
			type: 'POST',
			method: 'frappe.core.doctype.user.user.test_password_strength',
			args: {
				new_password: value || ''
			},
			callback: function (r) {
				if (r.message) {
					var score = r.message.score,
						feedback = r.message.feedback;

					feedback.crack_time_display = r.message.crack_time_display;

					var indicators = ['red', 'grey', 'orange', 'yellow', 'green'];
					var warning = feedback.warning || (feedback.suggestions.length && feedback.suggestions[0]) || (feedback.password_policy_validation_passed ? "OK" : "Not OK");
					me.set_strength_indicator(indicators[score], warning);

				}
			}

		});
	},
	set_strength_indicator: function (color, warning) {
		this.indicator.removeClass().addClass('password-strength-indicator indicator ' + color);
		this.indicator.html(__(warning));
	}
};