const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');


    if (!tooltipEl) {
        tooltipEl = document.createElement('div');

        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';

        tooltipEl.style.transform = 'translate(-50%, 50%)';

        tooltipEl.style.transition = 'all .1s ease';

        const table = document.createElement('div');
        table.classList.add("tooltip");
        table.style.margin = '0px';

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
};