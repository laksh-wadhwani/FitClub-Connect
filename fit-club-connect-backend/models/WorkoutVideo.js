const mongoose = require('mongoose')

const workout_videos_schema = new mongoose.Schema({
    gymID: {type: mongoose.Schema.Types.ObjectId, ref: 'fitnessTable'},
    video_name: String,
    video_url: String,
    video: String
});

const WorkoutVideo = new mongoose.model("workout_videos_schema", workout_videos_schema);

module.exports = WorkoutVideo;