import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    WiDaySunny,
    WiCloudy,
    WiRain,
    WiThunderstorm,
    WiStrongWind,
} from "react-icons/wi";
import { MdWarningAmber } from "react-icons/md";

const WeatherIndicator = () => {
    const [temperature, setTemperature] = useState(null);
    const [weatherCondition, setWeatherCondition] = useState(null);
    const [windSpeed, setWindSpeed] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWeather = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=Alilem,PH&units=metric&appid=385d1ca69f63972d08204be0ac485242`
            );
            const temp = response.data.main.temp;
            const condition = response.data.weather[0].main;
            const wind = response.data.wind.speed;

            setTemperature(temp);
            setWeatherCondition(condition);
            setWindSpeed(wind);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    const getWeatherIcon = () => {
        switch (weatherCondition) {
            case "Clear":
                return <WiDaySunny size={30} color="#0099ff" />;
            case "Clouds":
                return <WiCloudy size={30} color="#0099ff" />;
            case "Rain":
                return <WiRain size={30} color="#0099ff" />;
            case "Thunderstorm":
                return <WiThunderstorm size={30} color="#0099ff" />;
            case "Extreme":
                return <WiStrongWind size={30} color="#0099ff" />;
            default:
                return <WiCloudy size={30} color="#0099ff" />;
        }
    };

    const getWarningMessage = () => {
        if (weatherCondition === "Thunderstorm" || weatherCondition === "Rain") {
            return "Due to rainy conditions, some drivers may not operate.";
        } else if (windSpeed >= 15) {
            return "Severe weather detected. Drivers may not operate during typhoon conditions.";
        }
        return null;
    };

    return (
        <div style={{ display: "flex", paddingLeft: 58, gap: "10px", alignItems: "center" }}>
            {/* Weather Section */}
            <div style={styles.weather}>
                {getWeatherIcon()}
                <span style={styles.weatherText}>
                    {loading ? "Loading..." : `${temperature}°`}
                </span>
            </div>

            {/* Warning Section */}
            <div>
                {getWarningMessage() && (
                    <div style={styles.warningBox} className={"w-full"}>
                        <MdWarningAmber size={20} color="#FFCC00" />
                        <span style={styles.warningText} className="whitespace-nowrap">
                            {getWarningMessage()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    weather: {
        backgroundColor: "#fff",
        padding: "7px 9px",
        display: "flex",
        flexDirection: "row",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        gap: "6px",
        alignItems: "center",
    },
    weatherText: {
        fontFamily: "PlusJakartaSans-Medium",
        fontSize: "11px",
        color: "#605f5f",
    },
    warningBox: {
        backgroundColor: "#FFF3C6",
        borderRadius: "10px",
        display: "flex",
        top: -5,
        zIndex: 111,
        flexDirection: "row",
        alignItems: "center",
        gap: "5px",
        padding: "10px",
    },
    warningText: {
        fontFamily: "PlusJakartaSans-Medium",
        fontSize: "13px",
        color: "#605f5f",
    },
};

export default WeatherIndicator;
