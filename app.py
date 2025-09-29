import os.path

from markupsafe import escape
from flask import Flask, render_template, request
#from pafy import pafy
#import youtube_dl
from pytube import Search


from YoutubeDownload import trim_merge

app = Flask(__name__)


@app.route("/")
def hello():
    message = "Hello, World!!"
    return render_template('main.html',
                           message=message)


@app.route('/search/')
def search():
    return render_template('search.html', title="Search Video")


@app.route('/capitalize/<word>/')
def capitalize(word):
    return '<h1>{}</h1>'.format(escape(word.capitalize()))


@app.route('/audioplayer/')
def audioplayer():
    return render_template('audioplayer.html', audio_filename="merged.mp3")


@app.route('/trimAndMerge/', methods=('GET', 'POST'))
def trim_and_merge():
    merged_file = ""
    merged_file_dir = ""
    merged_file_name = ""
    if request.method == 'POST':
        url1 = request.form['url1']
        url1_start = request.form['url1_start']
        url1_end = request.form['url1_end']
        url2 = request.form['url2']
        url2_start = request.form['url2_start']
        url2_end = request.form['url2_end']
        print(f'url1 <{url1}>, start <{url1_start}>, end <{url1_end}>')
        print(f'url2 <{url2}>, start <{url2_start}>, end <{url2_end}>')
        url_list = [url1, url2]
        start_time_list = [url1_start, url2_start]
        end_time_list = [url1_end, url2_end]
        merged_file = trim_merge(url_list, start_time_list, end_time_list)
        merged_file_dir = os.path.dirname(merged_file)
        merged_file_name = os.path.basename(merged_file)
        print(f'merged_file <{merged_file}>')
        print(f'merged_file_dir <{merged_file_dir}>, merged_file_name <{merged_file_name}>')

    return render_template('audioplayer.html', merged_file_dir=merged_file_dir, merged_file_name=merged_file_name )


@app.route('/searchResults/', methods=('GET', 'POST'))
def search_results():
    search_text = request.form['searchText']
    print(f'search_text <{search_text}>')
    search_results = Search(search_text)
    play_urls = []
    for i in range(len(search_results.results)):
        yt = search_results.results[i]
        url = "https://www.youtube.com/watch?v=87JIOAX3njM" # yt.watch_url
        #video = pafy.new(url)
        #play_urls.append(video.getbest().url)
    return render_template('search_results.html', results=search_results, play_urls=play_urls, search_text=search_text)


if __name__ == "__main__":
    app.run(debug=True)