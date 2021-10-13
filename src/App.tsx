import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import routes from './routes'

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          {routes.map((e) => (
            <Route key={e.path} path={e.path} exact component={e.component} />
          ))}
          <Redirect to='/home' />
        </Switch>
      </Router>
    </div>
  )
}

export default App
