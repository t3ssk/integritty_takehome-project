import { CountUp } from './countUp.min.js';

const menuToggle = document.getElementById('menu-toggle');
const tooltipToggle = document.getElementById('vaxxed__icon');

/**
 * Toggluje viditelnost menu a styl Menu button
 */
const toggleMenu = () => {
	const burger = document.getElementById('menu-toggle__burger');
	const text = document.getElementById('menu-toggle__text');
	const nav = document.getElementById('nav__links');
	burger.classList.toggle('open');
	nav.classList.toggle('open');
	if (text.innerText === 'MENU') {
		text.innerText = 'Zavřít';
	} else {
		text.innerText = 'Menu';
	}
};

/**
 * Toggluje viditelnost tooltipu
 */
const showTooltip = () => {
	const tooltip = document.getElementById('vaxxed__tooltip');
	if (tooltip.classList[1] === 'open') {
		setTimeout(()=>tooltip.classList.remove('open'), 1000);
	} else {
		tooltip.classList.add('open');
	}
};
/**
 * Vrací zformátovaný date string
 * @param {date} - datum
 */
const formatDate = (date) => {
	const dateArr = date.split('-');
	dateArr.forEach((number) => {
		if (number[0] === 0) number = number[1];
	});
	return `k ${dateArr[2]}. ${dateArr[1]}. ${dateArr[0]}`;
};

/**
 * Vrací počet procent naočkovaných
 * @param {vaxxedPpl} - počet načkovaných
 */
const getPercentage = (vaxxedPpl) => {
	return (vaxxedPpl / 10650000) * 100;
};

/**
 * Vrací naformátovaný počet naočkovaných
 * @param {vaxxedPpl} - počet načkovaných
 */
const formatVaxxed = (vaxxedPpl) => {
	return vaxxedPpl.toLocaleString('cs-CZ');
};

/**
 * Mění data v dokumentu v závislosti na předaných datech
 * @param {percentage} - mění do jaké části bude sahat kónický gradient
 * @param {vaxxedPpl} - mění počet očkovaných
 * @param {date} - mění datum
 */
const updateData = (percentage, vaxxedPpl, date) => {
	const graph = document.getElementById('vaxxed__graph');
	const day = document.getElementById('vaxxed__day');

    const vaxxedCountUp = new CountUp('vaxxed__number', vaxxedPpl, { separator: ' '});
    if (!vaxxedCountUp.error) {
			vaxxedCountUp.start();
		} else {
			console.error(vaxxedCountUp.error);
	}

	day.innerText = date;
    let i = 0
        const interval = setInterval(()=>{
            if(i<percentage)
        { graph.style.background = `conic-gradient(#24AFA1 ${Math.round(i)}%, #DADADA 0)`};
            i++
        },70)
        if(i>=percentage){clearInterval(interval)}
    graph.setAttribute("aria-valuenow", Math.round(percentage))
};

/**
 * Stáhne data z MZCR api
 */
const fetchData = () => {
	let fetchedData;
	fetch(
		'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/zakladni-prehled.json'
	)
		.then((response) => response.json())
		.then((data) => {
			fetchedData = data.data[0];
			const percentage = getPercentage(+fetchedData.ockovane_osoby_celkem);
			const vaxxedPpl = +fetchedData.ockovane_osoby_celkem;
			const date = formatDate(fetchedData.ockovane_osoby_vcerejsi_den_datum);
			if (fetchedData) {
				updateData(percentage, vaxxedPpl, date);
			}
		});
};



menuToggle.addEventListener('click', toggleMenu);
tooltipToggle.addEventListener('mouseenter', showTooltip);
tooltipToggle.addEventListener('mouseout', showTooltip);
window.addEventListener('load', fetchData);
