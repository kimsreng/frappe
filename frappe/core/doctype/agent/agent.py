# Copyright (c) 2021, Kimsreng and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Agent(Document):
	pass

def get_name_with_abbr(name, agent):
	if not agent: return name
	
	formatted_name = get_abbr_extension(agent)

	if formatted_name in name:
		return name

	return f"{name}{formatted_name}"

def get_name_with_abbr_pefix(name, agent):
	if not agent: return name
	
	formatted_name = get_abbr_prefix(agent)

	if formatted_name in name:
		return name

	return f"{formatted_name}{name}"

def get_abbr_extension(agent):
	agent_abbr = frappe.get_cached_value('Agent',  agent,  "abbr")
	return f"({agent_abbr})"

def get_abbr_prefix(agent):
	agent_abbr = frappe.get_cached_value('Agent',  agent,  "abbr")
	return "{0}-".format(agent_abbr)

def remove_abbr_from_text(text, agent):
	text = text.replace(get_abbr_extension(agent), "")
	return text

def remove_abbr_from_code(text, agent):
	text = text.replace(get_abbr_prefix(agent), "")
	return text