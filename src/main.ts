import { Plugin, MarkdownView } from 'obsidian'
import { UtmSettings, DEFAULT_SETTINGS, UtmSettingTab } from './settings'

export default class UtmRemoverPlugin extends Plugin {
	settings: UtmSettings

	async onload() {
		console.log('loading remove-utm')
		await this.loadSettings()

		this.registerDomEvent(window, 'paste', (evt: ClipboardEvent) => {
			const clipboardData = evt.clipboardData?.getData('text/plain')
			if (!clipboardData) return

			try {
				const url = new URL(clipboardData)
				const hasParam = this.settings.scrubList.some(param => url.searchParams.has(param))

				if (hasParam) {
					evt.stopImmediatePropagation()
					evt.preventDefault()

					this.settings.scrubList.forEach(param => url.searchParams.delete(param))

					const cleanedUrl = url.toString()
					const view = this.app.workspace.getActiveViewOfType(MarkdownView)
					if (view) {
						view.editor.replaceSelection(cleanedUrl)
					}
				}
			} catch (e) { /* Not a URL */ }
		}, true)

		this.addSettingTab(new UtmSettingTab(this.app, this))
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
