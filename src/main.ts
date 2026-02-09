import { Plugin, MarkdownView } from 'obsidian'
import { UtmSettings, DEFAULT_SETTINGS, UtmSettingTab } from './settings'

export default class UtmRemoverPlugin extends Plugin {
	settings: UtmSettings

	async onload() {
		console.log('loading remove-utm')
		await this.loadSettings()
		this.addCommand({
			id: 'paste-clean-url',
			name: 'Paste and remove UTM trackers',
			hotkeys: [{ modifiers: ['Shift', 'Mod'], key: 'v'}],
			editorCallback: async(editor: Editor, _view: MarkdownView) => {
				const clipboardData = await navigator.clipboard.readText()
				if (!clipboardData) return

				try {
					const url = new URL(clipboardData)
					const hasParam = this.settings.scrubList.some(param => url.searchParams.has(param))

					if (hasParam) {
						this.settings.scrubList.forEach(param => url.searchParams.delete(param))

						const cleanedUrl = url.toString()
						editor.replaceSelection(cleanedUrl)
					}
				} catch (e) { // Not a URL
					console.log(e)
				}
			},
		})

		this.addSettingTab(new UtmSettingTab(this.app, this))
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
