import { AxeBuilder } from '@axe-core/playwright'
import type * as playwright from 'playwright'
import { split } from './splitter'
import { playRRWebEvents } from '../player'
import { downloadFromFilenames } from '../gcs'
import { type IStorage } from 'mock-gcs'

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>

interface ProblemAlternative {
  id: string
  message: string
}

interface ProblemElement {
  alternatives: ProblemAlternative[]
  element: string
  target: any
}

interface AccessiblityIssue {
  elements: ProblemElement[]
  help_url: string
  help: string
  id: string
  impact?: 'minor' | 'moderate' | 'serious' | 'critical' | null // axe.ImpactValue
  timestamp: number
}

async function runA11Y (storage: IStorage, page: playwright.Page, filenames: string[]): Promise<AccessiblityIssue[]> {
  // Download, parse, and collect the relevant RRWeb events.
  const segments = await downloadFromFilenames(storage, filenames)
  const snapshots = split(segments)

  // Run in a loop evaluating each event.
  return await evaluateSnapshots(page, snapshots)
}

async function evaluateSnapshots (page: playwright.Page, events: any[]): Promise<AccessiblityIssue[]> {
  await playRRWebEvents(page, events)
  return await runAxe(page, 0)
}

async function runAxe (page: playwright.Page, timestamp: any): Promise<AccessiblityIssue[]> {
  try {
    const results = await new AxeBuilder({ page })
      .include('.rr-player__frame')
      .disableRules([
        'frame-title',
        'page-has-heading-one',
        'landmark-one-main'
      ])
      .analyze()

    return processViolations(results, coerceTimestamp(timestamp))
  } catch (e) {
    // TODO: Handle axe-core errors.
    console.log(e)
    return []
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

function processViolations (results: AxeResults, timestamp: number): AccessiblityIssue[] {
  return results.violations.map((result) => {
    return {
      elements: result.nodes.map((node) => {
        return {
          alternatives: node.any.map((issue) => {
            return {
              id: issue.id,
              message: issue.message
            }
          }),
          element: node.html,
          target: node.target
        }
      }),
      help_url: result.helpUrl,
      help: result.help,
      id: result.id,
      impact: result.impact,
      timestamp
    }
  })
}

export { runA11Y, type AccessiblityIssue, coerceTimestamp, processViolations }
