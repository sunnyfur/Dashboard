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

// const externalTooltipHandler = (context) => {
//     // Tooltip Element
//     const {
//         chart,
//         tooltip
//     } = context;
//     const tooltipEl = getOrCreateTooltip(chart);

//     // Hide if no tooltip
//     if (tooltip.opacity === 0) {
//         tooltipEl.style.opacity = 0;
//         return;
//     }


//     // Set Text
//     if (tooltip.body) {
//         const titleLines = tooltip.title || [];
//         const bodyLines = tooltip.body.map(b => b.lines);

//         const tableHead = document.createElement('div');
//         tableHead.classList.add("tooltip__text");
//         tableHead.classList.add("tooltip__text_bottom");

//         titleLines.forEach(title => {
//             const tr = document.createElement('p');
//             tr.style.borderWidth = 0;

//             const th = document.createElement('p');
//             th.style.borderWidth = 0;

//             let st = getDay(title);
//             console.log(st);
//             const text = document.createTextNode(title);
//             th.innerHTML = text;
//             // th.appendChild(text);
//             tr.appendChild(th);
//             tableHead.appendChild(tr);
//         });

//         const tableBody = document.createElement('div');
//         tableBody.classList.add("tooltip__text");
//         bodyLines.forEach((body, i) => {

//             const valP = document.createElement('p');
//             valP.classList.add("tooltip__header");
//             const text = document.createTextNode(body);
//             // console.log(context);
//             // console.log();
//             valP.innerText = tooltip.dataPoints[i].parsed.y;

//             const valH = document.createElement('p');
//             valH.classList.add("tooltip__subheader");
//             valH.innerHTML = tooltip.dataPoints[i].dataset.label;

//             tableBody.appendChild(valP);
//             tableBody.appendChild(valH);
//         });

//         const tableRoot = tooltipEl.querySelector('.tooltip');

//         // Remove old children
//         while (tableRoot.firstChild) {
//             tableRoot.firstChild.remove();
//         }

//         // Add new children
//         tableRoot.appendChild(tableHead);
//         tableRoot.appendChild(tableBody);
//     }

//     const {
//         offsetLeft: positionX,
//         offsetTop: positionY
//     } = chart.canvas;

//     // Display, position, and set styles for font
//     tooltipEl.style.opacity = 1;
//     tooltipEl.style.left = positionX + tooltip.caretX + 'px';
//     tooltipEl.style.top = positionY + 'px';
//     tooltipEl.style.font = tooltip.options.bodyFont.string;
//     // tooltipEl.style.height = tooltipEl.parentNode.height + 'px';
//     tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
// };