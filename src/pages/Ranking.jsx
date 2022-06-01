import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Ranking.css';
import logo from '../trivia.png';

class Ranking extends React.Component {
  state = {
    ranking: [],
  }

  componentDidMount() {
    const RankingToLocalStorage = JSON.parse(localStorage.getItem('ranking'));
    this.setState({ ranking: RankingToLocalStorage.sort((a, b) => b.score - a.score) });
  }

  backToLogin = () => {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    const { ranking } = this.state;
    return (
      <>
        <header data-testid="ranking-title">
          <img src={ logo } alt="logo-trivia" />
          <h1>Ranking</h1>
          <button
            type="button"
            data-testid="btn-go-home"
            onClick={ this.backToLogin }
          >
            Login
          </button>
        </header>
        <main>
          <div className="container-ranking">
            <ul>
              { ranking.length !== 0 && (
                ranking.map((player, index) => (
                  <li key={ index }>
                    <p>{ index + 1 }</p>
                    <img src={ player.picture } alt={ `Foto de ${player.name}` } />
                    <p data-testid={ `player-name-${index}` }>{player.name}</p>
                    <p data-testid={ `player-score-${index}` }>{player.score}</p>
                  </li>))
              ) }
            </ul>
          </div>
        </main>
      </>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Ranking;
