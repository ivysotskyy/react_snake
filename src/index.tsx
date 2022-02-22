import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import {GameBoard} from "./SnakeGame";

const HOST = "http://atlogdev14";
const PORT = "6969";

class Controls extends React.Component<{startGame(userName: string): void}, any> {
    constructor(props: {startGame(userName: string): void}) {
        super(props);
        this.state = {inputValue: null}
    }
    updateInput(evt: any) {
        this.setState({inputValue: evt.target.value});
    }
    render() {
        return (
            <div className={"controls"}>
                <input className={"userName"} onChange={(evt: any) => this.updateInput(evt)} />
                <button className={"startButton"} onClick={(event) => this.props.startGame(this.state.inputValue)} />
            </div>
        );
    }
}

class ScoreBoard extends React.Component<any, {scores: [{user: string, score: number, time: string}] }> {
    constructor(props: any) {
        super(props);
        this.state = {scores: [{user: "", score: 0, time: "0:0"}]};
    }
    componentDidMount() {
        this.updateScores();
    }

    updateScores() {
        fetch(HOST + ":" + PORT + "/get_scores", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: ""
        })
        .then((val: Response) => {
            // @ts-ignore
            return val.json();
        })
        .then((data) => {
            const scores = data.map((s: string, i: number) => JSON.parse(s));

            scores.sort((el1: any, el2: any) => {
                if(el1.score > el2.score) {
                    return -1;
                }else if(el1.score === el2.score) {
                    return 0;
                }else {
                    return 1;
                }
            })
            this.setState({scores: scores});
        })
    }
    render() {
        return (
            <div className={"scoreBoard"}>
                {this.state.scores.map((element, i: number) => {
                    return <div className={"score"} key={i} > {"User: "}<b>{element.user}</b> <br />
                    {"Score: "} <i>{element.score}</i> <br />
                    {"Time played: "} <i>{element.time}</i></div>
                })}
            </div>
        );
    }
}

class App extends React.Component<any, {currentScore: number, currentTime: {min: number, sec: number}, player: string|null}> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentScore: 0,
            currentTime: {min: 0, sec: 0},
            player: null
        }
    }
    onGameStart(player: string|null) {
        console.log(player);
        this.setState({player: player});
        setInterval(() => this.timer(), 1000);
    }
    componentDidMount() {
        this.setState({currentScore: 0, currentTime: {min: 0, sec: 0}});
        //this.onGameStart()
    }

    onScoreUpdateCallback(value: number) {
        this.setState( {currentScore: this.state.currentScore+value});
    }
    saveScore(score: number, playTime: {min: number, sec: number}, user: string|null = "player") {
        fetch(HOST + ":" + PORT + "/save_score", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({user: user, score: score, time: playTime.min + ":" + playTime.sec})
        })
            .then(response => response.json().then(response => {
            console.log(response.status)
        }))
            .catch((err: any) => console.log(err));
    }
    onDeathCallback() {
        let userName: string|null = this.state.player
        if(userName !== null) {
            this.saveScore(this.state.currentScore, this.state.currentTime, userName);
        } else {
            userName = prompt("Want to save your score? ", "Player1");
            if(userName !== null) {
                this.saveScore(this.state.currentScore, this.state.currentTime, userName);
            }
        }
        console.log("Died");
        this.setState({currentScore: 0, currentTime: {min: 0, sec: 0}});
    }

    timer() {
        const time = this.state.currentTime
        if(time.sec === 59) {
            time.min++
            time.sec = 0;
        }else {
            time.sec++
        }
        this.setState({currentTime: time})
    }
    render() {
        return (
            <main>
                <div className={"UI"}>
                    <div className={"currentGameTime"}> {this.state.currentTime.min + " : " + this.state.currentTime.sec}</div>
                    <div className={"currentScore"}> {this.state.currentScore}</div>
                </div>
                <ScoreBoard />
                <GameBoard onScoreUpdate={(val: number) => this.onScoreUpdateCallback(val)} onDeath={() => this.onDeathCallback()} />
                <Controls startGame={this.onGameStart.bind(this)}/>
            </main>
        );
    }
}

function renderGame() {
    ReactDOM.render(
        <App />,
        document.getElementById("root")
    );
}
renderGame();