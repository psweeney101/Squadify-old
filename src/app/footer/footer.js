import React from "react";
import Status from "./status";
import Navigation from "./navigation";
import Player from "./player.js";

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0
        }
        props.socket.on("player updated", (player) => {
            if (player != null && player.item != null) {
                this.setState({ width: (player.progress_ms / player.item.duration_ms) * 100 + "%" });
                if (player.is_playing) {
                    var counter = 0;
                    var time_delay = 250;
                    var start = new Date();
                    var interval = setInterval(() => {
                        if (counter < ((2000 / time_delay) - 1) && (new Date() - start <= 2000)) {
                            this.setState({ width: ((player.progress_ms + (time_delay * (counter + 1))) / player.item.duration_ms) * 100 + "%" });
                            counter++;
                        } else {
                            clearInterval(interval);
                        }
                    }, time_delay);
                }
            } else {
                this.setState({ width: 0 });
            }
        });
    }
    render() {
        this.top = null;
        if (this.props.Squadify.queue.status === "inactive" || this.props.Squadify.queue.status === "reconnecting") {
            this.top = <Status Squadify={this.props.Squadify} socket={this.props.socket} />;
        } else if (this.props.Squadify.queue.status === "active") {
            this.top = <Player Squadify={this.props.Squadify} socket={this.props.socket} />;
        } else {
            this.top = <div>Loading...</div>
        }
        return (
            <div className="ui five column padded grid" style={footer}>
                <div className="ui top attached progress" style={progress}>
                    <div className="bar" style={{ height: "5px", minWidth: "0px", width: this.state.width }} />
                </div>
                {this.top}
                <Navigation Squadify={this.props.Squadify} pages={this.props.pages} />
            </div>
        );
    }
}
//<Progress percent={this.props.player.progress} attached='top' style={progress} />

var progress = {
    width: "100%",
    height: ".1em"
}

var footer = {
    width: "100%",
    height: "100px",
    color: "white",
    position: "fixed",
    bottom: "0px",
    backgroundColor: "#282828",
    margin: "auto"
}

export default Footer;