const user = "U-JIN";
const myKey = "Your key";

async function setRenderBackground() {
    //Binary Large OBject를 다룰 때 사용
    const result = await axios.get("https://picsum.photos/1280/720", {
        responseType: "blob"
    });
    // img에 url로 src="url"
    const data = URL.createObjectURL(result.data);
    document.querySelector("body").style.backgroundImage = `url(${data})`;
};

//시계 설정 함수
function setTime() {
    const timer = document.querySelector(".timer");
    const timerContent = document.querySelector(".timer-content");
    setInterval(() => {
        const date = new Date();
        let hours = date.getHours();
        if (Number(hours) < 10) {
            hours = '0' + hours;
        }
        let minutes = date.getMinutes();
        if (Number(minutes) < 10) {
            minutes = '0' + minutes;
        }
        let seconds = date.getSeconds();
        if (Number(seconds) < 10) {
            seconds = '0' + seconds;
        }
        timer.textContent = `${hours}:${minutes}:${seconds}`;
        if (Number(hours) < 12) {
            timerContent.textContent = `Good Morning ${user}`;
        }
        else if (Number(hours) < 18) {
            timerContent.textContent = `Good Afternoon ${user}`;
        }
        else {
            timerContent.textContent = `Good Evening ${user}`;
        }

    });
};

//메모 불러오기
function getMemo() {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue;
};

//F12 -> Application
//Local Stroage -> web browser단에 저장 새로 불러와도 날라가지않음
//Session Storage -> 새로 불러와도 날라가지 않지만, 새로 껏다키면 없음
//Coockeds -> [무상태성](요청 -> 응답), 로그인 정보, 세션 등 저장
//메모 저장(Local Storage 사용)
function setMemo() {
    const meomInput = document.querySelector(".memo-input");
    meomInput.addEventListener("keyup", function (e) {
        //null, "", undefined, 0 -> false
        if (e.code === "Enter" && e.target.value) {
            localStorage.setItem("todo", e.target.value);
            getMemo();
            //initialize memo-input
            meomInput.value = "";
        }
    });
};

//메모 삭제
function deleteMemo() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("memo")) {
            //localStorage item 삭제
            localStorage.removeItem("todo");
            //memo html 비워주기
            e.target.textContent = "";
        }
    });
};

function setMemos() {
    setMemo();
    getMemo();
    deleteMemo();
};

//위도, 경도를 promise로 가져옥
function getPosition(options) {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej, options);
    });
};

//날씨 가져오기
async function getWeather(lat, lon) {
    //위도, 경도가 있는 경우
    if (lat && lon) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myKey}`);
        return (data);
    }
    //위도, 경도가 없는 경우
    const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=${myKey}`);
    return (data);
};

function matchIcon(weatherData) {
    if (weatherData === "Clear")    return './images/039-sun.png';
    if (weatherData === "Clouds")    return './images/001-cloud.png';
    if (weatherData === "Rainy")    return './images/003-rainy.png';
    if (weatherData === "Snow")    return './images/006-snowy.png';
    if (weatherData === "Thunderstorm")    return './images/008-storm.png';
    if (weatherData === "Drizzle")    return './images/031-snowflake.png';
    if (weatherData === "Atmosphere")    return './images/033-hurricane.png';
}

//날씨 데이터 가져온 것 가공
function weatherWrapperComponent(li) {
    const changeToCelsius = (temp) => {
        return (temp - 273.15).toFixed(1);
    }
    return `
    <div class="card shadow-sm bg-transparent mb-3 m-2 flex-grow-1">
        <div class="card-header text-white text-center">
            ${li.dt_txt.split(" ")[0]} <span>오후 6시</span>
        </div>
        <div class="card-body d-flex">
            <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                <h5 class="card-title">
                    ${li.weather[0].main}
                </h5>
                <img src="${matchIcon(li.weather[0].main)}" width="60px" height="60px"/>
                <p class="card-text">${changeToCelsius(li.main.temp)}</p>
            </div>
        </div>
    </div>
    `;
};

//위도와 경도를 받아서 데이터 가져오기
async function renderWearher() {
    let lat;
    let lon;
    try {
        const position = await getPosition();
        lat = position.coords.latitude;
        lon = position.coords.longitude;
    } catch (err) {
        console.log(err);
    } finally {
        //try, catch와 상관없이 실행
        const weatherResponse = await getWeather(lat, lon);
        const weatherData = weatherResponse.data;
        weatherList = weatherData.list.reduce((acc, cur) => {
            if (cur.dt_txt.indexOf("18:00:00") > 0) {
                acc.push(cur);
            }
            return (acc);
        }, []);
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = weatherList.map((li) => {
            return weatherWrapperComponent(li);
        }).join("");
        const modalButton = document.querySelector(".modal-button");
        modalButton.style.backgroundImage = "url(" + matchIcon(weatherList[0].weather[0].main) + ")";
    }
}

(function () {
    setRenderBackground();
    //약 5초마다 해당 함수 실행
    setInterval(() => {
        setRenderBackground();
    }, 5000);
    setTime();
    setMemos();
    renderWearher();
})();
