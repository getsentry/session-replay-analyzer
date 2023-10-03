import type * as playwright from 'playwright'
import path from 'path'

async function newPlayerPage (browser: playwright.Browser): Promise<playwright.Page> {
  const context = await browser.newContext()
  const page = await context.newPage()
  await gotoRRWebPlayer(page)
  return page
}

async function gotoRRWebPlayer (page: playwright.Page): Promise<void> {
  await page.goto(`file://${path.join(process.cwd(), '/dist/index.html')}`)
}

async function playRRWebEvents (page: playwright.Page, events: any[]): Promise<void> {
  await page.evaluate((e) => { (window as any).playEvents(e) }, events)
}

export { newPlayerPage, gotoRRWebPlayer, playRRWebEvents }
