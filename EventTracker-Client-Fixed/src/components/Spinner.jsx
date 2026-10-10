function Spinner({ text = "Loading..." }) {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}

export default Spinner;
