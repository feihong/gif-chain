import React, {Fragment} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'


function shuffleArray(a) {
    a = [...a]
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


class StartScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numPlayers: 4,
      selectedProblem: 0,
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleClick() {
    this.props.onStart(this.state.selectedProblem)
  }

  handleChange(evt) {
    let val = evt.target.value
    this.setState({selectedProblem: (val === '') ? null : parseInt(val)})
  }

  render() {
    let {numPlayers, problems} = this.props
    let options = this.props.problems
      .filter(p => p.picts.length >= numPlayers)
      .map((p, i) =>
        <option value={i}>
          {`${p.title} (${p.picts.length})`}
        </option>)

    return <div className='start'>
      <label>Number of players:</label>
      <input
        type='number'
        value={numPlayers}
        onChange={this.props.onPlayerNumChange}
      />
      <label>Problems</label>
      <select onChange={this.handleChange} value={this.state.selectedProblem}>
        {options}
      </select>
      <button
        className="btn btn-default"
        onClick={this.handleClick}
        disabled={this.state.selectedProblem === null}
      >
        Start Game
      </button>
    </div>
  }
}

class MainScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      imageShown: false,
    }
    this.onShowClicked = this.onShowClicked.bind(this)
    this.onGotClicked = this.onGotClicked.bind(this)
  }

  onShowClicked() {
    this.setState({imageShown: true})
  }

  onGotClicked() {
    let max = this.props.picts.length - 1
    if (this.state.index === max) {
      this.props.onDone()
    } else {
      this.setState({imageShown: false, index: this.state.index + 1})
    }
  }

  render() {
    let children
    if (this.state.imageShown) {
      let pict = this.props.picts[this.state.index]
      let src = 'https://giphy.com/embed/' + pict.id
      children = <Fragment>
        <iframe src={src} width='480' height='480' frameBorder='0'
                className='giphy-embed' allowFullScreen
        />
        <button onClick={this.onGotClicked}>OK, I got it!</button>
      </Fragment>
    } else {
      children = <Fragment>
        <p>Take a good look at this GIF, because you'll be describing it to everyone else</p>
        <button onClick={this.onShowClicked}>Show Me!</button>
      </Fragment>
    }

    return <div className='main'>
      {`Player ${this.state.index + 1} of ${this.props.picts.length}`}
      {children}
    </div>
  }
}

class RevealScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      revealed: false,
      index: 0,
    }
    this.onPrevClicked = this.onPrevClicked.bind(this)
    this.onNextClicked = this.onNextClicked.bind(this)
    this.onRevealClicked = this.onRevealClicked.bind(this)
  }

  onRevealClicked() {
    this.setState({revealed: true})
  }

  onPrevClicked() {
    if (this.state.index !== 0) {
      this.setState({index: this.state.index - 1})
    }
  }

  onNextClicked() {
    let max = this.props.picts.length - 1

    if (this.state.index === max) {
      this.props.onDone()
    } else {
      this.setState({index: this.state.index + 1})
    }
  }

  render() {
    let children
    if (this.state.revealed) {
      let pict = this.props.picts[this.state.index]
      let src = 'https://giphy.com/embed/' + pict.id
      let max = this.props.picts.length - 1

      children = <Fragment>
        <div>
          {`Picture ${this.state.index + 1} of ${this.props.picts.length}`}
        </div>
        <iframe src={src} width='480' height='480' frameBorder='0'
                className='giphy-embed' allowFullScreen />
        <div className='label'>{pict.label}</div>
        <div className='buttons'>
          <button onClick={this.onPrevClicked}
                  disabled={this.state.index === 0}>
            Previous
          </button>
          <button onClick={this.onNextClicked}>
            {(this.state.index === max) ? 'Restart' : 'Next'}
          </button>
        </div>
      </Fragment>
    } else {
      children = <Fragment>
        <p>Now, players take turns describing the GIF they saw</p>
        <p>When you come to an agreement on the correct order of the GIFs, hit the button below</p>
        <button onClick={this.onRevealClicked}>Reveal the GIF Chain!</button>
      </Fragment>
    }

    return <div className='main'>
      {children}
    </div>
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numPlayers: 4,
      mode: 'start',    // start | main | reveal
      selectedProblem: null,
      problems: [],
    }
    this.changeNumPlayers = this.changeNumPlayers.bind(this)
    this.onStart = this.onStart.bind(this)
    this.handleMainDone = this.handleMainDone.bind(this)
    this.handleRevealDone = this.handleRevealDone.bind(this)
  }

  componentDidMount() {
    axios.get('/problems').then(res =>
      this.setState({problems: res.data}))
  }

  changeNumPlayers(evt) {
    let num = parseInt(evt.target.value)
    if (num >= 2) {
      this.setState({numPlayers: num})
    }
  }

  onStart(selectedProblem) {
    this.setState({mode: 'main', selectedProblem})
  }

  handleMainDone() {
    this.setState({mode: 'reveal'})
  }

  handleRevealDone() {
    this.setState({mode: 'start'})
  }

  render() {
    let problem

    switch (this.state.mode) {
      case 'start':
        return <StartScreen
          numPlayers={this.state.numPlayers}
          problems={this.state.problems}
          onPlayerNumChange={this.changeNumPlayers}
          onStart={this.onStart}
        />
      case 'main':
        problem = this.state.problems[this.state.selectedProblem]
        return <MainScreen
          picts={shuffleArray(problem.picts)}
          onDone={this.handleMainDone}
        />
      case 'reveal':
        problem = this.state.problems[this.state.selectedProblem]
        return <RevealScreen
          picts={problem ? problem.picts : []}
          onDone={this.handleRevealDone}
        />
      default:
        return <div>ERROR</div>
    }
  }
}

ReactDOM.render(<Game />, document.getElementById('app'))
