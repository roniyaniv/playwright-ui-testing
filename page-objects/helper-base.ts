import { Page } from '@playwright/test'

export class HelperBase {

  protected readonly page: Page

  protected constructor(page: Page) {
    this.page = page
  }

  protected async getToastrMessage() {
    // validates toast and gets its message
    return "I'm a toastr!"
  }
}