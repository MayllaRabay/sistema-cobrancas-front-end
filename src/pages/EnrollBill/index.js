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
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function EnrollBill() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  const {
    token, setToken,
    tokenLS
  } = useContext(AuthContext);

  const history = useHistory();

  const [clientId, setClientId] = useState('Selecione um(a) cliente');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isStatus200, setIsStatus200] = useState(false);
  const [listClients, setListClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestResult, setRequestResult] = useState();
  const [status, setStatus] = useState('Selecione um status');
  const [value, setValue] = useState('');

  useEffect(() => {
    setToken(tokenLS);

    if (!token) {
      history.push('/');
      return;
    };

    setIsStatus200(false);

    async function retrieveClients() {
      try {
        setRequestResult();
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

        if (!response.ok) {
          throw new Error(requestData);
        };

        setListClients(requestData);
        setLoading(false);
      } catch (error) {
        setRequestResult(error.message);
      } finally {
        setLoading(false);
      };
    };

    retrieveClients();
  }, [token, setToken, tokenLS, history]);


  async function onSubmit() {
    try {
      const newValue = Number(value.replace(/\./g, '').replace(',', ''));

      if (newValue === 0) {
        setRequestResult('O valor da cobrança deve ser maior que zero.');
        setError('value', { shouldFocus: true });
        return;
      };

      if(clientId === 'Selecione um(a) cliente') {
        setRequestResult('Selecione um cliente válido.');
        setError('clientId', { shouldFocus: true });
        return;
      };

      if(status === 'Selecione um status') {
        setRequestResult('Selecione um status válido.');
        setError('status', { shouldFocus: true });
        return;
      }

      const body = {
        clientId: clientId,
        description: description,
        status: status,
        value: newValue,
        dueDate: dueDate
      };

      setRequestResult();
      setIsStatus200(false);
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

      if (!response.ok) {
        throw new Error(requestData);
      };

      setIsStatus200(true);
      setRequestResult(requestData);
      setLoading(true);
      setTimeout(() => {
        history.push('/cobrancas');
      }, 2000);
    } catch (error) {
      setRequestResult(error.message);
    } finally {
      setLoading(false);
    };
  };

  function handleAlertClose() {
    setRequestResult();
  };

  function cancelButton() {
    history.push('/cobrancas');
  };

  function formatValue(value) {
    if (value.length < 2) {
      setValue(value);
      return;
    };

    const newValue = value.replace(',', '').replace(/\./g, '');
    const centIndex = (newValue.length - 2);
    const thousandIndex = (newValue.length - 5);
    const millionIndex = (newValue.length - 8);

    if(newValue === 3) {
      const finalValue = `${newValue.substr(0, 1)},${newValue.substr(centIndex, 2)}`;
      setValue(finalValue);
      return;
    };

    if (newValue.length >= 9) {
      const finalValue = `${newValue.substr(0, millionIndex)}.${newValue.substr(millionIndex, 3)}.${newValue.substr(thousandIndex, 3)},${newValue.substr(centIndex, 2)}`;
      setValue(finalValue);
      return;
    };

    if (newValue.length >= 6) {
      const finalValue = `${newValue.substr(0, thousandIndex)}.${newValue.substr(thousandIndex, 3)},${newValue.substr(centIndex, 2)}`;
      setValue(finalValue);
      return;
    };

    const finalValue = `${newValue.substr(0, centIndex)},${newValue.substr(centIndex, 2)}`;
    setValue(finalValue);
  };

  /*function formatDate(date) {
    const monthNumber = date.substr(5, 2);
    const monthName = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const newDate = `${date.substr(8, 2)} de ${monthName[monthNumber - 1]} de ${date.substr(0, 4)}`;
    setDueDate(newDate);
  }*/

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
                  {errors.clientId ? <h4 className={styles.input__error}>Cliente</h4> : <h4>Cliente</h4>}
                  <Select
                    {...register('clientId', { required: true })}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    color='secondary'
                    fullWidth
                    variant='outlined'
                    error={!!errors.clientId}
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
                  {errors.clientId && <p className={styles.alert__error}>Por favor selecione um cliente!</p>}
                </label>
              </div>
              <div className={styles.input__wrapper}>
                <label>
                  {errors.description ? <h4 className={styles.input__error}>Descrição</h4> : <h4>Descrição</h4>}
                  <TextField
                    {...register('description', { required: true })}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    color='secondary'
                    fullWidth
                    multiline
                    maxRows={2}
                    variant='outlined'
                    error={!!errors.description}
                  />
                  {errors.description?.type === 'required'
                    ? <p className={styles.alert__error}>O campo Descrição é obrigatório!</p>
                    : <h6>A descrição informada será impressa no boleto</h6>
                  }
                </label>
              </div>
              <div className={styles.input__wrapper}>
                <label>
                  {errors.status ? <h4 className={styles.input__error}>Status</h4> : <h4>Status</h4>}
                  <Select
                    {...register('status', { required: true })}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    color='secondary'
                    fullWidth
                    variant='outlined'
                    error={!!errors.status}
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
                  {errors.status && <p className={styles.alert__error}>Por favor selecione um status!</p>}
                </label>
              </div>
              <div className={styles.input__wrapper}>
                <label className={styles.divided__label}>
                  {errors.value ? <h4 className={styles.input__error}>Valor</h4> : <h4>Valor</h4>}
                  <TextField
                    {...register('value', { required: true, pattern: /^[0-9.,]+$/ })}
                    value={value}
                    onChange={(e) => formatValue(e.target.value)}
                    inputProps={{ maxLength: 12 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>
                    }}
                    color='secondary'
                    placeholder='0,00'
                    variant='outlined'
                    error={!!errors.value}
                  />
                  {errors.value?.type === 'required' && <p className={styles.alert__error}>O campo Valor é obrigatório!</p>}
                  {errors.value?.type === 'pattern' && <p className={styles.alert__error}>O valor deve conter apenas números</p>}
                </label>
                <label className={styles.divided__label}>
                  {errors.dueDate ? <h4 className={styles.input__error}>Vencimento</h4> : <h4>Vencimento</h4>}
                  <TextField
                    type='date'
                    {...register('dueDate', { required: true })}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    /*InputProps={{
                      endAdornment: <InputAdornment position="start">
                        <img src={calendarIcon} alt='' className={styles.calendar__icon} />
                      </InputAdornment>,
                    }}*/
                    color='secondary'
                    variant='outlined'
                    error={!!errors.dueDate}
                  />
                  {errors.dueDate?.type === 'required' && <p className={styles.alert__error}>O campo Vencimento é obrigatório!</p>}
                </label>
              </div>
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

              <Snackbar
                className={styles.snackbar}
                open={!!requestResult}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                onClose={handleAlertClose}
              >
                <Alert severity={isStatus200 ? 'success' : 'error'}>
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
            </form>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default EnrollBill;