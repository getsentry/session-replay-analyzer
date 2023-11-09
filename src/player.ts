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

async function playRRWebEvents (page: playwright.Page, events: any[]): Promise<Boolean> {
  let event = page.waitForEvent("console");
  await page.evaluate((e) => { (window as any).playEvents(e) }, events)

  let message = await event;
  return (await message.args()[0].jsonValue()) === "FINISHED"
}

export { newPlayerPage, gotoRRWebPlayer, playRRWebEvents }
