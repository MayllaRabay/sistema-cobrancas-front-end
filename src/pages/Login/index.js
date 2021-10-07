import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
  TextField
} from '@mui/material';
import {
  useContext,
  useEffect,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import {
  Link,
  useHistory
} from 'react-router-dom';
import academy from '../../assets/logo-academy.svg';
import AuthContext from '../../contexts/AuthContext';
import PasswordInput from './../../components/PasswordInput';
import styles from './styles.module.scss';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const {
    token, setToken,
    tokenLS, setTokenLS
  } = useContext(AuthContext);

  const history = useHistory();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (tokenLS) {
      if (!token) {
        setToken(tokenLS);
      };
      history.push('./home');

      return;
    };
  }, []);

  async function onSubmit(data) {
    const body = {
      email: email,
      password: password
    };

    setRequestError('');

    setLoading(true);

    try {
      const response = await fetch('https://academy-bills.herokuapp.com/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const requestData = await response.json();

      if (response.ok) {
        setToken(requestData.token);

        setTokenLS(requestData.token);

        history.push('/home');

        return;
      };

      setRequestError(requestData);
    } catch (error) {
      setRequestError(error.message);
    };

    setLoading(false);
  };

  function handleAlertClose() {
    setRequestError('');
  };

  return (
    <div className={styles.content__wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <img src={academy} alt='Logo Academy' />
        <label>
          {errors.email ? <h4 className={styles.input__error}>E-mail</h4> : <h4>E-mail</h4>}
          <TextField
            placeholder='exemplo@gmail.com'
            {...register('email', { required: true })}
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant='standard'
            error={errors.email}
          />
          {errors.email && <p>O campo E-mail é obrigatório!</p>}
        </label>
        <label>
          {errors.password ? <h4 className={styles.input__error}>Senha</h4> : <h4>Senha</h4>}
          <PasswordInput
            register={() => register('password', { required: true })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.password__input}
            variant='standard'
            error={errors.password}
          />
          {errors.email && <p>O campo Senha é obrigatório!</p>}
        </label>

        <Snackbar
          className={styles.snackbar}
          open={!!requestError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={3000}
          onClose={handleAlertClose}
        >
          <Alert severity='error'>
            {requestError}
          </Alert>
        </Snackbar>

        <Button
          className={styles.button__states}
          type='submit'
          disabled={!email || !password}
          variant='contained'
        >
          Entrar
        </Button>

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

      <footer>
        Ainda não possui uma conta? <Link to='/cadastro'>Crie agora!</Link>
      </footer>
    </div>
  );
};

export default Login;