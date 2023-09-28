import { AxeBuilder } from '@axe-core/playwright'
import type * as playwright from 'playwright'
import { split } from './splitter'
import { gotoRRWebPlayer, playRRWebEvents, newPlayerPage } from '../player'
import { downloadFromFilenames } from '../gcs'
import { type IStorage } from 'mock-gcs'

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>

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
  await gotoRRWebPlayer(page)

  // Run in a loop evaluating each event.
  return await evaluateSnapshots(page, snapshots)
}

async function evaluateSnapshots (page: playwright.Page, events: any[]): Promise<AccessiblityIssue[]> {
  const issues = []

  for (const event of events) {
    // Window is "guaranteed" to have the "playEvents" function exposed on the window. Or at
    // least it should because we control the image. I've not found a way to type check this.
    await playRRWebEvents(page, [event, {}])

    // TODO: We're not doing any validation of the schema. `event.timestamp` could be undefined.
    await runAxe(page, event.timestamp ?? 0, issues)
  }

  return issues
}

async function runAxe (page: playwright.Page, timestamp: any, issues: AccessiblityIssue[]): Promise<void> {
  try {
    const results = await new AxeBuilder({ page })
      .include('.rr-player')
      .disableRules([
        'frame-title',
        'page-has-heading-one',
        'landmark-one-main'
      ])
      .analyze()

    processViolations(results, coerceTimestamp(timestamp), issues)
  } catch (e) {
    console.log(e)
  }
}

function coerceTimestamp (timestamp: any): number {
  const number = Number(timestamp)
  if (Number.isNaN(number)) {
    return 0
  } else {
    return number
  }
}

function processViolations (results: AxeResults, timestamp: number, issues: AccessiblityIssue[]): void {
  results.violations.forEach((result) => {
    result.nodes.forEach(node => {
      issues.push({
        id: result.id,
        timestamp,
        impact: node.impact,
        description: result.help,
        help_url: result.helpUrl,
        element: node.html,
        failure_summary: node.failureSummary
      })
    })
  })
}

export { runA11Y, type AccessiblityIssue, coerceTimestamp, processViolations }
