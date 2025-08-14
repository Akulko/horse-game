import { test, expect } from '@playwright/test'

test.describe('Horse Racing Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display initial UI correctly', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Horse Racing')
    await expect(page.locator('button')).toContainText(['GENERATE', 'START RACES'])
    await expect(page.locator('.bg-yellow-200')).toContainText('Horse List (1 - 20)')
  })

  test('should generate 20 horses on page load', async ({ page }) => {
    const horseRows = page.locator('.bg-yellow-200 .max-h-64 .grid.grid-cols-3')
    await expect(horseRows).toHaveCount(20)
  })

  test('should generate race program when button is clicked', async ({ page }) => {
    const generateButton = page.locator('button:has-text("GENERATE")')
    await generateButton.click()

    await expect(page.locator('.bg-orange-400').first()).toContainText('1st Lap - 1200m')
    
    const programSections = page.locator('.bg-orange-400')
    await expect(programSections).toHaveCount(6)
    
    const expectedDistances = ['1200m', '1400m', '1600m', '1800m', '2000m', '2200m']
    for (let i = 0; i < expectedDistances.length; i++) {
      await expect(programSections.nth(i)).toContainText(expectedDistances[i])
    }
  })

  test('should start race when START button is clicked after generating program', async ({ page }) => {
    await page.locator('button:has-text("GENERATE")').click()
    
    const startButton = page.locator('button:has-text("START RACES")')
    await expect(startButton).toBeEnabled()
    
    await startButton.click()
    
    await expect(page.locator('button').nth(1)).toHaveText('RACING...')
    
    await expect(page.locator('.bg-green-600')).toContainText('Race in progress...')
  })

  test('should display race results after races complete', async ({ page }) => {
    await page.locator('button:has-text("GENERATE")').click()
    await page.locator('button:has-text("START RACES")').click()
    
    await expect(page.locator('button').nth(1)).toBeEnabled({ timeout: 25000 })
    
    const resultsSections = page.locator('.bg-green-600')
    await expect(resultsSections.first()).toBeVisible()
  })

  test('should show horse movement during races', async ({ page }) => {
    await page.locator('button:has-text("GENERATE")').click()
    await page.locator('button:has-text("START RACES")').click()
    
    const horseEmoji = page.locator('.bg-green-600 .text-2xl').first()
    await expect(horseEmoji).toHaveText('🐎')
    
    const initialPosition = await horseEmoji.evaluate(el => el.getBoundingClientRect().left)
    
    await page.waitForTimeout(1000)
    
    const newPosition = await horseEmoji.evaluate(el => el.getBoundingClientRect().left)
    expect(newPosition).toBeGreaterThan(initialPosition)
  })

  test('should disable generate button during race', async ({ page }) => {
    await page.locator('button:has-text("GENERATE")').click()
    await page.locator('button:has-text("START RACES")').click()
    
    const generateButton = page.locator('button:has-text("GENERATE")')
    await expect(generateButton).toBeDisabled()
    
    await expect(page.locator('button').nth(1)).toBeEnabled({ timeout: 25000 })
  })
})