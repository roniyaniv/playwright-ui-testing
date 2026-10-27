import  { Page, expect } from '@playwright/test'
import { step } from '../helpers/test-step-decorator'
import { HelperBase } from './helper-base'

export class FormLayoutsPage extends HelperBase {

  constructor(page: Page) {
    super(page)
  }

  @step
  async submitUsingTheGridForm(email: string, password: string, optionText: string) {
    const usingTheGridForm = this.page.locator('nb-card', {hasText: "Using the Grid"})
    
    await usingTheGridForm.getByRole('textbox', {name: 'Email'}).fill(email)
    await usingTheGridForm.getByRole('textbox', {name: 'Password'}).fill(password)
    await usingTheGridForm.getByText(optionText).click()
    await expect(usingTheGridForm.getByRole('radio', {name: optionText})).toBeChecked()
    await usingTheGridForm.getByRole('button', {name: 'Sign in'}).click()

  }

  /** 
   * this method submits inline form with user full name, email and remember me checkbox can be selected
   * 
   * @param fullName - Valid test full name
   * @param email - Valid test user email
   * @param rememberMeCheckbox - pass 'true' to select the box
   */
  @step
  async submitInlineForm(fullName: string, email: string, rememberMeCheckbox: boolean) {
    const inlineForm = this.page.locator('nb-card', {hasText: "Inline form"})
    
    await inlineForm.getByRole('textbox', {name: 'Jane Doe'}).fill(fullName)
    await inlineForm.getByRole('textbox', {name: 'Email'}).fill(email)
    if (rememberMeCheckbox == true) {
      await inlineForm.getByText('Remember me').click()
      await expect(inlineForm.getByRole('checkbox')).toBeChecked()
    }
    await inlineForm.getByRole('button', {name: 'Submit'}).click()

  }
}