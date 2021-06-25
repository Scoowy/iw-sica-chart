"use strict";

const data = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)"
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)"
      ],
      borderWidth: 1
    }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const chartCanvas = document.querySelector("#chartCanvas");
  const ctx = chartCanvas.getContext("2d");
  const loader = document.querySelector("#loader");

  // Obtenemos la información
  getData().then(data => {
    const dataProccessed = proccessData(data);

    loader.classList.toggle("is-hidden");
    chartCanvas.classList.toggle("is-hidden");

    const chart = new Chart(ctx, {
      type: "line",
      data: dataProccessed,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Publicación de libros desde 1993 a la fecha"
          }
        },
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  });
});

async function getData() {
  try {
    const response = await fetch("./../data/sica-data-libros.json", {
      method: "GET",
      mode: "same-origin"
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

function proccessData(data) {
  let booksPerYear = {
    labels: [],
    datasets: [
      {
        label: "Nro. de libros",
        data: [],
        fill: false,
        borderColor: "rgb(75,192,192)",
        tension: 0.35
      }
    ]
  };

  console.log(data);

  const numBooks = data.count;
  const books = data.data;

  let years = [];

  books.forEach(book => {
    if (!years.includes(book.year)) years.push(book.year);
  });

  years.sort((a, b) => a - b);
  booksPerYear.labels = years;

  let datas = {};

  years.forEach(key => {
    datas[key] = 0;
  });

  books.forEach(book => {
    if (book.status === "publicado") {
      datas[book.year] = datas[book.year] + 1;
    }
  });

  booksPerYear.datasets[0].data = Object.values(datas);

  return booksPerYear;
}
