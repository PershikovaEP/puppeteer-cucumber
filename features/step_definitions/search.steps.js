const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { clickElement, getText } = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
  await this.page.goto("http://qamid.tmweb.ru/client/");
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given(
  "user selects movie for {string} at {string}",
  async function (day, time) {
    let selectedDay = 0; //для примера берем два дня завтра и послезавтра
    if (day === "tomorrow") {
      selectedDay = "a:nth-child(2)";
    } else {
      selectedDay = "a:nth-child(3)";
    }

    let selectedTime = 0; //для примера также время из трех тестов 23.45, 14.00, 10.00
    if (time === "23:45") {
      selectedTime = "section:nth-child(1) > div:nth-child(3) > ul > li";
    } else if (time === "14:00") {
      selectedTime = "section:nth-child(2) > div:nth-child(2) > ul > li > a";
    } else {
      selectedTime = "section:nth-child(2) > div:nth-child(3) > ul > li > a";
    }

    await clickElement(this.page, selectedDay);
    await clickElement(this.page, selectedTime);
  }
);

Given(
  "user booked for Movie 3 of 1 ticket for {string} at {string} seat {string}",
  { timeout: 30000 },
  async function (day, time, seat) {
    let selectedDay = 0; //для примера берем два дня завтра и послезавтра
    if (day === "tomorrow") {
      selectedDay = "a:nth-child(2)";
    } else {
      selectedDay = "a:nth-child(3)";
    }

    let selectedTime = 0; //для примера также время из трех тестов 23.45, 14.00, 10.00
    if (time === "23:45") {
      selectedTime = "section:nth-child(1) > div:nth-child(3) > ul > li";
    } else if (time === "14:00") {
      selectedTime = "section:nth-child(2) > div:nth-child(2) > ul > li > a";
    } else {
      selectedTime = "section:nth-child(2) > div:nth-child(3) > ul > li > a";
    }

    let selectedSeat = 0;
    if (seat === "1/6") {
      selectedSeat = "div:nth-child(1) > span:nth-child(6)";
    }

    await clickElement(this.page, selectedDay);
    await clickElement(this.page, selectedTime);
  }
);

When("user books one ticket at seat {string}", async function (seat) {
  //только для места 3/1
  let selectedSeat = 0;
  if (seat === "3/1") {
    selectedSeat = "div:nth-child(3) > span:nth-child(1)";
  }

  await clickElement(this.page, selectedSeat);
  await clickElement(this.page, "button");
});

When(
  "user books two tickets at seats {string} and {string}",
  async function (seat1, seat2) {
    //только для мест 3/5, 3/6
    let selectedSeat1 = 0;
    if (seat1 === "3/5") {
      selectedSeat1 =
        "div:nth-child(3) > span.buying-scheme__chair.buying-scheme__chair_vip";
    }
    let selectedSeat2 = 0;
    if (seat2 === "3/6") {
      selectedSeat2 = "div:nth-child(3) > span:nth-child(6)";
    }

    await clickElement(this.page, selectedSeat1);
    await clickElement(this.page, selectedSeat2);
    await clickElement(this.page, "button");
  }
);

When(
  "user is booking an already booked for Movie 3 of 1 ticket for {string} at {string} seat {string}",
  { timeout: 30000 },
  async function (day, time, seat) {
    let selectedDay = 0; //для примера берем два дня завтра и послезавтра
    if (day === "tomorrow") {
      selectedDay = "a:nth-child(2)";
    } else {
      selectedDay = "a:nth-child(3)";
    }

    let selectedTime = 0; //для примера также время из трех тестов 23.45, 14.00, 10.00
    if (time === "23:45") {
      selectedTime = "section:nth-child(1) > div:nth-child(3) > ul > li";
    } else if (time === "14:00") {
      selectedTime = "section:nth-child(2) > div:nth-child(2) > ul > li > a";
    } else {
      selectedTime = "section:nth-child(2) > div:nth-child(3) > ul > li > a";
    }

    let selectedSeat = 0;
    if (seat === "1/6") {
      selectedSeat = "div:nth-child(1) > span:nth-child(6)";
    }

    await this.page.goto("http://qamid.tmweb.ru/client/");
    await clickElement(this.page, selectedDay);
    await clickElement(this.page, selectedTime);
    await clickElement(this.page, selectedSeat);
    await clickElement(this.page, "button");
  }
);

Then(
  "user has booked the next tickets: seat {string} at {string}",
  async function (seat, time) {
    const actualH2 = await getText(this.page, "h2");
    const actualPlace = await getText(this.page, "p:nth-child(2) > span");
    const actualTime = await getText(this.page, "p:nth-child(5) > span");
    expect(actualH2).equal("Вы выбрали билеты:");
    expect(actualPlace).equal(seat);
    expect(actualTime).equal(time);
  }
);

Then(
  "seat {string} is unclickable, book button is disabled, user is left on the movie booking page {string}",
  async function (seat, movie) {
    let selectedSeat = 0;
    if (seat === "1/6") {
      selectedSeat = "div:nth-child(1) > span:nth-child(6)";
    }

    const actual = await getText(this.page, "h2");
    const actualSeat = await this.page.$eval(selectedSeat, (link) =>
      link.getAttribute("class")
    );
    const actualButton = await this.page.$eval("button", (link) =>
      link.getAttribute("disabled")
    );
    expect(actual).equal(movie);
    expect(actualSeat).contain("buying-scheme__chair_taken");
    expect(actualButton).equal("true");
  }
);
