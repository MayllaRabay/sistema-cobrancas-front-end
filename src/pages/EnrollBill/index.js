import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem, Select, Snackbar,
  TextField
} from '@mui/material';
import {
  createTheme,
  ThemeProvider
} from '@mui/material/styles';
import {
  useContext,
  useEffect,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import calendarIcon from '../../assets/calendar-icon.svg';
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function EnrollBill() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const {
    token, setToken,
    tokenLS
  } = useContext(AuthContext);

  const history = useHistory();

  const [clientId, setClientId] = useState('Selecione um(a) cliente');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Selecione um status');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [listClients, setListClients] = useState([]);

  const [requestResult, setRequestResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(tokenLS);

    if (!token) {
      history.push('/');
      return;
    };

    async function retrieveClients() {
      setRequestResult('');
      setLoading(true);

      const response = await fetch('https://academy-bills.herokuapp.com/clients/options', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const requestData = await response.json();

      if (response.ok) {
        setListClients(requestData);
        setLoading(false);
        return;
      };

      setRequestResult(requestData);
      setLoading(false);
    }

    retrieveClients();
  }, [token, setToken, tokenLS, history]);


  async function onSubmit() {
    const newValue = Number(value.replace('.', '').replace(',', ''));

    if (newValue === 0) {
      setRequestResult('O valor da cobrança deve ser maior que zero.');
      errors.value = !!errors.value;
      return;
    }

    const body = {
      clientId: clientId,
      description: description,
      status: status,
      value: newValue,
      dueDate: dueDate
    };

    setRequestResult('');
    setLoading(true);

    const response = await fetch('https://academy-bills.herokuapp.com/billings', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const requestData = await response.json();

    if (response.ok) {
      setRequestResult(requestData);
      setLoading(true);
      setTimeout(() => {
        history.push('/cobrancas');
      }, 2000);

      return;
    };

    setRequestResult(requestData);
    setLoading(false);
  };

  function handleAlertClose() {
    setRequestResult('');
  };

  function cancelButton() {
    history.push('/cobrancas');
  };

  function formatValue(value) {
    if (value.length < 3) {
      setValue(value);
      return;
    };

    const newValue = value.replace(',', '').replace('.', '');

    const centIndex = (newValue.length - 2);
    const thousandIndex = (newValue.length - 5);

    if (newValue.length >= 6) {
      const finalValue = `${newValue.substr(0, thousandIndex)}.${newValue.substr(thousandIndex, 3)},${newValue.substr(centIndex, 2)}`;
      setValue(finalValue);
      return;
    }

    const finalValue = `${newValue.substr(0, centIndex)},${newValue.substr(centIndex, 2)}`;

    setValue(finalValue);
  }

  const statusOption = [
    {
      id: 'status_1',
      name: 'Pago'
    },
    {
      id: 'status_2',
      name: 'Pendente'
    }
  ];

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#DA0175'
      }
    }
  });

  const menuItemStyle = {
    color: 'var(--color-gray-800)',
    display: 'flex',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.875rem',
    justifyContent: 'space-between'
  }

  return (
    <div className={styles.content__wrapper}>
      <Navbar />
      <div className={styles.main__content}>
        <UserProfile />
        <div className={styles.content}>
          <ThemeProvider theme={theme}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.input__wrapper}>
                <label>
                  <h4>Cliente</h4>
                  <Select
                    {...register('clientId', { required: true })}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    color='secondary'
                    fullWidth
                    variant='outlined'
                    error={errors.clientId}
                    sx={menuItemStyle}
                  >
                    <MenuItem disabled value='Selecione um(a) cliente' sx={menuItemStyle}>
                      Selecione um(a) cliente
                    </MenuItem>
                    {listClients.map((option) => (
                      <MenuItem key={option.id} value={option.id} className={styles.input__option} sx={menuItemStyle}>
                        <div>{option.name}</div>
                        <div className={styles.option__id}>{`#${option.id}`}</div>
                      </MenuItem>
                    ))}
                  </Select>
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  <h4>Descrição</h4>
                  <TextField
                    {...register('description', { required: true })}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    color='secondary'
                    fullWidth
                    multiline
                    maxRows={2}
                    variant='outlined'
                    error={errors.description}
                  />
                  <h6>A descrição informada será impressa no boleto</h6>
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  <h4>Status</h4>
                  <Select
                    {...register('status', { required: true })}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    color='secondary'
                    fullWidth
                    variant='outlined'
                    error={errors.status}
                    sx={menuItemStyle}
                  >
                    <MenuItem disabled value='Selecione um status' sx={menuItemStyle}>
                      Selecione um status
                    </MenuItem>
                    {statusOption.map((option) => (
                      <MenuItem key={option.id} value={option.name} sx={menuItemStyle}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label className={styles.divided__label}>
                  {errors.value ? <h4 className={styles.input__error}>Valor</h4> : <h4>Valor</h4>}
                  <TextField
                    {...register('value', { required: true, pattern: /^[0-9.,]+$/ })}
                    value={value}
                    onChange={(e) => formatValue(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    color='secondary'
                    placeholder='0,00'
                    variant='outlined'
                    error={!!errors.value}
                  />
                  {errors.value?.type === 'pattern' && <p className={styles.alert__error}>O valor deve conter apenas números</p>}
                </label>

                <label className={styles.divided__label}>
                  <h4>Vencimento</h4>
                  <TextField
                    type='date'
                    {...register('dueDate', { required: true })}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="start">
                        <img src={calendarIcon} alt='' className={styles.calendar__icon} />
                      </InputAdornment>,
                    }}
                    color='secondary'
                    variant='outlined'
                    error={errors.dueDate}
                  />
                </label>
              </div>

              <Snackbar
                className={styles.snackbar}
                open={!!requestResult}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                onClose={handleAlertClose}
              >
                <Alert severity={requestResult === 'Cobrança cadastrada com sucesso.' ? 'success' : 'error'}>
                  {requestResult}
                </Alert>
              </Snackbar>

              <div className={styles.button__wrapper}>
                <Button
                  className={`${styles.button__states} ${styles.button__cancel}`}
                  onClick={cancelButton}
                >
                  Cancelar
                </Button>
                <Button
                  className={styles.button__states}
                  type='submit'
                  disabled={!clientId || !description || !status || !value || !dueDate
                    || clientId === 'Selecione um(a) cliente' || status === 'Selecione um status'
                  }
                  variant='contained'
                >
                  Criar Cobrança
                </Button>
              </div>

              <Backdrop
                sx={{
                  color: 'var(--color-white)',
                  zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={loading}
              >
                <CircularProgress color='inherit' />
              </Backdrop>
            </form>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default EnrollBill;