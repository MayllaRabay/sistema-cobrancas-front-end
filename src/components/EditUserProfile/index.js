import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Modal,
  Snackbar,
  TextField
} from '@mui/material';
import {
  useContext,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import closeIcon from '../../assets/close-icon.svg';
import AuthContext from '../../contexts/AuthContext';
import PasswordInput from './../../components/PasswordInput';
import styles from './styles.module.scss';

function EditUserProfile({ user }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { token } = useContext(AuthContext);

  const [email, setEmail] = useState(user.current.email);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user.current.name);
  const [open, setOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(user.current.phone
    ? `(${user.current.phone.substr(0, 2)})${user.current.phone.substr(2, 5)}-${user.current.phone.substr(7)}`
    : ''
  );
  const [requestResult, setRequestResult] = useState();
  const [taxId, setTaxId] = useState(user.current.tax_id
    ? `${user.current.tax_id.substr(0, 3)}.${user.current.tax_id.substr(3, 3)}.${user.current.tax_id.substr(6, 3)}-${user.current.tax_id.substr(9, 2)}`
    : ''
  );
  const [isStatus200, setIsStatus200] = useState(false);

  async function onSubmit() {
    try {
      if (user.current.phone && phone === '') {
        setPhone('');
      };

      if (user.current.tax_id && taxId === '') {
        setTaxId('');
      };

      const newPhone = phone.replace('(', '').replace(')', '').replace('-', '');
      const newTaxId = taxId.replace(/\./g, '').replace('-', '');

      const body = {
        name: name,
        email: email,
        password: password === '' ? user.current.password : password,
        phone: phone === '' ? phone : newPhone,
        taxId: taxId === '' ? taxId : newTaxId
      };

      setRequestResult();
      setIsStatus200(false);
      setLoading(true);

      const response = await fetch('https://academy-bills.herokuapp.com/profile', {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const requestData = await response.json();

      if (!response.ok) {
        setRequestResult(requestData);
        return;
      };

      setIsStatus200(true);
      setRequestResult(requestData);
      setTimeout(() => {
        setOpen(!open);
      }, 2000);
    } catch (error) {
      setRequestResult(error.messsage);
    } finally {
      setLoading(false);
    };
  };

  function handleAlertClose() {
    setRequestResult();
  };

  function handleModalClose() {
    setIsStatus200(false);
    setOpen(!open);
  };

  function formatPhone(phone) {
    const newPhone = phone.replace('(', '').replace(')', '').replace('-', '');

    if (newPhone.length === 0) {
      setPhone('');
      return;
    };

    if (newPhone.length <= 2) {
      const finalPhone = `(${newPhone.substr(0, 2)}`;
      setPhone(finalPhone);
      return;
    };

    if (newPhone.length === 10) {
      const finalPhone = `(${newPhone.substr(0, 2)})${newPhone.substr(2, 4)}-${newPhone.substr(6)}`;
      setPhone(finalPhone);
      return;
    };

    if (newPhone.length > 8) {
      const finalPhone = `(${newPhone.substr(0, 2)})${newPhone.substr(2, 5)}-${newPhone.substr(7)}`;
      setPhone(finalPhone);
      return;
    };

    const finalPhone = `(${newPhone.substr(0, 2)})${newPhone.substr(2, (newPhone.length - 2))}`;
    setPhone(finalPhone);
  }

  function formatTaxId(taxId) {
    const newTaxId = taxId.replace(/\./g, '').replace('-', '');

    if (newTaxId.length <= 3) {
      setTaxId(newTaxId);
      return;
    };

    if (newTaxId.length >= 10) {
      const finalTaxId = `${newTaxId.substr(0, 3)}.${newTaxId.substr(3, 3)}.${newTaxId.substr(6, 3)}-${newTaxId.substr(9, (newTaxId.length - 9))}`;
      setTaxId(finalTaxId);
      return;
    };

    if (newTaxId.length >= 7) {
      const finalTaxId = `${newTaxId.substr(0, 3)}.${newTaxId.substr(3, 3)}.${newTaxId.substr(6, newTaxId.length - 6)}`;
      setTaxId(finalTaxId);
      return;
    };

    if (newTaxId.length >= 4) {
      const finalTaxId = `${newTaxId.substr(0, 3)}.${newTaxId.substr(3, (newTaxId.length - 3))}`;
      setTaxId(finalTaxId);
      return;
    };
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      className={styles.content__wrapper}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <img src={closeIcon} alt='' onClick={handleModalClose} />
        <label>
          <h4>Nome</h4>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant='standard'
          />
        </label>
        <label>
          <h4>E-mail</h4>
          <TextField
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant='standard'
          />
        </label>
        <label>
          {errors.password ? <h4 className={styles.input__error}>Nova senha</h4> : <h4>Nova senha</h4>}
          <PasswordInput
            register={() => register('password', { minLength: 5 })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.password__input}
            variant='standard'
            error={!!errors.password}
          />
          {errors.password?.type === 'minLength'
            ? <p>A senha deve conter no mínimo 5 caracteres</p>
            : <p className={styles.input__warning}>Deixe o campo vazio para não editar sua senha atual</p>
          }
        </label>
        <label>
          {errors.phone ? <h4 className={styles.input__error}>Telefone</h4> : <h4>Telefone</h4>}
          <TextField
            {...register('phone', { minLength: 13, maxLength: 14, pattern: /^[0-9()-]+$/i })}
            value={phone}
            onChange={(e) => formatPhone(e.target.value)}
            inputProps={{ maxLength: 14 }}
            placeholder='(71)9999-9999'
            variant='standard'
            error={!!errors.phone}
          />
          {(errors.phone?.type === 'minLength' || errors.phone?.type === 'maxLength')
            && <p>O telefone deve conter entre 10 a 11 caracteres</p>
          }
          {errors.phone?.type === 'pattern' && <p>O telefone deve conter apenas números</p>}
        </label>
        <label>
          {errors.tax_id ? <h4 className={styles.input__error}>CPF</h4> : <h4>CPF</h4>}
          <TextField
            {...register('tax_id', { minLength: 14, maxLength: 14, pattern: /^[0-9.-]+$/i })}
            value={taxId}
            onChange={(e) => formatTaxId(e.target.value)}
            inputProps={{ maxLength: 14 }}
            placeholder='000.000.000-00'
            variant='standard'
            error={!!errors.tax_id}
          />
          {(errors.tax_id?.type === 'minLength' || errors.tax_id?.type === 'maxLength')
            && <p>O CPF deve conter 11 caracteres</p>
          }
          {errors.tax_id?.type === 'pattern' && <p>O CPF deve conter apenas números</p>}
        </label>
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
        <Button
          className={styles.button__states}
          type='submit'
          disabled={!name || !email}
          variant='contained'
        >
          Editar conta
        </Button>
        <Backdrop sx={{
          color: 'var(--color-white)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
          open={loading}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </form>
    </Modal>
  );
};

export default EditUserProfile;