import { mkdir, rm, writeFile } from 'node:fs/promises'
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

let exportFileContent = ''
const keyToUrl = new Map<string, string>()

const levels = await page.$$('div[data-level-key]')
console.log('Levels found:', levels.length)
let lastNameBase = 0
for (const level of levels) {
	const levelKey = await level.evaluate((element) =>
		element.getAttribute('data-level-key'),
	)
	if (levelKey === null) {
		throw new Error('Level key not found')
	}
	console.log('Capturing level:', levelKey)
	await level.screenshot({
		path: resolve(basePath, `${levelKey}.png`),
	})
	const name = `l_${lastNameBase++}`
	exportFileContent += `import ${name} from './${levelKey}.png'\n`
	keyToUrl.set(levelKey, name)
}

exportFileContent += '\nexport const thumbnails = new Map([\n'
for (const [key, url] of keyToUrl) {
	exportFileContent += `\t['${key}', ${url}],\n`
}
exportFileContent += '])\n'

console.log('Generating thumbnails.ts')
await writeFile(resolve(basePath, 'thumbnails.ts'), exportFileContent)

await browser.close()
