import { mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer'
import { delay } from './utilities/delay.ts'

const basePath = resolve(import.meta.dirname, './assets/thumbnails')

console.log('Launching browser')
const browser = await puppeteer.launch()
const page = await browser.newPage()
console.log('Loading page')
await page.goto('http://localhost:5173/#/thumbnails')

console.log('Waiting for levels to be loaded')
await delay(5000) // Wait for all levels to be loaded

console.log('Removing old captures')
await rm(basePath, {
	recursive: true,
	force: true,
})
await mkdir(basePath)

const levels = await page.$$('div[data-level-key]')
console.log('Levels found:', levels.length)
for (const level of levels) {
	const levelKey = await level.evaluate((element) =>
		element.getAttribute('data-level-key'),
	)
	console.log('Capturing level:', levelKey)
	await level.screenshot({
		path: resolve(basePath, `${levelKey}.png`),
	})
}

await browser.close()
