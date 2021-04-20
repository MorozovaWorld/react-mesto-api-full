import logo from '../images/logo.svg';
import { Route, Switch, Link } from 'react-router-dom';

function Header({userEmail, handleSingOut}) {

  function singOut() {
    handleSingOut();
  }

  return (
    <header className="header">
      <img src={logo} alt="логотип сайта" className="header__logo" />
      <Switch>
        <Route exact path="/">
          <nav className="header__navigation">
            <p className="header__email">{userEmail}</p>
            <Link className="header__navBtn opacity" to="/signin" onClick={singOut} >Выйти</Link>
          </nav>
        </Route>
        <Route path="/signin">
          <nav className="header__navigation">
            <Link className="header__navBtn header__navBtn_color_white opacity" to="/signup">Регистрация</Link>
          </nav>
        </Route>
        <Route path="/signup">
          <nav className="header__navigation">
            <Link className="header__navBtn header__navBtn_color_white opacity" to="/signin">Войти</Link>
          </nav>
        </Route>
      </Switch>
    </header>
  );
}

export default Header;