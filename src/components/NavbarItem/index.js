function NavbarItem({ image, title, onClick, className }) {
  return (
    <button onClick={onClick && onClick} className={className && className}>
      <img src={image} alt='' />
      <p>{title}</p>
    </button>
  );
};

export default NavbarItem;