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
      <div id="value1" class="kpi">Valor 1: 0</div>
      <div id="value2" class="kpi">Valor 2: 0</div>
      <div id="value3" class="kpi">Valor 3: 0</div>
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

    onCustomWidgetDataUpdate(binding) {
  const resultSet = binding?.dataBinding1;

  if (resultSet?.data?.length > 0 && Array.isArray(resultSet.data[0])) {
    const row = resultSet.data[0];
    const valor1 = row[0]?.rawValue ?? 0;
    const valor2 = row[1]?.rawValue ?? 0;
    const valor3 = row[2]?.rawValue ?? 0;

    this.shadowRoot.getElementById("valor1").textContent = `Valor 1: ${valor1}`;
    this.shadowRoot.getElementById("valor2").textContent = `Valor 2: ${valor2}`;
    this.shadowRoot.getElementById("valor3").textContent = `Valor 3: ${valor3}`;
  } else {
    this.shadowRoot.getElementById("valor1").textContent = `Valor 1: -`;
    this.shadowRoot.getElementById("valor2").textContent = `Valor 2: -`;
    this.shadowRoot.getElementById("valor3").textContent = `Valor 3: -`;
  }
}

  /*  onCustomWidgetDataUpdate(binding){
      const data = binding.dataBinding1;
      if(data?.data?.length > 0){
        const row = data.data[0];
        const[v1, v2, v3] = row.map(cell => cell?.rawValue ?? 0);


        this.shadowRoot.getElementById("value1").textContent = "Value 1: ${v1}";
        this.shadowRoot.getElementById("value2").textContent = "Value 2: ${v2}";
        this.shadowRoot.getElementById("value3").textContent = "Value 3: ${v3}";
      }
    } */

   /* onCustomWidgetAfterUpdate(changedProperties) {
      if ("valor1" in changedProperties) {
        this.shadowRoot.getElementById("valor1").textContent = "Valor 1: " + changedProperties.valor1;
      }
      if ("valor2" in changedProperties) {
        this.shadowRoot.getElementById("valor2").textContent = "Valor 2: " + changedProperties.valor2;
      }
      if ("valor3" in changedProperties) {
        this.shadowRoot.getElementById("valor3").textContent = "Valor 3: " + changedProperties.valor3;
      }
    }*/
  } 

  customElements.define("com-sap-boxofkpis-kpibox", KPIBox);
})();
