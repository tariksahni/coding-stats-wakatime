import axios from 'axios';
import {WAKA_TIME_API_URL} from '../static/url';

const fetchStatsData = () => {
    const API_KEY = process.env.WAKATIME_API_KEY;
    axios.get(WAKA_TIME_API_URL(API_KEY)).then((response) => {
        console.log(response);
    });
};

export default fetchStatsData;

