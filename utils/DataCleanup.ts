import { Page } from '@playwright/test';
import { DataFactory } from './DataFactory';

export class DataCleanup {
  constructor(private page: Page) {}

  /**
   * Clean up created entities after test
   */
  async cleanupEntities() {
    const createdEntities = DataFactory.getCreatedEntities();
    
    if (createdEntities.length === 0) return;

    console.log(`🧹 Cleaning up ${createdEntities.length} test entities...`);

    try {
      // Navigate to entity management page
      await this.page.goto('/master-data/entity-district');
      
      for (const entityName of createdEntities) {
        await this.deleteEntity(entityName);
      }

      DataFactory.clearCreatedEntities();
      console.log('✅ Cleanup completed');
    } catch (error) {
      console.warn('⚠️ Cleanup failed:', error);
    }
  }

  private async deleteEntity(entityName: string) {
    try {
      // Search for the entity with more flexible selectors
      const searchInput = this.page.getByTestId('search-input')
        .or(this.page.getByPlaceholder(/search/i))
        .or(this.page.locator('input[placeholder*="search" i]'))
        .or(this.page.locator('input[type="search"]'));
        
      await searchInput.fill(entityName);
      await this.page.keyboard.press('Enter');

      // Wait for search results
      await this.page.waitForTimeout(1000);

      // Find and click delete button for this entity
      const deleteButton = this.page.getByTestId(`delete-${entityName}`).or(
        this.page.locator(`tr:has-text("${entityName}") button:has-text("Delete")`)
      );

      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        
        // Confirm deletion
        const confirmButton = this.page.getByTestId('confirm-delete').or(
          this.page.getByRole('button', { name: /confirm|yes|delete/i })
        );
        await confirmButton.click();

        // Wait for deletion to complete
        await this.page.waitForTimeout(500);
      }
    } catch (error) {
      console.warn(`Failed to delete entity ${entityName}:`, error);
    }
  }

  /**
   * Clean up test sessions
   */
  async cleanupSessions() {
    try {
      // Clear browser storage
      await this.page.context().clearCookies();
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch (error) {
      console.warn('Session cleanup failed:', error);
    }
  }

  /**
   * Reset form data
   */
  async resetForm() {
    try {
      const resetButton = this.page.getByTestId('reset-button').or(
        this.page.getByRole('button', { name: /reset|clear/i })
      );
      
      if (await resetButton.count() > 0) {
        await resetButton.click();
      }
    } catch (error) {
      // Form reset not available, continue
    }
  }
}
