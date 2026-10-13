import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { PageManager } from '../page-objects/page-manager';


test.beforeEach(async ({page}) => {
  await page.goto('/')
})

test('navigate to forms layout', async ({ page }) => {

  const pom = new PageManager(page)

  await pom.navigateTo.formLayoutsPage()
  await pom.navigateTo.datePickerPage()
  await pom.navigateTo.toasterPage()
  await pom.navigateTo.smartTablePage()
});

test('use parameterized page object method', async ({page}) => {

  const pom = new PageManager(page)
  const email = faker.internet.email( {provider: process.env.TEST_USER_EMAIL_DOMAIN})
  // console.log(email);
  const password = faker.internet.password()
  const name = faker.person.fullName()

  await pom.navigateTo.formLayoutsPage()
  await pom.formsLayoutPage.submitUsingTheGridForm(email, password, 'Option 1')
  await page.waitForTimeout(500)
  
  // screeshot as file
  // await page.screenshot({path: 'screenshots/formlayoutoage.png'})
  
  // screenshot as binary stream
  // const formLayoutsPageBuffer = await page.screenshot()
  // console.log(formLayoutsPageBuffer.toString('base64'))

  await pom.formsLayoutPage.submitInlineForm(name, email, true)

  // screenshot of a specific element
  // await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineform.png'})

  await pom.navigateTo.datePickerPage()
  await pom.datepickerPage.selectCommonDatepickerDateFromToday(5)
  await pom.datepickerPage.selectDatepickerWithRangeFromToday(5, 10)
})

