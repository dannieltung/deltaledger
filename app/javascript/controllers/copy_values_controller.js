import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["strikeSource", "premiumSource", "strikeDestination", "premiumDestination"]

  copy() {
    // Copiar Strike para strike_price
    const strikeValue = this.strikeSourceTarget.value
    if (this.hasStrikeDestinationTarget) {
      this.strikeDestinationTarget.value = strikeValue
      // Trigger input event para formatar o valor
      this.strikeDestinationTarget.dispatchEvent(new Event('input', { bubbles: true }))
      this.strikeDestinationTarget.dispatchEvent(new Event('change', { bubbles: true }))
    }

    // Copiar Premium para premium
    const premiumValue = this.premiumSourceTarget.value
    if (this.hasPremiumDestinationTarget) {
      this.premiumDestinationTarget.value = premiumValue
      // Trigger input event para formatar o valor
      this.premiumDestinationTarget.dispatchEvent(new Event('input', { bubbles: true }))
      this.premiumDestinationTarget.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }
}
