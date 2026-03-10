import type { Page } from "@playwright/test";

export class CompetitionListPage {
  constructor(private page: Page) {}

  get competitionLink() {
    return this.page.getByTestId("competition-link").or(
      this.page.getByRole("link", { name: /competition/i })
    );
  }

  get firstCompetitionMenu() {
    return this.page.getByTestId("competition-menu-first").or(
      this.page.getByRole("cell", { name: "Open menu" }).first()
    );
  }

  get newestCompetitionMenu() {
    return this.page.getByTestId("competition-menu-newest").or(
      this.page.getByRole("cell", { name: "Open menu" }).last()
    );
  }

  get deactivateMenuItem() {
    return this.page.getByTestId("deactivate-menu-item").or(
      this.page.getByRole("menuitem", { name: "Deactive" })
    );
  }

  get confirmDeactivateButton() {
    return this.page.getByTestId("confirm-deactivate").or(
      this.page.getByRole("button", { name: /yes, deactive/i })
    );
  }

  get cancelDeactivateButton() {
    return this.page.getByTestId("cancel-deactivate").or(
      this.page.getByRole("button", { name: /no, check again/i })
    );
  }

  get cancelButton() {
    return this.page.getByTestId("cancel-button").or(
      this.page.getByRole("button", { name: /cancel/i })
    );
  }

  async navigateToCompetitions() {
    await this.competitionLink.click();
  }

  async openFirstCompetitionMenu() {
    await this.firstCompetitionMenu.click();
  }

  async deactivateCompetition() {
    await this.deactivateMenuItem.click();
  }

  async confirmDeactivation() {
    await this.confirmDeactivateButton.click();
  }

  async cancelDeactivation() {
    await this.cancelDeactivateButton.click();
  }

  async deactivateFirstCompetition() {
    await this.openFirstCompetitionMenu();
    await this.deactivateCompetition();
    await this.confirmDeactivation();
  }

  async deactivateNewestCompetition() {
    await this.newestCompetitionMenu.click();
    await this.deactivateCompetition();
    await this.confirmDeactivation();
  }
}
