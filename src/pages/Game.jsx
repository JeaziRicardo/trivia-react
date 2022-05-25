import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

class Game extends React.Component {
  state = {
    questions: [],
    questionIndex: 0,
    correct: null,
    shuffle: [],
  }

  componentDidMount() {
    this.getQuestions();
  }

  tokenDenied = () => {
    const { history: { push } } = this.props;
    localStorage.removeItem('token');
    push('/');
  }

  getQuestions = async () => {
    const denied = 3;
    const token = localStorage.getItem('token');
    const request = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    const json = await request.json();
    if (json.response_code === denied) return this.tokenDenied();
    this.setState({ questions: json.results }, () => {
      this.shuffleQuestions();
    });
  }

  shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  shuffleQuestions = () => {
    const { questions, questionIndex } = this.state;
    const array = [questions[questionIndex].correct_answer,
      ...questions[questionIndex].incorrect_answers];
    const shuffle = this.shuffleArray(array);
    const correct = shuffle.indexOf(array[0]);
    this.setState({ shuffle, correct });
  }

  render() {
    const { hash, name, score } = this.props;
    const { questions, questionIndex, correct, shuffle } = this.state;
    return (
      <div>
        <header>
          <p data-testid="header-player-name">{ name }</p>
          <p data-testid="header-score">{ score }</p>
          <img
            src={ `https://www.gravatar.com/avatar/${hash}` }
            alt="profileimage"
            data-testid="header-profile-picture"
          />
        </header>
        <main>
          {
            questions.length && (
              <div>
                <p
                  data-testid="question-category"
                >
                  { questions[questionIndex].category }
                </p>
                <p>{ questions[questionIndex].difficulty }</p>
                <p
                  data-testid="question-text"
                >
                  { questions[questionIndex].question }
                </p>
                <div data-testid="answer-options">
                  {
                    shuffle.map((question, i) => (
                      <button
                        key={ i }
                        value={ question }
                        type="button"
                        data-testid={
                          question === shuffle[correct]
                            ? 'correct-answer'
                            : `wrong-answer-${i}`
                        }
                      >
                        { question }
                      </button>
                    ))
                  }
                </div>
              </div>
            )
          }
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.player.name,
  hash: state.player.hash,
  score: state.player.score,
});

Game.propTypes = {
  name: propTypes.string.isRequired,
  hash: propTypes.string.isRequired,
  score: propTypes.number.isRequired,
  history: propTypes.shape({ push: propTypes.func }).isRequired,
};

export default connect(mapStateToProps, null)(Game);