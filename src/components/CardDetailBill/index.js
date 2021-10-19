import styles from './styles.module.scss';

function CardDetailBill({ bill }) {
  function formatDate(date) {
    return `${date.substr(8, 2)}/${date.substr(5, 2)}/${date.substr(0, 4)}`;
  };

  return (
    <div className={styles.content__wrapper}>
      <div className={styles.inline__info}>
        <div>
          <div className={styles.info__id}>
            {`#${bill.id}`}
          </div>
          <div className={styles.info__description}>
            {bill.description}
          </div>
        </div>
        <div className={styles.info__value}>
          {Number((bill.value / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
      <div className={styles.inline__info}>
        <div>
          {formatDate(bill.due_date)}
        </div>
        <div className={(bill.status === 'VENCIDO' && styles.text__red)
          || (bill.status === 'PAGO' && styles.text__green)
          || (bill.status === 'PENDENTE' && styles.text__blue)
        }>
          {bill.status}
        </div>
      </div>
    </div>
  );
};

export default CardDetailBill;