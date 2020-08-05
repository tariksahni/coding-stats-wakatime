const WAKA_TIME_API_URL  =  (key) =>  `https://wakatime.com/api/v1/users/current/stats/last_30_days?api_key=${key}`;

export {
    WAKA_TIME_API_URL
} ;