const WAKA_TIME_API_URL  =  (key, duration = 30) =>  `https://wakatime.com/api/v1/users/current/stats/last_${duration}_days?api_key=${key}`;

export {
    WAKA_TIME_API_URL
} ;