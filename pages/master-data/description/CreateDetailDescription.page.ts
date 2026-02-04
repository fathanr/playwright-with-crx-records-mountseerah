import { Page, Locator } from "@playwright/test";

export class CreateDetailDescriptionPage {
  readonly page: Page;
  readonly masterDataMenu: Locator;
  readonly descriptionLink: Locator;
  readonly detailLink: Locator;
  readonly addRowBtn: Locator;
  readonly addRowIdInput: Locator;
  readonly entityDistrictSelect: Locator;
  readonly addDescriptionInput: Locator;
  readonly addSubDescriptionInput: Locator;
  readonly addSubmitBtn: Locator;
  readonly parentRowRadio: Locator;
  readonly childRowRadio: Locator;
  readonly parentRowSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.masterDataMenu = page.getByRole("menu").getByText("Master Data");
    this.descriptionLink = page.getByRole("link", { name: "Description", exact: true });
    this.detailLink = page.getByRole("link", { name: "002" }).locator("a");
    this.addRowBtn = page.getByTestId("add-row-btn");
    this.addRowIdInput = page.getByTestId("add-row-id-input");
    this.entityDistrictSelect = page.getByTestId("add-entity-district-select");
    this.addDescriptionInput = page.getByTestId("add-description-input");
    this.addSubDescriptionInput = page.getByTestId("add-sub-description-input");
    this.addSubmitBtn = page.getByTestId("add-submit-btn");
    this.parentRowRadio = page.getByTestId("add-is-parent-select").getByText("Yes (Parent Row)");
    this.childRowRadio = page.getByTitle("No (Child Row)");
    this.parentRowSelect = page.getByTestId("add-parent-row-select");
  }

  async navigateToDescriptionDetail() {
    await this.masterDataMenu.click();
    await this.descriptionLink.click();
    await this.detailLink.click();
  }

  async addParentRow(id: string, description: string, subDescription: string) {
    await this.addRowBtn.click();
    await this.addRowIdInput.fill(id);
    await this.entityDistrictSelect.locator("div").click();
    await this.page.getByTitle("KPP - KPP").click();
    await this.addDescriptionInput.fill(description);
    await this.addSubDescriptionInput.fill(subDescription);
    await this.addSubmitBtn.click();
  }

  async addChildRow(id: string, description: string, subDescription: string, parentId: string) {
    // Wait for any modals to close
    await this.page.waitForSelector('.ant-modal-wrap', { state: 'hidden', timeout: 5000 }).catch(() => {});
    
    await this.addRowBtn.click();
    await this.addRowIdInput.fill(id);
    await this.entityDistrictSelect.locator("div").click();
    await this.page.getByTitle("KPP - KPP").click();
    await this.addDescriptionInput.fill(description);
    await this.addSubDescriptionInput.fill(subDescription);
    await this.parentRowRadio.click();
    await this.childRowRadio.click();
    await this.parentRowSelect.locator("div").click();
    await this.page.getByText(`${parentId} - deskripsi a`).click();
    await this.addSubmitBtn.click();
  }
}
