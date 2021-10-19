import { Modal } from '@mui/material';
import closeIcon from '../../assets/close-icon.svg';
import emailIcon from '../../assets/email-icon.svg';
import phoneIcon from '../../assets/phone-icon.svg';
import CardDetailBill from '../CardDetailBill';
import styles from './styles.module.scss';

const ModalDetailsClient = ({ client, openDetailsModal, setOpenDetailsModal }) => {
  function formatPhone(phone) {
    return `(${phone.substr(0, 2)})${phone.substr(2, 5)}-${phone.substr(7)}`;
  };

  function formatTaxId(taxId) {
    return `${taxId.substr(0, 3)}.${taxId.substr(3, 3)}.${taxId.substr(6, 3)}-${taxId.substr(9)}`;
  };

  function formatZipCode(zipCode) {
    return `${zipCode.substr(0, 5)}-${zipCode.substr(5)}`;
  };

  function handleDetailsClient() {
    setOpenDetailsModal(false);
  };

  const formatClient = {
    name: client.name,
    tax_id: formatTaxId(client.tax_id),
    email: client.email,
    phone: formatPhone(client.phone),
    zip_code: client.zip_code ? formatZipCode(client.zip_code) : 'Não informado',
    street: client.street ? client.street : 'Não informado',
    number: client.number ? client.number : 'Não informado',
    address_details: client.address_details ? client.address_details : 'Não informado',
    reference: client.reference ? client.reference : 'Não informado',
    district: client.district ? client.district : 'Não informado',
    city: client.city ? client.city : 'Não informado',
    state: client.state ? client.state : 'Não informado'
  };

  const billings = client.billingList;

  return (
    <Modal
      open={openDetailsModal}
      onClose={handleDetailsClient}
      className={styles.modal__wrapper}
    >
      <div className={styles.content__wrapper}>
        <img src={closeIcon} alt='' onClick={handleDetailsClient} />
        <div className={styles.modal__title}>
          <div className={styles.info__name}>
            {formatClient.name}
          </div>
          <div>{formatClient.tax_id}</div>
        </div>
        <div className={styles.modal__content}>
          <div className={styles.modal__info__client}>
            <div className={styles.main__info__client}>
              <div className={styles.info__email}>
                <img src={emailIcon} alt='' />
                <div>{formatClient.email}</div>
              </div>
              <div>
                <img src={phoneIcon} alt='' />
                <div>{formatClient.phone}</div>
              </div>
            </div>
            <div className={styles.address__info}>
              <div className={styles.inline__info}>
                <div className={styles.block__info}>
                  <h4>CEP</h4>
                  <p>{formatClient.zip_code}</p>
                </div>
                <div className={styles.block__info}>
                  <h4>Bairro</h4>
                  <p>{formatClient.district}</p>
                </div>
                <div className={styles.block__info}>
                  <h4>Cidade/Estado</h4>
                  <p>{(formatClient.city === 'Não informado') && (formatClient.city === 'Não informado')
                    ? 'Não informado'
                    : `${formatClient.city}/${formatClient.state}`}
                  </p>
                </div>
              </div>
              <div className={styles.inline__info}>
                <div className={styles.block__info}>
                  <h4>Logradouro</h4>
                  <p>{formatClient.street}</p>
                </div>
                <div className={styles.block__info}>
                  <h4>Número</h4>
                  <p>{formatClient.number}</p>
                </div>
              </div>
              <div className={styles.inline__info}>
                <div className={styles.block__info}>
                  <h4>Complemento</h4>
                  <p>{formatClient.address_details}</p>
                </div>
                <div className={styles.block__info}>
                  <h4>Ponto de Referência</h4>
                  <p>{formatClient.reference}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.modal__info__billing}>
            {billings.length === 0
              ? <div className={styles.no__bills}>Não há cobranças cadastradas.</div>
              : billings.map((bill) => <CardDetailBill key={bill.id} bill={bill} />)}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDetailsClient;