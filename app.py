import os.path

from markupsafe import escape
from flask import Flask, render_template, request, jsonify
#from pafy import pafy
#import youtube_dl
from pytubefix import Search, YouTube
from flask_fontawesome import FontAwesome

from YoutubeDownload import trim_merge, delete_old_merged_files, visitorData, poToken

app = Flask(__name__)
fa = FontAwesome(app)

@app.route("/")
def hello():
    message = "Hello, World!!"
    return render_template('main.html',
                           message=message)


@app.route('/search/')
def search():
    return render_template('search.html', title="Search Video")


@app.route('/deepSeek/')
def test():
    return render_template('deepSeek.html', title="Test DeepSeek Page")

@app.route('/test-navbar/')
def test_navbar():
    return render_template('test-navbar.html', title="Test NavBar Page")

@app.route('/capitalize/<word>/')
def capitalize(word):
    return '<h1>{}</h1>'.format(escape(word.capitalize()))

@app.route('/audioplayer/')
def audioplayer():
    return render_template('audioplayer.html', audio_filename="merged.mp3")


@app.route('/trimAndMerge1/', methods=('GET', 'POST'))
def trim_and_merge1():
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

@app.route('/trimAndMerge/', methods=('GET', 'POST'))
def trim_and_merge():
    merged_file = ""
    merged_file_dir = ""
    merged_file_name = ""

    if request.method == 'POST':
        # Get lists of values instead of individual items
        url_list = request.form.getlist('url[]')
        start_time_list = request.form.getlist('start[]')
        end_time_list = request.form.getlist('end[]')

        # Debug print
        for i, (url, start, end) in enumerate(zip(url_list, start_time_list, end_time_list), start=1):
            print(f'url{i} <{url}>, start <{start}>, end <{end}>')

        # Call trim_merge function
        merged_file = trim_merge(url_list, start_time_list, end_time_list)

        merged_file_dir = os.path.dirname(merged_file)
        merged_file_name = os.path.basename(merged_file)

        print(f'merged_file <{merged_file}>')
        print(f'merged_file_dir <{merged_file_dir}>, merged_file_name <{merged_file_name}>')

        delete_old_merged_files() #delete all the old files (older than 1 hour)

    return jsonify({"merged_file_name": merged_file_name})
    # return render_template(
    #     'audioplayer.html',
    #     merged_file_dir=merged_file_dir,
    #     merged_file_name=merged_file_name
    # )

@app.route('/get_video_info/', methods=['POST'])
def get_video_info():
    print(f'get_video_info')
    data = request.get_json()
    url = data.get('url', '').strip()

    print(f'get_video_info: url = {url}')
    if not url:
        return jsonify({'success': False, 'error': 'No URL provided.'}), 400

    try:
        yt = YouTube(url, 
                use_po_token=True,
                po_token=os.getenv("YT_PO_TOKEN", poToken),
                visitor_data=os.getenv("YT_VISITOR_DATA", visitorData))
        title = yt.title
        duration_seconds = yt.length
        minutes, seconds = divmod(duration_seconds, 60)
        duration = f"{minutes}:{seconds:02}"

        retJson = jsonify({
            'success': True,
            'title': title,
            'duration': duration,
            'videoId': yt.video_id
        })
        print(f"Success fetching video info, JSON: {retJson}")

        return retJson
    except Exception as e:
        print(f"Error fetching video info: {e}")
        return jsonify({
            'success': False,
            'error': 'Invalid or inaccessible YouTube URL.'
        }), 400
    
@app.route('/searchResults/', methods=('GET', 'POST'))
def search_results():
    search_text = request.form['searchText']
    print(f'search_text <{search_text}>')
    search_results = Search(search_text, 
                            use_po_token=True,
                            po_token=os.getenv("YT_PO_TOKEN", poToken),
                            visitor_data=os.getenv("YT_VISITOR_DATA", visitorData))
    return render_template('search_results.html', results=search_results, search_text=search_text)

@app.route('/deleteMergedFile', methods=['DELETE'])
def delete_merged_file():
    filename = request.args.get('filename')
    if not filename:
        return jsonify({"status": "error", "message": "Missing filename"}), 400

    file_path = os.path.join('static', 'working_dir', filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"✅ Deleted temporary file: {file_path}")

            delete_old_merged_files() #delete all the old files (older than 1 hour)
            
            return jsonify({"status": "success", "message": f"Deleted file: {filename}"}), 200
        except Exception as e:
            print(f"❌ Error deleting file: {e}")
            return jsonify({"status": "error", "message": f"Error deleting file: {str(e)}"}), 500
    else:
        print(f"⚠️ File not found: {file_path}")
        return jsonify({"status": "warning", "message": f"File not found: {filename}"}), 404


if __name__ == "__main__":
    app.run(debug=True)