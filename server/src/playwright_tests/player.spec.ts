import { gotoRRWebPlayer, playRRWebEvents } from '../player'
import { test, expect } from '@playwright/test'

test('calling playEvents create a new player', async ({ page }) => {
  await gotoRRWebPlayer(page)
  await expect(page).toHaveTitle('Player')
  await expect(page.locator('div.rr-player')).toHaveCount(0)
  await expect(page.locator('iframe')).toHaveCount(0)

  await playRRWebEvents(page, [{}, {}])
  await expect(page.locator('div.rr-player')).toHaveCount(1)
  await expect(page.locator('iframe')).toHaveCount(1)
})

test('multiple calls to playEvents does not create more than one player', async ({ page }) => {
  await gotoRRWebPlayer(page)
  await playRRWebEvents(page, [{}, {}])
  await playRRWebEvents(page, [{}, {}])

  await expect(page.locator('div.rr-player')).toHaveCount(1)
  await expect(page.locator('iframe')).toHaveCount(1)
})
