import React from "react";
import './home.css';

const Home = () => {
    return(
        <React.Fragment>
            <div className="main-box" style={{width:'81vw', float:'right'}}>
                <div className="stats">
                    <div>
                        <h2>32</h2>
                        <p>Total Clubs</p>
                    </div>
                    <hr/>
                    <div>
                        <h2>22</h2>
                        <p>Active Clubs</p>
                    </div>
                    <hr/>
                    <div>
                        <h2>52</h2>
                        <p>Total Enthusiasts</p>
                    </div>
                    <hr/>
                    <div>
                        <h2>12</h2>
                        <p>Active Enthusiasts</p>
                    </div>
                </div>

                <div className="total-clubs">
                    <h2>Total Clubs</h2>
                    <div className="club-history-box">
                        <div className="actual-history">
                            <img src="./titan.png" alt="Gym Profile"/>
                            <h3>The Titan Fitness</h3>
                            <p>Active</p>
                        </div>
                    </div>
                </div>

                 <div className="total-clubs">
                    <h2>Total Enthusiasts</h2>
                    <div className="club-history-box">
                        <div className="actual-history">
                            <img src="./titan.png" alt="User Profile"/>
                            <h3>Laksh Wadhwani</h3>
                            <p>Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home