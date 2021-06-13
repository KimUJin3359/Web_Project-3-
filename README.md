# Web_Project-3-
#### mirroring chrome momentum

### [PROJECT3 배포파일](https://kimujin3359.github.io/Web_Project-3-/)

![캡처_1_](https://user-images.githubusercontent.com/50474972/111037510-b64e1300-8467-11eb-8c02-709531192bb3.JPG)
![캡처2](https://user-images.githubusercontent.com/50474972/111037920-a20b1580-8469-11eb-88e7-9cfcb1dcabd5.JPG)

### [index.html](https://github.com/KimUJin3359/Web_Project-3-/blob/master/index.html)
- using HTML, CSS

### [index.js](https://github.com/KimUJin3359/Web_Project-3-/blob/master/index.js)
#### Loading a Background
```
async function setRenderBackground() {
    //Binary Large OBject를 다룰 때 사용
    const result = await axios.get("https://picsum.photos/1280/720", {
        responseType: "blob"
    });
    // img에 url로 src="url"
    const data = URL.createObjectURL(result.data);
    document.querySelector("body").style.backgroundImage = `url(${data})`;
};
```

#### Setting a Clock
- 현재의 시각을 24시각에 따라 표시
- 현재의 시간에 따른 Morning, Afternoon, Evening 표시
```
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
```

#### Setting a memo
- Local Storage : Web 브라우저에 저장하며, 새로 불러와도 날라가지 않음
- Session Storage : 새로 불러와도 데이터 유지(F5), 새로 껐다키면 데이터 손실
- Coockies : 로그인 정보, 세션 등을 저장
```
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
```

#### Loading a memo
- 내장 local storage로 부터 메모를 받아옴
```
function getMemo() {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue;
};
```

#### Getting a Weather with API
- API로 날씨를 받아옴
```
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
```

#### Formatting a Weather
- 날씨 정보를 card 형태로 formatting
- HTML형태로 반환
```
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
```

#### Getting a Weather
- 위도, 경도를 받아옴(위치 접근 허용 시)
- 6시 기준 날씨만을 받아옴(reduce 함수 사용)
- HTML의 modal 부분에 이미지 및 Formatting한 HTML코드 삽입
```
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
```





