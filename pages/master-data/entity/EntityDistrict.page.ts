import type { Page } from "@playwright/test";

export class EntityDistrictPage {
  constructor(private page: Page) {}

  async openModule() {
    await this.page.getByText("Master Data").click();
    await this.page.getByRole("link", { name: "Entity District" }).click();
  }

  async openCreateForm() {
    await this.page.getByTestId("create-btn").click();
  }

  async create(entity: string, district: string, description: string) {
    await this.page.getByTestId("entity-district-entity-field").fill(entity);
    await this.page.getByTestId("entity-district-district-field").fill(district);
    await this.page.getByTestId("entity-district-description-field").fill(description);
    await this.page.getByTestId("entity-district-save-btn").click();
  }

  async search(term: string) {
    await this.page.getByRole("textbox", { name: "Search" }).fill(term);
  }

  async clickFirstMatchingCell(name: string) {
    await this.page.getByRole("cell", { name }).first().click();
  }
}
