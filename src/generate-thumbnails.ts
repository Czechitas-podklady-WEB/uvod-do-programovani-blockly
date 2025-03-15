import puppeteer from 'puppeteer'
import { delay } from './utilities/delay.ts'

console.log('Launching browser')
const browser = await puppeteer.launch({ headless: false })
const page = await browser.newPage()
console.log('Loading page')
await page.goto('http://localhost:5173/#/thumbnails')

console.log('Waiting for levels to be loaded')
await delay(10000) // Wait for all levels to be loaded

const levels = await page.$$('div[data-level-key]')
console.log('Levels found:', levels.length)
for (const level of levels) {
	const levelKey = await level.evaluate((element) =>
		element.getAttribute('data-level-key'),
	)
	console.log('Capturing level:', levelKey)
	await level.screenshot({ path: `src/assets/thumbnails/${levelKey}.png` })
}

await browser.close()
