# CODING STATS WAKATIME
![LICENSE](https://img.shields.io/github/license/tariksahni/coding-stats-wakatime?style=flat)
![RELEASE](https://img.shields.io/github/v/release/tariksahni/coding-stats-wakatime?color=green&styleflat)
![ACTIVITY](https://img.shields.io/github/commit-activity/y/tariksahni/coding-stats-wakatime?color=green)


This is a [github action](https://docs.github.com/en/actions) for those who uses [Wakatime](https://wakatime.com/dashboard) to track their coding activity. 
You can add the stats from wakatime in your github profile's README or any other repository.

Here's an example of my coding activity in last one week:  

<img src="https://github.com/tariksahni/tariksahni/blob/master/codeStats.svg" alt="My Coding Activity/>

### Usage
1. Fetch your WakaTime API Key. Available from your [WakaTime](https://wakatime.com) account settings. 
2. Add WakaTime API Key to your repository secret with the name as **WAKATIME_API_KEY**. [How to add secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)
3. Add the image tag in your README file. Also, you can use it anywhere you want to.
    ```html
      <img src="https://github.com/<username>/<repository-name>/blob/master/images/codeStats.svg" alt="Alternative Text"/>
      Example: <img src="https://github.com/tariksahni/tariksahni/blob/master/codeStats.svg" alt="My Coding Activity/>
    ```
4. Click **Action** tab on the repo you want to add this and **choose set up a workflow yourself** option.
5. Copy the following code.
    ```yml
    name: Update README with my latest coding stats
    
    on:
      schedule:
        - cron: '30 5 * * *'
    
    jobs:
      update-Readme:
        name: Automatically update my README  
        runs-on: ubuntu-latest
        steps:
          - uses: tariksahni/coding-stats-wakatime@v1.0.0
            with:
              WAKATIME_API_KEY: ${{ secrets.WAKATIME_API_KEY }}
              SHOW_MONTHLY: true
              GITHUB_TOKEN: ${{ github.token }}
              GITHUB_ACTION: ${{ github.action }}
    ```
   Note: You can chose the duration of your activity from monthly(default) to weekly. For weekly set `SHOW_MONTHLY: false`. 
   
6. The workflow will run at 10AM IST everyday or you can force run it by going to Action tab. Or you can add following lines under `on:` to run with every push. Search for 12 AM UTC to find equivalent time in your time zone. 
    ```yml
    on:
      push:
        branches: [ master ]
      schedule:
        - cron: '30 5 * * *' 
    ```


