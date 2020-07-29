/* Node Modules */
import axios from 'axios';

/* Constants */
import {WAKA_TIME_API_URL} from '../static/url';

const fetchStatsData = () => {
    axios.get(WAKA_TIME_API_URL()).then((response) => {
    });
};

export default fetchStatsData;

