import type { Page } from "@playwright/test";

export class CreateCompetitionPage {
  constructor(private page: Page) {}

  get competitionNameInput() {
    return this.page.getByTestId("competition-name-input").or(
      this.page.getByRole("textbox", { name: /input competition name/i })
    );
  }

  get organizerInput() {
    return this.page.getByTestId("organizer-input").or(
      this.page.getByRole("textbox", { name: /input organizer/i })
    );
  }

  get additionalLinkInput() {
    return this.page.getByTestId("additional-link-input").or(
      this.page.getByRole("textbox", { name: /input additional link outside/i })
    );
  }

  get imageUploadInput() {
    return this.page.getByTestId("image-upload-input").or(
      this.page.locator(".w-full").first()
    );
  }

  get startDatePicker() {
    return this.page.getByTestId("start-date-picker").or(
      this.page.getByRole("button", { name: /pick a date/i }).first()
    );
  }

  get endDatePicker() {
    return this.page.getByTestId("end-date-picker").or(
      this.page.getByRole("button", { name: /pick a date/i })
    );
  }

  get richTextEditor() {
    return this.page.getByTestId("rich-text-editor").or(
      this.page.locator(".ql-editor")
    );
  }

  get boldButton() {
    return this.page.getByTestId("bold-button").or(
      this.page.getByRole("button", { name: /bold/i })
    );
  }

  get italicButton() {
    return this.page.getByTestId("italic-button").or(
      this.page.getByRole("button", { name: /italic/i })
    );
  }

  get underlineButton() {
    return this.page.getByTestId("underline-button").or(
      this.page.getByRole("button", { name: /underline/i })
    );
  }

  get strikeButton() {
    return this.page.getByTestId("strike-button").or(
      this.page.getByRole("button", { name: /strike/i })
    );
  }

  get backgroundColorButton() {
    return this.page.locator(".ql-background > .ql-picker-label");
  }

  get textColorButton() {
    return this.page.locator(".ql-foreground > .ql-picker-label");
  }

  get indentIncreaseButton() {
    return this.page.getByTestId("indent-increase").or(
      this.page.getByRole("button", { name: /indent: \+/i })
    );
  }

  get indentDecreaseButton() {
    return this.page.getByTestId("indent-decrease").or(
      this.page.getByRole("button", { name: /indent: -/i })
    );
  }

  get alignLeftButton() {
    return this.page.getByRole("button", { name: /align: left/i });
  }

  get alignCenterButton() {
    return this.page.getByTestId("align-center").or(
      this.page.getByRole("button", { name: /align: center/i })
    );
  }

  get alignJustifyButton() {
    return this.page.getByTestId("align-justify").or(
      this.page.getByRole("button", { name: /align: justify/i })
    );
  }

  get bulletListButton() {
    return this.page.getByTestId("bullet-list").or(
      this.page.getByRole("button", { name: /list: bullet/i })
    );
  }

  get orderedListButton() {
    return this.page.getByTestId("ordered-list").or(
      this.page.getByRole("button", { name: /list: ordered/i })
    );
  }

  get cleanButton() {
    return this.page.getByTestId("clean-button").or(
      this.page.getByRole("button", { name: /clean/i })
    );
  }

  get publishButton() {
    return this.page.getByTestId("publish-button").or(
      this.page.getByRole("button", { name: /publish/i })
    );
  }

  get confirmPublishButton() {
    return this.page.getByTestId("confirm-publish").or(
      this.page.getByRole("button", { name: /yes, publish/i })
    );
  }

  get competitionLink() {
    return this.page.getByRole("link", { name: /competition/i });
  }

  get createNewLink() {
    return this.page.getByRole("link", { name: /create new/i });
  }

  async navigateToCreateCompetition() {
    await this.competitionLink.click();
    await this.createNewLink.click();
  }

  async uploadImage(filePath: string) {
    const fileInput = this.page.locator("input[type='file']");
    await fileInput.setInputFiles(filePath);
  }

  async fillCompetitionName(name: string) {
    await this.competitionNameInput.fill(name);
  }

  async fillOrganizer(organizer: string) {
    await this.organizerInput.fill(organizer);
  }

  async fillAdditionalLink(link: string) {
    await this.additionalLinkInput.fill(link);
  }

  async selectStartDate(day: string) {
    await this.startDatePicker.click();
    await this.page.getByRole("gridcell", { name: day, exact: true }).click();
  }

  async selectEndDate(day: string) {
    await this.endDatePicker.click();
    await this.page.getByRole("gridcell", { name: day, exact: true }).click();
  }

  async fillRichText(content: string) {
    await this.richTextEditor.fill(content);
  }

  async clickPublish() {
    await this.publishButton.click();
  }

  async confirmPublish() {
    await this.confirmPublishButton.click();
  }
}
