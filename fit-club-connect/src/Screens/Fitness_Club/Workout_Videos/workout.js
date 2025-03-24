import React, { useEffect,useState } from "react";
import './workout.css';
import Modal from "react-modal";
import axios from "axios";
import BackendURL from "../../../BackendContext"
import ReactPlayer from 'react-player';
import { QRCodeCanvas } from 'qrcode.react';
import { toast, ToastContainer } from "react-toastify";

const Workout = ({ gymUser }) => {

    const API = BackendURL();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [playerModal, setPlayerModal] = useState(false);
    const [qrModal, setQrModal] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null); 
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState({
        video_name: "",
        video_url: "",
    });
    const [video, setVideo] = useState();
    const [videoData, setVideoData] = useState();

    useEffect(() => {
        axios.get(`${API}/Club/GetWorkoutVideo/${gymUser._id}`)
            .then(response => setVideoData(response.data))
            .catch(error => console.error("Error retrieving workout video: " + error));
    }, [gymUser._id, refresh]);

    const handleChange = eventTriggered => {
        const { name, value } = eventTriggered.target;
        setData({
            ...data,
            [name]: value
        });
    };

    const OpenModal = () => {
        setIsOpen(true);
    };

    const OpenPlayerModal = videoID => {
        setPlayerModal(videoID);
    };

    const OpenQrModal = video => {
        setCurrentVideo(video); 
        setQrModal(true); 
    };

    const CloseModal = () => {
        setIsOpen(false);
        setPlayerModal(null);
        setQrModal(false); 
    };

    const UploadVideo = () => {
        const VideoData = new FormData();
        Object.entries(data).forEach(([key, value]) => { VideoData.append(key, value) });
        VideoData.append("Workout_Video", video);
        axios.post(`${API}/Club/UploadVideo/${gymUser._id}`, VideoData)
            .then(response => {
                if(response.data.message === "Video has been uploaded"){
                    toast.success(response.data.message);
                    setRefresh(!refresh);
                    setIsOpen(!modalIsOpen);
                }
                else toast.error(response.data.message)
            })
            .catch(error => {
                toast.error("Error Occured")
                console.error("Error uploading workout video: " + error)
            });
    };

    return (
        <React.Fragment>
            <ToastContainer/>
            <div className="main-box">
                <div className="workout_upper_bar">
                    <button onClick={OpenModal}>Upload Video</button>
                </div>
                <div className="workout_videos">
                    {videoData?.length ? <React.Fragment>
                        {videoData?.map(videos => (
                            <div key={videos._id}>
                                <label onClick={() => OpenPlayerModal(videos._id)}>{videos.video_name}</label>
                                <button onClick={() => OpenQrModal(videos)}>
                                    Generate QR
                                    <img src="./qr_icon.svg" alt="QR Code Icon" />
                                </button>
                                <Modal
                                    isOpen={playerModal === videos._id}
                                    onRequestClose={CloseModal}
                                    className="workout-video-modal"
                                    overlayClassName="workout-modal-overlay">
                                    <ReactPlayer url={videos.video ? `${videos.video}` : `${videos.video_url}`} width='100%' height='100%' controls={true} />
                                </Modal>
                            </div>
                        ))}
                    </React.Fragment> : <p>No Videos Uploaded. Please Upload a Video</p>}
                </div>
            </div>

           
            <Modal
                isOpen={qrModal}
                onRequestClose={CloseModal}
                className="qr-modal"
                overlayClassName="workout-modal-overlay">
                <div className="qr-code-section">
                    {currentVideo && (
                        <QRCodeCanvas
                            value={currentVideo.video? `${currentVideo.video}`:`${currentVideo.video_url}`} 
                            size={256}
                        />
                    )}
                    <label>{currentVideo?.video_name}</label>
                </div>
            </Modal>

           
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={CloseModal}
                className="workout-modal"
                overlayClassName="workout-modal-overlay">
                <div className="workout_videos_upload">
                    <h4>Upload Video</h4>
                    <input name="video_name" value={data.video_name} type="text" placeholder="Enter name of a video" onChange={handleChange} />
                    <input name="video_url" value={data.video_url} type="url" placeholder="Enter Video URL or upload a video" onChange={handleChange} />
                    <input type="file" onChange={e => setVideo(e.target.files[0])} />
                    <button onClick={UploadVideo}>Upload</button>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default Workout;
