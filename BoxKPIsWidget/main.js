class NumericKPIWidget extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(4, 1fr)';
        container.style.gap = '10px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.padding = '10px';

        for (let i = 1; i <= 8; i++) {
            const box = document.createElement('div');
            box.style.border = '1px solid #ccc';
            box.style.borderRadius = '5px';
            box.style.padding = '10px';
            box.style.textAlign = 'center';
            box.innerHTML = `<strong>Valor ${i}</strong><br><span id="valor${i}">-</span>`;
            container.appendChild(box);
        }

        shadow.appendChild(container);
        this.container = container;
    }

    onCustomWidgetBeforeUpdate(changedProperties) {}

    onCustomWidgetAfterUpdate(changedProperties) {
        for (let i = 1; i <= 8; i++) {
            const value = this[`valor${i}`];
            const span = this.shadowRoot.getElementById(`valor${i}`);
            if (span) {
                span.textContent = value !== undefined ? value : '-';
            }
        }
    }

    static get observedAttributes() {
        return [];
    }
}

customElements.define('com-example-numerickpiwidget', NumericKPIWidget);