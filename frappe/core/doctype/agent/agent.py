# Copyright (c) 2021, Kimsreng and contributors
# For license information, please see license.txt

from warnings import filters
import frappe
from frappe.model.document import Document

class Agent(Document):
	def before_insert(self):
		self._check_abbr()

	def _check_abbr(self):
		def exist(abbr):
			return frappe.get_all("Agent", filters={"abbr": abbr}) != []
		abbr = self.abbr
		if not abbr:
			parts = self.agent_name.split(" ")
			abbr = ""
			for p in parts:
				abbr += p[0:1]
			abbr = abbr.upper()
			
		n = 0
		while exist(f"{abbr}{n or ''}"):
			n += 1			
		self.abbr =f"{abbr}{n or ''}"



def remove_abbr(text):
	agent = frappe.get_agent()
	return remove_abbr_from_text(remove_abbr_from_code(text, agent), agent)
	
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
	if not text: return text
	text = text.replace(get_abbr_extension(agent), "")
	return text

def remove_abbr_from_code(text, agent):
	if not text: return text
	text = text.replace(get_abbr_prefix(agent), "")
	return text