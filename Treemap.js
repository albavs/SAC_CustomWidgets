(function() {
let template = document.createElement("template");
template.innerHTML = `
<style>
:host {
display: block;
width: 100%;
height: 100%;
}
#chart-container {
width: 100%;
height: 100%;
}
#error-msg {
color: red;
padding: 20px;
font-family: Arial, sans-serif;
}
#loading {
padding: 20px;
text-align: center;
font-family: Arial, sans-serif;
}
</style>
<div id="loading">Loading chart...</div>
<div id="chart-container"></div>
<div id="error-msg"></div>
`;
 
class ExpenseTreemap extends HTMLElement {
constructor() {
super();
this.attachShadow({mode: "open"});
this.shadowRoot.appendChild(template.content.cloneNode(true));
this._plotlyLoaded = false;
}
 
async connectedCallback() {
await this.loadPlotly();
}
 
async loadPlotly() {
if (window.Plotly) {
this._plotlyLoaded = true;
this.render();
return;
}
 
const script = document.createElement("script");
script.src = "https://cdn.plot.ly/plotly-2.26.0.min.js";
script.onload = () => {
this._plotlyLoaded = true;
this.render();
};
script.onerror = () => {
this.showError("Failed to load Plotly library");
};
document.head.appendChild(script);
}
  render() {
      if (!this._plotlyLoaded) return;
 
      try {
        const loadingDiv = this.shadowRoot.getElementById("loading");
        loadingDiv.style.display = "none";
 
        // Get data from SAC data binding
        const dataBinding = this.dataBinding;
       
        if (!dataBinding || !dataBinding.data || dataBinding.data.length === 0) {
          this.showError("No data available. Please bind a data source to the widget.");
          return;
        }
 
        // Define your expense hierarchy structure
        const expenseStructure = [
          {
            parent: "Chemicals",
            children: [
              { name: "Rooms Chemicals", column: "Quimicos rooms" },
              { name: "AB Chemicals", column: "Quimicos AB" },
              { name: "Pool Chemicals", column: "Quimicos Piscinas" }
            ]
          },
          {
            parent: "Animation",
            children: [
              { name: "Animation - Supplies", column: "Animación - suministros" },
              { name: "Animation Services", column: "Servicio de Animación" }
            ]
          },
          {
            parent: "Security",
            children: [
              { name: "Security Services", column: "Servicio de Seguridad" }
            ]
          },
          {
            parent: "Repair & Conservation",
            children: [
              { name: "Repar./Conser", column: "Repar./Conser" }
            ]
          },
          {
            parent: "Utilities",
            children: [
              { name: "Electricity Kwhe", column: "Electricity Kwhe" },
              { name: "Cold Water kWht", column: "Cold Water KWht" },
              { name: "ACS kWht", column: "ACS KWht" },
              { name: "H2O osmosis m3", column: "H2O osmosis m3" },
              { name: "Fuel (Gas)", column: "Fuel( Gas)" },
              { name: "Fuel (Gasoline and Oil)", column: "Combustible (gasolina y aceites)" }
            ]
          },
          {
            parent: "External Cleaning, Sanitary Control & Waste Management",
            children: [
              { name: "Technical External Cleanings", column: "Limpiezas externas técnicas" },
              { name: "Fumigation Service", column: "Servicio de Fumigación" },
              { name: "Chemical Analysis of Pits", column: "Análisis químicos pozos" },
              { name: "Hygienic-Sanitary Analysis and Audits", column: "Análisis y Auditorías Higienico-sanitarias" },
              { name: "Gardening Service", column: "Servicio de Jardineria" },
              { name: "Toilet and Garbage Removal", column: "Aseo y Extracción Basuras" }
            ]
          }
        ];
 
        // Build treemap data structure
        const labels = [];
        const parents = [];
        const values = [];
        const colors = [];
 
        // Color palette for parent categories
        const colorPalette = [
          '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'
        ];
 
        // Process each parent category
        expenseStructure.forEach((category, catIndex) => {
          let parentTotal = 0;
          const childValues = [];

          // Process children
          category.children.forEach(child => {
            const value = this.getColumnValue(dataBinding.data, child.column);
            childValues.push(value);
            parentTotal += value;
 
            labels.push(child.name);
            parents.push(category.parent);
            values.push(value);
            colors.push(this.lightenColor(colorPalette[catIndex % colorPalette.length], 0.3));
          });
 
          // Add parent (at the beginning for proper hierarchy)
          labels.unshift(category.parent);
          parents.unshift("");
          values.unshift(parentTotal);
          colors.unshift(colorPalette[catIndex % colorPalette.length]);
        });
 
        // Create the treemap
        const data = [{
          type: "treemap",
          labels: labels,
          parents: parents,
          values: values,
          textfont: { size: 16 },
          marker: {
            colors: colors,
            line: { width: 2, color: 'white' }
          },
          hovertemplate: '<b>%{label}</b><br>Value: %{value:,.0f}<br><extra></extra>'
        }];
 
        const layout = {
          margin: { t: 30, l: 0, r: 0, b: 0 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)'
        };
 
        const config = {
          responsive: true,
          displayModeBar: true,
          displaylogo: false
        };
 
        const container = this.shadowRoot.getElementById("chart-container");
        window.Plotly.newPlot(container, data, layout, config);
 
      } catch (error) {
        this.showError("Error rendering chart: " + error.message);
        console.error(error);
      }
    }
 
    getColumnValue(data, columnName) {
      // Sum all values for this column across all rows
      let total = 0;
      data.forEach(row => {
        const value = row[columnName];
        if (value !== undefined && value !== null && !isNaN(value)) {
          total += parseFloat(value);
        }
      });
      return total;
    }
 
    lightenColor(color, percent) {
      // Convert hex to RGB, lighten it, and return hex
      const num = parseInt(color.replace("#",""), 16);
      const amt = Math.round(2.55 * percent * 100);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
        (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
        .toString(16).slice(1);
    }
 
    showError(message) {
      const errorDiv = this.shadowRoot.getElementById("error-msg");
      errorDiv.textContent = message;
      errorDiv.style.display = "block";
    }
 
    // Called when data binding changes
    onCustomWidgetAfterUpdate(changedProps) {
      if (changedProps.includes("dataBinding")) {
        this.render();
      }
    }
  }
 
  customElements.define("com-expense-treemap", ExpenseTreemap);
})();