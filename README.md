# Clip-n-Clap
Author: Khurshid H Usmani

Python webapp to clip portions of video/audio files and then combine all of the clips together.

Heroku::

On a command prompt::

set env variables on Heroku to be used by pytube below. Instructions for generating these toekn and visitor data is at https://github.com/YunzheZJU/youtube-po-token-generator

heroku config:set YT_PO_TOKEN="MngDK0MhEfMhnwMXlQqgGVALGF6_Bz1SyUDf94FHevBmALJwYf6N-A6P0I8EzP0FzAkVN-3nNmGD2IxQJZhGKtpOWpoQJgmDKN_eV4vqDtyEWfkHtas3eVDyNSMlFGDXrvk9ADdSvFGj6IP8bl6yjDaXRxracNdrJ_A="

heroku config:set YT_VISITOR_DATA="Cgtob0VnMlh2cEhMUSj8lerHBjIKCgJVUxIEGgAgVQ%3D%3D"

Push code to Heroku, run below command
git push heroku main 

To see the logs on Heroku run below command
heroku logs --tail


