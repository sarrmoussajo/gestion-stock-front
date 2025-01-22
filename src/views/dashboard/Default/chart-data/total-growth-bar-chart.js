// ===========================|| DASHBOARD - TOTAL GROWTH BAR CHART ||=========================== //

import api from 'utils/api';

var joe;
const dataVentes = async () => {
    try {
        async function getNbBoutiques() {
            const response = await api.get(`admin-dashboard/vente-mois`);
            const { data, status } = response.data;

            if (status === 'success') {
                return data;
            }
        }
        return await getNbBoutiques();
    } catch (error) {
        console.log(error);
    }
};

const dataMode = dataVentes().then((valeur) => {
    joe = valeur;
});
console.log(joe);

const chartData = {
    height: 480,
    type: 'bar',
    options: {
        chart: {
            id: 'bar-chart',
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%'
            }
        },
        xaxis: {
            type: 'category',
            categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc']
        },
        legend: {
            show: true,
            fontSize: '14px',
            fontFamily: `'Roboto', sans-serif`,
            position: 'bottom',
            offsetX: 20,
            labels: {
                useSeriesColors: false
            },
            markers: {
                width: 16,
                height: 16,
                radius: 5
            },
            itemMargin: {
                horizontal: 15,
                vertical: 8
            }
        },
        fill: {
            type: 'solid'
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: true
        }
    },
    series: [
        {
            name: 'Investment',
            data: [35, 500, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
            //[35, 500, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
        }
        // {
        //     name: 'Loss',
        //     data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
        // },
        // {
        //     name: 'Profit',
        //     data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
        // },
        // {
        //     name: 'Maintenance',
        //     data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
        // }
    ]
};
export default chartData;
