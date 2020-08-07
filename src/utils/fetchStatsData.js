import axios from 'axios';
import {WAKA_TIME_API_URL} from '../static/url';
import generateStatsSVG from '../svgGeneration/generateStatsSVG';

const fetchStatsData = () => {
    const API_KEY = process.env.INPUT_WAKATIME_API_KEY;
    axios.get(WAKA_TIME_API_URL(API_KEY)).then((response) => {
        generateStatsSVG(response.data);
    });
};

export default fetchStatsData;

