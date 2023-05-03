console.log("hej")

class Character {
    constructor(name, eyeColor, gender, height, mass, hairColor, skinColor, movies, pictureUrl) {
        this.name = name;
        this.eyeColor = eyeColor;
        this.gender = gender;
        this.height = Number(height);
        this.mass = Number(mass);
        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.eyeColor = eyeColor;
        this.movies = movies;
        this.pictureUrl = pictureUrl;
    }

    async getFirstDate(name, array) {
        let data = await getData(array);
        let firstDateDiv = document.createElement("div");
        firstDateDiv.innerHTML += `<strong>${name}</strong> first appears in a movie ${data.release_date}<br>`
        extraInfoDiv1.append(firstDateDiv)
    }

    /*Hämtar data från alla filmer och skriver ut filmens namn */
    async getMovieTitles(name, array) {
        let movieDiv = document.createElement("div")
        movieDiv.innerHTML = `<strong>${name}</strong> has appeard in following movies: <br>`
        array.forEach(async (char) => {
            let data = await getData(char);
            movieDiv.innerHTML += `- ${data.title}<br>`
            extraInfoDiv2.append(movieDiv)
        });
    }

    async compareHomePlanets(name1, url1, name2, url2) {
        let homePlanet1Data = await getData(url1);
        let homePlanet2Data = await getData(url2);
        let planet1Name = homePlanet1Data.name;
        let planet2Name = homePlanet2Data.name;
        let planetDiv = document.createElement("div");
        planetDiv.innerHTML += `<strong>${name1}</strong> comes from planet ${planet1Name} and <strong>${name2}</strong> comes from planet ${planet2Name}<br>`
        if (planet1Name === planet2Name) {
            planetDiv.innerHTML += `<br><strong>They are from the same planet!!!!</strong>`
        }
        extraInfoDiv3.append(planetDiv)
    }

    /*Deklarerar fordon-pris och fordon-namn. För varje url som finns i länken hämtas cost_in_credits, sedan uppdateras cost och shipName för varje loop, om det nya värdet i den iterationen är en högre siffra. Om pris på fordon är unknown räknas den ej med och om namn på fordonet är unknown räknas det som inget starships för uppgiften var ju att skriva ut fordonts namn */
    async compareVehiclesAndShips(name, array) {
        try {
            let cost = 0;
            let shipName = "";
            for (let i = 0; i < array.length; i++) {
                let data = await getData(array[i]);
                if (data.cost_in_credits || data.cost_in_credits !== "unknown" && parseInt(data.cost_in_credits) > cost) {
                    cost = parseInt(data.cost_in_credits);
                    shipName = data.name;
                }
            }
            if (shipName === "" || shipName === "unknown") {
                extraInfoDiv4.innerHTML += `<strong>${name}</strong> does not own any starship or vehicle<br>`
            } else {
                extraInfoDiv4.innerHTML += `The most expensive vehicle or ship <strong>${name}</strong> own is ${shipName}<br>`;
            }
        } catch (error) {
            extraInfoDiv4.innerHTML += "An error occurred while retrieving vehicle/ship data.";
        }
    }

}

let getData = async (url) => {
    let response = await fetch(url);
    let json = await response.json();
    return json;
};

let btn1Counter = 0;
let btn2Counter = 0;
let selectedCharacters1 = [];
let selectedCharacters2 = [];

let h2 = document.querySelector("#h2");
let ulContainer = document.querySelector(".ul-container");

let list1 = document.querySelector("#ul1");
let list2 = document.querySelector("#ul2");

let btnContainer = document.querySelector(".button-container");

let firstInfoDiv = document.querySelector(".first-info-div");
let secondInfoDiv = document.querySelector(".second-info-div");

let extraInfoDiv1 = document.querySelector("#extraInfoDiv1");
let extraInfoDiv2 = document.querySelector("#extraInfoDiv2");
let extraInfoDiv3 = document.querySelector("#extraInfoDiv3");
let extraInfoDiv4 = document.querySelector("#extraInfoDiv4");

/*Hämtar alla 10 karaktärer från API:ets första sida, för varje person kallas funktionen createList */
let getAllCharacters = async () => {
    let characters = await getData('https://swapi.dev/api/people/');
    characters.results.forEach((person) => {
        createList(person);
    })
};

/*För varje person skapas 2 li-element och 2 radiobuttons i varsina listor. Ger radiobuttons olika namn för att gruppera. Sedan skapas eventListeners för varje knapp och för varje click pushas radioBtn.value(karaktärens egna url)in i en array. 

Varje lista med karaktärernas namn, har en egen chosenCharacters array, som det valda värdet pushas in i. Om vi klickar på en radioBtn i samma lista mer än 1 gång, tas det första indexet i arrayen bort(det föregånga radioBtn-valet) och tillslut har vi 2 arrayer med en karaktärs url i varje, karaktären är den man valt sist*/

// let isTeacher = document.querySelector("#teacherCheck").checked;

let createList = (person) => {
    let radioBtn1 = document.createElement("input");
    radioBtn1.type = "radio";
    radioBtn1.value = person.url;
    radioBtn1.setAttribute("name", "group1");

    let radioBtn2 = document.createElement("input");
    radioBtn2.type = "radio";
    radioBtn2.value = person.url;
    radioBtn2.setAttribute("name", "group2");

    let li1 = document.createElement("li");
    let li2 = document.createElement("li");
    li1.innerHTML = `${person.name}`;
    li2.innerHTML = `${person.name}`;
    li1.prepend(radioBtn1);
    li2.prepend(radioBtn2);
    list1.append(li1);
    list2.append(li2);

    radioBtn1.addEventListener("click", function () {
        btn1Counter++;
        selectedCharacters1.push(radioBtn1.value);
        if (btn1Counter > 1) {
            btn1Counter--;
            selectedCharacters1.shift();
        }
        showData();
    })

    radioBtn2.addEventListener("click", function () {
        btn2Counter++;
        selectedCharacters2.push(radioBtn2.value);
        if (btn2Counter > 1) {
            btn2Counter--;
            selectedCharacters2.shift();
        }
        showData();
    })

}

getAllCharacters();


let showData = () => {
    let infoArray = [];

    //Slår ihop de två valda karaktärerna i en array. 
    let selectedCharacters = selectedCharacters1.concat(selectedCharacters2);
    //När man valt 2 karaktärer skapas Next-knappen
    //I.o.m att showData() kallas två gånger, tar vi bort showData knappen om den redan finns.
    if (btn1Counter === 1 && btn2Counter === 1) {
        let existingShowDataBtn = document.getElementById("showDataBtn");
        if (existingShowDataBtn) {
            existingShowDataBtn.remove();
        }

        if (JSON.stringify(selectedCharacters1) === JSON.stringify(selectedCharacters2)) {
            firstInfoDiv.innerText = "Please choose 2 different characters"
        } else {
            firstInfoDiv.innerText = "";
            let showDataBtn = document.createElement("button");
            showDataBtn.id = "showDataBtn";
            showDataBtn.innerText = "NEXT";
            btnContainer.append(showDataBtn);

            showDataBtn.addEventListener("click", async () => {
                ulContainer.innerText = "";
                btnContainer.innerText = "";
                h2.innerText = "Your chosen characters are.."
                /*Hämtar karaktärernas data från deras url och pushar in datan i en ny array som heter infoArray. 
                I loopen skapas också ett id utifrån vilken siffra karaktären har sist i sin url genom split och splice.*/
                selectedCharacters.forEach(async (char) => {
                    let info = await getData(char);
                    let id = info.url.split("/").splice(-2, 1);
                    let imgUrl = `assets/images/${id}.png`;
                    info.pictureUrl = imgUrl;
                    infoArray.push(info);

                    /*För varje karaktär skapas en instans av Character-klassen och så skriver vi ut namn och tillhörande bild.*/
                    let chosenCharacter = new Character(info.name, info.eye_color, info.gender, info.height, info.mass, info.hair_color, info.skin_color, info.films, info.pictureUrl);

                    let infoDiv = document.createElement("div");
                    infoDiv.setAttribute("class", "characterDiv");
                    infoDiv.innerHTML = `<img src="${chosenCharacter.pictureUrl}" height="400" ></img><strong>${chosenCharacter.name}</strong>`
                    ulContainer.append(infoDiv);
                })

                /*Tillslut innehåller vår infoArray data från bägge valda karaktärerna vilket skickas iväg med compareCharacters-funktionen */
                let compareBtn = document.createElement("button");
                compareBtn.innerText = "Compare Characters";
                btnContainer.append(compareBtn);

                compareBtn.addEventListener("click", function () {
                    compareCharacters(infoArray);
                })
            })
        }
    }
}

/*Denna funktion blir kallad i funktionen compareCharacters, nedanför. För varje person skapas ny instans av klassen och infon skrivs ut. Returnerar instanserna som skapats*/
let createCharacter = (person, element) => {
    let character = new Character(person.name, person.eye_color, person.gender, person.height, person.mass, person.hair_color, person.skin_color, person.films, person.pictureUrl);

    element.innerHTML = `<strong>Eyecolor: </strong>${character.eyeColor}<br><strong>Gender: </strong>${character.gender}<br><strong>Height: </strong>${character.height} cm<br><strong>Weight: </strong>${character.mass} kg<br><strong>Haircolor: </strong>${character.hairColor}<br><strong>SkinColor: </strong>${character.skinColor}<br><strong>Number of movies </strong>${character.name}<br> has appeared in: ${character.movies.length}`;

    firstInfoDiv.append(element);
    return character;
}

/*Utifrån infoArray tilldelas person1 och person2 sin info och utifrån dessa 2 kallas funktionen createCharacters. Skickar även med diven som instansen av klassen ska appendas i*/
let compareCharacters = (infoArray) => {
    btnContainer.innerText = "";
    h2.innerText = "Let's compare your chosen characters!"

    let person1 = infoArray[0];
    let person2 = infoArray[1];



    let div3 = document.createElement("div");
    let div4 = document.createElement("div");
    div3.setAttribute("class", "moreInfo");
    div4.setAttribute("class", "moreInfo");

    let character1 = createCharacter(person1, div3);
    let character2 = createCharacter(person2, div4);

    /*Jämför instanserna med varandra */
    if (character1.height > character2.height) {
        secondInfoDiv.innerHTML += (`- ${character1.name} is taller than ${character2.name}<br>`);
    } else if (character1.height < character2.height) {
        secondInfoDiv.innerHTML += (`- ${character2.name} is taller than ${character1.name}<br>`);
    } else {
        secondInfoDiv.innerHTML += (`- ${character1.name} and ${character2.name} are the same height<br>`);
    }


    if (character1.mass > character2.mass) {
        secondInfoDiv.innerHTML += (`- ${character1.name} weights more than ${character2.name}<br>`);
    } else if (character2.mass > character1.mass) {
        secondInfoDiv.innerHTML += (`- ${character2.name} weights more than ${character1.name}<br>`);
    } else {
        secondInfoDiv.innerHTML += (`- ${character1.name} and ${character2.name} weights the same<br>`);
    }


    if (character1.movies.length > character2.movies.length) {
        secondInfoDiv.innerHTML += (`- ${character1.name} has appeard in more movies then ${character2.name}<br>`);
    } else if (character2.movies.length > character1.movies.length) {
        secondInfoDiv.innerHTML += (`- ${character2.name} has appeard in more movies then ${character1.name}<br>`);
    } else {
        secondInfoDiv.innerHTML += (`- ${character1.name} and ${character2.name} has appeard in the same amount of movies<br>`);
    }


    if (character1.gender === character2.gender) {
        secondInfoDiv.innerHTML += (`- ${character1.name} and ${character2.name} have the same gender<br>`);
    } else {
        secondInfoDiv.innerHTML += (`- ${character1.name} and ${character2.name} are different genders<br>`);
    }


    if (character1.hairColor === character2.hairColor) {
        secondInfoDiv.innerHTML += (`- ${character1.name} and ${character2.name} have the same haircolor<br>`);
    } else {
        secondInfoDiv.innerHTML += (`- ${character1.name} and ${character2.name} have different haircolors<br>`);
    }


    if (character1.skinColor === character2.skinColor) {
        secondInfoDiv.innerHTML += (`- ${character1.name} and ${character2.name} have the same skincolor<br>`);
    } else {
        secondInfoDiv.innerHTML += (`- ${character1.name} and ${character2.name} have different skincolors<br>`);
    }

    /*Skapar alla knappar för metoderna. 
    I.o.m. att det skapas nya div:ar när metoderna körs har jag lagt till counters som räknar om metoden anropats eller ej, annars skulle infon från metoderna fyllas på hur långt som helst för varje knapptryck. Gick ej att tömma diven a.k.a. köra med ex)extraInfoDiv1 = ""; för i samma div har jag appendat själva knappen.. 

    I metoderna skickar jag med namn och en url alt. en array med flera urls*/
    let dateBtn = document.createElement("button");
    dateBtn.innerText = "When did the characters first appear in a movie?"
    extraInfoDiv1.append(dateBtn);
    let getDateCounter = 0;
    dateBtn.addEventListener("click", function () {
        getDateCounter++;
        if (getDateCounter === 1) {
            character1.getFirstDate(person1.name, person1.films[0])
            character2.getFirstDate(person2.name, person2.films[0])
        }
    });


    let movieTitleBtn = document.createElement("button");
    movieTitleBtn.innerText = "Wich movies did these characters appear in?"
    extraInfoDiv2.append(movieTitleBtn);
    let getTitleCounter = 0;
    movieTitleBtn.addEventListener("click", function () {
        getTitleCounter++;
        if (getTitleCounter === 1) {
            character1.getMovieTitles(person1.name, person1.films)
            character2.getMovieTitles(person2.name, person2.films)
        }
    })

    let homePlanetBtn = document.createElement("button");
    homePlanetBtn.innerText = "Wich homeplanet does the characters have?"
    extraInfoDiv3.append(homePlanetBtn);
    let planetCounter = 0;
    homePlanetBtn.addEventListener("click", function () {
        planetCounter++;
        if (planetCounter === 1) {
            character1.compareHomePlanets(person1.name, person1.homeworld, person2.name, person2.homeworld);
        }

    })

    /*Slår ihop starships-url:arna och vehicles-url:arna till 1 array för varje person som sedan loopas igenom i klassens metod*/
    let vehiclesAndShips1 = person1.starships.concat(person1.vehicles);
    let vehiclesAndShips2 = person2.starships.concat(person2.vehicles);

    let fordonBtn = document.createElement("button");
    fordonBtn.innerText = "The characters most expensive vehicle or starship"
    extraInfoDiv4.append(fordonBtn);
    fordonBtn.addEventListener("click", function () {
        character1.compareVehiclesAndShips(person1.name, vehiclesAndShips1)
        character2.compareVehiclesAndShips(person2.name, vehiclesAndShips2)
    })

}
