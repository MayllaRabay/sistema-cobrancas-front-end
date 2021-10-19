import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
  TextField
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Link,
  useHistory
} from 'react-router-dom';
import academy from '../../assets/logo-academy.svg';
import PasswordInput from './../../components/PasswordInput';
import styles from './styles.module.scss';

function EnrollUser() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const history = useHistory();

  const [email, setEmail] = useState('');
  const [isStatus200, setIsStatus200] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [requestResult, setRequestResult] = useState('');

  async function onSubmit(data) {
    try {
      const body = {
        name: name,
        email: email,
        password: password
      };

      setRequestResult();
      setIsStatus200(false);
      setLoading(true);

      const response = await fetch('https://academy-bills.herokuapp.com/users', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
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
        history.push('/');
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

  return (
    <div className={styles.content__wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <img src={academy} alt='Logo Academy' />
        <label>
          {errors.name ? <h4 className={styles.input__error}>Nome</h4> : <h4>Nome</h4>}
          <TextField
            {...register('name', { required: true })}
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant='standard'
            fullWidth
            error={!!errors.name}
          />
          {errors.name && <p>O campo Nome é obrigatório!</p>}
        </label>
        <label>
          {errors.email ? <h4 className={styles.input__error}>E-mail</h4> : <h4>E-mail</h4>}
          <TextField
            {...register('email', { required: true })}
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='exemplo@email.com'
            variant='standard'
            fullWidth
            error={!!errors.email}
          />
          {errors.email && <p>O campo E-mail é obrigatório!</p>}
        </label>
        <label>
          {errors.password ? <h4 className={styles.input__error}>Senha</h4> : <h4>Senha</h4>}
          <PasswordInput
            register={() => register('password', { required: true, minLength: 5 })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.password__input}
            variant='standard'
            fullWidth
            error={!!errors.password}
          />
          {errors.password?.type === 'required' && <p>O campo Senha é obrigatório!</p>}
          {errors.password?.type === 'minLength' && <p>A senha deve conter no mínimo 5 caracteres</p>}
        </label>
        <Button
          className={styles.button__states}
          type='submit'
          disabled={!name || !email || !password}
          variant='contained'>Criar conta
        </Button>

        <Snackbar
          className={styles.snackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={!!requestResult}
          autoHideDuration={3000}
          onClose={handleAlertClose}>
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
      <footer>
        Já possui uma conta? <Link to='/'>Acesse agora!</Link>
      </footer>
    </div>
  );
};

export default EnrollUser;