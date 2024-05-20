const input = document.querySelector('input')
const button = document.querySelector('button')
const cityName = document.querySelector('.city-name')
const warning = document.querySelector('.warning')
const photo = document.querySelector('.photo')
const temperature = document.querySelector('.temperature')


const day = document.querySelector('.day')
const weather = document.querySelector('.weather')
const temperatureDay = document.querySelector('.temperature--day')
const temperatureNight = document.querySelector('.temperature--night')

const day2 = document.querySelector('.day2')
const weather2 = document.querySelector('.weather2')
const temperatureDay2 = document.querySelector('.temperature--day2')
const temperatureNight2 = document.querySelector('.temperature--night2')

const day3 = document.querySelector('.day3')
const weather3 = document.querySelector('.weather3')
const temperatureDay3 = document.querySelector('.temperature--day3')
const temperatureNight3 = document.querySelector('.temperature--night3')

const GEOCODING_API_LINK = 'https://api.openweathermap.org/geo/1.0/direct?q='
const GEOCODING_API_KEY = '&appid=28b909569ce888bd2cc35a59a3cdaf5b'

const API_LINK = 'https://api.openweathermap.org/data/3.0/onecall?'
const API_KEY = '&appid=28b909569ce888bd2cc35a59a3cdaf5b'
const API_UNITS = '&units=metric'



const getGeocoding = () => {
	const city = input.value || 'Warszawa'
	const URL = GEOCODING_API_LINK + city + GEOCODING_API_KEY
	axios
		.get(URL)
		.then(res => {
			const status = res.data[0]
			const lat = status.lat
			const lon = status.lon
			const LAT_LON = `lat=${lat}&lon=${lon}`
			cityName.textContent = status.local_names.pl
			warning.textContent = ''
			input.value = ''
			getWeather(LAT_LON)
		})
		.catch(() => {
			warning.textContent = 'Wpisz poprawną nazwę miasta'
		})
}

const getWeather = LAT_LON => {
	const URL = API_LINK + LAT_LON + API_KEY + API_UNITS
	axios.get(URL).then(res => console.log(res.data))
	axios
		.get(URL)
		.then(res => {


			const date = formatDate(res.data.daily[0].dt)
			const date2 = formatDate(res.data.daily[1].dt)
			const date3 = formatDate(res.data.daily[2].dt)

            const temp = res.data.current.temp

			const tempDay = res.data.daily[0].temp.day
			const tempDay2 = res.data.daily[1].temp.day
			const tempDay3 = res.data.daily[2].temp.day

			const tempNight = res.data.daily[0].temp.night
			const tempNight2 = res.data.daily[1].temp.night
			const tempNight3 = res.data.daily[2].temp.night

			const status = res.data.daily[0].weather[0]
			const status2 = res.data.daily[1].weather[0]
			const status3 = res.data.daily[2].weather[0]

			day.textContent = date
			day2.textContent = date2
			day3.textContent = date3

			weather.textContent = status.main
			weather2.textContent = status2.main
			weather3.textContent = status3.main
            temperature.textContent = Math.floor(temp) + '°C'
			temperatureDay.textContent = Math.floor(tempDay) + '°C'
			temperatureDay2.textContent = Math.floor(tempDay2) + '°C'
			temperatureDay3.textContent = Math.floor(tempDay3) + '°C'

			temperatureNight.textContent = Math.floor(tempNight) + '°C'
			temperatureNight2.textContent = Math.floor(tempNight2) + '°C'
			temperatureNight3.textContent = Math.floor(tempNight3) + '°C'

			warning.textContent = ''
			input.value = ''

            if (status.id >= 200 && status.id < 300) {
                photo.setAttribute('src', '/static/img/thunderstorm.png');
            } else if (status.id >= 300 && status.id < 400) {
                photo.setAttribute('src', '/static/img/drizzle.png');
            } else if (status.id >= 500 && status.id < 600) {
                photo.setAttribute('src', '/static/img/rain.png');
            } else if (status.id >= 600 && status.id < 700) {
                photo.setAttribute('src', '/static/img/ice.png');
            } else if (status.id >= 700 && status.id < 800) {
                photo.setAttribute('src', '/static/img/fog.png');
            } else if (status.id == 800) {
                photo.setAttribute('src', '/static/img/sun.png');
            } else if (status.id >= 800 && status.id < 900) {
                photo.setAttribute('src', '/static/img/cloud.png');
            } else {
                photo.setAttribute('src', '/static/img/unknown.png');
            }
		})
		.catch(() => {
			warning.textContent = 'Wystąpił błąd podczas pobierania danych pogodowych'
		})
}

const enterCheck = e => {
	if (e.key === 'Enter') {
		getGeocoding()
	}
}
const formatDate = timestamp => {
	let date = new Date(timestamp)
	if (timestamp.toString().length > 10) {
		date = new Date(timestamp)
	} else {
		date = new Date(timestamp * 1000)

		const dayOfWeekShort = date.toLocaleDateString('pl-PL', { weekday: 'short' })
		const month = date.toLocaleString('pl-PL', { month: 'long' })
		const dayOfMonth = date.getDate()

		return `${dayOfWeekShort} ${month.charAt(0).toUpperCase() + month.substring(1)}, ${dayOfMonth}`
	}
}
input.addEventListener('keyup', enterCheck)
button.addEventListener('click', getGeocoding)



getGeocoding()


