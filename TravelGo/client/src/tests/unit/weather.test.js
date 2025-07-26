import { act, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axiosInstance, renderWithAuth } from "./test-utils";
import { mockItinerary } from "../mock-const";
import Weather from "../../pages/Weather/weather";

global.navigator.geolocation = {
    getCurrentPosition: jest.fn(),
};

const expectWeatherCard = async ({ length }) => {
    await waitFor(() => {
        expect(screen.getAllByText('Weather data not available')).toHaveLength(length);
        expect(screen.getAllByText('Max Temp:')).toHaveLength(length);
        expect(screen.getAllByText('Min Temp:')).toHaveLength(length);
        expect(screen.getAllByText('Rain:')).toHaveLength(length);
        expect(screen.getAllByText('Max UV Index:')).toHaveLength(length);
        expect(screen.getAllByText('Max Wind Speed:')).toHaveLength(length);
        expect(screen.getAllByText('Sunrise:')).toHaveLength(length);
        expect(screen.getAllByText('Sunset:')).toHaveLength(length);
    });
};

beforeEach(async () => {
    navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
        success({ coords: { latitude: 1.3521, longitude: 103.8198 } });
    });
    axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });
    axiosInstance.get.mockResolvedValueOnce({
        data: {
            apparentTemperature: 33.87,
            cloudCover: 100,
            rain: 0,
            relativeHumidity2m: 83,
            snowfall: 0,
            temperature2m: 28.05,
            time: "2025-07-18T23:30:00.000Z",
            weatherCode: "Overcast",
        }
    });

    await act(async () => renderWithAuth(<Weather />));
});

describe("Weather component", () => {
    describe("Itinerary weather tab", () => {
        test("renders layout", async () => {
            const itineraryWeather = screen.getByRole('tab', { name: /itinerary weather/i });
            const generalWeather = screen.getByRole('tab', { name: /general weather/i });

            await waitFor(() => {
                expect(itineraryWeather).toBeInTheDocument();
                expect(generalWeather).toBeInTheDocument();
                expect(itineraryWeather).toHaveClass('bg-blue-600 text-white');
                expect(generalWeather).toHaveClass('bg-gray-200 text-blue-700 hover:bg-blue-300 transform hover:scale-105');
                expect(screen.getByLabelText('Select Itinerary:')).toBeInTheDocument();
                expect(screen.getByRole('combobox', { name: 'Select Itinerary:' })).toBeInTheDocument();
                expect(screen.getByRole('combobox', { name: 'Select Itinerary:' })).toHaveDisplayValue('-- Choose --');
                expect(screen.getByText('Select an Itinerary!')).toBeInTheDocument();
            });
        });

        test("renders weather warnings and trip forecast after selecting an itinerary", async () => {
            axiosInstance.get.mockResolvedValueOnce({
                data: {
                    "Wed Sep 10 2025 08:00:00 GMT +0800(Singapore Standard Time)": "Weather data not available",
                    "Thu Sep 11 2025 08:00:00 GMT +0800(Singapore Standard Time)": "Weather data not available",
                    "Fri Sep 12 2025 08:00:00 GMT +0800(Singapore Standard Time)": "Weather data not available",
                    "Sat Sep 13 2025 08:00:00 GMT +0800(Singapore Standard Time)": {
                        time: "Sat Sep 13 2025",
                        rainSum: 0.9,
                        sunrise: "2025-09-13T06:16:46.000Z",
                        sunset: "2025-09-13T21:37:46.000Z",
                        temperature2mMax: 27.65,
                        temperature2mMin: 17.7,
                        uvIndexMax: 6.3,
                        windSpeed10mMax: 26.32,
                    },
                    "Sun Sep 14 2025 08:00:00 GMT +0800(Singapore Standard Time)": {
                        time: "Sun Sep 14 2025",
                        rainSum: 6.3,
                        sunrise: "2025-09-14T06:11:52.000Z",
                        sunset: "2025-09-14T21:42:34.000Z",
                        temperature2mMax: 23.95,
                        temperature2mMin: 17.15,
                        uvIndexMax: 6.95,
                        windSpeed10mMax: 15.19,
                    },
                    "Mon Sep 15 2025 08:00:00 GMT +0800(Singapore Standard Time)": {
                        time: "Mon Sep 15 2025",
                        rainSum: 0,
                        sunrise: "2025-09-15T06:07:08.000Z",
                        sunset: "2025-09-15T21:46:49.000Z",
                        temperature2mMax: 31.44,
                        temperature2mMin: 20.44,
                        uvIndexMax: 7.1,
                        windSpeed10mMax: 12.48,
                    },
                }
            });
            axiosInstance.get.mockResolvedValueOnce({
                data: {
                    drasticTemperatureChange: {
                        alert: false,
                        msg: "No drastic daily temperature changes (+/- 10°C) detected."
                    },
                    rainfall: {
                        alert: false,
                        msg: "Rainfall is within normal range, maximum recorded is 8.4 mm."
                    },
                    snowfall: {
                        alert: false,
                        msg: "Snowfall is within normal range, maximum recorded is 0 mm."
                    },
                }
            });

            await waitFor(() => expect(screen.getByRole('option', { name: /singapore/i })).toBeInTheDocument());
            userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select Itinerary:' }), "3");

            await waitFor(() => {
                expect(screen.getByText('Displaying weather forecast results for:')).toBeInTheDocument();

                const warnings = screen.getByText('Weather Warnings (Based on past 1 year data)');
                expect(warnings).toBeInTheDocument();
                expect(warnings).toHaveClass('text-green-800');
                expect(screen.getByText('Destination:')).toBeInTheDocument();
                expect(screen.getByText('Trip Period:')).toBeInTheDocument();
                expect(screen.getByText('Rainfall is within normal range, maximum recorded is 8.4 mm.')).toBeInTheDocument();
                expect(screen.getByText('Snowfall is within normal range, maximum recorded is 0 mm.')).toBeInTheDocument();
                expect(screen.getByText('No drastic daily temperature changes (+/- 10°C) detected.')).toBeInTheDocument();

                expect(screen.getByText('Wed Sep 10 2025')).toBeInTheDocument();
                expectWeatherCard(3);
            });
        });
    });

    describe("General weather tab", () => {
        beforeEach(async () => {
            const generalWeather = screen.getByRole('tab', { name: /general weather/i });
            await waitFor(() => expect(generalWeather).toBeInTheDocument());
            userEvent.click(generalWeather);
        });

        test("renders layout", () => {
            const itineraryWeather = screen.getByRole('tab', { name: /itinerary weather/i });
            const generalWeather = screen.getByRole('tab', { name: /general weather/i });
            expect(itineraryWeather).toHaveClass('bg-gray-200 text-blue-700 hover:bg-blue-300 transform hover:scale-105');
            expect(generalWeather).toHaveClass('bg-blue-600 text-white');

            expect(screen.getByText(/current weather/i)).toBeInTheDocument();
            expect(screen.getByText(/your location/i)).toBeInTheDocument();
            expect(screen.getByText('Temp:')).toBeInTheDocument();
            expect(screen.getByText('Weather:')).toBeInTheDocument();
            expect(screen.getByText('Humidity:')).toBeInTheDocument();
            expect(screen.getByText('Feels like:')).toBeInTheDocument();
            expect(screen.getByText('At time:')).toBeInTheDocument();

            expect(screen.getByText(/weather forecast/i)).toBeInTheDocument();
            expect(screen.getByText('Check the weather in your city')).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter city/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /get weather/i })).toBeInTheDocument();
            expect(screen.getByText('Key in a valid city above.')).toBeInTheDocument();
        });

        test("shows weather forecast for searched destination", async () => {
            axiosInstance.get.mockResolvedValueOnce({
                data: {
                    0: {
                        time: "Sat Jul 19 2025",
                        rainSum: 0,
                        sunrise: "2025-07-19T07:05:10.000Z",
                        sunset: "2025-07-19T19:16:28.000Z",
                        temperature2mMax: "32.02",
                        temperature2mMin: "24.12",
                        uvIndexMax: "7.3",
                        windSpeed10mMax: "12.67",
                    },
                    1: {
                        time: "Sun Jul 20 2025",
                        rainSum: 2.75,
                        sunrise: "2025-07-20T07:05:10.000Z",
                        sunset: "2025-07-20T19:16:28.000Z",
                        temperature2mMax: "31.86",
                        temperature2mMin: "25.33",
                        uvIndexMax: "6.9",
                        windSpeed10mMax: "10.54",
                    },
                    2: {
                        time: "Mon Jul 21 2025",
                        rainSum: 0,
                        sunrise: "2025-07-21T07:05:10.000Z",
                        sunset: "2025-07-21T19:16:28.000Z",
                        temperature2mMax: "30.77",
                        temperature2mMin: "24.81",
                        uvIndexMax: "8.1",
                        windSpeed10mMax: "13.27",
                    },
                }
            });

            userEvent.type(screen.getByPlaceholderText(/enter city/i), "singapore");
            userEvent.click(screen.getByRole('button', { name: /get weather/i }));

            await waitFor(() => {
                expect(screen.getByText('Displaying search results for:')).toBeInTheDocument();
                expect(screen.getByText('Sat Jul 19 2025')).toBeInTheDocument();
                expect(screen.getByText('Sun Jul 20 2025')).toBeInTheDocument();
                expect(screen.getByText('Mon Jul 21 2025')).toBeInTheDocument();
                expectWeatherCard(3);
            });
        });

        test("shows no weather forecast on invalid destination", async () => {
            for (let i = 0; i < 10; i++) {
                axiosInstance.get.mockRejectedValueOnce({
                    response: { data: { error: "Failed to fetch weather data" } }
                });
            };

            userEvent.type(screen.getByPlaceholderText(/enter city/i), "test");
            userEvent.keyboard('{Enter}');

            await waitFor(() => {
                expect(screen.getByText('Key in a valid city above.')).toBeInTheDocument();
                expect(screen.queryByText('Displaying search results for:')).not.toBeInTheDocument();
                expectWeatherCard(0);
            });
        });

        test("shows no current location weather report when current location not set", async () => {
            navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
                success({ coords: { latitude: null, longitude: null } });
            });
            axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });
            for (let i = 0; i < 10; i++) {
                axiosInstance.get.mockRejectedValueOnce({
                    response: { data: { error: "Latitude and longitude are required." } },
                });
            };

            cleanup();
            renderWithAuth(<Weather />);
            const generalWeather = screen.getByRole('tab', { name: /general weather/i });
            await waitFor(() => expect(generalWeather).toBeInTheDocument());
            userEvent.click(generalWeather);

            await waitFor(() => {
                expect(screen.getByText('Loading...')).toBeInTheDocument();
                expect(screen.queryByText('Humidity:')).not.toBeInTheDocument();
                expect(screen.queryByText('Feels like:')).not.toBeInTheDocument();
            });
        });
    });
});