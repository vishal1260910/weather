// Create card-deck container
var container = document.createElement("div");
container.setAttribute("class", "card-deck");

// Fetch country data from the REST Countries API
async function makeRequest() {
    try {
        const country_req = await fetch("https://restcountries.com/v2/all");
        const parsed_countryreq = await country_req.json();

        for (let i = 0; i < parsed_countryreq.length; i++) {
            const country = parsed_countryreq[i];
            const { name, capital, region, alpha3Code, latlng, flags } = country;
            const [lat, long] = latlng || [0, 0]; // Handle cases where latlng is missing
            const flag_url = flags.svg || flags.png;

            // Create card structure
            const column = document.createElement("div");
            column.setAttribute("class", "col-sm-4");

            const card = document.createElement("div");
            card.setAttribute("class", "card mb-3 mt-3");
            card.style.height = "550px";
            card.style.borderBottomLeftRadius = "100px";
            card.style.borderBottomRightRadius = "100px";

            // Card header
            const card_header = document.createElement("h4");
            card_header.setAttribute("class", "card-header");
            card_header.innerHTML = name;
            card_header.style.textAlign = "center";

            // Flag image
            const image = document.createElement("img");
            image.setAttribute("src", flag_url);
            image.setAttribute("class", "card-img-top");

            // Card body
            const card_body = document.createElement("div");
            card_body.setAttribute("class", "card-body");
            card_body.style.textAlign = "center";

            const details = [
                `Capital: ${capital || "N/A"}`,
                `Region: ${region || "N/A"}`,
                `Country Code: ${alpha3Code || "N/A"}`,
                `Lat, Long: ${lat || "N/A"}, ${long || "N/A"}`,
            ];

            details.forEach(detail => {
                const p = document.createElement("h5");
                p.setAttribute("class", "card-text");
                p.innerHTML = detail;
                card_body.append(p);
            });

            // Weather button
            const button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("class", "btn btn-primary mt-1");
            button.setAttribute("data-toggle", "modal");
            button.setAttribute("data-target", `#exampleModal${i}`);
            button.innerHTML = "Click for Weather";
            button.addEventListener("click", () => getWeather(lat, long, i));

            card_body.append(button);
            card.append(card_header, image, card_body);
            column.append(card);
            container.append(column);
        }
    } catch (error) {
        console.error("Error occurred while fetching country data:", error);
    }
}

// Fetch weather details
async function getWeather(lat, long, i) {
    try {
        const weather_req = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=267f91f8f416ec4849e7432d9d7324e2`
        );
        const parsed_weather = await weather_req.json();

        const { main, weather, wind } = parsed_weather;
        const details = [
            `Climate: ${weather[0].description}`,
            `Max Temp: ${main.temp_max} K`,
            `Min Temp: ${main.temp_min} K`,
            `Humidity: ${main.humidity}%`,
            `Pressure: ${main.pressure} hPa`,
            `Temperature: ${main.temp} K`,
            `Wind Speed: ${wind.speed} m/s`,
        ];

        // Create modal structure
        const modal = document.createElement("div");
        modal.setAttribute("class", "modal fade");
        modal.setAttribute("id", `exampleModal${i}`);
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("aria-labelledby", "exampleModalLabel");
        modal.setAttribute("aria-hidden", "true");

        const modal_dialogue = document.createElement("div");
        modal_dialogue.setAttribute("class", "modal-dialog");

        const modal_content = document.createElement("div");
        modal_content.setAttribute("class", "modal-content");

        // Modal header
        const modal_header = document.createElement("div");
        modal_header.setAttribute("class", "modal-header");

        const modal_title = document.createElement("h5");
        modal_title.setAttribute("class", "modal-title");
        modal_title.innerHTML = "Weather Details";

        const close_button = document.createElement("button");
        close_button.setAttribute("type", "button");
        close_button.setAttribute("class", "close");
        close_button.setAttribute("data-dismiss", "modal");
        close_button.innerHTML = "&times;";

        modal_header.append(modal_title, close_button);

        // Modal body
        const modal_body = document.createElement("div");
        modal_body.setAttribute("class", "modal-body");

        const ul = document.createElement("ul");
        ul.setAttribute("class", "list-group list-group-flush");

        details.forEach(detail => {
            const li = document.createElement("li");
            li.setAttribute("class", "list-group-item");
            li.innerHTML = detail;
            ul.append(li);
        });

        modal_body.append(ul);

        // Modal footer
        const modal_footer = document.createElement("div");
        modal_footer.setAttribute("class", "modal-footer");

        const close_footer_button = document.createElement("button");
        close_footer_button.setAttribute("type", "button");
        close_footer_button.setAttribute("class", "btn btn-primary");
        close_footer_button.setAttribute("data-dismiss", "modal");
        close_footer_button.innerHTML = "Close";

        modal_footer.append(close_footer_button);
        modal_content.append(modal_header, modal_body, modal_footer);
        modal_dialogue.append(modal_content);
        modal.append(modal_dialogue);

        document.body.append(modal);
    } catch (error) {
        console.error("Error occurred while fetching weather data:", error);
    }
}

// Run script
makeRequest();
document.body.append(container);
