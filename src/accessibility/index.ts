import { AxeBuilder } from '@axe-core/playwright'
import * as playwright from 'playwright'
import { split } from './splitter'
import { downloadFromFilenames } from '../gcs'
import { type IStorage } from 'mock-gcs'

interface AccessiblityIssue {
  id: string
  timestamp: number
  impact?: 'minor' | 'moderate' | 'serious' | 'critical' | null // axe.ImpactValue
  description: string
  help_url: string
  element: string
  failure_summary?: string
}

async function runA11Y (storage: IStorage, filenames: string[]): Promise<AccessiblityIssue[]> {
  // Download, parse, and collect the relevant RRWeb events.
  const segments = await downloadFromFilenames(storage, filenames)
  const snapshots = split(segments)

  // Initialize a new RRWeb player page. This page should be able to accept RRWeb events and
  // play them back.
  const page = await newPlayerPage()

  // Run in a loop evaluating each event.
  return await evaluateSnapshots(page, snapshots)
}

async function newPlayerPage (): Promise<playwright.Page> {
  const browser = await playwright.chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`file://${PATH_TO_HTML}`)
  return page
}

async function evaluateSnapshots (page: playwright.Page, events: any[]): Promise<AccessiblityIssue[]> {
  const issues = []

  for (const event of events) {
    // `eval` each snapshot.
    await page.evaluate((e) => {
      (window as any).events = [e];
      (window as any).player.play()
    }, event)

    await runAxe(page, event.timestamp, issues)
  }

  return issues
}

async function runAxe (page: playwright.Page, timestamp: number, issues: AccessiblityIssue[]): Promise<void> {
  try {
    const results = await new AxeBuilder({ page })
      .include('.rr-player')
      .disableRules([
        'frame-title',
        'page-has-heading-one',
        'landmark-one-main'
      ])
      .analyze()

    results.violations.forEach((r) => {
      console.log(JSON.stringify(r, null, 4))

      r.nodes.forEach(n => {
        issues.push({
          id: r.id,
          timestamp,
          impact: n.impact,
          description: r.help,
          help_url: r.helpUrl,
          element: n.html,
          failure_summary: n.failureSummary
        })
      })
    })
  } catch (e) {
    console.log(e)
  }
}

export { runA11Y, type AccessiblityIssue }
