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
  createTheme,
  ThemeProvider
} from '@mui/material/styles';
import {
  useContext,
  useEffect,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import closeIcon from '../../assets/close-icon.svg';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

const ModalEditClient = ({ client, openEditModal, setOpenEditModal }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const {
    setUpdateClientsList,
    token,
    setResetModal
  } = useContext(AuthContext);

  const [addressDetails, setAddressDetails] = useState(client.address_details ? client.address_details : '');
  const [city, setCity] = useState(client.city ? client.city : '');
  const [district, setDistrict] = useState(client.district ? client.district : '');
  const [email, setEmail] = useState(client.email ? client.email : '');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(client.name ? client.name : '');
  const [number, setNumber] = useState(client.number ? client.number : '');
  const [phone, setPhone] = useState(`(${client.phone.substr(0, 2)})${client.phone.substr(2, 5)}-${client.phone.substr(7)}`);
  const [reference, setReference] = useState(client.reference ? client.reference : '');
  const [requestError, setRequestError] = useState();
  const [state, setState] = useState(client.state ? client.state : '');
  const [street, setStreet] = useState(client.street ? client.street : '');
  const [taxId, setTaxId] = useState(`${client.tax_id.substr(0, 3)}.${client.tax_id.substr(3, 3)}.${client.tax_id.substr(6, 3)}-${client.tax_id.substr(9, 2)}`);
  const [zipCode, setZipCode] = useState(client.zip_code ? client.zip_code : '');
  const [zipCodeError, setZipCodeError] = useState('');

  useEffect(() => {
    if (zipCode !== client.zip_code) {
      setZipCodeError('');

      setStreet('');

      setDistrict('');

      setCity('');

      setState('');

      async function retrieveAddress() {

        try {
          setLoading(true);

          const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);

          if (response.ok) {
            const requestData = await response.json();

            if (requestData.erro) {
              throw new Error('Falha ao encontrar o cep!')
            }

            setZipCodeError('');

            setStreet(requestData.logradouro);

            setDistrict(requestData.bairro);

            setCity(requestData.localidade);

            setState(requestData.uf);

            return;

            setZipCodeError('CEP inválido.');
          }
        } catch (error) {
          setZipCodeError(error.message);
        } finally {
          setLoading(false);
        }
      };

      if (zipCode.length === 8 && !!Number(zipCode)) {
        retrieveAddress();
      };

    };
  }, [client.zip_code, zipCode, openEditModal]);

  async function onSubmit() {
    try {
      if (!!zipCodeError) {
        return;
      };

      const newPhone = phone.replace('(', '').replace(')', '').replace('-', '');

      const newTaxId = taxId.replace(/\./g, '').replace('-', '');

      const body = {
        name: name,
        email: email,
        taxId: newTaxId,
        phone: newPhone,
        zipCode: zipCode && zipCode,
        street: street && street,
        number: number && number,
        addressDetails: addressDetails && addressDetails,
        district: district && district,
        reference: reference && reference,
        city: city && city,
        state: state && state
      };

      setRequestError('');
      setLoading(true);

      const response = await fetch(`https://academy-bills.herokuapp.com/clients/${client.id}`, {
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
        throw new Error(requestData);
      };

      setRequestError(requestData);
      setLoading(true);

      setTimeout(() => {
        setOpenEditModal(false);
        setUpdateClientsList(true);
      }, 2000);

    } catch (error) {
      setRequestError(error.message);
    } finally {
      setLoading(false);
    }
  };

  function handleAlertClose() {
    setRequestError('');
  };

  function handleEditClient() {
    setRequestError('');

    setZipCode('');

    setOpenEditModal(false);

    setResetModal(true);
  }

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
  }

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#DA0175'
      }
    }
  });

  return (
    <Modal
      open={openEditModal}
      onClose={handleEditClient}
      className={styles.modal__wrapper}
    >
      <ThemeProvider theme={theme}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <img src={closeIcon} alt='' onClick={handleEditClient} />
          <div className={styles.input__wrapper}>
            <label>
              <h4>Nome</h4>
              <TextField
                {...register('clientName', { required: true })}
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant='outlined'
                color='secondary'
                error={!!errors.clientName}
              />
              {!!errors.clientName && <p>O campo Nome é obrigatório!</p>}
            </label>

            <label>
              <h4>E-mail</h4>
              <TextField
                {...register('clientEmail', { required: true })}
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color='secondary'
                placeholder='exemplo@email.com'
                variant='outlined'
                error={!!errors.clientEmail}
              />
              {!!errors.clientEmail && <p>O campo E-mail é obrigatório!</p>}
            </label>
          </div>

          <div className={styles.input__wrapper}>
            <label>
              <h4>CPF</h4>
              <TextField
                {...register('clientTaxId',
                  { required: true, minLength: 14, maxLength: 14, pattern: /^[0-9.-]+$/i })
                }
                value={taxId}
                onChange={(e) => formatTaxId(e.target.value)}
                color='secondary'
                inputProps={{ maxLength: 14 }}
                placeholder='000.000.000-00'
                variant='outlined'
                error={!!errors.clientTaxId}
              />
              {errors.clientTaxId?.type === 'required' && <p>O campo CPF é obrigatório!</p>}
              {(errors.clientTaxId?.type === 'minLength' || errors.clientTaxId?.type === 'maxLength')
                && <p>O CPF deve conter 11 caracteres</p>
              }
              {errors.clientTaxId?.type === 'pattern' && <p>O CPF deve conter apenas números</p>}
            </label>

            <label>
              <h4>Telefone</h4>
              <TextField
                {...register('clientPhone',
                  { required: true, minLength: 13, maxLength: 14, pattern: /^[0-9()-]+$/i })
                }
                value={phone}
                onChange={(e) => formatPhone(e.target.value)}
                color='secondary'
                inputProps={{ maxLength: 14 }}
                placeholder='(71)9999-9999'
                variant='outlined'
                error={!!errors.clientPhone}
              />
              {errors.clientPhone?.type === 'required' && <p>O campo Telefone é obrigatório!</p>}
              {(errors.clientPhone?.type === 'minLength' || errors.clientPhone?.type === 'maxLength')
                && <p>O telefone deve conter entre 10 a 11 caracteres</p>
              }
              {errors.clientPhone?.type === 'pattern' && <p>O telefone deve conter apenas números</p>}
            </label>
          </div>

          <div className={styles.input__wrapper}>
            <label>
              {(errors.zipCode || zipCodeError) ? <h4 className={styles.input__error}>CEP</h4> : <h4>CEP</h4>}
              <TextField
                {...register('zipCode',
                  { minLength: 8, maxLength: 8, pattern: /^[0-9]+$/i })
                }
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                inputProps={{ maxLength: 8 }}
                color='secondary'
                id='zip_code'
                variant='outlined'
                error={errors.zip_code || zipCodeError}
              />
              {zipCodeError && <p>{zipCodeError}</p>}
              {(errors.zipCode?.type === 'minLength' || errors.zipCode?.type === 'maxLength')
                && <p>O CEP deve conter 8 caracteres</p>
              }
              {errors.zipCode?.type === 'pattern' && <p>O CEP deve conter apenas números</p>}
            </label>

            <label>
              <h4>Logradouro</h4>
              <TextField
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                color='secondary'
                variant='outlined'
              />
            </label>
          </div>

          <div className={styles.input__wrapper}>
            <label>
              <h4>Número</h4>
              <TextField
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                color='secondary'
                variant='outlined'
              />
            </label>

            <label>
              <h4>Complemento</h4>
              <TextField
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                color='secondary'
                variant='outlined'
              />
            </label>
          </div>

          <div className={styles.input__wrapper}>
            <label>
              <h4>Bairro</h4>
              <TextField
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                color='secondary'
                variant='outlined'
              />
            </label>

            <label>
              <h4>Ponto de referência</h4>
              <TextField
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                color='secondary'
                variant='outlined'
              />
            </label>
          </div>

          <div className={styles.input__wrapper}>
            <label>
              <h4>Cidade</h4>
              <TextField
                value={city}
                onChange={(e) => setCity(e.target.value)}
                color='secondary'
                variant='outlined'
              />
            </label>

            <label>
              {errors.state ? <h4 className={styles.input__error}>Estado</h4> : <h4>Estado</h4>}
              <TextField
                value={state}
                onChange={(e) => setState(e.target.value)}
                color='secondary'
                inputProps={{ maxLength: 2 }}
                variant='outlined'
                error={errors.state}
              />
              {(errors.state?.type === 'minLength' || errors.state?.type === 'maxLength')
                && <p>O Estado deve conter 2 caracteres</p>
              }
              {errors.state?.type === 'pattern' && <p>O CEP deve conter apenas números</p>}
            </label>
          </div>

          <Snackbar
            className={styles.snackbar}
            open={!!requestError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={3000}
            onClose={handleAlertClose}
          >
            <Alert severity={requestError === 'Cadastro do cliente atualizado com sucesso.' ? 'success' : 'error'}>
              {requestError}
            </Alert>
          </Snackbar>

          <div className={styles.button__wrapper}>
            <Button
              className={`${styles.button__states} ${styles.button__cancel}`}
              onClick={handleEditClient}
            >
              Cancelar
            </Button>
            <Button
              className={styles.button__states}
              type='submit'
              disabled={!name || !email || !taxId || !phone}
              variant='contained'
            >
              Editar Cliente
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
    </Modal>
  );
};

export default ModalEditClient;