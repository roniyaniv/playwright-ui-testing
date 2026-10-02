import  { expect, Page } from '@playwright/test'
import { step } from '../helpers/test-step-decorator'
import { HelperBase } from './helper-base'

export class DatepickerPage extends HelperBase{

  constructor(page: Page) {
    super(page)
  }

  @step
  async selectCommonDatepickerDateFromToday(daysFromToday: number) {
    const calendarInputField = this.page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    const expectedDate = await this.selectDateInCalendar(daysFromToday)

    await expect(calendarInputField).toHaveValue(expectedDate)    
  }

  @step
  async selectDatepickerWithRangeFromToday(daysFromTodayStart: number, daysFromTodayEnd: number) {
    const calendarInputField = this.page.getByPlaceholder('Range Picker')
    await calendarInputField.click()
    const expectedDateStart = await this.selectDateInCalendar(daysFromTodayStart)
    const expectedDateEnd = await this.selectDateInCalendar(daysFromTodayEnd)
    const expectedDateRange = `${expectedDateStart} - ${expectedDateEnd}`
    await expect(calendarInputField).toHaveValue(expectedDateRange)    

  }

  
  private async selectDateInCalendar(daysFromToday: number) {

    const date = new Date();
    date.setDate(date.getDate() + daysFromToday)

    const expectedDay = date.getDate().toString();
    const expectedMonth = date.toLocaleString('En-US', {month: 'short'})
    const expectedYear = date.getFullYear()
    const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

    let currentlySelectedMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
    const currentMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedMonthAndYear = `${currentMonthLong} ${expectedYear}`

    while (!currentlySelectedMonthAndYear?.includes(expectedMonthAndYear)) {
      await this.page.locator('.next-month').click()
      currentlySelectedMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
    }

    await this.page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay,{exact: true}).click()

    return expectedDate

  }
}