import * as React from "react";
import * as _ from "lodash";

enum directions {
    UP, DOWN, LEFT, RIGHT
}
const gameSpeed = 180
const blockSize = 25;
const boardWidth = 800;
const boardHeight = 650;
const moveDistance = blockSize * 1;

class Block extends React.Component<any, {left: number, top: number}> {
    constructor(props: {left: number, top: number, id: number}) {
        super(props);
        this.state = {left: props.left || 0, top: props.top || 0};
    }

    render() {
        return (
            <div key={this.props.id} style={{width: blockSize, height: blockSize, left: this.props.left, top: this.props.top}}
        className={"block"}
            >{this.props.value}</div>
        )
    }
}

const initialState = {
    direction: directions.RIGHT,
    snake: [{x: 50, y: 100}, {x:75, y: 100}, {x: 100, y: 100}, {x: 125, y: 100}, {x: 150, y: 100}],
    food: {x: 625, y: 450}
}
export class GameBoard extends React.Component<{onScoreUpdate: Function, onDeath: Function}, {direction: directions, snake: {x:number, y:number}[], food: {x:number, y:number}}> {
    constructor(props: any) {
        super(props);
        this.state = initialState;
    }
    changeDirection(event: KeyboardEvent) {
        switch(event.code) {
            case "ArrowUp":
                if(this.state.direction != directions.DOWN)
                    this.setState({direction: directions.UP});
                break;
            case "ArrowDown":
                if(this.state.direction != directions.UP)
                    this.setState({direction: directions.DOWN});
                break;
            case "ArrowLeft":
                if(this.state.direction != directions.RIGHT)
                    this.setState({direction: directions.LEFT});
                break;
            case "ArrowRight":
                if(this.state.direction != directions.LEFT)
                    this.setState({direction: directions.RIGHT});
                break;
        }
    }
    componentDidMount() {
        document.onkeydown = (event) => {this.changeDirection(event)}
        setInterval(() => this.move(), gameSpeed);
    }

    move() {
        this.consume();

        const temp = [...this.state.snake];
        const tail = temp.slice(0, temp.length-2);
        const head = this.state.snake[this.state.snake.length-1];
        let moveVector = {x: 0, y: 0};
        switch (this.state.direction) {
            case directions.LEFT:
                moveVector.x = -moveDistance;
                break;
            case directions.RIGHT:
                moveVector.x = +moveDistance;
                break;
            case directions.UP:
                moveVector.y = -moveDistance;
                break;
            case directions.DOWN:
                moveVector.y = +moveDistance
                break;
        }


        if(head.y+moveVector.y >= boardHeight) {
            head.y = 0-blockSize;
            temp.shift();
            temp.push({x: head.x+moveVector.x, y: head.y+moveVector.y});
            temp.splice(temp.length-1, 0, {x: head.x, y: boardHeight-blockSize});
            this.setState({snake: [...temp]});
            temp.shift();
            this.setState({snake: [...temp]});
        }
        if(head.x+moveVector.x >= boardWidth) {
            head.x = 0-blockSize;
            temp.shift();
            temp.push({x: head.x+moveVector.x, y: head.y+moveVector.y});
            temp.splice(temp.length-1, 0, {x: boardWidth-blockSize, y: head.y});
            this.setState({snake: [...temp]});
            temp.shift();
            this.setState({snake: [...temp]});
        }
        if(head.y+moveVector.y < 0) {
            head.y = boardHeight;
            temp.shift();
            temp.push({x: head.x+moveVector.x, y: head.y+moveVector.y});
            temp.splice(temp.length-1, 0, {x: head.x, y: 0});
            this.setState({snake: [...temp]});
            temp.shift();
            this.setState({snake: [...temp]});
        }
        if(head.x+moveVector.x < 0) {
            head.x = boardWidth;
            temp.shift();
            temp.push({x: head.x+moveVector.x, y: head.y+moveVector.y});
            temp.splice(temp.length-1, 0, {x: 0, y: head.y});
            this.setState({snake: [...temp]});
            temp.shift();
            this.setState({snake: [...temp]});
        }else if(_.some(tail, {...head})) {
            this.props.onDeath();
            this.setState(initialState);
        }else {
            temp.shift();
            temp.push({x: head.x+moveVector.x, y: head.y+moveVector.y});
            this.setState({snake: [...temp]});
        }
    }

    consume() {
        if(_.isEqual(this.state.snake[this.state.snake.length - 1], this.state.food)) {
            this.props.onScoreUpdate(1);
            this.setState({food: {x: Math.floor(Math.random()*32)*25, y: Math.floor(Math.random()*26)*25}});
            this.state.snake.unshift({x: this.state.snake[0].x, y: this.state.snake[0].y});
        }
    }
    render() {
        return(
            <div className={"GameBoard"}
        style={{height: boardHeight, width: boardWidth}}
    >
        {
            this.state.snake.map((pos, i) => {
                if(i == this.state.snake.length-1) {
                    return <Block key={i} value={"°_°"} left={pos.x} top={pos.y} />
                }
                return <Block key={i} value={"<|>"} left={pos.x} top={pos.y} />
            })
        }
        <div className={"food"} style={{left: this.state.food.x, top: this.state.food.y}} > {"$"} </div>
        </div>
    )
    }
}