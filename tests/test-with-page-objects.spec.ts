import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/page-manager';


test.beforeEach(async ({page}) => {
  await page.goto('https://playground.bondaracademy.com/')
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

  await pom.navigateTo.formLayoutsPage()
  await pom.formsLayoutPage.submitUsingTheGridForm('email@bondar.com', 'abcd123', 'Option 1')
  await pom.formsLayoutPage.submitInlineForm('Roni Yaniv', 'roni@bondar.com', true)
  await pom.navigateTo.datePickerPage()
  await pom.datepickerPage.selectCommonDatepickerDateFromToday(5)
  await pom.datepickerPage.selectDatepickerWithRangeFromToday(5, 10)
})

