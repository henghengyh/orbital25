export const getUserLocation = () => {
    return new Promise((resolve) => {
        // we are gonna set a default position in case geolocation fails
        const defaultPos = { lat: 1.3521, lng: 103.8198 };
        if (!navigator.geolocation) {
            console.log('Geolocation not supported, using default location');
            resolve(defaultPos);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('User location obtained:', userPos);
                resolve(userPos);
            },
            (error) => {
                console.log('Geolocation failed, using default location:', error.message);
                resolve(defaultPos);
            },
            {
                timeout: 10000,
                enableHighAccuracy: true,
                maximumAge: 300000
            }
        );
    });
};