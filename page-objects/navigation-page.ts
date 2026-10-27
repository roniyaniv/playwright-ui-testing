import { Page, test } from '@playwright/test'
import { step } from '../helpers/test-step-decorator'
import { HelperBase } from './helper-base'


export class NavigationPage extends HelperBase {

  constructor(page: Page) {
    super(page)
  }

  @step
  async formLayoutsPage() {
    await this.navigateTo('Forms', 'Form Layouts')
  }

  @step
  async datePickerPage() {
    await this.navigateTo('Forms', 'Datepicker')
  }

  @step
  async toasterPage() {
    await this.navigateTo('Modal & Overlays', 'Toastr')
  }

  @step
  async tooltipPage() {
    await this.navigateTo('Modal & Overlays', 'Tooltip')
  }

  @step
  async smartTablePage() {
    await this.navigateTo('Tables & Data', 'Smart Table')
  }

  private async navigateTo(groupMenuTitle: string, menuItem: string) {
    const isMobile = test.info().project.use.isMobile
    if (isMobile) await this.page.locator('.sidebar-toggle').click()

    await this.selectGroupMenuItem(groupMenuTitle)
    await this.page.getByText(menuItem).click()

    if (isMobile) await this.page.locator('.sidebar-toggle').click()
  }

  private async selectGroupMenuItem(groupMenuTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupMenuTitle)
    const expandedState = await groupMenuItem.getAttribute('aria-expanded')
    if (expandedState == "false") {
      await groupMenuItem.click()
    }
  }
}
