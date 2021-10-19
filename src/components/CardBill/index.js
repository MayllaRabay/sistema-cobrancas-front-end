import { useState } from 'react';
import ModalEditBill from '../ModalEditBill';
import styles from './styles.module.scss';

function CardBill({ bill, listClients }) {
  const [openEditModal, setOpenEditModal] = useState(false);

  function formatDate(date) {
    return `${date.substr(8, 2)}/${date.substr(5, 2)}/${date.substr(0, 4)}`;
  };

  function handleOpenModal() {
    setOpenEditModal(true);
  };

  return (
    <>
      <div className={styles.card__wrapper} onClick={handleOpenModal}>
        <div className={styles.info__id}>
          {`#${bill.id}`}
        </div>
        <div className={styles.info__name}>
          {bill.name}
        </div>
        <div className={styles.info__description}>
          {bill.description}
        </div>
        <div>
          {Number((bill.value / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
        <div className={
          (bill.status === 'VENCIDO' && styles.text__red)
          || (bill.status === 'PAGO' && styles.text__green)
          || (bill.status === 'PENDENTE' && styles.text__blue)
        }>
          {bill.status}
        </div>
        <div>
          {formatDate(bill.due_date)}
        </div>
      </div>
      <ModalEditBill
        bill={bill}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        listClients={listClients}
      />
    </>
  );
};

export default CardBill;