import { test, expect } from '@playwright/test';
import { NavigationPage } from '../page-objects/navigation-page';
import { DatepickerPage } from '../page-objects/datepicker-page';

test.describe('UI elements', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com')
  })

  test('checkboxes', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    await navigateTo.toasterPage()
    
    await page.getByRole('checkbox', {name: 'Hide on click'}).click({force: true}); // using force since original element is not visible due to styling choices.

    const allBoxes = page.getByRole('checkbox');
    for (const box of await allBoxes.all()) {
      await box.uncheck({force: true});
      await expect(box).not.toBeChecked();
    }
  })

  test('Standard Dropdown', async ({page}) => {
    const navigateTo = new NavigationPage(page)
    await navigateTo.toasterPage()

    // standard drop down
    await page.locator('.form-group', {hasText: 'Toast type'}).getByRole('combobox').selectOption('info');
    await expect(page.locator('.form-group', {hasText: 'Toast type'}).getByRole('combobox')).toHaveValue('info');
  })

  test('Custom Dropdown', async ({page}) => {
    const navigateTo = new NavigationPage(page)
    await navigateTo.toasterPage()

    // option 1
    await page.locator('.form-group', {hasText: 'Position'}).locator('nb-select').click();
    await page.getByRole('list').getByText('bottom-end').click();
    // option 2
    await page.locator('.form-group', {hasText: 'Position'}).locator('nb-select').click();
    await page.locator('nb-option', {hasText: 'top-end'}).click();

    await expect(page.locator('.form-group', {hasText: 'Position'}).locator('nb-select')).toHaveText('top-end')
  })

  test('loop through list', async ({page}) => {
    const navigateTo = new NavigationPage(page)
    await navigateTo.toasterPage()

    const positionDropDownField = page.locator('.form-group', {hasText: 'Position'}).locator('nb-select');
    await positionDropDownField.click();
    const allListValues = await page.locator('nb-option').allTextContents();
    for (const listValue of allListValues){
      await page.locator('nb-option', {hasText: listValue}).click();
      await expect(page.locator('.form-group', {hasText: 'Position'}).locator('nb-select')).toHaveText(listValue);
      await positionDropDownField.click();
    }
    await positionDropDownField.click();
  })

  test('tooltips', async ({page}) => {
    const navigateTo = new NavigationPage(page)
    navigateTo.tooltipPage()

    await page.getByRole('button', {name: 'Top'}).hover();
    await expect(page.getByRole('tooltip')).toHaveText('This is a tooltip');
  })

  test('dialog boxes', async ({page}) => {
    const navigateTo = new NavigationPage(page)
    navigateTo.smartTablePage()

    // this is a listener to handle a browser-level dialog (not an HTML-level dialog)
    // listener must be ready before triggering the action
    page.on('dialog', dialog => {
      expect(dialog.message()).toEqual('Are you sure you want to delete?');
      dialog.accept();
    });

    await page.locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click();
    await expect(page.locator('tr', {hasText: 'mdo@gmail.com'})).not.toBeVisible();
  })

  test('web tables - update age', async ({page}) => {
    const navigateTo = new NavigationPage(page)
    navigateTo.smartTablePage()

    // select row by any visible text
    const tableRowByEmail = page.getByRole('row', {name: 'jack@yandex.ru'});
    await tableRowByEmail.locator('.nb-edit').click();
    await tableRowByEmail.getByPlaceholder('Age').fill('95');
    await tableRowByEmail.locator('.nb-checkmark').click();
    await expect(tableRowByEmail.locator('td').last()).toHaveText('95');

    // get row by a specific column value
    const tableRowByID = page.getByRole('row').filter({has: page.getByRole('cell').nth(1).getByText('10')});

    await tableRowByID.locator('.nb-edit').click();

    // once clicked, the table cells become input fields (the locator we used does not work anymore)
    await page.locator('tbody').getByPlaceholder('E-mail').fill('test@test.com');
    await page.locator('tbody').locator('.nb-checkmark').click();

    // table cells are back to being cells now
    await expect(tableRowByID.locator('td').nth(5)).toHaveText('test@test.com');
  })

  test('web tables loops', async ({page}) => {
    const navigateTo = new NavigationPage(page)
    navigateTo.smartTablePage()

    const ages = ["20", "30", "40", "200"];

    for (const age of ages) {
      await page.getByPlaceholder('Age').fill(age);

      if (age == '200') {
        await expect(page.locator('tbody')).toContainText('No data found');
      } else {
        // make sure table is updated before pulling all row values
        await expect(page.locator('tbody tr').first().locator('td').last()).toHaveText(age);
        
        // get all rows
        const allTableRows = await page.locator('tbody tr').all();
        for (const row of allTableRows) {
          await expect(row.locator('td').last()).toHaveText(age);
        }
      }
    }
  })

  // test('date selection', async ({page}) => {
  //   const navigateTo = new NavigationPage(page)
  //   navigateTo.datePickerPage()

  //   const calendarInputField = page.getByPlaceholder('Form Picker')
  //   await calendarInputField.click()

  //   await page.locator('.day-cell:not(.bounding-month)').getByText('2',{exact: true}).click()

  //   // this is not future-proof
  //   await expect(calendarInputField).toHaveValue('Sep 2, 2026')
  // })

  test('dynamic date selection using Date Object', async ({page}) => {
    const navigateTo = new NavigationPage(page)
    const datepickerPage = new DatepickerPage(page)
    navigateTo.datePickerPage()
    await datepickerPage.selectCommonDatepickerDateFromToday(1)

  })

  test('sliders', async ({page}) => {
    // approach 1 - setting attribute values
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate(element => {
      element.setAttribute('cx', '229.05')
      element.setAttribute('cy', '229.05')
    })
    await tempGauge.click()

    // approach 2 - using mouse movement
    // define the mouse movement boundaries
    const tempGaugeBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempGaugeBox.scrollIntoViewIfNeeded()
    const box = await tempGaugeBox.boundingBox()
    const x = box?.x + box?.width / 2
    const y = box?.y + box?.height / 2
    await page.mouse.move(x,y)
    await page.mouse.down()
    await page.mouse.move(x + 100 ,y)
    await page.mouse.move(x + 100 ,y + 100)
    await page.mouse.up()

    await expect(tempGaugeBox).toContainText('30')
  })

  test('iFrames', async ({page}) => {
    await page.getByText('Modal & Overlay').click()
    await page.getByText('Dialog').click()

    const frameLocator = page.frameLocator('[data-cy="esc-close-iframe"]')

    await frameLocator.getByRole('button', {name: 'Open Dialog with esc close'}).click()
  })

  test('drag n drop', async ({page}) => {
    await page.getByText('Extra Components').click()
    await page.getByText('Drag & Drop').click()

    // option 1 - use built-in dragTo method
    await page.getByText('Clean my room').dragTo(page.locator('#drop-list'))

    // option 2 - use mouse movements
    await page.getByText('Get groceries').hover()
    await page.mouse.down()
    await page.locator('#drop-list').hover()
    await page.mouse.up()

  })
})

