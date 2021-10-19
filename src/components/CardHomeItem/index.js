import styles from './styles.module.scss';

function CardHomeItem({ className, onClick, title, id, number }) {
  return (
    <div id={id} className={`${styles.item} ${className}`} onClick={onClick}>
      <p id={id}>{title}</p>
      <div id={id}>{number}</div>
    </div>
  );
};

export default CardHomeItem;