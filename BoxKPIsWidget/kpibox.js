(function() { 
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        display: block;
        border: 1px solid #ccc;
        padding: 10px;
        font-family: Arial, sans-serif;
      }
      .kpi {
        font-size: 24px;
        margin: 8px 0;
      }
    </style>
    <div>
      <div id="valor1" class="kpi">Valor 1: 0</div>
      <div id="valor2" class="kpi">Valor 2: 0</div>
      <div id="valor3" class="kpi">Valor 3: 0</div>
    </div>
  `;

  class KPIBox extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {};
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = { ...this._props, ...changedProperties };
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      if ("valor1" in changedProperties) {
        this.shadowRoot.getElementById("valor1").textContent = "Valor 1: " + changedProperties.valor1;
      }
      if ("valor2" in changedProperties) {
        this.shadowRoot.getElementById("valor2").textContent = "Valor 2: " + changedProperties.valor2;
      }
      if ("valor3" in changedProperties) {
        this.shadowRoot.getElementById("valor3").textContent = "Valor 3: " + changedProperties.valor3;
      }
    }
  }

  customElements.define("com-sap-boxofkpis-kpibox", KPIBox);
})();
