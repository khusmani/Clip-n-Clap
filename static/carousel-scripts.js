        // Data storage
        let videos = [];
        let currentVideoIndex = 0;

        // DOM Elements
        const videoForm = document.getElementById('videoForm');
        const youtubeUrlInput = document.getElementById('url');
        const startTimeInput = document.getElementById('start');
        const stopTimeInput = document.getElementById('end');
        const videosContainer = document.getElementById('videosContainer');
        const noVideosMessage = document.getElementById('noVideosMessage');
        const carouselWrapper = document.getElementById('carouselWrapper');
        const carousel = document.getElementById('carousel');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitAllBtn = document.getElementById('submitAllBtn');
        const videoCount = document.getElementById('videoCount');

        // Mock video data for demonstration
        const mockVideoData = [
            {
                "title": "Sample Music Video - Chill Beats",
                "duration": "3:45",
                "thumbnail": "https://picsum.photos/320/180?random=1",
                "startTime": "00:00:15.000",
                "stopTime": "00:00:30.000"
            },
            {
                "title": "Tutorial: How to Code in Python",
                "duration": "12:30",
                "thumbnail": "https://picsum.photos/320/180?random=2",
                "startTime": "00:01:00.000",
                "stopTime": "00:01:45.000"
            },
            {
                "title": "Nature Documentary - Ocean Life",
                "duration": "25:15",
                "thumbnail": "https://picsum.photos/320/180?random=3",
                "startTime": "00:05:00.000",
                "stopTime": "00:05:30.000"
            }
        ];

        // Extract video ID from YouTube URL
        function extractVideoId(url) {
            const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = url.match(regex);
            return match ? match[1] : null;
        }

        // Format time display
        function formatTimeDisplay(timeString) {
            //return timeString.replace(/^00:/, '').replace(/\.000$/, '');
            return timeString;
        }

        // Create video card HTML
        function createVideoCard(video, index) {
            const returnStr = `
                <div id="carousel-item-${index}" class="carousel-items w-80 flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden" data-index="${index}">
                    <div class="p-4">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">${video.title}</h3>
                            <button
                                onclick="removeVideo(${index})"
                                class="text-gray-400 hover:text-red-600 transition-colors ml-2 flex-shrink-0"
                                title="Remove video"
                            >
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="thumbnail" onclick="previewVideo(${index})">
                            <img
                                src="${video.thumbnail}"
                                alt="${video.title}"
                                class="w-full h-40 object-cover rounded-md mb-3"
                                loading="lazy"
                            >
                        </div>

                        <div class="space-y-2 text-sm text-gray-600">
                            <div class="flex justify-between">
                                <span>Duration:</span>
                                <span>${video.duration}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Clip:</span>
                                <span>${formatTimeDisplay(video.startTime)} - ${formatTimeDisplay(video.stopTime)}</span>
                            </div>
                        </div>

                        <!--
                        <div class="mt-4 flex space-x-2">
                            <button
                                onclick="previewVideo(${index})"
                                class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                            >
                                <i class="fas fa-play mr-1"></i> Preview
                            </button>
                        </div> 
                        -->
                    </div>
                </div>
            `;
            //console.log(returnStr);
            return returnStr;
        }

        // Update carousel display
        function updateCarousel() {
            //alert('updateCarousel');
            carousel.innerHTML = videos.map((video, index) => createVideoCard(video, index)).join('');
            videoCount.textContent = `${videos.length} video${videos.length !== 1 ? 's' : ''}`;

            if (videos.length === 0) {
                noVideosMessage.classList.remove('hidden');
                carouselWrapper.classList.add('hidden');
                submitAllBtn.disabled = true;
            } else {
                noVideosMessage.classList.add('hidden');
                carouselWrapper.classList.remove('hidden');
                submitAllBtn.disabled = false;
            }

            updateNavigationButtons();
        }

        // Update navigation button states
        function updateNavigationButtons() {
            prevBtn.disabled = currentVideoIndex === 0;
            nextBtn.disabled = currentVideoIndex >= videos.length - 1;
        }

        // Scroll to specific video in carousel
        function scrollToVideo(index) {
            const videoElement = document.querySelector(`[data-index="${index}"]`);
            if (videoElement) {
                videoElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
                currentVideoIndex = index;
                updateNavigationButtons();
            }
        }

        // Add new video
        function addVideoWithInput() {
            alert('in addVideoWithInput');
            var url = document.getElementById("url").value;
            var startTime = document.getElementById("start").value;;
            var stopTime = document.getElementById("end").value;
            alert('adding ' + url);
            console.log("adding " + url + " to the video list");
            addVideo(url, startTime, stopTime);
        }

        async function addVideo(url, startTime, stopTime, data) {
            console.log("add video " + url);
            const videoId = data.videoId; //extractVideoId(url);
            console.log("videoId: " + videoId);
            if (!videoId) {
                alert('Invalid YouTube URL. Please enter a valid YouTube URL.');
                return;
            }

            // Simulate fetching video details (in real app, this would call your Flask backend)
            try {
                // For demo purposes, use mock data
                //const randomMock = mockVideoData[Math.floor(Math.random() * mockVideoData.length)];
                const videoData = {
                    id: videoId,
                    title: data.title, //randomMock.title,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    duration: data.duration, //randomMock.duration,
                    startTime: startTime,
                    stopTime: stopTime,
                    url: url
                };

                videos.push(videoData);
                console.log("videoData: " + videoData);
                updateCarousel();
                scrollToVideo(videos.length - 1);

                // Reset form
                videoForm.reset();

                console.log('Added video:', videoData);

            } catch (error) {
                console.error('Error adding video:', error);
                alert('Error adding video. Please try again.');
            }
        }

        // Remove video
        function removeVideo(index) {
            if (index >= 0 && index < videos.length) {
                videos.splice(index, 1);
                updateCarousel();

                if (videos.length > 0) {
                    currentVideoIndex = Math.min(currentVideoIndex, videos.length - 1);
                    scrollToVideo(currentVideoIndex);
                }
            }
        }

        // Preview video
        function previewVideo(index) {
            const video = videos[index];
            const videoId = video.id;
            const startSeconds = convertTimeToSeconds(video.startTime);

            // Open YouTube embed with start time in a new tab
            const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${Math.floor(startSeconds)}&autoplay=1`;
            window.open(embedUrl, '_blank');
        }

        // Convert HH:MM:SS.mmm to seconds
        // function convertTimeToSeconds(timeString) {
        //     const parts = timeString.split(':');
        //     const hours = parseInt(parts[0]) || 0;
        //     const minutes = parseInt(parts[1]) || 0;
        //     const secondsParts = parts[2].split('.');
        //     const seconds = parseInt(secondsParts[0]) || 0;
        //     const milliseconds = parseInt(secondsParts[1]) || 0;

        //     return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
        // }
        function convertTimeToSeconds(timeString) {
            if (!timeString) return 0;

            // Split milliseconds (if any)
            let [timePart, millisPart] = timeString.split(".");
            let milliseconds = millisPart ? parseInt(millisPart.padEnd(3, "0")) : 0;

            // Split by colon
            const parts = timePart.split(":").map(Number);

            let hours = 0, minutes = 0, seconds = 0;

            if (parts.length === 3) {
                // HH:MM:SS
                [hours, minutes, seconds] = parts;
            } else if (parts.length === 2) {
                // MM:SS
                [minutes, seconds] = parts;
            } else if (parts.length === 1) {
                // SS
                [seconds] = parts;
            }

            return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
        }

        // convert the user input back to HH:MM:SS.mmm format by adding 0s for the missing portions
        function normalizeTimeInput(timeStr) {
            if (!timeStr || typeof timeStr !== "string") return "00:00:00.000";

            // Split into main time and milliseconds (if present)
            let [main, millis = "0"] = timeStr.split(".");
            millis = millis.padEnd(3, "0").slice(0, 3); // Ensure exactly 3 digits

            // Split main part into components
            const parts = main.split(":").map(p => p.padStart(2, "0"));

            let hours = "00", minutes = "00", seconds = "00";

            if (parts.length === 3) {
                [hours, minutes, seconds] = parts;
            } else if (parts.length === 2) {
                [minutes, seconds] = parts;
            } else if (parts.length === 1) {
                [seconds] = parts;
            } else {
                throw new Error(`Invalid time format: ${timeStr}`);
            }

            // Return normalized time string
            return `${hours}:${minutes}:${seconds}.${millis}`;
        }


        // Submit all videos for clipping and merging
        async function submitAllVideos() {
            if (videos.length === 0) return;

            const payload = {
                videos: videos.map(video => ({
                    url: video.url,
                    start: video.startTime,
                    stop: video.stopTime
                }))
            };

            try {
                // Show loading state
                const originalText = submitAllBtn.innerHTML;
                submitAllBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
                submitAllBtn.disabled = true;

                // Simulate API call to clipAndMerge endpoint
                console.log('Submitting videos for clipping and merging:', payload);


                // Build FormData to match Flask's expected input
                const formData = new FormData();

                payload.videos.forEach(video => {
                    formData.append('url[]', video.url);
                    formData.append('start[]', video.start);
                    formData.append('end[]', video.stop);  
                });

                try {
                    // Show loader (optional)
                    const loader = document.getElementById('overlay');
                    if (loader) loader.style.display = 'flex';
        
                    // POST to the existing Flask route
                    const response = await fetch('/trimAndMerge/', {
                        method: 'POST',
                        body: formData
                    });

                    // The Flask route returns HTML (audioplayer.html)
                    const html = await response.text();

                    // Replace the <body> content safely
                    const parser = new DOMParser();
                    const newDoc = parser.parseFromString(html, 'text/html');

                    // Replace current body content
                    document.body.replaceWith(newDoc.body);
                } catch (error) {
                    console.error('Error submitting videos:', error);
                    alert('Something went wrong. Please try again.');
                }

                // // Simulate processing delay
                // setTimeout(() => {
                //     alert('Successfully submitted ${videos.length} videos for processing! The merged audio will be available shortly.');

                //     // Reset button state
                //     submitAllBtn.innerHTML = originalText;
                //     submitAllBtn.disabled = false;

                //     // In a real implementation, you would handle the response
                //     // and potentially redirect to a download page
                // }, 2000);

            } catch (error) {
                console.error('Error submitting videos:', error);
                alert('Error submitting videos. Please try again.');
                submitAllBtn.innerHTML = '<i class="fas fa-music mr-2"></i>Clip & Merge All';
                submitAllBtn.disabled = false;
            }
        }

        // add Clip button is pressed
        // function addClip() {
        //     alert('add clip pressed');
        //     const urlField = document.getElementById('url');
        //     const startField = document.getElementById('start');
        //     const endField = document.getElementById('end');
        //     const url = urlField.value.trim();
        //     const startTime = startField.value.trim();
        //     const stopTime = endField.value.trim();

        //     if (!url || !startTime || !stopTime) {
        //         alert('Please fill in all fields.');
        //         return;
        //     }

        //     addVideo(url, startTime, stopTime);
        // }

        // Event Listeners
        //videoForm.addEventListener('submit', function(e) {
        videoForm.addEventListener('submit', function(e) {
            e.preventDefault(); // prevent normal form submission
            //alert('submit button pressed');
            const urlField = document.getElementById('url');
            const startField = document.getElementById('start');
            const endField = document.getElementById('end');
            const url = urlField.value.trim();
            const startTime = startField.value.trim();
            const stopTime = endField.value.trim();
            const confirmCheckbox = document.getElementById('copyrightConfirm');

            if (!url || !startTime || !stopTime) {
                alert('Please fill in all fields.');
                return;
            }

            if (!confirmCheckbox.checked) {
                alert('Please confirm that you have rights to the videos before proceeding.');
            }

            // Validate time format            
            // Accepts: HH:MM:SS.mmm | MM:SS.mmm | SS.mmm | HH:MM:SS | MM:SS | SS
            const timePattern = /^(\d{1,2}:)?([0-5]?\d:)?([0-5]?\d)(\.\d{1,3})?$/;
            if (!timePattern.test(startTime) || !timePattern.test(stopTime)) {
                alert('Invalid time format. Please use HH:MM:SS.mmm, MM:SS.mmm, SS.mmm, HH:MM:SS, MM:SS, or SS format.');
                return;
            }

            //addVideo(url, startTime, stopTime);
            fetchVideoInfo(url, startTime, stopTime);
        });

        prevBtn.addEventListener('click', function() {
            if (currentVideoIndex > 0) {
                scrollToVideo(currentVideoIndex - 1);
            }
        });

        nextBtn.addEventListener('click', function() {
            if (currentVideoIndex < videos.length - 1) {
                scrollToVideo(currentVideoIndex + 1);
            }
        });

        submitAllBtn.addEventListener('click', submitAllVideos);

        // Carousel scroll event to update current index
        carousel.addEventListener('scroll', function() {
            const scrollLeft = carousel.scrollLeft;
            const itemWidth = 320; // w-80 = 320px
            const newIndex = Math.round(scrollLeft / itemWidth);
            if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
                currentVideoIndex = newIndex;
                updateNavigationButtons();
            }
        });

        //function to fetch video info
        async function fetchVideoInfo(videoUrl, startTime, stopTime) {
            // Show loader overlay
            document.getElementById('overlay').style.display = 'flex';

            try {
                const response = await fetch('/get_video_info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: videoUrl, start: startTime, stop: stopTime })
                });

                const data = await response.json();

                if (data.success) {
                    // Example: Display video details below the form
                    //alert(`✅ Video found: ${data.title} (${data.duration})`);

                    //convert the user input in the full HH:MM:SS.mmm format for better display
                    const fullStartTime = normalizeTimeInput(startTime);
                    const fullStopTime  = normalizeTimeInput(stopTime);
                    //alert(`fullStartTime: ${fullStartTime} fullStopTime: ${fullStopTime}`);
                    addVideo(videoUrl, fullStartTime, fullStopTime, data);
                } else {
                    alert(`❌ ${data.error}`);
                }
            } catch (error) {
                console.error('Error fetching video info:', error);
                alert('Server error while validating the video.');
            } finally {
                // Hide loader overlay
                document.getElementById('overlay').style.display = 'none';
            }
        }

        // Initialize with some demo videos
        function initializeDemoVideos() {
            // Add a couple of demo videos for testing
            setTimeout(() => {
                addVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '00:00:15.000', '00:00:30.000');
            }, 100);
        }

        // Initialize
        updateCarousel();
        //initializeDemoVideos();