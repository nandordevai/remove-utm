import {App, PluginSettingTab, Setting} from "obsidian";
import type UtmRemoverPlugin from "./main";

export interface UtmSettings {
	scrubList: string[]
}

export const DEFAULT_SETTINGS: UtmSettings = {
	scrubList: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'from']
}

export class UtmSettingTab extends PluginSettingTab {
	plugin: UtmRemoverPlugin

	constructor(app: App, plugin: UtmRemoverPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this
		containerEl.empty()

		containerEl.createEl('h2', { text: 'URL Scrub Settings' })

		new Setting(containerEl)
			.setName('Parameters to remove')
			.setDesc('A comma-separated list of URL parameters to strip on paste.')
			.addTextArea(text => {
				text.setValue(this.plugin.settings.scrubList.join(', '))
					.onChange(async (value) => {
						this.plugin.settings.scrubList = value
							.split(',')
							.map(item => item.trim())
							.filter(item => item !== "")
						await this.plugin.saveSettings()
					})
				text.inputEl.rows = 4
				text.inputEl.style.width = '100%'
			})
	}
}
