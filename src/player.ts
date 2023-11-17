import type * as playwright from 'playwright'
import path from 'path'
import * as Sentry from "@sentry/node";

async function newPlayerPage (browser: playwright.Browser): Promise<playwright.Page> {
  const context = await Sentry.startSpan({ name: "New Browser Context" }, async () => {
    return await browser.newContext()
  })

  const page = await Sentry.startSpan({ name: "New Page" }, async () => {
    return await context.newPage()
  })

  await Sentry.startSpan({ name: "Goto RRWeb Page" }, async () => {
    return await gotoRRWebPlayer(page)
  })

  return page
}

async function gotoRRWebPlayer (page: playwright.Page): Promise<void> {
  await page.goto(`file://${path.join(process.cwd(), '/dist/index.html')}`)
}

async function playRRWebEvents (page: playwright.Page, events: any[]): Promise<void> {
  await page.evaluate((e) => { (window as any).playEvents(e) }, events)
}

export { newPlayerPage, gotoRRWebPlayer, playRRWebEvents }
