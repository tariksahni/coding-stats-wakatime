import axios from 'axios';
import {WAKA_TIME_API_URL} from './static/url';
import {generateStatsSVG} from './utils/generateStatsSVG';
import {addAndPushToRepo} from './scripts/addAndPushToRepo';

const initProcess = () => {
    const WAKATIME_API_KEY = process.env.INPUT_WAKATIME_API_KEY;
    const duration = process.env.INPUT_SHOW_MONTHLY === true ? 30 : 7;
    console.log("INPUT_SHOW_MONTHLY", duration,  process.env.INPUT_SHOW_MONTHLY, typeof  process.env.INPUT_SHOW_MONTHLY);
    axios.get(WAKA_TIME_API_URL(WAKATIME_API_KEY, duration)).then((response) => {
        generateStatsSVG(response.data);
        addAndPushToRepo().then( () => console.log("Done and dusted"))
    }).catch(err => {
        return new Error(err)
    });
};

export default initProcess;

