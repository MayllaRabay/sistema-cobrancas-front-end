import {
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  useContext,
  useEffect,
  useState
} from 'react';
import { useHistory } from 'react-router';
import billIcon from '../../assets/card-billing-icon.svg';
import clientIcon from '../../assets/card-client-icon.svg';
import CardHome from '../../components/CardHome';
import CardHomeItem from '../../components/CardHomeItem';
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function Home() {
  const { 
    token, setToken, tokenLS, 
    setReportBillType, setReportClientType
  } = useContext(AuthContext);

  const history = useHistory();

  const [overdueClients, setOverdueClients] = useState(0);
  const [onTimeClients, setOnTimeClients] = useState(0);
  const [overdueBillings, setOverdueBillings] = useState(0);
  const [dueBillings, setDueBillings] = useState(0);
  const [paidBillings, setPaidBillings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requestResult, setRequestResult] = useState();

  useEffect(() => {
    setToken(tokenLS);

    if (!token) {
      history.push('/');
      return;
    };

    async function retrieveData() {
      try {
        setRequestResult();
        setLoading(true);

        const response = await fetch('https://academy-bills.herokuapp.com/management', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const requestData = await response.json();

        if (!response.ok) {
          throw new Error(requestData);
        };

        setOverdueClients(requestData.overdueClients);
        setOnTimeClients(requestData.onTimeClients);
        setOverdueBillings(requestData.overdueBillings);
        setDueBillings(requestData.dueBillings);
        setPaidBillings(requestData.paidBillings);
      } catch (error) {
        setRequestResult(error.message);
      } finally {
        setLoading(false);
      };
    };

    retrieveData();
  }, [token, setToken, tokenLS, history]);

  function handleAlertClose() {
    setRequestResult();
  };

  function handleClientReports(e) {
    if(e.target.id === 'Inadimplentes') {
      setReportClientType('Inadimplentes');
    };

    if(e.target.id === 'Em dia') {
      setReportClientType('Em dia');
    };

    history.push('/relatorio-cliente');
  };

  function handleBillReports(e) {
    if(e.target.id === 'Vencidas') {
      setReportBillType('Vencidas');
    };

    if(e.target.id === 'Previstas') {
      setReportBillType('Previstas');
    };

    if(e.target.id === 'Pagas') {
      setReportBillType('Pagas');
    };

    history.push('/relatorio-cobranca');
  };

  return (
    <div className={styles.content__wrapper}>
      <Navbar />
      <div className={styles.main__content}>
        <UserProfile />
        <div className={styles.cards}>
          <CardHome
            key='client'
            icon={clientIcon}
            title='Clientes'
            CardHomeItem={[
              <CardHomeItem
                key='client_overdue'
                className={styles.item__red}
                onClick={(e) => handleClientReports(e)}
                title='Inadimplentes'
                id='Inadimplentes'
                number={overdueClients}
              />,
              <CardHomeItem
                key='client_onTime'
                className={styles.item__green}
                onClick={(e) => handleClientReports(e)}
                title='Em dia'
                id='Em dia'
                number={onTimeClients}
              />
            ]}
          />
          <CardHome
            key='bill'
            icon={billIcon}
            title='Cobranças'
            CardHomeItem={[
              <CardHomeItem
                key='bill_item_1'
                className={styles.item__red}
                onClick={(e) => handleBillReports(e)}
                title='Vencidas'
                id='Vencidas'
                number={Number((overdueBillings / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />,
              <CardHomeItem
                key='bill_item_2'
                className={styles.item__blue}
                onClick={(e) => handleBillReports(e)}
                title='Previstas'
                id='Previstas'
                number={Number((dueBillings / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />,
              <CardHomeItem
                key='bill_item_3'
                className={styles.item__green}
                onClick={(e) => handleBillReports(e)}
                title='Pagas'
                id='Pagas'
                number={Number((paidBillings / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />
            ]}
          />
          <Snackbar
            className={styles.snackbar}
            open={!!requestResult}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={3000}
            onClose={handleAlertClose}
          >
            <Alert severity='error'>
              {requestResult}
            </Alert>
          </Snackbar>
          <Backdrop
            sx={{
              color: 'var(--color-white)',
              zIndex: (theme) => theme.zIndex.drawer + 1
            }}
            open={loading}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
        </div>
      </div>
    </div>
  );
};

export default Home;