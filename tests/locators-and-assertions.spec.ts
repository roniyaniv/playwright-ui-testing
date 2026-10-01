import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.goto('https://playground.bondaracademy.com')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async ({page}) => {
  // find by tag
  page.locator('input')

  // find by ID
  page.locator('#inputEmail1')

  // find by class
  page.locator('.input-full-width')

  // find by any attribute
  page.locator('[placeholder="email"]')
  
  // find by full class value
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

  // find by several selectors
  page.locator('input[placeholder="email"].input-full-width')
  
  // find by xpath (NOT RECOMMENDED)
  // page.locator('//*[@id="inputEmail1"]')

  // find by text (partial match)
  page.locator(':text("Using")')

  // find by text (exact match)
  page.locator(':text-is("Using the Grid")')

})

test('parent elements', async ({page}) => {
  await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('button').click()
  await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('button').click()
})
