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

function range(start, end) {
  let size = end - start + 1
  if (size <= 0) {
    return []
  }
  return [...Array(size).keys()].map(i => i + start)
}


class StartScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numPlayers: props.numPlayers,
      selectedProblem: 0,
    }
  }

  handleClick = () => {
    this.props.onStart(this.state.selectedProblem)
  }

  handleProblemChange = (evt) => {
    let val = evt.target.value
    this.setState({selectedProblem: (val === '') ? null : parseInt(val)})
  }

  handleNumChange = (evt) => {
    let numPlayers = parseInt(evt.target.value)
    let problems = this.props.problems
    let problem = problems[this.state.selectedProblem]
    let selectedProblem = (problem.picts.length < numPlayers)
      ? problems.findIndex(p => p.picts.length >= numPlayers)
      : this.state.selectedProblem
    this.setState({numPlayers, selectedProblem})
    this.props.onPlayerNumChange(numPlayers)
  }

  render() {
    let {problems} = this.props
    let {numPlayers} = this.state
    let maxPlayers =
      problems.length === 0
      ? 0
      : Math.max(...problems.map(p => p.picts.length))

    let playerOptions = range(3, maxPlayers)
      .map(num => <option key={num} value={num}>{num}</option>)

    let options = problems
      .filter(p => p.picts.length >= numPlayers)
      .map((p, i) =>
        <option key={i} value={i}>
          {`${p.title} (${p.picts.length})`}
        </option>)

    return <div className='start'>
      <label>Number of players:</label>
      <select value={numPlayers} onChange={this.handleNumChange}>
        {playerOptions}
      </select>
      <label>Problems</label>
      <select onChange={this.handleProblemChange} value={this.state.selectedProblem}>
        {options}
      </select>
      <button
        className="btn btn-default"
        onClick={this.handleClick}
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
      currentPicts: [],
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

  changeNumPlayers(num) {
    this.setState({numPlayers: num})
  }

  onStart(selectedProblem) {
    let problem = this.state.problems[selectedProblem]
    let currentPicts = problem.picts.slice(0, this.state.numPlayers)
    this.setState({mode: 'main', selectedProblem, currentPicts})
  }

  handleMainDone() {
    this.setState({mode: 'reveal'})
  }

  handleRevealDone() {
    this.setState({mode: 'start'})
  }

  render() {
    switch (this.state.mode) {
      case 'start':
        return <StartScreen
          numPlayers={this.state.numPlayers}
          problems={this.state.problems}
          onPlayerNumChange={this.changeNumPlayers}
          onStart={this.onStart}
        />
      case 'main':
        return <MainScreen
          picts={shuffleArray(this.state.currentPicts)}
          onDone={this.handleMainDone}
        />
      case 'reveal':
        return <RevealScreen
          picts={this.state.currentPicts}
          onDone={this.handleRevealDone}
        />
      default:
        return <div>ERROR</div>
    }
  }
}

ReactDOM.render(<Game />, document.getElementById('app'))
