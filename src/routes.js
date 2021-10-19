import {
  useContext,
  useState
} from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import AuthContext from './contexts/AuthContext';
import './index.scss';
import Billing from './pages/Billing/index';
import BillingReport from './pages/BillingReport';
import ClientReport from './pages/ClientReport';
import EnrollBill from './pages/EnrollBill';
import EnrollClient from './pages/EnrollClient';
import EnrollUser from './pages/EnrollUser';
import Home from './pages/Home/index';
import ListClient from './pages/ListClient';
import Login from './pages/Login';

export function RestrictedRoutes(props) {
  const { token } = useContext(AuthContext);

  return (
    <Route render={() => (token ? props.children : <Redirect to='/' />)} />
  );
};

function Routes() {
  const [tokenLS, setTokenLS, removeTokenLS] = useLocalStorage('token', '');
  const [token, setToken] = useState(tokenLS || '');
  const [updateBillingsList, setUpdateBillingsList] = useState(false);
  const [updateClientsList, setUpdateClientsList] = useState(false);
  const [reportBillType, setReportBillType] = useState('');
  const [reportClientType, setReportClientType] = useState('');

  return (
    <AuthContext.Provider
      value={{
        token, setToken,
        tokenLS, setTokenLS, removeTokenLS,
        updateBillingsList, setUpdateBillingsList,
        updateClientsList, setUpdateClientsList,
        reportBillType, setReportBillType,
        reportClientType, setReportClientType
      }}
    >
      <Router>
        <Switch>
          {<Route exact path='/' component={Login} />}
          {<Route path='/cadastro' component={EnrollUser} />}
          {<Route path='/home' component={Home} />}
          {<Route path='/cobrancas' component={Billing} />}
          {<Route path='/clientes' component={ListClient} />}
          {<Route path='/adicionar-cliente' component={EnrollClient} />}
          {<Route path='/criar-cobranca' component={EnrollBill} />}
          {<Route path='/relatorio-cobranca' component={BillingReport} />}
          {<Route path='/relatorio-cliente' component={ClientReport} />}
        </Switch>
      </Router>
    </AuthContext.Provider >
  );
};

export default Routes;