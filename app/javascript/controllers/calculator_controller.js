import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input1", "input2", "result"]

  connect() {
    console.log("Calculator controller connected!");
    this.calculate()
  }

  calculate() {
    const value1 = parseFloat(this.input1Target.value) || 0
    const value2 = parseFloat(this.input2Target.value) || 0

    if (value2 === 0) {
      this.resultTarget.textContent = "0.00%"
      return
    }

    const percentage = (value1 / value2) * 100
    this.resultTarget.textContent = `${percentage.toFixed(2)}%`
  }
}