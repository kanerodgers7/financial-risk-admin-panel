import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import history from './History';
import { saveTokenFromLocalStorageToSession } from '../helpers/LocalStorageHelper';
import Loader from '../common/Loader/Loader';
import { AuthenticatedRoute } from './AuthenticatedRoutes';
import { ROUTES_CONSTANTS } from './constants/RoutesConstants';
import { NonAuthenticatedRoute } from './NonAuthenticatedRoutes';

function Routes() {
  useEffect(() => {
    saveTokenFromLocalStorageToSession();
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Router history={history}>
        <Switch>
          {ROUTES_CONSTANTS.map(({ path, component, authenticated }) => {
            const Component = authenticated ? AuthenticatedRoute : NonAuthenticatedRoute;

            return <Component key={path} exact path={path} component={component} />;
          })}
        </Switch>
      </Router>
    </Suspense>
  );
}

export default Routes;
