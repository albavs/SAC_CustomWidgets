class KpiBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set valor1(value) {
    this._valor1 = value;
    this.render();
  }

  get valor1() {
    return this._valor1;
  }

  set valor2(value) {
    this._valor2 = value;
    this.render();
  }

  get valor2() {
    return this._valor2;
  }

  set valor3(value) {
    this._valor3 = value;
    this.render();
  }

  get valor3() {
    return this._valor3;
  }

  // Método que SAC llama para pasar las propiedades del widget
  onCustomWidgetAfterUpdate(changedProperties) {
    if ('valor1' in changedProperties) this.valor1 = changedProperties.valor1;
    if ('valor2' in changedProperties) this.valor2 = changedProperties.valor2;
    if ('valor3' in changedProperties) this.valor3 = changedProperties.valor3;
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        .kpi-container {
          display: flex;
          gap: 20px;
          font-family: Arial, sans-serif;
        }
        .kpi {
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          width: 100px;
          background-color: #f9f9f9;
        }
        .value {
          font-size: 24px;
          font-weight: bold;
          color: #2E86C1;
        }
        .label {
          font-size: 14px;
          color: #555;
          margin-top: 5px;
        }
      </style>

      <div class="kpi-container">
        <div class="kpi">
          <div class="value">${this.valor1 !== undefined ? this.valor1 : '-'}</div>
          <div class="label">Valor 1</div>
        </div>
        <div class="kpi">
          <div class="value">${this.valor2 !== undefined ? this.valor2 : '-'}</div>
          <div class="label">Valor 2</div>
        </div>
        <div class="kpi">
          <div class="value">${this.valor3 !== undefined ? this.valor3 : '-'}</div>
          <div class="label">Valor 3</div>
        </div>
      </div>
    `;
  }
}

customElements.define('com-sap-boxofkpis-kpibox', KpiBox);
